# Audit Logging Standard

**Applies to**: All privileged, high-risk, or compliance-relevant operations in enterprise projects using Agent Enderun.

## Purpose
Every significant administrative or security-relevant action must leave a tamper-evident, queryable audit trail. This is a non-negotiable requirement for corporate and regulated environments.

## Core Requirements

1. **What Must Be Logged**
   - All high-risk administrative actions (role changes, configuration modifications, bulk operations, data exports).
   - Authentication and authorization events (login, token issuance, permission checks).
   - Any action performed using a `managerApproval` token.
   - Failed attempts to perform privileged operations.

2. **Minimum Information per Log Entry**
   - Timestamp (ISO-8601, UTC)
   - Trace ID (linked to the originating Hermes trace when applicable)
   - Actor (UserID of the person or system performing the action)
   - Action type (e.g., `USER_ROLE_ELEVATED`, `SYSTEM_CONFIG_UPDATED`)
   - Target resource (e.g., affected UserID or configuration key)
   - Before and after state (when relevant and not containing secrets)
   - `managerApproval` details (approvalId, reason, approver) if the action was high-risk
   - Outcome (success / failure + error code if applicable)

3. **Storage and Integrity**
   - Audit logs must be stored separately from operational data when possible.
   - Logs must be append-only. Updates or deletions of existing log entries are forbidden.
   - In production systems, logs should be shipped to a tamper-resistant store (e.g., dedicated database table with row-level security, or external logging service).

4. **Access Control**
   - Reading full audit logs is itself a high-risk operation and must follow the `managerApproval` process.
   - Regular users should never have direct access to raw audit logs.

## Implementation Guidelines for @backend

- Create a dedicated `AuditLog` domain entity and repository.
- Use a structured logging approach (never unstructured strings for critical fields).
- Every high-risk service method must create an audit entry as part of the same transaction (or as a guaranteed side effect).
- Never log sensitive data (passwords, tokens, PII) in plaintext.

## Implementation Guidelines for @frontend

- Administrative UIs that trigger high-risk actions must clearly indicate that the action will be audited.
- Audit log viewing interfaces (when built) must themselves be protected by the high-risk approval flow.

## Relationship to Other Standards

- Works together with the `ManagerApproval` pattern: every approved high-risk action must produce a corresponding audit entry that references the `approvalId`.
- Supports the Branded Types Law: `ActorID`, `TargetID`, and `ApprovalID` in audit records must be properly branded types.

## Anti-Patterns

- Logging only to console or ephemeral files in production.
- Making audit logs mutable.
- Skipping audit entries for “internal” or “trusted” admin users.
- Storing audit data in the same tables as operational data without clear separation.

This standard is mandatory for any project that claims enterprise or regulated status under Agent Enderun.
