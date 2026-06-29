/* ============================================================
 * hooks/useToast.js
 *
 * Custom React hook encapsulating toast notification state.
 * Extracting this from the main dashboard keeps the component
 * focused on its core responsibility (user CRUD orchestration)
 * and makes the toast logic independently testable.
 * ============================================================ */

import { useState, useCallback, useRef } from "react";

/** Duration (ms) before a toast auto-dismisses. */
const AUTO_DISMISS_MS = 4000;

/**
 * Manage a list of toast notifications with auto-dismiss.
 *
 * @returns {{
 *   toasts: Array<{ id: number, message: string, type: string }>,
 *   addToast: (message: string, type?: string) => void,
 *   dismissToast: (id: number) => void
 * }}
 */
export const useToast = () => {
  const idRef = useRef(0);
  const [toasts, setToasts] = useState([]);
  const timersRef = useRef({});

  /**
   * Remove a specific toast by its unique ID.
   * Also clears its auto-dismiss timer to prevent memory leaks.
   */
  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    // Clean up the auto-dismiss timeout if it hasn't fired yet
    if (timersRef.current[id]) {
      clearTimeout(timersRef.current[id]);
      delete timersRef.current[id];
    }
  }, []);

  /**
   * Push a new toast onto the stack. It will auto-dismiss
   * after AUTO_DISMISS_MS unless manually dismissed first.
   *
   * @param {string} message - Text to display in the toast.
   * @param {string} [type="success"] - "success" or "error".
   */
  const addToast = useCallback((message, type = "success") => {
    const id = ++idRef.current;
    setToasts((prev) => [...prev, { id, message, type }]);

    // Schedule auto-dismiss and store the timer ID for cleanup
    timersRef.current[id] = setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
      delete timersRef.current[id];
    }, AUTO_DISMISS_MS);
  }, []);

  return { toasts, addToast, dismissToast };
};
