/* ============================================================
 * utils/helpers.js
 *
 * Pure utility functions used across the application.
 * None of these depend on React — they operate on plain data.
 * ============================================================ */

import { DEPT_COLORS } from "../constants";

/**
 * Compute a stable colour index from any string using the
 * djb2 hash algorithm. This guarantees the same department
 * name always maps to the same badge colour, regardless of
 * render order or data changes.
 *
 * @param {string} str - The string to hash (e.g. department name).
 * @param {number} len - Size of the colour palette array.
 * @returns {number} An index in the range [0, len).
 */
export const getColorIndex = (str = "", len = DEPT_COLORS.length) => {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  return Math.abs(hash) % len;
};

/**
 * Transform a raw JSONPlaceholder user object into the flat
 * shape our UI components expect.
 *
 * JSONPlaceholder stores the full name as a single string and
 * the department inside a nested `company.name` property.
 * This function splits the name into first/last and flattens
 * the department to a top-level field.
 *
 * @param {Object} user - Raw user from the API.
 * @returns {{ id: number, firstName: string, lastName: string, email: string, department: string }}
 */
export const parseApiUser = (user) => {
  const parts = (user.name || "").trim().split(/\s+/);
  return {
    id: user.id,
    firstName: parts[0] || "",
    lastName: parts.slice(1).join(" ") || "",
    email: user.email || "",
    department: user.company?.name || "Unknown",
  };
};

/**
 * Convert our flat form data back into the nested shape that
 * JSONPlaceholder expects for POST / PUT requests.
 *
 * @param {{ firstName: string, lastName: string, email: string, department: string }} data
 * @returns {{ name: string, email: string, company: { name: string } }}
 */
export const formatUserForApi = ({ firstName, lastName, email, department }) => ({
  name: `${firstName.trim()} ${lastName.trim()}`,
  email: email.trim(),
  company: { name: department.trim() },
});
