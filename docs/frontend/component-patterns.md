# Atomic Component Standards & Panda CSS Guidelines (v0.8.5)

All user interface developments inside the Agent Enderun framework must follow the **Fluid Component Protocol**. We strictly build component hierarchies following **Mobile-First Responsive Design** and type-safe styling using **Panda CSS**.

---

## 🚫 1. Absolute UI Policies

### A. Zero UI Library Policy
*   **The Law:** The use of external component libraries (e.g. TailwindCSS, Radix UI, Shadcn/ui, Material UI, Chakra UI, Ant Design) is strictly forbidden. 
*   **The Reason:** This ensures absolute design authenticity, maximum bundle optimization, zero dependency bloat, and fully controlled accessibility (WCAG 2.2 AA).
*   **Exception:** Low-level headless primitives (like `@radix-ui/react-dialog` for focus trapping or `sonner` for toast dispatchers) may be allowed, subject to direct approval by `@manager`.

### B. Shared Component First Policy
*   **The Law:** Defining reusable atomic components (Buttons, Inputs, Cards, Badges, Modals) inside page-level files is strictly forbidden.
*   **The Structure:** All atomic items must be created inside `apps/web/src/components/ui/` as focused, single-purpose, highly modular components.

---

## 🐼 2. Panda CSS Styling Standards

We utilize **Panda CSS** as our build-time type-safe CSS-in-JS engine. Raw inline styles or unmapped class names are completely banned.

### A. Styling Token Best Practices
Always leverage designated design tokens (colors, spacings, shadows) from the Panda config (`panda.config.ts`):

```tsx
import { css } from "../../styled-system/css";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

export function Button({ variant = "primary", className, children, ...props }: ButtonProps) {
  return (
    <button
      className={css(
        {
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          px: "4",
          py: "2.5",
          borderRadius: "md",
          fontSize: "sm",
          fontWeight: "medium",
          transition: "all 0.2s ease-in-out",
          cursor: "pointer",
          _disabled: { opacity: 0.5, cursor: "not-allowed" },
        },
        variant === "primary"
          ? {
              bg: "brand.primary",
              color: "white",
              _hover: { bg: "brand.primary.hover" },
            }
          : {
              bg: "transparent",
              color: "slate.700",
              border: "1px solid",
              borderColor: "slate.200",
              _hover: { bg: "slate.50" },
            }
      )}
      {...props}
    >
      {children}
    </button>
  );
}
```

### B. Mobile-First Fluid Responsiveness
Use array-based or object-based responsive syntax inside the `css` block. Never hardcode pixel values:

```typescript
// Enforce fluid flex layout across screen sizes
const containerStyle = css({
  display: "flex",
  flexDirection: { base: "column", md: "row" }, // Mobile-first (column -> row on desktop)
  gap: { base: "4", lg: "8" },
  p: { base: "4", md: "6", xl: "8" }
});
```

---

## ♿ 3. Accessibility & QA Gates (WCAG 2.2)

1.  **Aria Standards:** All custom interactive elements (dropdowns, mobile navigation draw-ins, accordion blocks) must support full keyboard navigation (Tab, Enter, Space) and have valid `aria-*` tags.
2.  **Vitest Verification:** A component must never be merged into master without an accompanying test file (`[component].test.tsx`) that verifies the component renders correctly and responds to user click actions.
