# CI Automation & E2E Testing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Claude-powered PR code review, Claude-powered README auto-update on merge, and Playwright e2e tests for the main user flows.

**Architecture:** Three independent GitHub Actions workflows. Code review and README update use `anthropics/claude-code-action@v1`. E2E tests use Playwright against the full stack (Docker Compose for API+DB, production Next.js build). A `CLAUDE.md` file configures Claude's review behavior.

**Tech Stack:** GitHub Actions, `anthropics/claude-code-action@v1`, Playwright, Docker Compose, pnpm

**Spec:** `docs/superpowers/specs/2026-05-04-ci-automation-and-testing-design.md`

---

## File Structure

| File | Action | Responsibility |
|------|--------|----------------|
| `CLAUDE.md` | Create | Project context + review instructions for Claude |
| `.github/workflows/code-review.yml` | Create | PR code review workflow |
| `.github/workflows/update-readme.yml` | Create | README auto-update workflow |
| `.github/workflows/e2e.yml` | Create | Playwright e2e test workflow |
| `infra/docker-compose.yml` | Modify | Add healthcheck to API service |
| `apps/web/playwright.config.ts` | Create | Playwright configuration |
| `apps/web/e2e/helpers.ts` | Create | Shared test helpers (register, login) |
| `apps/web/e2e/auth.spec.ts` | Create | Auth flow tests |
| `apps/web/e2e/item-crud.spec.ts` | Create | Item CRUD tests |
| `apps/web/e2e/happy-path.spec.ts` | Create | Full happy path test |
| `apps/web/package.json` | Modify | Add Playwright dep + test:e2e script |
| `.gitignore` | Modify | Add Playwright artifacts |

---

## Task 1: CLAUDE.md and Code Review Workflow

**Files:**
- Create: `CLAUDE.md`
- Create: `.github/workflows/code-review.yml`

- [ ] **Step 1: Create `CLAUDE.md`**

```markdown
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
```

- [ ] **Step 2: Create `.github/workflows/code-review.yml`**

```yaml
name: Code Review

on:
  pull_request:
    branches: [master]

permissions:
  contents: read
  pull-requests: write

jobs:
  review:
    name: Claude Code Review
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
```

- [ ] **Step 3: Commit**

```bash
git add CLAUDE.md .github/workflows/code-review.yml
git commit -m "feat: add Claude Code PR review workflow

Adds CLAUDE.md with project context and review guidelines.
Adds code-review.yml that runs claude-code-action on PRs."
```

---

## Task 2: README Auto-Update Workflow

**Files:**
- Create: `.github/workflows/update-readme.yml`

- [ ] **Step 1: Create `.github/workflows/update-readme.yml`**

```yaml
name: Update README

on:
  push:
    branches: [master]
    paths-ignore:
      - 'README.md'
      - 'docs/**'

permissions:
  contents: write
  pull-requests: write

jobs:
  update-readme:
    name: Claude README Update
    runs-on: ubuntu-latest
    if: github.actor != 'github-actions[bot]'

    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 2

      - uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          direct_prompt: |
            Look at the latest commit diff by running: git diff HEAD~1

            Then read the current README.md.

            Determine if the changes affect anything documented in the README:
            - New or changed API endpoints
            - New or changed environment variables
            - New or changed setup steps, prerequisites, or commands
            - New or changed database schema
            - Structural changes to the repository

            If the README needs updating:
            1. Create a new branch named "docs/update-readme-${{ github.sha }}"
            2. Update only the sections of README.md that are affected by the changes
            3. Commit the changes
            4. Open a PR to master using: gh pr create --title "docs: update README" --body "Auto-generated README update based on recent changes."

            If nothing in the README needs updating, do nothing and exit.
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/update-readme.yml
git commit -m "feat: add README auto-update workflow

Runs on push to master, uses Claude to detect if README
needs updating and opens a PR if so."
```

---

## Task 3: Docker Compose Healthcheck + Gitignore

**Files:**
- Modify: `infra/docker-compose.yml`
- Modify: `.gitignore`

- [ ] **Step 1: Add healthcheck to API service in `infra/docker-compose.yml`**

