# Security Modal + Hermes Briefing Component Implementation Guide (@frontend)

**Applies to**: Any UI flow that can trigger high-risk administrative actions.

**Goal**: Provide @frontend with a concrete, reusable, and governance-compliant pattern using Panda CSS and proper state management.

---

## 1. Component Architecture (Recommended)

```
apps/web/src/components/ui/
├── HighRiskSecurityModal/
│   ├── HighRiskSecurityModal.tsx
│   ├── HighRiskSecurityModal.types.ts
│   └── HighRiskSecurityModal.styles.ts   (Panda CSS)
├── hooks/
│   └── useHighRiskApproval.ts            (Hermes briefing logic)
```

---

## 2. Core Types

```ts
// HighRiskSecurityModal.types.ts
import { ManagerApproval, TraceID } from '../../../types/api-contracts';

export interface HighRiskActionContext {
  actionType: string;           // e.g. "PROMOTE_TO_SUPERADMIN"
  targetId: string;
  targetDescription: string;
}

export interface HighRiskApprovalResult {
  approved: boolean;
  managerApproval?: ManagerApproval;
}
```

---

## 3. Hook: useHighRiskApproval (Hermes Coordination)

```ts
// hooks/useHighRiskApproval.ts

export function useHighRiskApproval() {
  const [status, setStatus] = useState<'idle' | 'awaiting_manager' | 'approved' | 'rejected'>('idle');
  const [approval, setApproval] = useState<ManagerApproval | null>(null);

  const requestApproval = async (context: HighRiskActionContext, reason: string) => {
    setStatus('awaiting_manager');

    // In real implementation, this sends a Hermes message to @manager
    const hermesMessage = {
      type: 'high_risk_approval_request',
      traceId: generateTraceId() as TraceID,
      payload: {
        action: context.actionType,
        targetId: context.targetId,
        reason,
      },
    };

    // Simulated Hermes round-trip (in real system this would be async via MCP/tools)
    const response = await sendHermesToManager(hermesMessage);

    if (response.status === 'approved') {
      setApproval(response.managerApproval);
      setStatus('approved');
      return { approved: true, managerApproval: response.managerApproval };
    } else {
      setStatus('rejected');
      return { approved: false };
    }
  };

  return { status, approval, requestApproval };
}
```

---

## 4. Security Modal Component (Panda CSS)

```tsx
// HighRiskSecurityModal.tsx

import { css } from '../../../styled-system/css';

interface Props {
  isOpen: boolean;
  context: HighRiskActionContext;
  onClose: () => void;
  onApproved: (approval: ManagerApproval) => void;
}

export function HighRiskSecurityModal({ isOpen, context, onClose, onApproved }: Props) {
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { status, approval, requestApproval } = useHighRiskApproval();

  const handleRequestApproval = async () => {
    if (!reason.trim()) return;

    setIsSubmitting(true);
    const result = await requestApproval(context, reason);

    if (result.approved && result.managerApproval) {
      onApproved(result.managerApproval);
      onClose();
    }
    setIsSubmitting(false);
  };

  if (!isOpen) return null;

  return (
    <div className={css({ position: 'fixed', inset: 0, bg: 'rgba(0,0,0,0.7)', zIndex: 1000 })}>
      <div className={css({
        bg: 'white',
        maxW: '480px',
        mx: 'auto',
        mt: '10vh',
        p: '6',
        borderRadius: 'lg',
        border: '2px solid {colors.red.600}',
      })}>
        <h2 className={css({ color: 'red.600', fontSize: 'xl', fontWeight: 'bold' })}>
          ⚠️ High-Risk Administrative Action
        </h2>

        <p className={css({ mt: 3 })}>
          You are about to perform: <strong>{context.actionType}</strong><br />
          Target: {context.targetDescription}
        </p>

        <label className={css({ display: 'block', mt: 4, fontWeight: 'medium' })}>
          Reason for this action (required for audit and approval):
        </label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className={css({ w: 'full', h: '100px', mt: 2, p: 3, border: '1px solid gray' })}
          placeholder="Explain why this privileged action is necessary..."
        />

        <div className={css({ display: 'flex', gap: 3, mt: 5 })}>
          <button onClick={onClose} disabled={isSubmitting}>
            Cancel
          </button>
          <button
            onClick={handleRequestApproval}
            disabled={isSubmitting || !reason.trim()}
            className={css({ bg: 'red.600', color: 'white' })}
          >
            {status === 'awaiting_manager' 
              ? 'Waiting for @manager approval via Hermes...' 
              : 'Request Manager Approval'}
          </button>
        </div>

        <p className={css({ fontSize: 'xs', color: 'gray.500', mt: 4 })}>
          This action will be fully audited. A valid managerApproval token is required.
        </p>
      </div>
    </div>
  );
}
```

---

## 5. Usage in a Page

```tsx
const handlePromoteClick = (user: User) => {
  setSelectedUser(user);
  setModalOpen(true);
};

const handleApproved = (approval: ManagerApproval) => {
  // Now safe to call the high-risk API with the token
  promoteUser(user.id, approval);
};
```

---

## 6. Anti-Patterns (Forbidden)

- Calling high-risk API endpoints directly from event handlers
- Generating fake `managerApproval` objects on the client
- Making the modal dismissible while the Hermes request is in flight
- Storing approval tokens in localStorage for later reuse
- Skipping the “reason” field

---

## 7. Testing Requirements

- Modal appears when high-risk action is triggered
- API call is blocked until valid approval is received
- Reason field is mandatory
- Proper error states when @manager rejects the request

**Reference files**:
- `high-risk-security-modal-hermes-flow.md`
- `high-risk-action-approval-flow-simulation.md`
- `corporate-project-scaffolding-sop.md`
