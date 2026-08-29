import React, { useState } from 'react'

/**
 * FilterSection — Nike-style accordion filter block
 *
 * Props:
 *   title       — string label shown in the header (e.g. "Brand")
 *   children    — the filter options rendered inside when open
 *   defaultOpen — boolean, start expanded? (default false)
 *   activeCount — number of currently selected options in this section.
 *                 When > 0, a small black badge appears next to the title
 *                 so the user knows a filter is active even when collapsed.
 */
function FilterSection({ title, children, defaultOpen = false, activeCount = 0 }) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    // thin bottom border separates each row — mirrors Nike's sidebar dividers
    <div className="border-b border-gray-200">

      {/* ── Header button ─────────────────────────────────────────────
          flex + justify-between: title left, chevron right.
          w-full: entire row is clickable.
          py-4: comfortable touch target height.
          text-left: prevents Safari from centering button text.
      */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-4 text-left"
        aria-expanded={isOpen}
      >
        {/* Title + optional active-count badge */}
        <span className="flex items-center gap-2">
          <span className="font-nav text-[20px] font-semibold text-gray-700">
            {title}
          </span>

          {/*
            Badge: only visible when ≥ 1 option is selected.
            Gives instant feedback that a filter is active in this section
            without the user having to open every accordion.
          */}
          {activeCount > 0 && (
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-gray-900 text-[11px] font-bold text-white">
              {activeCount}
            </span>
          )}
        </span>

        {/*
          Chevron SVG.
          rotate-180 when open, rotate-0 when closed.
          transition-transform duration-300 → smooth CSS rotation,
          no JS animation library needed.
        */}
        <svg
          className={`h-4 w-4 text-gray-500 transition-transform duration-300 ease-in-out ${
            isOpen ? 'rotate-180' : 'rotate-0'
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* ── Collapsible content ────────────────────────────────────────
          max-h trick: closed → max-h-0 collapses the div to nothing.
                       open  → max-h-[500px] gives room for any list.
          opacity 0 → 1 adds a simultaneous fade for a polished feel.
          overflow-hidden stops content from bleeding out mid-animation.
          transition-all duration-300 animates both at once.
      */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="pb-4">
          {children}
        </div>
      </div>
    </div>
  )
}

export default FilterSection