Add after `depends_on` block in the `api` service:

```yaml
    healthcheck:
      test: ["CMD-SHELL", "wget -qO- http://localhost:8080/health || exit 1"]
      interval: 10s
      timeout: 5s
      retries: 10
      start_period: 30s
```

- [ ] **Step 2: Add Playwright artifacts to `.gitignore`**

Add at the end of the `# ── Test / Coverage` section:

```gitignore
test-results/
playwright-report/
.playwright/
```

- [ ] **Step 3: Commit**

```bash
git add infra/docker-compose.yml .gitignore
git commit -m "chore: add API healthcheck and Playwright gitignore entries"
```

---

## Task 4: Playwright Setup and Configuration

**Files:**
- Modify: `apps/web/package.json`
- Create: `apps/web/playwright.config.ts`

- [ ] **Step 1: Install Playwright**

```bash
cd /Users/michalkozlowski/Projects/lost-n-found
pnpm --filter web add -D @playwright/test
```

- [ ] **Step 2: Add test:e2e script to `apps/web/package.json`**

Add to the `"scripts"` section:

```json
"test:e2e": "playwright test"
```

- [ ] **Step 3: Create `apps/web/playwright.config.ts`**

```typescript
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  retries: 0,
  use: {
    baseURL: "http://localhost:3000",
    headless: true,
    screenshot: "only-on-failure",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { browserName: "chromium" },
    },
  ],
  webServer: {
    command: "pnpm build && pnpm start",
    port: 3000,
    reuseExistingServer: true,
    env: {
      NEXT_PUBLIC_API_URL: "http://localhost:8080",
    },
  },
});
```

- [ ] **Step 4: Install Playwright browsers locally**

```bash
cd /Users/michalkozlowski/Projects/lost-n-found/apps/web
npx playwright install chromium
```

- [ ] **Step 5: Commit**

```bash
git add apps/web/package.json apps/web/playwright.config.ts pnpm-lock.yaml
git commit -m "chore: add Playwright configuration and dev dependency"
```

---

## Task 5: Test Helpers

**Files:**
- Create: `apps/web/e2e/helpers.ts`

- [ ] **Step 1: Create `apps/web/e2e/helpers.ts`**

```typescript
import { type Page, expect } from "@playwright/test";

/**
 * Generate a unique email for test isolation.
 */
export function uniqueEmail(): string {
  return `test-${Date.now()}-${Math.random().toString(36).slice(2, 7)}@example.com`;
}

const TEST_PASSWORD = "TestPassword123!";

/**
 * Register a new user and return the credentials.
 */
export async function register(
  page: Page,
): Promise<{ email: string; password: string }> {
  const email = uniqueEmail();

  await page.goto("/register");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Hasło", { exact: true }).fill(TEST_PASSWORD);
  await page.getByLabel("Potwierdź hasło").fill(TEST_PASSWORD);
  await page.getByRole("button", { name: "Zarejestruj się" }).click();

  // Wait for redirect to home page after successful registration
  await page.waitForURL("/");

  return { email, password: TEST_PASSWORD };
}

/**
 * Log in with existing credentials.
 */
export async function login(
  page: Page,
  email: string,
  password: string,
): Promise<void> {
  await page.goto("/login");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Hasło", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Zaloguj się" }).click();

  // Wait for redirect to home page after successful login
  await page.waitForURL("/");
}

/**
 * Create a lost item via the UI. Assumes user is already logged in.
 * Returns the item title for later assertions.
 */
export async function createItem(
  page: Page,
): Promise<{ title: string }> {
  const title = `Test item ${Date.now()}`;

  await page.goto("/add");

  // Select type: "Zgubiłem rzecz" (lost)
  await page.getByText("Zgubiłem rzecz").click();

  // Fill title
  await page.getByLabel("Tytuł ogłoszenia").fill(title);

  // Select first available category (wait for options to load from API)
  await page.getByLabel("Kategoria").click();
  await page.getByRole("option").first().waitFor({ state: "visible" });
  await page.getByRole("option").first().click();

  // Submit
  await page.getByRole("button", { name: "Dodaj ogłoszenie" }).click();

  // Wait for redirect to the item detail page
  await page.waitForURL(/\/items\/.+/);

  return { title };
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/e2e/helpers.ts
git commit -m "feat: add Playwright e2e test helpers"
```

