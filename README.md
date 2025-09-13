# SetupForMe Frontend (Vite + React + TS)

A lightweight React frontend for SetupForMe. Lets users sign up, log in, manage a list of apps, and generate a PowerShell install script. Includes winget suggestions and a Popular Apps section for one-click adding.

## Tech Stack

- Vite + React + TypeScript
- Axios for API calls
- Context-based auth state

## Features

- Auth pages (login, signup)
- Dashboard for managing apps
- Popular Apps section (developer-focused) – one-click add with Winget IDs
- Winget suggestions: type app name, get suggested Winget IDs from the backend
- Script generation and download

## Prerequisites

- Node.js 18+
- Backend running at <http://localhost:8080> (default)

## Dev Setup

From the `frontend/` folder:

```bash
npm install
npm run dev
```

Open <http://localhost:5173>. Proxy is configured in `vite.config.ts` to forward `/api` to the backend.

## Build

```bash
npm run build
npm run preview
```

## Project Structure

- `src/pages/` – `Login`, `Signup`, `Dashboard`
- `src/components/` – `Modal`, `AppForm`
- `src/hooks/useApps.ts` – data fetching and mutations for apps
- `src/context/AuthContext.tsx` – auth state and actions
- `src/utils/api.ts` – axios instance and API methods

## Winget Suggestions

- As you type the app Name in `AppForm`, suggestions appear if Winget ID is empty.
- Clicking "Use" fills the Winget ID field.
- Backend endpoint used: `GET /api/winget/search?q=<query>`

## Popular Apps

- Curated developer/devops list (VS Code, Git, Docker Desktop, Node.js LTS, Python 3.12, kubectl, Helm, Terraform, Azure CLI, GCloud SDK, etc.).
- Located at the bottom of the Dashboard; click “+ Add” to insert directly.
- Edit the list in `src/pages/Dashboard.tsx` under the `popularApps` array.

## Auth Flow

- On success, token and user are stored in `localStorage`.
- Requests include `Authorization: Bearer <token>` via axios interceptor.
- 401 responses trigger logout and redirect to `/login`.

## Troubleshooting

- If API calls fail with 500, ensure backend is running and DB env is correct.
- 401 on `/api/apps`: token missing/expired – log in again.
- CORS: backend already allows localhost dev origins.
- Proxy: if you changed backend port, update `vite.config.ts`.

## License

MIT (see repository root if present)
