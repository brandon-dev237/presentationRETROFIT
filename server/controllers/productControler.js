// ============================================================
// CONTRÔLEUR DES PRODUITS
// Ce fichier contient toutes les actions liées aux produits :
// ajouter un produit, voir la liste, voir un produit en détail,
// et changer le stock. C'est comme le gestionnaire du magasin.
// ============================================================

// On importe cloudinary pour envoyer les images sur le cloud
import {v2 as cloudinary} from "cloudinary"

// On importe le modèle Product pour interagir avec la base de données
import product from "../models/Product.js"

// ---- AJOUTER UN PRODUIT : accessible via POST /api/product/add ----
// Cette fonction permet au vendeur d'ajouter un nouveau produit dans le magasin
export const addProduct = async (req, res)=>{
    try {
        // On récupère les informations du produit envoyées dans la requête
        // Elles arrivent en JSON encodé dans le champ "productData"
        let productData = JSON.parse(req.body.productData)

        // On récupère les fichiers images envoyés avec la requête
        const images = req.files

        // Si aucune image n'a été envoyée, on refuse l'ajout
        // Un produit sans photo ne peut pas être ajouté
        if (!images || images.length === 0) {
            return res.json({ success: false, message: "Veuillez ajouter au moins une image" })
        }

        // Pour chaque image reçue, on l'envoie sur Cloudinary
        // Promise.all attend que TOUTES les images soient envoyées avant de continuer
        let imagesURL = await Promise.all(
            images.map((item) =>
              // Pour chaque image, on crée une promesse d'envoi vers Cloudinary
              new Promise((resolve, reject) => {
                // upload_stream envoie l'image depuis la mémoire (buffer) vers Cloudinary
                const stream = cloudinary.uploader.upload_stream(
                  { resource_type: 'image' }, // On précise que c'est une image
                  // Callback appelé quand l'envoi est terminé
                  (error, result) => (error ? reject(error) : resolve(result.secure_url))
                );
                // On envoie les données de l'image (buffer = contenu en mémoire)
                stream.end(item.buffer);
              })
            )
          )

        // On crée le produit dans la base de données avec toutes ses informations
        // On combine les données du formulaire et les URLs des images uploadées
        await product.create({...productData, image: imagesURL})

        // On répond que tout s'est bien passé
        res.json({success: true, message: "product Added" })

    } catch (error) {
        // En cas d'erreur, on l'affiche dans la console et on renvoie un message d'erreur
        console.log(error.message);
        res.json({success: false, message: error.message })
    }
}


// ---- LISTE DES PRODUITS : accessible via GET /api/product/list ----
// Cette fonction renvoie tous les produits du magasin
// Elle est utilisée par le site pour afficher la boutique
export const productList = async (req, res)=>{
    try {
        // On cherche tous les produits dans la base de données
        // find({}) sans filtre = on prend tout
        const products = await product.find({})

        // On renvoie la liste de tous les produits
        res.json({success: true, products})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message })
    }
}


// ---- DÉTAIL D'UN PRODUIT : accessible via POST /api/product/id ----
// Cette fonction renvoie les informations d'un seul produit
// On donne l'identifiant (id) du produit et on reçoit tous ses détails
export const productById = async (req, res)=>{
    try {
        // On récupère l'identifiant du produit demandé
        const { id } = req.body

        // On cherche le produit dans la base de données par son identifiant unique
        const productData = await product.findById(id)

        // On renvoie les données du produit trouvé
        res.json({success: true, product: productData})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message })
    }
}

// ---- CHANGER LE STOCK D'UN PRODUIT : accessible via POST /api/product/stock ----
// Cette fonction permet au vendeur de dire si un produit est en stock ou non
// (comme mettre une étiquette "épuisé" sur un article)
export const changeStock = async (req, res)=>{
    try {
        // On récupère l'identifiant du produit et la nouvelle valeur de stock
        // inStock = true signifie disponible, false signifie épuisé
        const { id, inStock } = req.body

        // On met à jour le champ inStock du produit dans la base de données
        await product.findByIdAndUpdate(id, {inStock})

        // On confirme que la mise à jour a réussi
        res.json({success: true, message:"Stock Updated"})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message })
    }
}
