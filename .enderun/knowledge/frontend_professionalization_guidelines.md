# Frontend Professionalization Guidelines

**Version:** 1.0  
**Owner:** @manager  
**Last Updated:** 23 May 2026

## Purpose

This document defines the official **@frontend Professionalization Program** to close the critical risk item **"@frontend Weakness"** in the Risk Tracking Dashboard.

The goal is to elevate the @frontend agent from its current level (6.5) to a true **kurumsal (enterprise) grade** frontend architect (target: 9.0) within 6–8 weeks.

## Current Risk Assessment (23 May 2026)

- **Risk Name:** @frontend Weakness
- **Current Level:** 6.5 / 10
- **Target Level:** 9.0 / 10
- **Risk Severity:** Critical / High Risk
- **Main Weaknesses:**
  - Component architecture and composition patterns exist on paper but are not deeply enforced.
  - Accessibility (WCAG 2.2) is defined but lacks mandatory enforcement and audit mechanisms.
  - Performance engineering (Core Web Vitals, virtualization, bundle optimization) is superficial.
  - Testing discipline is present but coverage and quality expectations are not strictly applied in every task.
  - Integration with @manager (briefings, Hermes, high-risk admin flows) is still largely declarative.
  - Design System Governance lacks a formal evolution and review process.

## Professionalization Program — 6–8 Week Roadmap

### Phase 1 (Week 1–2): Foundation & Enforcement
- Make all existing "Recommended Patterns" in frontend.md **mandatory** (not optional).
- Add mandatory Accessibility Audit Checklist to every significant UI task.
- Introduce **Performance Budget** concept (define acceptable thresholds for bundle size, LCP, INP).
- Strengthen Completion Report with stricter checkboxes for accessibility and performance.

### Phase 2 (Week 3–4): Advanced Patterns & Testing
- Deepen Compound Component and Slots usage with real examples from the reference application (when built).
- Create official **Frontend Testing Blueprint** (unit + component + integration + contract).
- Define minimum coverage targets: 70% for new shared components, 85% for critical hooks.
- Add Visual Regression Testing requirement for design system components.

### Phase 3 (Week 5–6): Resilience, Performance & Hermes Integration
- Make Error Boundaries and Graceful Degradation mandatory on all complex pages.
- Introduce official Performance Optimization Blueprint (code splitting, virtualization, memoization, image optimization).
- Strengthen Hermes usage for high-risk admin flows (make `isHighRiskAdminAction` + `managerApproval` a hard requirement in all admin-related hooks).
- Add mandatory performance measurement step in the Completion Report.

### Phase 4 (Week 7–8): Governance, Review & Continuous Improvement
- Establish formal **Design System Evolution Process** (proposal → @manager review → approval → migration plan).
- Create @frontend Growth Task system (similar to other agents).
- Integrate @frontend performance and accessibility metrics into BRAIN_DASHBOARD.md.
- Close the "@frontend Weakness" risk item in the Risk Tracking Dashboard upon successful demonstration in a reference application.

## Mandatory Requirements (Non-Negotiable)

Any task involving @frontend must satisfy the following:

1. **Accessibility (WCAG 2.2 AA)**
   - All new components and pages must pass a basic accessibility checklist.
   - Keyboard navigation, ARIA attributes, and semantic HTML are mandatory.
   - Color contrast and focus states must be verified.

2. **Performance**
   - Every major feature must consider Core Web Vitals impact.
   - Lazy loading, code splitting, and virtualization must be evaluated for list/detail pages.
   - Bundle size impact must be measured and reported for new dependencies.

3. **Testing**
   - Every reusable component and custom hook must have tests.
   - Critical user flows must have at least one integration test.
   - Contract changes from backend must break frontend tests when applicable.

4. **High-Risk Admin & Hermes Integration**
   - All high-risk administrative actions in the UI must use the official `isHighRiskAdminAction` + `managerApproval` pattern.
   - Relevant hooks must integrate with Hermes when coordination with other agents is required.

5. **Design System Governance**
   - New components or tokens must be proposed to @manager before implementation.
   - Breaking changes require a documented migration plan.

## @manager Responsibilities

@manager is the owner of the @frontend Professionalization Program and must:

- Include specific @frontend growth tasks in every relevant briefing.
- Review and approve major design system changes.
- Track progress via the Risk Tracking Dashboard and BRAIN_DASHBOARD.md.
- Ensure that the reference application (when built) includes real-world examples of professional frontend patterns.
- Escalate repeated violations of accessibility, performance, or testing standards as leadership failures.

## Success Criteria (Risk Closure)

The "@frontend Weakness" risk can be closed when:

- @frontend agent consistently applies compound components, accessibility, and performance patterns in real tasks.
- A reference application demonstrates professional-grade frontend work (including high-risk admin flows with Hermes).
- @frontend Completion Reports show high compliance with the new mandatory requirements.
- Metrics in BRAIN_DASHBOARD.md show measurable improvement in @frontend quality.

## Related Documents

- `.enderun/agents/frontend.md` (main definition)
- `.enderun/knowledge/reference_application_guidelines.md`
- `docs/roadmap.md` → Risk Tracking Dashboard
- `PROJECT_MEMORY.md` → STRATEGIC ROADMAP

---

**This guideline is now part of the official agent knowledge base.** All agents, especially @manager and @frontend, must follow it when working on frontend-related tasks in kurumsal projects.
