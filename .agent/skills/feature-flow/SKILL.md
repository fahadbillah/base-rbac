---
name: sdlc-manager
description: Enforces the branch/PR/issue workflow. Use this before starting any new task.
---
# Instructions
1. **Issue Creation**: Use the GitHub MCP to create a GitHub issue containing the implementation details and plan.
2. **Initialization**: Create and checkout a new branch using `git checkout -b feat/<issue-id>-<slug>` or `bug/<issue-id>-<slug>` based on the active issue.
3. **Commit Pattern**: Use Conventional Commits (e.g., `feat(auth): implement casbin enforcer`).
4. **Draft PR**: Once the first logic-pass is done, use the GitHub MCP to open a Draft PR linked to the issue.
5. **Verification**: Do not mark a task as "Done" until `npm test` passes in the terminal.