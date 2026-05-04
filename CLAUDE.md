# LostNFound

## Project

Virtual lost-and-found office — a geolocation-based lost & found item tracking system. Student monorepo project.

## Tech Stack

- **Frontend:** Next.js 16, React 19, TypeScript, Mantine UI 8, Tailwind CSS 4, MapLibre GL
- **Backend:** ASP.NET Core 10, Entity Framework Core 10, PostgreSQL 17 + PostGIS
- **Monorepo:** pnpm workspaces
- **API Client:** Auto-generated TypeScript client from OpenAPI schema (`packages/api-client`)
- **File Storage:** S3-compatible (ImageSharp for processing)
- **Auth:** JWT + ASP.NET Identity

## Structure

- `apps/web/` — Next.js frontend (App Router)
- `apps/api/` — ASP.NET Core backend
- `packages/api-client/` — Generated TypeScript API client
- `infra/` — Docker Compose (PostgreSQL + API)

## Code Review Guidelines

When reviewing pull requests:
- Be concise and constructive. This is a student project.
- Focus on: bugs, security issues, logic errors, and performance problems.
- Do NOT nitpick: style, formatting, naming conventions — ESLint and Prettier handle those.
- Do NOT block PRs. Suggest improvements, don't demand them.
- Keep comments short — one or two sentences per issue.
- If everything looks good, say so briefly.
