# LostNFound

> Virtual lost-and-found office — student monorepo project.

## Repository Structure

```
lost-n-found/
├── apps/
│   ├── web/          # Next.js 16 · TypeScript · Tailwind CSS  (port 3000)
│   └── api/          # ASP.NET Core 10 Web API · EF Core · PostgreSQL  (port 8080)
├── packages/
│   └── api-client/   # Generated TypeScript client from OpenAPI schema
├── infra/
│   └── docker-compose.yml   # postgis/postgis:17-3.5 + API container
├── .github/
│   └── workflows/ci.yml     # Lint + build on PR and push to main
├── pnpm-workspace.yaml
└── README.md
```
---

## Prerequisites

| Tool                    | Minimum version | Notes |
|-------------------------|-----------------|-------|
| Node.js                 | 24              | |
| pnpm                    | 9               | |
| .NET SDK                | 10              | |
| Docker + Docker Compose | recent stable   | |
| Java                    | 11              | Only needed to regenerate API client |

---

## Local Development — Quick Start

### 1. Clone & install JS dependencies

```bash
git clone <repo-url> lost-n-found
cd lost-n-found
pnpm install          # installs apps/web deps; also creates pnpm-lock.yaml
```

### 2. Start PostgreSQL + API (Docker)

```bash
cd infra
docker compose up --build
```

What this starts:

| Service | URL |
|---------|-----|
| PostgreSQL | `localhost:5432` |
| ASP.NET Core API | `http://localhost:8080` |
| Swagger UI | `http://localhost:8080/swagger` |
| Health endpoint | `http://localhost:8080/health` |

The API automatically applies EF Core migrations and seeds **3 sample items** on first start.

### 3. Start the frontend

```bash
# In a new terminal, from the repo root:
cp apps/web/.env.example apps/web/.env.local
pnpm dev
```

Frontend: **http://localhost:3000**

---

## Environment Variables

### Frontend — `apps/web/.env.local`

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8080` | Backend base URL |

### Backend — environment / `appsettings.json`

| Variable | Default | Description |
|----------|---------|-------------|
| `ConnectionStrings__Default` | `Host=localhost;Port=5432;Database=lostnfound;Username=postgres;Password=postgres` | PostgreSQL DSN |
| `ASPNETCORE_ENVIRONMENT` | `Development` | Controls Swagger visibility and log levels |

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | Returns `{ status, timestamp }` |
| `POST` | `/api/auth/register` | Registers a new user |
| `POST` | `/api/auth/login` | Validates credentials and returns a JWT access token |
| `GET` | `/api/auth/me` | Checks that the bearer token works and returns the current user |
| `GET` | `/api/items` | Returns all items, newest first |
| `POST` | `/api/items` | Creates a new item |

### POST /api/items — request body

```json
{
  "title": "Blue Backpack",
  "type": "lost",
  "description": "Left near the library.",
  "latitude": 52.2297,
  "longitude": 21.0122
}
```

`type` must be `"lost"` or `"found"`. `description`, `latitude`, `longitude` are optional.

---

## API Client (`packages/api-client`)

A shared TypeScript client generated from the backend's OpenAPI schema. Used by `apps/web` to call the API with typed methods instead of raw `fetch()`.

**How it works:**

1. `dotnet build apps/api` produces `apps/api/openapi/openapi.json` (gitignored build artifact)
2. `pnpm generate:api-client` runs OpenAPI Generator to produce TypeScript code in `packages/api-client/src/generated/`
3. The generated code **is committed** so frontend devs don't need Java or .NET SDK
4. `apps/web` imports from `@lost-n-found/api-client` via pnpm workspace

**Regenerating after API changes:**

```bash
dotnet build apps/api                  # regenerate OpenAPI schema
pnpm generate:api-client               # regenerate TypeScript client
```

---

## Common Commands

### Frontend

```bash
pnpm dev                    # dev server  → http://localhost:3000
pnpm build                  # production build
pnpm lint                   # ESLint
pnpm generate:api-client    # regenerate API client from OpenAPI schema

# with workspace filter (from repo root):
pnpm --filter web dev
pnpm --filter web build
pnpm --filter web lint
```

### Backend

```bash
cd apps/api

dotnet run                  # run locally (needs Postgres on localhost:5432)
dotnet build                # build only (also generates openapi/openapi.json)
dotnet build -c Release     # release build

# EF Core migrations
dotnet tool install -g dotnet-ef          # once, if not already installed

dotnet ef migrations add <Name>           # generate a new migration
dotnet ef database update                 # apply pending migrations locally

# Regenerate the initial migration from scratch (if needed):
dotnet ef migrations remove
dotnet ef migrations add InitialCreate
dotnet ef database update
```

### Docker

```bash
cd infra
docker compose up --build       # (re)build & start Postgres + API
docker compose up -d            # start in background
docker compose logs -f api      # tail API logs
docker compose down             # stop containers
docker compose down -v          # stop + remove volumes (full DB reset)
```

---

## Database Schema

**Table: `Items`**

| Column | Type | Notes |
|--------|------|-------|
| `Id` | `uuid` | Primary key, set client-side |
| `Title` | `text` | Required |
| `Type` | `text` | `"lost"` or `"found"` |
| `Description` | `text` | Nullable |
| `Latitude` | `numeric` | Nullable |
| `Longitude` | `numeric` | Nullable |
| `CreatedAt` | `timestamptz` | UTC, set on creation |

---

## CI

GitHub Actions (`.github/workflows/ci.yml`) runs on every push to `main` and on PRs:

- **Frontend job**: `pnpm install` → `next lint` → `next build`
- **Backend job**: `dotnet restore` → `dotnet build -c Release`

After the initial clone, commit the generated `pnpm-lock.yaml` so CI has a reproducible install:

```bash
pnpm install
git add pnpm-lock.yaml
git commit -m "chore: add pnpm lockfile"
```
## Create an Admin

Create a user through normal registration and promote them to admin directly in the db:

  INSERT INTO "AspNetUserRoles" ("UserId", "RoleId")
  SELECT u."Id", r."Id"
  FROM "AspNetUsers" u
  JOIN "AspNetRoles" r ON r."Name" = 'Admin'
  WHERE u."Email" = 'user@example.com'
  ON CONFLICT DO NOTHING;
