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
        const { address, userId } = req.body

        // On crée l'adresse dans la base de données
        // Le spread ...address copie tous les champs de l'adresse
        // On ajoute également userId pour savoir à qui appartient cette adresse
        await Address.create({...address, userId})

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
        // On récupère l'identifiant de l'utilisateur (injecté par authUser)
        const {userId} = req.body

        // On cherche toutes les adresses qui appartiennent à cet utilisateur
        const addresses = await Address.find({userId})

        // On renvoie la liste des adresses trouvées
        res.json({success: true, addresses})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}
