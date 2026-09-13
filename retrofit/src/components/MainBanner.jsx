// ============================================================
// BANNIÈRE PRINCIPALE (HERO BANNER)
// C'est la grande image décorative en haut de la page d'accueil.
// Elle contient le slogan, des boutons pour découvrir la boutique,
// et s'adapte à la taille de l'écran (deux images différentes :
// une grande pour desktop, une plus petite pour mobile).
// ============================================================

import React from 'react'
import assets from '../assets/assets'
import { Link } from 'react-router-dom'

const MainBanner = () => {
  return (
    <div>
      {/* Conteneur relatif pour pouvoir superposer le texte sur l'image */}
      <div className='relative'>
        {/* Image desktop (grande) — cachée sur mobile */}
        <img src={assets.main_banner_bg} alt="banner" className='w-full hidden md:block' />
        {/* Image mobile (recadrée) — cachée sur desktop */}
        <img src={assets.main_banner_bg_sm} alt="banner" className='w-full md:hidden' />

        {/* Texte et boutons superposés sur l'image — positionnés avec absolute */}
        <div className='absolute inset-0 flex flex-col items-start justify-center px-4 md:pl-18 lg:pl-16'>
          {/* Slogan de la boutique */}
          <h1 className="text-[clamp(0.8rem,3.8vw,2rem)] font-bold text-left max-w-[65%] md:max-w-80 lg:max-w-105 leading-tight">
            {"L'élégance d'hier. L'énergie d'aujourd'hui."}
          </h1>

          {/* Boutons d'action — visibles seulement sur desktop (hidden md:flex) */}
          <div className='hidden md:flex items-center mt-4 lg:mt-6 font-medium'>
            {/* Bouton principal : commander maintenant */}
            <Link to={"/products"} className='group flex items-center gap-2 px-5 lg:px-9 h-9 lg:h-12 text-sm lg:text-base bg-primary hover:bg-primary-dull transition rounded text-white cursor-pointer'>
              Commandez
            </Link>
            {/* Lien secondaire : voir toute la collection */}
            <Link to={"/products"} className='group flex items-center gap-2 px-5 lg:px-9 py-3 text-sm lg:text-base cursor-pointer'>
              Voir la collection
              {/* La flèche se déplace vers la droite au survol (group-hover:translate-x-1) */}
              <img className='w-3 lg:w-4 transition group-hover:translate-x-1' src={assets.line} alt="arrow" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bouton mobile — affiché SOUS la bannière sur mobile car l'image est trop petite
          pour superposer des boutons lisiblement */}
      <div className='md:hidden flex justify-center py-2 sm:py-3'>
        <Link to={"/products"} className='flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm bg-primary hover:bg-primary-dull transition rounded text-white cursor-pointer'>
          Commandez
          <img className='w-2.5 sm:w-3 transition' src={assets.line} alt="" />
        </Link>
      </div>
    </div>
  )
}

export default MainBanner
