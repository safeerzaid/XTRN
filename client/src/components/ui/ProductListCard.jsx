import React from 'react'
import { FiHeart } from "react-icons/fi"

/**
 * ProductListCard
 *
 * Props:
 *   product  — MongoDB product document
 *   pageType — 'sport' | 'men' | 'women' | 'accessories'
 *              Used to select the right image variant:
 *                men page   → images.men[0]   fallback images.default[0]
 *                women page → images.women[0] fallback images.default[0]
 *                everything else → images.default[0]
 */
function ProductListCard({ product, pageType = "sport" }) {

  // Pick the most relevant image based on the page the card is shown on
  const getImage = () => {
    const imgs = product.images
    if (!imgs) return undefined

    if (pageType === "men") {
      return imgs.men?.[0] || imgs.default?.[0]
    }
    if (pageType === "women") {
      return imgs.women?.[0] || imgs.default?.[0]
    }
    // sport / accessories / default
    return imgs.default?.[0]
  }

  const imageSrc = getImage()

  return (
    <div className="group cursor-pointer">
      <div className="relative aspect-square">
        <img
          src={imageSrc}
          alt={product.name}
          className="h-full w-full object-contain p-8"
        />

        {/* Heart */}
        <button
          className="absolute right-4 top-4"
          aria-label="Add to wishlist"
        >
          <FiHeart
            size={21}
            strokeWidth={1.5}
          />
        </button>

      </div>

      {/* Product Info */}
      <div className="mt-3 flex items-start justify-between gap-4">

        <h3 className="font-nav text-[15px] font-medium">
          {product.name}
        </h3>

        <p className="font-nav text-[15px] font-medium whitespace-nowrap">
          {product.price != null
            ? `₹${product.price.toLocaleString("en-IN")}`
            : "—"}
        </p>

      </div>

    </div>
  )
}

export default ProductListCard