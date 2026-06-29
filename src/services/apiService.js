/* ============================================================
 * services/apiService.js
 *
 * All HTTP calls to the JSONPlaceholder REST API are isolated
 * here. This makes it easy to:
 *  - swap the backend URL via constants
 *  - replace fetch with axios later
 *  - mock the service in unit tests
 * ============================================================ */

import { API_BASE_URL } from "../constants";

/**
 * API service object — each method corresponds to one
 * CRUD operation on the /users resource.
 *
 * Every method throws on non-2xx responses so callers
 * can catch and display an appropriate error message.
 */
const apiService = {
  /**
   * GET /users — Fetch the full list of users.
   * @returns {Promise<Array>} Array of raw user objects.
   * @throws {Error} If the HTTP response is not OK.
   */
  async getUsers() {
    const res = await fetch(`${API_BASE_URL}/users`);
    if (!res.ok) throw new Error(`Fetch failed (HTTP ${res.status})`);
    return res.json();
  },

  /**
   * POST /users — Create a new user.
   *
   * Note: JSONPlaceholder simulates success and always returns
   * { id: 11 } regardless of the payload. The real ID is
   * generated client-side to avoid duplicates.
   *
   * @param {Object} data - User data in JSONPlaceholder's shape.
   * @returns {Promise<Object>} The created user (simulated).
   * @throws {Error} If the HTTP response is not OK.
   */
  async createUser(data) {
    const res = await fetch(`${API_BASE_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`Create failed (HTTP ${res.status})`);
    return res.json();
  },

  /**
   * PUT /users/:id — Update an existing user.
   *
   * JSONPlaceholder acknowledges the update but does not persist
   * changes. The client-side state is the source of truth.
   *
   * @param {number} id - The user ID to update.
   * @param {Object} data - Updated user data.
   * @returns {Promise<Object>} The updated user (simulated).
   * @throws {Error} If the HTTP response is not OK.
   */
  async updateUser(id, data) {
    // If id > 10, it's a locally created user.
    // JSONPlaceholder will throw a 500 error for PUT on non-existent resources.
    if (id > 10) {
      return { id, ...data };
    }

    const res = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`Update failed (HTTP ${res.status})`);
    return res.json();
  },

  /**
   * DELETE /users/:id — Remove a user.
   *
   * JSONPlaceholder responds with 200 but does not actually
   * delete the resource. Removal is handled in client state.
   *
   * @param {number} id - The user ID to delete.
   * @returns {Promise<boolean>} Always true on success.
   * @throws {Error} If the HTTP response is not OK.
   */
  async deleteUser(id) {
    // If id > 10, it's a locally created user.
    // Prevent potentially failing DELETE requests to the mock server.
    if (id > 10) {
      return true;
    }

    const res = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error(`Delete failed (HTTP ${res.status})`);
    return true;
  },
};

export default apiService;
