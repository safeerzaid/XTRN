import React from "react";
import {
  FiHeart,
  FiShoppingBag,
} from "react-icons/fi";
import { Link } from "react-router-dom";


function ProductListCard({ product, pageType = "sport" }) {



  // --------------------------------
  // GET PRODUCT IMAGE
  // --------------------------------

  const getImage = () => {
    const imgs = product.images;

    if (!imgs) {
      return product.image;
    }

    if (pageType === "men") {
      return imgs.men?.[0] || imgs.default?.[0];
    }

    if (pageType === "women") {
      return imgs.women?.[0] || imgs.default?.[0];
    }

    return imgs.default?.[0];
  };


  // --------------------------------
  // IMAGE URL
  // --------------------------------

  const imageSrc = getImage();

  // --------------------------------
  // GET HOVER IMAGE
  // --------------------------------

  const getHoverImage = () => {
    const imgs = product.images;

    if (!imgs) {
      return product.image;
    }

    if (pageType === "men") {
      return imgs.men?.[1] || imgs.default?.[1] || imgs.men?.[0] || imgs.default?.[0];
    }

    if (pageType === "women") {
      return imgs.women?.[1] || imgs.default?.[1] || imgs.women?.[0] || imgs.default?.[0];
    }

    return imgs.default?.[1] || imgs.default?.[0];
  };

  const hoverImageSrc = getHoverImage();


  // --------------------------------
  // FORMAT PRICE
  // --------------------------------

  const formatPrice = (price) => {

    if (price == null) {
      return "—";
    }

    return `₹${price.toLocaleString("en-IN")}`;
  };


  // --------------------------------
  // CARD UI
  // --------------------------------

  return (

    <Link to={`/product/${product._id}`}>

    <div className="group cursor-pointer">

      {/* CARD */}
      <div className="group cursor-pointer flex flex-col gap-3">

        {/* IMAGE AREA */}
        <div className="relative aspect-[341/346] bg-transparent overflow-hidden">
          {product.badge && (
            <span className="absolute left-3 top-3 z-10 rounded-md bg-white px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-black shadow-sm">
              {product.badge}
            </span>
          )}

          {/* HEART */}
          <button
            type="button"
            aria-label="Add to wishlist"
            className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm transition hover:scale-105 text-black"
          >
            <FiHeart size={15} strokeWidth={2} />
          </button>

          {/* HOVER PRODUCT IMAGE */}
          <img
            src={hoverImageSrc}
            alt={`${product.name} alternate view`}
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />

          {/* DEFAULT PRODUCT IMAGE */}
          <img
            src={imageSrc}
            alt={product.name}
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500 group-hover:opacity-0"
          />

          {/* SHOPPING BAG */}
          <button
            type="button"
            aria-label="Add to cart"
            className="absolute right-3 bottom-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm transition hover:scale-105 text-black"
          >
            <FiShoppingBag size={15} strokeWidth={2} />
          </button>
        </div>



        {/* PRODUCT INFORMATION */}
        <div className="flex flex-col gap-1 px-1">
          <h3 className="text-[14px] md:text-[15px] font-bold font-nav text-black uppercase tracking-wide">
            {product.name}
          </h3>
          <p className="text-[14px] md:text-[15px] font-light font-nav text-gray-600">
            {product.category || 'Sneakers'} · {product.gender || 'Unisex'}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <p className="font-medium text-black text-[14px] md:text-[15px]">
              {formatPrice(product.price)}
            </p>
            {product.originalPrice != null && (
              <p className="text-[13px] text-gray-400 line-through">
                {formatPrice(product.originalPrice)}
              </p>
            )}
          </div>
        </div>
      </div>

        </div>
  </Link>


  );
}


export default ProductListCard;