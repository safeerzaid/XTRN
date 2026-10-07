import React, { useEffect, useRef, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { FiSliders, FiChevronDown, FiX } from "react-icons/fi";
import api  from "../api/axios";

import ProductListingHeader from "../components/ui/ProductListingHeader";
import ProductCategoryNav from "../components/ui/ProductCategoryNav";
import ProductListCard from "../components/ui/ProductListCard";
import FilterSection from "../components/ui/FilterSection";
import FeaturedSidebar from "../components/ui/FeaturedSidebar";
import GenderSidebar from "../components/ui/GenderSidebar";
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

  const isGenderFixed = pageType === "men" || pageType === "women";

  const [products, setProducts]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const [selectedGenders, setSelectedGenders]       = useState(new Set());

  // ── Filter state (standard pages) ──────────────────────────────────────────
  const [sortBy, setSortBy]               = useState("default");
  const [selectedSizes, setSelectedSizes] = useState(new Set());

  // ── Featured-page filter state (used only when pageType === "featured") ────
  const makeFeaturedInit = () => ({
    genders: new Set(), types: new Set(), brands: new Set(), sizes: new Set(), sortBy: 'default',
  });
  const [featuredFilters, setFeaturedFilters] = useState(makeFeaturedInit);

  // ── Gender-page filter state ────
  const makeGenderInit = () => ({
    sections: new Set(),
    sports: new Set(),
    categories: new Set(),
    sizes: new Set(),
    brands: new Set(),
    priceRanges: new Set(),
    sortBy: 'default',
  });
  const [genderFilters, setGenderFilters] = useState(makeGenderInit());

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

  
  const buildUrl = () => {
    const base = "/products";

    if (pageType === "sport") return `${base}?sport=${sport}`;
    
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
        setSelectedGenders(new Set());

        const response = await api.get(url)
        const data = response.data;

        setProducts(data);
        setSortBy("default");
        setSelectedSizes(new Set());
        setFeaturedFilters(makeFeaturedInit());
        setGenderFilters(makeGenderInit());
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
  const genderOptions = [...new Set(products.map((p) => p.gender).filter(Boolean))].sort();

  // ── Toggle helpers ────────────────────────────────────────────────────────
  const toggleSize = (size) => {
    setSelectedSizes((prev) => {
      const next = new Set(prev);
      next.has(size) ? next.delete(size) : next.add(size);
      return next;
    });
  };

  const toggleGender = (gen) => {
    setSelectedGenders((prev) => {
      const next = new Set(prev);
      next.has(gen) ? next.delete(gen) : next.add(gen);
      return next;
    });
  };

  const clearAllFilters = () => {
    setSelectedGenders(new Set());
    setSelectedSizes(new Set());
    setSortBy("default");
    setFeaturedFilters(makeFeaturedInit());
    setGenderFilters(makeGenderInit());
  };

  // ── Featured-page filtering (hook called unconditionally — Rules of Hooks) ─
  const { filtered: featuredFiltered } = useFeaturedFilters(products, featuredFilters);

  // ── Standard in-memory filtering + sorting (non-featured pages) ──────────
  let filtered = products;
  if (selectedGenders.size > 0) {
    filtered = filtered.filter((p) => selectedGenders.has(p.gender));
  }
  if (selectedSizes.size > 0) {
    filtered = filtered.filter((p) => (p.sizes || []).some((s) => selectedSizes.has(s)));
  }
  const regularSorted = [...filtered].sort((a, b) => {
    if (sortBy === "price-asc")  return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    return 0;
  });

  // ── Gender-page filtering ──────────────────────────────────────────────────
  const checkParams = new URLSearchParams(location.search);
  checkParams.delete("department");
  checkParams.delete("featuredCategory");
  checkParams.delete("filterBy");
  const hasExtraQueryParams = Array.from(checkParams.keys()).length > 0;
  const isGenderOnlyPage = isGenderFixed && !sport && !category && !subcategory && !hasExtraQueryParams;

  let genderFiltered = products;
  if (isGenderOnlyPage) {
    if (genderFilters.sections.size > 0) genderFiltered = genderFiltered.filter(p => genderFilters.sections.has(p.section));
    if (genderFilters.sports.size > 0) genderFiltered = genderFiltered.filter(p => genderFilters.sports.has(p.sport));
    if (genderFilters.categories.size > 0) genderFiltered = genderFiltered.filter(p => genderFilters.categories.has(p.category));
    if (genderFilters.brands.size > 0) genderFiltered = genderFiltered.filter(p => genderFilters.brands.has(p.brand));
    if (genderFilters.sizes.size > 0) genderFiltered = genderFiltered.filter(p => (p.sizes || []).some(s => genderFilters.sizes.has(s)));
    if (genderFilters.priceRanges.size > 0) {
      genderFiltered = genderFiltered.filter(p => {
        if (genderFilters.priceRanges.has('under-1000') && p.price < 1000) return true;
        if (genderFilters.priceRanges.has('1000-2000') && p.price >= 1000 && p.price <= 2000) return true;
        if (genderFilters.priceRanges.has('2000-5000') && p.price > 2000 && p.price <= 5000) return true;
        if (genderFilters.priceRanges.has('over-5000') && p.price > 5000) return true;
        return false;
      });
    }
    genderFiltered = [...genderFiltered].sort((a, b) => {
      if (genderFilters.sortBy === 'price-asc') return a.price - b.price;
      if (genderFilters.sortBy === 'price-desc') return b.price - a.price;
      if (genderFilters.sortBy === 'newest') {
        const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return db - da;
      }
      return 0;
    });
  }

  // Use the right result based on pageType
  const sortedProducts = pageType === "featured" 
    ? featuredFiltered 
    : isGenderOnlyPage
      ? genderFiltered
      : regularSorted;

  const genderActiveCount = genderFilters.sections.size + genderFilters.sports.size + genderFilters.categories.size + genderFilters.sizes.size + genderFilters.brands.size + genderFilters.priceRanges.size + (genderFilters.sortBy !== 'default' ? 1 : 0);

  const featuredActiveCount =
    featuredFilters.genders.size + featuredFilters.types.size +
    featuredFilters.brands.size + featuredFilters.sizes.size +
    (featuredFilters.sortBy !== 'default' ? 1 : 0);

  const hasActiveFilters = pageType === "featured"
    ? featuredActiveCount > 0
    : isGenderOnlyPage
      ? genderActiveCount > 0
      : selectedSizes.size > 0 || selectedGenders.size > 0 || sortBy !== "default";

  let heading = pageType;
  if (pageType === "sport") {
    heading = sport;
  } else if (pageType === "featured") {
    heading = subcategory;
  } else if (category) {
    if (pageType === "men") heading = `Men's ${category}`;
    else if (pageType === "women") heading = `Women's ${category}`;
    else heading = category;
  } else {
    heading = pageType;
  }

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

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <ProductListingHeader products={sortedProducts} heading={heading} />

      <div className="lg:hidden px-4 sm:px-6 md:px-10 flex justify-end mb-4">
        <button 
          onClick={() => setDrawerOpen(true)}
          className="flex items-center gap-2 rounded-full border border-gray-300 px-4 py-2 font-nav text-[14px] font-medium text-gray-700 hover:bg-gray-50"
        >
          <FiSliders size={16} />
          Filters
        </button>
      </div>




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
          <div className="overflow-y-auto max-h-[60vh] custom-scrollbar" data-lenis-prevent>
            <FeaturedSidebar
              products={products}
              featuredCategory={subcategory}
              filters={featuredFilters}
              onFiltersChange={setFeaturedFilters}
            />
          </div>
        ) : isGenderOnlyPage ? (
          <div className="overflow-y-auto max-h-[60vh] custom-scrollbar" data-lenis-prevent>
            <GenderSidebar
              products={products}
              filters={genderFilters}
              onFiltersChange={setGenderFilters}
            />
          </div>
        ) : (
          /* Standard pages: category + price + size drawer */
          <div className="space-y-6 overflow-y-auto max-h-[60vh] custom-scrollbar" data-lenis-prevent>
            {pageType !== 'accessories' && !isGenderFixed && genderOptions.length > 0 && (
              <FilterSection title="Gender" activeCount={selectedGenders.size}>
                <div className="space-y-2">
                  {genderOptions.map((gen) => (
                    <label key={gen} className="flex cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedGenders.has(gen)}
                        onChange={() => toggleGender(gen)}
                        className="h-4 w-4 rounded border-gray-300 accent-gray-900"
                      />
                      <span className="font-nav text-[15px] capitalize text-gray-700">{gen}</span>
                    </label>
                  ))}
                </div>
              </FilterSection>
            )}

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
            </div>
          )
        }
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
        <aside 
          className="hidden w-64 shrink-0 bg-white px-6 py-8 lg:block sticky top-20 max-h-[calc(100vh-8rem)] overflow-y-auto custom-scrollbar"
          data-lenis-prevent
        >
          {pageType === "featured" ? (
            /* Featured: fully dynamic sidebar */
            <FeaturedSidebar
              products={products}
              featuredCategory={subcategory}
              filters={featuredFilters}
              onFiltersChange={setFeaturedFilters}
            />
          ) : isGenderOnlyPage ? (
            <GenderSidebar
              products={products}
              filters={genderFilters}
              onFiltersChange={setGenderFilters}
            />
          ) : (
            /* Standard pages: Category + Price + Size only */
            <>
              {pageType !== 'accessories' && !isGenderFixed && genderOptions.length > 0 && (
                <FilterSection title="Gender" activeCount={selectedGenders.size}>
                  <div className="space-y-2">
                    {genderOptions.map((gen) => (
                      <label key={gen} className="flex cursor-pointer items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedGenders.has(gen)}
                          onChange={() => toggleGender(gen)}
                          className="h-4 w-4 rounded border-gray-300 accent-gray-900"
                        />
                        <span className="font-nav text-[16px] capitalize text-gray-700">{gen}</span>
                      </label>
                    ))}
                  </div>
                </FilterSection>
              )}

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

        {/* ── Product grid or Empty state ─────────────────────────────────────────────── */}
        <div className="flex-1">
          {sortedProducts.length === 0 && !loading ? (
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
          ) : (
            <div className="grid grid-cols-2 gap-x-3 gap-y-8 px-3 py-6 sm:gap-x-4 sm:gap-y-10 sm:px-4 md:px-6 lg:grid-cols-3 lg:gap-x-4 lg:px-10 lg:py-8">
              {sortedProducts.map((product) => (
                <ProductListCard
                  key={product._id}
                  product={product}
                  pageType={pageType}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
    </div>
  );
}

export default ProductListingPage;