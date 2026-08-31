// ============================================================
// CONTRÔLEUR DES ADRESSES
// Ce fichier gère les adresses de livraison des utilisateurs.
// Un utilisateur peut ajouter plusieurs adresses et en choisir
// une au moment de passer commande.
// ============================================================

// On importe le modèle Address pour interagir avec la base de données
import Address from "../models/Address.js"


// ---- AJOUTER UNE ADRESSE : accessible via POST /api/address/add ----
// Cette fonction sauvegarde une nouvelle adresse de livraison
export const addAddress = async(req, res)=>{
    try {
        // On récupère l'adresse saisie et l'identifiant de l'utilisateur
        // userId est ajouté automatiquement par le middleware authUser
        const { address } = req.body
        const userId = req.userId
        console.log('[addAddress] userId:', userId);
        console.log('[addAddress] address:', address);

        if (!userId) return res.json({success: false, message: "Non autorisé"});

        await Address.create({...address, userId})
        console.log('[addAddress] adresse sauvegardée avec succès');

        // On confirme que l'adresse a bien été ajoutée
        res.json({success: true, message: "Address added successfully"})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}

// ---- RÉCUPÉRER LES ADRESSES : accessible via GET /api/address/get ----
// Cette fonction renvoie toutes les adresses d'un utilisateur
// Pour afficher la liste d'adresses dans la page panier
export const getAddress = async(req, res)=>{
    try {
        const userId = req.userId
        console.log('[getAddress] userId:', userId);

        const addresses = await Address.find({userId})
        console.log('[getAddress] adresses trouvées:', addresses.length);

        // On renvoie la liste des adresses trouvées
        res.json({success: true, addresses})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}
