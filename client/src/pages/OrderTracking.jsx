import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import api from '../api/axios';
import { useAuth } from '../context/authContext';
import { formatPrice } from '../utils/formatPrice';
import heroImage from '../assets/images/covers/order.jpeg';

gsap.registerPlugin(ScrollTrigger);

const CONTENT = {
  hero: {
    heading: "Track Your Order",
    subtext: "Know where your gear is.",
    imageUrl: heroImage
  },
  howItWorks: [
    { title: "Find your Order ID", text: "In your confirmation email or under My Orders in your profile." },
    { title: "Use your order email", text: "The email you used at checkout." },
    { title: "Check your status", text: "Status updates as we pack and ship your order." }
  ],
  needHelp: {
    text: "Order not moving? Our team is happy to help.",
    linkText: "Contact us",
    mailto: "mailto:support@xtrn.com"
  },
  cta: {
    heading: "GEAR UP. FOR GREATNESS.",
    buttons: [
      { label: "SHOP FOR HIM", url: "/men" },
      { label: "SHOP FOR HER", url: "/women" }
    ]
  }
};

const ORDER_STATUS_STEPS = ['pending', 'processing', 'shipped', 'delivered'];

export default function OrderTracking() {
  const containerRef = useRef(null);
  const resultRef = useRef(null);
  const { isLoggedIn, user } = useAuth();
  
  const [formData, setFormData] = useState({ orderId: '', email: '' });
  const [formStatus, setFormStatus] = useState('idle');
  const [formMessage, setFormMessage] = useState('');
  const [orderResult, setOrderResult] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Track Order | XTRN";
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = "description";
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = "Track your XTRN order status.";

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray('.gsap-fade-up').forEach((el) => {
        gsap.fromTo(el, 
          { y: 30, opacity: 0 }, 
          {
            y: 0, opacity: 1, duration: 0.8, ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none none"
            }
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (isLoggedIn && user?.email) {
      setFormData(prev => ({ ...prev, email: user.email }));
      const fetchRecentOrders = async () => {
        try {
          const res = await api.get('/orders');
          if (res.data && Array.isArray(res.data)) {
            setRecentOrders(res.data.slice(0, 5));
          }
        } catch (e) {
          // silently skip
        }
      };
      fetchRecentOrders();
    }
  }, [isLoggedIn, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formStatus === 'loading') return;
    
    if (!formData.orderId || !formData.email) {
      setFormStatus('error');
      setFormMessage('Please provide both Order ID and Email.');
      return;
    }

    setFormStatus('loading');
    setFormMessage('');
    setOrderResult(null);

    try {
      const res = await api.post('/orders/track', formData);
      setOrderResult(res.data);
      setFormStatus('success');
      
      // Scroll to result
      setTimeout(() => {
        if (resultRef.current) {
          resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
      
    } catch (err) {
      setFormStatus('error');
      if (err.response && err.response.data) {
        setFormMessage(err.response.data.message || "We couldn't find an order with those details.");
      } else {
        setFormMessage("Network error. Please check your connection and try again.");
      }
    }
  };

  const renderTimeline = (currentStatus) => {
    if (currentStatus === 'cancelled') {
      return (
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl font-nav">
          <div className="font-bold text-lg mb-2 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-600 inline-block"></span>
            Cancelled
          </div>
          <p>This order was cancelled. If you paid online, your refund will be processed by our team.</p>
        </div>
      );
    }

    const currentIndex = ORDER_STATUS_STEPS.indexOf(currentStatus);
    
    return (
      <div className="flex flex-col md:flex-row justify-between relative mt-8 mb-4 md:px-8">
        <div className="hidden md:block absolute top-5 left-10 right-10 h-[2px] bg-gray-200 z-0"></div>
        <div className="md:hidden absolute top-0 left-5 w-[2px] h-full bg-gray-200 z-0"></div>

        {ORDER_STATUS_STEPS.map((step, idx) => {
          const isCompleted = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          const isUpcoming = idx > currentIndex;

          return (
            <div key={step} className="relative z-10 flex flex-row md:flex-col items-center md:items-center gap-4 md:gap-3 mb-6 md:mb-0">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center shrink-0
                ${isCompleted ? 'bg-black border-[2px] border-black' : 
                  isCurrent ? 'bg-white border-[2px] border-black' : 
                  'bg-white border-[2px] border-gray-300'}
              `}>
                {isCompleted && (
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {isCurrent && (
                  <svg className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                )}
                {isUpcoming && (
                  <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </div>
              <span className={`font-nav text-[14px] capitalize tracking-wide text-left md:text-center leading-tight ${
                isCurrent ? 'font-bold text-black' : 'font-medium text-gray-400'
              }`}>
                {step}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div ref={containerRef} className="bg-white min-h-screen">
      
      {/* 1. HERO */}
      <section className="relative w-full h-[60vh] mt-[72px] md:h-[60vh] md:mt-0">
        <div className="relative h-full w-full overflow-hidden">
          <img
            src={CONTENT.hero.imageUrl}
            alt="Track Order Hero"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
          
          <div className="absolute inset-0 z-10 text-white font-nav flex flex-col justify-center items-center text-center px-4">
            <h1 className="font-bold tracking-tight leading-tight text-[40px] sm:text-[56px] md:text-[64px] mb-4 uppercase gsap-fade-up">
              {CONTENT.hero.heading}
            </h1>
            <p className="text-[16px] sm:text-[18px] md:text-[20px] font-medium tracking-wide text-gray-200 gsap-fade-up">
              {CONTENT.hero.subtext}
            </p>
          </div>
        </div>
      </section>

      {/* 2. TRACK FORM */}
      <section className="py-20 px-6 bg-gray-50 border-b border-gray-200">
        <div className="max-w-[600px] mx-auto gsap-fade-up">
          <form onSubmit={handleSubmit} className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-8">
            <div className="text-center">
              <h2 className="font-nav text-3xl font-bold mb-2">Find Your Order</h2>
              <p className="text-gray-500 font-nav font-light">Enter your details below to track status.</p>
            </div>

            {formStatus === 'error' && (
              <div aria-live="polite" className="bg-red-50 text-red-600 p-4 rounded-lg font-nav text-sm border border-red-100">
                {formMessage}
              </div>
            )}

            {isLoggedIn && recentOrders.length > 0 && (
              <div className="flex flex-col gap-2">
                <span className="font-nav text-xs font-bold text-gray-500 uppercase tracking-wide">Recent Orders</span>
                <div className="flex flex-wrap gap-2">
                  {recentOrders.map(order => (
                    <button
                      key={order._id}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, orderId: order._id }))}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-black rounded-full font-nav text-[13px] font-medium transition-colors"
                    >
                      ...{order._id.slice(-6).toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-6">
              <div className="relative border-b border-gray-300 focus-within:border-black transition-colors">
                <input
                  type="text"
                  name="orderId"
                  id="orderId"
                  value={formData.orderId}
                  onChange={handleInputChange}
                  placeholder=" "
                  className="peer w-full bg-transparent pt-5 pb-2 text-[16px] text-black font-nav outline-none"
                  required
                />
                <label htmlFor="orderId" className="absolute left-0 top-3 text-[15px] font-nav text-gray-500 transition-all peer-focus:-top-2 peer-focus:text-[12px] peer-focus:text-black peer-focus:font-bold peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:[12px] peer-[:not(:placeholder-shown)]:font-bold peer-[:not(:placeholder-shown)]:text-black pointer-events-none">
                  Order ID
                </label>
              </div>

              <div className="relative border-b border-gray-300 focus-within:border-black transition-colors">
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder=" "
                  className="peer w-full bg-transparent pt-5 pb-2 text-[16px] text-black font-nav outline-none"
                  required
                />
                <label htmlFor="email" className="absolute left-0 top-3 text-[15px] font-nav text-gray-500 transition-all peer-focus:-top-2 peer-focus:text-[12px] peer-focus:text-black peer-focus:font-bold peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:[12px] peer-[:not(:placeholder-shown)]:font-bold peer-[:not(:placeholder-shown)]:text-black pointer-events-none">
                  Email Address
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={formStatus === 'loading'}
              className="w-full bg-black text-white rounded-full py-4 font-nav font-bold tracking-wide hover:bg-gray-900 transition-colors disabled:bg-gray-400"
            >
              {formStatus === 'loading' ? 'Tracking...' : 'Track Order'}
            </button>
          </form>
        </div>
      </section>

      {/* 3. RESULT CARD */}
      {orderResult && (
        <section ref={resultRef} className="py-20 px-6 bg-white border-b border-gray-200">
          <div className="max-w-[800px] mx-auto gsap-fade-up">
            <div className="border border-gray-200 rounded-2xl p-6 md:p-10 shadow-sm">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-6 mb-8">
                <div>
                  <h2 className="font-nav text-2xl font-bold">Order #{orderResult._id.slice(-6).toUpperCase()}</h2>
                  <p className="font-nav text-gray-500 text-sm mt-1">
                    Placed on {new Date(orderResult.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
                <div className="flex flex-col items-start md:items-end font-nav text-sm">
                  <span className="text-gray-500 uppercase tracking-wide text-xs font-bold">Payment</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-bold">{orderResult.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online'}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide
                      ${orderResult.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 
                        orderResult.paymentStatus === 'failed' ? 'bg-red-100 text-red-700' :
                        orderResult.paymentStatus === 'refunded' ? 'bg-gray-100 text-gray-700' :
                        'bg-yellow-100 text-yellow-700'}
                    `}>
                      {orderResult.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-10">
                {renderTimeline(orderResult.status)}
              </div>

              <div className="mb-10">
                <h3 className="font-nav text-lg font-bold mb-4">Items</h3>
                <div className="flex flex-col gap-4">
                  {orderResult.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-gray-50 p-4 rounded-xl font-nav">
                      <div>
                        <div className="font-bold text-gray-900">{item.name}</div>
                        <div className="text-sm text-gray-500 mt-0.5">Size: {item.size} • Qty: {item.quantity}</div>
                      </div>
                      <div className="font-bold">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-between items-center p-4 border-t border-gray-200 font-nav mt-2">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="font-bold text-xl">{formatPrice(orderResult.totalAmount)}</span>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="font-nav text-lg font-bold mb-3">Delivery To</h3>
                <p className="font-nav text-gray-600 bg-gray-50 p-4 rounded-xl">
                  {orderResult.shippingAddress.city}, {orderResult.shippingAddress.state} {orderResult.shippingAddress.pincode}
                </p>
              </div>

              <div className="text-center pt-6 border-t border-gray-100">
                <button 
                  onClick={() => {
                    setOrderResult(null);
                    setFormData({ orderId: '', email: '' });
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="font-nav font-bold text-[14px] text-gray-500 hover:text-black underline transition-colors"
                >
                  Track another order
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. HOW IT WORKS */}
      <section className="py-24 px-6 border-b border-gray-100">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16 gsap-fade-up">
            <h2 className="font-nav text-[32px] md:text-[40px] font-bold">How Tracking Works</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {CONTENT.howItWorks.map((step, idx) => (
              <div key={idx} className="bg-white border border-gray-200 p-8 rounded-2xl flex flex-col items-start gsap-fade-up hover:border-black transition-colors">
                <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold mb-6 font-nav">
                  {idx + 1}
                </div>
                <h3 className="font-nav text-[20px] font-bold mb-3">{step.title}</h3>
                <p className="font-nav text-[15px] text-gray-500 leading-relaxed font-light">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. NEED HELP */}
      <section className="bg-gray-50 py-16 px-6 border-b border-gray-200">
        <div className="max-w-[1200px] mx-auto text-center gsap-fade-up flex flex-col sm:flex-row items-center justify-center gap-4">
          <p className="font-nav text-[18px] md:text-[20px] font-bold text-gray-900">{CONTENT.needHelp.text}</p>
          <a href={CONTENT.needHelp.mailto} className="font-nav text-[15px] font-bold text-black border-b-2 border-black hover:text-gray-600 hover:border-gray-600 transition-colors pb-0.5">
            {CONTENT.needHelp.linkText}
          </a>
        </div>
      </section>

      {/* 6. CALL TO ACTION */}
      <section className="py-24 px-6 text-center border-t border-gray-200">
        <div className="max-w-[600px] mx-auto gsap-fade-up">
          <h2 className="font-nav text-4xl md:text-6xl font-bold mb-10 uppercase">{CONTENT.cta.heading}</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {CONTENT.cta.buttons.map((btn, idx) => (
              <Link key={idx} to={btn.url} className="bg-black border-2 border-black text-white px-8 py-3.5 rounded-full text-[13px] md:text-[14px] font-bold tracking-wide hover:bg-white hover:text-black transition-colors">
                {btn.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
