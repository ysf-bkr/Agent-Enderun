# Domain Error Handling & Typed Errors Standard

**Applies to**: All backend and shared contract code in enterprise projects using Agent Enderun.

## Purpose
In large-scale corporate systems, generic `Error` or string-based error messages lead to fragile code, poor debugging, and insecure error handling. We enforce a typed, domain-aware error system.

## Core Principles

1. Every domain error must be represented by a dedicated class that extends a base `DomainError`.
2. Errors must carry machine-readable codes, not just human messages.
3. Errors must be serializable in a consistent, safe format for API responses.
4. Never use `throw new Error("something went wrong")` in production business logic.

## Standard Error Hierarchy

```ts
// apps/backend/src/types/errors.ts

export abstract class DomainError extends Error {
  abstract readonly code: string;
  abstract readonly statusCode: number;
  readonly details?: Record<string, unknown>;

  constructor(message: string, details?: Record<string, unknown>) {
    super(message);
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }

  toJSON() {
    return {
      error: {
        code: this.code,
        message: this.message,
        details: this.details,
      },
    };
  }
}

// Example concrete errors
export class UserNotFoundError extends DomainError {
  readonly code = 'USER_NOT_FOUND';
  readonly statusCode = 404;
}

export class InsufficientPermissionsError extends DomainError {
  readonly code = 'INSUFFICIENT_PERMISSIONS';
  readonly statusCode = 403;
}

export class HighRiskActionRequiresApprovalError extends DomainError {
  readonly code = 'HIGH_RISK_ACTION_REQUIRES_APPROVAL';
  readonly statusCode = 403;
}
```

## Usage Rules

- Business logic must throw specific domain errors, never generic ones.
- API layer (Fastify error handler) converts `DomainError` instances into safe JSON responses.
- Never expose stack traces or internal details to clients.
- Frontend must be able to handle known error codes and show appropriate user-facing messages.

## Integration with High-Risk Governance

When a high-risk action is attempted without proper `managerApproval`, the backend **must** throw `HighRiskActionRequiresApprovalError`. This error code is then used by the frontend to trigger the security modal flow.

## Enforcement

- `@backend` must reject any implementation that uses raw `Error` or `throw new Error(...)` for domain cases.
- `@analyst` will periodically scan for anti-patterns using static analysis.

This standard ensures consistent, safe, and debuggable error handling across the entire system.
