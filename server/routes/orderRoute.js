// ============================================================
// ROUTES DES COMMANDES
// Ce fichier définit les chemins (URLs) pour la gestion des commandes.
// Les clients peuvent passer des commandes et les voir,
// le vendeur peut voir toutes les commandes.
// ============================================================

// On importe express pour créer un routeur
import express from 'express';

// On importe le middleware de vérification utilisateur
import authUser from '../middlewares/authUser.js';

// On importe toutes les fonctions du contrôleur commandes
import { getAllOrders, getUserOrders, placeOrderCOD, placeOrderStripe, stripeWebhook } from '../controllers/orderController.js';

// On importe le middleware de vérification vendeur
import authSeller from '../middlewares/authSeller.js';

// On crée un routeur dédié aux routes commandes
const orderRouter = express.Router();

// POST /api/order/cod — Passer une commande avec paiement à la livraison
// L'utilisateur doit être connecté (authUser vérifie ça)
orderRouter.post('/cod', authUser, placeOrderCOD)

// POST /api/order/stripe — Passer une commande avec paiement en ligne Stripe
// L'utilisateur doit être connecté
orderRouter.post('/stripe', authUser, placeOrderStripe)

// POST /api/order/stripe/webhook — Confirmation automatique de paiement Stripe
// express.raw() reçoit le corps brut (non parsé) car Stripe signe ses messages
// Cette route est appelée automatiquement par Stripe, pas par l'utilisateur
orderRouter.post('/stripe/webhook', express.raw({type: 'application/json'}), stripeWebhook)

// GET /api/order/user — Voir ses propres commandes
// L'utilisateur connecté voit seulement ses commandes
orderRouter.get('/user', authUser, getUserOrders)

// GET /api/order/seller — Voir TOUTES les commandes (tableau de bord vendeur)
// Seul le vendeur authentifié peut voir toutes les commandes
orderRouter.get('/seller', authSeller, getAllOrders)

// On exporte le routeur pour l'utiliser dans server.js
export default orderRouter;
