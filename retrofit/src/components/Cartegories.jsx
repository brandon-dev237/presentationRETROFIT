import React from 'react'
import assets, { categories } from '../assets/assets'
import { useAppContext } from '../context/AppContext'

const Categories = () => {

   const { navigate } = useAppContext(); // ✅ CORRECTION

  return (
    <div className='mt-16'>
      <p className='text-2xl md:text-3xl font-medium'>Categories</p>

      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 mt-6 gap-6'>

        {categories.map((category, index) => (
          <div
            key={index}
            className='group cursor-pointer py-2 sm:py-3 md:py-5 px-1 sm:px-2 md:px-3 gap-1 sm:gap-2 rounded-lg flex flex-col justify-center items-center'
            style={{ backgroundColor: category.bgColor }}
            onClick={() => {
              navigate(`/products/${category.path.toLowerCase()}`);
              window.scrollTo(0, 0); // petit fix propre
            }}
          >
            <img
              src={category.image}
              alt="image"
              className='group-hover:scale-105 transition w-full max-w-[4rem] sm:max-w-[5rem] md:max-w-[6rem] object-contain'
            />
            <p className='text-[clamp(0.6rem,1.5vw,0.875rem)] font-medium text-center leading-tight'>{category.text}</p>
          </div>
        ))}

      </div>
    </div>
  )
}

export default Categories
