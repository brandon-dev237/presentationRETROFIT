// ============================================================
// CONTRÔLEUR DES UTILISATEURS
// Ce fichier gère tout ce qui concerne les comptes utilisateurs :
// créer un compte, se connecter, vérifier si on est connecté,
// et se déconnecter. C'est comme la réception d'un hôtel.
// ============================================================

// On importe le modèle User pour interagir avec les utilisateurs en base de données
import User from "../models/User.js";

// bcrypt est l'outil qui transforme les mots de passe en code secret (chiffrement)
// Ainsi, même si quelqu'un vole la base de données, il ne peut pas lire les mots de passe
import bcrypt from 'bcryptjs';

// jsonwebtoken crée et vérifie les jetons d'authentification
import jwt from 'jsonwebtoken'

// ---- CRÉER UN COMPTE : accessible via POST /api/user/register ----
// Cette fonction crée un nouveau compte utilisateur
export const register = async (req, res)=> {
   try {
     // On récupère le nom, l'email et le mot de passe envoyés dans la requête
     const {name , email, password } = req.body;

     // On vérifie que toutes les informations sont bien présentes
     if(!name || !email || !password){
         return res.json({success: false, message:'Missing Details'})
     }

     // On vérifie si quelqu'un a déjà un compte avec cet email
     // Si oui, on ne peut pas créer un deuxième compte avec le même email
     const existingUser = await User.findOne({email})

     if(existingUser)
          return res.json({success: false, message:'cet utilisateur existe deja'})

        // On chiffre le mot de passe avec bcrypt (niveau 10 de sécurité)
        // Le mot de passe réel ne sera jamais stocké — seulement sa version chiffrée
        const hashedPassword = await bcrypt.hash(password, 10)

        // On crée l'utilisateur dans la base de données avec le mot de passe chiffré
        const user = await User.create({name, email, password:hashedPassword })

        // On crée un jeton JWT contenant l'identifiant de l'utilisateur
        // Ce jeton expire dans 7 jours (l'utilisateur devra se reconnecter après)
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET,{expiresIn:'7d'});

        // On envoie le jeton dans un cookie sécurisé au navigateur
        // httpOnly: true = JavaScript ne peut pas lire ce cookie (protection contre les hackers)
        // secure: true en production = cookie uniquement sur HTTPS
        // sameSite: protection contre les attaques cross-site
        // maxAge: le cookie dure 7 jours
        res.cookie ('token',token,{
            httpOnly:true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production'?'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })

        // On renvoie les informations publiques de l'utilisateur (sans le mot de passe)
        return res.json({success: true, user:{email: user.email, name: user.name}})

   } catch (error) {
         console.log(error.message);
         res.json({success: false, message: error.message});
   }
}

// ---- SE CONNECTER : accessible via POST /api/user/login ----
// Cette fonction connecte un utilisateur existant
export const login = async (req,res)=>{
    try {
        // On récupère l'email et le mot de passe envoyés
        const {email,password} = req.body;

        // On vérifie que les deux champs sont remplis
        if (!email || !password)
            return res.json({success: false, message:'Email and password are required' });

        // On cherche l'utilisateur dans la base de données par son email
        const user = await User.findOne({email});

        // Si personne n'a cet email, on refuse la connexion
        if(!user){
            return res.json({success: false, message:'Invalid email or password'});
        }

        // On compare le mot de passe saisi avec le mot de passe chiffré en base de données
        // bcrypt.compare vérifie si les deux correspondent sans déchiffrer
        const isMatch = await bcrypt.compare(password,user.password)

        // Si le mot de passe ne correspond pas, on refuse
        if (!isMatch)
             return res.json({success: false, message:'Invalid email or password' });

        // Connexion réussie ! On crée un nouveau jeton JWT pour 7 jours
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET,{expiresIn:'7d'});

        // On envoie le jeton dans un cookie sécurisé
        res.cookie ('token',token,{
            httpOnly:true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production'?'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })

        // On renvoie les infos publiques de l'utilisateur connecté
        return res.json({success: true, user:{email: user.email, name: user.name}})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}

// ---- VÉRIFIER LA CONNEXION : accessible via GET /api/user/is-auth ----
// Cette fonction vérifie si l'utilisateur est toujours connecté
// Elle est appelée au chargement de l'application pour restaurer la session
export const isAuth = async (req,res)=> {
    try {
        // L'identifiant de l'utilisateur est injecté par le middleware authUser
        const userId = req.userId;

        // On cherche l'utilisateur dans la base de données
        // .select("-password") = on ne récupère PAS le mot de passe (sécurité)
        const user = await User.findById(userId).select("-password")

        // On renvoie les informations de l'utilisateur connecté
        return res.json ({success:true,user})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}

// ---- SE DÉCONNECTER : accessible via POST /api/user/logout ----
// Cette fonction déconnecte l'utilisateur en supprimant son cookie
export const logout = (req,res)=>{
    try {
        // On supprime le cookie "token" du navigateur
        // L'utilisateur ne sera plus reconnu comme connecté
        res.clearCookie('token',{
            httpOnly:true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        });

        // On confirme la déconnexion
        return res.json({success:true, message:'Logged Out'})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}
