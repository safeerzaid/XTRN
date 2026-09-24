import React, { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/images/logo/logo.png';
import api from "../api/axios";
import { useAuth } from "../context/authContext";

const Login = ({ onClose, onSignupClick }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const { setAccessToken, setUser } = useAuth();

  // onClose modal-il ninnu pass cheyyathe irunnal (page route aayi undenkil), home-lekku redirect cheyyuka
  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      const fromPath = location.state?.from?.pathname;
      const fromSearch = location.state?.from?.search || '';
      const from = fromPath ? fromPath + fromSearch : '/';
      navigate(from, { replace: true });
    }
  };

  // onSignupClick illathe irunnal, /signup route-lekku navigate cheyyuka
  const handleSignupClick = () => {
    if (onSignupClick) {
      onSignupClick();
    } else {
      navigate('/signup');
    }
  };

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isFormValid = isValidEmail(email) && password.length > 0;
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!isFormValid) return;
    setErrorMessage('');

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      setAccessToken(response.data.accessToken);
      if (response.data.user) setUser(response.data.user);

      console.log("Login success:", response.data);
      handleClose();

    } catch (error) {
      const msg = error.response?.data?.message || (error.response ? "Login failed. Please check your credentials." : "Cannot connect to server. Please ensure the backend is running.");
      setErrorMessage(msg);
      console.error("Login failed:", msg, error);
    }
  };

  
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      style={{ fontFamily: "var(--font-nav)" }}
    >
      <div className="relative w-[90%] max-w-[400px] bg-white rounded-[16px] sm:rounded-[20px] p-6 sm:p-10 shadow-2xl">
        
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 text-gray-400 hover:text-black transition-colors"
          aria-label="Close"
        >
          <IoClose size={24} />
        </button>

        <div className="flex flex-col items-center mb-6 sm:mb-8">
          <img src={logo} alt="Logo" className="h-10 sm:h-12 mb-4 sm:mb-6" />
          <h2 
            className="text-xl font-medium text-black mb-2 text-center"
            style={{ fontFamily: "var(--font-nav)" }}
          >
            Log in to your account
          </h2>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4 sm:gap-5">
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-xs sm:text-sm px-3 py-2 rounded-lg text-center">
              {errorMessage}
            </div>
          )}
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

        <div className="mt-5 text-center">
          <p className="text-sm text-gray-500">
            Not a member?{' '}
            <button type="button" onClick={handleSignupClick} className="font-bold text-black underline hover:text-gray-700">
              Join our family today.
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;