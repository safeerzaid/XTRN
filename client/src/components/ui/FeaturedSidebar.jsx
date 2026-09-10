import FilterSection from './FilterSection'

/**
 * FeaturedSidebar
 *
 * Fully data-driven accordion sidebar for the Featured Collection pages.
 * Every filter option is derived from the products array — nothing is hardcoded.
 * Scalable: new categories added to the CSV will automatically surface new options.
 *
 * Props:
 *   products         — full product array from the API (used to compute available options)
 *   featuredCategory — 'shoes' | 'apparel' | 'accessories' (controls which filter groups appear)
 *   filters          — { genders: Set, types: Set, brands: Set, sizes: Set, sortBy: string }
 *   onFiltersChange  — setState-compatible setter: (prevFilters => newFilters) or newFilters
 */
function FeaturedSidebar({ products, featuredCategory, filters, onFiltersChange }) {
  const { genders, types, brands, sizes, sortBy } = filters

  // ── Derive available options dynamically from the fetched products ─────────
  const genderOptions = [...new Set(products.map(p => p.gender).filter(Boolean))].sort()
  const typeOptions   = [...new Set(products.map(p => p.category).filter(Boolean))].sort()
  const brandOptions  = [...new Set(products.map(p => p.brand).filter(Boolean))].sort()
  const allSizes      = [...new Set(products.flatMap(p => p.sizes || []).filter(Boolean))].sort()

  // Hide Size for accessories (all "One Size") and when no real sizes exist
  const meaningfulSizes = allSizes.filter(s => s !== 'One Size')
  const showSizes = featuredCategory !== 'accessories' && meaningfulSizes.length > 0

  // Human-readable label for the Type filter group
  const typeLabel =
    featuredCategory === 'shoes'       ? 'Shoe Type'      :
    featuredCategory === 'apparel'     ? 'Apparel Type'   :
    featuredCategory === 'accessories' ? 'Accessory Type' :
    'Type'

  // ── Generic toggle helper for Set-based filter groups ─────────────────────
  const toggleItem = (filterKey, value) => {
    onFiltersChange(prev => {
      const next = new Set(prev[filterKey])
      next.has(value) ? next.delete(value) : next.add(value)
      return { ...prev, [filterKey]: next }
    })
  }

  const setSort = (value) => {
    onFiltersChange(prev => ({
      ...prev,
      sortBy: prev.sortBy === value ? 'default' : value,
    }))
  }

  return (
    <div>
      {/* ── Gender ──────────────────────────────────────────────────────── */}
      {genderOptions.length > 0 && (
        <FilterSection title="Gender" activeCount={genders.size} defaultOpen>
          <div className="space-y-2">
            {genderOptions.map(g => (
              <label key={g} className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={genders.has(g)}
                  onChange={() => toggleItem('genders', g)}
                  className="h-4 w-4 rounded border-gray-300 accent-gray-900"
                />
                <span className="font-nav text-[16px] capitalize text-gray-700">{g}</span>
              </label>
            ))}
          </div>
        </FilterSection>
      )}

      {/* ── Type (Shoe Type / Apparel Type / Accessory Type) ────────────── */}
      {typeOptions.length > 0 && (
        <FilterSection title={typeLabel} activeCount={types.size}>
          <div className="space-y-2">
            {typeOptions.map(t => (
              <label key={t} className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={types.has(t)}
                  onChange={() => toggleItem('types', t)}
                  className="h-4 w-4 rounded border-gray-300 accent-gray-900"
                />
                <span className="font-nav text-[16px] text-gray-700">{t}</span>
              </label>
            ))}
          </div>
        </FilterSection>
      )}

      {/* ── Brand ───────────────────────────────────────────────────────── */}
      {brandOptions.length > 0 && (
        <FilterSection title="Brand" activeCount={brands.size}>
          <div className="space-y-2">
            {brandOptions.map(b => (
              <label key={b} className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={brands.has(b)}
                  onChange={() => toggleItem('brands', b)}
                  className="h-4 w-4 rounded border-gray-300 accent-gray-900"
                />
                <span className="font-nav text-[16px] text-gray-700">{b}</span>
              </label>
            ))}
          </div>
        </FilterSection>
      )}

      {/* ── Size (hidden for accessories) ───────────────────────────────── */}
      {showSizes && (
        <FilterSection title="Size" activeCount={sizes.size}>
          <div className="flex flex-wrap gap-2">
            {meaningfulSizes.map(size => (
              <button
                key={size}
                onClick={() => toggleItem('sizes', size)}
                className={`rounded border px-3 py-1.5 font-nav text-[14px] transition-colors ${
                  sizes.has(size)
                    ? 'border-gray-900 bg-gray-900 text-white'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-600'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </FilterSection>
      )}

      {/* ── Price ───────────────────────────────────────────────────────── */}
      <FilterSection title="Price" activeCount={sortBy !== 'default' ? 1 : 0}>
        <div className="space-y-2">
          {[
            { value: 'price-asc',  label: 'Low to High' },
            { value: 'price-desc', label: 'High to Low' },
          ].map(({ value, label }) => (
            <label key={value} className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={sortBy === value}
                onChange={() => setSort(value)}
                className="h-4 w-4 rounded border-gray-300 accent-gray-900"
              />
              <span className="font-nav text-[16px] text-gray-700">{label}</span>
            </label>
          ))}
        </div>
      </FilterSection>
    </div>
  )
}

export default FeaturedSidebar
