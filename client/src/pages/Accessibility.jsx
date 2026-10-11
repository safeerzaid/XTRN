import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const CONTENT = {
  titleBlock: {
    label: "LEGAL",
    heading: "Accessibility",
    lastUpdated: "Last updated: VERIFY: [date]",
    intro: "XTRN is for every athlete. We want everyone to be able to shop, join the community, and get support on our site."
  },
  sections: [
    {
      id: "our-commitment",
      title: "1. Our commitment",
      paragraphs: [
        "We want people of all abilities, including people who use screen readers, keyboards only, voice control, or screen magnification, to be able to use XTRN. We are working to improve the site over time."
      ]
    },
    {
      id: "what-we-have-done",
      title: "2. What we have done",
      paragraphs: [],
      list: [
        "Keyboard accessible tabs on our Size Guide.",
        "Clear error and success messages announced to screen readers on our Contact, Member, and Order Tracking forms.",
        "Table headers on our size charts.",
        "Animations turned off when your device is set to reduce motion on our newer pages (Terms, Privacy, Size Guide, Order Tracking, Contact).",
        "Images with descriptive alt text.",
        "Layouts that adapt to mobile screens and zoom."
      ]
    },
    {
      id: "standards",
      title: "3. Standards",
      paragraphs: [
        "We aim to follow the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA. We have not completed a formal third party audit yet, so we cannot claim full conformance. VERIFY: [update if an audit is done]."
      ]
    },
    {
      id: "known-limitations",
      title: "4. Known limitations",
      paragraphs: [
        "We know some parts of the site are not fully accessible right now:"
      ],
      list: [
        "There is no \"Skip to content\" link at the top of the page.",
        "Pop-up windows (like Login and Signup) do not trap keyboard focus or declare themselves to screen readers, meaning you can accidentally tab out of them into the page behind.",
        "The login and signup forms do not have explicitly linked labels or screen-reader announcements for errors.",
        "Many buttons and links across the site have their default focus outline removed without a clear replacement, making it hard to see where you are when using a keyboard.",
        "Smooth scrolling and some page animations (like the Who We Are page and Home page) ignore the \"reduce motion\" setting on your device.",
        "The Razorpay payment window is provided by a third party and we do not control its accessibility."
      ]
    },
    {
      id: "alternative-ways",
      title: "5. Alternative ways to order and get help",
      paragraphs: [
        "If you cannot complete a task on the site, contact us and we will help you. VERIFY: [what help you can really offer, for example assisted ordering by email]."
      ]
    },
    {
      id: "feedback",
      title: "6. Feedback and contact",
      paragraphs: [
        ["Tell us about any barrier: the page address, what went wrong, and the device, browser or assistive tool you use. Email VERIFY: [support email, default support@xtrn.com] or use the ", { to: "/contact", label: "Contact page" }, "."]
      ]
    },
    {
      id: "ongoing-work",
      title: "7. Ongoing work",
      paragraphs: [
        "We review accessibility when we add or change pages and will update this statement as we improve."
      ]
    }
  ],
  questionsStrip: {
    text: "Having trouble using the site? Tell us.",
    links: [
      { to: "/contact", label: "Contact Us" },
      { to: "mailto:support@xtrn.com", label: "support@xtrn.com", isExternal: true }
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
              <Link key={i} to={part.to} className="text-black font-bold border-b border-black hover:text-gray-600 hover:border-gray-600 outline-none focus-visible:ring-2 focus-visible:ring-black rounded transition-colors">
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

export default function Accessibility() {
  const containerRef = useRef(null);

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


  return (
    <div ref={containerRef} className="bg-white min-h-screen">
      <Helmet>
        <title>Accessibility | XTRN</title>
        <meta name="description" content="XTRN's commitment to digital accessibility for all users." />
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
        <div className="max-w-[800px] mx-auto flex flex-col gap-12 lg:gap-16">
          {CONTENT.sections.map((sec) => (
            <div key={sec.id} id={sec.id}>
              <h2 className="font-nav text-[22px] md:text-[26px] font-bold text-black mb-6 tracking-tight">
                {sec.title}
              </h2>
              <div className="flex flex-col gap-4">
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
      </section>

      {/* 3. QUESTIONS STRIP */}
      <section className="bg-gray-50 py-16 px-6 border-t border-gray-100 text-center">
        <h3 className="font-nav text-[20px] md:text-[24px] font-bold mb-6">
          {CONTENT.questionsStrip.text}
        </h3>
        <div className="flex flex-wrap justify-center gap-4">
          {CONTENT.questionsStrip.links.map((link, i) => (
            link.isExternal ? (
              <a 
                key={i}
                href={link.to} 
                className="inline-block bg-white border border-gray-200 text-black px-8 py-3.5 rounded-full text-[13px] md:text-[14px] font-bold tracking-wide hover:border-black transition-colors outline-none focus-visible:ring-2 focus-visible:ring-black"
              >
                {link.label}
              </a>
            ) : (
              <Link 
                key={i}
                to={link.to} 
                className="inline-block bg-white border border-gray-200 text-black px-8 py-3.5 rounded-full text-[13px] md:text-[14px] font-bold tracking-wide hover:border-black transition-colors outline-none focus-visible:ring-2 focus-visible:ring-black"
              >
                {link.label}
              </Link>
            )
          ))}
        </div>
      </section>


    </div>
  );
}
