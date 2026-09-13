// ============================================================
// CONTRÔLEUR DES COMMANDES
// Ce fichier gère tout ce qui concerne les commandes :
// passer une commande (en espèces ou en ligne via Stripe),
// consulter ses commandes, et confirmer le paiement Stripe.
// ============================================================

// On importe mongoose pour vérifier qu'un _id est valide avant de le chercher
import mongoose from "mongoose";

// On importe le modèle de commande pour la base de données
import order from "../models/Order.js";

// On importe le modèle de produit pour calculer les prix
import product from "../models/Product.js";

// On importe Stripe — c'est la plateforme de paiement en ligne
import Stripe from "stripe";

// On initialise Stripe avec notre clé secrète
// Cette clé permet d'accéder à notre compte Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Cherche un produit par son _id, sans planter si l'_id est mal formé
// (ex: reliquat d'un panier avec un produit de démo) ou si le produit
// a été supprimé depuis — renvoie null dans les deux cas.
const findProductSafe = (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return product.findById(id);
}


// ---- COMMANDE EN ESPÈCES (COD) : accessible via POST /api/order/cod ----
// COD = Cash On Delivery = paiement à la livraison
// L'utilisateur reçoit d'abord les produits, puis paie le livreur
export const placeOrderCOD = async (req, res)=>{
    try {
        // On récupère l'identifiant utilisateur (injecté par authUser),
        // la liste des articles commandés, et l'adresse de livraison
        const {items, address} = req.body;
        const userId = req.userId;

        // On vérifie que l'adresse et les articles sont bien présents
        if(!address || items.length === 0){
            return res.json({success: false, message:'Invalid data'})
        }

        // On calcule le montant total en cherchant le prix de chaque produit
        // reduce() parcourt chaque article et additionne les prix
        let amount = await items.reduce(async (acc, item)=>{
            // On cherche le produit dans la base de données pour avoir son prix réel
            const prod = await findProductSafe(item.product);

            // Le produit peut ne plus exister (supprimé, ou _id invalide venu d'un
            // panier obsolète) — on l'ignore plutôt que de planter toute la commande
            if (!prod) return await acc;

            // On accumule le prix de l'article (prix * quantité)
            return (await acc) + prod.offerPrice * item.quantity;

        }, 0)

        // On ajoute la taxe de 2% au montant total (arrondie au centime, comme côté frontend)
        amount += Math.floor(amount * 0.02 * 100) / 100;

        // On crée la commande dans la base de données
        await order.create({
            userId,           // qui a commandé
            items,            // quoi (liste des produits)
            amount,           // combien (montant total avec taxe)
            address,          // où livrer
            paymentType: "COD" // comment payer (à la livraison)
        });

        // On confirme que la commande a été passée avec succès
        return res.json({success: true, message:'Order Placed Successfully'})

    } catch (error) {
        return res.json({success:false, message: error.message});
    }
}

// ---- VOIR SES COMMANDES : accessible via GET /api/order/user ----
// Cette fonction renvoie toutes les commandes d'un utilisateur
export const getUserOrders = async (req, res)=> {
    try {
        // On récupère l'identifiant de l'utilisateur
        const userId = req.userId;

        // On cherche toutes les commandes de cet utilisateur
        // On filtre : seulement les commandes COD OU les commandes payées en ligne
        // populate() remplace les IDs par les vraies données (nom du produit, adresse complète)
        // sort({createdAt: -1}) trie du plus récent au plus ancien
        const orders = await order.find({
            userId,
            $or: [{paymentType:'COD' },{isPaid: true}]
        }).populate('items.product address').sort({createdAt: -1});

        // On renvoie la liste des commandes
        res.json({success: true, orders});

    } catch (error) {
        res.json({success:false, message: error.message});
    }
}

