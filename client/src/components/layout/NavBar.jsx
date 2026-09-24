import MegaMenu from "../ui/MegaMenu";
import navigationData from "../../data/Navigation";

import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  FiShoppingBag,
  FiSearch,
  FiMenu,
  FiUser,
  FiX,
  FiHeart,
  FiChevronRight,
  FiChevronLeft,
  FiLogOut,
  FiClock,
} from "react-icons/fi";
import gsap from "gsap";

import logo from "../../assets/images/logo/logo.png";
import Login from "../Login";
import Signup from "../Signup";
import { useAuth } from "../../context/authContext";
import api from "../../api/axios";
import { clearAccessTokenStore } from "../../api/tokenStore";
import useCartStore from "../../store/cartStore";

const Navbar = ({ alwaysVisible = false }) => {
  const navItems = ["MEN", "WOMEN", "ACCESSORIES", "SALE"];
  const navigate = useNavigate();
  const location = useLocation();
  const { accessToken, setAccessToken, user, logout } = useAuth();
  const itemCount = useCartStore((state) => state.getItemCount());

  // True whenever a valid access token is in memory (or user object is set)
  const isLoggedIn = Boolean(accessToken) || Boolean(user);

  const [active, setActive] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPath, setMenuPath] = useState([]);
  
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);

  // Close modals when user logs in
  useEffect(() => {
    if (isLoggedIn) {
      setLoginOpen(false);
      setSignupOpen(false);
    }
  }, [isLoggedIn]);

  // Ref on the dropdown wrapper — used to detect outside clicks
  const accountDropdownRef = useRef(null);
  const accountDropdown4kRef = useRef(null);
  

  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [tabletSearchOpen, setTabletSearchOpen] = useState(false);
  const [desktopSearchOpen, setDesktopSearchOpen] = useState(false);

  const [desktopScrolled, setDesktopScrolled] = useState(false);
  const [desktopHovered, setDesktopHovered] = useState(false);

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
     HAMBURGER GSAP REFS
  ───────────────────────────────────────────── */

  const menuOverlayRef     = useRef(null);
  const menuLogoRef        = useRef(null);
  const menuCloseRef       = useRef(null);
  const menuItemsRef       = useRef([]);
  const prevPathLengthRef  = useRef(0);   // tracks direction: forward vs back

  /* ─────────────────────────────────────────────
     HAMBURGER TOGGLE
  ───────────────────────────────────────────── */

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const scrollToHero = () => {
    const hero = document.getElementById("hero");
    if (hero) {
      hero.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/");
    }
  };

  // closeMenu hides the overlay immediately, then resets the path AFTER
  // the CSS close animation finishes (0.45s transition + small buffer = 500ms).
  // Without the delay, React re-renders with menuPath=[] while the overlay is
  // still on screen sliding away — causing a flash back to the root level.
  const closeMenu = () => {
    setMenuOpen(false);
    setTimeout(() => setMenuPath([]), 500);
  };

  /* ─────────────────────────────────────────────
     MULTI-LEVEL MENU HELPERS
  ───────────────────────────────────────────── */

  /**
   * openSubMenu — push a new level onto menuPath.
   * React concept: functional state update via the prev => [...prev, label] pattern,
   * which always works on the latest state even inside closures.
   *
   * Example:
   *   menuPath = []       → click "MEN"      → menuPath = ["MEN"]
   *   menuPath = ["MEN"]  → click "TOP WEAR" → menuPath = ["MEN", "TOP WEAR"]
   */
  const openSubMenu = (label) => {
    setMenuPath((prev) => [...prev, label]);
  };

  /**
   * goBack — pop the last item off menuPath (go one level up).
   * Array.slice(0, -1) returns everything except the last element.
   *
   * Example:
   *   menuPath = ["MEN", "TOP WEAR"] → goBack() → menuPath = ["MEN"]
   *   menuPath = ["MEN"]             → goBack() → menuPath = []
   */
  const goBack = () => {
    setMenuPath((prev) => prev.slice(0, -1));
  };

  /**
   * getCurrentMenuItems — derives what to render from the current menuPath.
   *
   * This is the heart of the system. It reads menuPath and returns
   * an array of { label, children } objects:
   *   children !== null → clicking goes deeper (openSubMenu)
   *   children === null → clicking is a final navigation action
   *
   * Level 0 (menuPath = []):
   *   Shows the 5 top-level nav items: MEN, WOMEN, SPORTS, ACCESSORIES, SALE
   *   Each item's children = navigationData[key].sections (or null if no data, e.g. SALE)
   *
   * Level 1 (menuPath = ["MEN"]):
   *   Shows that category's sections: TOP WEAR, BOTTOM WEAR, FOOTWEAR, JACKETS…
   *   Each section's children = section.items (the leaf strings)
   *
   * Level 2 (menuPath = ["MEN", "TOP WEAR"]):
   *   Shows the actual items: T-Shirts, Polo Shirts, Tank Tops…
   *   children = null (these are leaves — clicking navigates)
   */
  const getCurrentMenuItems = () => {
    // ── LEVEL 0 — root: the 5 main categories ──────────────────
    if (menuPath.length === 0) {
      return navItems.map((item) => ({
        label: item,
        // Optional chaining (?.) safely returns undefined if the key doesn't exist
        // Nullish coalescing (??) falls back to null (SALE has no navigationData entry)
        children: navigationData[item.toLowerCase()]?.sections ?? null,
      }));
    }

    // ── LEVEL 1 — category: e.g. "MEN" → its sections ──────────
    if (menuPath.length === 1) {
      const topKey  = menuPath[0].toLowerCase();
      const topData = navigationData[topKey];
      if (!topData) return []; // safety: e.g. if SALE is somehow clicked
      return topData.sections.map((section) => ({
        label:    section.title,
        children: section.items,  // array of strings → next level will be leaves
      }));
    }

    // ── LEVEL 2 — section: e.g. "TOP WEAR" → its leaf items ─────
    if (menuPath.length === 2) {
      const topKey  = menuPath[0].toLowerCase();
      const topData = navigationData[topKey];
      if (!topData) return [];
      const section = topData.sections.find((s) => s.title === menuPath[1]);
      if (!section) return [];
      return section.items.map((item) => ({
        label:    item,
        children: null, // null = leaf — clicking will eventually navigate
      }));
    }

    return []; // future-proofing: any deeper level returns empty
  };

  /* ─────────────────────────────────────────────
     LOGOUT
  ───────────────────────────────────────────── */

  const handleLogout = async () => {
    setAccountMenuOpen(false);
    try {
      await api.post("/auth/logout");
    } catch {
      // If the request fails (e.g. already expired), still clear client-side state
    }
    clearAccessTokenStore();
    logout(); // clears accessToken + user in context
    navigate("/");
  };

  /* ─────────────────────────────────────────────
     DROPDOWN — CLOSE ON OUTSIDE CLICK
  ───────────────────────────────────────────── */

  useEffect(() => {
    if (!accountMenuOpen) return;
    const handler = (e) => {
      if (
        (accountDropdownRef.current && !accountDropdownRef.current.contains(e.target)) &&
        (accountDropdown4kRef.current && !accountDropdown4kRef.current.contains(e.target))
      ) {
        setAccountMenuOpen(false);
      }
    };
    // Defer by one tick so the click that opened the dropdown
    // doesn't immediately trigger the outside-click handler
    const timerId = setTimeout(() => {
      document.addEventListener("mousedown", handler);
    }, 0);
    return () => {
      clearTimeout(timerId);
      document.removeEventListener("mousedown", handler);
    };
  }, [accountMenuOpen]);

  /* ─────────────────────────────────────────────
     DROPDOWN — CLOSE ON ROUTE CHANGE
  ───────────────────────────────────────────── */

  useEffect(() => {
    setAccountMenuOpen(false);
  }, [location.pathname]);

  /* ─────────────────────────────────────────────
     BODY SCROLL LOCK
  ───────────────────────────────────────────── */

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  /* ─────────────────────────────────────────────
     LEVEL-CHANGE ANIMATION
     Fires whenever menuPath changes OR menuOpen changes.
     Slides new items in from the right (going deeper)
     or from the left (going back).
  ───────────────────────────────────────────── */

  useEffect(() => {
    // If the menu is closed, reset direction tracker and exit
    if (!menuOpen) {
      prevPathLengthRef.current = 0;
      return;
    }

    // Collect all the currently-rendered item buttons via their refs
    const items = menuItemsRef.current.filter(Boolean);
    if (items.length === 0) return;

    // Determine direction:
    //   menuPath grew (went deeper) → slide in from RIGHT (x: +32)
    //   menuPath shrank (went back)  → slide in from LEFT  (x: -32)
    const isGoingDeeper = menuPath.length >= prevPathLengthRef.current;
    prevPathLengthRef.current = menuPath.length; // remember for next change

    gsap.fromTo(
      items,
      // FROM: invisible, offset to left or right
      { autoAlpha: 0, x: isGoingDeeper ? 32 : -32 },
      // TO: fully visible, in place
      {
        autoAlpha: 1,
        x: 0,
        duration: 0.3,
        stagger: 0.045,
        ease: "power3.out",
        overwrite: true, // cancel any in-progress animation on these elements
      }
    );
  }, [menuPath, menuOpen]); // re-runs on every level change AND on menu open/close

  /* ─────────────────────────────────────────────
     HAMBURGER GSAP ANIMATION
  ───────────────────────────────────────────── */

  useEffect(() => {
    const overlay = menuOverlayRef.current;
    const logoEl  = menuLogoRef.current;
    const closeEl = menuCloseRef.current;
    const items   = menuItemsRef.current.filter(Boolean);

    if (!overlay) return;

    if (menuOpen) {
      /* ── Overlay slides in ── */
      gsap.to(overlay, {
        y: "0%",
        duration: 0.65,
        ease: "power4.out",
        overwrite: true,
        onStart: () => { overlay.style.pointerEvents = "auto"; },
      });

      /* ── Logo fades + scales in ── */
      gsap.fromTo(
        logoEl,
        { autoAlpha: 0, scale: 0.85, y: -16 },
        { autoAlpha: 1, scale: 1, y: 0, duration: 0.55, delay: 0.18, ease: "power3.out" }
      );

      /* ── Close button spins + scales in ── */
      gsap.fromTo(
        closeEl,
        { autoAlpha: 0, rotation: -45, scale: 0.6 },
        { autoAlpha: 1, rotation: 0, scale: 1, duration: 0.45, delay: 0.22, ease: "back.out(2)" }
      );

      /* ── Nav items stagger up ── */
      gsap.fromTo(
        items,
        { autoAlpha: 0, y: 30 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.07,
          delay: 0.28,
          ease: "power3.out",
        }
      );
    } else {
      /* ── Nav items fade out fast ── */
      gsap.to(items, {
        autoAlpha: 0,
        y: -12,
        duration: 0.2,
        stagger: 0.03,
        ease: "power2.in",
        overwrite: true,
      });

      /* ── Logo + close fade out ── */
      gsap.to([logoEl, closeEl], {
        autoAlpha: 0,
        duration: 0.18,
        ease: "power2.in",
        overwrite: true,
      });

      /* ── Overlay slides out ── */
      gsap.to(overlay, {
        y: "-100%",
        duration: 0.5,
        delay: 0.05,
        ease: "power3.inOut",
        overwrite: true,
        onComplete: () => { overlay.style.pointerEvents = "none"; },
      });
    }
  }, [menuOpen]);

  /* ─────────────────────────────────────────────
     CLOSE MENU WHEN RESIZED TO DESKTOP
  ───────────────────────────────────────────── */

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* ─────────────────────────────────────────────
     DESKTOP SCROLL
  ───────────────────────────────────────────── */

  useEffect(() => {
    // When alwaysVisible is true, the navbar stays white; skip scroll tracking.
    if (alwaysVisible) return;

    const handleScroll = () => {
      setDesktopScrolled(window.scrollY > 10);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [alwaysVisible]);

  /* ─────────────────────────────────────────────
     DESKTOP NAVBAR COLOR — HOVER OR SCROLL
  ───────────────────────────────────────────── */

  useEffect(() => {
    // alwaysVisible overrides hover/scroll — navbar is permanently white.
    const shouldBeWhite = alwaysVisible || desktopScrolled || !!active;

    const nav = desktopNavRef.current;
    const desktopTexts = desktopTextRefs.current.filter(Boolean);
    const desktopIcons = desktopIconRefs.current.filter(Boolean);
    const desktop4kTexts = desktop4kTextRefs.current.filter(Boolean);
    const desktop4kIcons = desktop4kIconRefs.current.filter(Boolean);
    const logos = [desktopLogoRef.current, desktop4kLogoRef.current].filter(Boolean);

    if (shouldBeWhite) {
      gsap.to(nav, { backgroundColor: "#ffffff", borderBottomColor: "rgba(0,0,0,0)", duration: 0.35, ease: "power2.out" });
      gsap.to([...desktopTexts, ...desktop4kTexts], { color: "#000000", duration: 0.35, ease: "power2.out" });
      gsap.to([...desktopIcons, ...desktop4kIcons], { color: "#000000", duration: 0.35, ease: "power2.out" });
      gsap.to(logos, { filter: "brightness(0)", duration: 0.35, ease: "power2.out" });
    } else {
      gsap.to(nav, { backgroundColor: "rgba(255,255,255,0)", borderBottomColor: "rgba(255,255,255,0.7)", duration: 0.35, ease: "power2.out" });
      gsap.to([...desktopTexts, ...desktop4kTexts], { color: "#ffffff", duration: 0.35, ease: "power2.out" });
      gsap.to([...desktopIcons, ...desktop4kIcons], { color: "#ffffff", duration: 0.35, ease: "power2.out" });
      gsap.to(logos, { filter: "none", duration: 0.35, ease: "power2.out" });
    }
  }, [alwaysVisible, desktopScrolled, desktopHovered, active]);

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
      { width: 0, opacity: 0 },
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
      { width: 0, opacity: 0 },
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
      { width: 0, opacity: 0 },
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
      { width: 0, opacity: 0 },
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
    gsap.to([desktopSearchRef.current, desktop4kSearchRef.current], {
      width: 0,
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => {
        setDesktopSearchOpen(false);
        setSearchValue("");
      },
    });
  };

  /* ─────────────────────────────────────────────
     RENDER
  ───────────────────────────────────────────── */

  return (
    <>
      {/* ═══════════════════════════════════════════════
          MOBILE / TABLET MENU OVERLAY
          Pure CSS transition — visible on mobile + tablet
      ═══════════════════════════════════════════════ */}

      <div
        className="fixed inset-0 z-[80] flex flex-col lg:hidden"
        style={{
          background: "#fff",
          transform: menuOpen ? "translateY(0%)" : "translateY(-100%)",
          transition: menuOpen
            ? "transform 0.55s cubic-bezier(0.16,1,0.3,1)"
            : "transform 0.45s cubic-bezier(0.7,0,0.84,0)",
          pointerEvents: menuOpen ? "auto" : "none",
          willChange: "transform",
        }}
      >
        {/* ── TOP ROW: Logo centred + Close button right ──────────────────
             Close button lives INSIDE the flex row (not absolute),
             so it can never be covered by another element.
             Logo is absolutely centred within the row.
        ─────────────────────────────────────────────────────────────── */}
        <div className="relative flex h-20 flex-shrink-0 items-center px-5">

          {/* Logo — centred in the row */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <img
              src={logo}
              alt="NRGY Logo"
              className="w-[80px] h-auto select-none"
              draggable="false"
            />
          </div>

          {/* Close button — right edge, always clickable */}
          <button
            onClick={closeMenu}
            aria-label="Close menu"
            className="ml-auto flex items-center justify-center p-2 text-black outline-none"
            style={{
              WebkitTapHighlightColor: "transparent",
              WebkitAppearance: "none",
              touchAction: "manipulation",
            }}
          >
            <FiX size={24} strokeWidth={1.6} />
          </button>
        </div>

        {/* ── BACK ROW: only visible when inside a sub-level ─────────────── */}
        {menuPath.length > 0 && (
          <div className="flex items-center px-6 pb-1">
            <button
              onClick={goBack}
              aria-label="Go back one level"
              className="flex items-center gap-1.5 text-black outline-none"
              style={{
                fontFamily: "var(--font-nav)",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.12em",
                WebkitTapHighlightColor: "transparent",
                WebkitAppearance: "none",
                touchAction: "manipulation",
              }}
            >
              <FiChevronLeft size={15} strokeWidth={2.5} />
              BACK
            </button>
          </div>
        )}



        {/* ── SCROLLABLE ITEM LIST ────────────────────────────────────────────
             Every item — whether a parent or leaf — is rendered the same way:
             · Large centred text (matching the original big MEN / WOMEN style)
             · FiChevronRight on ALL items (user requested "everything have > icon")
             · No separator lines
        ─────────────────────────────────────────────────────────────── */}
        <nav
          className="flex-1 overflow-y-auto flex flex-col items-start justify-center px-6 pb-10"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {getCurrentMenuItems().map((menuItem, index, arr) => (
            <div
              key={menuItem.label}
              className="w-full flex justify-start"
              style={{
                borderBottom: index < arr.length - 1 ? "1px solid #e5e7eb" : "none",
              }}
            >
              <button
                ref={(el) => { menuItemsRef.current[index] = el; }}
                onClick={() => {
                  if (menuItem.children) {
                    openSubMenu(menuItem.label);
                  } else {
                    const topKey = menuPath[0]?.toLowerCase();
                    const item   = menuItem.label;
                    if (topKey === "sports") {
                      navigate(`/products/${item.toLowerCase()}`);
                    } else if (topKey === "men") {
                      navigate(`/men/${item}`);
                    } else if (topKey === "women") {
                      navigate(`/women/${item}`);
                    } else if (topKey === "accessories") {
                      navigate(`/accessories/${item}`);
                    }
                    closeMenu();
                  }
                }}
                aria-label={menuItem.label}
                className="flex items-center py-4 text-black outline-none"
                style={{
                  fontFamily: "var(--font-nav)",
                  fontSize: "22px",
                  fontWeight: 400,
                  letterSpacing: "0.06em",
                  textTransform: "capitalize",
                  WebkitTapHighlightColor: "transparent",
                  WebkitAppearance: "none",
                  touchAction: "manipulation",
                }}
              >
                {menuItem.label.toLowerCase()}
              </button>
            </div>
          ))}
        </nav>

        {/* ── BOTTOM BUTTONS ─ show auth state ──────────────── */}
        <div className="flex-shrink-0 flex flex-col gap-3 px-6 pb-8 pt-4 bg-white mt-auto"
          style={{ fontFamily: "var(--font-nav)" }}
        >
          {isLoggedIn ? (
            <>
              {/* User greeting */}
              {user?.name && (
                <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-gray-400 mb-1">
                  Hi, {user.name.split(' ')[0]}
                </p>
              )}
              {/* My Profile */}
              <Link
                to="/profile"
                onClick={closeMenu}
                className="w-full bg-[#3b4045] text-white py-3.5 text-[13px] tracking-[0.08em] font-semibold uppercase text-center transition-colors hover:bg-black block"
              >
                My Profile
              </Link>
              {/* Order History */}
              <Link
                to="/orders"
                onClick={closeMenu}
                className="w-full bg-[#3b4045] text-white border-t border-gray-600 py-3.5 text-[13px] tracking-[0.08em] font-semibold uppercase text-center transition-colors hover:bg-black block"
              >
                Order History
              </Link>
              {/* Logout */}
              <button
                onClick={() => { closeMenu(); handleLogout(); }}
                className="w-full bg-white text-[#3b4045] border border-gray-300 py-3.5 text-[13px] tracking-[0.08em] font-semibold uppercase transition-colors hover:bg-gray-50"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => { closeMenu(); setSignupOpen(true); }}
                className="w-full bg-[#3b4045] text-white py-3.5 text-[13px] tracking-[0.08em] font-semibold uppercase transition-colors hover:bg-black"
              >
                Join Us
              </button>
              <button
                onClick={() => { closeMenu(); setLoginOpen(true); }}
                className="w-full bg-white text-[#3b4045] border border-gray-300 py-3.5 text-[13px] tracking-[0.08em] font-semibold uppercase transition-colors hover:bg-gray-50"
              >
                Login
              </button>
            </>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          MOBILE NAVBAR  (< 768 px)
      ═══════════════════════════════════════════════ */}

      <div className="fixed top-0 left-0 right-0 z-50 w-full md:hidden" style={{ top: 0 }}>
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

          <div
            ref={mobileNavbarLogoRef}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <button
              type="button"
              onClick={scrollToHero}
              className="pointer-events-auto p-0 bg-transparent border-none outline-none"
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              <img
                src={logo}
                alt="NRGY Logo"
                className="w-[72px] h-auto cursor-pointer select-none"
                draggable="false"
              />
            </button>
          </div>

          {/* Mobile Search */}
          <div
            ref={mobileSearchRef}
            className="absolute right-[98px] flex h-10 items-center overflow-hidden"
            style={{ width: 0, opacity: 0 }}
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
              aria-label={mobileSearchOpen ? "Close search" : "Search"}
              onClick={mobileSearchOpen ? closeMobileSearch : openMobileSearch}
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
              aria-label="Cart"
              onClick={() => isLoggedIn ? navigate('/cart') : setLoginOpen(true)}
              className="relative flex items-center justify-center p-2 text-black outline-none"
              style={{
                WebkitTapHighlightColor: "transparent",
                WebkitAppearance: "none",
                touchAction: "manipulation",
              }}
            >
              <FiShoppingBag size={21} strokeWidth={1.7} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white">
                  {itemCount}
                </span>
              )}
            </button>


          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          TABLET NAVBAR  (768 px – 1023 px)
      ═══════════════════════════════════════════════ */}

      <nav className="fixed top-0 left-0 right-0 z-50 hidden w-full text-white md:block lg:hidden" style={{ top: 0 }}>
        <div className="relative flex h-16 w-full items-center px-6">

          {/* Left — Hamburger */}
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
            <button
              type="button"
              onClick={scrollToHero}
              className="pointer-events-auto p-0 bg-transparent border-none outline-none"
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              <img
                src={logo}
                alt="NRGY Logo"
                className="w-[80px] h-auto cursor-pointer"
                draggable="false"
              />
            </button>
          </div>

          {/* Tablet Search */}
          <div
            ref={tabletSearchRef}
            className="absolute right-[180px] flex h-10 items-center overflow-hidden"
            style={{ width: 0, opacity: 0 }}
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

          {/* Right Icons */}
          <div className="flex-1 flex items-center justify-end gap-5">
            <button
              type="button"
              aria-label={tabletSearchOpen ? "Close search" : "Search"}
              onClick={tabletSearchOpen ? closeTabletSearch : openTabletSearch}
              className="transition-all duration-300 hover:scale-110 cursor-pointer"
            >
              {tabletSearchOpen ? (
                <FiX size={19} />
              ) : (
                <FiSearch size={19} />
              )}
            </button>





            <button type="button" onClick={() => isLoggedIn ? navigate('/cart') : setLoginOpen(true)} className="relative transition-all duration-300 hover:scale-110 cursor-pointer">
              <FiShoppingBag size={20} strokeWidth={1.5} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white">
                  {itemCount}
                </span>
              )}
            </button>


          </div>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════════
          DESKTOP NAVBAR  (≥ 1024 px)
          HOVER OR SCROLL = WHITE + BLACK
      ═══════════════════════════════════════════════ */}

       <nav
        ref={desktopNavRef}
        className="fixed top-0 left-0 right-0 z-50 hidden w-full lg:block border-b"
        style={{ top: 0, backgroundColor: "rgba(255,255,255,0)", borderBottomColor: "rgba(255,255,255,0.7)" }}
        onMouseLeave={() => {
          setDesktopHovered(false);
          setActive(null);
        }}
        >

        {/* ── STANDARD DESKTOP ──────────────────────── */}

        <div className="relative mx-auto flex h-20 max-w-[1600px] items-center justify-between px-14 2xl:hidden">

          {/* Logo */}
          <div ref={desktopLogoRef} className="flex-1">
            <img
              src={logo}
              alt="NRGY Logo"
              onClick={scrollToHero}
              className="w-[65px] h-auto cursor-pointer select-none"
              draggable="false"
            />
          </div>

          {/* Navigation */}
          <ul
              className="flex flex-1 justify-center gap-8 font-nav text-[13px] font-semibold tracking-wide xl:gap-10 xl:text-[14px]"
            >
            {navItems.map((item, index) => (
              <li
                key={item}
                ref={(el) => { desktopTextRefs.current[index] = el; }}
                onMouseEnter={() => setActive(item)}
                className={`cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  active
                    ? active === item ? "opacity-100" : "opacity-50"
                    : "opacity-100"
                }`}
                style={{ color: "#ffffff" }}
              >
                {item}
              </li>
            ))}
          </ul>

          {/* Desktop Search */}
          <div
            ref={desktopSearchRef}
            className="absolute right-[184px] flex h-10 items-end overflow-hidden"
            style={{ width: 0, opacity: 0 }}
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

            <button
              ref={(el) => { desktopIconRefs.current[0] = el; }}
              type="button"
              aria-label={desktopSearchOpen ? "Close search" : "Search"}
              onClick={desktopSearchOpen ? closeDesktopSearch : openDesktopSearch}
              className="transition-all duration-300 hover:scale-110 cursor-pointer"
              style={{ color: "#ffffff" }}
            >
              {desktopSearchOpen ? <FiX size={20} /> : <FiSearch size={20} />}
            </button>

            {/* ── Account icon — unauthenticated: opens login modal
                              authenticated: opens dropdown ── */}
            <div
              ref={accountDropdownRef}
              className="relative flex items-center justify-center"
              style={{ overflow: "visible" }}
            >
              <button
                ref={(el) => { desktopIconRefs.current[1] = el; }}
                type="button"
                aria-label="Account"
                onClick={() => isLoggedIn ? setAccountMenuOpen((p) => !p) : setLoginOpen(true)}
                className="transition-all duration-300 hover:scale-110 cursor-pointer"
                style={{ color: "#ffffff" }}
              >
                <FiUser size={21} strokeWidth={1.7} />
              </button>

              {/* ── Authenticated dropdown ── */}
              {isLoggedIn && accountMenuOpen && (
                <div
                  className="absolute left-1/2 -translate-x-1/2 bg-white border border-gray-200 shadow-xl py-2"
                  style={{ top: "calc(100% + 12px)", width: 280, fontFamily: "var(--font-nav)", zIndex: 9999 }}
                  role="menu"
                >
                  {/* My Account — TODO: /account page to be built in a later phase */}
                  <Link
                    to="/account"
                    role="menuitem"
                    className="flex items-center gap-3 px-5 py-4 text-[14px] font-medium text-black hover:bg-gray-50 transition-colors"
                  >
                    <FiUser size={15} strokeWidth={2} />
                    My account
                  </Link>

                  <hr className="mx-5 border-gray-100" />

                  {/* Wishlist — page planned for a later phase */}
                  <Link
                    to="/wishlist"
                    role="menuitem"
                    className="flex items-center gap-3 px-5 py-4 text-[14px] font-medium text-black hover:bg-gray-50 transition-colors"
                  >
                    <FiHeart size={15} strokeWidth={2} />
                    Wishlist
                  </Link>

                  <hr className="mx-5 border-gray-100" />

                  {/* Order History */}
                  <Link
                    to="/orders"
                    role="menuitem"
                    className="flex items-center gap-3 px-5 py-4 text-[14px] font-medium text-black hover:bg-gray-50 transition-colors"
                  >
                    <FiClock size={15} strokeWidth={2} />
                    Order history
                  </Link>

                  <hr className="mx-5 border-gray-100" />

                  {/* Logout */}
                  <div className="p-4 pt-2">
                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleLogout}
                      className="flex w-full items-center justify-center gap-2 bg-black py-3 text-[14px] font-medium text-white transition-transform active:scale-95 hover:bg-gray-800"
                    >
                      <FiLogOut size={15} strokeWidth={2} />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              ref={(el) => { desktopIconRefs.current[2] = el; }}
              type="button"
              onClick={() => isLoggedIn ? navigate('/cart') : setLoginOpen(true)}
              className="relative transition-all duration-300 hover:scale-110 cursor-pointer"
              style={{ color: "#ffffff" }}
            >
              <FiShoppingBag size={22} strokeWidth={1.5} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white">
                  {itemCount}
                </span>
              )}
            </button>

          </div>
        </div>

        {/* ── 4K DESKTOP ────────────────────────────── */}

        <div className="hidden 2xl:flex relative h-20 w-full items-center px-20">

          {/* Logo */}
          <div ref={desktop4kLogoRef} className="flex-none">
            <img
              src={logo}
              alt="NRGY Logo"
              onClick={scrollToHero}
              className="w-[70px] h-auto cursor-pointer select-none"
              draggable="false"
            />
          </div>

          {/* Center Navigation */}
        <ul
          className="absolute left-1/2 -translate-x-1/2 flex gap-12 font-nav text-[15px] font-semibold tracking-wide"
        >
            {navItems.map((item, index) => (
              <li
                key={item}
                ref={(el) => { desktop4kTextRefs.current[index] = el; }}
                onMouseEnter={() => setActive(item)}
                className={`cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  active
                    ? active === item ? "opacity-100" : "opacity-50"
                    : "opacity-100"
                }`}
                style={{ color: "#ffffff" }}
              >
                {item}
              </li>
            ))}
          </ul>

          {/* 4K Search */}
          <div
            ref={desktop4kSearchRef}
            className="absolute right-[218px] flex h-10 items-end overflow-hidden"
            style={{ width: 0, opacity: 0 }}
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

            <button
              ref={(el) => { desktop4kIconRefs.current[0] = el; }}
              type="button"
              aria-label={desktopSearchOpen ? "Close search" : "Search"}
              onClick={desktopSearchOpen ? closeDesktopSearch : openDesktopSearch}
              className="transition-all duration-300 hover:scale-110 cursor-pointer"
              style={{ color: "#ffffff" }}
            >
              {desktopSearchOpen ? <FiX size={22} /> : <FiSearch size={22} />}
            </button>

            {/* ── Account icon (4K) — same logic as standard desktop ── */}
            <div
              ref={accountDropdown4kRef}
              className="relative flex items-center justify-center"
              style={{ overflow: "visible" }}
            >
              <button
                ref={(el) => { desktop4kIconRefs.current[1] = el; }}
                type="button"
                aria-label="Account"
                onClick={() => isLoggedIn ? setAccountMenuOpen((p) => !p) : setLoginOpen(true)}
                className="transition-all duration-300 hover:scale-110 cursor-pointer"
                style={{ color: "#ffffff" }}
              >
                <FiUser size={23} strokeWidth={1.7} />
              </button>
              
              {/* ── Authenticated dropdown (4K) ── */}
              {isLoggedIn && accountMenuOpen && (
                <div
                  className="absolute left-1/2 -translate-x-1/2 bg-white border border-gray-200 shadow-xl py-2"
                  style={{ top: "calc(100% + 12px)", width: 280, fontFamily: "var(--font-nav)", zIndex: 9999 }}
                  role="menu"
                >
                  <Link
                    to="/account"
                    role="menuitem"
                    className="flex items-center gap-3 px-5 py-4 text-[14px] font-medium text-black hover:bg-gray-50 transition-colors"
                  >
                    <FiUser size={15} strokeWidth={2} />
                    My account
                  </Link>

                  <hr className="mx-5 border-gray-100" />

                  <Link
                    to="/wishlist"
                    role="menuitem"
                    className="flex items-center gap-3 px-5 py-4 text-[14px] font-medium text-black hover:bg-gray-50 transition-colors"
                  >
                    <FiHeart size={15} strokeWidth={2} />
                    Wishlist
                  </Link>

                  <hr className="mx-5 border-gray-100" />

                  <Link
                    to="/orders"
                    role="menuitem"
                    className="flex items-center gap-3 px-5 py-4 text-[14px] font-medium text-black hover:bg-gray-50 transition-colors"
                  >
                    <FiClock size={15} strokeWidth={2} />
                    Order history
                  </Link>

                  <hr className="mx-5 border-gray-100" />

                  <div className="p-4 pt-2">
                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleLogout}
                      className="flex w-full items-center justify-center gap-2 bg-black py-3 text-[14px] font-medium text-white transition-transform active:scale-95 hover:bg-gray-800"
                    >
                      <FiLogOut size={15} strokeWidth={2} />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              ref={(el) => { desktop4kIconRefs.current[2] = el; }}
              type="button"
              onClick={() => isLoggedIn ? navigate('/cart') : setLoginOpen(true)}
              className="relative transition-all duration-300 hover:scale-110 cursor-pointer"
              style={{ color: "#ffffff" }}
            >
              <FiShoppingBag size={24} strokeWidth={1.5} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white">
                  {itemCount}
                </span>
              )}
            </button>

          </div>
        </div>



            {active && navigationData[active.toLowerCase()] && (
  <MegaMenu
    data={navigationData[active.toLowerCase()]}
    navKey={active.toLowerCase()}
  />
)}


      </nav>

      {/* Mega menu---------------------- */}

      {loginOpen && (
        <Login 
          onClose={() => setLoginOpen(false)} 
          onSignupClick={() => { setLoginOpen(false); setSignupOpen(true); }} 
        />
      )}

      {signupOpen && (
        <Signup 
          onClose={() => setSignupOpen(false)} 
          onLoginClick={() => { setSignupOpen(false); setLoginOpen(true); }} 
        />
      )}
    </>
  );
};

export default Navbar;