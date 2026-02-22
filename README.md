# 2Cents

## App Summary

2Cents is a personal finance web application that helps users understand and improve their spending and savings habits. The primary user is someone who wants to track income and expenses, set budget goals, and get simple, personalized financial guidance. The app solves the problem of fragmented financial awareness by providing a single place to enter income and fixed costs (rent, car payment, groceries, etc.), view spending and savings trends, and chat with an in-app advisor for tips. Users register or log in, complete an onboarding survey with their financial profile, and then access a dashboard with income/expense stats, reports with charts, and an update-info flow to keep their data current. All of this is backed by a database so that profile and budget data persist across sessions.

## Tech Stack

| Layer | Technologies |
|-------|---------------|
| **Frontend** | React 18, TypeScript, Vite, React Router, TanStack Query, Tailwind CSS, shadcn/ui (Radix), Recharts |
| **Backend** | Node.js, Express 4, ES modules |
| **Database** | PostgreSQL (database name: `twocents`) |
| **Authentication** | JWT (jsonwebtoken), bcrypt for password hashing; token stored in frontend `localStorage` and sent in `Authorization` header |
| **External services / APIs** | None; Google Fonts loaded from the frontend for typography |

## Architecture Diagram

```mermaid
flowchart LR
    subgraph User
        U[User / Browser]
    end

    subgraph Frontend["Frontend (React)"]
        FE[Vite dev server\nlocalhost:8080/8082]
    end

    subgraph Backend["Backend (Express)"]
        API[REST API\nlocalhost:3000]
    end

    subgraph Data["Data Layer"]
        DB[(PostgreSQL\ntwocents)]
    end

    U -->|"1. HTTP (fetch)"| FE
    FE -->|"2. API requests\n(JSON, JWT)"| API
    API -->|"3. SQL (pg driver)"| DB
    DB -->|"4. Rows"| API
    API -->|"5. JSON response"| FE
    FE -->|"6. Rendered UI"| U
```

- **User** interacts with the **Frontend** in the browser.
- **Frontend** sends HTTP requests (e.g. login, profile, dashboard) to the **Backend** with optional JWT in `Authorization`.
- **Backend** talks to **PostgreSQL** via the `pg` driver; runs `schema.sql` / `seed.sql` for structure and sample data.
- **Backend** returns JSON; **Frontend** updates the UI and stores the token for subsequent requests.

## Prerequisites

- **Node.js** (LTS recommended, e.g. 18 or 20)  
  - Install: [https://nodejs.org/](https://nodejs.org/) or [nvm](https://github.com/nvm-sh/nvm#installing-and-updating)  
  - Verify: `node -v` and `npm -v`

- **PostgreSQL**  
  - Install: [https://www.postgresql.org/download/](https://www.postgresql.org/download/)  
  - Verify: `psql --version`

- **psql in PATH** (so you can run `psql` from a terminal)  
  - Usually included with PostgreSQL; add the `bin` directory to your system PATH if needed.

## Installation and Setup

1. **Clone the repository and go to the project root**
   ```bash
   git clone <YOUR_GIT_URL>
   cd 2cents
   ```

2. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   cd ..
   ```

4. **Create the PostgreSQL database**
   ```bash
   psql -U postgres -c "CREATE DATABASE twocents;"
   ```
   (Use your PostgreSQL username if different; you may be prompted for a password.)

5. **Run the schema and seed**
   ```bash
   psql -U postgres -d twocents -f db/schema.sql
   psql -U postgres -d twocents -f db/seed.sql
   ```
   On Windows with password `admin`:  
   `$env:PGPASSWORD="admin"; psql -U postgres -d twocents -f db/schema.sql`  
   then the same for `db/seed.sql`.

6. **Configure environment variables**
   - **Backend:** Copy `backend/.env.example` to `backend/.env`. Set at least:
     - `DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/twocents?sslmode=disable` (replace USER and PASSWORD).
     - `JWT_SECRET` (any long random string for local dev).
     - `CORS_ORIGIN` to include your frontend origin (e.g. `http://localhost:8080,http://localhost:8082`).
   - **Frontend (optional):** Copy `frontend/.env.example` to `frontend/.env` and set `VITE_API_URL=http://localhost:3000` if your API runs elsewhere.

## Running the Application

1. **Start the backend**
   ```bash
   cd backend
   npm run dev
   ```
   Leave this running. You should see “Server running at http://localhost:3000” and “Database: connected to twocents.”

2. **Start the frontend**
   In a second terminal:
   ```bash
   cd frontend
   npm run dev
   ```
   Note the URL (e.g. `http://localhost:8080` or `http://localhost:8082`).

3. **Open the app**
   In your browser, go to the URL shown by the frontend (e.g. `http://localhost:8082`).

## Verifying the Vertical Slice

This demonstrates **one button that updates the database** → server returns updated value → UI shows it → **persists after refresh** (full vertical slice from UI to DB).

1. **Trigger the feature**
   - Open the app in the browser.
   - Click **Sign In** and log in with a seed user, e.g.:
     - Email: `alex.smith@example.com`
     - Password: `password`
   - Go to **Update Financial Info** (sidebar or nav), change a field (e.g. **Monthly Income**), then click **Save Changes**. You should see a “Saved!” confirmation.

2. **Confirm the backend and database were used**
   - The UI should show the updated value. In the backend terminal you should see no errors; the update hit `PUT /api/me`, which wrote to **Profile** and **MonthlyBudget** (and **Savings** if changed).
   - To confirm the row in the database, run:
     ```bash
     psql -U postgres -d twocents -c "SELECT firstname, lastname, email FROM profile;"
     ```
     (Table and column names may be lowercased depending on your PostgreSQL setup; adjust if you get "relation does not exist".)

3. **Verify persistence after refresh**
   - Refresh the page (F5 or Ctrl+R). You should still be logged in and see the **same updated values** (e.g. income on the dashboard or on Update Info), because the app loads profile from the database via `GET /api/me`.
