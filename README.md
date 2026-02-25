# Scholar Cart

**Track What Matters**

Scholar Cart is a personalized research intelligence dashboard designed for PhD scholars.
It helps track tasks, experiments, research papers, postdoctoral opportunities, conferences, and scientific signals — all in one place.

## Quick Start

### 1. Start the backend
```bash
cd server
npm install   # first time only
npm start     # runs on http://localhost:4000
```

### 2. Start the frontend
```bash
cd client
npm install   # first time only
npm run dev   # runs on http://localhost:5173
```

Open **http://localhost:5173** in your browser.

## Features
- **Global Ingestion Pipeline**: Fetch research papers directly from PubMed and signals from RSS
- **Conferences & Jobs tracker**: Keep track of events and receive reminders for upcoming deadlines
- **Item Tracking**: Save key resources, mark as read, and tag relevance
- **Global Settings Panel**: Easily adjust your query parameters from the UI
- **Project Management**: Create, edit, delete projects with color coding
- **Task Management**: Create, edit, delete tasks with status/priority/due date
- **Experiment Tracking**: Document experiments, methodology, findings, and dates
- **Dynamic 3-column layout**: Unified navigation for both Global features and Project-specific tracking
- **Dark Theme**: Premium dark UI with glassmorphism and smooth transitions

## Documentation
For full API details, architecture overview, and setup instructions, see the [docs](./docs/) directory:
- [API Reference](./docs/api.md)
- [Architecture](./docs/architecture.md)
- [Setup Instructions](./docs/setup.md)

## Tech Stack
- **Frontend**: React (Vite), vanilla CSS
- **Backend**: Express.js, sql.js (pure JS SQLite)
- **Database**: SQLite (persisted to `server/data.db`)

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | List all projects |
| POST | `/api/projects` | Create project |
| PUT | `/api/projects/:id` | Update project |
| DELETE | `/api/projects/:id` | Delete project + tasks + experiments |
| GET | `/api/projects/:id/tasks` | List tasks for project |
| POST | `/api/tasks` | Create task |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |
| GET | `/api/projects/:id/experiments` | List experiments for project |
| POST | `/api/experiments` | Create experiment |
| PUT | `/api/experiments/:id` | Update experiment |
| DELETE | `/api/experiments/:id` | Delete experiment |
