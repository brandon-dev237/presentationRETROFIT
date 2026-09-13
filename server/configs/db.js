// ============================================================
// CONNEXION À LA BASE DE DONNÉES
// La base de données c'est comme un grand cahier où on écrit
// toutes les informations : les produits, les utilisateurs, etc.
// Ce fichier permet à notre serveur d'ouvrir ce cahier.
// ============================================================

// On importe mongoose — c'est l'outil qui parle avec MongoDB (notre base de données)
import mongoose from "mongoose"
import dns from "dns"

// Certains réseaux (ex: WiFi de résidence/campus) bloquent les requêtes DNS SRV
// que Node utilise pour résoudre les URI "mongodb+srv://". On force des DNS publics
// pour éviter l'erreur "querySrv ECONNREFUSED".
dns.setServers(["8.8.8.8", "1.1.1.1"])

// Cette fonction essaie de se connecter à la base de données
// "async" veut dire qu'on attend que la connexion soit faite avant de continuer
const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () =>
            console.log('Connecté à la base de données')
        );

        await mongoose.connect(`${process.env.MONGODB_URI}/retrofit`);
    } catch (error) {
        console.error('Erreur MongoDB :', error.message);
        process.exit(1);
    }
};

export default connectDB;
