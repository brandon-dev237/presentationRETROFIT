// ============================================================
// CONFIGURATION DE MULTER (RÉCEPTION DES FICHIERS)
// Quand quelqu'un envoie une image au serveur, multer s'occupe
// de la recevoir et de la garder en mémoire.
// C'est comme un agent à l'entrée qui réceptionne les colis.
// ============================================================

// On importe multer — l'outil spécialisé dans la réception de fichiers
import multer from "multer";

// On exporte directement notre configuration multer
// memoryStorage() signifie que les fichiers reçus sont gardés en mémoire
// (dans la RAM de l'ordinateur) et pas sauvegardés sur le disque dur.
// C'est plus rapide car on les envoie directement à Cloudinary.
export const upload = multer({ storage: multer.memoryStorage() });
