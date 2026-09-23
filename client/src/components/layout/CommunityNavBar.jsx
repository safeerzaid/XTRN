import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiShoppingBag } from 'react-icons/fi';
import logo from '../../assets/images/logo/logo.png';

const CommunityNavBar = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed top-0 left-0 right-0 z-50 w-full bg-black border-b border-gray-800">
      <div className="flex items-center justify-between h-16 md:h-20 px-5 md:px-10">
        
        {/* Left: Logo */}
        <div className="flex-1 flex items-center justify-start">
          <button onClick={() => navigate('/')} className="outline-none">
            <img src={logo} alt="XTRN Logo" className="w-[60px] md:w-[75px] h-auto cursor-pointer invert" />
          </button>
        </div>

        {/* Center: XTRN CLUB Text */}
        <div className="flex-1 flex items-center justify-center">
          <h1 className="font-logo font-bold text-3xl md:text-4xl tracking-widest uppercase text-white m-0 leading-none">
            XTRN CLUB
          </h1>
        </div>

        {/* Right: Account & Cart */}
        <div className="flex-1 flex items-center justify-end gap-4 md:gap-6">
          <button className="text-white outline-none hover:text-[#ea580c] transition-colors">
            <FiUser size={22} strokeWidth={1.7} />
          </button>
          <button className="text-white outline-none hover:text-[#ea580c] transition-colors">
            <FiShoppingBag size={22} strokeWidth={1.7} />
          </button>
        </div>

      </div>
    </div>
  );
};

export default CommunityNavBar;
