import React, { useState } from "react";

/**
 * ImageGallery
 *
 * Props:
 *   images  — array of image URL strings
 *   name    — product name used as alt text
 */
function ImageGallery({ images = [], name = "Product" }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const mainImage = images[activeIndex] || images[0] || "";

  return (
    <div className="flex flex-col gap-4 w-full">

      {/* ── Main Image ──────────────────────────────────────────────── */}
      <div className="relative w-full aspect-square bg-[#f5f5f5] rounded-2xl overflow-hidden">
        <img
          src={mainImage}
          alt={name}
          className="absolute inset-0 w-full h-full object-contain transition-opacity duration-300"
          key={activeIndex}
        />
      </div>

      {/* ── Thumbnail Row ────────────────────────────────────────────── */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              aria-label={`View image ${i + 1}`}
              onClick={() => setActiveIndex(i)}
              className={`
                flex-shrink-0
                w-[72px] h-[72px]
                sm:w-[80px] sm:h-[80px]
                lg:w-[88px] lg:h-[88px]
                rounded-xl
                overflow-hidden
                bg-[#f5f5f5]
                transition-all duration-200
                ${
                  activeIndex === i
                    ? "ring-2 ring-black ring-offset-2"
                    : "ring-1 ring-gray-200 hover:ring-gray-400"
                }
              `}
            >
              <img
                src={img}
                alt={`${name} view ${i + 1}`}
                className="w-full h-full object-contain"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ImageGallery;
