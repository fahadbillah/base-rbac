# Architecture Brainstorm: Spec-Driven Monorepo

## Stack Decisions

| Concern | Choice | Rationale |
|---|---|---|
| Monorepo | **Turborepo + pnpm workspaces** | Fast caching, minimal config |
| Backend | **Express + Apollo Server (TypeScript)** | Your existing exp, mature GraphQL ecosystem |
| Frontend | **Vite + React + React Router v7** | Fastest SPA DX; avoids Next.js |
| Auth | **Auth0** | Managed auth, SDKs for React + Express |
| Database | **PostgreSQL + Prisma** | Best-in-class TS DX, migrations, type safety |
| Gherkin runner | **@cucumber/cucumber** | Most docs, largest community, Node-native |
| E2E browser | **Playwright** (via Cucumber steps) | Best cross-browser, great TS support |
| API tests | **Supertest** (via Cucumber steps) | De-facto Express integration testing |
| CI/CD | **GitHub Actions** | Native to GitHub, great caching support |
| Shared UI | **packages/ui** | Single design system across admin + member portals |
| AI spec gen | **Antigravity (interactive) + Claude API (automated)** | See AI Workflow section below |
| Containerisation | **Docker + docker-compose** | Dev parity, isolated services |

> [!NOTE]
> Playwright is used _inside_ Cucumber step definitions — not via `playwright-bdd`. This keeps feature files as the **single source of truth** and lets the same `.feature` file drive both API-level and UI-level assertions independently.

---

## Monorepo Structure

```
root/
├── apps/
│   ├── api/                    # Express + Apollo GraphQL monolith
│   ├── admin-portal/           # Vite + React SPA
│   └── member-portal/          # Vite + React SPA
│
├── packages/
│   ├── graphql-schema/         # Shared SDL types, codegen output
│   ├── ui/                     # Shared React component library
│   ├── config/                 # Shared tsconfig, eslint, prettier
│   └── test-utils/             # Shared Cucumber world, hooks, fixtures
│
├── specs/                      # ★ THE SPEC LAYER — source of truth
│   ├── api/
│   │   ├── auth.feature
│   │   └── user.feature
│   ├── admin/
│   │   ├── dashboard.feature
│   │   └── user-management.feature
│   └── member/
│       ├── onboarding.feature
│       └── profile.feature
│
├── e2e/                        # Step definition implementations
│   ├── api/                    # Supertest-based step defs
│   │   ├── steps/
│   │   └── support/
│   ├── admin/                  # Playwright-based step defs
│   │   ├── steps/
│   │   └── support/
│   ├── member/                 # Playwright-based step defs
│   │   ├── steps/
│   │   └── support/
│   └── cucumber.config.ts      # Shared Cucumber config base
│
├── docker/
│   ├── api/Dockerfile
│   ├── admin-portal/Dockerfile
│   └── member-portal/Dockerfile
│
├── docker-compose.yml          # Local dev orchestration
├── docker-compose.test.yml     # CI test environment
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

> [!IMPORTANT]
> `specs/` lives at the **root** — not inside any app. It is the contract that all services must satisfy. This is the key to spec-driven development: the spec precedes the implementation.

---

## The Spec Layer in Detail

### Feature File Convention

```gherkin
# specs/member/onboarding.feature

Feature: Member Onboarding
  As a new member
  I want to complete onboarding
  So that I can access the platform

  Scenario: Successful registration with valid email
    Given I am on the registration page
    When I fill in my email "user@example.com" and password "Secure123!"
    And I submit the registration form
    Then I should see a verification email prompt
    And the API should return a 201 with a user record

  Scenario Outline: Registration fails with invalid email formats
    Given I am on the registration page
    When I fill in my email "<email>" and password "Secure123!"
    And I submit the registration form
    Then I should see the error "<error_message>"

    Examples:
      | email          | error_message             |
      | notanemail     | Invalid email format      |
      | @nodomain.com  | Invalid email format      |
      | user@          | Invalid email format      |
