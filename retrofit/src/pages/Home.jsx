// ============================================================
// PAGE D'ACCUEIL
// C'est la première page que voit un visiteur.
// Elle rassemble tous les composants de la page d'accueil
// dans l'ordre d'affichage : bannière, catégories, tendances,
// bannière du bas et formulaire d'inscription newsletter.
// ============================================================

import React from 'react'
import MainBanner from '../components/MainBanner'     // Grande image d'accroche en haut
import Cartegories from '../components/Cartegories'   // Grille des catégories de vêtements
import BestSeller from '../components/BestSeller'     // Section "Tendances du Moment"
import BottomBanner from '../components/BottomBanner' // Bandeau "Pourquoi nous choisir"
import NewsLetter from '../components/NewsLetter'     // Formulaire d'abonnement email

const Home = () => {
  return (
    // Conteneur principal avec une marge en haut pour ne pas coller à la Navbar
    <div className='mt-10'>
      <MainBanner/>     {/* Bannière héro avec les boutons d'appel à l'action */}
      <Cartegories/>    {/* Icônes des catégories (doudounes, pulls, etc.) */}
      <BestSeller/>     {/* Les 5 produits les plus récents en stock */}
      <BottomBanner/>   {/* Arguments de vente (livraison, qualité, etc.) */}
      <NewsLetter/>     {/* Formulaire pour s'abonner aux nouveautés */}
    </div>
  )
}

export default Home
