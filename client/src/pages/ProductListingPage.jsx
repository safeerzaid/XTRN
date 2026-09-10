import React, { useEffect, useRef, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { FiSliders, FiChevronDown, FiX } from "react-icons/fi";

import NavBar from "../components/layout/NavBar";
import ProductListingHeader from "../components/ui/ProductListingHeader";
import ProductCategoryNav from "../components/ui/ProductCategoryNav";
import ProductListCard from "../components/ui/ProductListCard";
import FilterSection from "../components/ui/FilterSection";
import FeaturedSidebar from "../components/ui/FeaturedSidebar";
import { useFeaturedFilters } from "../hooks/useFeaturedFilters";

/**
 * ProductListingPage — fully responsive.
 *
 * Desktop (lg+): sidebar with accordion filters, 3-col grid.
 * Mobile/tablet:
 *   - 2-col product grid
 *   - Subcategory nav hidden
 *   - Filter bar above grid: [Filter icon] [Price ▾] [Size ▾]
 *   - Filter icon opens a slide-up drawer with Price + Size accordions
 */
function ProductListingPage({ pageType = "sport" }) {
  const params = useParams();
  const location = useLocation();
  const sport      = params.sport;
  const category   = params.category;
  // For the /featured/:subcategory route the param is named :subcategory
  const subcategory = params.subcategory;
  // ?filterBy tells us which DB field to filter on (category | section | subcategory)
  // Defaults to 'category' so all existing clothing nav items keep working unchanged
  const filterBy = new URLSearchParams(location.search).get("filterBy") || "category";

  const [products, setProducts]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const [activeCategory, setActiveCategory] = useState(null);

  // ── Filter state (standard pages) ──────────────────────────────────────────
  const [sortBy, setSortBy]               = useState("default");
  const [selectedSizes, setSelectedSizes] = useState(new Set());

  // ── Featured-page filter state (used only when pageType === "featured") ────
  const makeFeaturedInit = () => ({
    genders: new Set(), types: new Set(), brands: new Set(), sizes: new Set(), sortBy: 'default',
  });
  const [featuredFilters, setFeaturedFilters] = useState(makeFeaturedInit);

  // ── Mobile filter UI state ────────────────────────────────────────────────
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [priceOpen, setPriceOpen]   = useState(false);
  const [sizeOpen, setSizeOpen]     = useState(false);

  const priceRef = useRef(null);
  const sizeRef  = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (priceRef.current && !priceRef.current.contains(e.target)) setPriceOpen(false);
      if (sizeRef.current  && !sizeRef.current.contains(e.target))  setSizeOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Build API URL using a relative path so it works from any device on the
  // network. The Vite dev server proxies /api → http://localhost:5000.
  const buildUrl = () => {
    const base = "/api/products";
    if (pageType === "sport") return `${base}?sport=${sport}`;
    // Featured Collection homepage cards — use featuredCategory param (backend maps it to MongoDB)
    if (pageType === "featured") return `${base}?featuredCategory=${encodeURIComponent(subcategory)}`;
    const dept = pageType;
    if (category) return `${base}?department=${dept}&${filterBy}=${encodeURIComponent(category)}`;
    return `${base}?department=${dept}`;
  };

  useEffect(() => {
    const fetchProducts = async () => {
      const url = buildUrl();
      try {
        setLoading(true);
        setError("");
        setActiveCategory(null);
        console.log("[ProductListingPage] Fetching products from:", url);
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(
            `Server responded with ${response.status} ${response.statusText} for ${url}`
          );
        }
        const data = await response.json();
        console.log("[ProductListingPage] Loaded", data.length, "products");
        setProducts(data);
        setSortBy("default");
        setSelectedSizes(new Set());
        setFeaturedFilters(makeFeaturedInit());
      } catch (err) {
        console.error("[ProductListingPage] Error fetching products from", url, err);
        setError("Failed to load products. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sport, category, subcategory, pageType, filterBy]);

  // ── Derived filter options ────────────────────────────────────────────────
  const sizeOptions = [...new Set(products.flatMap((p) => p.sizes || []))].sort();

  // ── Toggle helpers ────────────────────────────────────────────────────────
  const toggleSize = (size) => {
    setSelectedSizes((prev) => {
      const next = new Set(prev);
      next.has(size) ? next.delete(size) : next.add(size);
      return next;
    });
  };

  const clearAllFilters = () => {
    setSelectedSizes(new Set());
    setSortBy("default");
    setActiveCategory(null);
    setFeaturedFilters(makeFeaturedInit());
  };

  // ── Featured-page filtering (hook called unconditionally — Rules of Hooks) ─
  const { filtered: featuredFiltered } = useFeaturedFilters(products, featuredFilters);

  // ── Standard in-memory filtering + sorting (non-featured pages) ──────────
  let filtered = products;
  if (activeCategory) filtered = filtered.filter((p) => p.category === activeCategory);
  if (selectedSizes.size > 0) {
    filtered = filtered.filter((p) => (p.sizes || []).some((s) => selectedSizes.has(s)));
  }
  const regularSorted = [...filtered].sort((a, b) => {
    if (sortBy === "price-asc")  return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    return 0;
  });

  // Use the right result based on pageType
  const sortedProducts = pageType === "featured" ? featuredFiltered : regularSorted;

  const hasActiveFilters = pageType === "featured"
    ? featuredFilters.genders.size > 0 || featuredFilters.types.size > 0 ||
      featuredFilters.brands.size > 0 || featuredFilters.sizes.size > 0 ||
      featuredFilters.sortBy !== 'default'
    : selectedSizes.size > 0 || sortBy !== "default";
  const activeFilterCount = (sortBy !== "default" ? 1 : 0); // size has its own button
  const featuredActiveCount =
    featuredFilters.genders.size + featuredFilters.types.size +
    featuredFilters.brands.size + featuredFilters.sizes.size +
    (featuredFilters.sortBy !== 'default' ? 1 : 0);
  const heading = pageType === "sport" ? sport : pageType === "featured" ? subcategory : category || pageType;

  const priceLabelMap = {
    default:      "Price",
    "price-asc":  "Price: Low → High",
    "price-desc": "Price: High → Low",
  };

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
    <div className="pt-16 lg:pt-20">
      {/* ── NavBar — always white on listing page ────────────────────────── */}
      <NavBar alwaysVisible={true} />

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <ProductListingHeader products={sortedProducts} heading={heading} />




      {/* ══════════════════════════════════════════════════════════════════
          SLIDE-UP FILTER DRAWER  (mobile only)
      ══════════════════════════════════════════════════════════════════ */}
      {/* Backdrop */}
      <div
        onClick={() => setDrawerOpen(false)}
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity lg:hidden ${
          drawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />
      {/* Drawer panel */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl bg-white px-5 pb-8 pt-4 shadow-2xl transition-transform duration-300 ease-out lg:hidden ${
          drawerOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-gray-300" />
        <div className="flex items-center justify-between mb-4">
          <span className="font-nav text-[16px] font-semibold">Filters</span>
          <button onClick={() => setDrawerOpen(false)} className="p-1 text-gray-500">
            <FiX size={20} />
          </button>
        </div>
        {pageType === "featured" ? (
          /* Featured: render the full dynamic sidebar inside the drawer */
          <div className="overflow-y-auto max-h-[60vh]">
            <FeaturedSidebar
              products={products}
              featuredCategory={subcategory}
              filters={featuredFilters}
              onFiltersChange={setFeaturedFilters}
            />
          </div>
        ) : (
          /* Standard pages: price-only drawer */
          <FilterSection title="Price" activeCount={sortBy !== "default" ? 1 : 0}>
            <div className="space-y-2">
              {[
                { value: "price-asc",  label: "Low to High" },
                { value: "price-desc", label: "High to Low" },
              ].map(({ value, label }) => (
                <label key={value} className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={sortBy === value}
                    onChange={() => setSortBy(sortBy === value ? "default" : value)}
                    className="h-4 w-4 rounded border-gray-300 accent-gray-900"
                  />
                  <span className="font-nav text-[15px] text-gray-700">{label}</span>
                </label>
              ))}
            </div>
          </FilterSection>
        )}
        {hasActiveFilters && (
          <button
            onClick={() => { clearAllFilters(); setDrawerOpen(false); }}
            className="mt-4 w-full rounded-full border border-gray-300 py-2.5 font-nav text-[14px] font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          MAIN LAYOUT
      ══════════════════════════════════════════════════════════════════ */}
      <div className="flex items-start">

        {/* ── Desktop sidebar (lg+ only) ──────────────────────────────── */}
        <aside className="hidden w-64 shrink-0 bg-white px-6 py-8 lg:block sticky top-20 max-h-[calc(100vh-5rem)] overflow-y-auto">
          {pageType === "featured" ? (
            /* Featured: fully dynamic sidebar */
            <FeaturedSidebar
              products={products}
              featuredCategory={subcategory}
              filters={featuredFilters}
              onFiltersChange={setFeaturedFilters}
            />
          ) : (
            /* Standard pages: Price + Size only */
            <>
              <FilterSection title="Price" activeCount={sortBy !== "default" ? 1 : 0}>
                <div className="space-y-2">
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      checked={sortBy === "price-asc"}
                      onChange={() => setSortBy(sortBy === "price-asc" ? "default" : "price-asc")}
                      className="h-4 w-4 rounded border-gray-300 accent-gray-900"
                    />
                    <span className="font-nav text-[16px] text-gray-700">Low to High</span>
                  </label>
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

              {sizeOptions.length > 0 && (
                <FilterSection title="Size" activeCount={selectedSizes.size}>
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
            </>
          )}
        </aside>

        {/* ── Product grid ─────────────────────────────────────────────── */}
        {/* 2-col on mobile/tablet, 3-col on desktop */}
        <div className="grid flex-1 grid-cols-2 gap-x-3 gap-y-8 px-3 py-6 sm:gap-x-4 sm:gap-y-10 sm:px-4 md:px-6 lg:grid-cols-3 lg:gap-x-4 lg:px-10 lg:py-8">
          {sortedProducts.map((product) => (
            <ProductListCard
              key={product._id}
              product={product}
              pageType={pageType}
            />
          ))}
        </div>
      </div>

      {/* Empty state */}
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