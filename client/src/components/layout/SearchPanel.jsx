import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import gsap from 'gsap';
import { FiSearch, FiX } from 'react-icons/fi';
import api from '../../api/axios';

const useSearchSuggestions = (term) => {
  const [suggestions, setSuggestions] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!term || term.trim().length < 1) {
      setSuggestions([]);
      setTotal(0);
      setLoading(false);
      setError(false);
      return;
    }

    const abortController = new AbortController();
    
    const fetchSuggestions = async () => {
      setLoading(true);
      setError(false);
      try {
        const response = await api.get(`/products/suggestions?q=${encodeURIComponent(term.trim())}`, {
          signal: abortController.signal
        });
        if (!abortController.signal.aborted) {
          setSuggestions(response.data.suggestions || []);
          setTotal(response.data.total || 0);
          setLoading(false);
        }
      } catch (err) {
        if (err.name !== 'CanceledError' && err.message !== 'canceled') {
          console.error("Suggestions error", err);
          if (!abortController.signal.aborted) {
            setError(true);
            setLoading(false);
          }
        }
      }
    };

    const debounceId = setTimeout(fetchSuggestions, 250);

    return () => {
      clearTimeout(debounceId);
      abortController.abort();
    };
  }, [term]);

  return { suggestions, total, loading, error };
};

