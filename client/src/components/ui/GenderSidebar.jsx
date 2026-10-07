import React from 'react';
import FilterSection from './FilterSection';

/**
 * GenderSidebar
 *
 * Fully data-driven accordion sidebar for the "gender-only" listing pages (Men/Women).
 * Every filter option is derived from the fetched products array — nothing is hardcoded.
 *
 * Props:
 *   products         — full product array from the API (used to compute available options)
 *   filters          — { sections: Set, sports: Set, categories: Set, sizes: Set, brands: Set, priceRanges: Set, sortBy: string }
 *   onFiltersChange  — setState-compatible setter
 */
function GenderSidebar({ products, filters, onFiltersChange }) {
  const { sections, sports, categories, sizes, brands, priceRanges, sortBy } = filters;

  // ── Derive available options dynamically from the fetched products ─────────
  const sectionOptions = [...new Set(products.map(p => p.section).filter(Boolean))].sort();
  const sportOptions = [...new Set(products.map(p => p.sport).filter(Boolean))].sort();
  const categoryOptions = [...new Set(products.map(p => p.category).filter(Boolean))].sort();
  const brandOptions = [...new Set(products.map(p => p.brand).filter(Boolean))].sort();
  const sizeOptions = [...new Set(products.flatMap(p => p.sizes || []).filter(Boolean))].sort();
  
  // Dynamic price ranges based on the products
  // E.g. Under ₹1000, ₹1000 - ₹2000, ₹2000 - ₹5000, Over ₹5000
  const priceRangeMap = {
    'under-1000': 'Under ₹1000',
    '1000-2000': '₹1000 - ₹2000',
    '2000-5000': '₹2000 - ₹5000',
    'over-5000': 'Over ₹5000'
  };
  
  // Only show price ranges that actually have products
  const availablePriceRanges = new Set();
  products.forEach(p => {
    if (p.price < 1000) availablePriceRanges.add('under-1000');
    else if (p.price <= 2000) availablePriceRanges.add('1000-2000');
    else if (p.price <= 5000) availablePriceRanges.add('2000-5000');
    else availablePriceRanges.add('over-5000');
  });
  
  const priceRangeOptions = ['under-1000', '1000-2000', '2000-5000', 'over-5000'].filter(r => availablePriceRanges.has(r));

  // ── Generic toggle helper for Set-based filter groups ─────────────────────
  const toggleItem = (filterKey, value) => {
    onFiltersChange(prev => {
      const next = new Set(prev[filterKey]);
      next.has(value) ? next.delete(value) : next.add(value);
      return { ...prev, [filterKey]: next };
    });
  };

  const setSort = (value) => {
    onFiltersChange(prev => ({
      ...prev,
      sortBy: prev.sortBy === value ? 'default' : value,
    }));
  };

  return (
    <div>
      {/* ── Product type (section) ────────────────────────────────────── */}
      {sectionOptions.length > 0 && (
        <FilterSection title="Product Type" activeCount={sections.size} defaultOpen>
          <div className="space-y-2">
            {sectionOptions.map(s => (
              <label key={s} className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={sections.has(s)}
                  onChange={() => toggleItem('sections', s)}
                  className="h-4 w-4 rounded border-gray-300 accent-gray-900"
                />
                <span className="font-nav text-[16px] text-gray-700">{s}</span>
              </label>
            ))}
          </div>
        </FilterSection>
      )}



      {/* ── Category ──────────────────────────────────────────────────── */}
      {categoryOptions.length > 0 && (
        <FilterSection title="Category" activeCount={categories.size}>
          <div className="space-y-2">
            {categoryOptions.map(c => (
              <label key={c} className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={categories.has(c)}
                  onChange={() => toggleItem('categories', c)}
                  className="h-4 w-4 rounded border-gray-300 accent-gray-900"
                />
                <span className="font-nav text-[16px] text-gray-700">{c}</span>
              </label>
            ))}
          </div>
        </FilterSection>
      )}

      {/* ── Price Range ───────────────────────────────────────────────── */}
      {priceRangeOptions.length > 0 && (
        <FilterSection title="Price Range" activeCount={priceRanges.size}>
          <div className="space-y-2">
            {priceRangeOptions.map(r => (
              <label key={r} className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={priceRanges.has(r)}
                  onChange={() => toggleItem('priceRanges', r)}
                  className="h-4 w-4 rounded border-gray-300 accent-gray-900"
                />
                <span className="font-nav text-[16px] text-gray-700">{priceRangeMap[r]}</span>
              </label>
            ))}
          </div>
        </FilterSection>
      )}


    </div>
  );
}

export default GenderSidebar;
