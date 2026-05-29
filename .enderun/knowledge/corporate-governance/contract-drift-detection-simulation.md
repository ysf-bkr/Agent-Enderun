# Contract Drift Detection & Resolution Simulation

**Purpose**: This simulation shows how @analyst, @backend, @frontend, and @manager should handle a contract drift situation in a corporate project according to Agent Enderun standards.

**Scenario**: During development of the User Management module, @backend adds a new required field `lastLoginAt` to the `User` type without notifying the team.

---

## Step 1 – Drift is Detected

**@analyst** runs the contract integrity check (as per its responsibilities in the Corporate Project Scaffolding SOP).

**Detection**:
- `apps/backend/src/types/user.ts` has changed.
- `apps/web/src/types/api-contracts.ts` (frontend copy) does not contain the new field.
- Hash in `contract.version.json` has not been updated.

**@analyst** sends a Hermes message to @manager and @frontend:

```json
{
  "type": "contract_drift_detected",
  "traceId": "TRACE-20260525-CONTRACT-DRIFT-007",
  "payload": {
    "changedFile": "apps/backend/src/types/user.ts",
    "newField": "lastLoginAt: string",
    "frontendCopyStatus": "outdated",
    "severity": "high"
  }
}
```

---

## Step 2 – @manager Assessment

**@manager** receives the notification and loads:
- `branded-types-law.md`
- `corporate-project-scaffolding-sop.md`

**@manager response**:

This is a contract drift. Per our governance rules, no one may continue implementation on the affected feature until the drift is resolved.

**Immediate actions**:
1. @backend must pause any work depending on the new field.
2. @frontend must be briefed to update the local type copy.
3. @analyst will verify the fix and update the contract version.

I am now issuing a formal pause on the User detail feature until resolution.

---

## Step 3 – Resolution Process

**@backend** (after receiving the briefing):

Understood. I will not merge or continue work using the new field until the contract is synchronized.

**@frontend**:

I have updated `apps/web/src/types/api-contracts.ts` to include `lastLoginAt`.

**@analyst**:

- Verified that both backend and frontend types now match.
- Updated `contract.version.json` (MINOR version bump).
- Confirmed no other files are affected.

**@manager** (final resolution message):

Contract drift resolved.

- Backend and frontend types are now in sync.
- Contract version updated.
- Feature development on the affected area may resume.

All future type changes must follow the Hermes notification process defined in the Scaffolding SOP.

---

## Lessons from This Simulation

- Contract drift is treated as a serious governance issue.
- @analyst has real authority to pause work.
- @manager uses the standards to protect the project from technical debt.
- Resolution must be documented (even if small) in PROJECT_MEMORY.md.

**Reference files**:
- `branded-types-law.md`
- `corporate-project-scaffolding-sop.md`
- `corporate-project-kickoff-checklist.md`
