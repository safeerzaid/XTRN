import React, { useState, useEffect } from 'react';
import { IoClose } from 'react-icons/io5';
import api from '../api/axios';
import { useAuth } from '../context/authContext';

const OtpVerification = ({ email, onClose, onSuccess, onGoBack }) => {
  const [otp, setOtp] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [attemptsLocked, setAttemptsLocked] = useState(false);

  const { setAccessToken, setUser } = useAuth();

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (otp.length !== 6 || isSubmitting || attemptsLocked) return;
    
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = await api.post('/auth/verify-otp', { email, otp });
      
      setAccessToken(response.data.accessToken);
      if (response.data.user) setUser(response.data.user);
      
      if (onSuccess) onSuccess();
      if (onClose) onClose();
      
    } catch (error) {
      const msg = error.response?.data?.message || 'Verification failed. Please try again.';
      setErrorMessage(msg);
      if (msg.includes('Too many failed attempts') || msg.includes('Request a new code')) {
        setAttemptsLocked(true);
        setOtp('');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    
    try {
      setErrorMessage('');
      setAttemptsLocked(false);
      setOtp('');
      await api.post('/auth/resend-otp', { email });
      setCountdown(60);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Failed to resend code');
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4"
      style={{ fontFamily: "var(--font-nav)" }}
    >
      <div className="relative w-[95%] sm:w-[90%] max-w-[400px] bg-white rounded-[16px] sm:rounded-[20px] p-6 sm:p-10 shadow-2xl">
        
        {onClose && (
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 text-gray-400 hover:text-black transition-colors z-10"
            aria-label="Close"
          >
            <IoClose size={24} />
          </button>
        )}

        <div className="flex flex-col items-center mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-black mb-2 text-center uppercase tracking-wider">
            Verify Email
          </h2>
          <p className="text-sm text-gray-500 text-center px-2">
            We sent a 6-digit code to <br/>
            <span className="font-bold text-black">{email.replace(/(.{2})(.*)(?=@)/, (match, p1, p2) => p1 + '*'.repeat(p2.length))}</span>
          </p>
        </div>

        <form onSubmit={handleVerify} className="flex flex-col gap-5">
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-xs sm:text-sm px-3 py-3 rounded-lg text-center font-medium">
              {errorMessage}
            </div>
          )}

          <div className="relative">
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="w-full h-[50px] border border-gray-300 rounded-[10px] px-4 text-center text-2xl tracking-[0.5em] font-bold text-black outline-none focus:border-black transition-colors"
              placeholder="------"
              maxLength={6}
              autoFocus
              autoComplete="one-time-code"
              disabled={attemptsLocked}
            />
          </div>

          <button
            type="submit"
            disabled={otp.length !== 6 || isSubmitting || attemptsLocked}
            className={`w-full h-[50px] rounded-full font-bold text-white transition-colors uppercase tracking-[0.08em] ${
              (otp.length === 6 && !isSubmitting && !attemptsLocked) ? 'bg-[#3b4045] hover:bg-black' : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? 'Verifying...' : 'Verify'}
          </button>
        </form>

        <div className="mt-6 flex flex-col gap-3 items-center">
          {attemptsLocked ? (
            <button
              onClick={handleResend}
              disabled={countdown > 0}
              className={`text-sm font-bold underline ${countdown > 0 ? 'text-gray-400 cursor-not-allowed' : 'text-black hover:text-gray-700'}`}
            >
              Request a new code {countdown > 0 ? `(${countdown}s)` : ''}
            </button>
          ) : (
            <button
              onClick={handleResend}
              disabled={countdown > 0}
              className={`text-sm ${countdown > 0 ? 'text-gray-400 cursor-not-allowed' : 'font-bold text-black underline hover:text-gray-700'}`}
            >
              {countdown > 0 ? `Resend code in ${countdown}s` : 'Resend Code'}
            </button>
          )}

          {onGoBack && (
            <button
              onClick={onGoBack}
              className="text-xs text-gray-500 hover:text-black transition-colors"
            >
              Wrong email? Go back
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OtpVerification;
