import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import api from '../api/axios';
import { useAuth } from '../context/authContext';
import heroImage from '../assets/images/covers/contact.PNG';

gsap.registerPlugin(ScrollTrigger);

const CONTENT = {
  hero: {
    heading: "Contact Us",
    subtext: "We are here to help.",
    imageUrl: heroImage
  },
  options: [
    { title: "Email us", text: "support@xtrn.com", type: "email", link: "mailto:support@xtrn.com" },
    { title: "Order help", text: "Have your Order ID ready", type: "order", link: "/order-tracking" },
    { title: "Call us", text: "VERIFY: [phone number]", type: "phone", link: "tel:0000000000" }
  ],
  formText: {
    heading: "Send us a message.",
    subtext: "Fill out the form below and our team will get back to you.",
  },
  quickLinksTitle: "Quick Links",
  quickLinks: [
    { title: "Track your order", url: "/order-tracking" },
    { title: "Size Guide", url: "/size-guide" }
  ],
  cta: {
    heading: "GEAR UP. FOR GREATNESS.",
    buttons: [
      { label: "SHOP FOR HIM", url: "/men" },
      { label: "SHOP FOR HER", url: "/women" }
    ]
  }
};

const TOPICS = ['Order', 'Payment', 'Shipping', 'Returns', 'Account', 'Product', 'Other'];

