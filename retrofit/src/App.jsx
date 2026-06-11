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

const App = () => {

// On récupère le chemin actuel pour savoir si on est sur les pages vendeur
// Si l'URL contient "seller", on est dans l'espace vendeur
const isSellerPath = useLocation().pathname.includes ('seller');

// On récupère les données globales : est-ce que le popup de connexion est ouvert ?
// et est-ce que la personne connectée est le vendeur ?
const {showUserLogin, isSeller} = useAppContext ()

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

           {/* Page d'une catégorie spécifique (ex: /products/doudoune) */}
           <Route path='/products/:category'element={<ProductCategory/>} />

           {/* Page détail d'un produit (ex: /products/doudoune/123abc) */}
           <Route path='/products/:category/:id'element={<ProductDetails/>} />

           {/* Page du panier */}
           <Route path='/cart'element={<Cart/>} />

           {/* Page pour ajouter une adresse de livraison */}
           <Route path='/add-address'element={<AddAddress/>} />

           {/* Page pour voir ses commandes */}
           <Route path='/my-orders'element={<MyOrders/>} />

           {/* Espace vendeur — si le vendeur est connecté, on affiche le dashboard
               sinon on affiche le formulaire de connexion vendeur */}
           <Route path='/seller' element={isSeller ? <SellerLayout/> : <SellerLogin/>}>
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
