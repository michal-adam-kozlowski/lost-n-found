# CI Automation & Testing Design

## Overview

Three independent additions to the lost-n-found project:

1. **Code review automation** — Claude reviews PRs via GitHub Action
2. **README auto-update** — Claude updates README when relevant changes merge
3. **E2E tests** — Playwright tests covering the main happy path

Each gets its own GitHub Actions workflow file.

---

## 1. Code Review — Claude Code GitHub Action

### File: `.github/workflows/code-review.yml`

**Trigger:** `pull_request` opened/synchronize against `master`

**Action:** Uses `anthropics/claude-code-action@v1` to review the PR diff and post inline comments.

**Configuration:**
- Requires `ANTHROPIC_API_KEY` GitHub secret
- Non-blocking — informational comments only, not a required status check
- Review tone and focus controlled via `CLAUDE.md` in repo root
- Workflow must include `permissions: { contents: read, pull-requests: write }` for the action to post PR comments

### File: `CLAUDE.md`

Root-level file that instructs Claude on project context and review style:
- Include tech stack context: Next.js 16, ASP.NET Core 10, Mantine UI, pnpm monorepo, PostGIS, TypeScript
- Be concise, focus on bugs, security issues, and logic errors
- Don't nitpick style or formatting (ESLint/Prettier handle that)
- Don't block PRs, just suggest improvements
- Student project context — keep feedback constructive and educational

---

## 2. README Auto-Update

### File: `.github/workflows/update-readme.yml`

**Trigger:** `push` to `master` (fires when a PR merges)

**Mechanism:** Uses `anthropics/claude-code-action@v1` with `direct_prompt` mode (not PR review mode). The action runs Claude Code on the repo, which can create a branch, update README.md, and open a PR via `gh` CLI.

**Prompt instructs Claude to:**

1. Read the latest commit diff (`git diff HEAD~1`)
2. Read the current `README.md`
3. Determine if the changes affect anything documented in the README (new endpoints, env vars, setup steps, dependencies, commands)
4. If yes — create a branch, commit README changes, and open a PR using `gh pr create`
5. If nothing README-relevant changed — exit cleanly with no action

**Loop prevention:**
- Workflow has a path filter: `paths-ignore: ['README.md']` — if the only changed file is README.md, the workflow does not run
- Additionally, the workflow skips runs where the commit author is `github-actions[bot]`

**Design decisions:**
- Output is a PR, not a direct commit to master — allows review before merging
- Requires `ANTHROPIC_API_KEY` secret
- Uses `GITHUB_TOKEN` for PR creation — note that PRs created by `GITHUB_TOKEN` will NOT trigger other workflows (so the code review action won't auto-run on README PRs; this is acceptable for a simple README update)

---

## 3. E2E Tests with Playwright

### File: `.github/workflows/e2e.yml`

**Trigger:** `pull_request` against `master`

**Infrastructure:**
- Workflow starts PostgreSQL + API via `docker compose -f infra/docker-compose.yml up -d`
- Builds and starts Next.js in production mode (`pnpm build && pnpm start`) — more stable than dev server for CI
- Creates `.env.local` with `NEXT_PUBLIC_API_URL=http://localhost:8080`
- Waits for API readiness by polling `http://localhost:8080/health` before running tests
- Add a healthcheck to the `api` service in `docker-compose.yml`: `curl -f http://localhost:8080/health`
- Add `concurrency: { group: e2e-${{ github.ref }}, cancel-in-progress: true }` to prevent port conflicts from parallel runs

**Runner setup (matches existing `ci.yml` patterns):**
- `pnpm/action-setup@v4`
- `actions/setup-node@v4` with `node-version: 24` and `cache: pnpm`
- No .NET SDK needed — API runs inside Docker

### Configuration: `apps/web/playwright.config.ts`

- Base URL: `http://localhost:3000`
- Headless Chromium only (keep CI fast)
- Screenshots and traces on failure
- Timeout: 30s per test

### Test directory: `apps/web/e2e/`

**Important: The UI is entirely in Polish.** All selectors must use Polish labels (e.g. "Zarejestruj sie", "Zaloguj sie", "Dodaj ogloszenie") or `data-testid` attributes. Prefer `data-testid` for key interactive elements to decouple tests from UI text.

**Test files:**

#### `auth.spec.ts`
- Navigate to registration page
- Register a new user (unique email per run)
- Verify successful registration — redirects to `/`
- Log in with the new credentials
- Verify authenticated state (user menu visible)

#### `item-crud.spec.ts`
- Log in (use a helper or the auth flow)
- Create a lost item with title, description, **category selection**, and map location
- Verify the item appears in the list
- View item details page
- Delete the item — **click delete button, then confirm in the Mantine modal dialog**
- Verify it's removed
- Note: delete button only appears for the item owner, so the test user must create and then delete their own item

#### `happy-path.spec.ts`
- Full end-to-end: register → login → create item (with category) → view item details → log out
- Skip map tile verification (requires MapTiler API key) — just verify the map component renders
- This is the primary test; the other two provide focused failure messages

### Dependencies to add:
- `@playwright/test` as devDependency in `apps/web`
- Add `test:e2e` script to `apps/web/package.json`
- CI step: `npx playwright install --with-deps chromium` to install browser + system deps

### Files to update:
- `apps/web/.gitignore` — add `test-results/`, `playwright-report/`, `.playwright/`
- `infra/docker-compose.yml` — add healthcheck to `api` service

### CI details:
- Upload Playwright report as artifact on failure
- Use existing `DbSeeder` for category data (runs automatically on API startup)
- No additional seed data needed — tests create their own users and items

---

## Secrets Required

| Secret | Used by | Purpose |
|--------|---------|---------|
| `ANTHROPIC_API_KEY` | code-review, update-readme | Claude API access |

GitHub's built-in `GITHUB_TOKEN` is used for PR comments (code review) and PR creation (README update).

---

## File Summary

| File | Action |
|------|--------|
| `.github/workflows/code-review.yml` | Create |
| `.github/workflows/update-readme.yml` | Create |
| `.github/workflows/e2e.yml` | Create |
| `CLAUDE.md` | Create |
| `apps/web/playwright.config.ts` | Create |
| `apps/web/e2e/auth.spec.ts` | Create |
| `apps/web/e2e/item-crud.spec.ts` | Create |
| `apps/web/e2e/happy-path.spec.ts` | Create |
| `apps/web/package.json` | Modify (add Playwright dep + script) |
| `apps/web/.gitignore` | Modify (add Playwright artifacts) |
| `infra/docker-compose.yml` | Modify (add API healthcheck) |
