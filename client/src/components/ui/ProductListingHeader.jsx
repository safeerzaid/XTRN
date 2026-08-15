import React from "react";
import { useParams } from "react-router-dom";
import allProducts from "../../data/allProducts";

function ProductListingHeader() {
  const { sport } = useParams();

  const filteredProducts = allProducts.filter(
    (product) =>
      product.sport.toLowerCase() === sport.toLowerCase()
  );

  const formattedSports =
    sport.charAt(0).toUpperCase() + sport.slice(1);

  return (
    <header className="px-4 pt-8 pb-8 sm:px-6 md:px-10 lg:px-14">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 font-nav text-xs uppercase  tracking-wide text-gray-500">
        <span className="hover:text-black transition-colors duration-200 cursor-pointer">
          Home
        </span>

        <span className="text-gray-300">/</span>

        <span className="hover:text-black transition-colors duration-200 cursor-pointer">
          Products
        </span>

        <span className="text-gray-300">/</span>

        <span className="text-black">
          {formattedSports}
        </span>
      </div>

      {/* Main heading */}
      <div className="mt-8 flex items-end justify-between  pb-6">

        <h1 className="font-nav text-4xl font-semibold  tracking-tight sm:text-5xl md:text-6xl">
          {formattedSports}
          <span className="ml-2 text-base font-normal text-gray-400 sm:text-lg">
            ({filteredProducts.length})
          </span>
        </h1>

      </div>

    </header>
  );
}

export default ProductListingHeader;