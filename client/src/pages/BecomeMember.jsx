import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import api from '../api/axios';

gsap.registerPlugin(ScrollTrigger);

const CONTENT = {
  hero: {
    heading: "Become an XTRN Member",
    tagline: "Join the community that backs athletes at every level.",
    videoUrl: "https://res.cloudinary.com/duvfdxql9/video/upload/v1785950028/heroo_vrbp20.mp4"
  },
  whyJoin: [
    { title: "Join the Community", text: "Train, learn, and grow with athletes who share your drive. Whether you are lacing up for your first run or chasing a personal best, you will find people who understand the effort. Share your journey, learn from others, and keep each other moving." },
    { title: "Stay in the Loop", text: "Hear first about new drops and community updates. We will keep you posted on what is new at XTRN, from fresh gear to stories from the athletes we back. No noise, just the updates that matter to you." },
    { title: "Support for Athletes", text: "A community that backs you, from first run to competition. No matter your level or your sport, you will have a team that believes in your effort. Every athlete starts somewhere, and we are here for every step." },
    { title: "Be Part of Something Bigger", text: "Help us take Indian athletics to the world. Every member adds to a growing movement of people who refuse to settle. Together, we are building a brand and a community that carries the spirit of greatness far beyond our borders." }
  ],
  howItWorks: [
    "Fill the form.",
    "Confirm your email.",
    "Welcome to the community."
  ],
  cta: {
    heading: "GEAR UP. FOR GREATNESS.",
    buttons: [
      { label: "SHOP FOR HIM", url: "/men" },
      { label: "SHOP FOR HER", url: "/women" }
    ]
  }
};

