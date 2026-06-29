/* ============================================================
 * __tests__/components/FilterModal.test.jsx
 *
 * Tests for the filter popup modal:
 *   - Renders all four filter fields
 *   - Calls onApply with the correct filter values
 *   - Clears all fields when "Clear All" is clicked
 *   - Calls onClose when close button is clicked
 * ============================================================ */

import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FilterModal from "../../components/FilterModal";

const emptyFilters = {
  firstName: "",
  lastName: "",
  email: "",
  department: "",
};

const defaultProps = {
  filters: emptyFilters,
  onApply: vi.fn(),
  onClose: vi.fn(),
};

describe("FilterModal", () => {
  it("renders the 'Filter Users' heading", () => {
    render(<FilterModal {...defaultProps} />);
    expect(screen.getByText("Filter Users")).toBeInTheDocument();
  });

  it("renders input fields for all four filters", () => {
    render(<FilterModal {...defaultProps} />);
    expect(screen.getByPlaceholderText("Filter by first name…")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Filter by last name…")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Filter by email…")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Filter by department…")).toBeInTheDocument();
  });

  it("calls onApply with typed filter values when Apply is clicked", async () => {
    const user = userEvent.setup();
    const onApply = vi.fn();
    render(<FilterModal {...defaultProps} onApply={onApply} />);

    await user.type(screen.getByPlaceholderText("Filter by first name…"), "Jane");
    await user.type(screen.getByPlaceholderText("Filter by department…"), "Engineering");

    await user.click(screen.getByText("Apply"));

    expect(onApply).toHaveBeenCalledWith({
      firstName: "Jane",
      lastName: "",
      email: "",
      department: "Engineering",
    });
  });

  it("clears all filter inputs when 'Clear All' is clicked", async () => {
    const user = userEvent.setup();
    const filledFilters = {
      firstName: "Jane",
      lastName: "Smith",
      email: "jane@test.com",
      department: "Engineering",
    };
    render(<FilterModal {...defaultProps} filters={filledFilters} />);

    await user.click(screen.getByText("Clear All"));

    // All inputs should now be empty
    expect(screen.getByPlaceholderText("Filter by first name…")).toHaveValue("");
    expect(screen.getByPlaceholderText("Filter by last name…")).toHaveValue("");
    expect(screen.getByPlaceholderText("Filter by email…")).toHaveValue("");
    expect(screen.getByPlaceholderText("Filter by department…")).toHaveValue("");
  });

  it("calls onClose when close button is clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<FilterModal {...defaultProps} onClose={onClose} />);

    await user.click(screen.getByLabelText("Close filter modal"));
    expect(onClose).toHaveBeenCalled();
  });
});
