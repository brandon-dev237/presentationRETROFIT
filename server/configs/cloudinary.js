// ============================================================
// CONNEXION À CLOUDINARY (STOCKAGE DES IMAGES)
// Cloudinary c'est comme un grand album photo sur internet.
// Quand le vendeur ajoute un produit, les photos sont envoyées
// et rangées là-bas. Ce fichier permet de se connecter à cet album.
// ============================================================

// On importe cloudinary — l'outil qui gère l'envoi et le stockage des images
import {v2 as cloudinary} from "cloudinary"

// Cette fonction configure la connexion à Cloudinary avec nos identifiants secrets
const connectCloudinary = async () => {
    // On donne à cloudinary les 3 informations nécessaires pour se connecter :
    // - cloud_name : le nom de notre compte
    // - api_key : notre identifiant (comme un login)
    // - api_secret : notre mot de passe secret
    // Ces valeurs sont cachées dans le fichier .env pour qu'elles restent secrètes
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key:process.env.CLOUDINARY_API_KEY,
        api_secret:process.env.CLOUDINARY_API_SECRET
    })
}

// On exporte la fonction pour pouvoir l'utiliser dans server.js
export default connectCloudinary
