/* ============================================================
 * utils/validation.js
 *
 * Client-side form validation rules for the user form.
 * Each field definition includes its validator function so the
 * rules live right next to the metadata they validate.
 * ============================================================ */

/**
 * Form field definitions used by UserFormModal.
 *
 * Each entry describes a single input:
 * - key:         maps to formData property name
 * - label:       human-readable label shown above the input
 * - type:        HTML input type attribute
 * - placeholder: hint text inside the empty input
 * - validate:    function(value) → error string | null
 *
 * Adding a new field to the form only requires adding
 * an entry here — no changes needed in the modal component.
 */
export const FORM_FIELDS = [
  {
    key: "firstName",
    label: "First Name",
    type: "text",
    placeholder: "e.g. Jane",
    validate: (v) =>
      !v?.trim()
        ? "Required"
        : v.trim().length < 2
        ? "Min 2 characters"
        : null,
  },
  {
    key: "lastName",
    label: "Last Name",
    type: "text",
    placeholder: "e.g. Smith",
    validate: (v) =>
      !v?.trim()
        ? "Required"
        : v.trim().length < 2
        ? "Min 2 characters"
        : null,
  },
  {
    key: "email",
    label: "Email Address",
    type: "email",
    placeholder: "e.g. jane@company.com",
    validate: (v) => {
      if (!v?.trim()) return "Required";
      // Simple regex — covers most common email patterns.
      // A production app would use a library or server-side check.
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
        ? null
        : "Invalid email format";
    },
  },
  {
    key: "department",
    label: "Department",
    type: "text",
    placeholder: "e.g. Engineering",
    validate: (v) => (!v?.trim() ? "Required" : null),
  },
];

/**
 * Run every field's validator against the given form data and
 * return a map of { fieldKey: errorMessage } for any that fail.
 *
 * An empty return object means all fields are valid.
 *
 * @param {Object} data - Form data keyed by FORM_FIELDS[].key
 * @returns {Object} Errors map (empty if valid)
 */
export const validateForm = (data) => {
  const errors = {};
  FORM_FIELDS.forEach(({ key, validate }) => {
    const err = validate(data[key]);
    if (err) errors[key] = err;
  });
  return errors;
};
