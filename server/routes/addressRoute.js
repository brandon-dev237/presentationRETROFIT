// ============================================================
// ROUTES DES ADRESSES
// Ce fichier définit les chemins (URLs) pour la gestion des adresses.
// Un utilisateur connecté peut ajouter et consulter ses adresses.
// ============================================================

// On importe express pour créer un routeur
import express from 'express'

// On importe le middleware qui vérifie que l'utilisateur est connecté
import authUser from '../middlewares/authUser.js';

// On importe les deux fonctions du contrôleur adresses
import { addAddress, getAddress } from '../controllers/addressController.js';

// On crée un routeur dédié aux routes adresses
const addressRouter = express.Router();

// POST /api/address/add — Ajouter une nouvelle adresse de livraison
// L'utilisateur doit être connecté pour ajouter une adresse à son compte
addressRouter.post('/add',authUser, addAddress);

// GET /api/address/get — Récupérer toutes ses adresses
// L'utilisateur connecté récupère la liste de ses adresses sauvegardées
addressRouter.get('/get',authUser, getAddress);

// On exporte le routeur pour l'utiliser dans server.js
export default addressRouter;
