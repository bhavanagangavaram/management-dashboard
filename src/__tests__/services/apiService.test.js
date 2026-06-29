/* ============================================================
 * __tests__/services/apiService.test.js
 *
 * Unit tests for the API service layer.
 * We mock the global fetch function to verify:
 *   - Correct HTTP methods and URLs are used
 *   - Success responses are returned properly
 *   - Non-OK responses throw descriptive errors
 * ============================================================ */

import { describe, it, expect, vi, beforeEach } from "vitest";
import apiService from "../../services/apiService";
import { API_BASE_URL } from "../../constants";

// Mock the global fetch before each test
beforeEach(() => {
  vi.restoreAllMocks();
});

/**
 * Helper to create a mock Response object.
 * @param {Object} body - JSON body to return.
 * @param {boolean} ok - Whether the response is OK (2xx).
 * @param {number} status - HTTP status code.
 */
const mockFetch = (body, ok = true, status = 200) => {
  vi.stubGlobal(
    "fetch",
    vi.fn(() =>
      Promise.resolve({
        ok,
        status,
        json: () => Promise.resolve(body),
      })
    )
  );
};

describe("apiService.getUsers", () => {
  it("fetches users from the correct endpoint", async () => {
    const mockUsers = [{ id: 1, name: "Test User" }];
    mockFetch(mockUsers);

    const result = await apiService.getUsers();

    expect(fetch).toHaveBeenCalledWith(`${API_BASE_URL}/users`);
    expect(result).toEqual(mockUsers);
  });

  it("throws an error on non-OK response", async () => {
    mockFetch(null, false, 500);

    await expect(apiService.getUsers()).rejects.toThrow("Fetch failed (HTTP 500)");
  });
});

describe("apiService.createUser", () => {
  it("sends a POST request with JSON body", async () => {
    const userData = { name: "Jane Smith", email: "jane@test.com" };
    mockFetch({ id: 11, ...userData });

    await apiService.createUser(userData);

    expect(fetch).toHaveBeenCalledWith(`${API_BASE_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
  });

  it("returns the created user data", async () => {
    const userData = { name: "Jane" };
    mockFetch({ id: 11, ...userData });

    const result = await apiService.createUser(userData);
    expect(result.id).toBe(11);
  });

  it("throws on failure", async () => {
    mockFetch(null, false, 400);

    await expect(apiService.createUser({})).rejects.toThrow("Create failed (HTTP 400)");
  });
});

describe("apiService.updateUser", () => {
  it("sends a PUT request to the correct user endpoint", async () => {
    const userData = { name: "Updated Name" };
    mockFetch({ id: 5, ...userData });

    await apiService.updateUser(5, userData);

    expect(fetch).toHaveBeenCalledWith(`${API_BASE_URL}/users/5`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
  });

  it("throws on failure", async () => {
    mockFetch(null, false, 404);

    await expect(apiService.updateUser(999, {})).rejects.toThrow("Update failed (HTTP 404)");
  });
});

describe("apiService.deleteUser", () => {
  it("sends a DELETE request to the correct user endpoint", async () => {
    mockFetch(null, true, 200);

    const result = await apiService.deleteUser(3);

    expect(fetch).toHaveBeenCalledWith(`${API_BASE_URL}/users/3`, {
      method: "DELETE",
    });
    expect(result).toBe(true);
  });

  it("throws on failure", async () => {
    mockFetch(null, false, 500);

    await expect(apiService.deleteUser(3)).rejects.toThrow("Delete failed (HTTP 500)");
  });
});
