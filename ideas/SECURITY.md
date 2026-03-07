To make your AI-driven development with Gemini truly "airtight," you must treat Gemini as a **collaborator with high-level access but no memory of security boundaries**. The goal is to prevent secrets from ever reaching your git history and to ensure Gemini only interacts with credentials in a sandboxed, ephemeral way.

Here is the implementation plan for an airtight security layer.

---

## 1. The "Zero-Secret" Repository Setup

The first line of defense is ensuring the repository itself is a "secret-free zone."

### A. Pre-Commit Guardrails (Husky + Gitleaks)

You must stop the commit before it happens. If Gemini tries to commit a hardcoded key, the local git hook will kill the process.

* **Tool**: `gitleaks`
* **Action**: Configure a pre-commit hook that scans the staged files.

### B. Global `.gitignore` and `.env.example`

Gemini often tries to create `.env` files to "help" you. You must pre-emptively block this.

* **Requirement**: Every repository must have a `.env.example` containing only keys, never values.
* **Rule**: The `.gitignore` must explicitly block `*.env`, `*.pem`, `*.json` (if used for service accounts), and `.agent/beads/*.json` (to prevent agent memory leaks).

---

## 2. Secure MCP Architecture

Since you are using **MCP (Model Context Protocol)**, this is where the "real" secrets live. You must decouple the *config* from the *credentials*.

### A. Runtime Injection

Never let Gemini see the `mcp_config.json` containing real tokens. Instead, use **Environment Variables** that are injected into the Antigravity process at runtime.

* **Gemini's View**: `process.env.GITHUB_TOKEN`
* **Reality**: The token is stored in your OS Keychain or a Secret Manager (like Doppler or Infisical) and injected when you start the Antigravity agent.

### B. The "Vault" Pattern for Agents

If Gemini needs to deploy to Firebase, it shouldn't "know" the Firebase Token. It should only know how to call a command like `firebase deploy`, where the underlying MCP server handles the authentication in the background.

---

## 3. GitHub "Push Protection" & Actions

Even if a secret slips past local hooks, GitHub can block the push.

* **Enable GitHub Push Protection**: This is a free feature for public and "Advanced Security" private repos. It rejects any push containing known secret patterns (AWS, Google, etc.).
* **OIDC for CI/CD**: Stop using long-lived secrets in GitHub Actions. Use **OpenID Connect (OIDC)** to let GitHub Actions authenticate with Firebase/AWS/Google Cloud using short-lived, trust-based tokens.

---

## 4. Implementation Plan for Gemini (The Prompt)

Feed this to your Agent Manager to set up the security "Plumbing."

### 📝 Mission: Secure Environment Initialization

> "Setup an airtight security layer for this project:
> 1. **Install Gitleaks**: Configure it as a local pre-commit hook using Husky.
> 2. **Sanitize Environment**: Create a `.env.example` and a strict `.gitignore`.
> 3. **MCP Hardening**: Refactor `mcp_config.json` to use environment variable references (`env: { TOKEN: "${MY_TOKEN}" }`) instead of hardcoded strings.
> 4. **Verification**: Intentionally try to commit a dummy 'fake_api_key' and verify that Gitleaks blocks the commit.
> 5. **GitHub Setup**: Use the GitHub CLI to enable 'Push Protection' for this repository."
> 
> 

---

## 📂 New Security Files to Add

### `.gitleaks.toml`

*At project root to define what a "secret" looks like to the scanner.*

```toml
[allowlist]
description = "allow dummy test keys"
regexes = ['''fake_.*''']

[rules]
description = "Generic Secret"
regex = '''(?i)secret|password|token|key'''

```

### `.github/workflows/secret-scan.yml`

*To catch leaks in Pull Requests that might have bypassed local hooks.*

```yaml
name: gitleaks
on: [push, pull_request]
jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: gitleaks/gitleaks-action@v2
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

```

---

### Would you like me to generate a script that automatically rotates your development tokens if a leak is ever detected?
