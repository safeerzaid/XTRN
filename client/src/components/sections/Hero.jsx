import { Link } from 'react-router-dom';

function Hero() {
  return (
    /*
      Desktop: section fills 100vh with p-2 gap on all sides (original).
      Mobile:  section fills remaining viewport after the fixed mobile nav
               (56px top-bar + ~52px search bar = ~108px).
               We use smaller padding and a tighter border-radius on mobile.
    */
    <section
      id="hero"
      className="
        relative w-full

        /* ── MOBILE ─────────────────────────────────── */
        h-[80vh]
        mt-[72px]

        /* ── DESKTOP (md+) ───────────────────────────── */
        md:h-[80vh]
        md:mt-0
      "
    >
      {/* Hero Container */}
      <div
        className="
          relative h-full w-full overflow-hidden

          relative h-full w-full overflow-hidden
        "
      >
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src="https://res.cloudinary.com/duvfdxql9/video/upload/v1785950028/heroo_vrbp20.mp4" type="video/mp4" />
        </video>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/30" />

        {/* Content */}
        <div
          className="
            absolute z-10 text-white font-nav
            bottom-8 md:bottom-10 left-0 right-0
            flex flex-col items-center text-center
            px-4
          "
        >
          <span className="mb-3 text-[12px] sm:text-[14px] md:text-[16px] font-bold tracking-widest uppercase">
            Shop the new collection
          </span>
          <h1
            className="
              font-bold tracking-tight leading-tight
              text-[28px]
              sm:text-[36px]
              md:text-[48px]
              lg:text-[56px]
              xl:text-[64px]
              mb-4
            "
          >
            GEAR UP. FOR GREATNESS.
          </h1>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/men" className="bg-white text-black px-7 py-3.5 rounded-full text-[13px] md:text-[14px] font-bold tracking-wide hover:bg-black hover:text-white transition-colors cursor-pointer text-center inline-block">
              SHOP FOR HIM
            </Link>
            <Link to="/women" className="bg-white text-black px-7 py-3.5 rounded-full text-[13px] md:text-[14px] font-bold tracking-wide hover:bg-black hover:text-white transition-colors cursor-pointer text-center inline-block">
              SHOP FOR HER
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;