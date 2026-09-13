// ============================================================
// BANNIÈRE DU BAS — ARGUMENTS DE VENTE
// Ce composant affiche une seconde bannière avec une liste
// d'avantages (livraison gratuite, qualité, etc.) pour
// convaincre les visiteurs d'acheter.
// Les arguments sont définis dans le tableau "features" dans assets.js.
// ============================================================

import React from 'react'
import assets, { features } from '../assets/assets' // features = liste des arguments de vente

const BottomBanner = () => {
  return (
    // Sur mobile : image puis carte empilées normalement (pas de superposition,
    // le texte a besoin de plus de hauteur que l'image n'en offre).
    // Sur desktop (md:) : conteneur relatif, carte superposée en absolu sur l'image.
    <div className='mt-12 sm:mt-16 md:mt-24 md:relative'>
      {/* Image de fond desktop */}
      <img src={assets.bottomBannerImage} alt="banner" className='w-full hidden md:block' />
      {/* Image de fond mobile */}
      <img src={assets.bottomBannerImageSm} alt="banner" className='w-full md:hidden' />

      {/* Contenu : bloc normal sous l'image sur mobile, superposé et aligné à droite sur desktop */}
      <div className='mt-4 md:mt-0 md:absolute md:inset-0 flex items-center justify-center md:justify-end md:pr-24 px-4 sm:px-6 md:px-0'>
        {/* Carte pleine largeur sur mobile, semi-transparente et superposée sur desktop */}
        <div className='bg-primary/5 md:bg-transparent rounded-xl md:rounded-none p-4 md:p-0 w-full md:w-auto max-w-full sm:max-w-xs md:max-w-sm'>

          {/* Titre de la section */}
          <h1 className='text-xs sm:text-sm md:text-base lg:text-xl font-semibold text-black mb-2 sm:mb-3 md:mb-4'>
            pourquoi sommes-nous les meilleurs ?
          </h1>

          {/* On liste tous les arguments définis dans assets.js (features) */}
          {features.map((feature, index) => (
            <div key={index} className='flex items-center gap-1.5 sm:gap-2 md:gap-3 mt-1 sm:mt-1.5 md:mt-2'>
              {/* Icône de l'argument (ex: icône camion pour la livraison) */}
              <img
                src={feature.icon}
                alt=""
                className='w-4 sm:w-5 md:w-7 lg:w-10 h-4 sm:h-5 md:h-7 lg:h-10 shrink-0'
              />
              <div>
                {/* Titre court de l'argument */}
                <h3 className='text-[0.65rem] sm:text-xs md:text-sm lg:text-base font-semibold leading-tight'>{feature.title}</h3>
                {/* Description détaillée */}
                <p className='text-gray-500/70 text-[0.6rem] sm:text-[0.7rem] md:text-xs lg:text-sm leading-tight'>{feature.description}</p>
              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  )
}

export default BottomBanner
