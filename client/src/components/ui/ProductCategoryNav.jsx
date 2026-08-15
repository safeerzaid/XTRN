import React from 'react'
import { useParams } from 'react-router-dom'
import allproducts from "../../data/allProducts"


function ProductCategoryNav() {
  const {sport} = useParams()

  const filteredProducts = allproducts.filter((product) => (
    product.sport.toLowerCase() === sport.toLowerCase()
  ))


  const categories =[...new Set(filteredProducts.map((product) => product.category))]
  console.log(categories);
  
 return (
  <div className="ml-10 mt-5 border-b border-gray-200">
    <div className="flex gap-10 overflow-x-auto px-4 sm:px-0 scrollbar-hide">

      {/* All */}
      <button
          className="
            font-nav
            text-[16px]
            font-medium
            whitespace-nowrap
            pb-4
            uppercase
            text-gray-500
            border-b-2
            border-transparent
            transition-colors
            duration-200
            hover:text-black
            hover:border-gray-400
          "
      >
        All
      </button>

      {/* Categories */}
      {categories.map((category) => (
        <button
          key={category}
          className="
            font-nav
            text-[16px]
            font-medium
            whitespace-nowrap
            pb-4
            uppercase
            text-gray-500
            border-b-2
            border-transparent
            transition-colors
            duration-200
            hover:text-black
            hover:border-gray-400
          "
        >
          {category}
        </button>
      ))}

    </div>
  </div>
)
}

export default ProductCategoryNav