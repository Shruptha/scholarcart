# Architecture Overview

## Tech Stack

- **Frontend**: React 19 (Vite), vanilla CSS
- **Backend**: Node.js, Express.js
- **Database**: SQLite (via `sql.js`)

---

## Frontend Layout

The frontend uses a 3-column layout implemented with CSS Grid and React components:

1. **Sidebar (`Sidebar.jsx`)**: 
   Lists all projects. Allows creating, editing, and deleting projects. Clicking a project updates the central context.
2. **Main List Panel (`TaskList.jsx` & `ExperimentList.jsx`)**:
   Displays the items belonging to the selected project. Uses a tabbed interface (controlled in `App.jsx`) to switch between:
   - **Tasks**: Shows tasks with filtering by status.
   - **Experiments**: Shows a list of experimental records.
3. **Detail Panel (`TaskDetail.jsx` & `ExperimentDetail.jsx`)**:
   Displays the full details and edit form for the currently selected item.

### State Management
State is largely managed in the top-level `App.jsx` component using basic React hooks (`useState`, `useCallback`, `useEffect`). Data is fetched and passed down to children via props, and updates bubble up via callback functions (`onSave`, `onUpdate`, `onDelete`).

### Styling
All styling is done with vanilla CSS (`index.css` and `App.css`), featuring a dark theme, CSS variables for color management, and glassmorphism UI element styles.

---

## Backend Infrastructure

The backend is an Express server running exactly on port `4000`.

- **`index.js`**: Contains the full server implementation, including all routing, db initialization, and query execution.
- **`schema.sql`**: The fundamental schema for setting up the `projects`, `tasks`, and `experiments` tables.

### Persistence Mechanism
It uses `sql.js`, an in-memory WASM-based SQLite driver. To maintain persistent data:
1. On start, the server reads `data.db` into memory from the disk as a buffer.
2. Every time a mutating action occurs (`INSERT`, `UPDATE`, `DELETE`), the `runSql()` helper internally calls `db.export()` and rewrites the `data.db` file to disk synchronously to ensure safety.
