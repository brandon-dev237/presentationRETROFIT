// ============================================================
// MODÈLE UTILISATEUR
// Ce fichier décrit à quoi ressemble un utilisateur dans la base de données.
// Quand quelqu'un crée un compte, ses informations sont sauvegardées
// selon ce modèle — comme une carte de membre.
// ============================================================

// On importe mongoose pour créer notre modèle
import mongoose from "mongoose";

// Le schéma définit les informations que chaque utilisateur doit avoir
const userSchema = new mongoose.Schema({

    // Le prénom ou pseudo de l'utilisateur — obligatoire
    name: {type: String, required: true},

    // L'adresse email — obligatoire et unique (deux personnes ne peuvent pas
    // avoir le même email, comme pour un vrai compte en ligne)
    email: {type: String, required: true, unique: true},

    // Le mot de passe — obligatoire
    // (il sera chiffré avant d'être sauvegardé, donc personne ne peut le lire)
    password: {type: String, required: true},

    // Le panier de l'utilisateur stocké en base de données
    // C'est un objet (Object) qui contient les produits et leurs quantités
    // Par défaut, le panier est vide {}
    CartItems: {type: Object, default: {}},  // ✅ Object avec majuscule

// minimize: false est important pour que MongoDB sauvegarde même les objets vides {}
// Sans ça, un panier vide pourrait ne pas être sauvegardé
}, {minimize: false})

// On crée le modèle User à partir du schéma
// Si le modèle existe déjà, on le réutilise
const User = mongoose.models.user || mongoose.model('user', userSchema)

// On exporte le modèle pour l'utiliser dans les contrôleurs
export default User