---

## Task 6: Auth E2E Test

**Files:**
- Create: `apps/web/e2e/auth.spec.ts`

- [ ] **Step 1: Create `apps/web/e2e/auth.spec.ts`**

```typescript
import { test, expect } from "@playwright/test";
import { register, login, uniqueEmail } from "./helpers";

test.describe("Authentication", () => {
  test("register a new user", async ({ page }) => {
    const creds = await register(page);

    // Should be on the home page after registration
    await expect(page).toHaveURL("/");
  });

  test("login with registered user", async ({ page }) => {
    // First register
    const creds = await register(page);

    // Logout by navigating to logout
    await page.goto("/logout");
    await page.waitForURL(/\/login/);

    // Login with the same credentials
    await login(page, creds.email, creds.password);

    // Should be on home page
    await expect(page).toHaveURL("/");

    // Should see user email in the header menu
    await expect(page.getByText(creds.email)).toBeVisible();
  });

  test("show validation errors for invalid input", async ({ page }) => {
    await page.goto("/register");

    // Submit empty form
    await page.getByRole("button", { name: "Zarejestruj się" }).click();

    // Should show validation errors
    await expect(page.getByText("Nieprawidłowy email")).toBeVisible();
    await expect(page.getByText("Hasło jest wymagane")).toBeVisible();
  });
});
```

- [ ] **Step 2: Run the test to verify it works (requires full stack running)**

```bash
cd /Users/michalkozlowski/Projects/lost-n-found/apps/web
npx playwright test e2e/auth.spec.ts --reporter=list
```

Expected: All 3 tests pass (if full stack is running via Docker Compose).

- [ ] **Step 3: Commit**

```bash
git add apps/web/e2e/auth.spec.ts
git commit -m "test: add auth e2e tests (register, login, validation)"
```

---

## Task 7: Item CRUD E2E Test

**Files:**
- Create: `apps/web/e2e/item-crud.spec.ts`

- [ ] **Step 1: Create `apps/web/e2e/item-crud.spec.ts`**

```typescript
import { test, expect } from "@playwright/test";
import { register, createItem } from "./helpers";

test.describe("Item CRUD", () => {
  test("create and view an item", async ({ page }) => {
    await register(page);
    const { title } = await createItem(page);

    // Should be on the item detail page
    await expect(page.getByRole("heading", { name: title })).toBeVisible();

    // Should show the "Zgubione" badge (lost type)
    await expect(page.getByText("Zgubione")).toBeVisible();
  });

  test("delete own item", async ({ page }) => {
    await register(page);
    const { title } = await createItem(page);

    // Should be on item detail page — click delete
    await page.getByRole("button", { name: "Usuń" }).click();

    // Confirm in the modal dialog
    await expect(
      page.getByText("Czy na pewno chcesz usunąć to ogłoszenie?"),
    ).toBeVisible();
    await page
      .getByRole("dialog")
      .getByRole("button", { name: "Usuń" })
      .click();

    // Should redirect to account items page
    await page.waitForURL(/\/account\/items/);

    // The item should not be in the list
    await expect(page.getByText(title)).not.toBeVisible();
  });
});
```

- [ ] **Step 2: Run the test**

```bash
cd /Users/michalkozlowski/Projects/lost-n-found/apps/web
npx playwright test e2e/item-crud.spec.ts --reporter=list
```

Expected: Both tests pass.

- [ ] **Step 3: Commit**

```bash
git add apps/web/e2e/item-crud.spec.ts
git commit -m "test: add item CRUD e2e tests (create, view, delete)"
```

---

## Task 8: Happy Path E2E Test

**Files:**
- Create: `apps/web/e2e/happy-path.spec.ts`

- [ ] **Step 1: Create `apps/web/e2e/happy-path.spec.ts`**

