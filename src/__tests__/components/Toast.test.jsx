/* ============================================================
 * __tests__/components/Toast.test.jsx
 *
 * Tests for the Toast notification component:
 *   - Renders success and error variants
 *   - Displays the correct message text
 *   - Fires the dismiss callback when close is clicked
 * ============================================================ */

import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Toast from "../../components/Toast";

describe("Toast", () => {
  it("renders nothing when toasts array is empty", () => {
    const { container } = render(<Toast toasts={[]} onDismiss={() => {}} />);
    // The container div exists but has no toast children
    expect(container.querySelectorAll("[role='alert']")).toHaveLength(0);
  });

  it("renders a success toast with the correct message", () => {
    const toasts = [{ id: 1, message: "User added!", type: "success" }];
    render(<Toast toasts={toasts} onDismiss={() => {}} />);

    expect(screen.getByText("User added!")).toBeInTheDocument();
    expect(screen.getByText("✓")).toBeInTheDocument();
  });

  it("renders an error toast with the correct message", () => {
    const toasts = [{ id: 1, message: "Something went wrong", type: "error" }];
    render(<Toast toasts={toasts} onDismiss={() => {}} />);

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(screen.getByText("✕")).toBeInTheDocument();
  });

  it("renders multiple toasts simultaneously", () => {
    const toasts = [
      { id: 1, message: "First", type: "success" },
      { id: 2, message: "Second", type: "error" },
    ];
    render(<Toast toasts={toasts} onDismiss={() => {}} />);

    expect(screen.getByText("First")).toBeInTheDocument();
    expect(screen.getByText("Second")).toBeInTheDocument();
  });

  it("calls onDismiss with the correct toast id when close is clicked", async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    const toasts = [{ id: 42, message: "Dismiss me", type: "success" }];

    render(<Toast toasts={toasts} onDismiss={onDismiss} />);

    await user.click(screen.getByLabelText("Dismiss notification"));
    expect(onDismiss).toHaveBeenCalledWith(42);
  });
});
