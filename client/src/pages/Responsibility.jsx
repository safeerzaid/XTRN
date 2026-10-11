import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import heroImage from '../assets/images/covers/responsibility.PNG';

gsap.registerPlugin(ScrollTrigger);

const CONTENT = {
  hero: {
    heading: "Our Responsibility",
    subtext: "Gear built to keep its word.",
    imageUrl: heroImage
  },
  intro: "Making good gear is only part of the job. Here is what we promise to you, and how we try to do better every day.",
  commitments: [
    {
      title: "Quality you can trust",
      text: "We choose materials and builds for comfort, strength and performance. VERIFY: [add any real testing or quality checks]."
    },
    {
      title: "Honest product information",
      text: [
        "We show product details clearly, including price, size guidance and, where available, country of origin and manufacturer details. See our ",
        { to: "/size-guide", label: "Size Guide" },
        "."
      ]
    },
    {
      title: "Safe and secure shopping",
      text: [
        "Online payments are processed by Razorpay and we never store your card details. We protect your account with password hashing, rate limiting, email verification, and login alerts. Learn more in our ",
        { to: "/privacy-policy", label: "Privacy Policy" },
        "."
      ]
    },
    {
      title: "Support that responds",
      text: [
        "You can track your order and contact our team any time. Check ",
        { to: "/order-tracking", label: "Order Tracking" },
        " or reach out via our ",
        { to: "/contact", label: "Contact page" },
        "."
      ]
    }
  ],
  community: {
    heading: "Backing athletes",
    text: "The XTRN community supports athletes at every level, from first-time runners to competitive players. We back the people who move.",
    buttonLabel: "Become a Member",
    buttonUrl: "/become-member"
  },
  responsibleChoices: {
    heading: "Responsible choices",
    items: [
      {
        title: "Materials",
        text: "VERIFY: [real info about fabrics, recycled or certified content, or remove the row]."
      },
      {
        title: "Packaging",
        text: "VERIFY: [real info, or remove the row]."
      },
      {
        title: "Making and sourcing",
        text: "VERIFY: [real info about factories, labour standards, or remove the row]."
      }
    ]
  },
  safetyAndQuality: {
    text: "If something is not right, we will make it right.",
    links: [
      { to: "/terms-and-conditions", label: "Terms and Conditions" },
      { to: "/contact", label: "Contact us" }
    ]
  },
  improvements: {
    heading: "What we are still working on",
    items: [
      "Accessibility improvements to ensure our platform is usable by everyone.",
      "Providing more comprehensive size data and fit guides for all footwear.",
      "Continuous upgrades to payment processing and order flow efficiency.",
      "VERIFY: [any other ongoing internal improvements]."
    ]
  },
  questionsStrip: {
    text: "Questions about how we work? Contact us.",
    linkUrl: "/contact",
    faqUrl: "/faq"
  },
  cta: {
    heading: "GEAR UP. FOR GREATNESS.",
    buttons: [
      { label: "SHOP FOR HIM", url: "/men" },
      { label: "SHOP FOR HER", url: "/women" }
    ]
  }
};

const RenderParagraph = ({ content }) => {
  if (typeof content === 'string') {
    return <span>{content}</span>;
  }
  if (Array.isArray(content)) {
    return (
      <>
        {content.map((part, i) => {
          if (typeof part === 'string') {
            return <span key={i}>{part}</span>;
          }
          if (part && part.to && part.label) {
            return (
              <Link key={i} to={part.to} className="text-black font-bold border-b border-black hover:text-gray-600 hover:border-gray-600 transition-colors">
                {part.label}
              </Link>
            );
          }
          return null;
        })}
      </>
    );
  }
  return null;
};

