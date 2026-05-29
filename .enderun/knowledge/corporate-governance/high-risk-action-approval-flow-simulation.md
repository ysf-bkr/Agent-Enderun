# High-Risk Action Approval Flow Simulation

**Purpose**: This simulation demonstrates the complete end-to-end flow of a high-risk administrative action in a corporate project, from the moment the user clicks the button in the UI until the action is executed and audited.

**Scenario**: A company administrator wants to promote a regular user to SuperAdmin. This action is classified as high-risk.

---

## Step 1 – User Triggers the Action (Frontend)

**UI Context**: Admin dashboard → User list → “Promote to SuperAdmin” button next to a user named “Alice”.

**User clicks the button.**

**Frontend behavior** (as per `high-risk-security-modal-hermes-flow.md`):

- Immediately opens a prominent, non-dismissible `HighRiskSecurityModal`.
- Modal displays:
  - Clear warning: “This action will grant full system privileges to the selected user.”
  - Required “Reason” textarea.
  - Buttons: “Cancel” and “Request Manager Approval via Hermes”.

**User enters the reason**:  
“Alice needs SuperAdmin access to handle critical production incidents during the migration period. Security team has reviewed and approved.”

User clicks “Request Manager Approval via Hermes”.

---

## Step 2 – Hermes Briefing to @manager

**Frontend** constructs and sends a Hermes message to @manager:

```json
{
  "type": "high_risk_approval_request",
  "traceId": "TRACE-20260525-USER-PROMO-042",
  "payload": {
    "action": "PROMOTE_TO_SUPERADMIN",
    "targetUserId": "user_0192",
    "proposedBy": "admin_007",
    "reason": "Alice needs SuperAdmin access to handle critical production incidents during the migration period. Security team has reviewed and approved."
  }
}
```

**@manager receives the briefing.**

**@manager internal process** (as per corporate-governance knowledge):

- Reads `high-risk-actions-managerapproval.md`
- Reads `audit-logging-standard.md`
- Assesses risk level (very high – SuperAdmin elevation)
- Checks current project context and any existing policies

**@manager response** (sent back via Hermes):

```json
{
  "type": "high_risk_approval_response",
  "traceId": "TRACE-20260525-USER-PROMO-042",
  "status": "approved",
  "managerApproval": {
    "approvalId": "approval_88471",
    "traceId": "TRACE-20260525-USER-PROMO-042",
    "approvedBy": "manager",
    "approvedAt": "2026-05-25T00:31:12Z",
    "signature": "mgr-sig-20260525-88471",
    "reason": "Approved for production incident handling during migration window. 30-day time-limited approval recommended."
  }
}
```

---

## Step 3 – Frontend Receives Approval and Dispatches Request

**Frontend**:
- Receives the signed `managerApproval` token.
- Closes the security modal.
- Shows temporary status: “Manager approval received. Executing action…”
- Attaches the token to the API request:

```ts
const payload = {
  userId: "user_0192" as UserID,
  newRole: "SuperAdmin",
  isHighRiskAdminAction: true,
  managerApproval: {
    approvalId: "approval_88471",
    traceId: "TRACE-20260525-USER-PROMO-042",
    approvedBy: "manager",
    approvedAt: "2026-05-25T00:31:12Z",
    signature: "mgr-sig-20260525-88471",
    reason: "Approved for production incident handling during migration window. 30-day time-limited approval recommended."
  }
};

await fetch(`/api/v1/users/${userId}/role`, {
  method: "POST",
  body: JSON.stringify(payload)
});
```

---

## Step 4 – Backend Validation and Execution

**@backend** receives the request.

**Validation steps** (mandatory per `high-risk-actions-managerapproval.md` and `domain-error-handling-standard.md`):

1. Checks `isHighRiskAdminAction === true`
2. Validates presence and structure of `managerApproval`
3. Verifies `managerApproval.approvedBy === "manager"`
4. (In real system) Validates cryptographic signature or secure reference

If any check fails → throws `HighRiskActionRequiresApprovalError`

**Execution**:

- Updates user role in database
- Creates audit log entry (see `audit-logging-standard.md`):

```ts
await auditLogRepository.create({
  traceId: "TRACE-20260525-USER-PROMO-042",
  actorId: "admin_007" as UserID,
  action: "USER_ROLE_ELEVATED_TO_SUPERADMIN",
  targetId: "user_0192" as UserID,
  beforeState: { role: "Admin" },
  afterState: { role: "SuperAdmin" },
  managerApprovalId: "approval_88471",
  reason: "Approved for production incident handling during migration window..."
});
```

- Returns success response with the used `approvalId`

---

## Step 5 – Frontend Feedback and Audit Visibility

**Frontend**:
- Shows success message: “Alice has been promoted to SuperAdmin. Action recorded with approval ID: approval_88471”
- (Optional but recommended) Shows link to view the audit trail entry for this action

**Audit log entry** is now queryable by authorized personnel (themselves subject to high-risk approval if they want to view full details).

---

## Key Governance Elements Demonstrated

- User cannot bypass the security modal
- Reason is mandatory and travels with the approval
- @manager performs explicit risk assessment before issuing the token
- Backend strictly validates the token before any state change
- Full audit trail is created with reference to the approval
- Trace ID connects the entire flow (UI → Hermes → Backend → Audit)

This is the expected behavior for any high-risk action in a corporate project using Agent Enderun.

**Anti-patterns shown as forbidden in this simulation**:
- Frontend directly calling the API without the modal and approval
- Backend executing the role change without validating `managerApproval`
- Skipping audit logging for a privileged action
- Re-using an old approval token without fresh @manager review
