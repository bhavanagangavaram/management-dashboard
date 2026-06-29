/* ============================================================
 * components/UserAvatar.jsx
 *
 * Renders a small coloured circle with the user's initials.
 * The colour is deterministic — derived from the user's ID —
 * so the same user always gets the same avatar shade.
 * ============================================================ */

import React from "react";
import { AVATAR_COLORS } from "../constants";

/**
 * Circular avatar showing the user's initials over a
 * coloured background.
 *
 * @param {Object} props
 * @param {string} props.firstName
 * @param {string} props.lastName
 * @param {number} props.userId - Used to pick a stable colour.
 */
const UserAvatar = ({ firstName, lastName, userId }) => {
  const initials = `${firstName[0] || ""}${lastName[0] || ""}`.toUpperCase();

  return (
    <div
      className={`${
        AVATAR_COLORS[userId % AVATAR_COLORS.length]
      } w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}
      aria-hidden="true"
      title={`${firstName} ${lastName}`}
    >
      {initials || "?"}
    </div>
  );
};

export default UserAvatar;
