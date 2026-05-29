# ESLint & Code Quality Standards

**Version**: 1.0  
**Status**: MANDATORY  
**Scope**: All TypeScript and JavaScript projects under Agent Enderun.

---

## 🏛️ Foundational Rules (Zero Tolerance)

Every line of code must pass these standards. Violation is considered a "Governance Breach".

### 1. The `any` Prohibition
- **Rule**: Use of the `any` type is strictly forbidden.
- **Why**: Bypasses the type system and introduces hidden bugs.
- **Action**: Use `unknown`, generics, or define a concrete `interface`/`type`.

### 2. The `console.log` Ban
- **Rule**: `console.log`, `console.warn`, and `console.error` are forbidden in application code.
- **Why**: Pollutes production logs and leaks information.
- **Action**: Use a structured logging utility or the project's internal logger.

### 3. Branded Types Law
- **Rule**: All identifiers (IDs) must be "Branded Types".
- **Why**: Prevents accidental mixing of different ID types (e.g., passing a UserID where a ProjectID is expected).
- **Example**: `export type UserID = Brand<string, "UserID">;`

---

## 🏗️ Architectural Compliance

### 1. Contract-First Development
- All API routes and shared data structures must be defined in the `types/` folder before implementation.
- `apps/backend/contract.version.json` must be updated on every contract change.

### 2. Domain-Driven Structure
- Keep logic within its respective domain. Avoid cross-domain leakage.
- Controllers should only handle routing and validation; business logic belongs in Services/Repositories.

### 3. Async/Await Excellence
- Always use `try/catch` blocks for asynchronous operations.
- Never leave a promise unhandled.

---

## 💅 Styling & Naming

- **Naming**: Use camelCase for variables/functions, PascalCase for classes/types, and kebab-case for files.
- **Comments**: Only comment *why* something is complex. Do not describe *what* the code does (the code should be self-descriptive).
- **Imports**: Always use explicit file extensions in imports (e.g., `import { foo } from "./foo.js";`) to comply with ESM standards.

---

## 🛠️ Tooling

Agents must run the following command to verify compliance:
`agent-enderun check:lint`

If a file fails linting, agents are authorized to use `eslint --fix` but must manually review the changes to ensure logic is preserved.

---

**Failure to comply with these standards will result in a PHASE_ROLLBACK.**
