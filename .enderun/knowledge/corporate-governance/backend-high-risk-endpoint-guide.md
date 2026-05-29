# High-Risk Endpoint Implementation Guide (@backend)

**Applies to**: Any backend endpoint that performs privileged or high-risk administrative actions.

**Goal**: Provide @backend with a concrete, production-grade implementation pattern that strictly enforces corporate governance.

---

## 1. Required Imports and Types

```ts
import { 
  UserID, 
  RoleID, 
  ManagerApproval, 
  HighRiskActionPayload 
} from '../types';
import { HighRiskActionRequiresApprovalError } from '../types/errors';
import { auditLogRepository } from '../repositories/audit-log.repository';
```

---

## 2. High-Risk Endpoint Pattern (Recommended Structure)

```ts
// apps/backend/src/routes/users/promote-to-superadmin.route.ts

interface PromoteToSuperAdminBody extends HighRiskActionPayload {
  userId: UserID;
  newRole: 'SuperAdmin';
}

fastify.post('/api/v1/users/:id/promote-to-superadmin', async (request, reply) => {
  const { id } = request.params;
  const body = request.body as PromoteToSuperAdminBody;

  // === MANDATORY HIGH-RISK GOVERNANCE CHECK ===
  if (!body.isHighRiskAdminAction || !body.managerApproval) {
    throw new HighRiskActionRequiresApprovalError(
      'Promotion to SuperAdmin is a high-risk action',
      { requiredFields: ['isHighRiskAdminAction', 'managerApproval'] }
    );
  }

  // Validate managerApproval structure
  const approval = body.managerApproval;
  if (approval.approvedBy !== 'manager') {
    throw new HighRiskActionRequiresApprovalError('Approval must be issued by @manager');
  }

  // Optional: Add time-based or policy-based validation here
  // (e.g., approval must be less than 15 minutes old)

  const targetUserId = id as UserID;

  // === EXECUTE THE PRIVILEGED ACTION ===
  const updatedUser = await userService.promoteToSuperAdmin(targetUserId);

  // === AUDIT LOGGING (MANDATORY) ===
  await auditLogRepository.create({
    traceId: approval.traceId,
    actorId: request.user.id as UserID,           // the person who triggered the action
    action: 'USER_PROMOTED_TO_SUPERADMIN',
    targetId: targetUserId,
    beforeState: { role: updatedUser.previousRole },
    afterState: { role: 'SuperAdmin' },
    managerApprovalId: approval.approvalId,
    reason: approval.reason,
  });

  return {
    success: true,
    user: updatedUser,
    approvalUsed: approval.approvalId,
  };
});
```

---

## 3. Error Handling

Always throw typed domain errors:

- Use `HighRiskActionRequiresApprovalError` when governance requirements are not met.
- Never return generic 403 or 400 with vague messages.

---

## 4. Testing Requirements (Testable Rules)

Every high-risk endpoint **must** have the following test cases:

- [ ] Request without `isHighRiskAdminAction` → `HighRiskActionRequiresApprovalError`
- [ ] Request without `managerApproval` → `HighRiskActionRequiresApprovalError`
- [ ] `managerApproval.approvedBy !== 'manager'` → `HighRiskActionRequiresApprovalError`
- [ ] Valid approval token → Action succeeds + audit log is created
- [ ] Valid approval but action fails later → Audit log still created with failure status (if possible)

---

## 5. Anti-Patterns (Strictly Forbidden)

- Bypassing validation “because the frontend already checked”
- Logging the full `managerApproval.signature` in normal logs
- Skipping audit logging for “internal admin users”
- Using plain `string` for `userId` or `approvalId` inside the endpoint
- Returning raw error objects to the client

---

## 6. Integration Points

This pattern must be combined with:
- `domain-error-handling-standard.md`
- `audit-logging-standard.md`
- `branded-types-law.md`

@backend is responsible for refusing to implement any high-risk feature until the above three standards are satisfied in the design.

**Reference files** (must be read before implementation):
- `high-risk-actions-managerapproval.md`
- `high-risk-action-approval-flow-simulation.md`
- `corporate-project-scaffolding-sop.md`
