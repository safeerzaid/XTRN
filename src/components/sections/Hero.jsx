function Hero() {
  return (
    /*
      Desktop: section fills 100vh with p-2 gap on all sides (original).
      Mobile:  section fills remaining viewport after the fixed mobile nav
               (56px top-bar + ~52px search bar = ~108px).
               We use smaller padding and a tighter border-radius on mobile.
    */
    <section
      className="
        relative w-full

        /* ── MOBILE ─────────────────────────────────── */
        h-[62svh]
        mt-[72px]
        px-2
        py-1

        /* ── DESKTOP (md+) ───────────────────────────── */
        md:h-screen
        md:mt-1
        md:px-2
        md:py-1
      "
    >
      {/* Hero Container */}
      <div
        className="
          relative h-full w-full overflow-hidden

          /* smaller radius on mobile, same on desktop */
          rounded-[8px]
          md:rounded-[8px]
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
        {/* <div className="absolute inset-0 bg-black/50" /> */}

        {/* Content */}
        <div
          className="
            absolute z-10 text-white font-nav

            /* ── MOBILE: centered, lower-middle ─────── */
            bottom-10 left-0 right-0
            flex flex-col items-center text-center
            px-4

            /* ── DESKTOP (md+): left-aligned original ─ */
            md:bottom-12 md:left-10 md:right-auto
            md:flex md:flex-col md:items-start md:text-left
            md:px-0

            lg:bottom-14 lg:left-16
          "
        >
          <h1
            className="
              font-semibold tracking-tight leading-[0.85]

              /* mobile → tablet → desktop scale */
              text-[48px]
              sm:text-[56px]
              md:text-[90px]
              lg:text-[120px]
              xl:text-[150px]
            "
          >
            Gear Up.
            <br />
            For Greatness.
          </h1>
        </div>
      </div>
    </section>
  );
}

export default Hero;