import React from 'react'

function ProductCard({ product }) {
  return (
    <div className="group relative overflow-hidden aspect-[3/4] bg-gray-100 border-r border-gray-200">

      {/* Image — covers the full card, no whitespace */}
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-full object-cover transition-transform duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
      />



      {/* Name — bottom-left, flush with card edge */}
      <h3 className="
        absolute bottom-0 left-0 right-0
        pl-2 pb-1.5
        sm:pl-3 sm:pb-2
        md:pl-4 md:pb-2.5
        lg:pl-5 lg:pb-3
        font-nav font-semibold text-black
        text-[20px]
        sm:text-[14px]
        md:text-[15px]
        lg:text-[18px]
        xl:text-[22px]
        leading-tight
        truncate
      ">
        {product.name}
      </h3>

    </div>
  )
}

export default ProductCard
