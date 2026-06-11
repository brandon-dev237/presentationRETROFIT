// ============================================================
// CONNEXION À LA BASE DE DONNÉES
// La base de données c'est comme un grand cahier où on écrit
// toutes les informations : les produits, les utilisateurs, etc.
// Ce fichier permet à notre serveur d'ouvrir ce cahier.
// ============================================================

// On importe mongoose — c'est l'outil qui parle avec MongoDB (notre base de données)
import mongoose from "mongoose"

// Cette fonction essaie de se connecter à la base de données
// "async" veut dire qu'on attend que la connexion soit faite avant de continuer
const connectDB = async () =>{
   try {
     // Quand la connexion réussit, on affiche un message pour le dire
     mongoose.connection.on('connected',()=> console.log("connecter a la base de donnees ")
    );

    // On se connecte à MongoDB en utilisant l'adresse secrète stockée dans .env
    // "/retrofit" c'est le nom de notre base de données
    await mongoose.connect(`${process.env.MONGODB_URI}/retrofit`)
   } catch (error) {
      // Si quelque chose ne va pas, on affiche l'erreur dans la console
      console.error (error.message);
   }

}

// On exporte cette fonction pour pouvoir l'utiliser dans server.js
export default connectDB;
