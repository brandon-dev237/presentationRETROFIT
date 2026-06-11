// ============================================================
// VÉRIFICATION D'IDENTITÉ DE L'UTILISATEUR
// Ce fichier est comme un videur à l'entrée d'une boîte de nuit.
// Avant qu'un utilisateur puisse faire quelque chose (commander,
// voir ses commandes...), on vérifie qu'il est bien connecté.
// ============================================================

// On importe jsonwebtoken — c'est l'outil qui lit les "jetons" (tokens)
// Un jeton est comme un bracelet de concert : si tu l'as, tu peux entrer
import jwt from 'jsonwebtoken'

// Cette fonction est un "middleware" — elle s'exécute AVANT la vraie fonction
// Elle reçoit la requête (req), la réponse (res), et next pour passer à la suite
const authUser = async (req,res, next)=>{

    // On cherche le jeton dans les cookies du navigateur
    // Le cookie s'appelle "token" — c'est mis là lors de la connexion
    const {token} = req.cookies;

    // Si le jeton n'existe pas, l'utilisateur n'est pas connecté
    // On refuse l'accès en renvoyant une erreur 401 (Non autorisé)
    if(!token){
        return res.status(401).json ({ success: false , message: 'Not Authorized'});
    }

    try {

        // On décode le jeton avec notre clé secrète (JWT_SECRET)
        // jwt.verify lit le jeton et vérifie qu'il n'a pas été falsifié
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET)

        // Si le jeton contient bien un identifiant utilisateur (id)
        if(tokenDecode.id){
            // On ajoute l'identifiant de l'utilisateur dans la requête
            // Ainsi, les fonctions suivantes savent qui fait la demande
            req.body.userId = tokenDecode.id;
        }else{
            // Le jeton est valide mais ne contient pas d'ID — c'est suspect
            return res.status(401).json ({ success: false , message: 'Not Authorized'});
        }

        // Tout est bon ! On passe à la prochaine étape (la vraie fonction)
        next();

    } catch (error) {
        // Si le jeton est expiré, falsifié ou invalide — on renvoie une erreur
        res.json({success: false, message: error.message});

    }

}

// On exporte ce middleware pour l'utiliser dans les routes
export default authUser;
