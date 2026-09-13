// ============================================================
// ROUTES DU VENDEUR
// Ce fichier définit les chemins (URLs) pour la gestion du compte vendeur.
// Seul l'administrateur du site peut accéder à ces routes.
// ============================================================

// On importe express pour créer un routeur
import express from 'express'

// On importe les fonctions du contrôleur vendeur
import { isSellerAuth, sellerLogin, sellerLogout } from '../controllers/sellerControler.js';

// On importe le middleware de vérification vendeur
import authSeller from '../middlewares/authSeller.js';

// On importe le limiteur de débit pour bloquer les tentatives de brute-force
import createRateLimiter from '../middlewares/rateLimiter.js';

// On crée un routeur dédié aux routes vendeur
const sellerRouter = express.Router();

// Limite : 10 tentatives par IP toutes les 15 minutes sur le login vendeur
const sellerLoginLimiter = createRateLimiter({ windowMs: 15 * 60 * 1000, max: 10 });

// POST /api/seller/login — Connexion du vendeur
// Pas besoin d'être déjà connecté pour se connecter !
sellerRouter.post('/login',sellerLoginLimiter,sellerLogin);

// GET /api/seller/is-auth — Vérifier si le vendeur est connecté
// authSeller vérifie d'abord le cookie, puis isSellerAuth confirme
sellerRouter.get('/is-auth',authSeller,isSellerAuth);

// GET /api/seller/logout — Déconnexion du vendeur
// Supprime le cookie vendeur du navigateur
sellerRouter.get('/logout',sellerLogout);

// On exporte le routeur pour l'utiliser dans server.js
export default sellerRouter;
