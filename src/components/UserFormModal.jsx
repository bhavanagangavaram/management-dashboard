/* ============================================================
 * components/UserFormModal.jsx
 *
 * A dual-purpose modal for adding or editing a user.
 * When `user` is provided it pre-fills the form (edit mode);
 * when null the form starts empty (add mode).
 *
 * Validation runs on submit and highlights invalid fields
 * with red borders and inline error messages. Errors clear
 * as the user types corrections.
 * ============================================================ */

import React, { useState, useEffect } from "react";
import { FORM_FIELDS, validateForm } from "../utils/validation";

/**
 * Add / Edit user form modal.
 *
 * @param {Object} props
 * @param {Object|null} props.user - Existing user to edit, or null for new.
 * @param {(formData: Object) => void} props.onSave - Called with validated form data.
 * @param {() => void} props.onClose
 * @param {boolean} props.isSaving - Disables the submit button during API call.
 */
const UserFormModal = ({ user, onSave, onClose, isSaving }) => {
  const isEditing = !!user;

  // Initialise form state — pre-fill if editing, empty if adding
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    department: user?.department || "",
  });
  const [errors, setErrors] = useState({});

  /**
   * Update a single form field and clear its error immediately
   * so the user sees the validation state reset as they type.
   */
  const handleChange = (key, val) => {
    setFormData((prev) => ({ ...prev, [key]: val }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: null }));
  };

  /**
   * Run all validators. If any fail, set error state and bail.
   * If all pass, call onSave with the validated data.
   */
  const handleSubmit = () => {
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSave({ ...formData, id: user?.id });
  };

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
      aria-labelledby="user-form-title"
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 id="user-form-title" className="text-lg font-bold text-slate-800">
              {isEditing ? "Edit User" : "New User"}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {isEditing
                ? "Update this user's details"
                : "Fill in details to create a new user"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 text-xl"
            aria-label="Close form"
          >
            ×
          </button>
        </div>

        {/* Dynamic form fields — driven by FORM_FIELDS config */}
        <div className="px-6 py-5 space-y-4">
          {FORM_FIELDS.map(({ key, label, type, placeholder }) => (
            <div key={key}>
              <label
                htmlFor={`form-${key}`}
                className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5"
              >
                {label} <span className="text-red-400">*</span>
              </label>
              <input
                id={`form-${key}`}
                type={type}
                value={formData[key]}
                onChange={(e) => handleChange(key, e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder={placeholder}
                aria-invalid={!!errors[key]}
                aria-describedby={errors[key] ? `error-${key}` : undefined}
                className={`w-full border rounded-xl px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                  errors[key]
                    ? "border-red-300 focus:ring-red-300 bg-red-50"
                    : "border-slate-200 focus:ring-indigo-500"
                }`}
              />
              {errors[key] && (
                <p id={`error-${key}`} className="mt-1 text-xs text-red-500" role="alert">
                  ⚠ {errors[key]}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3 px-6 pb-6">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 text-sm font-medium border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="flex-1 py-2.5 text-sm font-medium bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-60 transition-colors"
          >
            {isSaving ? "Saving…" : isEditing ? "Save Changes" : "Add User"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserFormModal;
