/* ============================================================
 * __tests__/utils/validation.test.js
 *
 * Unit tests for form validation logic:
 *   - Individual field validators (required, min length, email)
 *   - The aggregate validateForm() function
 * ============================================================ */

import { describe, it, expect } from "vitest";
import { FORM_FIELDS, validateForm } from "../../utils/validation";

describe("Individual field validators", () => {
  const getValidator = (key) => FORM_FIELDS.find((f) => f.key === key).validate;

  describe("firstName", () => {
    const validate = getValidator("firstName");

    it("returns 'Required' for empty string", () => {
      expect(validate("")).toBe("Required");
    });

    it("returns 'Required' for whitespace-only string", () => {
      expect(validate("   ")).toBe("Required");
    });

    it("returns 'Min 2 characters' for single character", () => {
      expect(validate("A")).toBe("Min 2 characters");
    });

    it("returns null for valid name", () => {
      expect(validate("Jane")).toBeNull();
    });
  });

  describe("lastName", () => {
    const validate = getValidator("lastName");

    it("returns 'Required' for empty string", () => {
      expect(validate("")).toBe("Required");
    });

    it("returns null for valid last name", () => {
      expect(validate("Smith")).toBeNull();
    });
  });

  describe("email", () => {
    const validate = getValidator("email");

    it("returns 'Required' for empty string", () => {
      expect(validate("")).toBe("Required");
    });

    it("returns 'Invalid email format' for missing @", () => {
      expect(validate("notanemail")).toBe("Invalid email format");
    });

    it("returns 'Invalid email format' for missing domain", () => {
      expect(validate("user@")).toBe("Invalid email format");
    });

    it("returns null for valid email", () => {
      expect(validate("jane@company.com")).toBeNull();
    });
  });

  describe("department", () => {
    const validate = getValidator("department");

    it("returns 'Required' for empty string", () => {
      expect(validate("")).toBe("Required");
    });

    it("returns null for any non-empty string", () => {
      expect(validate("Engineering")).toBeNull();
    });
  });
});

describe("validateForm", () => {
  it("returns empty object when all fields are valid", () => {
    const errors = validateForm({
      firstName: "Jane",
      lastName: "Smith",
      email: "jane@company.com",
      department: "Engineering",
    });

    expect(Object.keys(errors)).toHaveLength(0);
  });

  it("returns errors for all empty fields", () => {
    const errors = validateForm({
      firstName: "",
      lastName: "",
      email: "",
      department: "",
    });

    expect(errors.firstName).toBe("Required");
    expect(errors.lastName).toBe("Required");
    expect(errors.email).toBe("Required");
    expect(errors.department).toBe("Required");
  });

  it("returns error only for invalid field", () => {
    const errors = validateForm({
      firstName: "Jane",
      lastName: "Smith",
      email: "invalid-email",
      department: "Engineering",
    });

    expect(Object.keys(errors)).toHaveLength(1);
    expect(errors.email).toBe("Invalid email format");
  });
});
