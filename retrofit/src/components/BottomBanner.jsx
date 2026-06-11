import React from 'react'
import assets, { features } from '../assets/assets'

const BottomBanner = () => {
  return (
    <div className='relative mt-12 sm:mt-16 md:mt-24'>
      <img src={assets.bottomBannerImage} alt="banner" className='w-full hidden md:block' />
      <img src={assets.bottomBannerImageSm} alt="banner" className='w-full md:hidden' />

      <div className='absolute inset-0 flex items-center justify-center md:justify-end md:pr-24 px-4 sm:px-6 md:px-0'>
        <div className='bg-white/80 md:bg-transparent rounded-xl md:rounded-none p-3 sm:p-4 md:p-0 w-full md:w-auto max-w-[55%] sm:max-w-xs md:max-w-sm'>

          <h1 className='text-xs sm:text-sm md:text-base lg:text-xl font-semibold text-black mb-2 sm:mb-3 md:mb-4'>
            pourquoi sommes-nous les meilleurs ?
          </h1>

          {features.map((feature, index) => (
            <div key={index} className='flex items-center gap-1.5 sm:gap-2 md:gap-3 mt-1 sm:mt-1.5 md:mt-2'>
              <img
                src={feature.icon}
                alt=""
                className='w-4 sm:w-5 md:w-7 lg:w-10 h-4 sm:h-5 md:h-7 lg:h-10 shrink-0'
              />
              <div>
                <h3 className='text-[0.65rem] sm:text-xs md:text-sm lg:text-base font-semibold leading-tight'>{feature.title}</h3>
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
