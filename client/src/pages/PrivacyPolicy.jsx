import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const CONTENT = {
  titleBlock: {
    label: "LEGAL",
    heading: "Privacy Policy",
    lastUpdated: "Last updated: VERIFY: [date]",
    intro: "Your privacy matters to us. This policy explains what personal data XTRN collects, why we collect it, and the choices you have."
  },
  sections: [
    {
      id: "who-we-are",
      title: "1. Who we are",
      paragraphs: [
        "XTRN is an online sports and athletic wear store in India. In this policy \"we\" means XTRN. Operator details: VERIFY: [legal name, registered address]. Privacy contact: VERIFY: [email, default support@xtrn.com]."
      ]
    },
    {
      id: "data-we-collect",
      title: "2. Data we collect",
      paragraphs: [
        "We collect the following types of information when you use our site:"
      ],
      list: [
        "Account data: name, email address, and a hashed password (we never store your password in readable form).",
        "Order data: delivery address, phone number, items ordered, order total, payment method and payment status.",
        "Cart and wishlist: the items you add.",
        "Community membership: name, email, phone (optional), main sport, and experience level.",
        "Messages you send us through the contact form: name, email, topic, order ID, and your message.",
        "Technical data: login session information (a secure cookie), IP address used for security and rate limiting, and basic device or browser details sent with every request.",
        "Payment data: online payments are handled by Razorpay. We receive the payment status and reference IDs but never see or store your full card details."
      ]
    },
    {
      id: "how-we-use",
      title: "3. How we use your data",
      paragraphs: [
        "We use your data to:"
      ],
      list: [
        "Create and manage your account.",
        "Process and deliver orders, and take payments.",
        "Send service emails (email verification, order confirmation, password reset, password change and new login alerts).",
        "Answer your messages.",
        "Run the XTRN community.",
        "Keep the site secure and prevent fraud or abuse.",
        "Meet legal obligations."
      ]
    },
    {
      id: "marketing",
      title: "4. Marketing and updates",
      paragraphs: [
        "We send news and updates only if you opted in (for example through community sign up). You can opt out at any time by contacting us. VERIFY: [add an unsubscribe link or process once marketing emails exist]."
      ]
    },
    {
      id: "sharing",
      title: "5. Who we share data with",
      paragraphs: [
        "We do not sell your personal data. We share only what is needed with: Razorpay (online payments), Gmail via SMTP for sending emails, our hosting and database providers (MongoDB Atlas and VERIFY: [hosting/CDN]), courier partners to deliver your order (VERIFY: [courier names once chosen]), and authorities when the law requires it. These providers process data on our behalf and under their own privacy terms."
      ]
    },
    {
      id: "cookies",
      title: "6. Cookies and local storage",
      paragraphs: [
        "We use necessary cookies for login and security."
      ]
    },
    {
      id: "retention",
      title: "7. How long we keep data",
      paragraphs: [
        "VERIFY: [retention periods]. Suggested wording: account data is kept while your account is active; order and payment records are kept as long as required for tax, accounting and legal reasons; contact messages are kept for as long as needed to resolve your request."
      ]
    },
    {
      id: "security",
      title: "8. How we protect your data",
      paragraphs: [
        "Passwords are hashed, login uses secure httpOnly cookies, connections use HTTPS in production, access to admin tools is restricted, and we rate limit sensitive actions. No method of transmission or storage is completely secure, so we cannot guarantee absolute security."
      ]
    },
    {
      id: "rights",
      title: "9. Your rights",
      paragraphs: [
        "You can view and update your name in your profile and change your password there. You can ask us to access, correct, or delete your personal data, or withdraw your consent, by contacting us. We may need to keep some records where the law requires it. VERIFY: [account deletion process; if there is no self-serve delete, say requests are handled by email]. We handle requests in line with applicable Indian law, including the Digital Personal Data Protection Act, 2023."
      ]
    },
    {
      id: "children",
      title: "10. Children",
      paragraphs: [
        "XTRN is not meant for anyone under 18 to use without a parent or guardian. We do not knowingly collect data from children. If you think a child has given us data, contact us and we will delete it."
      ]
    },
    {
      id: "third-party",
      title: "11. Third party links",
      paragraphs: [
        "Our site may link to other sites (for example social media). We are not responsible for their privacy practices."
      ]
    },
    {
      id: "changes",
      title: "12. Changes to this policy",
      paragraphs: [
        "We may update this policy. The new version applies from the date shown at the top. For significant changes we will make reasonable efforts to inform you, for example by email or a notice on the site."
      ]
    },
    {
      id: "contact",
      title: "13. Contact and grievance officer",
      paragraphs: [
        ["For privacy questions, requests, or complaints, email VERIFY: [privacy email, default support@xtrn.com] or use the ", { to: "/contact", label: "Contact page" }, ". Grievance Officer: VERIFY: [name, designation, email, and address as required for Indian e-commerce sites]."]
      ]
    }
  ],
  questionsStrip: {
    text: "Questions about your privacy? Contact us.",
    links: [
      { to: "/contact", label: "Contact Us" },
      { to: "/terms-and-conditions", label: "Terms & Conditions" }
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

export default function PrivacyPolicy() {
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
        <title>Privacy Policy | XTRN</title>
        <meta name="description" content="Learn how XTRN collects, uses, and protects your personal data." />
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
                    <p key={`p-${i}`} className="font-nav text-[16px] text-gray-700 font-light leading-relaxed">
                      <RenderParagraph content={para} />
                    </p>
                  ))}
                  {sec.list && (
                    <ul className="list-disc pl-5 mt-2 space-y-2">
                      {sec.list.map((item, i) => (
                        <li key={`l-${i}`} className="font-nav text-[16px] text-gray-700 font-light leading-relaxed">
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
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
        <div className="flex flex-wrap justify-center gap-4">
          {CONTENT.questionsStrip.links.map((link, i) => (
            <Link 
              key={i}
              to={link.to} 
              className="inline-block bg-white border border-gray-200 text-black px-8 py-3.5 rounded-full text-[13px] md:text-[14px] font-bold tracking-wide hover:border-black transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </section>


    </div>
  );
}
