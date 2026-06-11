// ============================================================
// MODÈLE COMMANDE
// Ce fichier décrit à quoi ressemble une commande dans la base de données.
// Quand un client achète des produits, une commande est créée
// avec tous les détails : qui a commandé, quoi, combien, où livrer, etc.
// ============================================================

// On importe mongoose pour créer notre modèle
import mongoose from 'mongoose'

// Le schéma définit toutes les informations d'une commande
const orderSchema = new mongoose.Schema({

    // L'identifiant de l'utilisateur qui a passé la commande
    // C'est une référence vers le modèle "user"
    userId: {type: String, required: true, ref:'user'},

    // La liste des produits commandés
    // Chaque article a : un produit (son ID) et une quantité
    items:[{
        product:{type:String,required:true,ref:'product'}, // identifiant du produit
        quantity: {type:Number,required:true}              // nombre d'articles commandés
    }],

    // Le montant total de la commande (en euros) — obligatoire
    amount: {type:Number,required:true},

    // L'adresse de livraison — c'est l'identifiant d'une adresse sauvegardée
    address: {type:String,required:true, ref: "address"},

    // Le statut de la commande (ex: "Order Placed", "En livraison", "Livré")
    // Par défaut, une nouvelle commande a le statut "Order Placed"
    status: {type:String, default: 'Order Placed'},

    // Le mode de paiement choisi (ex: "COD" pour espèces, "Online" pour carte)
    paymentType: {type: String, required:true},

    // Est-ce que la commande a été payée ?
    // Pour le paiement en ligne, ça devient true après confirmation Stripe
    // Pour le paiement à la livraison (COD), ça reste false jusqu'à la livraison
    isPaid: {type: Boolean, required:true, default: false},

// timestamps: true ajoute la date de création et de modification automatiquement
},{timestamps: true })

// On crée le modèle Order à partir du schéma
// Si le modèle existe déjà, on le réutilise
const Order = mongoose.models.Order || mongoose.model('order',orderSchema)

// On exporte le modèle pour l'utiliser dans les contrôleurs
export default Order
