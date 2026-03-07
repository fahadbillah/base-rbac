To feed this into **Gemini Antigravity** (your agentic IDE), you need a prompt that focuses on **contract-first development**. Antigravity excels when you give it a high-level "Mission" and a "Plan Artifact."

Here is the implementation plan designed specifically for an AI agent to execute.

---

## 🚀 Implementation Plan: Anti-Lock-in Architecture

### **Phase 1: Mission Control & Project Scaffolding**

**Goal:** Establish the Domain-Driven Design (DDD) folder structure and core types.

* **Task 1.1:** Initialize a Node.js/TypeScript project with ESM enabled.
* **Task 1.2:** Create the `src/domain` layer. Define basic Entity interfaces (e.g., `IUser`, `IProduct`) that do not contain any Firebase or SQL-specific types (no `Firestore.Timestamp` or `Decimal`).
* **Task 1.3:** Define **Repository Interfaces** in `src/domain/repositories`.
* Example: `IBaseRepository<T>` with standard CRUD methods.
* Example: `IUserRepository` extending `IBaseRepository<IUser>`.



### **Phase 2: The "Current" Layer (Firebase Implementation)**

**Goal:** Build the Firebase implementation of your repositories using the Admin SDK.

* **Task 2.1:** Setup `src/infrastructure/database/firebase/config.ts` for Firebase Admin initialization.
* **Task 2.2:** Implement `FirebaseUserRepository.ts`. Ensure it maps Firestore data back to the clean `IUser` domain entity.
* **Task 2.3:** Implement a **Dependency Injection (DI)** container or a simple Factory in `src/infrastructure/di-container.ts`.
* *Agent Instruction:* "Export a variable `UserRepository` that is currently an instance of `FirebaseUserRepository`."



### **Phase 3: The Use-Case Layer (Business Logic)**

**Goal:** Write logic that "doesn't know" Firebase exists.

* **Task 3.1:** Create `src/application/use-cases/RegisterUser.ts`.
* **Task 3.2:** Inject the `IUserRepository` interface into the use-case constructor.
* *Antigravity Prompt:* "Ensure the use-case only interacts with methods defined in the interface, not Firebase-specific methods."



### **Phase 4: API & Routing**

**Goal:** Expose the use-cases via Express/Fastify.

* **Task 4.1:** Create standard controllers in `src/presentation/controllers`.
* **Task 4.2:** Map HTTP requests to Use-Case executions.

---

## 🤖 Prompt for Gemini Antigravity

Copy and paste this into the **Agent Manager** or **Mission Control** in Antigravity:

> **Mission:** Build a scalable Node.js/TypeScript backend using Clean Architecture to avoid Firebase lock-in.
> **Project Rules:**
> 1. **Strict Layering:** `domain` layer must have ZERO dependencies. No Firebase/SQL imports.
> 2. **Repository Pattern:** Create interfaces in `src/domain/repositories` first.
> 3. **Infrastructure:** All Firebase-specific code must live in `src/infrastructure/database/firebase`.
> 4. **Mapping:** Create a mapper utility to convert Firestore `DocumentData` to Domain Entities.
> 5. **Dependency Injection:** Use a Factory or DI container so I can swap `FirebaseRepository` for `PostgresRepository` in one file later.
> 
> 
> **Task 1:** Initialize the folder structure and create a `User` entity and `IUserRepository` interface.
> **Task 2:** Implement the `FirebaseUserRepository` using the Firebase Admin SDK.
> **Task 3:** Create a `CreateUser` use-case that uses the repository.
