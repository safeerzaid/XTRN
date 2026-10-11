import React from 'react'
import { Link } from 'react-router-dom'
import { FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa6'
import { IoChatbubbleEllipsesSharp } from 'react-icons/io5'

function Footer() {
  return (
    <footer className="w-full bg-black text-white pt-16 pb-12 overflow-hidden select-none">
      <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
        
        {/* 4 Column Navigation Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 pb-16 font-nav">
          
          {/* Column 1: Brand */}
          <div className="flex flex-col">
            <h4 className="text-white font-bold text-[16px] mb-5">
              XTRN
            </h4>
            <ul className="space-y-3.5 text-[14px] md:text-[15px] text-white font-light">
              <li>
                <Link to="/who-we-are" className="hover:underline cursor-pointer transition-all">Who We Are</Link>
              </li>
              <li>
                <Link to="/become-member" className="hover:underline cursor-pointer transition-all">Become an XTRN Member</Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Help Center */}
          <div className="flex flex-col">
            <h4 className="text-white font-bold text-[16px] mb-5">
              Help Center
            </h4>
            <ul className="space-y-3.5 text-[14px] md:text-[15px] text-white font-light">
              <li>
                <Link to="/size-guide" className="hover:underline cursor-pointer transition-all">Size Guide</Link>
              </li>
              <li>
                <Link to="/order-tracking" className="hover:underline cursor-pointer transition-all">Order Tracking</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:underline cursor-pointer transition-all">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal */}
          <div className="flex flex-col">
            <h4 className="text-white font-bold text-[16px] mb-5">
              Legal
            </h4>
            <ul className="space-y-3.5 text-[14px] md:text-[15px] text-white font-light">
              <li>
                <Link to="/terms-and-conditions" className="hover:underline cursor-pointer transition-all">Terms & Conditions</Link>
              </li>



              <li>
                <Link to="/privacy-policy" className="hover:underline cursor-pointer transition-all">Privacy</Link>
              </li>
              <li>
                <Link to="/accessibility" className="hover:underline cursor-pointer transition-all">Accessibility</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Sustainability */}
          <div className="flex flex-col">
            <h4 className="text-white font-bold text-[16px] mb-5">
              Sustainability
            </h4>
            <ul className="space-y-3.5 text-[14px] md:text-[15px] text-white font-light">
              <li>
                <Link to="/our-responsibility" className="hover:underline cursor-pointer transition-all">Our Responsible Commitments</Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Separator Line */}
        <div className="w-full border-t border-neutral-900 my-8" />

        {/* Social Icons Row */}
        <div className="flex items-center gap-5 pt-2 pb-10 text-white">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noreferrer"
            aria-label="Facebook"
            className="text-white hover:opacity-80 transition-opacity"
          >
            <FaFacebook size={22} />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            className="text-white hover:opacity-80 transition-opacity"
          >
            <FaInstagram size={22} />
          </a>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noreferrer"
            aria-label="YouTube"
            className="text-white hover:opacity-80 transition-opacity"
          >
            <FaYoutube size={22} />
          </a>
        </div>

        {/* Bottom Bar: Copyright & Chat Widget */}
        <div className="flex items-center justify-between text-[13px] text-white font-nav font-light pt-4">
          <p>
            ©2026 — Engineered for movement since 2026
          </p>

          {/* Chat Icon Button */}
          <button
            type="button"
            aria-label="Customer Chat Support"
            className="h-10 w-10 rounded-full bg-white text-black flex items-center justify-center shadow-md transition-transform hover:scale-105 cursor-pointer"
          >
            <IoChatbubbleEllipsesSharp size={20} />
          </button>
        </div>

      </div>
    </footer>
  )
}

export default Footer
