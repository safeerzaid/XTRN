import { useState, useEffect, useRef } from "react";
import {
  FiHeart,
  FiShoppingBag,
  FiSearch,
  FiMenu,
  FiUser,
  FiX,
} from "react-icons/fi";
import gsap from "gsap";

import logo from "../../assets/images/logo/logo.png";

const Navbar = () => {
  const navItems = ["MEN", "WOMEN", "SPORTS", "BRANDS", "SALE"];

  const [active, setActive] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [tabletSearchOpen, setTabletSearchOpen] = useState(false);
  const [desktopSearchOpen, setDesktopSearchOpen] = useState(false);

  const [desktopScrolled, setDesktopScrolled] = useState(false);
  const [desktopHovered, setDesktopHovered] = useState(false);

  /* ─────────────────────────────────────────────
     MOBILE GSAP REFS
  ───────────────────────────────────────────── */

  const mobileMenuRef = useRef(null);
  const mobileLogoRef = useRef(null);
  const mobileCloseRef = useRef(null);
  const mobileItemsRef = useRef([]);

  /* ─────────────────────────────────────────────
     SEARCH REFS
  ───────────────────────────────────────────── */

  const mobileNavbarLogoRef = useRef(null);
  const mobileSearchRef = useRef(null);
  const mobileSearchInputRef = useRef(null);

  const tabletNavbarLogoRef = useRef(null);
  const tabletSearchRef = useRef(null);
  const tabletSearchInputRef = useRef(null);

  const desktopSearchRef = useRef(null);
  const desktopSearchInputRef = useRef(null);

  const desktop4kSearchRef = useRef(null);
  const desktop4kSearchInputRef = useRef(null);

  /* ─────────────────────────────────────────────
     DESKTOP REFS
  ───────────────────────────────────────────── */

  const desktopNavRef = useRef(null);

  const desktopLogoRef = useRef(null);
  const desktopTextRefs = useRef([]);
  const desktopIconRefs = useRef([]);

  const desktop4kLogoRef = useRef(null);
  const desktop4kTextRefs = useRef([]);
  const desktop4kIconRefs = useRef([]);

  /* ─────────────────────────────────────────────
     MENU
  ───────────────────────────────────────────── */

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  /* ─────────────────────────────────────────────
     BODY LOCK
  ───────────────────────────────────────────── */

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  /* ─────────────────────────────────────────────
     DESKTOP SCROLL
  ───────────────────────────────────────────── */

  useEffect(() => {
    const handleScroll = () => {
      setDesktopScrolled(window.scrollY > 10);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  /* ─────────────────────────────────────────────
     DESKTOP NAVBAR COLOR UPDATE
     HOVER OR SCROLL
  ───────────────────────────────────────────── */

  useEffect(() => {
    const shouldBeWhite = desktopScrolled || desktopHovered;

    const nav = desktopNavRef.current;

    const desktopTexts =
      desktopTextRefs.current.filter(Boolean);

    const desktopIcons =
      desktopIconRefs.current.filter(Boolean);

    const desktop4kTexts =
      desktop4kTextRefs.current.filter(Boolean);

    const desktop4kIcons =
      desktop4kIconRefs.current.filter(Boolean);

    const logos = [
      desktopLogoRef.current,
      desktop4kLogoRef.current,
    ].filter(Boolean);

    if (shouldBeWhite) {
      gsap.to(nav, {
        backgroundColor: "#ffffff",
        duration: 0.35,
        ease: "power2.out",
      });

      gsap.to(
        [
          ...desktopTexts,
          ...desktop4kTexts,
        ],
        {
          color: "#000000",
          duration: 0.35,
          ease: "power2.out",
        }
      );

      gsap.to(
        [
          ...desktopIcons,
          ...desktop4kIcons,
        ],
        {
          color: "#000000",
          duration: 0.35,
          ease: "power2.out",
        }
      );

      gsap.to(logos, {
        filter: "brightness(0)",
        duration: 0.35,
        ease: "power2.out",
      });
    } else {
      gsap.to(nav, {
        backgroundColor: "rgba(255,255,255,0)",
        duration: 0.35,
        ease: "power2.out",
      });

      gsap.to(
        [
          ...desktopTexts,
          ...desktop4kTexts,
        ],
        {
          color: "#ffffff",
          duration: 0.35,
          ease: "power2.out",
        }
      );

      gsap.to(
        [
          ...desktopIcons,
          ...desktop4kIcons,
        ],
        {
          color: "#ffffff",
          duration: 0.35,
          ease: "power2.out",
        }
      );

      gsap.to(logos, {
        filter: "none",
        duration: 0.35,
        ease: "power2.out",
      });
    }
  }, [desktopScrolled, desktopHovered]);

  /* ─────────────────────────────────────────────
     MOBILE MENU GSAP
  ───────────────────────────────────────────── */

  useEffect(() => {
    if (!mobileMenuRef.current) return;

    if (menuOpen) {
      gsap.to(mobileMenuRef.current, {
        y: "0%",
        duration: 0.6,
        ease: "power4.out",
        pointerEvents: "auto",
      });

      gsap.to(mobileLogoRef.current, {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.5,
        delay: 0.12,
        ease: "power3.out",
      });

      gsap.to(mobileCloseRef.current, {
        opacity: 1,
        rotation: 0,
        scale: 1,
        duration: 0.4,
        delay: 0.15,
        ease: "back.out(1.7)",
      });

      gsap.to(mobileItemsRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.45,
        stagger: 0.065,
        delay: 0.22,
        ease: "power3.out",
      });
    } else {
      gsap.to(mobileMenuRef.current, {
        y: "-100%",
        duration: 0.5,
        ease: "power3.inOut",
        pointerEvents: "none",
      });

      gsap.set(mobileLogoRef.current, {
        y: -20,
        opacity: 0,
        scale: 0.92,
      });

      gsap.set(mobileCloseRef.current, {
        opacity: 0,
        rotation: -20,
        scale: 0.7,
      });

      gsap.set(mobileItemsRef.current, {
        y: 24,
        opacity: 0,
      });
    }
  }, [menuOpen]);

  /* ─────────────────────────────────────────────
     MOBILE SEARCH
  ───────────────────────────────────────────── */

  const openMobileSearch = () => {
    setMobileSearchOpen(true);

    gsap.to(mobileNavbarLogoRef.current, {
      opacity: 0,
      scale: 0.9,
      duration: 0.25,
      ease: "power2.out",
    });

    gsap.fromTo(
      mobileSearchRef.current,
      {
        width: 0,
        opacity: 0,
      },
      {
        width: 170,
        opacity: 1,
        duration: 0.45,
        ease: "power3.out",
        onComplete: () => {
          mobileSearchInputRef.current?.focus();
        },
      }
    );
  };

  const closeMobileSearch = () => {
    gsap.to(mobileSearchRef.current, {
      width: 0,
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => {
        setMobileSearchOpen(false);
        setSearchValue("");
      },
    });

    gsap.to(mobileNavbarLogoRef.current, {
      opacity: 1,
      scale: 1,
      duration: 0.3,
      delay: 0.1,
      ease: "power2.out",
    });
  };

  /* ─────────────────────────────────────────────
     TABLET SEARCH
  ───────────────────────────────────────────── */

  const openTabletSearch = () => {
    setTabletSearchOpen(true);

    gsap.to(tabletNavbarLogoRef.current, {
      opacity: 0,
      scale: 0.9,
      duration: 0.25,
      ease: "power2.out",
    });

    gsap.fromTo(
      tabletSearchRef.current,
      {
        width: 0,
        opacity: 0,
      },
      {
        width: 210,
        opacity: 1,
        duration: 0.45,
        ease: "power3.out",
        onComplete: () => {
          tabletSearchInputRef.current?.focus();
        },
      }
    );
  };

  const closeTabletSearch = () => {
    gsap.to(tabletSearchRef.current, {
      width: 0,
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => {
        setTabletSearchOpen(false);
        setSearchValue("");
      },
    });

    gsap.to(tabletNavbarLogoRef.current, {
      opacity: 1,
      scale: 1,
      duration: 0.3,
      delay: 0.1,
      ease: "power2.out",
    });
  };

  /* ─────────────────────────────────────────────
     DESKTOP SEARCH
  ───────────────────────────────────────────── */

  const openDesktopSearch = () => {
    setDesktopSearchOpen(true);

    gsap.fromTo(
      desktopSearchRef.current,
      {
        width: 0,
        opacity: 0,
      },
      {
        width: 220,
        opacity: 1,
        duration: 0.45,
        ease: "power3.out",
        onComplete: () => {
          desktopSearchInputRef.current?.focus();
        },
      }
    );

    gsap.fromTo(
      desktop4kSearchRef.current,
      {
        width: 0,
        opacity: 0,
      },
      {
        width: 220,
        opacity: 1,
        duration: 0.45,
        ease: "power3.out",
        onComplete: () => {
          desktop4kSearchInputRef.current?.focus();
        },
      }
    );
  };

  const closeDesktopSearch = () => {
    gsap.to(
      [
        desktopSearchRef.current,
        desktop4kSearchRef.current,
      ],
      {
        width: 0,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          setDesktopSearchOpen(false);
          setSearchValue("");
        },
      }
    );
  };

  /* ─────────────────────────────────────────────
     MOBILE MENU CONTENT
  ───────────────────────────────────────────── */

  const MobileMenuContent = () => (
    <>
      {/* Close Button */}
      <button
        ref={mobileCloseRef}
        onClick={closeMenu}
        aria-label="Close menu"
        className="absolute right-5 top-5 flex items-center justify-center p-2 text-black outline-none"
        style={{
          opacity: 0,
          transform: "rotate(-20deg) scale(0.7)",
          WebkitTapHighlightColor: "transparent",
          WebkitAppearance: "none",
        }}
      >
        <FiX size={27} strokeWidth={1.6} />
      </button>

      {/* Logo */}
      <div
        ref={mobileLogoRef}
        className="mb-10"
        style={{
          opacity: 0,
          transform: "translateY(-20px) scale(0.92)",
        }}
      >
        <img
          src={logo}
          alt="NRGY Logo"
          className="w-[120px] h-auto select-none"
          draggable="false"
        />
      </div>

      {/* Menu Links */}
      <nav className="flex flex-col items-center">
        {navItems.map((item, index) => (
          <div
            key={item}
            ref={(el) => {
              mobileItemsRef.current[index] = el;
            }}
            style={{
              opacity: 0,
              transform: "translateY(24px)",
            }}
          >
            <button
              onClick={closeMenu}
              className="px-10 py-2.5 text-[24px] tracking-wide text-black outline-none"
              style={{
                fontFamily: "var(--font-nav)",
                WebkitTapHighlightColor: "transparent",
                WebkitAppearance: "none",
              }}
            >
              {item}
            </button>
          </div>
        ))}
      </nav>
    </>
  );

  return (
    <>
      {/* ═══════════════════════════════════════════════
          MOBILE MENU
      ═══════════════════════════════════════════════ */}

      <div
        ref={mobileMenuRef}
        className="fixed inset-0 z-[80] flex flex-col items-center justify-center md:hidden"
        style={{
          background: "#fff",
          transform: "translateY(-100%)",
          pointerEvents: "none",
          willChange: "transform",
        }}
      >
        <MobileMenuContent />
      </div>

      {/* ═══════════════════════════════════════════════
          MOBILE NAVBAR
      ═══════════════════════════════════════════════ */}

      <div className="fixed top-0 left-0 z-50 w-full md:hidden">
        <div
          className="relative flex h-16 w-full items-center bg-white px-5 border-b border-gray-200"
          style={{
            WebkitTapHighlightColor: "transparent",
            touchAction: "manipulation",
          }}
        >
          {/* Hamburger */}
          <div className="flex-1 flex items-center">
            <button
              type="button"
              aria-label="Open menu"
              onClick={toggleMenu}
              className="flex items-center justify-center p-2 text-black outline-none"
              style={{
                WebkitTapHighlightColor: "transparent",
                WebkitAppearance: "none",
                touchAction: "manipulation",
              }}
            >
              <FiMenu size={23} strokeWidth={1.7} />
            </button>
          </div>

          {/* Center Logo */}
          <div
            ref={mobileNavbarLogoRef}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <img
              src={logo}
              alt="NRGY Logo"
              className="w-[72px] h-auto pointer-events-auto cursor-pointer select-none"
              draggable="false"
            />
          </div>

          {/* Mobile Search - LINE ONLY */}
          <div
            ref={mobileSearchRef}
            className="absolute right-[98px] flex h-10 items-center overflow-hidden"
            style={{
              width: 0,
              opacity: 0,
            }}
          >
            <input
              ref={mobileSearchInputRef}
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search"
              className="h-10 w-full bg-transparent px-0 text-[14px] text-black outline-none"
              style={{
                border: "none",
                borderBottom: "1px solid #000",
                borderRadius: 0,
                boxShadow: "none",
              }}
            />
          </div>

          {/* Right Icons */}
          <div className="flex-1 flex items-center justify-end gap-4">
            <button
              type="button"
              aria-label={
                mobileSearchOpen
                  ? "Close search"
                  : "Search"
              }
              onClick={
                mobileSearchOpen
                  ? closeMobileSearch
                  : openMobileSearch
              }
              className="flex items-center justify-center p-2 text-black outline-none"
              style={{
                WebkitTapHighlightColor: "transparent",
                WebkitAppearance: "none",
                touchAction: "manipulation",
              }}
            >
              {mobileSearchOpen ? (
                <FiX size={21} strokeWidth={1.7} />
              ) : (
                <FiSearch size={21} strokeWidth={1.7} />
              )}
            </button>

            <button
              type="button"
              aria-label="Account"
              className="flex items-center justify-center p-2 text-black outline-none"
              style={{
                WebkitTapHighlightColor: "transparent",
                WebkitAppearance: "none",
                touchAction: "manipulation",
              }}
            >
              <FiUser size={22} strokeWidth={1.7} />
            </button>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          TABLET NAVBAR
      ═══════════════════════════════════════════════ */}

      <nav className="fixed top-0 left-0 z-50 hidden w-full text-white md:block lg:hidden">
        <div className="relative flex h-16 w-full items-center px-6">

          {/* Left */}
          <div className="flex-1 flex items-center">
            <button
              type="button"
              aria-label="Open menu"
              onClick={toggleMenu}
              className="p-1 text-white transition-opacity duration-200 active:opacity-60"
            >
              <FiMenu size={22} strokeWidth={1.8} />
            </button>
          </div>

          {/* Center Logo */}
          <div
            ref={tabletNavbarLogoRef}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <img
              src={logo}
              alt="NRGY Logo"
              className="w-[80px] h-auto pointer-events-auto cursor-pointer"
              draggable="false"
            />
          </div>

          {/* Tablet Search - LINE ONLY */}
          <div
            ref={tabletSearchRef}
            className="absolute right-[180px] flex h-10 items-center overflow-hidden"
            style={{
              width: 0,
              opacity: 0,
            }}
          >
            <input
              ref={tabletSearchInputRef}
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search"
              className="h-10 w-full bg-transparent px-0 text-[14px] text-white outline-none"
              style={{
                border: "none",
                borderBottom: "1px solid currentColor",
                borderRadius: 0,
                boxShadow: "none",
              }}
            />
          </div>

          {/* Right */}
          <div className="flex-1 flex items-center justify-end gap-5">
            <button
              type="button"
              aria-label={
                tabletSearchOpen
                  ? "Close search"
                  : "Search"
              }
              onClick={
                tabletSearchOpen
                  ? closeTabletSearch
                  : openTabletSearch
              }
              className="transition-all duration-300 hover:scale-110"
            >
              {tabletSearchOpen ? (
                <FiX size={19} />
              ) : (
                <FiSearch size={19} />
              )}
            </button>

            <button
              type="button"
              className="transition-all duration-300 hover:scale-110"
            >
              <FiHeart size={20} strokeWidth={1.5} />
            </button>

            <button
              type="button"
              className="transition-all duration-300 hover:scale-110"
            >
              <FiShoppingBag
                size={20}
                strokeWidth={1.5}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════════
          DESKTOP NAVBAR
          HOVER OR SCROLL = WHITE + BLACK
      ═══════════════════════════════════════════════ */}

      <nav
        ref={desktopNavRef}
        className="fixed top-0 left-0 z-50 hidden w-full lg:block"
        style={{
          backgroundColor: "rgba(255,255,255,0)",
        }}
        onMouseEnter={() => {
          setDesktopHovered(true);
        }}
        onMouseLeave={() => {
          setDesktopHovered(false);
        }}
      >

        {/* ═════════════════════════════════════════════
            STANDARD DESKTOP
        ═════════════════════════════════════════════ */}

        <div className="relative mx-auto flex h-20 max-w-[1600px] items-center justify-between px-14 2xl:hidden">

          {/* Logo */}
          <div
            ref={desktopLogoRef}
            className="flex-1"
          >
            <img
              src={logo}
              alt="NRGY Logo"
              className="w-[65px] h-auto cursor-pointer select-none"
              draggable="false"
            />
          </div>

          {/* Navigation */}
          <ul
            onMouseLeave={() => setActive(null)}
            className="flex flex-1 justify-center gap-8 font-nav text-[13px] font-semibold tracking-wide xl:gap-10 xl:text-[14px]"
          >
            {navItems.map((item, index) => (
              <li
                key={item}
                ref={(el) => {
                  desktopTextRefs.current[index] = el;
                }}
                onMouseEnter={() => setActive(item)}
                className={`cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  active
                    ? active === item
                      ? "opacity-100"
                      : "opacity-50"
                    : "opacity-100"
                }`}
                style={{
                  color: "#ffffff",
                }}
              >
                {item}
              </li>
            ))}
          </ul>

          {/* Desktop Search - LINE ONLY */}
          <div
            ref={desktopSearchRef}
            className="absolute right-[184px] flex h-10 items-end overflow-hidden"
            style={{
              width: 0,
              opacity: 0,
            }}
          >
            <input
              ref={desktopSearchInputRef}
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search"
              className="h-9 w-full bg-transparent px-0 pb-1 text-[14px] text-black outline-none"
              style={{
                border: "none",
                borderBottom: "1px solid #000",
                borderRadius: 0,
                boxShadow: "none",
              }}
            />
          </div>

          {/* Right Icons */}
          <div className="flex flex-1 items-center justify-end gap-6">

            {/* Search */}
            <button
              ref={(el) => {
                desktopIconRefs.current[0] = el;
              }}
              type="button"
              aria-label={
                desktopSearchOpen
                  ? "Close search"
                  : "Search"
              }
              onClick={
                desktopSearchOpen
                  ? closeDesktopSearch
                  : openDesktopSearch
              }
              className="transition-all duration-300 hover:scale-110"
              style={{
                color: "#ffffff",
              }}
            >
              {desktopSearchOpen ? (
                <FiX size={20} />
              ) : (
                <FiSearch size={20} />
              )}
            </button>

            {/* Heart */}
            <button
              ref={(el) => {
                desktopIconRefs.current[1] = el;
              }}
              type="button"
              className="transition-all duration-300 hover:scale-110"
              style={{
                color: "#ffffff",
              }}
            >
              <FiHeart
                size={22}
                strokeWidth={1.5}
              />
            </button>

            {/* Shopping Bag */}
            <button
              ref={(el) => {
                desktopIconRefs.current[2] = el;
              }}
              type="button"
              className="transition-all duration-300 hover:scale-110"
              style={{
                color: "#ffffff",
              }}
            >
              <FiShoppingBag
                size={22}
                strokeWidth={1.5}
              />
            </button>

          </div>
        </div>

        {/* ═════════════════════════════════════════════
            4K DESKTOP
        ═════════════════════════════════════════════ */}

        <div className="hidden 2xl:flex relative h-20 w-full items-center px-20">

          {/* Logo */}
          <div
            ref={desktop4kLogoRef}
            className="flex-none"
          >
            <img
              src={logo}
              alt="NRGY Logo"
              className="w-[70px] h-auto cursor-pointer select-none"
              draggable="false"
            />
          </div>

          {/* Center Navigation */}
          <ul
            onMouseLeave={() => setActive(null)}
            className="absolute left-1/2 -translate-x-1/2 flex gap-12 font-nav text-[15px] font-semibold tracking-wide"
          >
            {navItems.map((item, index) => (
              <li
                key={item}
                ref={(el) => {
                  desktop4kTextRefs.current[index] = el;
                }}
                onMouseEnter={() => setActive(item)}
                className={`cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  active
                    ? active === item
                      ? "opacity-100"
                      : "opacity-50"
                    : "opacity-100"
                }`}
                style={{
                  color: "#ffffff",
                }}
              >
                {item}
              </li>
            ))}
          </ul>

          {/* 4K Search - LINE ONLY */}
          <div
            ref={desktop4kSearchRef}
            className="absolute right-[218px] flex h-10 items-end overflow-hidden"
            style={{
              width: 0,
              opacity: 0,
            }}
          >
            <input
              ref={desktop4kSearchInputRef}
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search"
              className="h-9 w-full bg-transparent px-0 pb-1 text-[14px] text-black outline-none"
              style={{
                border: "none",
                borderBottom: "1px solid #000",
                borderRadius: 0,
                boxShadow: "none",
              }}
            />
          </div>

          {/* Right Icons */}
          <div className="ml-auto flex items-center gap-8">

            {/* Search */}
            <button
              ref={(el) => {
                desktop4kIconRefs.current[0] = el;
              }}
              type="button"
              aria-label={
                desktopSearchOpen
                  ? "Close search"
                  : "Search"
              }
              onClick={
                desktopSearchOpen
                  ? closeDesktopSearch
                  : openDesktopSearch
              }
              className="transition-all duration-300 hover:scale-110"
              style={{
                color: "#ffffff",
              }}
            >
              {desktopSearchOpen ? (
                <FiX size={22} />
              ) : (
                <FiSearch size={22} />
              )}
            </button>

            {/* Heart */}
            <button
              ref={(el) => {
                desktop4kIconRefs.current[1] = el;
              }}
              type="button"
              className="transition-all duration-300 hover:scale-110"
              style={{
                color: "#ffffff",
              }}
            >
              <FiHeart
                size={24}
                strokeWidth={1.5}
              />
            </button>

            {/* Shopping Bag */}
            <button
              ref={(el) => {
                desktop4kIconRefs.current[2] = el;
              }}
              type="button"
              className="transition-all duration-300 hover:scale-110"
              style={{
                color: "#ffffff",
              }}
            >
              <FiShoppingBag
                size={24}
                strokeWidth={1.5}
              />
            </button>

          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;