/* ============================================================
 * components/SortArrow.jsx
 *
 * A tiny indicator rendered next to sortable table headers.
 * Shows ⇅ when the column is not the active sort target,
 * or ↑/↓ when it is (matching the current direction).
 * ============================================================ */

import React from "react";

/**
 * Sort direction arrow indicator.
 *
 * @param {Object} props
 * @param {string} props.field - The column field this arrow belongs to.
 * @param {{ field: string, direction: string }} props.sortConfig - Current sort state.
 */
const SortArrow = ({ field, sortConfig }) => {
  if (sortConfig.field !== field) {
    return <span className="ml-1 text-slate-300 text-xs">⇅</span>;
  }
  return (
    <span className="ml-1 text-indigo-500 text-xs font-bold">
      {sortConfig.direction === "asc" ? "↑" : "↓"}
    </span>
  );
};

export default SortArrow;
