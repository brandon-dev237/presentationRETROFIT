// ============================================================
// COMPOSANT PRINCIPAL DE L'APPLICATION
// Ce fichier est le chef d'orchestre du site.
// Il définit toutes les pages disponibles et les règles de navigation.
// C'est comme le plan d'un bâtiment qui montre toutes les pièces.
// ============================================================

import React from 'react'

// On importe la barre de navigation (en haut du site)
import Navbar from './components/Navbar'

// Route = une page, Routes = toutes les pages, useLocation = savoir où on est
// Navigate = rediriger quelqu'un vers une autre page
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'

// On importe toutes les pages du site
import Home from './pages/Home'                       // Page d'accueil
import {Toaster} from 'react-hot-toast';              // Système de notifications (petits messages)
import Footer from './components/Footer';             // Pied de page
import { useAppContext } from './context/AppContext';  // Données globales
import Login from './components/Login';               // Popup de connexion utilisateur
import AllProducts from './pages/AllProducts';        // Page tous les produits
import ProductCategory from './pages/ProductCategory'; // Page d'une catégorie
import ProductDetails from './pages/ProductDetails';  // Page détail d'un produit
import Cart from './pages/Cart';                      // Page panier
import AddAddress from './pages/AddAddress';          // Page ajout d'adresse
import MyOrders from './pages/MyOrders';              // Page mes commandes
import SellerLayout from './pages/seller/SellerLayout'; // Mise en page espace vendeur
import SellerLogin from './components/seller/SellerLogin'; // Connexion vendeur
import AddProduct from './pages/seller/AddProduct';   // Page ajout de produit
import ProductList from './pages/seller/ProductList'; // Page liste des produits (vendeur)
import Orders from './pages/seller/Orders';           // Page commandes (vendeur)
import Loader from './pages/Loader';                  // Page de confirmation post-paiement Stripe
import LegalNotice from './pages/LegalNotice';        // Mentions légales
import PrivacyPolicy from './pages/PrivacyPolicy';    // Politique de confidentialité

// Petit indicateur affiché pendant qu'on vérifie si l'utilisateur est connecté.
// Évite qu'une route protégée (ex: /my-orders) redirige à tort vers l'accueil
// sur un rechargement de page, avant que la réponse du serveur soit arrivée.
const AuthCheckLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

const App = () => {

// On récupère le chemin actuel pour savoir si on est sur les pages vendeur
// Si l'URL contient "seller", on est dans l'espace vendeur
const isSellerPath = useLocation().pathname.includes ('seller');

// On récupère les données globales : est-ce que le popup de connexion est ouvert ?
// et est-ce que la personne connectée est le vendeur ?
const {showUserLogin, isSeller, user, isAuthLoading, isSellerLoading} = useAppContext ()

  return (
    <div className='text-default min-h-screen text-gray-700 bg-white'   >

     {/* On n'affiche PAS la Navbar sur les pages vendeur (espace admin différent) */}
     { isSellerPath ? null: <Navbar/>}

     {/* Si showUserLogin est vrai, on affiche le popup de connexion */}
     {showUserLogin ? <Login/> : null }

      {/* Toaster affiche les petits messages de notification (succès, erreur) */}
      <Toaster/>

      {/* Sur les pages vendeur, pas de padding latéral (le layout vendeur gère ça) */}
      <div className={`${isSellerPath ? "":"px-6 md:px-16 lg:px-24 xl:px-32"}` }>

        {/* Définition de toutes les routes (pages) du site */}
        <Routes>
           {/* Page d'accueil */}
           <Route path='/'element={<Home/>} />

           {/* Page tous les articles */}
           <Route path='/products'element={<AllProducts/>} />

           {/* Page détail d'un produit (ex: /products/doudoune/123abc) — AVANT la catégorie ! */}
           <Route path='/products/:category/:id'element={<ProductDetails/>} />

           {/* Page d'une catégorie spécifique (ex: /products/doudoune) */}
           <Route path='/products/:category'element={<ProductCategory/>} />

           {/* Page du panier */}
           <Route path='/cart'element={<Cart/>} />

           {/* Page pour ajouter une adresse de livraison — connexion requise.
               Tant que isAuthLoading est true, on ne sait pas encore si l'utilisateur
               est connecté (la vérification vient de démarrer) : on affiche un loader
               plutôt que de rediriger à tort vers l'accueil. */}
           <Route path='/add-address' element={
             isAuthLoading ? <AuthCheckLoader/> : (user ? <AddAddress/> : <Navigate to='/' replace />)
           } />

           {/* Page pour voir ses commandes — connexion requise (même logique) */}
           <Route path='/my-orders' element={
             isAuthLoading ? <AuthCheckLoader/> : (user ? <MyOrders/> : <Navigate to='/' replace />)
           } />

           {/* Page de confirmation après paiement Stripe (/loader?next=orders) */}
           <Route path='/loader' element={<Loader/>} />

           {/* Pages légales — accessibles depuis le pied de page, sans connexion requise */}
           <Route path='/mentions-legales' element={<LegalNotice/>} />
           <Route path='/confidentialite' element={<PrivacyPolicy/>} />

           {/* Espace vendeur — si le vendeur est connecté, on affiche le dashboard
               sinon on affiche le formulaire de connexion vendeur.
               Tant que isSellerLoading est true, on affiche un loader plutôt que
               de montrer brièvement le formulaire de connexion avant le dashboard
               au rechargement de /seller (le temps que fetchSeller réponde). */}
           <Route path='/seller' element={
             isSellerLoading ? <AuthCheckLoader/> : (isSeller ? <SellerLayout/> : <SellerLogin/>)
           }>
             {/* Page par défaut de l'espace vendeur : ajouter un produit */}
             <Route index element={<AddProduct/>} />
             {/* Page liste des produits du vendeur */}
             <Route path='product-list' element={<ProductList/>} />
             {/* Page des commandes du vendeur */}
             <Route path='orders' element={<Orders/>} />
           </Route>

           {/* Route attrape-tout : si l'URL n'existe pas, on redirige vers l'accueil */}
           <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
      </div>

     {/* Le pied de page n'est PAS affiché sur les pages vendeur */}
     {!isSellerPath && <Footer/>}
    </div>
  )
}

export default App
