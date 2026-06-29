/* ============================================================
 * __tests__/utils/helpers.test.js
 *
 * Unit tests for the helper utility functions:
 *   - getColorIndex:   stable string → index hashing
 *   - parseApiUser:    API response → flat UI shape
 *   - formatUserForApi: flat form data → API request shape
 * ============================================================ */

import { describe, it, expect } from "vitest";
import { getColorIndex, parseApiUser, formatUserForApi } from "../../utils/helpers";

describe("getColorIndex", () => {
  it("returns a number within the specified range", () => {
    const index = getColorIndex("Engineering", 8);
    expect(index).toBeGreaterThanOrEqual(0);
    expect(index).toBeLessThan(8);
  });

  it("returns the same index for the same string (deterministic)", () => {
    const first = getColorIndex("Sales", 8);
    const second = getColorIndex("Sales", 8);
    expect(first).toBe(second);
  });

  it("handles empty string without throwing", () => {
    const index = getColorIndex("", 8);
    expect(index).toBeGreaterThanOrEqual(0);
    expect(index).toBeLessThan(8);
  });

  it("handles undefined input gracefully", () => {
    const index = getColorIndex(undefined, 8);
    expect(typeof index).toBe("number");
  });
});

describe("parseApiUser", () => {
  it("splits a full name into firstName and lastName", () => {
    const raw = { id: 1, name: "Jane Smith", email: "jane@test.com", company: { name: "Engineering" } };
    const parsed = parseApiUser(raw);

    expect(parsed.firstName).toBe("Jane");
    expect(parsed.lastName).toBe("Smith");
  });

  it("handles multi-word last names correctly", () => {
    const raw = { id: 2, name: "John Van Der Berg", email: "john@test.com", company: { name: "HR" } };
    const parsed = parseApiUser(raw);

    expect(parsed.firstName).toBe("John");
    expect(parsed.lastName).toBe("Van Der Berg");
  });

  it("handles a single-word name (no last name)", () => {
    const raw = { id: 3, name: "Madonna", email: "m@test.com", company: { name: "Music" } };
    const parsed = parseApiUser(raw);

    expect(parsed.firstName).toBe("Madonna");
    expect(parsed.lastName).toBe("");
  });

  it("defaults department to 'Unknown' when company is missing", () => {
    const raw = { id: 4, name: "Test User", email: "test@test.com" };
    const parsed = parseApiUser(raw);

    expect(parsed.department).toBe("Unknown");
  });

  it("preserves the user ID", () => {
    const raw = { id: 42, name: "Test", email: "t@t.com", company: { name: "QA" } };
    expect(parseApiUser(raw).id).toBe(42);
  });

  it("defaults email to empty string when missing", () => {
    const raw = { id: 5, name: "No Email" };
    expect(parseApiUser(raw).email).toBe("");
  });
});

describe("formatUserForApi", () => {
  it("combines firstName and lastName into a single name field", () => {
    const result = formatUserForApi({
      firstName: "Jane",
      lastName: "Smith",
      email: "jane@test.com",
      department: "Engineering",
    });

    expect(result.name).toBe("Jane Smith");
  });

  it("nests department under company.name", () => {
    const result = formatUserForApi({
      firstName: "A",
      lastName: "B",
      email: "a@b.com",
      department: "Sales",
    });

    expect(result.company).toEqual({ name: "Sales" });
  });

  it("trims whitespace from all fields", () => {
    const result = formatUserForApi({
      firstName: "  Jane  ",
      lastName: "  Smith  ",
      email: "  jane@test.com  ",
      department: "  Engineering  ",
    });

    expect(result.name).toBe("Jane Smith");
    expect(result.email).toBe("jane@test.com");
    expect(result.company.name).toBe("Engineering");
  });
});
