// ============================================================
// ROUTES DES PRODUITS
// Ce fichier définit les chemins (URLs) liés aux produits.
// C'est comme un panneau de signalisation : chaque URL mène
// à une fonction spécifique dans le contrôleur des produits.
// ============================================================

// On importe express pour créer un routeur
import express from 'express';

// On importe multer configuré pour recevoir les images
import { upload } from '../configs/multer.js';

// On importe le middleware qui vérifie que c'est bien le vendeur connecté
import authSeller from '../middlewares/authSeller.js';

// On importe les 4 fonctions du contrôleur produits
import { addProduct, changeStock, productById, productList } from '../controllers/productControler.js';

// On crée un routeur — c'est un mini-serveur dédié aux routes produits
const productRouter = express.Router();

// POST /api/product/add — Ajouter un nouveau produit au magasin
// Étapes : 1) upload.array('images') intercepte et garde les images en mémoire
//          2) authSeller vérifie que c'est bien le vendeur autorisé
//          3) addProduct enregistre le produit et ses images dans la base de données
productRouter.post('/add', upload.array('images'), authSeller, addProduct);

// GET /api/product/list — Obtenir la liste de tous les produits
// Accessible par tout le monde, pas besoin d'être connecté
productRouter.get('/list', productList )

// POST /api/product/id — Obtenir les détails d'un produit spécifique
// On envoie l'identifiant (id) du produit et on reçoit toutes ses informations
productRouter.post('/id', productById )

// POST /api/product/stock — Modifier le statut de stock d'un produit
// Seul le vendeur authentifié peut marquer un produit "en stock" ou "épuisé"
productRouter.post('/stock', authSeller, changeStock )

// On exporte le routeur pour l'utiliser dans server.js
export default productRouter;
