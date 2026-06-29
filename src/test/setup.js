/* ============================================================
 * test/setup.js — Global test setup
 *
 * Extends Vitest's expect with jest-dom matchers like
 * toBeInTheDocument(), toHaveTextContent(), etc.
 * This file runs before every test file (configured in
 * vite.config.js → test.setupFiles).
 * ============================================================ */

import "@testing-library/jest-dom";
