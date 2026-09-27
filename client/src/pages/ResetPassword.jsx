import React, { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { useNavigate, useParams } from 'react-router-dom';
import logo from '../assets/images/logo/logo.png';
import api from "../api/axios";

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleClose = () => {
    navigate('/login');
  };

  const isFormValid = 
    password.length >= 6 && // Ensuring minimum length for UX
    password === confirmPassword &&
    !isLoading &&
    !successMessage;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      const response = await api.post(`/auth/reset-password/${token}`, { password });
      setSuccessMessage(response.data.message || "Password reset successful.");
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      const msg = error.response?.data?.message || "Invalid or expired reset token.";
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
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
          className="absolute top-4 right-4 sm:top-6 sm:right-6 text-gray-400 hover:text-black transition-colors z-10"
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
            Create New Password
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5">
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-xs sm:text-sm px-3 py-2 rounded-lg text-center">
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 text-xs sm:text-sm px-3 py-2 rounded-lg text-center">
              {successMessage}
            </div>
          )}
          
          <div className="relative">
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={!!successMessage || isLoading}
              className="w-full h-[44px] sm:h-[50px] border border-gray-300 rounded-[10px] px-4 text-sm text-black outline-none focus:border-black transition-colors placeholder:text-gray-500 focus:placeholder-transparent disabled:bg-gray-100 disabled:text-gray-400"
              placeholder="New password (min 6 characters)"
              required
            />
          </div>

          <div className="relative">
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={!!successMessage || isLoading}
              className="w-full h-[44px] sm:h-[50px] border border-gray-300 rounded-[10px] px-4 text-sm text-black outline-none focus:border-black transition-colors placeholder:text-gray-500 focus:placeholder-transparent disabled:bg-gray-100 disabled:text-gray-400"
              placeholder="Confirm new password"
              required
            />
            {password && confirmPassword && password !== confirmPassword && (
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500 text-xs font-medium">
                Mismatch
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={!isFormValid}
            className={`w-full h-[44px] sm:h-[50px] rounded-full font-bold text-white mt-1 sm:mt-2 transition-colors uppercase tracking-[0.08em] ${
              isFormValid ? 'bg-[#3b4045] hover:bg-black' : 'bg-gray-300 cursor-not-allowed'
            }`}
            style={{ fontFamily: "var(--font-nav)" }}
          >
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        <div className="mt-5 text-center">
          <p className="text-sm text-gray-500">
            Remembered your password?{' '}
            <button type="button" onClick={handleClose} className="font-bold text-black underline hover:text-gray-700">
              Back to login.
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
