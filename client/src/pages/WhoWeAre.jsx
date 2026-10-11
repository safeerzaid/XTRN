import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import heroImage from '../assets/images/covers/IMG_5887.PNG';

gsap.registerPlugin(ScrollTrigger);

const CONTENT = {
  hero: {
    heading: "WHO WE ARE",
    tagline: "GEAR UP. FOR GREATNESS.",
    imageUrl: heroImage
  },
  story: [
    "XTRN began with a simple frustration. Athletes across India were training hard in gear that was built for looks, not for the grind. We believed Indian athletes deserved performance wear made for our heat, our streets, and our hunger to win.",
    "From a small team and a big idea, XTRN grew into a brand built around one promise: gear that keeps up with you. Every stitch, every sole, and every fabric is tested for comfort, durability, and performance, whether you are running at dawn, climbing a trail, or pushing through your last rep.",
    "Today, XTRN is more than a store. It is a movement of people who refuse to settle, and we are just getting started."
  ],
  community: {
    heading: "More Than a Brand",
    text: "XTRN runs a community that supports athletes at every level, from first-time runners to competitive players. We back the people who move."
  },


  whyChoose: [
    { title: "Premium Quality Products", text: "Performance fabrics and durable builds, made to last. Every piece is chosen for comfort, strength, and the way it moves with you. From your first run to your hardest session, it is gear you can trust." },
    { title: "Secure Payments", text: "Safe and trusted checkout powered by Razorpay. Your payment details are handled through a secure gateway, so you can shop with confidence. Pay the way that suits you, without worry." },
    { title: "Fast Delivery", text: "Quick shipping so you can gear up sooner. We work to get your order packed and on its way without delay, so your new gear reaches you when you need it. Track your order from your account." },
    { title: "Easy Returns and Support", text: "Simple returns and a team ready to help. If something is not right, reach out and we will help you sort it out. Shopping with XTRN should be easy, from checkout to doorstep." }
  ],
  values: [
    { title: "Quality", text: "We never compromise on materials or craftsmanship." },
    { title: "Performance", text: "Every product is built to help you go further." },
    { title: "Community", text: "We grow by lifting athletes up." },
    { title: "Sustainability", text: "We aim to make responsible choices in how we create." }
  ],
  cta: {
    heading: "GEAR UP. FOR GREATNESS.",
    buttons: [
      { label: "SHOP FOR HIM", url: "/men" },
      { label: "SHOP FOR HER", url: "/women" },
      { label: "CONTACT US", url: "mailto:support@xtrn.com" }
    ]
  }
};

function WhoWeAre() {
  const containerRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Who We Are | XTRN";
    
    // Add meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = "description";
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = "XTRN is an Indian athletic wear brand. Gear up for greatness with our premium sportswear.";

    const ctx = gsap.context(() => {
      // Fade up elements with class .gsap-fade-up
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

  return (
    <div ref={containerRef} className="bg-white min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative w-full h-[80vh] mt-[72px] md:h-[80vh] md:mt-0">
        <div className="relative h-full w-full overflow-hidden">
          <img
            src={CONTENT.hero.imageUrl}
            alt="Hero Background"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
          
          <div className="absolute inset-0 z-10 text-white font-nav flex flex-col justify-center items-center text-center px-4">
            <h1 className="font-bold tracking-tight leading-tight text-[40px] sm:text-[56px] md:text-[72px] lg:text-[80px] mb-4">
              {CONTENT.hero.heading}
            </h1>
            <p className="text-[16px] sm:text-[18px] md:text-[20px] font-bold tracking-widest uppercase">
              {CONTENT.hero.tagline}
            </p>
          </div>
        </div>
      </section>

      {/* 2. OUR STORY */}
      <section className="px-6 py-20 md:py-32 max-w-[1200px] mx-auto text-left">
        <h2 className="font-nav text-3xl md:text-5xl font-bold mb-10 gsap-fade-up">Our Story</h2>
        <div className="space-y-6 text-gray-700 text-[18px] md:text-[22px] font-nav font-light tracking-wide gsap-fade-up leading-relaxed">
          {CONTENT.story.map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>
      </section>



      {/* 4. OUR COMMUNITY */}
      <section className="py-24 px-6 bg-black text-white text-center">
        <div className="max-w-[800px] mx-auto gsap-fade-up">
          <h2 className="font-nav text-3xl md:text-5xl font-bold mb-6">{CONTENT.community.heading}</h2>
          <p className="font-nav text-[16px] md:text-[18px] font-light tracking-wide opacity-90">{CONTENT.community.text}</p>
        </div>
      </section>



      {/* 4. WHY CHOOSE XTRN */}
      <section className="bg-white py-24 px-6">
        <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row gap-16 lg:gap-24">
          
          {/* Left Column - Heading */}
          <div className="lg:w-[40%] flex flex-col gsap-fade-up">
            <h2 className="font-nav text-[36px] md:text-[46px] font-bold leading-[1.1] tracking-tight">
              Why choose <span className="text-gray-400">XTRN</span>
            </h2>
          </div>

          {/* Right Column - List */}
          <div className="lg:w-[60%] flex flex-col">
            {CONTENT.whyChoose.map((item, idx) => (
              <div 
                key={idx} 
                className={`py-8 md:py-10 flex flex-col md:flex-row gap-6 md:gap-12 border-t border-gray-200 gsap-fade-up ${idx === CONTENT.whyChoose.length - 1 ? 'border-b' : ''}`}
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

      {/* 7. OUR VALUES */}
      <section className="py-20 px-6 max-w-[1200px] mx-auto">
        <h2 className="font-nav text-3xl md:text-4xl font-bold mb-10 text-center gsap-fade-up">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CONTENT.values.map((item, idx) => (
            <div key={idx} className="p-8 border-l-4 border-black bg-gray-50 gsap-fade-up">
              <h3 className="font-nav text-[20px] font-bold mb-2 uppercase">{item.title}</h3>
              <p className="font-nav text-[16px] text-gray-700 font-light tracking-wide">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 8. CALL TO ACTION */}
      <section className="py-24 px-6 text-center border-t border-gray-200">
        <div className="max-w-[600px] mx-auto gsap-fade-up">
          <h2 className="font-nav text-4xl md:text-6xl font-bold mb-10 uppercase">{CONTENT.cta.heading}</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {CONTENT.cta.buttons.map((btn, idx) => {
              if (btn.url.startsWith('mailto:')) {
                return (
                  <a key={idx} href={btn.url} className="bg-white border-2 border-black text-black px-8 py-3.5 rounded-full text-[13px] md:text-[14px] font-bold tracking-wide hover:bg-black hover:text-white transition-colors">
                    {btn.label}
                  </a>
                );
              }
              return (
                <Link key={idx} to={btn.url} className="bg-black border-2 border-black text-white px-8 py-3.5 rounded-full text-[13px] md:text-[14px] font-bold tracking-wide hover:bg-white hover:text-black transition-colors">
                  {btn.label}
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

export default WhoWeAre;