// ---- COMMANDE EN LIGNE STRIPE : accessible via POST /api/order/stripe ----
// Cette fonction crée une commande et redirige vers la page de paiement Stripe
export const placeOrderStripe = async (req, res) => {
    try {
        // On récupère les mêmes informations que pour la commande COD
        const { items, address } = req.body;
        const userId = req.userId;

        // Vérification des données
        if (!address || items.length === 0) {
            return res.json({ success: false, message: 'Invalid data' });
        }

        // On calcule le montant total avec les prix réels des produits
        let amount = await items.reduce(async (acc, item) => {
            const prod = await findProductSafe(item.product);
            if (!prod) return await acc;
            return (await acc) + prod.offerPrice * item.quantity;
        }, 0);

        // On ajoute la taxe de 2% (arrondie au centime, comme côté frontend)
        amount += Math.floor(amount * 0.02 * 100) / 100;

        // On crée la commande dans la base de données (non payée pour l'instant)
        const newOrder = await order.create({
            userId, items, amount, address, paymentType: "Online"
        });

        // On prépare la liste des articles pour la page Stripe
        // Stripe a besoin de connaître le nom et le prix de chaque article
        // On ignore les produits introuvables (filter Boolean) plutôt que de planter
        const line_items = (await Promise.all(items.map(async (item) => {
            const prod = await findProductSafe(item.product);
            if (!prod) return null;
            return {
                price_data: {
                    currency: 'eur',
                    product_data: { name: prod.name }, // nom du produit affiché sur Stripe
                    unit_amount: Math.round(prod.offerPrice * 1.02 * 100), // prix avec taxe, en centimes
                },
                quantity: item.quantity, // quantité commandée
            };
        }))).filter(Boolean);

        // On crée une session de paiement sur Stripe
        // success_url = page vers laquelle Stripe redirige après paiement réussi
        // cancel_url = page vers laquelle Stripe redirige si on annule
        const session = await stripe.checkout.sessions.create({
            line_items,
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/loader?next=orders`,
            cancel_url: `${process.env.FRONTEND_URL}/cart`,
            metadata: { orderId: newOrder._id.toString(), userId }, // infos pour le webhook
        });

        // On renvoie l'URL de la page de paiement Stripe
        return res.json({ success: true, url: session.url });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

// ---- WEBHOOK STRIPE : accessible via POST /api/order/stripe/webhook ----
// Stripe appelle cette URL automatiquement après un paiement réussi
// C'est comme un facteur qui apporte une lettre de confirmation
export const stripeWebhook = async (req, res) => {
    // On récupère la signature Stripe pour vérifier que c'est bien Stripe qui envoie
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        // On vérifie l'authenticité de la notification Stripe
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (error) {
        // Si la signature est invalide, on refuse
        return res.status(400).send(`Webhook Error: ${error.message}`);
    }

    // Si l'événement est "paiement de session terminé" = paiement réussi
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;

        // On récupère l'identifiant de la commande stocké dans les métadonnées
        const { orderId } = session.metadata;

        // On met à jour la commande en indiquant qu'elle a été payée
        await order.findByIdAndUpdate(orderId, { isPaid: true });
    }

    // On confirme à Stripe que le webhook a bien été reçu
    res.json({ received: true });
};

// ---- VOIR TOUTES LES COMMANDES (VENDEUR) : accessible via GET /api/order/seller ----
// Cette fonction renvoie TOUTES les commandes (pour le tableau de bord vendeur)
export const getAllOrders = async (req, res)=> {
    try {
        // On cherche toutes les commandes COD ou payées en ligne
        // populate() remplace les IDs par les vraies données des produits et adresses
        // sort() trie du plus récent au plus ancien
        const orders = await order.find({
            $or: [{paymentType:'COD' },{isPaid: true}]
        }).populate('items.product address').sort({createdAt: -1});

        // On renvoie toutes les commandes au vendeur
        res.json({success: true, orders});

    } catch (error) {
        res.json({success:false, message: error.message});
    }
}
