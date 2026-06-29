/* ============================================================
 * App.jsx — Root application component
 *
 * Renders the UserManagementDashboard as the single page.
 * In a multi-page app this would include a router; for this
 * single-page demo it simply wraps the dashboard.
 * ============================================================ */

import React from "react";
import UserManagementDashboard from "./pages/UserManagementDashboard";

/**
 * Root component rendered by main.jsx.
 * Acts as the composition root — if additional pages or
 * providers (e.g. theme, auth) are needed, add them here.
 */
function App() {
  return <UserManagementDashboard />;
}

export default App;
