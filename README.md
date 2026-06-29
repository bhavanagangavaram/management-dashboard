# User Management Dashboard

A responsive single-page web application for managing users with full CRUD functionality, built with **React 19**, **Vite**, and **TailwindCSS v3**.

The app fetches user data from [JSONPlaceholder](https://jsonplaceholder.typicode.com/users) and provides a polished UI for viewing, adding, editing, and deleting users — complete with search, column filters, sorting, and pagination.

---

## Features

- **View Users** — Fetches and displays all users in a sortable, paginated table
- **Add User** — Modal form with client-side validation; POSTs to the API
- **Edit User** — Pre-filled form modal; PUTs updated data to the API
- **Delete User** — Confirmation dialog; sends DELETE request to the API
- **Search** — Global search across all visible fields (name, email, department, ID)
- **Column Filters** — Filter popup for first name, last name, email, and department
- **Sorting** — Click any column header to sort ascending/descending
- **Pagination** — Configurable page sizes (10, 25, 50, 100) with full navigation controls
- **Responsive Design** — Adapts from mobile to desktop breakpoints
- **Toast Notifications** — Success/error feedback with auto-dismiss
- **Loading Skeletons** — Animated placeholders while data loads
- **Accessibility** — ARIA labels, roles, keyboard navigation (Escape to close modals)

---

## Tech Stack

| Layer      | Technology                              |
|------------|-----------------------------------------|
| Framework  | React 19                                |
| Build Tool | Vite 8                                  |
| Styling    | TailwindCSS 3                           |
| HTTP       | Fetch API (native)                      |
| Testing    | Vitest + React Testing Library          |
| API        | JSONPlaceholder (mock REST API)         |

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd management-dashboard

# Install dependencies
npm install
```

### Development

```bash
# Start the dev server (default: http://localhost:5173)
npm run dev
```

### Production Build

```bash
# Build for production
npm run build

# Preview the production build
npm run preview
```

### Testing

```bash
# Run all tests once
npm test

# Run tests in watch mode (re-runs on file changes)
npm run test:watch
```

---

## Project Structure

```
src/
├── main.jsx                        # React entry point
├── App.jsx                         # Root component
├── index.css                       # Tailwind directives & global styles
│
├── constants/
│   └── index.js                    # API URL, colors, page sizes, table columns
│
├── utils/
│   ├── helpers.js                  # Data transformation & hashing utilities
│   └── validation.js               # Form field definitions & validators
│
├── services/
│   └── apiService.js               # All HTTP calls to JSONPlaceholder
│
├── hooks/
│   └── useToast.js                 # Toast notification state management
│
├── components/
│   ├── Toast.jsx                   # Notification bar (success/error)
│   ├── UserAvatar.jsx              # Coloured initials avatar circle
│   ├── SortArrow.jsx               # Column sort direction indicator
│   ├── SkeletonRow.jsx             # Loading placeholder row
│   ├── Pagination.jsx              # Page navigation controls
│   ├── FilterModal.jsx             # Column filter popup
│   ├── UserFormModal.jsx           # Add/Edit user form
│   └── DeleteModal.jsx             # Delete confirmation dialog
│
├── pages/
│   └── UserManagementDashboard.jsx # Main dashboard (state orchestrator)
│
├── test/
│   └── setup.js                    # Vitest global setup (jest-dom matchers)
│
└── __tests__/
    ├── utils/
    │   ├── helpers.test.js          # 13 tests
    │   └── validation.test.js       # 15 tests
    ├── services/
    │   └── apiService.test.js       # 9 tests
    └── components/
        ├── Toast.test.jsx           # 5 tests
        ├── Pagination.test.jsx      # 7 tests
        ├── UserFormModal.test.jsx   # 8 tests
        ├── DeleteModal.test.jsx     # 5 tests
        └── FilterModal.test.jsx     # 5 tests
```

---

## Assumptions

1. **JSONPlaceholder is a mock API.** It returns 10 seed users from `GET /users`. POST, PUT, and DELETE requests are acknowledged with success responses but do not persist changes on the server. All mutations are reflected only in client-side state.

2. **Duplicate ID workaround.** JSONPlaceholder's POST endpoint always returns `{ id: 11 }` regardless of how many users are created. To avoid duplicate React keys and data conflicts, we generate unique client-side IDs (starting from 1001) for newly added users.

3. **Department data source.** The API does not have a dedicated `department` field. We use `user.company.name` as the department, which is a reasonable mapping for this demo.

4. **Client-side data processing.** Search, filtering, sorting, and pagination all run client-side since JSONPlaceholder does not support query parameters for these operations.

5. **Email validation.** We use a simple regex (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`) for email validation. A production application would use a dedicated validation library or server-side verification.

6. **No authentication.** The application does not implement user authentication or authorisation, as it was not part of the requirements.

7. **Browser support.** The app targets modern evergreen browsers (Chrome, Firefox, Safari, Edge). No polyfills are included for legacy browsers.

---

## API Endpoints Used

| Method   | Endpoint          | Purpose            |
|----------|-------------------|---------------------|
| `GET`    | `/users`          | Fetch all users     |
| `POST`   | `/users`          | Create a new user   |
| `PUT`    | `/users/:id`      | Update a user       |
| `DELETE` | `/users/:id`      | Delete a user       |

All endpoints are relative to `https://jsonplaceholder.typicode.com`.

---

## License

This project is for educational/demonstration purposes.
