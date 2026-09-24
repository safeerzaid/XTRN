import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import NavBar from '../components/layout/NavBar';
import Footer from '../components/layout/Footer';
import useCartStore from '../store/cartStore';
import { FiTrash2, FiMinus, FiPlus, FiArrowRight } from 'react-icons/fi';
import { useAuth } from '../context/authContext';

function CartPage() {
  const { items, loading, fetchCart, updateQuantity, removeItem, getTotalPrice } = useCartStore();
  const { accessToken, user } = useAuth();
  const isLoggedIn = Boolean(accessToken) || Boolean(user);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isLoggedIn) {
      fetchCart();
    }
  }, [isLoggedIn, fetchCart]);

  const handleQuantityChange = (itemId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity < 1) return;
    updateQuantity(itemId, newQuantity);
  };

  const total = getTotalPrice();

  return (
    <div className="bg-white min-h-screen flex flex-col font-nav">
      <NavBar alwaysVisible={true} />
      
      <main className="flex-grow pt-32 pb-20 px-6 sm:px-10 max-w-7xl mx-auto w-full">
        <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-widest text-black mb-12">
          Your Cart
        </h1>

        {!isLoggedIn ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-gray-800">Please log in to view your cart</h2>
            <button
              onClick={() => navigate('/login', { state: { from: location } })}
              className="bg-black text-white px-8 py-3.5 text-sm uppercase tracking-[0.1em] font-semibold hover:bg-gray-900 transition-colors"
            >
              Login
            </button>
          </div>
        ) : loading && items.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-black"></div>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center border border-gray-100 bg-gray-50/50 rounded-2xl">
            <h2 className="text-xl md:text-2xl font-semibold mb-3 text-gray-800">Your cart is empty</h2>
            <p className="text-gray-500 mb-8 max-w-md">Looks like you haven't added anything to your cart yet. Discover our latest collections.</p>
            <Link
              to="/men"
              className="bg-black text-white px-8 py-3.5 text-sm uppercase tracking-[0.1em] font-semibold hover:bg-gray-900 transition-colors flex items-center gap-3"
            >
              Explore Products <FiArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
            
            {/* Cart Items List */}
            <div className="flex-1 flex flex-col gap-8">
              {items.map((item) => {
                const product = item.product;
                if (!product) return null; // Safety check
                
                return (
                  <div key={item._id} className="flex flex-col sm:flex-row gap-6 pb-8 border-b border-gray-200">
                    {/* Image */}
                    <div className="w-full sm:w-40 h-40 bg-gray-100 flex-shrink-0">
                      {product.images?.default?.[0] ? (
                        <img 
                          src={product.images.default[0]} 
                          alt={product.name} 
                          className="w-full h-full object-cover mix-blend-multiply"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200"></div>
                      )}
                    </div>
                    
                    {/* Item Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-bold uppercase tracking-wide text-black mb-1">{product.name}</h3>
                          <p className="text-sm text-gray-500 capitalize mb-1">{product.category}</p>
                          <p className="text-sm text-gray-500 font-medium mt-3">Size: <span className="text-black uppercase">{item.size}</span></p>
                        </div>
                        <p className="text-lg font-semibold text-black">${product.price.toFixed(2)}</p>
                      </div>

                      <div className="flex justify-between items-center mt-6 sm:mt-0">
                        {/* Quantity Controls */}
                        <div className="flex items-center border border-gray-300 rounded">
                          <button 
                            onClick={() => handleQuantityChange(item._id, item.quantity, -1)}
                            className="p-2 hover:bg-gray-50 transition-colors disabled:opacity-50"
                            disabled={item.quantity <= 1}
                          >
                            <FiMinus size={14} />
                          </button>
                          <span className="w-10 text-center text-sm font-semibold">{item.quantity}</span>
                          <button 
                            onClick={() => handleQuantityChange(item._id, item.quantity, 1)}
                            className="p-2 hover:bg-gray-50 transition-colors"
                          >
                            <FiPlus size={14} />
                          </button>
                        </div>

                        {/* Remove Button */}
                        <button 
                          onClick={() => removeItem(item._id)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-2"
                          aria-label="Remove item"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="w-full lg:w-[380px] flex-shrink-0">
              <div className="bg-gray-50 p-8 rounded-2xl sticky top-32">
                <h2 className="text-xl font-bold uppercase tracking-wider text-black mb-6 border-b border-gray-200 pb-4">
                  Order Summary
                </h2>
                
                <div className="flex flex-col gap-4 mb-6 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estimated Shipping</span>
                    <span className="font-semibold">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estimated Tax</span>
                    <span className="font-semibold">—</span>
                  </div>
                </div>

                <div className="flex justify-between items-center border-t border-gray-200 pt-6 mb-8">
                  <span className="font-bold uppercase tracking-wide">Total</span>
                  <span className="text-xl font-bold">${total.toFixed(2)}</span>
                </div>

                <button className="w-full bg-black text-white py-4 text-sm font-semibold uppercase tracking-[0.1em] hover:bg-gray-900 transition-colors flex items-center justify-center gap-2">
                  Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default CartPage;
