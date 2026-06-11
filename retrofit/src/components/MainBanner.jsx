import React from 'react'
import assets from '../assets/assets'
import { Link } from 'react-router-dom'

const MainBanner = () => {
  return (
    <div>
      <div className='relative'>
        <img src={assets.main_banner_bg} alt="banner" className='w-full hidden md:block' />
        <img src={assets.main_banner_bg_sm} alt="banner" className='w-full md:hidden' />

        <div className='absolute inset-0 flex flex-col items-start justify-center px-4 md:pl-18 lg:pl-16'>
          <h1 className="text-[clamp(0.55rem,3vw,2rem)] font-bold text-left max-w-[45%] md:max-w-80 lg:max-w-105 leading-tight">
            {"L'élégance d'hier. L'énergie d'aujourd'hui."}
          </h1>

          <div className='hidden md:flex items-center mt-4 lg:mt-6 font-medium'>
            <Link to={"/products"} className='group flex items-center gap-2 px-5 lg:px-9 h-9 lg:h-12 text-sm lg:text-base bg-primary hover:bg-primary-dull transition rounded text-white cursor-pointer'>
              Commandez
            </Link>
            <Link to={"/products"} className='group flex items-center gap-2 px-5 lg:px-9 py-3 text-sm lg:text-base cursor-pointer'>
              Voir la collection
              <img className='w-3 lg:w-4 transition group-hover:translate-x-1' src={assets.line} alt="arrow" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bouton mobile sous la bannière */}
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