function BecomeMember() {
  const containerRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    sport: '',
    level: '',
    consent: false
  });
  
  const [formStatus, setFormStatus] = useState('idle'); // idle, loading, success, error
  const [formMessage, setFormMessage] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Become a Member | XTRN";
    
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = "description";
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = "Join the XTRN athletic community.";

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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formStatus === 'loading') return;

    if (!formData.name || !formData.email || !formData.sport || !formData.level || !formData.consent) {
      setFormStatus('error');
      setFormMessage('Please fill out all required fields and agree to the consent.');
      return;
    }

    setFormStatus('loading');
    setFormMessage('');

    try {
      const res = await api.post('/members', formData);
      setFormStatus('success');
      setFormMessage(res.data.message || 'Successfully joined the XTRN community!');
      setFormData({ name: '', email: '', phone: '', sport: '', level: '', consent: false });
    } catch (err) {
      setFormStatus('error');
      if (err.response) {
        setFormMessage(err.response.data.message || 'An error occurred. Please try again.');
      } else {
        setFormMessage('Network error. Please check your connection and try again.');
      }
    }
  };

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <div ref={containerRef} className="bg-white min-h-screen">
      
      {/* 1. HERO SECTION */}
      <section className="relative w-full h-[80vh] mt-[72px] md:h-[80vh] md:mt-0">
        <div className="relative h-full w-full overflow-hidden">
          <video autoPlay loop muted playsInline preload="auto" className="absolute inset-0 h-full w-full object-cover">
            <source src={CONTENT.hero.videoUrl} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/50" />
          
          <div className="absolute inset-0 z-10 text-white font-nav flex flex-col justify-center items-center text-center px-4">
            <h1 className="font-bold tracking-tight leading-tight text-[40px] sm:text-[56px] md:text-[72px] lg:text-[80px] mb-4">
              {CONTENT.hero.heading}
            </h1>
            <p className="text-[16px] sm:text-[18px] md:text-[20px] font-medium tracking-wide">
              {CONTENT.hero.tagline}
            </p>
          </div>
        </div>
      </section>

      {/* 2. WHY JOIN */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row gap-12 lg:gap-24 border-t border-gray-200 pt-10">
          
          {/* Left - Section Title */}
          <div className="lg:w-[25%] shrink-0 gsap-fade-up">
            <h2 className="font-nav text-[18px] md:text-[20px] font-bold tracking-tight">Why Join XTRN</h2>
          </div>

          {/* Right - Items */}
          <div className="lg:w-[75%] flex flex-col">
            {CONTENT.whyJoin.map((item, idx) => (
              <div 
                key={idx} 
                className={`pb-12 flex flex-col md:flex-row gap-4 md:gap-12 gsap-fade-up ${idx !== 0 ? 'pt-12 border-t border-gray-200' : ''}`}
              >
                <div className="md:w-[40%] font-nav text-[22px] md:text-[26px] font-bold leading-[1.2] tracking-tight">
                  {item.title}
                </div>
                <div className="md:w-[60%]">
                  <p className="font-nav text-[16px] md:text-[18px] text-gray-500 font-light tracking-wide leading-relaxed">
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 3. HOW IT WORKS */}
      <section className="py-16 px-6 max-w-[1200px] mx-auto border-b border-gray-100">
        <h2 className="font-nav text-3xl md:text-4xl font-bold mb-12 text-center gsap-fade-up">How It Works</h2>
        <div className="flex flex-col md:flex-row justify-center items-center md:items-start gap-12 lg:gap-20">
          {CONTENT.howItWorks.map((step, idx) => (
            <div key={idx} className="flex flex-col items-center text-center gsap-fade-up">
              <div className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center font-bold text-2xl mb-4 font-nav">
                {idx + 1}
              </div>
              <h3 className="font-nav text-[18px] md:text-[20px] font-bold">{step}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* 4. JOIN FORM */}
      <section className="py-16 px-6 bg-gray-50 border-t border-gray-100">
        <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row gap-12 lg:gap-24 gsap-fade-up">
          
          {/* Left Column - Text */}
          <div className="lg:w-[40%] flex flex-col pt-4">
            <h2 className="font-nav text-[48px] md:text-[64px] font-bold mb-6 leading-[1.1] tracking-tight">
              Join the <br className="hidden md:block" /> community.
            </h2>
            <p className="font-nav text-[16px] md:text-[18px] text-gray-500 font-light leading-relaxed mb-10">
              Feel free to reach out with any questions, or fill out the form to become an official member of the XTRN athlete network.
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
            
            <div aria-live="polite" className="mb-8">
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
                <label htmlFor="phone" className="block text-[14px] text-gray-900 font-bold mb-1">Phone Number</label>
                <input 
                  type="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} 
                  className="w-full bg-transparent border-b border-gray-300 py-2.5 outline-none focus:border-black transition-colors text-[15px] text-gray-800 placeholder:text-gray-400" 
                  placeholder="Optional" 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="relative">
                  <label htmlFor="sport" className="block text-[14px] text-gray-900 font-bold mb-1">Main Sport (required)</label>
                  <select 
                    id="sport" name="sport" required value={formData.sport} onChange={handleInputChange} 
                    className="w-full bg-transparent border-b border-gray-300 py-2.5 outline-none focus:border-black transition-colors text-[15px] text-gray-800 appearance-none"
                  >
                    <option value="" disabled>Select a sport</option>
                    <option value="Running">Running</option>
                    <option value="Hiking">Hiking</option>
                    <option value="Gym">Gym</option>
                    <option value="Football">Football</option>
                    <option value="Cricket">Cricket</option>
                    <option value="Other">Other</option>
                  </select>
                  <div className="absolute right-0 bottom-3 pointer-events-none text-gray-500 text-xs">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                  </div>
                </div>
                <div className="relative">
                  <label htmlFor="level" className="block text-[14px] text-gray-900 font-bold mb-1">Experience Level (required)</label>
                  <select 
                    id="level" name="level" required value={formData.level} onChange={handleInputChange} 
                    className="w-full bg-transparent border-b border-gray-300 py-2.5 outline-none focus:border-black transition-colors text-[15px] text-gray-800 appearance-none"
                  >
                    <option value="" disabled>Select level</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Competitive">Competitive</option>
                  </select>
                  <div className="absolute right-0 bottom-3 pointer-events-none text-gray-500 text-xs">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-4">
                <input 
                  type="checkbox" id="consent" name="consent" required checked={formData.consent} onChange={handleInputChange} 
                  className="h-4 w-4 border-gray-300 rounded-full accent-black cursor-pointer shrink-0" 
                />
                <label htmlFor="consent" className="text-[13px] text-gray-600 font-light cursor-pointer">
                  Sign up for news and updates
                </label>
              </div>

              <div className="mt-4">
                <button 
                  type="submit" 
                  disabled={formStatus === 'loading'} 
                  className="bg-black text-white px-8 py-3 rounded-full text-[14px] font-bold tracking-wide hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-max"
                >
                  {formStatus === 'loading' ? 'Joining...' : 'Submit'}
                </button>
              </div>
              
            </form>
          </div>

        </div>
      </section>

      {/* 5. CALL TO ACTION */}
      <section className="py-16 px-6 text-center border-t border-gray-200 bg-white">
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

export default BecomeMember;
