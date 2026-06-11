// ============================================================
// VÉRIFICATION D'IDENTITÉ DU VENDEUR
// Ce fichier est comme un verrou sur la porte du bureau du directeur.
// Seul le vendeur (administrateur) peut accéder aux fonctions
// d'ajout de produits, de gestion du stock, etc.
// ============================================================

// On importe jsonwebtoken pour lire et vérifier les jetons d'authentification
import jwt from 'jsonwebtoken';

// Ce middleware vérifie si la personne est bien le vendeur autorisé
const authSeller = async (req, res, next) =>{

    // On cherche le cookie spécial du vendeur dans la requête
    // Ce cookie "sellerToken" est créé lors de la connexion vendeur
    const {sellerToken} = req.cookies;

    // Si le cookie vendeur n'existe pas, la personne n'est pas connectée en tant que vendeur
    // On lui refuse l'accès
    if(!sellerToken) {
        return res.json({ success:false , message: 'Not Authorized'});
    }

    try {

        // On décode le jeton vendeur avec notre clé secrète
        const tokenDecode = jwt.verify(sellerToken, process.env.JWT_SECRET)

        // On vérifie que l'email dans le jeton correspond bien à l'email du vendeur
        // L'email du vendeur autorisé est stocké dans les variables d'environnement (.env)
        if(tokenDecode.email === process.env.SELLER_EMAIL){
            // C'est bien le vendeur autorisé ! On passe à la suite
            next();
        }else{
            // L'email ne correspond pas — c'est quelqu'un d'autre, on refuse
            return res.status(401).json ({ success: false , message: 'Not Authorized'});
        }

    } catch (error) {
        // Si le jeton est invalide ou expiré, on renvoie l'erreur
        res.json({success: false, message: error.message});

    }
}

// On exporte ce middleware pour l'utiliser dans les routes vendeur
export default authSeller;
