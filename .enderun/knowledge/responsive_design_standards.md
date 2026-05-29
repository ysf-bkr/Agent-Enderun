# Responsive Design Standards

To ensure cross-screen compatibility and prevent "design drift", all UI components must follow these standards.

## 1. Grid & Flex Patterns
- **Base:** Vertical stack for mobile (`flexDirection: "column"`).
- **Responsive:** Transition to horizontal or multi-column grid at `md` (768px) or `lg` (1024px) breakpoints.
- **Container:** Use a standard max-width container for desktop to prevent layouts from stretching too wide.

## 2. Fluid Typography & Spacing
- Use `clamp()` for font sizes that need to scale.
- Example: `fontSize: "clamp(1rem, 5vw, 2rem)"`.
- Use Panda CSS tokens for spacing (`gap`, `padding`, `margin`) to maintain rhythm.

## 3. Preservation of State
- When updating a component, keep the existing `useState`, `useEffect`, and `props` interfaces intact.
- Do not remove existing `data-` attributes or accessibility roles.

## 4. Breakpoint Reference
| Token | Min Width | Target Device |
| :--- | :--- | :--- |
| base | 0px | Mobile |
| sm | 640px | Large Mobile / Small Tablet |
| md | 768px | Tablet |
| lg | 1024px | Desktop |
| xl | 1280px | Large Desktop |
| 2xl | 1536px | Ultra-wide |
