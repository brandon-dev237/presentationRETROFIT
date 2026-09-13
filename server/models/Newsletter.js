// ============================================================
// MODÈLE NEWSLETTER
// Stocke les emails des visiteurs qui s'abonnent depuis le
// formulaire en bas de la page d'accueil.
// ============================================================

import mongoose from "mongoose";

const newsletterSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
}, { timestamps: true });

const Newsletter = mongoose.models.newsletter || mongoose.model('newsletter', newsletterSchema);

export default Newsletter;
