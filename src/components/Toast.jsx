/* ============================================================
 * components/Toast.jsx
 *
 * Renders a stack of toast notifications in the top-right
 * corner of the viewport. Each toast shows an icon, a message,
 * and a manual dismiss button.
 *
 * Toasts are positioned with `fixed` so they float above all
 * other content. The container is `pointer-events-none` with
 * individual toasts set to `pointer-events-auto` so clicks
 * pass through the transparent wrapper.
 * ============================================================ */

import React from "react";

/**
 * Toast notification bar.
 *
 * @param {Object} props
 * @param {Array<{ id: number, message: string, type: string }>} props.toasts
 * @param {(id: number) => void} props.onDismiss - Callback to remove a toast.
 */
const Toast = ({ toasts, onDismiss }) => (
  <div
    className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none"
    aria-live="polite"
    aria-atomic="true"
  >
    {toasts.map((t) => (
      <div
        key={t.id}
        role="alert"
        className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-white text-sm font-medium min-w-60 pointer-events-auto ${
          t.type === "error" ? "bg-red-500" : "bg-emerald-500"
        }`}
      >
        {/* Status icon — ✕ for error, ✓ for success */}
        <span aria-hidden="true">{t.type === "error" ? "✕" : "✓"}</span>
        <span className="flex-1">{t.message}</span>
        <button
          onClick={() => onDismiss(t.id)}
          className="opacity-70 hover:opacity-100 text-lg leading-none"
          aria-label="Dismiss notification"
        >
          ×
        </button>
      </div>
    ))}
  </div>
);

export default Toast;