export default function Contact() {
  const containerRef = useRef(null);
  const { isLoggedIn, user } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    topic: '',
    orderId: '',
    message: '',
    website: '' // honeypot
  });
  const [formStatus, setFormStatus] = useState('idle');
  const [formMessage, setFormMessage] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Contact Us | XTRN";
    
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = "description";
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = "Contact the XTRN support team for help with your orders, products, and more.";

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
    if (isLoggedIn && user) {
      setFormData(prev => ({
        ...prev,
        name: prev.name || user.name || '',
        email: prev.email || user.email || ''
      }));
    }
  }, [isLoggedIn, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formStatus === 'loading') return;
    
    if (formData.name.trim().length < 2) {
      setFormStatus('error');
      setFormMessage('Name must be at least 2 characters.');
      return;
    }
    
    if (!formData.topic || !TOPICS.includes(formData.topic)) {
      setFormStatus('error');
      setFormMessage('Please select a valid topic.');
      return;
    }
    
    if (formData.message.trim().length < 10) {
      setFormStatus('error');
      setFormMessage('Message must be at least 10 characters.');
      return;
    }

    setFormStatus('loading');
    setFormMessage('');

    try {
      const res = await api.post('/contact', formData);
      setFormStatus('success');
      setFormMessage(res.data.message || 'Thanks for reaching out. We will get back to you soon.');
      setFormData({
        name: isLoggedIn ? user?.name || '' : '',
        email: isLoggedIn ? user?.email || '' : '',
        topic: '',
        orderId: '',
        message: '',
        website: ''
      });
    } catch (err) {
      setFormStatus('error');
      if (err.response && err.response.status === 429) {
        setFormMessage("Too many messages. Please try again later.");
      } else if (err.response && err.response.data) {
        setFormMessage(err.response.data.message || "An error occurred. Please try again.");
      } else {
        setFormMessage("Network error. Please check your connection and try again.");
      }
    }
  };

  const getIcon = (type) => {
    if (type === 'email') {
      return (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="M22 7l-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7" />
        </svg>
      );
    }
    if (type === 'order') {
      return (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      );
    }
    if (type === 'phone') {
      return (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      );
    }
    return null;
  };

  return (
    <div ref={containerRef} className="bg-white min-h-screen">
      
      {/* 1. HERO */}
      <section className="relative w-full h-[60vh] mt-[72px] md:h-[60vh] md:mt-0">
        <div className="relative h-full w-full overflow-hidden">
          <img
            src={CONTENT.hero.imageUrl}
            alt="Contact Us Hero"
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

      {/* 2. CONTACT OPTIONS */}
      <section className="py-24 px-6 border-b border-gray-100">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {CONTENT.options.map((opt, idx) => {
              const isExternal = opt.link.startsWith('http') || opt.link.startsWith('mailto:') || opt.link.startsWith('tel:');
              
              const CardContent = () => (
                <div className="bg-white border border-gray-200 p-8 rounded-2xl flex flex-col items-start hover:border-black transition-colors h-full w-full">
                  <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mb-6">
                    {getIcon(opt.type)}
                  </div>
                  <h3 className="font-nav text-[20px] font-bold mb-2">{opt.title}</h3>
                  <p className="font-nav text-[15px] text-gray-500 font-light">{opt.text}</p>
                </div>
              );

              return isExternal ? (
                <a href={opt.link} key={idx} className="block gsap-fade-up">
                  <CardContent />
                </a>
              ) : (
                <Link to={opt.link} key={idx} className="block gsap-fade-up">
                  <CardContent />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. CONTACT FORM */}
      <section className="py-20 px-6 bg-gray-50 border-b border-gray-100">
        <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row gap-12 lg:gap-24 gsap-fade-up">
          
          {/* Left Column - Text */}
          <div className="lg:w-[40%] flex flex-col pt-4">
            <h2 className="font-nav text-[48px] md:text-[64px] font-bold mb-6 leading-[1.1] tracking-tight">
              {CONTENT.formText.heading}
            </h2>
            <p className="font-nav text-[16px] md:text-[18px] text-gray-500 font-light leading-relaxed mb-6">
              {CONTENT.formText.subtext}
            </p>
            <p className="font-nav text-[15px] text-gray-500 mb-10">
              Need help with an order? <Link to="/order-tracking" className="text-black font-bold border-b border-black hover:text-gray-600 hover:border-gray-600 transition-colors">Track it here.</Link>
            </p>
            <div className="flex items-center gap-3 text-gray-800 font-nav font-bold text-[15px]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              <span>support@xtrn.com</span>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="lg:w-[60%] bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-gray-100">
            <div aria-live="polite" className="mb-8 min-h-[50px]">
              {formStatus === 'success' && (
                <div className="p-4 bg-green-50 text-green-800 border border-green-200 rounded-lg font-nav font-medium text-[15px] text-center">
                  {formMessage}
                </div>
              )}
              {formStatus === 'error' && (
                <div className="p-4 bg-red-50 text-red-800 border border-red-200 rounded-lg font-nav font-medium text-[15px] text-center">
                  {formMessage}
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="font-nav flex flex-col gap-6">
              
              {/* Honeypot */}
              <div className="sr-only" aria-hidden="true">
                <input type="text" name="website" tabIndex="-1" autoComplete="off" value={formData.website} onChange={handleInputChange} />
              </div>

              <div>
                <label htmlFor="name" className="block text-[14px] text-gray-900 font-bold mb-1">Full Name (required)</label>
                <input 
                  type="text" id="name" name="name" required value={formData.name} onChange={handleInputChange} 
                  className="w-full bg-transparent border-b border-gray-300 py-2.5 outline-none focus:border-black transition-colors text-[15px] text-gray-800 placeholder:text-gray-400" 
                  placeholder="First and Last Name" 
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-[14px] text-gray-900 font-bold mb-1">Email (required)</label>
                <input 
                  type="email" id="email" name="email" required value={formData.email} onChange={handleInputChange} 
                  className="w-full bg-transparent border-b border-gray-300 py-2.5 outline-none focus:border-black transition-colors text-[15px] text-gray-800 placeholder:text-gray-400" 
                  placeholder="name@example.com" 
                />
              </div>

              <div>
                <label htmlFor="topic" className="block text-[14px] text-gray-900 font-bold mb-1">Topic (required)</label>
                <select 
                  id="topic" name="topic" required value={formData.topic} onChange={handleInputChange}
                  className="w-full bg-transparent border-b border-gray-300 py-2.5 outline-none focus:border-black transition-colors text-[15px] text-gray-800"
                >
                  <option value="" disabled>Select a topic</option>
                  {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label htmlFor="orderId" className="block text-[14px] text-gray-900 font-bold mb-1">Order ID</label>
                <input 
                  type="text" id="orderId" name="orderId" value={formData.orderId} onChange={handleInputChange} 
                  className="w-full bg-transparent border-b border-gray-300 py-2.5 outline-none focus:border-black transition-colors text-[15px] text-gray-800 placeholder:text-gray-400" 
                  placeholder="Optional" 
                />
              </div>

              <div>
                <div className="flex justify-between items-end mb-1">
                  <label htmlFor="message" className="block text-[14px] text-gray-900 font-bold">Message (required)</label>
                  <span className={`text-[12px] ${formData.message.length > 1000 ? 'text-red-500 font-bold' : 'text-gray-400'}`}>
                    {formData.message.length} / 1000
                  </span>
                </div>
                <textarea 
                  id="message" name="message" required value={formData.message} onChange={handleInputChange} 
                  rows="4"
                  className="w-full bg-transparent border-b border-gray-300 py-2.5 outline-none focus:border-black transition-colors text-[15px] text-gray-800 placeholder:text-gray-400 resize-none" 
                  placeholder="How can we help?" 
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={formStatus === 'loading'}
                className="w-full bg-black text-white font-bold py-4 rounded-full mt-4 hover:bg-gray-900 transition-colors tracking-wide disabled:bg-gray-400"
              >
                {formStatus === 'loading' ? 'Sending...' : 'Send Message'}
              </button>

            </form>
          </div>
        </div>
      </section>

      {/* 4. CALL TO ACTION */}
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
