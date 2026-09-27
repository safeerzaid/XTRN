import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useCartStore from '../store/cartStore';
import api from '../api/axios';
import { useAuth } from '../context/authContext';

function CheckoutPage() {
  const { items, getTotalPrice, fetchCart } = useCartStore();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [showResend, setShowResend] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const [isResending, setIsResending] = useState(false);

  const total = getTotalPrice();

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setError('');

    try {
      await api.post('/orders');
      await fetchCart();
      navigate('/orders');
    } catch (err) {
      if (err.response?.status === 403 && err.response?.data?.message?.includes('verify your email')) {
        setError('Please verify your email to place an order.');
        setShowResend(true);
      } else {
        setError(err.response?.data?.message || 'Failed to place order. Please try again.');
        setShowResend(false);
      }
      setIsProcessing(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    setResendMessage('');
    try {
      const response = await api.post("/auth/resend-verification", { email: user?.email });
      setResendMessage(response.data.message);
      setError('');
      setShowResend(false);
    } catch (error) {
      setResendMessage(error.response?.data?.message || 'Failed to resend email');
    } finally {
      setIsResending(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20 font-nav">
        <h2 className="text-2xl font-bold mb-4 uppercase">Your cart is empty</h2>
        <button 
          onClick={() => navigate('/men')}
          className="bg-black text-white px-8 py-3 text-sm font-semibold uppercase tracking-wider hover:bg-gray-900 transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pt-32 pb-20 px-6 sm:px-10 max-w-7xl mx-auto font-nav">
      <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-widest text-black mb-12">
        Checkout
      </h1>

      <div className="flex flex-col lg:flex-row gap-12">
        
        {/* Checkout Form Placeholder */}
        <div className="flex-1">
          <h2 className="text-xl font-bold uppercase tracking-wider mb-6">Shipping Details</h2>
          <form onSubmit={handlePlaceOrder} className="flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="First Name" required className="border border-gray-300 p-3 w-full rounded-none outline-none focus:border-black" />
              <input type="text" placeholder="Last Name" required className="border border-gray-300 p-3 w-full rounded-none outline-none focus:border-black" />
            </div>
            <input type="text" placeholder="Address" required className="border border-gray-300 p-3 w-full rounded-none outline-none focus:border-black" />
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="City" required className="border border-gray-300 p-3 w-full rounded-none outline-none focus:border-black" />
              <input type="text" placeholder="Postal Code" required className="border border-gray-300 p-3 w-full rounded-none outline-none focus:border-black" />
            </div>
            
            <h2 className="text-xl font-bold uppercase tracking-wider mt-6 mb-2">Payment</h2>
            <div className="p-4 border border-gray-300 bg-gray-50 text-gray-500 text-sm">
              Cash on Delivery (Standard)
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg flex flex-col gap-2">
                <span>{error}</span>
                {showResend && (
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={isResending}
                    className="font-bold underline hover:text-red-800 disabled:opacity-50 text-left"
                  >
                    {isResending ? 'Sending...' : 'Resend verification email'}
                  </button>
                )}
              </div>
            )}
            {resendMessage && (
              <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-lg">
                {resendMessage}
              </div>
            )}

            <button 
              type="submit" 
              disabled={isProcessing}
              className="mt-6 w-full bg-black text-white py-4 text-sm font-semibold uppercase tracking-[0.1em] hover:bg-gray-900 transition-colors disabled:opacity-50"
            >
              {isProcessing ? 'Processing Order...' : 'Place Order'}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-[380px] flex-shrink-0">
          <div className="bg-gray-50 p-8 rounded-2xl sticky top-32">
            <h2 className="text-xl font-bold uppercase tracking-wider text-black mb-6 border-b border-gray-200 pb-4">
              Order Summary
            </h2>
            
            <div className="flex flex-col gap-4 mb-6 max-h-64 overflow-y-auto">
              {items.map(item => (
                <div key={item._id} className="flex gap-4 text-sm">
                  <div className="w-16 h-16 bg-gray-200 flex-shrink-0">
                    {item.product?.images?.default?.[0] && (
                      <img src={item.product.images.default[0]} alt="" className="w-full h-full object-cover mix-blend-multiply" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold">{item.product?.name}</p>
                    <p className="text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold">${(item.product?.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center border-t border-gray-200 pt-6 mb-2">
              <span className="font-bold uppercase tracking-wide">Total</span>
              <span className="text-xl font-bold">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default CheckoutPage;
