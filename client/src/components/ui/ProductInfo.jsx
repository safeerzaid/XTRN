import React, { useState } from "react";
import { FiHeart, FiShoppingBag, FiStar } from "react-icons/fi";

/**
 * ProductInfo
 *
 * Props:
 *   product — product object with name, brand, price, originalPrice,
 *             discount, description, sizes, rating, reviews
 */
function ProductInfo({ product = {} }) {
  const {
    name        = "AeroFit Pro Running Tee",
    brand       = "XTRN",
    price       = 1299,
    originalPrice,
    discount,
    description = "Engineered for peak performance, this lightweight running tee features moisture-wicking fabric that keeps you dry and comfortable during intense training sessions. The ergonomic cut allows unrestricted movement, making it ideal for athletes who demand the best.",
    sizes       = ["XS", "S", "M", "L", "XL", "XXL"],
    rating      = 4.5,
    reviews     = 128,
  } = product;

  const [qty, setQty]             = useState(1);
  const [selectedSize, setSize]   = useState(null);
  const [wishlisted, setWish]     = useState(false);
  const [addedToCart, setCart]    = useState(false);

  const formatPrice = (p) =>
    p != null ? `₹${Number(p).toLocaleString("en-IN")}` : null;

  const handleAddToCart = () => {
    setCart(true);
    setTimeout(() => setCart(false), 1800);
  };

  /* ── Star renderer ──────────────────────────────────────────────── */
  const Stars = ({ value }) => {
    const full  = Math.floor(value);
    const half  = value - full >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);
    return (
      <span className="flex items-center gap-0.5">
        {[...Array(full)].map((_, i) => (
          <FiStar key={`f${i}`} size={14} className="fill-amber-400 text-amber-400" />
        ))}
        {half && (
          <span className="relative inline-block w-[14px] h-[14px]">
            <FiStar size={14} className="absolute text-gray-300" />
            <span className="absolute inset-0 w-1/2 overflow-hidden">
              <FiStar size={14} className="fill-amber-400 text-amber-400" />
            </span>
          </span>
        )}
        {[...Array(empty)].map((_, i) => (
          <FiStar key={`e${i}`} size={14} className="text-gray-300" />
        ))}
      </span>
    );
  };

  return (
    <div className="flex flex-col gap-6 lg:gap-7">

      {/* ── Brand ─────────────────────────────────────────────────── */}
      <p className="font-nav text-[11px] font-bold tracking-[0.22em] uppercase text-gray-400">
        {brand}
      </p>

      {/* ── Product Name ──────────────────────────────────────────── */}
      <h1 className="font-nav text-[28px] sm:text-[34px] lg:text-[40px] xl:text-[44px] font-bold leading-[1.1] text-gray-900">
        {name}
      </h1>

      {/* ── Rating Row ────────────────────────────────────────────── */}
      <div className="flex items-center gap-2">
        <Stars value={rating} />
        <span className="font-nav text-[13px] text-gray-500">
          {rating.toFixed(1)} ({reviews} reviews)
        </span>
      </div>

      {/* ── Divider ───────────────────────────────────────────────── */}
      <div className="h-px bg-gray-100" />

      {/* ── Price Block ───────────────────────────────────────────── */}
      <div className="flex items-baseline gap-3 flex-wrap">
        <span className="font-nav text-[26px] sm:text-[30px] font-bold text-gray-900">
          {formatPrice(price)}
        </span>

        {originalPrice != null && (
          <span className="font-nav text-[18px] text-gray-400 line-through">
            {formatPrice(originalPrice)}
          </span>
        )}

        {discount != null && discount > 0 && (
          <span className="font-nav text-[12px] font-semibold tracking-wide bg-red-50 text-red-600 px-2.5 py-1 rounded-lg">
            {discount}% OFF
          </span>
        )}
      </div>

      {/* ── Description ───────────────────────────────────────────── */}
      <p className="font-nav text-[15px] sm:text-[16px] text-gray-500 leading-relaxed">
        {description}
      </p>

      {/* ── Size Selector ─────────────────────────────────────────── */}
      {sizes.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="font-nav text-[13px] font-semibold uppercase tracking-[0.12em] text-gray-700">
              Size
            </span>
            {selectedSize && (
              <span className="font-nav text-[12px] text-gray-400">
                Selected: <span className="text-black font-semibold">{selectedSize}</span>
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {sizes.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSize(s === selectedSize ? null : s)}
                className={`
                  font-nav text-[13px] font-medium
                  min-w-[48px] h-11
                  px-3 rounded-xl border
                  transition-all duration-200
                  ${
                    selectedSize === s
                      ? "bg-gray-900 text-white border-gray-900"
                      : "bg-white text-gray-700 border-gray-200 hover:border-gray-700"
                  }
                `}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Quantity Selector ─────────────────────────────────────── */}
      <div className="flex flex-col gap-3">
        <span className="font-nav text-[13px] font-semibold uppercase tracking-[0.12em] text-gray-700">
          Quantity
        </span>
        <div className="flex items-center gap-4">
          <div className="flex items-center rounded-xl border border-gray-200 overflow-hidden">
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="
                w-11 h-11
                flex items-center justify-center
                font-nav text-[20px] font-light text-gray-600
                hover:bg-gray-50
                transition-colors duration-150
                select-none
              "
            >
              −
            </button>
            <span className="
              w-12 h-11
              flex items-center justify-center
              font-nav text-[15px] font-semibold text-gray-900
              border-x border-gray-200
              select-none
            ">
              {qty}
            </span>
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() => setQty((q) => q + 1)}
              className="
                w-11 h-11
                flex items-center justify-center
                font-nav text-[20px] font-light text-gray-600
                hover:bg-gray-50
                transition-colors duration-150
                select-none
              "
            >
              +
            </button>
          </div>
          <span className="font-nav text-[13px] text-gray-400">
            In stock
          </span>
        </div>
      </div>

      {/* ── Action Buttons ────────────────────────────────────────── */}
      {/*
        Desktop: side-by-side — wishlist square (h-14 w-14) + cart fills rest
        Mobile/tablet: stacked full-width
      */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">

        {/* Add to Cart — full width on mobile, flex-1 on desktop */}
        <button
          type="button"
          id="add-to-cart-btn"
          onClick={handleAddToCart}
          className={`
            order-1 sm:order-none
            flex-1
            h-14
            flex items-center justify-center gap-2.5
            font-nav text-[14px] font-semibold tracking-[0.08em] uppercase
            rounded-xl
            transition-all duration-300
            ${
              addedToCart
                ? "bg-green-600 text-white"
                : "bg-gray-900 text-white hover:bg-black active:scale-[0.98]"
            }
          `}
        >
          <FiShoppingBag size={18} strokeWidth={1.8} />
          {addedToCart ? "Added!" : "Add to Cart"}
        </button>

        {/* Wishlist — square on desktop, full-width on mobile */}
        <button
          type="button"
          id="wishlist-btn"
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          onClick={() => setWish((w) => !w)}
          className={`
            order-2 sm:order-none
            h-14
            w-full sm:w-14
            flex items-center justify-center gap-2 sm:gap-0
            font-nav text-[13px] font-medium
            rounded-xl border
            transition-all duration-300
            ${
              wishlisted
                ? "bg-red-50 border-red-200 text-red-500"
                : "bg-white border-gray-200 text-gray-600 hover:border-gray-400 hover:text-gray-900"
            }
          `}
        >
          <FiHeart
            size={20}
            strokeWidth={1.8}
            className={`transition-all duration-300 ${wishlisted ? "fill-red-500 text-red-500 scale-110" : ""}`}
          />
          {/* Label visible only on mobile */}
          <span className="sm:hidden">
            {wishlisted ? "Wishlisted" : "Add to Wishlist"}
          </span>
        </button>

      </div>

      {/* ── Delivery Info ─────────────────────────────────────────── */}
      <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
        {[
          { icon: "🚚", text: "Free delivery on orders above ₹999" },
          { icon: "↩️", text: "Easy 30-day returns" },
          { icon: "✅", text: "Authentic XTRN product" },
        ].map(({ icon, text }) => (
          <div key={text} className="flex items-center gap-2.5">
            <span className="text-[15px]">{icon}</span>
            <span className="font-nav text-[13px] text-gray-500">{text}</span>
          </div>
        ))}
      </div>

    </div>
  );
}

export default ProductInfo;
