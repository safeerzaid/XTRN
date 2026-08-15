import React from 'react'
import { FiHeart } from "react-icons/fi"

function ProductListCard({ product }) {
  return (
    <div className="group cursor-pointer">
      <div className="relative aspect-square">
        <img
          src={product.image}
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
          ₹{product.price.toLocaleString("en-IN")}
        </p>

      </div>

    </div>
  )
}

export default ProductListCard