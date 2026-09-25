import { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/authContext';
import { useWishlist } from '../context/WishlistContext';
import { FiUser, FiBox, FiHeart, FiLogOut, FiMapPin, FiTrash2 } from 'react-icons/fi';
import NavBar from '../components/layout/NavBar';
import Footer from '../components/layout/Footer';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'orders', 'wishlist', 'addresses'
  
  // Editing states
  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState('');
  const [nameError, setNameError] = useState('');
  const [nameSuccess, setNameSuccess] = useState('');
  const [isSavingName, setIsSavingName] = useState(false);


  const { logout, setUser } = useAuth();
  const { wishlist, removeFromWishlist, count, loading: wishlistLoading } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.tab) {
      setActiveTab(location.state.tab);
    }
  }, [location.state?.tab]);

  useEffect(() => {
    let cancelled = false;

    api.get('/profile')
      .then((res) => {
        if (!cancelled) setProfile(res.data.user);
      })
      .catch(() => {
        if (!cancelled) setError('Could not load profile');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore if logout fails on server
    }
    logout();
    navigate('/login');
  };

  const handleSaveName = async () => {
    setNameError('');
    setNameSuccess('');
    const trimmed = editName.trim();
    if (!trimmed || trimmed.length < 2 || trimmed.length > 50) {
      setNameError('Name must be between 2 and 50 characters.');
      return;
    }

    setIsSavingName(true);
    try {
      const res = await api.patch('/profile', { name: trimmed });
      setProfile(res.data.user);
      setUser(res.data.user);
      setNameSuccess('Name updated successfully!');
      setIsEditingName(false);
      setTimeout(() => setNameSuccess(''), 3000);
    } catch (err) {
      setNameError(err.response?.data?.message || 'Failed to update name');
    } finally {
      setIsSavingName(false);
    }
  };


  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center pt-24">
        <p className="text-gray-500 font-medium tracking-wide">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center pt-24">
        <p className="text-red-500 font-medium tracking-wide">{error}</p>
      </div>
    );
  }

  if (!profile) return null;

  // Placeholder arrays for future backend features
  const orders = []; // TODO: Connect to GET /api/orders
  const addresses = []; // Placeholder for Phase C

  return (
    <>
    <NavBar alwaysVisible={true} />
    <div 
      className="min-h-screen bg-[#f4f4f4] flex flex-col md:flex-row pt-[64px] md:pt-[80px]"
      style={{ fontFamily: 'var(--font-nav)' }}
    >
      
      {/* SIDEBAR (Desktop: sticky sidebar, Mobile: sticky horizontal tabs) */}
      <div className="w-full md:w-72 lg:w-80 flex flex-col bg-[#f4f4f4] border-b md:border-b-0 md:border-r border-gray-200 
        sticky top-[64px] md:top-[80px] z-40
        md:h-[calc(100vh-80px)]">
        
        <nav 
          className="flex flex-row md:flex-col overflow-x-auto md:overflow-y-auto flex-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <style>{`nav::-webkit-scrollbar { display: none; }`}</style>
          
          <button 
            onClick={() => setActiveTab('overview')}
            className={`relative flex items-center gap-2 md:gap-5 px-6 md:px-10 py-4 md:py-6 text-sm md:text-base font-semibold tracking-wide transition-colors whitespace-nowrap shrink-0 ${activeTab === 'overview' ? 'bg-white text-black' : 'text-black hover:bg-gray-100'}`}
          >
            {activeTab === 'overview' && (
              <>
                <span className="hidden md:block absolute left-0 top-0 bottom-0 w-1 bg-black"></span>
                <span className="block md:hidden absolute bottom-0 left-0 right-0 h-1 bg-black"></span>
              </>
            )}
            <FiUser className="text-[18px] md:text-[24px]" strokeWidth={1.5} />
            Account Overview
          </button>

          <button 
            onClick={() => setActiveTab('orders')}
            className={`relative flex items-center gap-2 md:gap-5 px-6 md:px-10 py-4 md:py-6 text-sm md:text-base font-semibold tracking-wide transition-colors whitespace-nowrap shrink-0 ${activeTab === 'orders' ? 'bg-white text-black' : 'text-black hover:bg-gray-100'}`}
          >
            {activeTab === 'orders' && (
              <>
                <span className="hidden md:block absolute left-0 top-0 bottom-0 w-1 bg-black"></span>
                <span className="block md:hidden absolute bottom-0 left-0 right-0 h-1 bg-black"></span>
              </>
            )}
            <FiBox className="text-[18px] md:text-[24px]" strokeWidth={1.5} />
            My Orders
          </button>

          <button 
            onClick={() => setActiveTab('wishlist')}
            className={`relative flex items-center gap-2 md:gap-5 px-6 md:px-10 py-4 md:py-6 text-sm md:text-base font-semibold tracking-wide transition-colors whitespace-nowrap shrink-0 ${activeTab === 'wishlist' ? 'bg-white text-black' : 'text-black hover:bg-gray-100'}`}
          >
            {activeTab === 'wishlist' && (
              <>
                <span className="hidden md:block absolute left-0 top-0 bottom-0 w-1 bg-black"></span>
                <span className="block md:hidden absolute bottom-0 left-0 right-0 h-1 bg-black"></span>
              </>
            )}
            <FiHeart className="text-[18px] md:text-[24px]" strokeWidth={1.5} />
            Wishlist
          </button>
          
          {/* Mobile Logout Button embedded in horizontal scroll */}
          <button 
            onClick={handleLogout}
            className="md:hidden relative flex items-center gap-2 px-8 py-4 text-xs font-bold tracking-[0.1em] uppercase transition-colors whitespace-nowrap shrink-0 bg-black text-white hover:bg-gray-800"
          >
            <FiLogOut className="text-[16px]" strokeWidth={1.5} />
            LOGOUT
          </button>
        </nav>

        {/* Desktop Sidebar Bottom (Logout) */}
        <div className="hidden md:flex mt-auto px-6 pt-6 pb-10 flex-col shrink-0 bg-[#f4f4f4]">
          <button 
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-black text-white text-xs font-bold tracking-[0.1em] uppercase hover:bg-gray-800 transition-colors"
          >
            <FiLogOut size={16} strokeWidth={2} />
            LOGOUT
          </button>
        </div>

      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 bg-white">
        <div className="p-6 md:p-12 lg:p-16 xl:p-20">
          
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="animate-fade-in max-w-4xl">
              <h2 className="text-3xl md:text-4xl font-bold text-black mb-10 tracking-tight">Account Overview</h2>
              
              {/* Personal Details Card */}
              <div className="border border-gray-200 p-8 mb-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-black">Personal Details</h3>
                  <div className="flex gap-4">
                    {!isEditingName && (
                      <button 
                        onClick={() => { setIsEditingName(true); setEditName(profile.name); }} 
                        className="text-sm font-bold uppercase tracking-widest underline hover:text-gray-600 transition-colors"
                      >
                        Edit Name
                      </button>
                    )}
                  </div>
                </div>
                
                {nameSuccess && <p className="text-green-600 text-sm font-bold mb-4">{nameSuccess}</p>}

                {isEditingName ? (
                  <div className="mb-6 bg-gray-50 p-6 border border-gray-200">
                    <label className="block text-sm font-bold mb-2">New Name</label>
                    <input 
                      type="text" 
                      value={editName} 
                      onChange={(e) => setEditName(e.target.value)} 
                      className="w-full p-3 border border-gray-300 focus:border-black focus:outline-none mb-2" 
                    />
                    {nameError && <p className="text-red-500 text-xs font-bold mb-2">{nameError}</p>}
                    <div className="flex gap-4 mt-4">
                      <button 
                        onClick={handleSaveName} 
                        disabled={isSavingName} 
                        className="px-6 py-3 bg-black text-white text-xs font-bold tracking-widest uppercase disabled:opacity-50 transition-colors hover:bg-gray-800"
                      >
                        {isSavingName ? 'Saving...' : 'Save'}
                      </button>
                      <button 
                        onClick={() => { setIsEditingName(false); setNameError(''); }} 
                        className="px-6 py-3 border border-gray-300 text-black text-xs font-bold tracking-widest uppercase hover:bg-gray-100 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-700 flex flex-col gap-2 mb-4">
                    <p><span className="font-semibold text-black inline-block w-28">Name:</span> {profile.name}</p>
                    <p><span className="font-semibold text-black inline-block w-28">Email:</span> {profile.email}</p>
                    <p><span className="font-semibold text-black inline-block w-28">Member Since:</span> {new Date(profile.createdAt).toLocaleDateString()}</p>
                  </div>
                )}


              </div>

              {/* 3 Stat Cards Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div 
                  onClick={() => setActiveTab('orders')}
                  className="border border-gray-200 p-6 cursor-pointer hover:border-black transition-colors group flex flex-col justify-between"
                >
                  <h4 className="text-sm font-bold uppercase tracking-wider text-gray-500 group-hover:text-black mb-2">Orders</h4>
                  <p className="text-3xl font-bold text-black">{orders.length}</p>
                </div>
                <div 
                  onClick={() => setActiveTab('wishlist')}
                  className="border border-gray-200 p-6 cursor-pointer hover:border-black transition-colors group flex flex-col justify-between"
                >
                  <h4 className="text-sm font-bold uppercase tracking-wider text-gray-500 group-hover:text-black mb-2">Wishlist</h4>
                  <p className="text-3xl font-bold text-black">{count}</p>
                </div>
                <div 
                  onClick={() => setActiveTab('addresses')}
                  className="border border-gray-200 p-6 cursor-pointer hover:border-black transition-colors group flex flex-col justify-between"
                >
                  <h4 className="text-sm font-bold uppercase tracking-wider text-gray-500 group-hover:text-black mb-2">Saved Addresses</h4>
                  <p className="text-3xl font-bold text-black">{addresses.length}</p>
                </div>
              </div>

              {/* Default Address Card */}
              <div className="border border-gray-200 p-8 mb-10">
                <h3 className="text-xl font-bold text-black mb-4">Default Address</h3>
                {addresses.length > 0 ? (
                  <div className="text-sm text-gray-700">
                    <p>Address goes here</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-gray-500 text-sm mb-4">No address saved yet.</p>
                    <button 
                      className="px-6 py-3 bg-black text-white text-xs font-bold tracking-[0.1em] uppercase hover:bg-gray-800 transition-colors"
                    >
                      Add Address
                    </button>
                  </div>
                )}
              </div>

              <button 
                onClick={() => navigate('/men')}
                className="px-10 py-4 border border-black text-black text-xs font-bold tracking-[0.1em] uppercase hover:bg-black hover:text-white transition-colors"
              >
                Continue Shopping
              </button>

            </div>
          )}

          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="animate-fade-in max-w-5xl">
              <h2 className="text-3xl md:text-4xl font-bold text-black mb-10 tracking-tight">My Orders</h2>
              
              {orders.length > 0 ? (
                <>
                  {/* Filter Pills */}
                  <div className="flex flex-wrap items-center gap-3 mb-10 border-b border-gray-200 pb-6">
                    <button className="px-5 py-2 rounded-full bg-[#3b4045] text-white text-xs font-bold tracking-[0.08em] uppercase transition-colors hover:bg-black">all ({orders.length})</button>
                    <button className="px-5 py-2 rounded-full bg-transparent border border-gray-300 text-gray-600 text-xs font-bold tracking-[0.08em] uppercase transition-colors hover:border-black hover:text-black">in process (0)</button>
                    <button className="px-5 py-2 rounded-full bg-transparent border border-gray-300 text-gray-600 text-xs font-bold tracking-[0.08em] uppercase transition-colors hover:border-black hover:text-black">completed ({orders.length})</button>
                    <div className="flex-1"></div>
                    <button className="px-5 py-2 rounded-full bg-transparent border border-gray-300 text-gray-600 text-xs font-bold tracking-[0.08em] uppercase transition-colors hover:border-black hover:text-black">canceled</button>
                  </div>

                  {/* Orders List */}
                  <div className="flex flex-col gap-6">
                    {/* Header Row */}
                    <div className="grid grid-cols-4 gap-4 px-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2">
                      <div className="col-span-1">Order Number</div>
                      <div className="col-span-1 text-center">Cost</div>
                      <div className="col-span-2 text-right pr-6">Order Status</div>
                    </div>

                    {orders.map((order, idx) => (
                      <div key={idx} className="bg-white rounded-none overflow-hidden border border-gray-200">
                        {/* Order Summary Bar */}
                        <div className="grid grid-cols-4 gap-4 p-5 items-center border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">
                          <div className="col-span-1 text-sm font-bold text-black">{order.id}</div>
                          <div className="col-span-1 text-center text-sm font-bold text-black">{order.cost}</div>
                          <div className="col-span-2 flex items-center justify-end gap-2 pr-2">
                            <span className="flex items-center gap-2 text-xs font-bold text-black uppercase tracking-wider">
                              <span className="w-2 h-2 rounded-full bg-green-500"></span>
                              {order.status}
                            </span>
                          </div>
                        </div>

                        {/* Order Details / Items */}
                        <div className="p-8 flex flex-col gap-6 bg-[#fcfcfc]">
                          {order.items?.map((item, i) => (
                            <div key={i} className="flex items-center gap-6">
                              <div className="w-20 h-24 bg-gray-200 overflow-hidden shrink-0">
                                <img src={item.img} alt={item.name} className="w-full h-full object-cover grayscale opacity-90" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-bold text-black">{item.name}</p>
                              </div>
                              <div className="text-sm text-gray-500 font-medium">
                                Quantity: <span className="text-black font-bold">{item.quantity}</span>
                              </div>
                              <div className="text-sm text-gray-500 font-medium text-right min-w-[80px]">
                                Price: <span className="text-black font-bold">{item.price}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="border border-gray-200 flex flex-col items-center justify-center py-24 text-center bg-[#f9f9f9]">
                  <div className="w-16 h-16 bg-white border border-gray-200 rounded-full flex items-center justify-center mb-6 text-gray-300">
                    <FiBox size={24} />
                  </div>
                  <p className="text-black font-bold text-lg mb-2">You have no orders yet.</p>
                  <p className="text-gray-500 text-sm mb-8">When you place an order, it will appear here.</p>
                  <button 
                    onClick={() => navigate('/men')}
                    className="px-10 py-4 bg-black text-white text-xs font-bold tracking-[0.1em] uppercase hover:bg-gray-800 transition-colors"
                  >
                    Start Shopping
                  </button>
                </div>
              )}
            </div>
          )}

          {/* WISHLIST TAB */}
          {activeTab === 'wishlist' && (
            <div className="animate-fade-in max-w-4xl">
              <h2 className="text-3xl md:text-4xl font-bold text-black mb-10 tracking-tight">Wishlist ({count})</h2>
              
              {wishlistLoading ? (
                <div className="flex items-center justify-center py-24">
                  <p className="text-gray-500 font-medium tracking-wide">Loading wishlist...</p>
                </div>
              ) : wishlist.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {wishlist.map(product => {
                    const price = product.price ? `₹${Number(product.price).toLocaleString("en-IN")}` : '';
                    let imageSrc = product.images?.default?.[0] || product.image;
                    if (product.images?.men?.[0]) imageSrc = product.images.men[0];
                    else if (product.images?.women?.[0]) imageSrc = product.images.women[0];

                    return (
                      <div key={product._id} className="flex border border-gray-200 bg-white p-4 gap-4 items-center relative">
                        <Link to={`/product/${product._id}`} className="shrink-0">
                          <div className="w-24 h-24 bg-gray-100 overflow-hidden">
                            <img src={imageSrc} alt={product.name} className="w-full h-full object-cover" />
                          </div>
                        </Link>
                        <div className="flex-1 flex flex-col pr-8">
                          <Link to={`/product/${product._id}`} className="text-sm font-bold text-black hover:underline mb-1 line-clamp-1">{product.name}</Link>
                          <p className="text-xs text-gray-500 mb-2">{product.brand}</p>
                          <p className="text-sm font-bold text-black">{price}</p>
                        </div>
                        <button 
                          onClick={() => removeFromWishlist(product._id)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                          aria-label="Remove from wishlist"
                        >
                          <FiTrash2 size={20} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="border border-gray-200 flex flex-col items-center justify-center py-24 text-center bg-[#f9f9f9]">
                  <div className="w-16 h-16 bg-white border border-gray-200 rounded-full flex items-center justify-center mb-6 text-gray-300">
                    <FiHeart size={24} />
                  </div>
                  <p className="text-black font-bold text-lg mb-2">Your wishlist is empty</p>
                  <p className="text-gray-500 text-sm mb-8">Save items you love to your wishlist to buy them later.</p>
                  <button 
                    onClick={() => navigate('/men')}
                    className="px-10 py-4 bg-black text-white text-xs font-bold tracking-[0.1em] uppercase hover:bg-gray-800 transition-colors"
                  >
                    Start Shopping
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
    <Footer />
    </>
  );
};

export default Profile;
