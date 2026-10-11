import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import heroImage from '../assets/images/covers/size.PNG';

gsap.registerPlugin(ScrollTrigger);

// ALL TEXT CONTENT (Easy to edit)
// VERIFY AGAINST REAL XTRN SIZE DATA BEFORE LAUNCH

const formatMeasurement = (valueCm, unit) => {
  if (unit === 'cm' || !valueCm || !valueCm.includes('-')) return valueCm;
  const parts = valueCm.split('-');
  if (parts.length === 2) {
    const minInch = (parseFloat(parts[0]) / 2.54).toFixed(1);
    const maxInch = (parseFloat(parts[1]) / 2.54).toFixed(1);
    return `${minInch}-${maxInch}`;
  }
  return valueCm;
};

const CONTENT = {
  hero: {
    heading: "Size Guide",
    subtext: "Find your perfect fit.",
    imageUrl: heroImage
  },
  howToMeasure: {
    title: "How to Measure",
    note: "Use a soft measuring tape and measure over light clothing.",
    steps: [
      { name: "Chest", text: "Measure around the fullest part of your chest, keeping the tape level." },
      { name: "Waist", text: "Measure around your natural waistline, just above the belly button." },
      { name: "Hips", text: "Measure around the fullest part of your hips." },
      { name: "Inseam", text: "Measure from the top of your inner thigh to your ankle." },
      { name: "Foot length", text: "Stand on a sheet of paper, mark your heel and longest toe, and measure the distance." }
    ]
  },
  sizeCharts: {
    tabs: [
      { id: 'men', label: 'Men Apparel' },
      { id: 'women', label: 'Women Apparel' },
      { id: 'footwear', label: 'Footwear' }
    ],
    men: [
      { size: "XS", chest: "81-86", waist: "66-71", hips: "86-91" },
      { size: "S", chest: "87-92", waist: "72-77", hips: "92-97" },
      { size: "M", chest: "93-98", waist: "78-83", hips: "98-103" },
      { size: "L", chest: "99-106", waist: "84-91", hips: "104-109" },
      { size: "XL", chest: "107-114", waist: "92-99", hips: "110-115" },
      { size: "XXL", chest: "115-122", waist: "100-107", hips: "116-121" }
    ],
    women: [
      { size: "XS", chest: "76-81", waist: "58-63", hips: "84-89" },
      { size: "S", chest: "82-87", waist: "64-69", hips: "90-95" },
      { size: "M", chest: "88-93", waist: "70-75", hips: "96-101" },
      { size: "L", chest: "94-100", waist: "76-82", hips: "102-107" },
      { size: "XL", chest: "101-108", waist: "83-90", hips: "108-114" },
      { size: "XXL", chest: "109-116", waist: "91-98", hips: "115-121" }
    ],
    footwear: [
      { uk_in: "--", us: "--", eu: "--", cm: "--" },
      { uk_in: "--", us: "--", eu: "--", cm: "--" },
      { uk_in: "--", us: "--", eu: "--", cm: "--" },
      { uk_in: "--", us: "--", eu: "--", cm: "--" },
      { uk_in: "--", us: "--", eu: "--", cm: "--" },
      { uk_in: "--", us: "--", eu: "--", cm: "--" }
    ]
  },
  fitTips: {
    title: "Fit Tips",
    tips: [
      { title: "Between sizes", text: "If you are between sizes, size up for comfort or size down for a snug, performance fit." },
      { title: "Compression wear", text: "Compression wear is designed to fit close to the body. Choose your usual size for a snug fit." },
      { title: "Hoodies and jackets", text: "Planning to layer? Consider going one size up." }
    ]
  },
  needHelp: {
    text: "Still unsure? Our team is happy to help.",
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

function SizeGuide() {
  const containerRef = useRef(null);
  const tabRefs = useRef([]);
  const [activeTab, setActiveTab] = useState('men');
  const [unit, setUnit] = useState('cm'); // 'cm' or 'inch'

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);

    // Prefer reduced motion check
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Fade up elements
      gsap.utils.toArray('.gsap-fade-up').forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
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

  const handleTabKeyDown = (e, index) => {
    let newIndex = index;
    if (e.key === 'ArrowRight') {
      newIndex = (index + 1) % CONTENT.sizeCharts.tabs.length;
    } else if (e.key === 'ArrowLeft') {
      newIndex = (index - 1 + CONTENT.sizeCharts.tabs.length) % CONTENT.sizeCharts.tabs.length;
    }
    
    if (newIndex !== index) {
      e.preventDefault();
      setActiveTab(CONTENT.sizeCharts.tabs[newIndex].id);
      tabRefs.current[newIndex]?.focus();
    }
  };

  return (
    <div className="bg-white min-h-screen" ref={containerRef}>
      <Helmet>
        <title>Size Guide | XTRN</title>
        <meta name="description" content="Find your perfect fit with the XTRN size guide for men's and women's athletic apparel and footwear." />
      </Helmet>

      {/* 1. HERO */}
      <section className="relative w-full h-[60vh] mt-[72px] md:h-[60vh] md:mt-0">
        <div className="relative h-full w-full overflow-hidden">
          <img
            src={CONTENT.hero.imageUrl}
            alt="Size Guide Hero"
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

      {/* 2. HOW TO MEASURE */}
      <section className="py-24 px-6 border-b border-gray-100">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16 gsap-fade-up">
            <h2 className="font-nav text-[32px] md:text-[40px] font-bold mb-4">{CONTENT.howToMeasure.title}</h2>
            <p className="font-nav text-[16px] text-gray-500 font-light max-w-[600px] mx-auto bg-gray-50 py-3 px-6 rounded-full inline-block">
              {CONTENT.howToMeasure.note}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {CONTENT.howToMeasure.steps.map((step, idx) => (
              <div key={idx} className="bg-white border border-gray-200 p-8 rounded-2xl flex flex-col items-start gsap-fade-up hover:border-black transition-colors">
                <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold mb-6">
                  {idx + 1}
                </div>
                <h3 className="font-nav text-[20px] font-bold mb-3">{step.name}</h3>
                <p className="font-nav text-[15px] text-gray-500 leading-relaxed font-light">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. SIZE CHARTS */}
      <section className="py-24 px-6 bg-gray-50 border-b border-gray-100">
        <div className="max-w-[1000px] mx-auto gsap-fade-up">
          
          {/* Tabs & Unit Toggle */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
            
            {/* Tabs */}
            <div 
              role="tablist" 
              aria-label="Size chart categories"
              className="flex bg-white p-1 rounded-full border border-gray-200 shadow-sm"
            >
              {CONTENT.sizeCharts.tabs.map((tab, idx) => (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  aria-controls={`panel-${tab.id}`}
                  id={`tab-${tab.id}`}
                  tabIndex={activeTab === tab.id ? 0 : -1}
                  ref={el => tabRefs.current[idx] = el}
                  onKeyDown={(e) => handleTabKeyDown(e, idx)}
                  onClick={() => setActiveTab(tab.id)}
                  className={`font-nav text-[14px] md:text-[15px] font-bold px-6 py-2.5 rounded-full transition-all outline-none focus-visible:ring-2 focus-visible:ring-black ${activeTab === tab.id ? 'bg-black text-white shadow-md' : 'text-gray-500 hover:text-black'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Unit Toggle (only for apparel) */}
            {activeTab !== 'footwear' && (
              <div className="flex items-center bg-white border border-gray-200 rounded-full p-1 shadow-sm">
                <button
                  onClick={() => setUnit('cm')}
                  className={`font-nav text-[13px] font-bold px-4 py-1.5 rounded-full transition-colors ${unit === 'cm' ? 'bg-gray-200 text-black' : 'text-gray-400 hover:text-black'}`}
                  aria-label="Switch to centimeters"
                >
                  cm
                </button>
                <button
                  onClick={() => setUnit('inch')}
                  className={`font-nav text-[13px] font-bold px-4 py-1.5 rounded-full transition-colors ${unit === 'inch' ? 'bg-gray-200 text-black' : 'text-gray-400 hover:text-black'}`}
                  aria-label="Switch to inches"
                >
                  inch
                </button>
              </div>
            )}
          </div>

          {/* Tab Panels */}
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            
            {/* MEN APPAREL TABLE */}
            <div 
              role="tabpanel" 
              id="panel-men" 
              aria-labelledby="tab-men"
              hidden={activeTab !== 'men'}
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left font-nav whitespace-nowrap">
                  <caption className="sr-only">Men's Apparel Size Chart</caption>
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th scope="col" className="px-6 py-4 text-[14px] font-bold text-gray-800 uppercase tracking-wide">Size</th>
                      <th scope="col" className="px-6 py-4 text-[14px] font-bold text-gray-800 uppercase tracking-wide">Chest ({unit})</th>
                      <th scope="col" className="px-6 py-4 text-[14px] font-bold text-gray-800 uppercase tracking-wide">Waist ({unit})</th>
                      <th scope="col" className="px-6 py-4 text-[14px] font-bold text-gray-800 uppercase tracking-wide">Hips ({unit})</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {CONTENT.sizeCharts.men.map((row, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-[15px] font-bold">{row.size}</td>
                        <td className="px-6 py-4 text-[15px] text-gray-600">{formatMeasurement(row.chest, unit)}</td>
                        <td className="px-6 py-4 text-[15px] text-gray-600">{formatMeasurement(row.waist, unit)}</td>
                        <td className="px-6 py-4 text-[15px] text-gray-600">{formatMeasurement(row.hips, unit)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="px-6 py-4 text-[13px] text-gray-500 font-nav italic border-t border-gray-100">
                  Measurements are body measurements. Fit may vary slightly by product.
                </p>
              </div>
            </div>

            {/* WOMEN APPAREL TABLE */}
            <div 
              role="tabpanel" 
              id="panel-women" 
              aria-labelledby="tab-women"
              hidden={activeTab !== 'women'}
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left font-nav whitespace-nowrap">
                  <caption className="sr-only">Women's Apparel Size Chart</caption>
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th scope="col" className="px-6 py-4 text-[14px] font-bold text-gray-800 uppercase tracking-wide">Size</th>
                      <th scope="col" className="px-6 py-4 text-[14px] font-bold text-gray-800 uppercase tracking-wide">Chest ({unit})</th>
                      <th scope="col" className="px-6 py-4 text-[14px] font-bold text-gray-800 uppercase tracking-wide">Waist ({unit})</th>
                      <th scope="col" className="px-6 py-4 text-[14px] font-bold text-gray-800 uppercase tracking-wide">Hips ({unit})</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {CONTENT.sizeCharts.women.map((row, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-[15px] font-bold">{row.size}</td>
                        <td className="px-6 py-4 text-[15px] text-gray-600">{formatMeasurement(row.chest, unit)}</td>
                        <td className="px-6 py-4 text-[15px] text-gray-600">{formatMeasurement(row.waist, unit)}</td>
                        <td className="px-6 py-4 text-[15px] text-gray-600">{formatMeasurement(row.hips, unit)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="px-6 py-4 text-[13px] text-gray-500 font-nav italic border-t border-gray-100">
                  Measurements are body measurements. Fit may vary slightly by product.
                </p>
              </div>
            </div>

            {/* FOOTWEAR TABLE */}
            <div 
              role="tabpanel" 
              id="panel-footwear" 
              aria-labelledby="tab-footwear"
              hidden={activeTab !== 'footwear'}
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left font-nav whitespace-nowrap">
                  <caption className="sr-only">Footwear Size Chart</caption>
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th scope="col" className="px-6 py-4 text-[14px] font-bold text-gray-800 uppercase tracking-wide">UK/India</th>
                      <th scope="col" className="px-6 py-4 text-[14px] font-bold text-gray-800 uppercase tracking-wide">US</th>
                      <th scope="col" className="px-6 py-4 text-[14px] font-bold text-gray-800 uppercase tracking-wide">EU</th>
                      <th scope="col" className="px-6 py-4 text-[14px] font-bold text-gray-800 uppercase tracking-wide">Foot Length (cm)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {CONTENT.sizeCharts.footwear.map((row, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-[15px] font-bold">{row.uk_in}</td>
                        <td className="px-6 py-4 text-[15px] text-gray-600">{row.us}</td>
                        <td className="px-6 py-4 text-[15px] text-gray-600">{row.eu}</td>
                        <td className="px-6 py-4 text-[15px] text-gray-600">{row.cm}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. FIT TIPS */}
      <section className="py-24 px-6 bg-white border-b border-gray-100">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="font-nav text-[32px] md:text-[40px] font-bold mb-12 text-center gsap-fade-up">{CONTENT.fitTips.title}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {CONTENT.fitTips.tips.map((tip, idx) => (
              <div key={idx} className="bg-gray-50 p-8 rounded-2xl gsap-fade-up">
                <h3 className="font-nav text-[20px] font-bold mb-4">{tip.title}</h3>
                <p className="font-nav text-[15px] text-gray-600 font-light leading-relaxed">{tip.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. NEED HELP */}
      <section className="py-16 px-6 bg-gray-50 text-center border-b border-gray-100">
        <div className="max-w-[600px] mx-auto flex flex-col md:flex-row items-center justify-center gap-4 gsap-fade-up">
          <p className="font-nav text-[16px] md:text-[18px] font-medium text-gray-800">{CONTENT.needHelp.text}</p>
          <a 
            href={CONTENT.needHelp.mailto}
            className="font-nav font-bold text-[15px] underline underline-offset-4 hover:text-gray-500 transition-colors"
          >
            {CONTENT.needHelp.linkText}
          </a>
        </div>
      </section>

      {/* 6. CALL TO ACTION */}
      <section className="py-24 px-6 text-center border-t border-gray-200 bg-white">
        <div className="max-w-[600px] mx-auto gsap-fade-up">
          <h2 className="font-nav text-4xl md:text-6xl font-bold mb-10 uppercase">{CONTENT.cta.heading}</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {CONTENT.cta.buttons.map((btn, idx) => (
              <Link 
                key={idx} 
                to={btn.url} 
                className="bg-black text-white px-8 py-4 text-[14px] font-bold uppercase tracking-wide hover:bg-gray-900 transition-colors rounded"
              >
                {btn.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}

export default SizeGuide;
