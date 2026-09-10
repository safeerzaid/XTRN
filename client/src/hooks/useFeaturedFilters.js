import { useMemo } from 'react'

/**
 * useFeaturedFilters
 *
 * Custom hook for the Featured Collection listing pages (Shoes / Apparel / Accessories).
 * Computes available filter options dynamically from the full products array,
 * then applies the active selections to produce a filtered + sorted result.
 *
 * @param {Array}  products - Full product array fetched from the API (unfiltered)
 * @param {Object} filters  - Active filter state
 *   {
 *     genders : Set<string>   — e.g. new Set(['men'])
 *     types   : Set<string>   — maps to product.category (e.g. "Sports Shoes", "T-Shirts")
 *     brands  : Set<string>   — e.g. new Set(['XTRN', 'Nike'])
 *     sizes   : Set<string>   — e.g. new Set(['S', 'M'])
 *     sortBy  : string        — 'default' | 'price-asc' | 'price-desc'
 *   }
 *
 * @returns {{ options, filtered }}
 *   options  — available values derived from the FULL (unfiltered) products array
 *              so options never shrink as the user adds more filters
 *   filtered — products after applying all active filters + sort
 */
export function useFeaturedFilters(products, filters) {
  const { genders, types, brands, sizes, sortBy } = filters

  // ── Available options ─────────────────────────────────────────────────────
  // Always computed from the full products array so filters don't cascade-shrink
  const options = useMemo(() => ({
    genders: [...new Set(products.map(p => p.gender).filter(Boolean))].sort(),
    types:   [...new Set(products.map(p => p.category).filter(Boolean))].sort(),
    brands:  [...new Set(products.map(p => p.brand).filter(Boolean))].sort(),
    sizes:   [...new Set(products.flatMap(p => p.sizes || []).filter(Boolean))].sort(),
  }), [products])

  // ── Filtered + sorted result ──────────────────────────────────────────────
  const filtered = useMemo(() => {
    let result = products
    if (genders.size > 0) result = result.filter(p => genders.has(p.gender))
    if (types.size > 0)   result = result.filter(p => types.has(p.category))
    if (brands.size > 0)  result = result.filter(p => brands.has(p.brand))
    if (sizes.size > 0)   result = result.filter(p => (p.sizes || []).some(s => sizes.has(s)))

    return [...result].sort((a, b) => {
      if (sortBy === 'price-asc')  return a.price - b.price
      if (sortBy === 'price-desc') return b.price - a.price
      return 0
    })
  }, [products, genders, types, brands, sizes, sortBy])

  return { options, filtered }
}
