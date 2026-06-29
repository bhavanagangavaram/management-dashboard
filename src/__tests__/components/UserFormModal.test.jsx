/* ============================================================
 * __tests__/components/UserFormModal.test.jsx
 *
 * Tests for the Add/Edit user form modal:
 *   - Renders in "add" mode with empty fields
 *   - Renders in "edit" mode with pre-filled data
 *   - Shows validation errors on empty submit
 *   - Calls onSave with correct data on valid submit
 *   - Calls onClose when Cancel is clicked
 * ============================================================ */

import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import UserFormModal from "../../components/UserFormModal";

const defaultProps = {
  user: null,
  onSave: vi.fn(),
  onClose: vi.fn(),
  isSaving: false,
};

describe("UserFormModal", () => {
  it("renders 'New User' title in add mode", () => {
    render(<UserFormModal {...defaultProps} />);
    expect(screen.getByText("New User")).toBeInTheDocument();
  });

  it("renders 'Edit User' title when a user is provided", () => {
    const user = { id: 1, firstName: "Jane", lastName: "Smith", email: "jane@test.com", department: "Engineering" };
    render(<UserFormModal {...defaultProps} user={user} />);
    expect(screen.getByText("Edit User")).toBeInTheDocument();
  });

  it("pre-fills form fields in edit mode", () => {
    const user = { id: 1, firstName: "Jane", lastName: "Smith", email: "jane@test.com", department: "Engineering" };
    render(<UserFormModal {...defaultProps} user={user} />);

    expect(screen.getByDisplayValue("Jane")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Smith")).toBeInTheDocument();
    expect(screen.getByDisplayValue("jane@test.com")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Engineering")).toBeInTheDocument();
  });

  it("shows validation errors when submitting empty form", async () => {
    const user = userEvent.setup();
    render(<UserFormModal {...defaultProps} />);

    await user.click(screen.getByText("Add User"));

    // All 4 fields should show "Required" errors
    const errorMessages = screen.getAllByText(/Required/);
    expect(errorMessages.length).toBeGreaterThanOrEqual(4);
  });

  it("calls onSave with form data when validation passes", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    render(<UserFormModal {...defaultProps} onSave={onSave} />);

    // Fill in valid data
    await user.type(screen.getByPlaceholderText("e.g. Jane"), "Alice");
    await user.type(screen.getByPlaceholderText("e.g. Smith"), "Wonder");
    await user.type(screen.getByPlaceholderText("e.g. jane@company.com"), "alice@test.com");
    await user.type(screen.getByPlaceholderText("e.g. Engineering"), "Design");

    await user.click(screen.getByText("Add User"));

    expect(onSave).toHaveBeenCalledWith({
      id: undefined,
      firstName: "Alice",
      lastName: "Wonder",
      email: "alice@test.com",
      department: "Design",
    });
  });

  it("calls onClose when Cancel button is clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<UserFormModal {...defaultProps} onClose={onClose} />);

    await user.click(screen.getByText("Cancel"));
    expect(onClose).toHaveBeenCalled();
  });

  it("disables submit button when isSaving is true", () => {
    render(<UserFormModal {...defaultProps} isSaving={true} />);
    expect(screen.getByText("Saving…")).toBeDisabled();
  });

  it("shows 'Save Changes' button text in edit mode", () => {
    const existingUser = { id: 1, firstName: "Jane", lastName: "Doe", email: "j@d.com", department: "QA" };
    render(<UserFormModal {...defaultProps} user={existingUser} />);
    expect(screen.getByText("Save Changes")).toBeInTheDocument();
  });
});
