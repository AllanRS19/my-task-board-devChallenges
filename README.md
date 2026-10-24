# My Task Board

A full stack task board app where users can create boards and manage tasks inside them. Built as a [devChallenges](https://devchallenges.io) project, with a React 19 frontend and a REST API built with Express 5, Prisma, and PostgreSQL.

**Live demo:** https://my-task-board-dev-challenges.vercel.app
**API:** https://my-task-board-devchallenges.onrender.com

> **Note:** the API runs on a free Render instance that goes to sleep after a period of inactivity. The first request can take up to about a minute while it wakes up. If the first attempt fails, try again after a few seconds.

![App screenshot](./docs/screenshot.png)
<!-- Add a screenshot of the board and, if possible, a short GIF creating and editing a task -->

## Features

- Sign up, sign in, sign out, and session check, with JWT authentication stored in an HTTP-only cookie.
- New accounts start with a default board and sample tasks.
- Create, view, update, and delete boards (title and optional description).
- Create, update, and delete tasks inside a board, each with a name, optional description, icon (Dev, Chat, Coffee, Gym, Books, Clock), and status (To do, In progress, Completed, Won't do).
- Task names are unique within a board.
- Server state managed with TanStack Query; forms built with React Hook Form and Zod.
- Responsive UI built with Tailwind CSS and shadcn/ui components.

## Security

- Passwords are hashed with bcrypt.
- The JWT is stored in an HTTP-only cookie, so it is not accessible from JavaScript.
- Every board and task query is scoped to the authenticated user, so users cannot read or modify each other's data.
- All request bodies are validated with Zod, and unknown fields are discarded.
- Sign-in responds with the same message for unknown emails and wrong passwords, and compares against a dummy hash to keep response times similar.
- CORS only allows the configured frontend origin.

## Tech Stack

| Area | Tools |
| --- | --- |
| Frontend | React 19, TypeScript, Vite, React Router 7 |
| UI | Tailwind CSS 4, shadcn/ui, Radix UI, lucide-react |
| Data and forms | TanStack Query, React Hook Form, Zod |
| Backend | Node.js, Express 5, TypeScript |
| Database | PostgreSQL with Prisma ORM (`@prisma/adapter-pg`) |
| Auth and validation | JSON Web Tokens, bcryptjs, cookie-parser, Zod |
| Tooling | Bun, tsup, ESLint |
| Deployment | Vercel (frontend), Render (backend) |

## Architecture

```
Browser ──> Vercel (React app + /api rewrite) ──> Render (Express API) ──> PostgreSQL
```

The frontend calls the API through relative `/api/v1` URLs. In production, Vercel rewrites `/api/*` to the Render backend; in development, Vite proxies it to the local server. This way the browser only talks to one domain, so the auth cookie is first-party and is not blocked by browsers that restrict third-party cookies.

## Data Model

```
User 1 ──── * Board 1 ──── * Task
```

- **User:** name, email (unique), hashed password.
- **Board:** title, optional description, owner. Deleted together with its owner.
- **Task:** name, optional description, status, icon, board. Deleted together with its board.

## Project Structure

```
backend/    REST API (Express + Prisma)
frontend/   Client application (React + Vite)
```

## API Endpoints

All routes are prefixed with `/api/v1` (set by the `API_ROUTE` variable). Board and task routes require authentication.

| Method | Endpoint | Description | Auth |
| --- | --- | --- | --- |
| GET | `/health` | Health check | No |
| POST | `/auth/sign-up` | Create a new account | No |
| POST | `/auth/sign-in` | Sign in | No |
| POST | `/auth/sign-out` | Sign out | No |
| GET | `/auth/me` | Get the current user | Yes |
| GET | `/boards` | List the user's boards | Yes |
| GET | `/boards/:id` | Get a board with its tasks | Yes |
| POST | `/boards` | Create a board | Yes |
| PATCH | `/boards/:id` | Update a board | Yes |
| DELETE | `/boards/:id` | Delete a board | Yes |
| POST | `/tasks/:boardId` | Create a task in a board | Yes |
| PATCH | `/tasks/:id` | Update a task | Yes |
| DELETE | `/tasks/:id` | Delete a task | Yes |

## Getting Started

**Prerequisites:** [Git](https://git-scm.com/), [Bun](https://bun.sh), and a PostgreSQL database (local or hosted).

```bash
git clone https://github.com/AllanRS19/my-task-board-devChallenges.git
cd my-task-board-devChallenges
```

### Backend

```bash
cd backend
bun install
```

Create a `.env` file in `backend/` (see `.env.example`):

```env
PORT=5500
API_ROUTE=/api/v1
FRONTEND_URL=http://localhost:5173
DATABASE_URL=
JWT_SECRET=
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

Apply the database migrations and start the server:

```bash
bunx prisma migrate dev
bun run dev
```

The API runs at [http://localhost:5500](http://localhost:5500).

### Frontend

```bash
cd frontend
bun install
bun run dev
```

Open [http://localhost:5173](http://localhost:5173). Vite proxies `/api` requests to the backend on port 5500, so the frontend needs no environment variables.

## Scripts

**Backend**

| Command | Description |
| --- | --- |
| `bun run dev` | Start the server in watch mode |
| `bun run build` | Bundle the server with tsup |
| `bun run start` | Run the production build with Node |

**Frontend**

| Command | Description |
| --- | --- |
| `bun run dev` | Start the Vite dev server |
| `bun run build` | Type-check and create a production build |
| `bun run lint` | Lint the code with ESLint |
| `bun run preview` | Preview the production build |

## Deployment

- **Frontend (Vercel):** set the root directory to `frontend`. The `vercel.json` file rewrites `/api/*` to the Render backend and serves `index.html` for client-side routes.
- **Backend (Render):** set the root directory to `backend`.
  - Build command: `bun install --frozen-lockfile && bun run build`. It installs the exact versions from `bun.lock`, and `postinstall` generates the Prisma client.
  - Start command: `bun run start`.
  - Environment variables: the ones listed above, with `NODE_ENV=production`. `FRONTEND_URL` must match the Vercel URL exactly, without a trailing slash.
  - Apply migrations to the production database with `bunx prisma migrate deploy`.

## Author

**Allan Romero Solís** — [LinkedIn](https://www.linkedin.com/in/allan-romero/) · [Portfolio](https://allanromero.dev) · [GitHub](https://github.com/AllanRS19)