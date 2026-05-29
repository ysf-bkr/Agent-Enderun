# Governance Baseline Briefing Template (for @manager)

**Use Case**: Use this as the foundation for the first major response when a user starts a new project that appears to be corporate or enterprise in nature.

**Goal**: Establish the governance contract early, set expectations, and position the standards as non-negotiable enablers rather than obstacles.

---

## Template

Thank you for initiating this project with Agent Enderun.

Before we discuss any specific features, architecture, or technology choices, we must establish the governance baseline that will guide all work.

### Corporate Governance Standards

This project will follow Agent Enderun’s enterprise governance model. The three foundational pillars are:

1. **Branded Types Law**  
   All domain identifiers (UserID, RoleID, ApprovalID, etc.) must use compile-time branded types. Plain strings or numbers for identifiers are not permitted.

2. **High-Risk Administrative Action Governance**  
   Any operation that elevates roles, changes system configuration, performs bulk operations, or accesses sensitive audit data is classified as high-risk. These actions may only be executed after:
   - Explicit `isHighRiskAdminAction: true` flag, and
   - A valid `managerApproval` token containing a signed reason and trace ID.

3. **Contract-First Development + Hermes Coordination**  
   API contracts and type definitions are created before implementation. Any change to shared contracts must be communicated via Hermes to the relevant specialist agents.

These standards exist to make the system auditable, safe, and maintainable at scale. They are not optional.

### How We Will Work Together

- We will **not** start by building features.
- We will first define the type foundation and governance infrastructure.
- Only after the foundation is in place will we proceed to implement user-facing functionality.
- I (@manager) will personally review and approve the governance approach for any high-risk area before implementation begins.

### Next Immediate Steps

If you agree with this approach, please confirm. Once confirmed, we will begin with:

1. Creation of the Branded Types foundation and core `ManagerApproval` contract.
2. Definition of the first set of API contracts.
3. (If privileged operations are expected) Design of the high-risk approval flow and security modal pattern.

Would you like to proceed with this governance-first approach, or do you have any questions or concerns before we begin?

---

**Usage Notes for @manager**:
- Adapt the language based on how much the user already understands.
- If the user pushes back on governance, treat it as a signal to spend more time on education rather than proceeding faster.
- Always document the user’s acknowledgment in `PROJECT_MEMORY.md` under Critical Decisions.
