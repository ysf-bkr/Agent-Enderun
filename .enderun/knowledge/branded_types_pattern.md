---
title: Branded Types Pattern
tags: [architecture, typescript, security]
related: [api_design_rules]
last_updated: 2026-05-15
---

To ensure type safety, use Branded Types for all IDs. Example: export type UserID = Brand<string, 'UserID'>. This prevents using a raw string where a specific ID is expected.