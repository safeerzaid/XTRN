import React, { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import logo from '../assets/images/logo/logo.png';
import api from "../api/axios";

const Login = ({ onClose, onSignupClick }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Basic email validation regex
 const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isFormValid = isValidEmail(email) && password.length > 0;

  const handleLogin = async (e) => {
  e.preventDefault();

  if (!isFormValid) return;

  try {
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    console.log("Login success:", response.data);
    onClose();

  } catch (error) {
    console.log("Login failed:", error.response?.data);
  }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      style={{ fontFamily: "var(--font-nav)" }}
    >
      {/* Modal Container */}
      <div className="relative w-[90%] max-w-[480px] bg-white rounded-[16px] sm:rounded-[20px] p-6 sm:p-10 shadow-2xl">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 text-gray-400 hover:text-black transition-colors"
          aria-label="Close"
        >
          <IoClose size={24} />
        </button>

        {/* Header */}
        <div className="flex flex-col items-center mb-6 sm:mb-8">
          <img src={logo} alt="Logo" className="h-10 sm:h-12 mb-4 sm:mb-6" />
          <h2 
            className="text-xl font-medium text-black mb-2 text-center"
            style={{ fontFamily: "var(--font-nav)" }}
          >
            Log in to your account
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4 sm:gap-5">
          {/* Email Field */}
          <div className="relative">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-[44px] sm:h-[50px] border border-gray-300 rounded-[10px] px-4 text-sm text-black outline-none focus:border-black transition-colors placeholder:text-gray-500 focus:placeholder-transparent"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password Field */}
          <div className="relative">
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-[44px] sm:h-[50px] border border-gray-300 rounded-[10px] px-4 text-sm text-black outline-none focus:border-black transition-colors placeholder:text-gray-500 focus:placeholder-transparent"
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isFormValid}
            className={`w-full h-[44px] sm:h-[50px] rounded-full font-bold text-white mt-1 sm:mt-2 transition-colors uppercase tracking-[0.08em] ${
              isFormValid ? 'bg-[#3b4045] hover:bg-black' : 'bg-gray-300 cursor-not-allowed'
            }`}
            style={{ fontFamily: "var(--font-nav)" }}
          >
            Log In
          </button>
        </form>

        {/* Switch Link */}
        <div className="mt-5 text-center">
          <p className="text-sm text-gray-500">
            Not a member?{' '}
            <button type="button" onClick={onSignupClick} className="font-bold text-black underline hover:text-gray-700">
              Join our family today.
            </button>
          </p>
        </div>



      </div>
    </div>
  );
};

export default Login;
