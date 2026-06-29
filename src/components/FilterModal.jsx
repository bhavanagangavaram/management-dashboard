/* ============================================================
 * components/FilterModal.jsx
 *
 * A popup modal allowing column-specific filtering of the
 * user table. The user can type partial matches for first
 * name, last name, email, and department.
 *
 * Filters are applied locally (not to the API) because
 * JSONPlaceholder does not support server-side filtering.
 *
 * The modal maintains its own local copy of filters until
 * the user clicks "Apply", preventing partial edits from
 * affecting the table mid-typing.
 * ============================================================ */

import React, { useState, useEffect } from "react";

/** Fields available for filtering — matches the user data shape. */
const FILTER_FIELDS = [
  { key: "firstName", label: "First Name" },
  { key: "lastName", label: "Last Name" },
  { key: "email", label: "Email" },
  { key: "department", label: "Department" },
];

/**
 * Filter popup modal.
 *
 * @param {Object} props
 * @param {{ firstName: string, lastName: string, email: string, department: string }} props.filters
 * @param {(filters: Object) => void} props.onApply
 * @param {() => void} props.onClose
 */
const FilterModal = ({ filters, onApply, onClose }) => {
  // Work on a local copy so changes aren't applied until confirmed
  const [local, setLocal] = useState({ ...filters });

  /** Reset all filter inputs to empty strings. */
  const handleClear = () =>
    setLocal({ firstName: "", lastName: "", email: "", department: "" });

  // Close on Escape key press for better keyboard accessibility
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="filter-modal-title"
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 id="filter-modal-title" className="text-lg font-bold text-slate-800">
            Filter Users
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 text-xl"
            aria-label="Close filter modal"
          >
            ×
          </button>
        </div>

        {/* Filter inputs — one per field */}
        <div className="px-6 py-5 space-y-4">
          {FILTER_FIELDS.map(({ key, label }) => (
            <div key={key}>
              <label
                htmlFor={`filter-${key}`}
                className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5"
              >
                {label}
              </label>
              <input
                id={`filter-${key}`}
                type="text"
                value={local[key]}
                onChange={(e) =>
                  setLocal((prev) => ({ ...prev, [key]: e.target.value }))
                }
                placeholder={`Filter by ${label.toLowerCase()}…`}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3 px-6 pb-6">
          <button
            onClick={handleClear}
            className="flex-1 py-2.5 text-sm font-medium border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors"
          >
            Clear All
          </button>
          <button
            onClick={() => onApply(local)}
            className="flex-1 py-2.5 text-sm font-medium bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