const HighlightedText = ({ text, highlight }) => {
  if (!highlight.trim() || !text) {
    return <span>{text}</span>;
  }
  
  const escapeRegex = (str) => str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  const words = highlight.trim().split(/\s+/).filter(w => w.length > 0);
  
  if (words.length === 0) return <span>{text}</span>;

  const wordPattern = words.map(escapeRegex).join('|');
  const regex = new RegExp(`(^|[\\s\\-_/\\\\.,()&'])(${wordPattern})`, 'gi');
  const parts = text.split(regex);
  
  return (
    <span>
      {parts.map((part, i) => {
        if (i % 3 === 2) {
          return <span key={i} className="font-bold text-black">{part}</span>;
        }
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
};

export default function SearchPanel({ isOpen, onClose }) {
  const [shouldRender, setShouldRender] = useState(false);
  const [term, setTerm] = useState('');
  const { suggestions, total, loading, error } = useSearchSuggestions(term);
  const [activeIndex, setActiveIndex] = useState(-1);
  
  const navigate = useNavigate();
  const location = useLocation();
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const overlayRef = useRef(null);
  const panelRef = useRef(null);
  const listRef = useRef(null);
  const tlRef = useRef(null);
  const closeIconRef = useRef(null);
  const isClosingRef = useRef(false);

  useEffect(() => {
    if (isOpen) setShouldRender(true);
  }, [isOpen]);

  useEffect(() => {
    if (shouldRender) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
        const fixedElements = document.querySelectorAll('.fixed.top-0');
        fixedElements.forEach(el => {
          el.dataset.originalPaddingRight = el.style.paddingRight;
          el.style.paddingRight = `${scrollbarWidth}px`;
        });
      }
      
      return () => {
        document.body.style.overflow = "";
        document.body.style.paddingRight = "";
        const fixedElements = document.querySelectorAll('.fixed.top-0');
        fixedElements.forEach(el => {
          if (el.dataset.originalPaddingRight !== undefined) {
            el.style.paddingRight = el.dataset.originalPaddingRight;
          } else {
            el.style.paddingRight = "";
          }
        });
      };
    }
  }, [shouldRender]);

  useEffect(() => {
    if (isOpen) {
      setTerm('');
      setActiveIndex(-1);
      isClosingRef.current = false;
      if (closeIconRef.current) {
        gsap.set(closeIconRef.current, { rotation: 0 });
      }
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) onClose();
  }, [location.pathname, location.search]);

  useLayoutEffect(() => {
    if (!shouldRender) return;
    
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let ctx = gsap.context(() => {
      if (!tlRef.current) {
        gsap.set(overlayRef.current, { opacity: 0 });
        gsap.set(panelRef.current, { xPercent: 100 });
        gsap.set('.search-anim', { opacity: 0, y: 15 });
        
        const tl = gsap.timeline({ 
          paused: true, 
          onReverseComplete: () => {
            setShouldRender(false);
          }
        });
        
        if (prefersReducedMotion) {
          tl.to(overlayRef.current, { opacity: 1, duration: 0 })
            .to(panelRef.current, { xPercent: 0, duration: 0 }, "<")
            .to('.search-anim', { opacity: 1, y: 0, duration: 0 }, "<");
        } else {
          tl.to(overlayRef.current, { opacity: 1, duration: 0.3, ease: "power2.out" })
            .to(panelRef.current, { xPercent: 0, duration: 0.5, ease: "power3.out" }, "<")
            .to('.search-anim', { opacity: 1, y: 0, duration: 0.4, stagger: 0.04, ease: "power3.out" }, "-=0.2");
        }
        tlRef.current = tl;
      }
    }, containerRef);
    
    return () => {
      tlRef.current = null;
      ctx.revert();
    };
  }, [shouldRender]);

  useEffect(() => {
    if (!tlRef.current) return;
    if (isOpen) {
      tlRef.current.play();
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      tlRef.current.reverse();
    }
  }, [isOpen, shouldRender]);

  useEffect(() => {
    setActiveIndex(-1);
  }, [suggestions]);

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (suggestions.length > 0) {
        setActiveIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (suggestions.length > 0) {
        setActiveIndex(prev => (prev > 0 ? prev - 1 : -1));
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < suggestions.length) {
        navigate(`/search?q=${encodeURIComponent(suggestions[activeIndex].text)}`);
      } else if (term.trim().length > 0) {
        navigate(`/search?q=${encodeURIComponent(term.trim())}`);
      }
      onClose();
    }
  };

  const handleClear = () => {
    setTerm('');
    inputRef.current?.focus();
  };

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  const handleClose = () => {
    if (isClosingRef.current) return;
    isClosingRef.current = true;

    if (closeIconRef.current) {
      gsap.to(closeIconRef.current, {
        rotation: 90,
        duration: 0.35,
        ease: "power2.inOut",
      });
    }
    onClose();
  };

  if (!shouldRender) return null;

  const showResults = term.trim().length >= 2;

  return createPortal(
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex justify-end font-nav"
      role="dialog" 
      aria-modal="true" 
      aria-label="Search"
    >
      <div 
        ref={overlayRef}
        className="absolute inset-0 bg-black/40 cursor-pointer"
        onClick={handleOverlayClick}
      />
      
      <div 
        ref={panelRef}
        className="relative w-full max-w-[400px] bg-white h-full flex flex-col shadow-2xl border-l border-gray-100"
      >
        <div className="p-6 md:p-8 flex flex-col h-full">
          {/* Top Row: Close */}
          <div className="flex justify-end mb-8 search-anim">
            <button 
              onClick={handleClose}
              className="p-2 -mr-2 text-black hover:bg-gray-100 rounded-full transition-colors flex items-center justify-center cursor-pointer"
              aria-label="Close search"
            >
              <span ref={closeIconRef} className="inline-flex items-center justify-center pointer-events-none">
                <FiX size={24} />
              </span>
            </button>
          </div>

          {/* Search Input */}
          <div className="relative flex items-center border-b border-black pb-3 search-anim">
            <FiSearch size={18} className="text-black mr-4 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search products..."
              className="w-full text-[16px] outline-none bg-transparent placeholder:text-gray-400 font-light"
              aria-label="Search term"
              aria-autocomplete="list"
              aria-controls="search-suggestions"
              aria-activedescendant={activeIndex >= 0 ? `suggestion-${activeIndex}` : undefined}
            />
            {term && (
              <button 
                onClick={handleClear}
                className="ml-4 text-[14px] text-gray-500 hover:text-black font-bold tracking-wide uppercase shrink-0 transition-colors"
              >
                Clear
              </button>
            )}
          </div>

          {/* Results Area */}
          <div className="flex-1 mt-8 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div aria-live="polite" className="sr-only">
              {loading ? "Loading suggestions" : showResults ? `${total} results found` : ""}
            </div>

            {showResults && !loading && !error && suggestions.length === 0 && (
              <div className="search-anim text-center pt-8">
                <p className="text-[16px] text-gray-700 font-light mb-4">
                  No results for "{term}"
                </p>
                <div className="w-12 h-[1px] bg-gray-300 mx-auto mb-6"></div>
                <p className="text-[14px] text-gray-500 mb-4">Try checking your spelling or browse our categories:</p>
                <div className="flex justify-center gap-4 text-[14px] font-bold">
                  <Link onClick={onClose} to="/men" className="border-b border-black hover:text-gray-600 transition-colors">Shop Men</Link>
                  <Link onClick={onClose} to="/women" className="border-b border-black hover:text-gray-600 transition-colors">Shop Women</Link>
                </div>
              </div>
            )}

            {showResults && error && (
              <div className="search-anim pt-4">
                <p className="text-[15px] text-red-500">Something went wrong. Please try again.</p>
              </div>
            )}

            {showResults && !error && suggestions.length > 0 && (
              <div className="search-anim flex flex-col">
                <Link 
                  to={`/search?q=${encodeURIComponent(term.trim())}`}
                  onClick={onClose}
                  className="flex items-center justify-between text-[13px] font-bold text-black border-b border-gray-100 pb-4 mb-4 hover:text-gray-600 transition-colors group"
                >
                  <span>View all ({total})</span>
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>

                <ul 
                  ref={listRef}
                  id="search-suggestions"
                  role="listbox" 
                  className="flex flex-col"
                >
                  {suggestions.map((s, idx) => (
                    <li 
                      key={s._id || idx}
                      id={`suggestion-${idx}`}
                      role="option"
                      aria-selected={activeIndex === idx}
                      onClick={() => {
                        navigate(`/search?q=${encodeURIComponent(s.text)}`);
                        onClose();
                      }}
                      className={`suggestion-anim min-h-[44px] flex items-center text-[15px] cursor-pointer transition-colors px-2 -mx-2 rounded-lg ${
                        activeIndex === idx ? 'bg-gray-100 text-black' : 'text-gray-700 hover:text-black hover:bg-gray-50'
                      }`}
                    >
                      <HighlightedText text={s.text} highlight={term} />
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {loading && (
              <div className="search-anim pt-4 w-full h-[2px] bg-gray-100 overflow-hidden rounded-full">
                <div className="h-full bg-black w-1/3 animate-[slide_1s_ease-in-out_infinite]" />
              </div>
            )}
            
          </div>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}} />
    </div>
  , document.body);
}
