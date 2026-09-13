// ============================================================
// ROUTES NEWSLETTER
// ============================================================

import express from 'express'
import { subscribe } from '../controllers/newsletterController.js';
import createRateLimiter from '../middlewares/rateLimiter.js';

const newsletterRouter = express.Router();

// Limite raisonnable pour éviter le spam du formulaire
const subscribeLimiter = createRateLimiter({ windowMs: 15 * 60 * 1000, max: 20 });

// POST /api/newsletter/subscribe — S'abonner à la newsletter
newsletterRouter.post('/subscribe', subscribeLimiter, subscribe);

export default newsletterRouter;
