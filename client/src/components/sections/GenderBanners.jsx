import React from 'react'
import { useNavigate } from 'react-router-dom'
import menImage from '../../assets/images/covers/men.jpg'
import womenImage from '../../assets/images/covers/women.jpg'

function GenderBanners() {
  const navigate = useNavigate()

  return (
    <section className="w-full mt-8 md:mt-16 pb-10 md:pb-16 overflow-x-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Shop Womens */}
        <div
          onClick={() => navigate('/women')}
          className="group relative overflow-hidden h-[100vh] bg-gray-100 cursor-pointer"
        >
          <img
            src={womenImage}
            alt="Shop Womens"
            className="w-full h-full object-cover object-center transition-transform duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
          />
          
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-500 pointer-events-none" />

          {/* Centered text inside the image */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <h3 className="text-white font-bold font-nav text-[20px] sm:text-[24px] md:text-[28px] lg:text-[30px] tracking-[0.05em] uppercase select-none drop-shadow-lg text-center px-4">
              SHOP WOMENS
            </h3>
          </div>
        </div>

        {/* Shop Mens */}
        <div
          onClick={() => navigate('/men')}
          className="group relative overflow-hidden h-[100vh] bg-gray-100 cursor-pointer"
        >
          <img
            src={menImage}
            alt="Shop Mens"
            className="w-full h-full object-cover object-center transition-transform duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
          />
          
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-500 pointer-events-none" />

          {/* Centered text inside the image */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <h3 className="text-white font-bold font-nav text-[20px] sm:text-[24px] md:text-[28px] lg:text-[30px] tracking-[0.05em] uppercase select-none drop-shadow-lg text-center px-4">
              SHOP MENS
            </h3>
          </div>
        </div>
      </div>
    </section>
  )
}

export default GenderBanners
