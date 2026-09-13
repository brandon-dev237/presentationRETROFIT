// ============================================================
// COMPOSANT GRILLE DES CATÉGORIES
// Ce composant affiche toutes les catégories de vêtements
// sous forme d'icônes cliquables (doudounes, pulls, etc.).
// Cliquer sur une catégorie redirige vers la page de cette catégorie.
// Chaque catégorie a sa propre couleur de fond définie dans assets.js.
// ============================================================

import React from 'react'
import assets, { categories } from '../assets/assets' // Liste des catégories avec images et couleurs
import { useAppContext } from '../context/AppContext'

const Categories = () => {

  // On récupère navigate pour pouvoir changer de page au clic
  const { navigate } = useAppContext();

  return (
    <div id='categories' className='mt-16'>
      {/* Titre de la section */}
      <p className='text-2xl md:text-3xl font-medium'>Categories</p>

      {/* Grille responsive : 2 colonnes sur mobile, jusqu'à 7 sur très grands écrans */}
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 mt-6 gap-6'>

        {/* On génère une carte pour chaque catégorie */}
        {categories.map((category, index) => (
          <div
            key={index}
            className='group cursor-pointer py-2 sm:py-3 md:py-5 px-1 sm:px-2 md:px-3 gap-1 sm:gap-2 rounded-lg flex flex-col justify-center items-center'
            style={{ backgroundColor: category.bgColor }} // Couleur de fond unique par catégorie
            onClick={() => {
              // Au clic, on navigue vers la page de cette catégorie
              // Ex: /products/doudoune
              navigate(`/products/${category.path.toLowerCase()}`);
              window.scrollTo(0, 0); // On remonte en haut de la page
            }}
          >
            {/* Icône de la catégorie — grossit légèrement au survol (group-hover:scale-105) */}
            <img
              src={category.image}
              alt="image"
              className='group-hover:scale-105 transition w-full max-w-[4rem] sm:max-w-[5rem] md:max-w-[6rem] object-contain'
            />
            {/* Nom de la catégorie en dessous de l'icône */}
            <p className='text-[clamp(0.6rem,1.5vw,0.875rem)] font-medium text-center leading-tight'>{category.text}</p>
          </div>
        ))}

      </div>
    </div>
  )
}

export default Categories
