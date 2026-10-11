import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const CONTENT = {
  titleBlock: {
    label: "LEGAL",
    heading: "Terms and Conditions",
    lastUpdated: "Last updated: VERIFY: [date]",
    intro: "By using the XTRN website or placing an order, you agree to these terms. Please read them carefully."
  },
  sections: [
    {
      id: "about",
      title: "1. About these terms",
      paragraphs: [
        "XTRN is an online sports and athletic wear store operating in India. These terms apply to the XTRN website and to every order placed through it. By accessing the site, creating an account, or placing an order you accept these terms. If you do not agree, please do not use the site.",
        "Operator details: VERIFY: [legal business name, registered address, GSTIN if applicable]."
      ]
    },
    {
      id: "eligibility",
      title: "2. Eligibility and accounts",
      paragraphs: [
        "You must be at least 18 to place an order, or use the site under the supervision of a parent or guardian. You are responsible for the accuracy of the information you give and for keeping your login details secure. You must verify your email before placing an order. Tell us immediately if you suspect unauthorized use of your account. We may suspend or close accounts that break these terms or are used for fraud or abuse."
      ]
    },
    {
      id: "products",
      title: "3. Products and availability",
      paragraphs: [
        ["We try to show product details, images, colors and sizes accurately, but screens vary and slight differences can occur. Please use the ", { to: "/size-guide", label: "Size Guide" }, " before ordering. All products are subject to availability. If an item sells out or an error occurs on a listing, we may cancel the affected order and refund any payment."]
      ]
    },
    {
      id: "pricing",
      title: "4. Pricing",
      paragraphs: [
        "All prices are in Indian Rupees (INR). VERIFY: [whether prices include GST]. We may change prices at any time, but the price shown when you place your order is the price you pay. If a price is clearly wrong, we may cancel the order and refund you."
      ]
    },
    {
      id: "orders",
      title: "5. Orders and acceptance",
      paragraphs: [
        "Placing an order is an offer to buy. An order is confirmed when we send a confirmation email. We may refuse or cancel an order for reasons such as stock errors, pricing errors, suspected fraud, or an address we cannot deliver to. If we cancel a paid order, we refund the amount."
      ]
    },
    {
      id: "payments",
      title: "6. Payments",
      paragraphs: [
        "We accept Cash on Delivery and online payments processed by Razorpay. VERIFY: [exact methods enabled]. Online payments are handled by Razorpay on its secure systems and we do not store your card details. Online orders that are not paid within 30 minutes are cancelled automatically and reserved stock is released. Refunds for failed or cancelled online payments are returned to the original payment method. VERIFY: [timeline].",
        "For Cash on Delivery, please keep the exact amount ready. VERIFY: [any COD limits or fees]."
      ]
    },
    {
      id: "shipping",
      title: "7. Shipping and delivery",
      paragraphs: [
        "Delivery times and charges are shown at checkout or on our policy. VERIFY: [timelines, charges, serviceable locations]. Delivery dates are estimates, not guarantees. Risk of loss passes to you on delivery. Please provide a complete and correct address and a reachable phone number.",
        ["You can follow your order on the ", { to: "/order-tracking", label: "Order Tracking page" }, "."]
      ]
    },
    {
      id: "returns",
      title: "8. Returns, exchanges and refunds",
      paragraphs: [
        "VERIFY: [return window, condition requirements (unused, tags attached), non-returnable items such as innerwear or custom items, who pays return shipping, exchange process, refund timeline and method].",
        ["Items that arrive damaged, defective, or incorrect should be reported to us with your Order ID and photos through the ", { to: "/contact", label: "Contact page" }, "."]
      ]
    },
    {
      id: "cancellations",
      title: "9. Cancellations",
      paragraphs: [
        "VERIFY: [until what order status a customer can cancel, and how]. We may cancel orders as described in section 5."
      ]
    },
    {
      id: "community",
      title: "10. Community membership",
      paragraphs: [
        "XTRN runs an athlete community. Joining is optional and free. Members must provide accurate details and behave respectfully. We may remove members who post abusive, unlawful, or misleading content. Content you share may be displayed on the site. VERIFY: [rules about user generated content and licence to display it, if the community lets users post]."
      ]
    },
    {
      id: "acceptable-use",
      title: "11. Acceptable use",
      paragraphs: [
        "You agree not to use the site for anything unlawful or harmful, including: attempting to gain unauthorized access, scraping or copying the site at scale, interfering with security or performance, uploading malicious code, placing fraudulent orders, or impersonating others."
      ]
    },
    {
      id: "intellectual-property",
      title: "12. Intellectual property",
      paragraphs: [
        "The XTRN name, logo, product designs, images, text and site design belong to XTRN or its licensors and are protected by law. You may not copy, reproduce, modify, or use them commercially without written permission. You may view and print pages for personal, non-commercial use."
      ]
    },
    {
      id: "privacy",
      title: "13. Privacy",
      paragraphs: [
        ["We handle your personal data as described in our ", { to: "/privacy-policy", label: "Privacy Policy" }, " VERIFY. By using the site you agree to that handling."]
      ]
    },
    {
      id: "disclaimers",
      title: "14. Disclaimers and limitation of liability",
      paragraphs: [
        "The site and products are provided on an as available basis. To the extent allowed by law, XTRN is not liable for indirect or consequential loss, or for delays and failures caused by events beyond our control (such as courier disruption, payment gateway outages, or natural events). Our total liability for any order is limited to the amount you paid for that order. Nothing here limits rights you have under Indian consumer protection law that cannot be excluded."
      ]
    },
    {
      id: "third-party",
      title: "15. Third party services",
      paragraphs: [
        "Payments and delivery depend on partners such as Razorpay and courier companies. Their own terms apply to their services, and we are not responsible for their systems."
      ]
    },
    {
      id: "changes",
      title: "16. Changes to these terms",
      paragraphs: [
        "We may update these terms from time to time. The updated version applies from the date posted at the top of this page. Continuing to use the site after changes means you accept them."
      ]
    },
    {
      id: "disputes",
      title: "17. Governing law and disputes",
      paragraphs: [
        "These terms are governed by the laws of India. Courts in VERIFY: [city, state] have jurisdiction, subject to your rights under applicable consumer law. VERIFY: [grievance officer name and contact, required for Indian e-commerce sites]."
      ]
    },
    {
      id: "contact",
      title: "18. Contact",
      paragraphs: [
        ["Questions or complaints can be sent to support@xtrn.com or through the ", { to: "/contact", label: "Contact page" }, "."]
      ]
    }
  ],
  questionsStrip: {
    text: "Questions about these terms? Contact us.",
    linkUrl: "/contact"
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

export default function TermsAndConditions() {
  const containerRef = useRef(null);
  const [activeSection, setActiveSection] = useState(CONTENT.sections[0].id);
  const [isTocOpen, setIsTocOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!prefersReducedMotion) {
      const ctx = gsap.context(() => {
        gsap.fromTo('.gsap-fade-up', 
          { y: 30, opacity: 0 }, 
          { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
        );
      }, containerRef);
      return () => ctx.revert();
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -80% 0px' }
    );

    CONTENT.sections.forEach((sec) => {
      const el = document.getElementById(sec.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);


  return (
    <div ref={containerRef} className="bg-white min-h-screen">
      <Helmet>
        <title>Terms and Conditions | XTRN</title>
        <meta name="description" content="Terms and conditions for using the XTRN website and purchasing our athletic wear products." />
      </Helmet>

      {/* 1. TITLE BLOCK */}
      <section className="pt-[140px] md:pt-[180px] pb-10 px-6 border-b border-gray-100">
        <div className="max-w-[1200px] mx-auto gsap-fade-up">
          <p className="font-nav text-[13px] text-gray-500 tracking-[0.2em] uppercase font-bold mb-4">
            {CONTENT.titleBlock.label}
          </p>
          <h1 className="font-nav text-[40px] md:text-[56px] font-bold tracking-tight leading-tight mb-4 text-black">
            {CONTENT.titleBlock.heading}
          </h1>
          <p className="font-nav text-[14px] text-gray-500 mb-6">
            {CONTENT.titleBlock.lastUpdated}
          </p>
          <p className="font-nav text-[16px] md:text-[18px] text-gray-700 font-light max-w-[800px] leading-relaxed">
            {CONTENT.titleBlock.intro}
          </p>
        </div>
      </section>

      {/* 2. BODY */}
      <section className="py-16 px-6">
        <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row gap-12 lg:gap-24 relative">
          
          {/* Left: Mobile TOC Accordion */}
          <div className="lg:hidden w-full mb-8">
            <button 
              onClick={() => setIsTocOpen(!isTocOpen)}
              className="w-full bg-gray-50 border border-gray-200 px-6 py-4 rounded-xl flex justify-between items-center font-nav font-bold text-[15px] text-black"
            >
              <span>On this page</span>
              <svg 
                className={`w-5 h-5 transition-transform duration-300 ${isTocOpen ? 'rotate-180' : ''}`} 
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isTocOpen && (
              <div className="mt-2 bg-white border border-gray-100 rounded-xl p-4 shadow-sm font-nav flex flex-col gap-3 h-64 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {CONTENT.sections.map((sec) => (
                  <a 
                    key={sec.id} 
                    href={`#${sec.id}`}
                    onClick={() => setIsTocOpen(false)}
                    className={`text-[14px] px-2 py-1 transition-colors ${
                      activeSection === sec.id ? 'font-bold text-black' : 'text-gray-500 hover:text-black'
                    }`}
                  >
                    {sec.title}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Left: Desktop Sticky TOC */}
          <div className="hidden lg:block lg:w-[28%] shrink-0">
            <div className="sticky top-28 font-nav flex flex-col gap-4 border-r border-gray-200 pr-6 py-2 max-h-[75vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {CONTENT.sections.map((sec) => (
                <a 
                  key={sec.id} 
                  href={`#${sec.id}`}
                  className={`text-[14px] leading-snug transition-all ${
                    activeSection === sec.id 
                      ? 'font-bold text-black' 
                      : 'text-gray-500 font-medium hover:text-black'
                  }`}
                >
                  {sec.title}
                </a>
              ))}
            </div>
          </div>

          {/* Right: Content Sections */}
          <div className="lg:w-[72%] w-full flex flex-col gap-12 lg:gap-16 pb-12">
            {CONTENT.sections.map((sec) => (
              <div key={sec.id} id={sec.id} className="scroll-mt-28">
                <h2 className="font-nav text-[22px] md:text-[26px] font-bold text-black mb-6 tracking-tight">
                  {sec.title}
                </h2>
                <div className="flex flex-col gap-4 max-w-[720px]">
                  {sec.paragraphs.map((para, i) => (
                    <p key={i} className="font-nav text-[16px] text-gray-700 font-light leading-relaxed">
                      <RenderParagraph content={para} />
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 3. QUESTIONS STRIP */}
      <section className="bg-gray-50 py-16 px-6 border-t border-gray-100 text-center">
        <h3 className="font-nav text-[20px] md:text-[24px] font-bold mb-6">
          {CONTENT.questionsStrip.text}
        </h3>
        <Link 
          to={CONTENT.questionsStrip.linkUrl} 
          className="inline-block bg-black border-2 border-black text-white px-8 py-3.5 rounded-full text-[13px] md:text-[14px] font-bold tracking-wide hover:bg-white hover:text-black transition-colors"
        >
          Contact Support
        </Link>
      </section>


    </div>
  );
}
