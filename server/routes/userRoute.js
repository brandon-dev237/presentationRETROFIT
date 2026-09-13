// ============================================================
// ROUTES DES UTILISATEURS
// Ce fichier définit les chemins (URLs) pour les comptes utilisateurs :
// créer un compte, se connecter, vérifier la connexion, se déconnecter.
// ============================================================

// On importe express pour créer un routeur
import express from 'express'

// On importe les 4 fonctions du contrôleur utilisateur
import { isAuth, login, register,logout } from '../controllers/userController.js';

// On importe le middleware qui vérifie l'identité de l'utilisateur
import authUser from '../middlewares/authUser.js';

// On importe le limiteur de débit pour bloquer les tentatives de brute-force
import createRateLimiter from '../middlewares/rateLimiter.js';

// On crée un routeur dédié aux routes utilisateur
const userRouter = express.Router();

// Limite : 10 tentatives par IP toutes les 15 minutes sur register/login
const authLimiter = createRateLimiter({ windowMs: 15 * 60 * 1000, max: 10 });

// POST /api/user/register — Créer un nouveau compte
// Pas besoin d'être connecté pour créer un compte
userRouter.post('/register',authLimiter,register)

// POST /api/user/login — Se connecter à son compte
// Pas besoin d'être connecté pour se connecter !
userRouter.post('/login',authLimiter,login)

// GET /api/user/is-auth — Vérifier si l'utilisateur est connecté
// authUser vérifie le cookie d'abord, puis isAuth renvoie les infos utilisateur
userRouter.get('/is-auth',authUser,isAuth)

// POST /api/user/logout — Se déconnecter
// authUser vérifie qu'on est bien connecté avant de déconnecter
userRouter.post('/logout',logout)

// On exporte le routeur pour l'utiliser dans server.js
export default userRouter
