Since you are deploying two separate applications, your **Implementation Plan** for Antigravity moves from a "Multi-Tenant" setup to a **"Blueprint & Instance"** strategy.

You will first build a **Core Auth Library** (the Blueprint), and then have Antigravity spawn two separate workspaces (the Instances) for the School and Office apps.

---

## 🏗️ Phase 1: The Core Auth Blueprint

In Antigravity's **Manager View**, create a task called `Build Shared ACL Library`. This agent will focus only on the reusable logic.

### 1. Model Selection & Configuration

* **Model:** Use **Gemini 3 Flash** (it’s optimized for the fast loops required for library scaffolding).
* **The Model File (`model.conf`):** Simplified RBAC without domains.
```ini
[request_definition]
r = sub, obj, act
[policy_definition]
p = sub, obj, act
[role_definition]
g = _, _
[matchers]
m = g(r.sub, p.sub) && keyMatch2(r.obj, p.obj) && r.act == p.act

```



### 2. SAML Mapping Skill

Create an **Agent Skill** (`SKILL.md`) that teaches the agent how to map SAML attributes to Casbin roles.

> **Skill Instruction:** "Whenever you see a SAML assertion with the attribute `https://app.com/claims/role`, map it to the `sub` field in Casbin policies."

---

## 🚀 Phase 2: Deployment A (School App)

Open a new Workspace in Antigravity and point it to your School repository.

### 1. Prompt for Agent Manager:

> "Initialize a School Management System using the `acl-core` library.
> * **Primary Theme:** MUI Green/Emerald.
> * **Policies:** Seed `policy.csv` with:
> * `p, role:teacher, /grades/*, write`
> * `p, role:student, /grades/my, read`
> * `g, headteacher, teacher`
> 
> 
> * **Verification:** Use the built-in Browser to ensure a user with `role:student` cannot see the `Edit Grades` button."
> 
> 

---

## 🏢 Phase 3: Deployment B (Office App)

Open another Workspace for the Office repository.

### 1. Prompt for Agent Manager:

> "Initialize an Office Management System using the `acl-core` library.
> * **Primary Theme:** MUI Indigo/Slate.
> * **Policies:** Seed `policy.csv` with:
> * `p, role:hr, /employees/payroll, write`
> * `p, role:intern, /docs/public, read`
> 
> 
> * **Verification:** Run the app and use the Browser Agent to confirm the 'Payroll' link only appears for the HR role."
> 
> 

---

## 🛠️ Antigravity Artifacts to Review

As the agent works, it will produce **Artifacts**. You should strictly review these before the code is finalized:

| Artifact | What to Look For |
| --- | --- |
| **Task List** | Ensure the agent separates "Casbin Setup" from "MUI Theming." |
| **Implementation Plan** | Check that the `Enforcer` is initialized as a **Singleton** so it doesn't reload the CSV on every request. |
| **Browser Recording** | Watch the video of the agent clicking through the UI to prove the "Authorized" wrapper works. |
| **Screenshots** | Verify that the School App looks distinctly different from the Office App. |

---

## 💡 Pro-Tip for Gemini in Antigravity

If the agent struggles with the SAML XML parsing, don't just "chat" with it. Use the **@** feature to reference the specific SAML documentation or your own `metadata.xml` file.

For example: *"@metadata.xml map the 'MemberOf' attribute to the Casbin role system."*

**Would you like me to write the exact `SKILL.md` file you can drop into the `.agents/skills/` folder to automate this setup?**