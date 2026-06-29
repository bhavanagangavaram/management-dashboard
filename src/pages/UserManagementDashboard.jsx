/* ============================================================
 * pages/UserManagementDashboard.jsx
 *
 * The main application page. Orchestrates:
 *   - Fetching users from the API on mount
 *   - CRUD operations (add, edit, delete) via apiService
 *   - Client-side search, filtering, sorting, and pagination
 *   - Modal visibility for form, delete confirm, and filters
 *   - Toast notifications for success/error feedback
 *
 * All data transformation (search → filter → sort → paginate)
 * happens in memoised pipelines so the UI stays responsive
 * even with larger datasets.
 * ============================================================ */

import React, { useState, useEffect, useCallback, useMemo } from "react";

// Services & utilities
import apiService from "../services/apiService";
import { parseApiUser, formatUserForApi, getColorIndex } from "../utils/helpers";
import { useToast } from "../hooks/useToast";

// Constants
import { DEPT_COLORS, TABLE_COLUMNS } from "../constants";

// Components
import Toast from "../components/Toast";
import UserAvatar from "../components/UserAvatar";
import SortArrow from "../components/SortArrow";
import SkeletonRow from "../components/SkeletonRow";
import Pagination from "../components/Pagination";
import FilterModal from "../components/FilterModal";
import UserFormModal from "../components/UserFormModal";
import DeleteModal from "../components/DeleteModal";


/**
 * UserManagementDashboard — the top-level page component.
 *
 * Manages all application state and delegates rendering to
 * focused child components. Each modal, the table, and the
 * pagination are separate components that receive only the
 * props they need.
 */
