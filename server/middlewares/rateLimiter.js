// ============================================================
// LIMITEUR DE DÉBIT (RATE LIMITING)
// Empêche les tentatives de connexion répétées (brute-force) en
// limitant le nombre de requêtes autorisées par IP sur une fenêtre de temps.
// Implémentation en mémoire — suffisant pour un serveur à une seule instance.
// ============================================================

// Fabrique un middleware de limitation configurable
// windowMs : durée de la fenêtre glissante (en millisecondes)
// max      : nombre maximum de requêtes autorisées dans cette fenêtre
const createRateLimiter = ({ windowMs = 15 * 60 * 1000, max = 10 } = {}) => {
    // On mémorise, pour chaque IP, le nombre de tentatives et le début de la fenêtre
    const attempts = new Map();

    return (req, res, next) => {
        const key = req.ip;
        const now = Date.now();
        const entry = attempts.get(key);

        // Pas d'entrée existante ou fenêtre expirée → on repart à zéro
        if (!entry || now - entry.firstAttempt > windowMs) {
            attempts.set(key, { count: 1, firstAttempt: now });
            return next();
        }

        entry.count += 1;

        if (entry.count > max) {
            const retryAfterSec = Math.ceil((entry.firstAttempt + windowMs - now) / 1000);
            res.set('Retry-After', String(retryAfterSec));
            return res.status(429).json({
                success: false,
                message: 'Trop de tentatives. Veuillez réessayer plus tard.'
            });
        }

        next();
    };
};

export default createRateLimiter;
