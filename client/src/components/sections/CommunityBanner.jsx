import React from 'react'
import { Link } from 'react-router-dom'
import communityImage from '../../assets/images/covers/com.png'

function CommunityBanner() {
  return (
    <section className="w-full relative overflow-hidden mt-8 md:mt-16 mb-16 md:mb-28">
      {/* Banner Container - reduced height from bottom while anchoring image to top */}
      <div className="relative w-full aspect-[2017/600] min-h-[220px] sm:min-h-[270px] md:min-h-[330px] lg:min-h-[380px] bg-gray-900 overflow-hidden">
        {/* Background Image - anchored to top */}
        <img
          src={communityImage}
          alt="XTRN Club Community"
          className="w-full h-full object-cover object-top transition-transform duration-700 ease-out hover:scale-[1.01]"
        />

        {/* Subtle overlay for natural image colors while maintaining readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent transition-colors duration-500 pointer-events-none" />

        {/* Bottom-aligned Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-end text-center px-4 sm:px-6 pb-4 sm:pb-6 md:pb-8 z-10">
          {/* Headline */}
          <h2 className="text-white font-bold font-nav text-[19px] sm:text-[23px] md:text-[26px] uppercase tracking-wide drop-shadow-md">
            XTRN CLUB IS LIVE
          </h2>

          {/* Subline - White, Uppercase, With Letter Spacing */}
          <p className="text-white font-nav font-medium text-[11px] sm:text-[12px] md:text-[13px] uppercase tracking-wider max-w-2xl mt-1 md:mt-1.5 leading-relaxed drop-shadow">
            Real support, training tips, and rewards — powered by the XTRN community.
          </p>

          {/* CTA Button matching hero section pill button & hover effect */}
          <Link
            to="/community"
            className="mt-3.5 sm:mt-4 bg-white text-black px-7 py-3 rounded-full text-[12px] md:text-[13px] font-bold tracking-wide uppercase hover:bg-black hover:text-white transition-colors cursor-pointer whitespace-nowrap"
          >
            Explore Community
          </Link>
        </div>
      </div>
    </section>
  )
}

export default CommunityBanner
