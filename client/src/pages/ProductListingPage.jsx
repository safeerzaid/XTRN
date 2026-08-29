import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import ProductListingHeader from "../components/ui/ProductListingHeader";
import ProductCategoryNav from "../components/ui/ProductCategoryNav";
import ProductListCard from "../components/ui/ProductListCard";
import FilterSection from "../components/ui/FilterSection";

/**
 * Generic product listing page.
 *
 * Works for four route shapes:
 *   /products/:sport          → fetches ?sport=<sport>
 *   /men/:category            → fetches ?department=men&category=<category>
 *   /women/:category          → fetches ?department=women&category=<category>
 *   /accessories/:category    → fetches ?department=accessories&category=<category>
 *
 * The page type is determined by the `pageType` prop passed from App.jsx.
 * pageType: 'sport' | 'men' | 'women' | 'accessories'
 */
function ProductListingPage({ pageType = "sport" }) {
  const params = useParams();

  // Derive the display label and fetch URL from route params + pageType
  const sport    = params.sport;
  const category = params.category;

  const [products, setProducts]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const [activeCategory, setActiveCategory] = useState(null);

  // ── Filter state ──────────────────────────────────────────────────────────
  // Each piece of state tracks what the user has selected in that filter section.

  // sortBy: "default" | "price-asc" | "price-desc"
  const [sortBy, setSortBy] = useState("default");

  // selectedSizes: a Set of size strings (e.g. "US 10", "EU 42")
  const [selectedSizes, setSelectedSizes] = useState(new Set());

  // Build the API query string based on page type
  const buildUrl = () => {
    const base = "http://localhost:5000/api/products";
    if (pageType === "sport") {
      return `${base}?sport=${sport}`;
    }
    // men / women / accessories
    const dept = pageType; // 'men', 'women', 'accessories'
    if (category) {
      return `${base}?department=${dept}&category=${category}`;
    }
    return `${base}?department=${dept}`;
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");
        setActiveCategory(null); // reset filter on route change

        const response = await fetch(buildUrl());

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();
        setProducts(data);

        // Reset sort on route change
        setSortBy("default");

        // Reset all user-chosen filters when the route changes
        setSelectedSizes(new Set());
        setSortBy("default");
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sport, category, pageType]);

  // ── Derive dynamic filter option lists from the fetched products ──────────

  // Unique sizes — products.sizes is an array, so we flatMap to get every
  // individual size across all products, then deduplicate.
  const sizeOptions = [...new Set(products.flatMap((p) => p.sizes || []))].sort();

  // ── Toggle helpers ────────────────────────────────────────────────────────

  const toggleSize = (size) => {
    setSelectedSizes((prev) => {
      const next = new Set(prev);
      next.has(size) ? next.delete(size) : next.add(size);
      return next;
    });
  };

  // ── Clear all filters ─────────────────────────────────────────────────────
  const clearAllFilters = () => {
    setSelectedSizes(new Set());
    setSortBy("default");
    setActiveCategory(null);
  };

  // ── In-memory filtering pipeline ──────────────────────────────────────────
  // All filtering happens here on the already-fetched `products` array.
  // No additional API calls are made when filters change.
  // Each filter is applied in sequence; if a filter has no selections it
  // passes every product through (acts as a no-op).

  let filtered = products;

  // 1. Subcategory filter (from ProductCategoryNav)
  if (activeCategory) {
    filtered = filtered.filter((p) => p.category === activeCategory);
  }

  // 2. Size filter
  if (selectedSizes.size > 0) {
    filtered = filtered.filter((p) =>
      (p.sizes || []).some((s) => selectedSizes.has(s))
    );
  }

  // 3. Sort by price
  const sortedProducts = [...filtered].sort((a, b) => {
    if (sortBy === "price-asc")  return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    return 0;
  });

  // Show "Clear all" only when something is actually active
  const hasActiveFilters = selectedSizes.size > 0 || sortBy !== "default";

  // Derive the page heading
  const heading = pageType === "sport" ? sport : category || pageType;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="font-nav text-gray-500">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="font-nav text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <ProductListingHeader products={sortedProducts} heading={heading} />

      {/* Category navigation */}
      <ProductCategoryNav
        products={products}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />

      {/* Main layout: sidebar + product grid */}
      <div className="flex">

        {/* ── Filter sidebar ─────────────────────────────────────────── */}
        <aside className="w-64 shrink-0 bg-white px-6 py-8 min-h-screen">


          {/* ── Price sort checkboxes ────────────────────────────────── */}
          <FilterSection
            title="Price"
            activeCount={sortBy !== "default" ? 1 : 0}
          >
            <div className="space-y-2">
              {/* Low to High — deselects if already active */}
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={sortBy === "price-asc"}
                  onChange={() => setSortBy(sortBy === "price-asc" ? "default" : "price-asc")}
                  className="h-4 w-4 rounded border-gray-300 accent-gray-900"
                />
                <span className="font-nav text-[16px] text-gray-700">Low to High</span>
              </label>

              {/* High to Low — deselects if already active */}
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={sortBy === "price-desc"}
                  onChange={() => setSortBy(sortBy === "price-desc" ? "default" : "price-desc")}
                  className="h-4 w-4 rounded border-gray-300 accent-gray-900"
                />
                <span className="font-nav text-[16px] text-gray-700">High to Low</span>
              </label>
            </div>
          </FilterSection>

          {/* ── Size filter ──────────────────────────────────────────── */}
          {/*
            sizeOptions uses flatMap because each product has an array of sizes.
            We flatten all size arrays, then deduplicate with Set.
            A product passes the filter if it has ANY of the selected sizes
            (i.e. "show me shoes that come in US 9 OR US 10").
          */}
          {sizeOptions.length > 0 && (
            <FilterSection
              title="Size"
              activeCount={selectedSizes.size}
            >
              {/*
                Wrapping buttons in a flex-wrap grid lets you display sizes
                as pill buttons — cleaner UX than a long checkbox list.
              */}
              <div className="flex flex-wrap gap-2">
                {sizeOptions.map((size) => (
                  <button
                    key={size}
                    onClick={() => toggleSize(size)}
                    className={`rounded border px-3 py-1.5 font-nav text-[14px] transition-colors ${
                      selectedSizes.has(size)
                        ? "border-gray-900 bg-gray-900 text-white"
                        : "border-gray-300 bg-white text-gray-700 hover:border-gray-600"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </FilterSection>
          )}
        </aside>

        {/* ── Product grid ────────────────────────────────────────────── */}
        <div className="grid flex-1 grid-cols-2 gap-x-4 gap-y-10 px-4 py-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:px-10">
          {sortedProducts.map((product) => (
            <ProductListCard
              key={product._id}
              product={product}
              pageType={pageType}
            />
          ))}
        </div>
      </div>

      {/* Empty state — shown when filters produce zero results */}
      {sortedProducts.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <p className="font-nav text-gray-500">No products match your filters.</p>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="font-nav text-[13px] font-medium text-gray-900 underline underline-offset-2"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default ProductListingPage;