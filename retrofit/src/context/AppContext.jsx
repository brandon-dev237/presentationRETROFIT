// ============================================================
// CONTEXTE GLOBAL DE L'APPLICATION
// Ce fichier est comme une grande armoire partagée par tout le site.
// Toutes les données importantes (utilisateur, produits, panier...)
// sont rangées ici et accessibles depuis n'importe quelle page.
// ============================================================

import { useEffect, useState, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";              // Pour afficher des notifications
import axios from "axios";                         // Pour faire des requêtes au serveur

// On configure axios pour envoyer les cookies automatiquement avec chaque requête
// Sans ça, le serveur ne reconnaîtrait pas l'utilisateur connecté
axios.defaults.withCredentials = true;

// En développement, le proxy Vite redirige "/api" vers le serveur local (voir vite.config.js) :
// les requêtes restent "same-origin" pour le navigateur, donc pas de CORS à gérer.
// On ne touche pas à ce comportement ici, sinon toute requête passerait en cross-origin direct
// vers le backend et casserait dès que l'origine du navigateur ne correspond pas exactement
// à celle autorisée par le CORS du serveur (ex: 127.0.0.1 au lieu de localhost).
//
// En production, ce proxy n'existe plus : il faut donc cibler explicitement le backend
// déployé via VITE_BACKEND_URL, sinon les requêtes partiraient vers le frontend lui-même.
if (import.meta.env.PROD && import.meta.env.VITE_BACKEND_URL) {
  axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;
}

// On crée le "contexte" — c'est la boîte partagée
export const AppContext = createContext();

// AppContextProvider est le composant qui enveloppe toute l'application
// et rend les données accessibles à tous les composants enfants
export const AppContextProvider = ({ children }) => {

  // Le symbole de la monnaie utilisée sur le site (ici l'euro)
  const currency = import.meta.env.VITE_CURRENCY;

  // navigate permet de changer de page programmatiquement (sans cliquer un lien)
  const navigate = useNavigate();

  // État de l'utilisateur connecté (null = personne connecté)
  const [user, setUser] = useState(null);

  // Est-ce que la vérification initiale de connexion (fetchUser) est encore en cours ?
  // Tant que c'est true, on ne sait pas encore si l'utilisateur est connecté ou non —
  // les routes protégées doivent attendre avant de rediriger, sinon elles redirigent
  // à tort vers l'accueil sur un rechargement de page (avant que fetchUser ait répondu).
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Est-ce que la personne connectée est le vendeur ? (true/false)
  const [isSeller, setIsSeller] = useState(false);

  // Même logique que isAuthLoading, mais pour la vérification de connexion vendeur
  // (évite d'afficher brièvement le formulaire de connexion vendeur avant le dashboard
  // au rechargement de /seller, le temps que fetchSeller réponde).
  const [isSellerLoading, setIsSellerLoading] = useState(true);

  // Doit-on afficher le popup de connexion utilisateur ?
  const [showUserLogin, setShowUserLogin] = useState(false);

  // La liste des produits — vide tant que fetchProducts n'a pas répondu.
  // On n'utilise plus de produits de démo ici : un produit factice ajouté au
  // panier (localStorage) aurait un _id invalide pour MongoDB et ferait planter
  // la commande côté serveur ("Cast to ObjectId failed").
  const [products, setProducts] = useState([]);

  // true tant que fetchProducts n'a pas répondu — permet d'afficher un skeleton
  // de chargement plutôt qu'une grille vide pendant le premier chargement
  const [isProductsLoading, setIsProductsLoading] = useState(true);

  // Le panier — on le charge depuis localStorage pour le conserver entre les visites
  // localStorage c'est la mémoire du navigateur qui reste même après fermeture
  const [cartItems, setCartItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cartItems')) || {}; }
    catch { return {}; }
  });

  // Le texte tapé dans la barre de recherche
  // initialisé comme string (vide) pour éviter les erreurs de .length
  const [searchQuery, setSearchQuery] = useState('');

  // ---- RÉCUPÉRER L'UTILISATEUR CONNECTÉ ----
  // Cette fonction demande au serveur si l'utilisateur a un cookie valide
  // Elle est appelée au démarrage pour restaurer la session
  const fetchUser = async () => {
    try {
      const { data } = await axios.get('/api/user/is-auth');
      if (data.success) {
        // Si la réponse est positive, on sauvegarde les infos de l'utilisateur
        setUser(data.user);
      }
    } catch {
      // Si ça échoue (pas connecté, serveur indisponible), on reste déconnecté
      setUser(null);
    } finally {
      // Que ça réussisse ou échoue, la vérification est terminée
      setIsAuthLoading(false);
    }
  }

  // ---- RÉCUPÉRER LE STATUT DU VENDEUR ----
  // Cette fonction vérifie si le cookie vendeur est présent et valide
  const fetchSeller = async ()=>{
    try {
      const {data} = await axios.get('/api/seller/is-auth');
      if(data.success){
        // Cookie vendeur valide → on marque l'utilisateur comme vendeur
        setIsSeller(true)
      }else{
        setIsSeller(false)
      }

    } catch (error) {
       // Si ça échoue, on n'est pas vendeur
       setIsSeller(false)
    } finally {
       // Que ça réussisse ou échoue, la vérification est terminée
       setIsSellerLoading(false)
    }
  }

  // ---- RÉCUPÉRER LES PRODUITS ----
  // Cette fonction charge les produits depuis la base de données
  const fetchProducts = async () => {
    try {
      const { data } = await axios.get('/api/product/list');
      if (data.success) {
        setProducts(data.products);
      }
    } catch {
      // En cas d'erreur, la liste reste vide plutôt que d'afficher des produits inventés
    } finally {
      setIsProductsLoading(false);
    }
  };

  // ---- AJOUTER AU PANIER ----
  // Quand on clique "Ajouter au panier", cette fonction est appelée
  // Elle augmente la quantité de l'article de 1
  const addToCart = (itemId) => {
    // On crée un nouveau panier avec la quantité augmentée
    // (prev[itemId] || 0) + 1 : si l'article est déjà dans le panier, +1, sinon on commence à 1
    setCartItems(prev => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
    toast.success("Ajouté au panier"); // Petite notification verte
  };

  // ---- MODIFIER LA QUANTITÉ D'UN ARTICLE ----
  // Quand on change le nombre d'articles dans le panier
  const updateCartItem = (itemId, quantity) => {
    // On met à jour la quantité directement avec la nouvelle valeur
    setCartItems(prev => ({ ...prev, [itemId]: quantity }));
  };

  // ---- RETIRER UN ARTICLE (DÉCRÉMENTER) ----
  // Diminue la quantité de 1. Si on arrive à 0, l'article est supprimé du panier.
  const removeFromCart = (itemId) => {
    setCartItems(prev => {
      const qty = (prev[itemId] || 0) - 1; // Nouvelle quantité = ancienne - 1
      if (qty <= 0) {
        // Si la quantité tombe à 0 ou moins, on supprime l'article du panier
        const { [itemId]: _, ...rest } = prev; // On enlève la clé itemId
        return rest; // On renvoie le panier sans cet article
      }
      // Sinon on met juste à jour la quantité
      return { ...prev, [itemId]: qty };
    });
  };

  // ---- SUPPRIMER UN ARTICLE ENTIÈREMENT ----
  // Supprime l'article du panier quelle que soit sa quantité
  const deleteFromCart = (itemId) => {
    setCartItems(prev => {
      // On crée un nouveau panier sans l'article supprimé
      const { [itemId]: _, ...rest } = prev;
      return rest;
    });
  };

  // ---- COMPTER LE NOMBRE D'ARTICLES DANS LE PANIER ----
  // Retourne le nombre total d'articles (ex: 3 t-shirts + 2 pantalons = 5)
  const getCartCount = () => {
    let totalCount = 0;
    for(const item in cartItems){
      totalCount += cartItems [item]; // On additionne les quantités de chaque article
    }
    return totalCount;
  }

  // ---- VIDER COMPLÈTEMENT LE PANIER ----
  // Vide le panier ET le localStorage pour éviter les données résiduelles
  const clearCart = () => {
    setCartItems({});
    localStorage.removeItem('cartItems');
  }

  // ---- CALCULER LE MONTANT TOTAL DU PANIER ----
  // Additionne le prix de chaque article multiplié par sa quantité
  const getCartAmount = () => {
    let totalAmount = 0;
    for(const item in cartItems){
      // On cherche le produit dans la liste pour avoir son prix
      let itemInfo = products.find((product)=> product._id === item);
      // On vérifie que le produit existe et que la quantité est positive
      if(itemInfo && cartItems[item] > 0){
        totalAmount += itemInfo.offerPrice * cartItems[item]; // prix × quantité
      }
    }
    // Math.floor arrondit au centime (2 décimales)
    return Math.floor(totalAmount * 100) / 100;
  }

  // ---- AU DÉMARRAGE DE L'APPLICATION ----
  // Ces trois fonctions sont appelées une seule fois quand l'app se lance
  useEffect(() => {
    fetchUser()    // On vérifie si un utilisateur est connecté
    fetchSeller()  // On vérifie si le vendeur est connecté
    fetchProducts() // On charge les produits
  }, []);

  // ---- SYNCHRONISER LE PANIER AVEC LOCALSTORAGE ----
  // À chaque fois que le panier change, on le sauvegarde dans le navigateur
  // Ainsi le panier est conservé même si l'utilisateur ferme et rouvre le site
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // ---- NETTOYER LE PANIER DES PRODUITS QUI N'EXISTENT PLUS ----
  // Un panier sauvegardé dans localStorage peut contenir un _id qui ne correspond
  // à aucun produit réel (ex: reliquat des anciens produits de démo, ou produit
  // supprimé depuis par le vendeur). On enlève ces entrées dès que la vraie liste
  // de produits est chargée, sinon la commande plante côté serveur.
  useEffect(() => {
    if (products.length === 0) return;
    setCartItems(prev => {
      const validIds = new Set(products.map(p => p._id));
      const cleaned = Object.fromEntries(
        Object.entries(prev).filter(([itemId]) => validIds.has(itemId))
      );
      return Object.keys(cleaned).length === Object.keys(prev).length ? prev : cleaned;
    });
  }, [products]);

  // On rassemble toutes les données et fonctions à partager
  // Tout ce qui est listé ici sera accessible depuis n'importe quel composant
  const value = {
    navigate,        // Fonction pour changer de page
    user,            // Infos de l'utilisateur connecté
    setUser,         // Modifier l'utilisateur (connexion/déconnexion)
    isAuthLoading,   // true tant qu'on ne sait pas encore si l'utilisateur est connecté
    isSeller,        // Est-ce que c'est le vendeur ?
    setIsSeller,     // Modifier le statut vendeur
    isSellerLoading, // true tant qu'on ne sait pas encore si c'est le vendeur
    showUserLogin,   // Afficher/cacher le popup de connexion
    setShowUserLogin,
    products,        // Liste de tous les produits
    isProductsLoading, // true tant que la liste de produits n'a pas encore été chargée
    currency,        // Symbole monétaire (€)
    fetchProducts,   // Recharger les produits
    addToCart,       // Ajouter un article au panier
    updateCartItem,  // Changer la quantité d'un article
    removeFromCart,  // Décrémenter un article
    deleteFromCart,  // Supprimer un article du panier
    cartItems,       // Contenu du panier {id: quantité}
    setCartItems,    // Modifier directement le panier
    searchQuery,     // Texte de recherche
    setSearchQuery,
    getCartCount,    // Nombre total d'articles dans le panier
    getCartAmount,   // Montant total du panier
    clearCart,       // Vider complètement le panier et localStorage
    axios            // Outil pour faire des requêtes au serveur
  };

  return (
    // On enveloppe tous les enfants avec le Provider
    // Tous les composants dans AppContextProvider peuvent accéder à "value"
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte facilement
// Au lieu d'écrire useContext(AppContext) partout,
// on écrit juste useAppContext()
export const useAppContext = () => {
  return useContext(AppContext);
};