export default function Responsibility() {
  const containerRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!prefersReducedMotion) {
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
    }
  }, []);

  return (
    <div ref={containerRef} className="bg-white min-h-screen">
      <Helmet>
        <title>Our Responsibility | XTRN</title>
        <meta name="description" content="XTRN's commitments to quality, honest product information, secure shopping, and supporting the athlete community." />
      </Helmet>

      {/* 1. HERO */}
      <section className="relative w-full h-[60vh] mt-[72px] md:h-[60vh] md:mt-0">
        <div className="relative h-full w-full overflow-hidden">
          <img
            src={CONTENT.hero.imageUrl}
            alt="Responsibility Hero"
            className="absolute inset-0 h-full w-full object-cover object-[center_30%]"
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

      {/* 2. INTRO */}
      <section className="py-20 px-6 text-center border-b border-gray-100">
        <div className="max-w-[800px] mx-auto gsap-fade-up">
          <p className="font-nav text-[20px] md:text-[24px] font-light leading-relaxed text-black">
            {CONTENT.intro}
          </p>
        </div>
      </section>

      {/* 3. COMMITMENT CARDS */}
      <section className="py-24 px-6 border-b border-gray-100">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {CONTENT.commitments.map((item, idx) => (
              <div key={idx} className="bg-white border border-gray-200 p-8 rounded-2xl flex flex-col items-start gsap-fade-up hover:border-black transition-colors">
                <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold mb-6">
                  {idx + 1}
                </div>
                <h3 className="font-nav text-[20px] font-bold mb-3">{item.title}</h3>
                <p className="font-nav text-[15px] text-gray-500 leading-relaxed font-light">
                  <RenderParagraph content={item.text} />
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. COMMUNITY */}
      <section className="py-24 px-6 bg-black text-white text-center">
        <div className="max-w-[800px] mx-auto gsap-fade-up flex flex-col items-center">
          <h2 className="font-nav text-3xl md:text-5xl font-bold mb-6">{CONTENT.community.heading}</h2>
          <p className="font-nav text-[16px] md:text-[18px] font-light tracking-wide opacity-90 max-w-[600px] mb-8">
            {CONTENT.community.text}
          </p>
          <Link 
            to={CONTENT.community.buttonUrl} 
            className="inline-block bg-white text-black px-8 py-3.5 rounded-full text-[13px] md:text-[14px] font-bold tracking-wide hover:bg-gray-200 transition-colors"
          >
            {CONTENT.community.buttonLabel}
          </Link>
        </div>
      </section>

      {/* 5. RESPONSIBLE CHOICES */}
      <section className="bg-white py-24 px-6 border-b border-gray-100">
        <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row gap-16 lg:gap-24">
          <div className="lg:w-[40%] flex flex-col gsap-fade-up">
            <h2 className="font-nav text-[36px] md:text-[46px] font-bold leading-[1.1] tracking-tight">
              {CONTENT.responsibleChoices.heading}
            </h2>
          </div>
          <div className="lg:w-[60%] flex flex-col">
            {CONTENT.responsibleChoices.items.map((item, idx) => (
              <div 
                key={idx} 
                className={`py-8 md:py-10 flex flex-col md:flex-row gap-6 md:gap-12 border-t border-gray-200 gsap-fade-up ${idx === CONTENT.responsibleChoices.items.length - 1 ? 'border-b' : ''}`}
              >
                <div className="font-nav text-3xl md:text-4xl font-bold shrink-0 md:w-16">
                  0{idx + 1}.
                </div>
                <div className="flex flex-col gap-3">
                  <h3 className="font-nav text-[18px] md:text-[20px] font-bold">{item.title}</h3>
                  <p className="font-nav text-[15px] md:text-[16px] text-gray-500 font-light tracking-wide leading-relaxed">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. SAFETY AND QUALITY STRIP */}
      <section className="py-12 px-6 bg-gray-50 border-b border-gray-100 text-center flex flex-col items-center gap-6">
        <p className="font-nav text-[18px] md:text-[22px] font-bold text-black max-w-[600px] gsap-fade-up">
          {CONTENT.safetyAndQuality.text}
        </p>
        <div className="flex flex-wrap justify-center gap-4 font-nav text-[14px] font-bold gsap-fade-up">
          {CONTENT.safetyAndQuality.links.map((link, idx) => (
            <Link 
              key={idx} 
              to={link.to} 
              className="text-black border-b border-black hover:text-gray-600 hover:border-gray-600 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </section>

      {/* 7. WHAT WE ARE STILL WORKING ON */}
      <section className="py-24 px-6 bg-white border-b border-gray-100">
        <div className="max-w-[800px] mx-auto bg-white border border-gray-200 rounded-2xl p-8 md:p-12 shadow-sm gsap-fade-up">
          <h2 className="font-nav text-[24px] md:text-[32px] font-bold mb-8 text-black">
            {CONTENT.improvements.heading}
          </h2>
          <ul className="flex flex-col gap-4 font-nav text-[16px] text-gray-700 font-light list-disc pl-5">
            {CONTENT.improvements.items.map((item, idx) => (
              <li key={idx} className="leading-relaxed">{item}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* 8. QUESTIONS STRIP */}
      <section className="bg-gray-50 py-16 px-6 border-b border-gray-100 text-center">
        <h3 className="font-nav text-[20px] md:text-[24px] font-bold mb-6">
          {CONTENT.questionsStrip.text}
        </h3>
        <div className="flex justify-center gap-4">
          <Link 
            to={CONTENT.questionsStrip.linkUrl} 
            className="inline-block bg-black border-2 border-black text-white px-8 py-3.5 rounded-full text-[13px] md:text-[14px] font-bold tracking-wide hover:bg-white hover:text-black transition-colors"
          >
            Contact Support
          </Link>
          {/* <Link 
            to={CONTENT.questionsStrip.faqUrl} 
            className="inline-block bg-white border-2 border-black text-black px-8 py-3.5 rounded-full text-[13px] md:text-[14px] font-bold tracking-wide hover:bg-black hover:text-white transition-colors"
          >
            FAQ
          </Link> */}
        </div>
      </section>

      {/* 9. CALL TO ACTION */}
      <section className="py-24 px-6 text-center bg-white border-t border-gray-200">
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
