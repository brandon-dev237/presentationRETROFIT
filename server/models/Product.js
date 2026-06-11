// ============================================================
// MODÈLE PRODUIT
// Ce fichier décrit à quoi ressemble un produit dans notre base de données.
// C'est comme une fiche d'identité : chaque produit doit avoir
// un nom, une description, un prix, des photos, etc.
// ============================================================

// On importe mongoose pour créer notre modèle
import mongoose from "mongoose";

// On définit le "schéma" — c'est le formulaire que chaque produit doit remplir
const ProductSchema = new mongoose.Schema({

    // Le nom du produit — obligatoire (required: true)
    name: {type: String, required: true},

    // La description du produit — obligatoire
    description : {type: String, required: true},

    // Le prix original du produit (avant réduction) — obligatoire, c'est un nombre
    price : {type: Number, required: true},

    // Le prix avec réduction — obligatoire, c'est un nombre
    offerPrice : {type: Number, required: true},

    // Les images du produit — c'est un tableau (liste) d'URLs — obligatoire
    image : {type: Array, required: true},

    // La catégorie du produit (ex: "doudoune", "jogging") — obligatoire
    category : {type: Array, required: true},

    // Est-ce que le produit est en stock ?
    // Par défaut c'est true (oui, en stock)
    inStock: {type: Boolean, default: true},  //

// timestamps: true ajoute automatiquement "createdAt" et "updatedAt"
// (la date de création et la date de dernière modification)
}, {timestamps: true })

// On crée le modèle Product à partir du schéma
// Si le modèle existe déjà, on le réutilise (pour éviter les doublons)
const Product = mongoose.models.Product || mongoose.model('product', ProductSchema)

// On exporte le modèle pour l'utiliser dans les contrôleurs
export default Product
