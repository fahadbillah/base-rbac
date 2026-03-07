# Spec Workflow: Writing & Generating Feature Files

This guide covers how to write Gherkin specs and use AI (Antigravity) to accelerate the process.

---

## The Golden Rule

> **Spec first. Code second.**  
> No feature branch is merged unless its Cucumber scenarios are green.

The `specs/` folder at the repo root is the single source of truth. It is read by humans, AI, and CI equally.

---

## Folder & Naming Conventions

```
specs/
├── api/             # GraphQL API contract tests
├── admin/           # Admin portal user flows
└── member/          # Member portal user flows
```

| Rule | Example |
|---|---|
| One feature file per domain concept | `specs/member/profile.feature` |
| File name is kebab-case noun | `password-reset.feature`, `user-management.feature` |
| Feature title is plain English | `Feature: Member Profile Management` |
| Scenario title describes outcome | `Scenario: Member updates their display name` |

---

## Tags — How Scenarios Route to Test Profiles

Tags control which Cucumber profile picks up a scenario:

| Tag | Profile | Runner |
|---|---|---|
| `@api` | `api` | Supertest against GraphQL |
| `@e2e @admin` | `e2e:admin` | Playwright in admin-portal |
| `@e2e @member` | `e2e:member` | Playwright in member-portal |

Every scenario **must** have at least one profile tag. Untagged scenarios are skipped by all profiles.

---

## Gherkin Style Guide

### ✅ Good
```gherkin
Scenario: Member resets password with valid email
  Given I am on the password reset page
  When I enter my email "user@example.com"
  And I submit the form
  Then I should see "Check your inbox for a reset link"
  And the API should return 200
```

### ❌ Avoid
```gherkin
# Too implementation-specific
Scenario: POST /auth/reset returns 200
  When I POST to "/auth/reset" with body {"email":"user@example.com"}
  Then status is 200

# Too vague
Scenario: Reset works
  Given I reset my password
  Then it works
```

**Principles:**
- Write from the **user's perspective**, not the system's
- Use `Given/When/Then` strictly: state → action → assertion
- Prefer `And` over repeating `When` or `Then`
- Use `Scenario Outline + Examples` for input variation (invalid emails, error messages, etc.)

---

## AI-Assisted Spec Authoring

### Interactive (primary workflow)

Tell Antigravity what you need in plain English:

> *"Write a feature file for member profile editing — they can update their name and it should validate that name isn't empty."*

Antigravity will:
1. Write the `.feature` file in the right `specs/` folder
2. Generate step definition stubs in the matching `e2e/` folder  
3. Tag everything correctly for the right Cucumber profile
4. Follow the conventions in this document

### Iteration pattern

```
You:       Describe the user story
AI:        Writes .feature + step stubs
You:       Review — ask for edge cases or adjustments
AI:        Adds Scenario Outlines with Examples table
You:       Approve → implement step bodies → tests go green
You:       Implement the actual feature behind the spec
```

### Dry-run check

After any new spec is written, run:

```bash
pnpm spec:dry-run
```

This tells you immediately which step definitions are unimplemented (shown as `pending`).

---

## Step Definition Conventions

Step files live in `e2e/<profile>/steps/` and mirror the spec folder structure:

```
e2e/
├── api/steps/user.steps.ts          ← implements specs/api/user.feature
├── admin/steps/user-management.steps.ts
└── member/steps/authentication.steps.ts
```

**Reuse steps** — if a step phrase is shared across multiple features (e.g., `I should see the heading "..."`) keep it in one file. Cucumber matches by string, not by file.

---

## Running Tests

```bash
# Dry-run (no servers needed — checks all steps are defined)
pnpm spec:dry-run

# API tests only (needs apps/api running)
npx cucumber-js --profile api --config e2e/cucumber.config.js

# Admin E2E (needs admin-portal running on :3000)
npx cucumber-js --profile e2e:admin --config e2e/cucumber.config.js

# Member E2E (needs member-portal running on :3001)
npx cucumber-js --profile e2e:member --config e2e/cucumber.config.js
```

---

## CI Spec Gate

The GitHub Actions pipeline enforces:

```
lint + typecheck  →  api tests  ┐
                  →  e2e:admin  ├─ all must pass to merge
                  →  e2e:member ┘
```

**No PR is merged with failing or unimplemented scenarios.**