```

### Two Test Profiles Per Feature

Each feature file can be exercised at two levels:

| Profile | Runner | What it tests |
|---|---|---|
| `api` | Cucumber + Supertest | GraphQL mutations/queries directly |
| `e2e:member` | Cucumber + Playwright | The full UI flow via browser |

You configure separate Cucumber profiles in `cucumber.config.ts`:

```ts
// e2e/cucumber.config.ts
export default {
  profiles: {
    api: {
      paths: ['specs/api/**/*.feature'],
      require: ['e2e/api/steps/**/*.ts', 'e2e/api/support/**/*.ts'],
    },
    'e2e:admin': {
      paths: ['specs/admin/**/*.feature'],
      require: ['e2e/admin/steps/**/*.ts', 'e2e/admin/support/**/*.ts'],
    },
    'e2e:member': {
      paths: ['specs/member/**/*.feature'],
      require: ['e2e/member/steps/**/*.ts', 'e2e/member/support/**/*.ts'],
    },
  }
}
```

---

## Docker Layout

### Development (`docker-compose.yml`)
```yaml
services:
  db:
    image: postgres:16-alpine
  api:
    build: ./docker/api
    volumes: [./apps/api:/app]    # hot reload
    depends_on: [db]
  admin-portal:
    build: ./docker/admin-portal
    volumes: [./apps/admin-portal:/app]
  member-portal:
    build: ./docker/member-portal
    volumes: [./apps/member-portal:/app]
```

### Multi-stage Dockerfiles
Each service uses a multi-stage build:
1. `deps` — install pnpm + workspace deps
2. `build` — compile TS
3. `prod` — minimal runtime image

---

## AI-Assisted Spec Workflow

This is where `ai-sdlc` earns its name. The workflow:

```
1. You describe a user story in plain English
       ↓
2. AI generates a .feature file in the correct specs/ folder
       ↓
3. AI generates step definition stubs (Cucumber raises "pending" steps)
       ↓
4. You implement the step bodies (or AI does with context)
       ↓
5. Tests go green → feature is accepted
       ↓
6. API/UI implementation follows the now-passing spec
```

### Two modes of AI usage

#### 1. Interactive (Antigravity in conversation)
You describe a user story or feature to Antigravity and it:
- Writes the `.feature` file directly into `specs/`
- Generates step definition stubs in `e2e/`
- Helps you iterate on scenarios until they feel right

This is your primary workflow during spec authoring.

#### 2. Automated (Claude API in CI / CLI scripts)
For a `pnpm spec:generate` CLI or a GitHub Actions step:
- Call the **Anthropic Claude API** (same model powering Antigravity)
- Pass existing feature files as context + the new user story
- Output: new `.feature` file + skeleton step defs
- Run `cucumber --dry-run` to surface unimplemented steps

> [!NOTE]
> You'll need an Anthropic API key for automated pipelines. The interactive Antigravity flow (in-conversation) has no extra setup — just describe what you need and it writes the files.

---

## Turborepo Pipeline

```json
// turbo.json
{
  "pipeline": {
    "build":   { "dependsOn": ["^build"], "outputs": ["dist/**"] },
    "test:api":   { "dependsOn": ["build"] },
    "test:e2e":   { "dependsOn": ["build"] },
    "lint":    {},
    "typecheck": { "dependsOn": ["^build"] }
  }
}
```

---

## ✅ Stack Finalised — Next Steps

1. **Scaffold the monorepo** — Turborepo init, pnpm workspaces, create `apps/` and `packages/` structure
2. **Set up Docker** — multi-stage Dockerfiles for `api`, `admin-portal`, `member-portal`; `docker-compose.yml` for local dev
3. **Bootstrap the API** — Express + Apollo Server + Auth0 middleware + Prisma schema
4. **Bootstrap the portals** — Vite + React + React Router + Auth0 SDK, link to `packages/ui`
5. **Configure Cucumber** — profiles for `api`, `e2e:admin`, `e2e:member`; write first feature file
6. **Set up GitHub Actions** — spec-gate pipeline (no merge without green Cucumber runs)

---

## 📖 Related Docs

- [Spec Workflow](spec-workflow.md)
- [Authorization & RBAC](authorization.md)

