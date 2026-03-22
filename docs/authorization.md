# Authorization Guide (RBAC + GraphQL)

This project uses **Casbin** for Attribute-Based and Role-Based Access Control (RBAC), integrated directly into the GraphQL layer via a custom `@auth` directive.

---

## 🛡️ The `@auth` Directive

We use a declarative approach to protect GraphQL fields. Instead of checking permissions inside resolvers, we tag them in the schema.

### Usage in `schema.graphql`

```graphql
type Query {
  # Requires 'read' action on the '/users/*' object
  users: [User!]! @auth(action: "read", object: "/users/*")
}
```

- **`action`**: The operation being performed (e.g., `read`, `write`, `delete`).
- **`object`**: The resource path being accessed (e.g., `/users/123`, `/profile`).

---

## ⚙️ How it Works

1. **Authentication**: The `x-mock-role` header (in dev) or Auth0 JWT (in prod) identifies the user's role (e.g., `teacher`, `student`).
2. **Context**: The role is stored in the GraphQL `context` as `casbinSubjects`.
3. **Enforcement**: The `authDirectiveTransformer` intercepts the resolver.
4. **Casbin Check**: It calls `enforcer.enforce(role, object, action)`.
5. **Resolution**: If Casbin returns `true`, the resolver runs. Otherwise, it throws a `Forbidden` error.

---

## 📝 Managing Policies

Policies are stored in a CSV format and loaded by the `acl-core` package.

**File**: `packages/acl-core/src/policy.csv`

### Policy Format
`p, <sub/role>, <obj>, <act>`

### Examples
```csv
# Teachers can read any user data
p, role:teacher, /users/*, read

# Members can manage their own profile
p, role:member, /profile, write
```

> [!IMPORTANT]
> Always use the `role:` prefix for subjects to stay consistent with our RBAC mapping.

---

## 🧪 Testing Authorization

We use Cucumber scenarios to verify that roles are correctly enforced.

### Test Profiles (Dev Mock)
In the `api` test profile, you can switch roles using the `Given I am authenticated with role "..."` step. This sets the `x-mock-role` header on subsequent requests.

**Example Scenario**:
```gherkin
Scenario: Student is forbidden from fetching all users
  Given I am authenticated with role "student"
  When I send a GraphQL query "users { id email }"
  Then the response status should be 200
  And the response should contain a GraphQL error "Forbidden"
```

---

## 🔧 Adding Protection to New Fields

1. Open `packages/graphql-schema/src/schema.graphql`.
2. Apply `@auth` to the desired field.
3. Update `packages/acl-core/src/policy.csv` to grant access to the relevant roles.
4. Run `pnpm turbo run build` to sync the schema.
5. Add a Cucumber scenario in `specs/api/` to verify the new protection.
