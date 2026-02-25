# API Reference

The Research Intelligence Dashboard provides a RESTful API for managing Projects, Tasks, and Experiments.
All requests should be prefixed with `/api`.

## Projects

### `GET /api/projects`
List all projects, including a calculated `task_count` for each project.
- **Response**: `200 OK` (Array of Project objects)

### `POST /api/projects`
Create a new project.
- **Body**:
  - `name` (String, required): Project name
  - `description` (String, optional): Project description
  - `color` (String, optional): Hex color code
- **Response**: `201 Created` (Project object)

### `PUT /api/projects/:id`
Update a project.
- **Body**: Any of `name`, `description`, `color`
- **Response**: `200 OK` (Updated Project object)

### `DELETE /api/projects/:id`
Delete a project and all associated tasks and experiments.
- **Response**: `204 No Content`

---

## Tasks

### `GET /api/projects/:id/tasks`
List all tasks belonging to a specific project.
- **URL Params**: `id` = Project ID
- **Response**: `200 OK` (Array of Task objects)

### `POST /api/tasks`
Create a new task.
- **Body**:
  - `project_id` (Integer, required): ID of the parent project
  - `title` (String, required): Task title
  - `description` (String, optional): Task description
  - `status` (String, optional): 'todo', 'in_progress', 'done' (Default: 'todo')
  - `priority` (String, optional): 'low', 'medium', 'high' (Default: 'medium')
  - `due_date` (String, optional): YYYY-MM-DD
- **Response**: `201 Created` (Task object)

### `PUT /api/tasks/:id`
Update a task.
- **Body**: Any of `title`, `description`, `status`, `priority`, `due_date`, `project_id`
- **Response**: `200 OK` (Updated Task object)

### `DELETE /api/tasks/:id`
Delete a task.
- **Response**: `204 No Content`

---

## Experiments

### `GET /api/projects/:id/experiments`
List all experiments belonging to a specific project.
- **URL Params**: `id` = Project ID
- **Response**: `200 OK` (Array of Experiment objects)

### `GET /api/experiments`
List all experiments across all projects.
- **Response**: `200 OK` (Array of Experiment objects)

### `GET /api/experiments/:id`
Get a specific experiment by ID.
- **Response**: `200 OK` (Experiment object) | `404 Not Found`

### `POST /api/experiments`
Create a new experiment.
- **Body**:
  - `project_id` (Integer, required): ID of the parent project
  - `experiment_id` (String, optional): Custom ID/Identifier
  - `date` (String, optional): YYYY-MM-DD
  - `objective` (String, optional)
  - `samples` (String, optional)
  - `reagents` (String, optional)
  - `protocol_version` (String, optional)
  - `observations` (String, optional)
  - `result` (String, optional)
  - `conclusion` (String, optional)
  - `next_step` (String, optional)
  - `raw_data_path` (String, optional)
- **Response**: `201 Created` (Experiment object)

### `PUT /api/experiments/:id`
Update an experiment.
- **Body**: Any fields from the POST request.
- **Response**: `200 OK` (Updated Experiment object)

### `DELETE /api/experiments/:id`
Delete an experiment.
- **Response**: `204 No Content`
