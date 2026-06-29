/* ============================================================
 * __tests__/components/DeleteModal.test.jsx
 *
 * Tests for the delete confirmation modal:
 *   - Displays the user's name
 *   - Calls onConfirm when Delete is clicked
 *   - Calls onClose when Cancel is clicked
 *   - Disables Delete button when isDeleting is true
 * ============================================================ */

import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DeleteModal from "../../components/DeleteModal";

const mockUser = { firstName: "Jane", lastName: "Smith" };

const defaultProps = {
  user: mockUser,
  onConfirm: vi.fn(),
  onClose: vi.fn(),
  isDeleting: false,
};

describe("DeleteModal", () => {
  it("displays the user's full name in the confirmation message", () => {
    render(<DeleteModal {...defaultProps} />);
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
  });

  it("displays the 'Delete User' heading", () => {
    render(<DeleteModal {...defaultProps} />);
    expect(screen.getByText("Delete User")).toBeInTheDocument();
  });

  it("calls onConfirm when Delete button is clicked", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    render(<DeleteModal {...defaultProps} onConfirm={onConfirm} />);

    await user.click(screen.getByText("Delete"));
    expect(onConfirm).toHaveBeenCalled();
  });

  it("calls onClose when Cancel button is clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<DeleteModal {...defaultProps} onClose={onClose} />);

    await user.click(screen.getByText("Cancel"));
    expect(onClose).toHaveBeenCalled();
  });

  it("disables Delete button and shows 'Deleting…' when isDeleting is true", () => {
    render(<DeleteModal {...defaultProps} isDeleting={true} />);
    const btn = screen.getByText("Deleting…");
    expect(btn).toBeDisabled();
  });
});
