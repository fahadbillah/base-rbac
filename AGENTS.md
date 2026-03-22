# Project Constitution: Base RBAC

## 🎯 High-Level Vision
We are building a reusable authorization-first architecture for separate School and Office Management apps using Spec-Driven Development (SDD).

## 🛡️ Strict SDLC Rules
1. **Never commit to `main` or `release` branches.**
2. **Issue-First Workflow**: No code is written without an associated GitHub Issue.
3. **Branching**: Use `feat/ISSUE-ID-description` or `bug/ISSUE-ID-description`.
4. **Spec-Driven**: Every feature must have a corresponding `.feature` file in `/specs`.
5. **Testing Hierarchy**: 
   - Backend: Cucumber (Acceptance) + Vitest (Unit).
   - Frontend: MUI + Storybook (Visual Acceptance).
6. **Tooling**: Always use the GitHub MCP server rather than the `gh` CLI for any GitHub interactions.

## 🛠️ Technical Standards
- **UI**: MUI Core (Free) only.
- **Auth**: Casbin (RBAC) + SAML Integration.
- **Infrastructure**: Firebase (Hosting/Functions/Firestore).