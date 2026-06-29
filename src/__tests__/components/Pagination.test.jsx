/* ============================================================
 * __tests__/components/Pagination.test.jsx
 *
 * Tests for the Pagination component:
 *   - Displays the correct range label
 *   - Enables/disables navigation buttons correctly
 *   - Fires page change callbacks
 *   - Fires page size change callback
 * ============================================================ */

import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Pagination from "../../components/Pagination";

const defaultProps = {
  total: 50,
  page: 1,
  pageSize: 10,
  onPageChange: vi.fn(),
  onPageSizeChange: vi.fn(),
};

describe("Pagination", () => {
  it("displays the correct range for the first page", () => {
    render(<Pagination {...defaultProps} />);
    expect(screen.getByText("1–10 of 50")).toBeInTheDocument();
  });

  it("displays the correct range for a middle page", () => {
    render(<Pagination {...defaultProps} page={3} />);
    expect(screen.getByText("21–30 of 50")).toBeInTheDocument();
  });

  it("displays the correct range for the last page with partial results", () => {
    render(<Pagination {...defaultProps} total={45} page={5} />);
    expect(screen.getByText("41–45 of 45")).toBeInTheDocument();
  });

  it("displays '0 of 0' when there are no items", () => {
    render(<Pagination {...defaultProps} total={0} />);
    expect(screen.getByText("0 of 0")).toBeInTheDocument();
  });

  it("disables previous/first buttons on the first page", () => {
    render(<Pagination {...defaultProps} page={1} />);
    const firstBtn = screen.getByLabelText("Go to page 1");
    // There are two buttons targeting page 1 (« and the page number button).
    // The « button should be disabled.
    expect(firstBtn).toBeDisabled();
  });

  it("calls onPageChange when a page number is clicked", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<Pagination {...defaultProps} onPageChange={onPageChange} />);

    // Click page 2
    await user.click(screen.getByText("2"));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("calls onPageSizeChange when page size is changed", async () => {
    const user = userEvent.setup();
    const onPageSizeChange = vi.fn();
    render(<Pagination {...defaultProps} onPageSizeChange={onPageSizeChange} />);

    const select = screen.getByLabelText("Rows:");
    await user.selectOptions(select, "25");
    expect(onPageSizeChange).toHaveBeenCalledWith(25);
  });
});
