// ============================================================
// CONTRÔLEUR NEWSLETTER
// Enregistre l'email d'un visiteur qui s'abonne depuis le
// formulaire de la page d'accueil.
// ============================================================

import Newsletter from "../models/Newsletter.js";

// ---- S'ABONNER : accessible via POST /api/newsletter/subscribe ----
export const subscribe = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.json({ success: false, message: "Email requis" });
        }

        const existing = await Newsletter.findOne({ email: email.toLowerCase() });
        if (existing) {
            return res.json({ success: true, message: "Vous êtes déjà abonné !" });
        }

        await Newsletter.create({ email });
        return res.json({ success: true, message: "Merci pour votre inscription !" });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}
