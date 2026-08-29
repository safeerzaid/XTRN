import React from "react";

/**
 * ProductListingHeader
 *
 * Props:
 *   products  — array of products from MongoDB (used for count)
 *   heading   — string to display as the page title and breadcrumb
 *               (was previously derived from useParams().sport which
 *                would crash on /men/:category and /women/:category routes)
 */
function ProductListingHeader({ products, heading = "" }) {
  const formattedHeading =
    heading.charAt(0).toUpperCase() + heading.slice(1);

  return (
    <header className="px-4 pt-8 pb-8 sm:px-6 md:px-10 lg:px-14">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 font-nav text-xs uppercase tracking-wide text-gray-500">

        <span className="cursor-pointer transition-colors duration-200 hover:text-black">
          Home
        </span>

        <span className="text-gray-300">
          /
        </span>

        <span className="cursor-pointer transition-colors duration-200 hover:text-black">
          Products
        </span>

        <span className="text-gray-300">
          /
        </span>

        <span className="text-black">
          {formattedHeading}
        </span>

      </div>

      {/* Main heading */}
      <div className="mt-8 flex items-end justify-between pb-6">

        <h1 className="font-nav text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">

          {formattedHeading}

          <span className="ml-2 text-base font-normal text-gray-400 sm:text-lg">
            ({products.length})
          </span>

        </h1>

      </div>

    </header>
  );
}

export default ProductListingHeader;