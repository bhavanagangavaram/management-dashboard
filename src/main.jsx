/* ============================================================
 * main.jsx — Application entry point
 *
 * Mounts the React app into the DOM element with id "root"
 * defined in index.html. Imports global CSS (which includes
 * TailwindCSS directives).
 * ============================================================ */

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

console.log("Deployed with fix for ID > 10!");
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
