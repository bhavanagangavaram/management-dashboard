/* ============================================================
 * components/DeleteModal.jsx
 *
 * A confirmation dialog shown before a user is permanently
 * deleted. Displays the user's name and requires explicit
 * confirmation to proceed. Supports Escape key to cancel.
 * ============================================================ */

import React, { useEffect } from "react";

/**
 * Delete confirmation modal.
 *
 * @param {Object} props
 * @param {{ firstName: string, lastName: string }} props.user - The user to delete.
 * @param {() => void} props.onConfirm - Called when deletion is confirmed.
 * @param {() => void} props.onClose - Called to dismiss without deleting.
 * @param {boolean} props.isDeleting - Disables the confirm button during API call.
 */
const DeleteModal = ({ user, onConfirm, onClose, isDeleting }) => {
  // Close on Escape key press
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
      aria-labelledby="delete-modal-title"
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
        {/* Warning icon */}
        <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl" aria-hidden="true">🗑</span>
        </div>

        <h2 id="delete-modal-title" className="text-lg font-bold text-slate-800 mb-1">
          Delete User
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          Are you sure you want to remove{" "}
          <span className="font-semibold text-slate-700">
            {user.firstName} {user.lastName}
          </span>
          ? This cannot be undone.
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 text-sm font-medium border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 py-2.5 text-sm font-medium bg-red-500 text-white rounded-xl hover:bg-red-600 disabled:opacity-60 transition-colors"
          >
            {isDeleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
