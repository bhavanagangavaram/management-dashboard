/* ============================================================
 * constants/index.js
 *
 * Centralised application constants. Keeping these in one place
 * makes it easy to change values (e.g. API URL, color palette)
 * without hunting through component files.
 * ============================================================ */

/**
 * Base URL for the JSONPlaceholder mock REST API.
 * All CRUD operations target endpoints under this URL.
 * @see https://jsonplaceholder.typicode.com
 */
export const API_BASE_URL = "https://jsonplaceholder.typicode.com";

/**
 * Available page-size options shown in the pagination dropdown.
 * Users can choose how many rows to display per page.
 */
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

/**
 * Tailwind class pairs for department badge backgrounds and text.
 * A stable hash of the department name picks a color from this list
 * so the same department always appears in the same color.
 */
export const DEPT_COLORS = [
  "bg-violet-100 text-violet-800",
  "bg-emerald-100 text-emerald-800",
  "bg-amber-100 text-amber-800",
  "bg-rose-100 text-rose-800",
  "bg-sky-100 text-sky-800",
  "bg-indigo-100 text-indigo-800",
  "bg-orange-100 text-orange-800",
  "bg-teal-100 text-teal-800",
];

/**
 * Tailwind background classes for user avatar circles.
 * The user's ID modulo the array length picks the color,
 * so each user consistently gets the same avatar shade.
 */
export const AVATAR_COLORS = [
  "bg-indigo-500",
  "bg-violet-500",
  "bg-emerald-500",
  "bg-rose-500",
  "bg-amber-500",
  "bg-sky-500",
  "bg-teal-500",
  "bg-pink-500",
];

/**
 * Column definitions for the user table.
 * Each entry maps a data field key to a display label.
 * Used by both the <thead> renderer and the sort logic.
 */
export const TABLE_COLUMNS = [
  { field: "id", label: "ID" },
  { field: "firstName", label: "First Name" },
  { field: "lastName", label: "Last Name" },
  { field: "email", label: "Email" },
  { field: "department", label: "Department" },
];
