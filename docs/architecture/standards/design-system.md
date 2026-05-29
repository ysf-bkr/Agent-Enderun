# Design System — Agent Enderun (Enterprise)

## 1. Design Philosophy
The Agent Enderun Design System focuses on **"Enterprise Clarity"**. Our interfaces are professional, minimalist tools designed to maximize data comprehension and operational speed. 

- **Clarity:** Every pixel must serve a purpose. If it doesn't aid understanding or action, remove it.
- **Consistency:** Uniform visual language across all applications.
- **Responsiveness:** Fluid adaptation to any screen size, from mobile to ultra-wide monitors.

## 2. Technical Requirements
- **Styling:** Panda CSS is MANDATORY. Tailwind, CSS-in-JS, and raw CSS modules are FORBIDDEN.
- **Zero UI Library:** No external components (MUI, AntD, Shadcn). All UI components must be built from scratch in `apps/web/src/components/ui/`.
- **Tokenization:** All values (colors, spacing, typography) MUST use `panda.config.ts` tokens. NO hardcoded pixels.
- **Responsiveness:** Mobile-First design is MANDATORY.

## 3. Responsive Mandate (Mobile-First)
- **Design Strategy:** Design for 320px width first.
- **Breakpoints:**
  - `sm`: 640px
  - `md`: 768px
  - `lg`: 1024px
  - `xl`: 1280px
  - `2xl`: 1536px
- **Layouts:** Use Flexbox and Grid. Fixed widths are FORBIDDEN. Use `clamp()` for fluid typography and spacing where applicable.
- **Reflow:** Content MUST gracefully wrap, stack, or collapse based on screen width without horizontal scrollbars.

## 4. UI/UX Interaction Standards
- **Interactions:** Hover, Active, and Disabled states are MANDATORY for all interactive elements.
- **Feedback:** Async operations MUST show Loading states and Toast notifications on completion/error.
- **Blocking Dialogues:** Native `alert()` and `confirm()` functions are **FORBIDDEN**. Use project-integrated `Modal` components for blocking user interactions and `Toaster` for non-blocking feedback.
- **Focus:** All interactive elements must have a visible `focus` state for accessibility.
