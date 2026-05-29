# High-Risk Administrative Actions & ManagerApproval Pattern

**Applies to:** Any operation that changes user roles/permissions, system configuration, bulk data operations, or audit access.

## Core Principle
From ENDERUN.md Corporate CRUD Governance:
> High-risk administrative operations are strictly under @manager control. Specialist agents must refuse and immediately redirect such requests to @manager.

## Required Payload Shape
Every high-risk request **must** include:

```ts
interface HighRiskActionPayload {
  isHighRiskAdminAction: true;           // Explicit boolean flag
  managerApproval: ManagerApproval;      // Cryptographically or procedurally signed token
}

interface ManagerApproval {
  approvalId: ApprovalID;
  traceId: TraceID;
  approvedBy: 'manager';
  approvedAt: string;                    // ISO-8601
  signature: string;                     // In real systems: cryptographic signature or secure reference
  reason: string;                        // Human-readable justification (mandatory)
}
```

## Backend Enforcement Rules (@backend)
1. If the action affects roles/permissions at Admin level or higher → treat as high-risk.
2. Reject the request immediately (403) if either `isHighRiskAdminAction` or `managerApproval` is missing.
3. Validate that `managerApproval.approvedBy === 'manager'`.
4. Log the full approval token for audit.
5. Never perform the state change before validation.

## Frontend Requirements (@frontend)
1. Any button or flow that can trigger a high-risk action must first open a **prominent, non-dismissible security modal**.
2. The modal must:
   - Clearly explain the risk and consequences.
   - Require the user to enter a "reason".
   - Only then initiate the Hermes briefing to @manager.
3. The actual API call may only be made **after** a valid `managerApproval` token is returned from the briefing flow.

## Hermes Coordination
- @frontend → Hermes briefing to @manager with proposed action + reason.
- @manager performs risk assessment and either:
  - Issues a signed `managerApproval` token, or
  - Rejects the request.
- Only after receiving the token does the frontend dispatch the high-risk request to backend.

## Concrete Payload Example (TypeScript)

```ts
// Request body for elevating a user to SuperAdmin
interface PromoteToSuperAdminRequest {
  userId: UserID;
  newRole: 'SuperAdmin';
  isHighRiskAdminAction: true;
  managerApproval: {
    approvalId: ApprovalID;
    traceId: TraceID;
    approvedBy: 'manager';
    approvedAt: string;
    signature: string;
    reason: string;
  };
}
```

## Example High-Risk Actions (Non-Exhaustive)
- Elevating any user to Admin or SuperAdmin
- Resetting system-wide configuration
- Bulk user deletion or data purge
- Exporting full audit logs containing PII
- Changing authentication providers or security policies

This pattern is the foundation of trustworthy enterprise governance in Agent Enderun.
