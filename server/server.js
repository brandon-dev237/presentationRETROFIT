// ============================================================
// FICHIER PRINCIPAL DU SERVEUR
// C'est ici que tout démarre ! Comme le chef d'orchestre,
// ce fichier organise tout et dit à chaque partie quoi faire.
// ============================================================

// On importe les outils dont on a besoin
// cookieParser lit les petits biscuits (cookies) envoyés par le navigateur
import cookieParser from 'cookie-parser';

// express est l'outil principal pour créer notre serveur web
import express from 'express'

// cors permet à notre site web de parler avec le serveur
// (sans ça, le navigateur refuse de les laisser communiquer)
import cors from 'cors';

// On importe la fonction qui connecte notre serveur à la base de données
import connectDB from './configs/db.js';

// dotenv lit le fichier .env qui contient nos mots de passe secrets
import 'dotenv/config';

// On importe toutes les "routes" — ce sont les chemins que le serveur connaît
// Chaque router gère un groupe de fonctionnalités
import userRouter from './routes/userRoute.js';       // chemins pour les utilisateurs
import sellerRouter from './routes/sellerRoute.js';   // chemins pour le vendeur
import connectCloudinary from './configs/cloudinary.js'; // connexion au stockage d'images
import productRouter from './routes/productRoute.js'; // chemins pour les produits
import cartRouter from './routes/cartRoute.js';       // chemins pour le panier
import addressRouter from './routes/addressRoute.js'; // chemins pour les adresses
import orderRouter from './routes/orderRoute.js';     // chemins pour les commandes
import newsletterRouter from './routes/newsletterRoute.js'; // chemins pour la newsletter

// On crée notre application serveur — c'est comme ouvrir un magasin
const app = express();

// Le port, c'est le numéro de la "porte" par laquelle on entre
// Si le fichier .env définit un port, on l'utilise, sinon on prend le 4000
const port = process.env.PORT || 4000;

// On se connecte à la base de données (là où on range toutes les informations)
await connectDB()

// On se connecte à Cloudinary (là où on range les photos des produits)
await connectCloudinary()

// Liste des adresses web autorisées à parler avec notre serveur
// (pour l'instant, seulement notre site en développement)
const allowedOrigins = [
    'http://localhost:5173',
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

// Permet de lire les cookies envoyés par le navigateur (ex: le cookie "token"
// utilisé par authUser.js pour vérifier qu'on est connecté)
app.use(cookieParser());

// Le webhook Stripe doit recevoir le body brut AVANT express.json()
// On exclut donc cette route précise du parsing JSON global : express.raw()
// (déclaré dans orderRoute.js) doit être le premier middleware à lire le body.

// Permet de lire les données envoyées en format JSON dans les requêtes
// (sauf pour le webhook Stripe, qui a besoin du corps brut non parsé)
app.use((req, res, next) => {
    if (req.originalUrl === '/api/order/stripe/webhook') {
        return next();
    }
    express.json()(req, res, next);
});

// Route de test — si on va sur "/", le serveur répond juste "API est en Marche"
app.get('/',(req,res) => res.send("API est en Marche"));

// On branche chaque groupe de routes à une adresse de départ
// Toutes les routes utilisateurs commencent par /api/user
app.use('/api/user',userRouter)

// Toutes les routes vendeur commencent par /api/seller
app.use('/api/seller',sellerRouter)

// Toutes les routes produits commencent par /api/product
app.use('/api/product', productRouter)

// Toutes les routes panier commencent par /api/cart
app.use('/api/cart', cartRouter)

// Toutes les routes adresses commencent par /api/address
app.use('/api/address', addressRouter)

// Toutes les routes commandes commencent par /api/order
app.use('/api/order', orderRouter)

// Toutes les routes newsletter commencent par /api/newsletter
app.use('/api/newsletter', newsletterRouter)

// On démarre le serveur et on l'écoute sur le port choisi
// Quand c'est prêt, on affiche un message dans la console
app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
});
