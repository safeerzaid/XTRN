import React, { useState, useRef, useCallback, useEffect } from "react";

export default function ZoomImage({ src, alt, zoom = 2, className = "", imgClassName = "" }) {
  const [isHovering, setIsHovering] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const containerRef = useRef(null);
  const rafRef = useRef(null);

  const handlePointerMove = useCallback((e) => {
    if (e.pointerType === 'touch') return;
    
    // Avoid excessive re-renders by using requestAnimationFrame
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    
    rafRef.current = requestAnimationFrame(() => {
      if (!containerRef.current) return;
      
      const { left, top, width, height } = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - left) / width) * 100;
      const y = ((e.clientY - top) / height) * 100;
      
      setPosition({ x, y });
    });
  }, []);

  const handlePointerEnter = (e) => {
    if (e.pointerType === 'touch') return;
    if (containerRef.current) {
      const { left, top, width, height } = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - left) / width) * 100;
      const y = ((e.clientY - top) / height) * 100;
      setPosition({ x, y });
    }
    setIsHovering(true);
  };

  const handlePointerLeave = (e) => {
    if (e.pointerType === 'touch') return;
    setIsHovering(false);
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
  };
  
  // Clean up RAF on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  const hasPosition = /\b(absolute|relative|fixed|sticky|static)\b/.test(className);
  const wrapperClass = `overflow-hidden ${className} ${!hasPosition ? 'relative' : ''}`.trim();

  return (
    <div 
      className={wrapperClass}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      ref={containerRef}
    >
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-contain ${isHovering ? "cursor-zoom-in" : ""} ${imgClassName}`}
        style={{
          transformOrigin: `${position.x}% ${position.y}%`,
          transform: isHovering ? `scale(${zoom})` : "scale(1)",
          transition: "transform 200ms ease-out"
        }}
      />
    </div>
  );
}