export default function UserManagementDashboard() {
  // ── Core data ──────────────────────────────────────────────
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // ── Modal visibility ───────────────────────────────────────
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null); // null = adding new
  const [deletingUser, setDeletingUser] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // ── Toast notifications (via custom hook) ──────────────────
  const { toasts, addToast, dismissToast } = useToast();

  // ── Search / filter / sort / pagination state ──────────────
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [filters, setFilters] = useState({
    firstName: "",
    lastName: "",
    email: "",
    department: "",
  });
  const [sortConfig, setSortConfig] = useState({
    field: "id",
    direction: "asc",
  });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // ── Fetch all users on mount ───────────────────────────────
  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const data = await apiService.getUsers();
        setUsers(data.map(parseApiUser));
      } catch (err) {
        addToast(err.message || "Failed to load users.", "error");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [addToast]);

  // ── CRUD: Add or Edit ─────────────────────────────────────
  const handleSaveUser = async (formData) => {
    setActionLoading(true);
    try {
      const apiData = formatUserForApi(formData);

      if (formData.id) {
        // PUT — update existing user
        await apiService.updateUser(formData.id, apiData);
        setUsers((prev) =>
          prev.map((u) =>
            u.id === formData.id
              ? {
                ...u,
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                department: formData.department,
              }
              : u
          )
        );
        addToast("User updated successfully.");
      } else {
        // POST — create new user
        await apiService.createUser(apiData);

        /*
         * BUG FIX: JSONPlaceholder always returns { id: 11 }.
         * We find the highest existing ID and add 1 to ensure
         * each new user has a unique, sequentially accurate identifier.
         */
        const maxId = users.reduce((max, u) => Math.max(max, u.id), 0);
        const newUser = {
          id: maxId + 1,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          department: formData.department,
        };
        setUsers((prev) => [newUser, ...prev]);
        addToast("User added successfully.");
      }

      setShowForm(false);
      setEditingUser(null);
    } catch (err) {
      addToast(err.message || "Failed to save user.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  // ── CRUD: Delete ──────────────────────────────────────────
  const handleDeleteUser = async () => {
    if (!deletingUser) return;
    setActionLoading(true);
    try {
      await apiService.deleteUser(deletingUser.id);
      setUsers((prev) => prev.filter((u) => u.id !== deletingUser.id));
      addToast("User removed successfully.");
      setDeletingUser(null);
    } catch (err) {
      addToast(err.message || "Failed to delete user.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  // ── Sort toggle ───────────────────────────────────────────
  const handleSort = (field) => {
    setSortConfig((prev) => ({
      field,
      direction: prev.field === field && prev.direction === "asc" ? "desc" : "asc",
    }));
    setPage(1);
  };

  // ──────────────────────────────────────────────────────────
  // Data pipeline: search → filter → sort
  //
  // Each step runs only when its dependencies change (useMemo).
  // The pipeline transforms the full `users` array into a
  // sorted, filtered subset ready for pagination.
  // ──────────────────────────────────────────────────────────
  const processedUsers = useMemo(() => {
    let result = [...users];

    // Step 1: Global search across all visible fields
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((u) =>
        [u.firstName, u.lastName, u.email, u.department, String(u.id)].some(
          (v) => v.toLowerCase().includes(q)
        )
      );
    }

    // Step 2: Column-specific filters (additive — all must match)
    if (filters.firstName)
      result = result.filter((u) =>
        u.firstName.toLowerCase().includes(filters.firstName.toLowerCase())
      );
    if (filters.lastName)
      result = result.filter((u) =>
        u.lastName.toLowerCase().includes(filters.lastName.toLowerCase())
      );
    if (filters.email)
      result = result.filter((u) =>
        u.email.toLowerCase().includes(filters.email.toLowerCase())
      );
    if (filters.department)
      result = result.filter((u) =>
        u.department.toLowerCase().includes(filters.department.toLowerCase())
      );

    // Step 3: Sort
    result.sort((a, b) => {
      /*
       * BUG FIX: The ID column must sort numerically (1, 2, 10)
       * rather than lexicographically ("1", "10", "2").
       * All other columns use case-insensitive string comparison.
       */
      let comparison;
      if (sortConfig.field === "id") {
        comparison = a.id - b.id;
      } else {
        const av = String(a[sortConfig.field] ?? "").toLowerCase();
        const bv = String(b[sortConfig.field] ?? "").toLowerCase();
        comparison = av < bv ? -1 : av > bv ? 1 : 0;
      }
      return sortConfig.direction === "asc" ? comparison : -comparison;
    });

    return result;
  }, [users, searchQuery, filters, sortConfig]);

  // ── Paginate the processed list ───────────────────────────
  const paginatedUsers = useMemo(() => {
    const start = (page - 1) * pageSize;
    return processedUsers.slice(start, start + pageSize);
  }, [processedUsers, page, pageSize]);

  /*
   * BUG FIX: Clamp the current page if it exceeds the available
   * pages. This can happen when filters reduce the result set or
   * a user is deleted from the last page.
   */
  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(processedUsers.length / pageSize));
    if (page > maxPage) setPage(maxPage);
  }, [processedUsers.length, pageSize, page]);

  // Count of active column filters — drives badge + chip display
  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  // ── Render ────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Toast notification layer */}
      <Toast toasts={toasts} onDismiss={dismissToast} />

      {/* ── Sticky header ── */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            {/* App icon */}
            <img src={`${import.meta.env.BASE_URL}dashboard-layout.png`} alt="UM Logo" className="w-9 h-9 object-contain flex-shrink-0" />
            <div className="min-w-0">
              <h1 className="text-lg font-bold text-slate-900 leading-none truncate">
                User Management
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                {isLoading ? "Loading…" : `${users.length} total users`}
              </p>
            </div>
          </div>

          {/* Add User button */}
          <button
            onClick={() => {
              setEditingUser(null);
              setShowForm(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200 flex-shrink-0"
          >
            <span className="text-base leading-none">+</span>
            <span className="hidden sm:inline">Add User</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* ── Search & filter bar ── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          {/* Global search input */}
          <div className="flex-1 relative">
            <img
              src={isSearchFocused ? `${import.meta.env.BASE_URL}search-animated.png` : `${import.meta.env.BASE_URL}search.gif`}
              alt="search"
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              placeholder="Search by name, email, department…"
              aria-label="Search users"
              className="w-full pl-9 pr-9 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setPage(1);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-lg leading-none"
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>

          {/* Filter button with active count badge */}
          <button
            onClick={() => setShowFilters(true)}
            className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl text-sm font-medium transition-colors shadow-sm flex-shrink-0 ${activeFilterCount > 0
                ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
          >
            <span>⚙</span>
            Filters
            {activeFilterCount > 0 && (
              <span className="bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* ── Active filter chips ── */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {Object.entries(filters).map(([key, val]) =>
              val ? (
                <span
                  key={key}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full"
                >
                  {/* Prettify camelCase key: "firstName" → "First Name" */}
                  <span className="capitalize">
                    {key.replace(/([A-Z])/g, " $1")}:
                  </span>
                  <span className="font-semibold">{val}</span>
                  <button
                    onClick={() => {
                      setFilters((prev) => ({ ...prev, [key]: "" }));
                      setPage(1);
                    }}
                    className="hover:text-indigo-900 leading-none ml-0.5"
                    aria-label={`Remove ${key} filter`}
                  >
                    ×
                  </button>
                </span>
              ) : null
            )}
            <button
              onClick={() => {
                setFilters({
                  firstName: "",
                  lastName: "",
                  email: "",
                  department: "",
                });
                setPage(1);
              }}
              className="text-xs text-slate-400 hover:text-slate-600 underline px-1"
            >
              Clear all
            </button>
          </div>
        )}

        {/* ── Main table card ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  {TABLE_COLUMNS.map(({ field, label }) => (
                    <th
                      key={field}
                      onClick={() => handleSort(field)}
                      aria-sort={
                        sortConfig.field === field
                          ? sortConfig.direction === "asc"
                            ? "ascending"
                            : "descending"
                          : "none"
                      }
                      className={`text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-50 select-none whitespace-nowrap transition-colors ${field === "lastName" ? "hidden sm:table-cell" : ""
                        }`}
                    >
                      {label}
                      <SortArrow field={field} sortConfig={sortConfig} />
                    </th>
                  ))}
                  <th className="px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {isLoading ? (
                  /* Skeleton loader while fetching initial data */
                  [...Array(6)].map((_, i) => <SkeletonRow key={i} />)
                ) : paginatedUsers.length === 0 ? (
                  /* Empty state — different message for filtered vs. fresh */
                  <tr>
                    <td colSpan={6} className="text-center py-16 text-slate-400">
                      <p className="text-3xl mb-3">👤</p>
                      <p className="font-semibold text-slate-600 mb-1">
                        No users found
                      </p>
                      <p className="text-xs">
                        {searchQuery || activeFilterCount > 0
                          ? "Try adjusting your search or clearing filters"
                          : "Add your first user to get started"}
                      </p>
                    </td>
                  </tr>
                ) : (
                  /* Data rows */
                  paginatedUsers.map((user, idx) => (
                    <tr
                      key={user.id}
                      className={`border-b border-slate-100 hover:bg-indigo-50/40 transition-colors ${idx % 2 === 1 ? "bg-slate-50/40" : ""
                        }`}
                    >
                      {/* ID */}
                      <td className="px-4 py-3.5">
                        <span className="text-xs font-mono text-slate-400">
                          #{user.id}
                        </span>
                      </td>

                      {/* First Name with avatar */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <UserAvatar
                            firstName={user.firstName}
                            lastName={user.lastName}
                            userId={user.id}
                          />
                          <span className="font-semibold text-slate-800 text-sm">
                            {user.firstName}
                          </span>
                        </div>
                      </td>

                      {/* Last Name — hidden on xs screens */}
                      <td className="px-4 py-3.5 text-slate-700 hidden sm:table-cell">
                        {user.lastName}
                      </td>

                      {/* Email */}
                      <td className="px-4 py-3.5 text-slate-500 text-xs max-w-xs truncate">
                        {user.email}
                      </td>

                      {/* Department badge with stable colour */}
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${DEPT_COLORS[getColorIndex(user.department)]
                            }`}
                        >
                          {user.department}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setEditingUser(user);
                              setShowForm(true);
                            }}
                            className="px-3 py-1.5 text-xs font-medium text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setDeletingUser(user)}
                            className="px-3 py-1.5 text-xs font-medium text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination — only shown after data loads */}
          {!isLoading && (
            <Pagination
              total={processedUsers.length}
              page={page}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={(size) => {
                setPageSize(size);
                setPage(1);
              }}
            />
          )}
        </div>

        {/* Filtered vs total indicator */}
        {!isLoading && processedUsers.length !== users.length && (
          <p className="text-center text-xs text-slate-400 mt-3">
            Showing {processedUsers.length} filtered result
            {processedUsers.length !== 1 ? "s" : ""} from {users.length} total
          </p>
        )}
      </main>

      {/* ── Modals ── */}
      {showForm && (
        <UserFormModal
          user={editingUser}
          onSave={handleSaveUser}
          onClose={() => {
            setShowForm(false);
            setEditingUser(null);
          }}
          isSaving={actionLoading}
        />
      )}

      {deletingUser && (
        <DeleteModal
          user={deletingUser}
          onConfirm={handleDeleteUser}
          onClose={() => setDeletingUser(null)}
          isDeleting={actionLoading}
        />
      )}

      {showFilters && (
        <FilterModal
          filters={filters}
          onApply={(f) => {
            setFilters(f);
            setPage(1);
            setShowFilters(false);
          }}
          onClose={() => setShowFilters(false)}
        />
      )}
    </div>
  );
}
