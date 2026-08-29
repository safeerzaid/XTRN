import React from 'react'

/**
 * ProductCategoryNav
 *
 * Props:
 *   products        — full product array from MongoDB
 *   activeCategory  — currently selected category (null = All)
 *   onSelectCategory — callback(category | null) — lifted to ProductListingPage
 */
function ProductCategoryNav({ products, activeCategory, onSelectCategory }) {
  const categories = [
    ...new Set(
      products
        .map((product) => product.category)
        .filter(Boolean)
    )
  ]

  const btnBase = `
    font-nav
    text-[16px]
    font-medium
    whitespace-nowrap
    pb-4
    uppercase
    border-b-2
    transition-colors
    duration-200
  `

  const activeStyle  = "text-black border-black"
  const inactiveStyle = "text-gray-500 border-transparent hover:text-black hover:border-gray-400"

 return (
  <div className="ml-10 mt-5 border-b border-gray-200">
    <div className="flex gap-10 overflow-x-auto px-4 sm:px-0 scrollbar-hide">

      {/* All */}
      <button
        onClick={() => onSelectCategory(null)}
        className={`${btnBase} ${activeCategory === null ? activeStyle : inactiveStyle}`}
      >
        All
      </button>

      {/* Category chips */}
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelectCategory(category)}
          className={`${btnBase} ${activeCategory === category ? activeStyle : inactiveStyle}`}
        >
          {category}
        </button>
      ))}

    </div>
  </div>
)
}

export default ProductCategoryNav