# Task Manager

A task management app with a React/Vite frontend and an Express API backend.

## Project Structure

```text
.
|-- backend/
|   |-- src/
|   |   |-- app.js
|   |   |-- server.js
|   |   |-- controllers/
|   |   |   `-- taskController.js
|   |   |-- docs/
|   |   |   `-- swagger.js
|   |   |-- middleware/
|   |   |   `-- errorHandler.js
|   |   |-- routes/
|   |   |   `-- taskRoute.js
|   |   `-- services/
|   |       `-- taskService.js
|   `-- package.json
|-- frontend/
|   |-- public/
|   |-- src/
|   |   |-- assets/
|   |   |-- components/
|   |   |-- context/
|   |   |-- hooks/
|   |   |-- pages/
|   |   |-- services/
|   |   |-- styles/
|   |   |-- utils/
|   |   |-- App.jsx
|   |   |-- index.css
|   |   `-- main.jsx
|   |-- .env.example
|   |-- index.html
|   |-- package.json
|   `-- vite.config.js
`-- README.md
```

The backend is organized into route handlers, controllers, services, middleware, and the OpenAPI definition. The frontend contains page-level views, reusable components, hooks, shared task context, API access, utilities, and styles.

## Requirements

- Node.js 20.19+ or 22.12+
- npm

## Setup

Install dependencies separately in each app directory:

```sh
cd backend
npm install
```

In a second command prompt or terminal:

```sh
cd frontend
npm install
```

The frontend defaults to the API at `http://localhost:5000/api`. To configure it explicitly, copy `frontend/.env.example` to `frontend/.env` and adjust `VITE_API_BASE_URL` if needed.

PowerShell:

```powershell
Copy-Item frontend/.env.example frontend/.env
```

macOS/Linux shells:

```sh
cp frontend/.env.example frontend/.env
```

## Run Locally

Start the backend in one terminal:

```sh
cd backend
npm run dev
```

Start the frontend in another terminal:

```sh
cd frontend
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`. The backend listens on `http://localhost:5000` by default.

To run the backend without auto-reload, use `npm start` from `backend`. To create a production frontend build, run `npm run build` from `frontend`.

## Swagger API Documentation

Start the backend, then open [http://localhost:5000/api-docs](http://localhost:5000/api-docs). Swagger UI displays the available endpoints, parameters, request body schemas, example responses, and error responses. The raw OpenAPI JSON document is available at [http://localhost:5000/api-docs.json](http://localhost:5000/api-docs.json).

To call an endpoint from Swagger UI:

1. Expand an endpoint row, such as `GET /api/tasks`.
2. Select **Try it out**.
3. Fill in any parameters or request body. For `POST` and `PUT`, use a JSON body.
4. Select **Execute**. The response status, response body, and generated request are shown below.

No authentication is required. Keep the backend running while using **Try it out**.

### Available Endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/tasks` | List tasks. Optional `search` query searches titles and descriptions without regard to case. |
| `POST` | `/api/tasks` | Create a task. `title` is required; other fields have defaults. |
| `GET` | `/api/tasks/{id}` | Get one task by its ID. |
| `PUT` | `/api/tasks/{id}` | Update one or more task fields. |
| `DELETE` | `/api/tasks/{id}` | Delete a task. |

The API base URL is `http://localhost:5000`; task endpoints use the `/api/tasks` prefix. For example, list tasks at `http://localhost:5000/api/tasks` or search with `http://localhost:5000/api/tasks?search=pricing`.

Example create request body:

```json
{
	"title": "Write documentation",
	"description": "Document the task API",
	"status": "pending",
	"priority": "medium",
	"dueDate": "2026-12-31"
}
```

Valid statuses are `pending`, `in_progress`, and `completed`. Valid priorities are `low`, `medium`, and `high`. The API returns a JSON response with a `success` flag and task data; validation errors include a message and details. Tasks are stored in memory, so they are cleared when the backend restarts.
