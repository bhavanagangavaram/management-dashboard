/* ============================================================
 * components/Pagination.jsx
 *
 * Full-featured pagination controls with:
 *   - First / Previous / Next / Last navigation buttons
 *   - A sliding window of at most 5 page-number buttons
 *   - Page-size dropdown (10, 25, 50, 100)
 *   - "X–Y of Z" range label
 *
 * The component is fully controlled — it receives the current
 * state and calls back when the user wants to change it.
 * ============================================================ */

import React, { useMemo } from "react";
import { PAGE_SIZE_OPTIONS } from "../constants";

/**
 * Small navigation button used for first/prev/next/last.
 * Extracted to avoid repeating the same className string.
 *
 * @param {Object} props
 * @param {string} props.label - Button text (e.g. «, ‹, ›, »).
 * @param {number} props.target - Page number to navigate to.
 * @param {boolean} props.disabled - Whether the button is inactive.
 * @param {(page: number) => void} props.onClick
 */
const NavBtn = ({ label, target, disabled, onClick }) => (
  <button
    onClick={() => onClick(target)}
    disabled={disabled}
    aria-label={`Go to page ${target}`}
    className="w-8 h-8 flex items-center justify-center rounded-lg text-sm border border-slate-200 disabled:opacity-30 hover:bg-slate-100 transition-colors"
  >
    {label}
  </button>
);

/**
 * Pagination controls.
 *
 * @param {Object} props
 * @param {number} props.total - Total number of items (filtered count).
 * @param {number} props.page - Current 1-based page number.
 * @param {number} props.pageSize - Items per page.
 * @param {(page: number) => void} props.onPageChange
 * @param {(size: number) => void} props.onPageSizeChange
 */
const Pagination = ({ total, page, pageSize, onPageChange, onPageSizeChange }) => {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  /*
   * Compute the sliding window of visible page numbers.
   * We show at most 5 pages centred around the current page,
   * clamping to [1, totalPages] at the boundaries.
   */
  const visiblePages = useMemo(() => {
    const pages = [];
    let start = Math.max(1, page - 2);
    let end = Math.min(totalPages, start + 4);
    if (end - start < 4) start = Math.max(1, end - 4);
    for (let p = start; p <= end; p++) pages.push(p);
    return pages;
  }, [page, totalPages]);

  // Human-readable range label: "1–10 of 50"
  const rangeStart = Math.min((page - 1) * pageSize + 1, total);
  const rangeEnd = Math.min(page * pageSize, total);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/60">
      {/* Left side: page-size selector + range label */}
      <div className="flex items-center gap-3 text-sm text-slate-500">
        <label htmlFor="page-size-select">Rows:</label>
        <select
          id="page-size-select"
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="border border-slate-200 rounded-lg px-2 py-1 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          {PAGE_SIZE_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <span>
          {total === 0 ? "0" : `${rangeStart}–${rangeEnd}`} of {total}
        </span>
      </div>

      {/* Right side: page navigation */}
      <nav className="flex items-center gap-1" aria-label="Pagination">
        <NavBtn label="«" target={1} disabled={page === 1} onClick={onPageChange} />
        <NavBtn label="‹" target={page - 1} disabled={page === 1} onClick={onPageChange} />

        {visiblePages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            aria-current={p === page ? "page" : undefined}
            className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm border transition-colors ${
              p === page
                ? "bg-indigo-600 text-white border-indigo-600 font-semibold"
                : "border-slate-200 hover:bg-slate-100 text-slate-600"
            }`}
          >
            {p}
          </button>
        ))}

        <NavBtn label="›" target={page + 1} disabled={page === totalPages} onClick={onPageChange} />
        <NavBtn label="»" target={totalPages} disabled={page === totalPages} onClick={onPageChange} />
      </nav>
    </div>
  );
};

export default Pagination;
