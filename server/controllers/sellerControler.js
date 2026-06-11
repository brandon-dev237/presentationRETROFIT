// ============================================================
// CONTRÔLEUR DU VENDEUR
// Ce fichier gère la connexion et la déconnexion du vendeur (admin).
// Contrairement aux utilisateurs normaux, il n'y a qu'un seul vendeur
// dont les identifiants sont stockés dans les variables d'environnement (.env).
// ============================================================

// On importe jsonwebtoken pour créer les jetons d'authentification
import jwt from 'jsonwebtoken'

// ---- CONNEXION DU VENDEUR : accessible via POST /api/seller/login ----
// Cette fonction vérifie les identifiants du vendeur et le connecte
export const sellerLogin = async (req, res) =>{
    try {

        // On récupère l'email et le mot de passe envoyés par le formulaire
        const {email, password} = req.body;

        // On compare l'email ET le mot de passe avec ceux stockés dans .env
        // Il n'y a pas de hachage ici car le mot de passe vendeur est stocké en clair dans .env
        if(password === process.env.SELLER_PASSWORD && email === process.env.SELLER_EMAIL){

            // Identifiants corrects ! On crée un jeton JWT contenant l'email du vendeur
            // Ce jeton expire dans 7 jours
            const token = jwt.sign({email}, process.env.JWT_SECRET, {expiresIn: '7d'});

            // On envoie le jeton vendeur dans un cookie spécial appelé "sellerToken"
            // Ce cookie est différent du cookie utilisateur pour ne pas confondre les deux
            res.cookie ('sellerToken',token,{
                httpOnly:true,            // JavaScript ne peut pas lire ce cookie
                secure: process.env.NODE_ENV === 'production', // HTTPS seulement en production
                sameSite: process.env.NODE_ENV === 'production'?'none' : 'strict', // protection CSRF
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours en millisecondes
            });

            // On confirme la connexion réussie
            return res.json({ success: true, message: "logged In" });

        } else {
            // Les identifiants ne correspondent pas — on refuse la connexion
            return res.json({ success: false, message: 'Invalid Credentials' })
        }

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// ---- VÉRIFIER LA CONNEXION VENDEUR : accessible via GET /api/seller/is-auth ----
// Cette fonction vérifie si le vendeur est toujours connecté
// Elle est appelée au chargement de l'application pour restaurer la session vendeur
// Le middleware authSeller a déjà vérifié le jeton avant d'arriver ici
export const isSellerAuth= async (req,res)=> {
    try {
        // Si on arrive ici, le middleware authSeller a déjà validé le jeton
        // On répond simplement que l'authentification est valide
        return res.json ({success:true})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}


// ---- DÉCONNEXION DU VENDEUR : accessible via GET /api/seller/logout ----
// Cette fonction déconnecte le vendeur en supprimant son cookie
export const sellerLogout = (req,res)=>{
    try {
        // On supprime le cookie "sellerToken" du navigateur
        // Le vendeur ne sera plus reconnu comme connecté
        res.clearCookie('sellerToken',{
            httpOnly:true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        });

        // On confirme la déconnexion
        return res.json({success:true, message:'Logged Out'})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}
