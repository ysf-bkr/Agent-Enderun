# Professional Domain Error Handling Pattern (v0.8.5)

All backend components developed under the Agent Enderun framework must comply with the **Domain Error Handling Protocol**. Direct usage of generic Javascript `Error` objects or HTTP status codes inside domain services is strictly forbidden.

---

## 🏛️ 1. DomainError Base Hierarchy

We implement a strongly-typed, business-aware exception hierarchy. Every error thrown by the domain logic must inherit from the `DomainError` class.

```typescript
export abstract class DomainError extends Error {
  public abstract readonly statusCode: number;
  public abstract readonly errorCode: string;
  public readonly timestamp: string;

  constructor(message: string, public readonly metadata: Record<string, unknown> = {}) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = this.constructor.name;
    this.timestamp = new Date().toISOString();
  }
}
```

### Core Exception Catalog

*   **`NotFoundError` (HTTP 404):** Thrown when a resource (e.g., `User`, `Project`) identified by a **Branded Type ID** does not exist.
*   **`ValidationError` (HTTP 400):** Thrown when data validation (usually Zod schemas) fails before processing business logic.
*   **`ConflictError` (HTTP 409):** Thrown when database unique constraints or concurrent updates conflict.
*   **`UnauthorizedError` (HTTP 401 / 403):** Thrown when RLS (Row Level Security) or RBAC policies are violated.

---

## ⚡ 2. Fastify Global Exception Handler

Fastify must be configured with a single central error handler to map `DomainError` to client responses safely, preventing internal stack traces from leaking to the outside world.

```typescript
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export function registerGlobalErrorHandler(server: FastifyInstance) {
  server.setErrorHandler((error: Error, request: FastifyRequest, reply: FastifyReply) => {
    if (error instanceof DomainError) {
      server.log.warn({ err: error }, `Domain error: ${error.message}`);
      return reply.status(error.statusCode).send({
        success: false,
        error: error.errorCode,
        message: error.message,
        timestamp: error.timestamp,
        metadata: error.metadata
      });
    }

    // Capture unhandled internal technical crashes
    server.log.error({ err: error }, `Unhandled server crash: ${error.message}`);
    return reply.status(500).send({
      success: false,
      error: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred inside the system."
    });
  });
}
```

---

## 🔒 3. Branded Types & Query Constraints

1.  **Branded Type Enforcement:** You must never accept raw string IDs inside repository query parameters. Always enforce compile-time type safety:
    ```typescript
    export type UserId = string & { readonly __brand: unique symbol };
    ```
2.  **Kysely Query Failures:** All Kysely queries running inside database transactions must be wrapped inside a `try/catch` block that translates SQL constraints into precise `ConflictError` or `UnauthorizedError` entities instead of throwing raw database query failures.
