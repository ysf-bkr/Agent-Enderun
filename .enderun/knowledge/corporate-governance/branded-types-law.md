# Branded Types Law

**Status:** Mandatory — Zero Tolerance

## Why This Exists
Plain `string` or `number` for identifiers (user IDs, role IDs, approval tokens, etc.) is a major source of bugs and security issues in large systems. Agent Enderun enforces **Branded Types** to make domain identifiers type-safe at compile time.

## Definition
```ts
type Brand<T, BrandName extends string> = T & { readonly __brand: BrandName };

type UserID = Brand<string, 'UserID'>;
type RoleID = Brand<string, 'RoleID'>;
type ApprovalID = Brand<string, 'ApprovalID'>;
```

## Rules
1. Every identifier that represents a domain entity **must** be a branded type.
2. Backend is the source of truth (`apps/backend/src/types`).
3. Frontend must maintain an exact local copy and update it when notified via Hermes.
4. Never cast `as any` or use `string` directly when a branded type is available.
5. Database columns can remain as strings, but the TypeScript layer must brand them immediately after reading.

## Enforcement
- @backend must refuse to implement any feature that introduces non-branded IDs.
- @analyst will run static analysis to detect violations.
- Any PR that introduces plain strings for IDs must be rejected.

## Example Correct Usage
```ts
const promoteUser = async (userId: UserID, newRole: SystemRole, approval: ManagerApproval) => { ... }
```

## Recommended Folder Structure

```
apps/backend/src/types/
├── brand.ts                 # Generic Brand utility
├── identifiers.ts           # UserID, RoleID, ApprovalID, TraceID...
├── approval.ts              # ManagerApproval + HighRiskActionPayload
├── errors.ts                # DomainError hierarchy
├── user.ts
├── role.ts
└── index.ts                 # Re-exports
```

## Concrete Implementation Examples

**brand.ts**
```ts
export type Brand<T, BrandName extends string> = T & { readonly __brand: BrandName };
```

**identifiers.ts**
```ts
import { Brand } from './brand';

export type UserID = Brand<string, 'UserID'>;
export type RoleID = Brand<string, 'RoleID'>;
export type ApprovalID = Brand<string, 'ApprovalID'>;
export type TraceID = Brand<string, 'TraceID'>;
```

## Common Anti-Patterns (Forbidden)
- `userId: string`
- `roleId: number`
- Passing raw database rows directly to the frontend without branding
- Using `as any` to bypass branded type checks
- Casting database IDs directly without branding at the repository layer

## Testable Rules (for @analyst)

- Static analysis must fail on any non-branded identifier used in public APIs or service methods.
- All identifiers in `apps/backend/src/types` must extend the `Brand` utility.
- Frontend type copies must match backend branded types exactly (contract drift detection).

This law is non-negotiable for any project using Agent Enderun at enterprise scale.
