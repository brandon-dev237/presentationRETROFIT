// ============================================================
// MODÈLE ADRESSE
// Ce fichier décrit à quoi ressemble une adresse de livraison.
// Quand un client ajoute une adresse à son compte, elle est
// sauvegardée selon ce modèle — comme un carnet d'adresses.
// ============================================================

// On importe mongoose pour créer notre modèle
import mongoose from "mongoose";

// Le schéma définit toutes les informations d'une adresse
const addressSchema = new mongoose.Schema({

    // L'identifiant de l'utilisateur à qui appartient cette adresse
    userId :{type:String, require: true},

    // Le prénom de la personne à livrer
    firstName :{type:String, require: true},

    // Le nom de famille de la personne à livrer
    lastName :{type:String, require: true},

    // L'adresse email de contact pour la livraison
    email :{type:String, require: true},

    // La rue et le numéro (ex: "12 Rue de la Paix")
    street :{type:String, require: true},

    // La ville (ex: "Paris")
    city :{type:String, require: true},

    // La région ou département (ex: "Île-de-France")
    state :{type:String, require: true},

    // Le code postal (ex: 75001) — c'est un nombre
    zipcode :{type:Number, require: true},

    // Le pays (ex: "France")
    country :{type:String, require: true},

    // Le numéro de téléphone pour contacter lors de la livraison
    phone :{type:String, require: true},

})

// On crée le modèle Address à partir du schéma
// Si le modèle existe déjà, on le réutilise
const Address = mongoose.models.address || mongoose.model ('address',addressSchema)

// On exporte le modèle pour l'utiliser dans les contrôleurs
export default Address
