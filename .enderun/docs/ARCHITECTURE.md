# AI-Enderun Architecture Guide

## Repository Layout

```text
ai-enderun/
|-- .enderun/                # AI operating assets, memory, dashboards, logs, SOP files
|   |-- agents/
|   |-- logs/
|   |-- PROJECT_MEMORY.md
|   `-- BRAIN_DASHBOARD.md
|-- docs/                    # Project documentation only
|   |-- api/
|   |-- ARCHITECTURE.md
|   |-- WIKI.md
|   |-- tech-stack.md
|   |-- project-docs.md
|   `-- agent-interaction.md
|-- packages/
|   |-- framework-mcp/
|   `-- shared-types/
|-- bin/
|-- ENDERUN.md
|-- GEMINI.md
|-- CLAUDE.md
|-- CURSOR.md
|-- CODEX.md
`-- package.json
```

## Separation of Concerns

- `docs/` contains product, architecture, API, and implementation-facing documentation.
- `.enderun/` contains operational AI assets such as memory, logs, dashboards, and role SOPs.
- `packages/shared-types/` contains the shared contract layer.
- `packages/framework-mcp/` contains the MCP integration layer.

## Contract-First Flow

1. Define or update shared contracts in `packages/shared-types/src/`.
2. Document endpoint behavior in `docs/api/`.
3. Implement backend and frontend against the same contract.
4. Verify hash consistency through the framework workflow.

## Memory and Traceability

- `.enderun/PROJECT_MEMORY.md` is the persistent project memory.
- `.enderun/BRAIN_DASHBOARD.md` acts as the navigation surface for agent collaboration.
- `.enderun/logs/` stores structured agent activity logs.
- New task chains should use ULIDs for traceability.

## Quality Standards

- Prefer typed boundaries and explicit contracts.
- Avoid `any` in production code.
- Avoid `console.log` in final code paths.
- Keep public documentation readable and version-aware.
- Maintain a strict difference between project docs and AI runtime assets.

## v0.0.6 Focus

- English as the default documentation language.
- Bilingual README files for public entry points.
- `docs/` for project docs and `.enderun/` for AI-generated operational assets.
- Consistent contract-first messaging across adapters, agents, and packages.
