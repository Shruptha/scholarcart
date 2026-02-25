# Setup Instructions

## Prerequisites
- Node.js (v18+ recommended)
- npm

## Running the Application

This is a full-stack application with a React frontend and Node.js backend. Both must be running simultaneously for the app to function properly.

### 1. Start the Backend

Open a new terminal window:
```bash
cd server
npm install    # Installs express, cors, sql.js
npm run dev    # Starts server on http://localhost:4000 with auto-restart
```

The SQLite database will be automatically created at `server/data.db` if it doesn't already exist.

### 2. Start the Frontend

Open a new terminal window:
```bash
cd client
npm install    # Installs React, Vite, and other dependencies
npm run dev    # Starts the dev server on http://localhost:5173
```

### 3. Access the Dashboard
Open your browser and navigate to `http://localhost:5173`.

---

## Data Persistence
The backend uses `sql.js` which is an in-memory database that periodically and manually persists data to the disk at `server/data.db`. Do not delete this file unless you want to reset all data.
