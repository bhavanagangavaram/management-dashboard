/* ============================================================
 * components/SkeletonRow.jsx
 *
 * An animated placeholder row shown in the table body while
 * user data is being fetched. The pulsing bars mimic the
 * shape of real data so the layout doesn't jump when content
 * loads.
 * ============================================================ */

import React from "react";

/**
 * Single skeleton loading row with 6 pulsing bars
 * (matching the 5 data columns + 1 actions column).
 */
const SkeletonRow = () => (
  <tr className="border-b border-slate-100 animate-pulse">
    {[...Array(6)].map((_, i) => (
      <td key={i} className="px-4 py-4">
        {/* Width varies per column to look more natural */}
        <div
          className="h-4 bg-slate-200 rounded"
          style={{ width: `${55 + ((i * 13) % 35)}%` }}
        />
      </td>
    ))}
  </tr>
);

export default SkeletonRow;