```typescript
import { test, expect } from "@playwright/test";
import { register, login, createItem } from "./helpers";

test.describe("Happy Path", () => {
  test("register → login → create item → view details → logout", async ({
    page,
  }) => {
    // 1. Register
    const creds = await register(page);

    // 2. Logout and login again (to test both flows)
    await page.goto("/logout");
    await page.waitForURL(/\/login/);
    await login(page, creds.email, creds.password);

    // 3. Verify authenticated — user email visible
    await expect(page.getByText(creds.email)).toBeVisible();

    // 4. Create an item
    const { title } = await createItem(page);

    // 5. Verify on item detail page
    await expect(page.getByRole("heading", { name: title })).toBeVisible();
    await expect(page.getByText("Zgubione")).toBeVisible();

    // 6. Navigate to items list and find the item
    await page.goto("/items?type=lost&view=list&page=1");
    await expect(page.getByText(title)).toBeVisible();

    // 7. Logout
    await page.goto("/logout");
    await page.waitForURL(/\/login/);

    // 8. Verify logged out — should see login button
    await expect(
      page.getByRole("link", { name: "Zaloguj się" }),
    ).toBeVisible();
  });
});
```

- [ ] **Step 2: Run the test**

```bash
cd /Users/michalkozlowski/Projects/lost-n-found/apps/web
npx playwright test e2e/happy-path.spec.ts --reporter=list
```

Expected: Test passes.

- [ ] **Step 3: Commit**

```bash
git add apps/web/e2e/happy-path.spec.ts
git commit -m "test: add happy path e2e test (full user flow)"
```

---

## Task 9: E2E Workflow

**Files:**
- Create: `.github/workflows/e2e.yml`

- [ ] **Step 1: Create `.github/workflows/e2e.yml`**

```yaml
name: E2E Tests

on:
  pull_request:
    branches: [master]

concurrency:
  group: e2e-${{ github.ref }}
  cancel-in-progress: true

jobs:
  e2e:
    name: Playwright E2E
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: pnpm

      - name: Install dependencies
        run: pnpm install

      - name: Install Playwright browsers
        run: pnpm --filter web exec playwright install --with-deps chromium

      - name: Start backend (Docker Compose)
        run: docker compose -f infra/docker-compose.yml up -d --build --wait
        env:
          AWS_ENDPOINT_URL: "http://localhost:4572"
          AWS_S3_BUCKET_NAME: "fake"
          AWS_DEFAULT_REGION: "us-east-1"
          AWS_ACCESS_KEY_ID: "123"
          AWS_SECRET_ACCESS_KEY: "xyz"
          MAPTILER_API_KEY: "fake"

      - name: Wait for API to be ready
        run: |
          for i in $(seq 1 30); do
            if curl -sf http://localhost:8080/health > /dev/null 2>&1; then
              echo "API is ready"
              exit 0
            fi
            echo "Waiting for API... ($i/30)"
            sleep 2
          done
          echo "API did not become ready"
          exit 1

      - name: Run Playwright tests
        run: pnpm --filter web test:e2e
        env:
          NEXT_PUBLIC_API_URL: http://localhost:8080

      - name: Upload Playwright report
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: apps/web/playwright-report/
          retention-days: 7
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/e2e.yml
git commit -m "ci: add Playwright e2e test workflow

Spins up full stack via Docker Compose, runs Playwright tests,
uploads report on failure."
```

---

## Task 10: Run All E2E Tests Locally (Verification)

- [ ] **Step 1: Ensure the full stack is running**

```bash
cd /Users/michalkozlowski/Projects/lost-n-found/infra
docker compose up -d --build
```

Wait for API to be healthy.

- [ ] **Step 2: Run all Playwright tests**

```bash
cd /Users/michalkozlowski/Projects/lost-n-found/apps/web
NEXT_PUBLIC_API_URL=http://localhost:8080 npx playwright test --reporter=list
```

Expected: All tests pass (auth: 3, item-crud: 2, happy-path: 1 = 6 total).

- [ ] **Step 3: If any tests fail, fix and re-commit**

Adjust selectors or waits as needed based on actual UI behavior. The Polish labels and form structure have been verified against the source code, but runtime behavior may differ.
