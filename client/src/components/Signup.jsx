import React, { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/images/logo/logo.png';
import api from "../api/axios";
import { useAuth } from "../context/authContext";

const Signup = ({ onClose, onLoginClick }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const { setAccessToken, setUser } = useAuth();

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      navigate('/');
    }
  };

  const handleLoginClick = () => {
    if (onLoginClick) {
      onLoginClick();
    } else {
      navigate('/login');
    }
  };

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isFormValid = 
    name.trim().length > 0 &&
    isValidEmail(email) && 
    password.length > 0 &&
    password === confirmPassword;

    const handleSignup = async (e) => {
    e.preventDefault();

    if (!isFormValid) return;
    setErrorMessage('');

    try {
      const response = await api.post("/auth/signup", {
        name,
        email,
        password,
      });

      setAccessToken(response.data.accessToken);
      setUser(response.data.user);

      console.log("Signup success:", response.data);
      handleClose();

    } catch (error) {
      const msg = error.response?.data?.message || (error.response ? "Signup failed. Please try again." : "Cannot connect to server.");
      setErrorMessage(msg);
      console.error("Signup failed:", msg, error);
    }
  };

  
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      style={{ fontFamily: "var(--font-nav)" }}
    >
      <div className="relative w-[95%] sm:w-[90%] max-w-[400px] bg-white rounded-[16px] sm:rounded-[20px] p-4 sm:p-10 shadow-2xl overflow-y-auto max-h-[95vh]">
        
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 text-gray-400 hover:text-black transition-colors z-10"
          aria-label="Close"
        >
          <IoClose size={24} />
        </button>

        <div className="flex flex-col items-center mb-4 sm:mb-8">
          <img src={logo} alt="Logo" className="h-8 sm:h-12 mb-3 sm:mb-6" />
          <h2 className="text-xl font-medium text-black mb-2 text-center">
            Create an account
          </h2>
        </div>

        <form onSubmit={handleSignup} className="flex flex-col gap-3 sm:gap-5">
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-xs sm:text-sm px-3 py-2 rounded-lg text-center">
              {errorMessage}
            </div>
          )}
          <div className="relative">
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-[40px] sm:h-[50px] border border-gray-300 rounded-[10px] px-4 text-sm text-black outline-none focus:border-black transition-colors placeholder:text-gray-500 focus:placeholder-transparent"
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="relative">
            <input
              type="email"
              id="signup-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-[40px] sm:h-[50px] border border-gray-300 rounded-[10px] px-4 text-sm text-black outline-none focus:border-black transition-colors placeholder:text-gray-500 focus:placeholder-transparent"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="flex flex-row gap-2 sm:gap-3">
            <div className="relative flex-1">
              <input
                type="password"
                id="signup-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-[40px] sm:h-[50px] border border-gray-300 rounded-[10px] px-4 text-sm text-black outline-none focus:border-black transition-colors placeholder:text-gray-500 focus:placeholder-transparent"
                placeholder="Password"
                required
              />
            </div>

            <div className="relative flex-1">
              <input
                type="password"
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full h-[40px] sm:h-[50px] border border-gray-300 rounded-[10px] px-4 text-sm text-black outline-none focus:border-black transition-colors placeholder:text-gray-500 focus:placeholder-transparent"
                placeholder="Confirm"
                required
              />
              {password && confirmPassword && password !== confirmPassword && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500 text-[10px]">
                  Mismatch
                </span>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={!isFormValid}
            className={`w-full h-[40px] sm:h-[50px] rounded-full font-bold text-white mt-1 sm:mt-2 transition-colors uppercase tracking-[0.08em] ${
              isFormValid ? 'bg-[#3b4045] hover:bg-black' : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            Join Us
          </button>
        </form>

        <div className="mt-5 text-center">
          <p className="text-sm text-gray-500">
            Already a member?{' '}
            <button type="button" onClick={handleLoginClick} className="font-bold text-black underline hover:text-gray-700">
              Log in today.
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;