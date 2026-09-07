import React from "react";
import {
  FiHeart,
  FiShoppingBag,
} from "react-icons/fi";


function ProductListCard({ product, pageType = "sport" }) {

  // --------------------------------
  // GET PRODUCT IMAGE
  // --------------------------------

  const getImage = () => {
    const imgs = product.images;

    if (!imgs) {
      return undefined;
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

    <div className="group">

      {/* CARD */}

      <div
        className="
          relative
          overflow-hidden
          rounded-1xl
          bg-white
        "
      >

        {/* IMAGE AREA */}

        <div
          className="
            relative
            aspect-[270/270]
            bg-gray-200
          "
        >

          {/* BADGE */}

          {product.badge && (

            <span
              className="
                absolute
                left-3
                top-3
                z-10
                rounded-md
                bg-purple-100
                px-2
                py-1
                text-[9px]
                font-semibold
                uppercase
                tracking-wide
                text-purple-700
              "
            >
              {product.badge}
            </span>

          )}


          {/* HEART */}

          <button
            type="button"
            aria-label="Add to wishlist"
            className="
              absolute
              right-3
              top-3
              z-10
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-full
              bg-white
              shadow-sm
              transition
              duration-200
              hover:scale-105
            "
          >

            <FiHeart
              size={17}
              strokeWidth={1.5}
            />

          </button>


          {/* PRODUCT IMAGE */}

          <img
            src={imageSrc}
            alt={product.name}
            className="
             absolute
             inset-0
             h-full
             w-full
             object-contain
            "
          />

        </div>


        {/* PRODUCT INFORMATION */}

        <div className="p-4">

          {/* PRODUCT NAME */}

          <h3
            className="
              text-[14px]
              font-nav
              font-medium
              mb-1
              mt-2
            "
          >
            {product.name}
          </h3>

          <p
          className="
          hidden lg:block
          text-gray-600
          font-nav 
          text-[16px]
          "
          >{product.description}
          </p>


            {/* PRICES */}

              <p
                className="
                  font-semibold
                  text-gray-900
                  font-nav
                  text-[14px]
                  mt-2
                "
              >
                {formatPrice(product.price)}
              </p>


              {/* ORIGINAL PRICE */}

              {product.originalPrice != null && (

                <p
                  className="
                    text-xs
                    text-gray-400
                    line-through
                  "
                >
                  {formatPrice(product.originalPrice)}
                </p>

              )}

            </div>

          </div>

        </div>
  );
}


export default ProductListCard;