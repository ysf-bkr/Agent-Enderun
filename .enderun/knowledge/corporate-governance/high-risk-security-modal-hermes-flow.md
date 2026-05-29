# High-Risk Security Modal + Hermes Briefing Flow (Frontend Pattern)

**Owner:** @frontend  
**Related:** high-risk-actions-managerapproval.md

## When to Use
Any UI action that can result in a high-risk backend operation (see list in high-risk-actions document).

## Required UI Behavior

1. **Trigger Detection**
   - The component must recognize that the intended action is high-risk (role elevation, bulk ops, etc.).

2. **Security Modal (Mandatory)**
   - Modal must be prominent (red/danger styling, large title "High-Risk Administrative Action").
   - Must clearly state what is about to happen and the potential impact.
   - Must contain a required free-text "Reason" field (this becomes part of the approval token).
   - Must have clear "Cancel" and "Request Manager Approval" actions.
   - Should not be dismissible by clicking outside while the request is in flight.

3. **Hermes Briefing Flow**
   - On "Request Manager Approval":
     - Frontend sends a Hermes message to @manager containing:
       - Proposed action
       - Affected entities (e.g. userId)
       - User-entered reason
       - Current user context
     - UI enters "Awaiting @manager approval" state (loading indicator + clear message).

4. **Approval Reception**
   - When @manager responds with a valid `managerApproval` token (via Hermes or secure channel), the frontend:
     - Attaches the token to the request payload (`isHighRiskAdminAction: true`, `managerApproval`).
     - Dispatches the actual API call.
     - Shows success/failure feedback.

5. **Audit & Traceability**
   - The Trace ID from the approval must be visible or logged in the UI success state.
   - The full approval reason must be recorded.

## Anti-Patterns (Forbidden)
- Performing the high-risk API call without the modal + reason.
- Faking or locally generating the `managerApproval` object in the browser.
- Hiding the risk from the user ("just click confirm").
- Re-using old approval tokens.

## Recommended Component Location
`apps/web/src/components/ui/HighRiskSecurityModal.tsx` (or similar compound component).

This pattern ensures that high-risk actions are never accidental and always carry a full audit trail through @manager.
