---
title: Zero UI Library Policy
tags: [design, security, compliance]
related: [responsive_design_standards]
last_updated: 2026-05-15
---

The project strictly follows the Zero UI Library Policy. Importing external UI frameworks like shadcn/ui, MUI, or Chakra UI is forbidden. All styling must be implemented using Panda CSS to ensure zero-runtime overhead and complete control over the design system.

## Rationale
- **Performance:** Zero-runtime CSS extraction.
- **Type Safety:** Type-safe styles and tokens.
- **Originality:** Unique and premium aesthetics without "library look".