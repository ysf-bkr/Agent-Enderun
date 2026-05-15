# TECH STACK & ARCHITECTURE

## Core Technologies

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React 19 + Vite (SPA) | Modern, fast, and scalable UI layer. |
| **Styling** | Panda CSS | Type-safe, zero-runtime CSS-in-JS for high performance. |
| **Backend** | Node.js (Fastify/Hono) | High-performance, schema-driven backend architecture. |
| **Database** | PostgreSQL (Kysely) | Type-safe SQL builder for robust data management. |
| **Orchestration** | Agent Enderun (v0.5.0) | Multi-agent autonomous governance framework. |

## Architectural Patterns

- **Contract-First Development:** All API and data models are defined in `packages/shared-types` before implementation.
- **Branded Types Law:** All unique identifiers must be branded to prevent type-collision and runtime errors.
- **Zero Mock Policy:** Real integration with database/services is preferred over fragile mocks (except for external 3rd-party APIs).
- **Phase-Based Execution:** Development follows a strict state machine (Discovery → Architecture → Core → Integration → Optimization).

## MCP Framework Intelligence

The project uses a modular Model Context Protocol (MCP) server for agent tooling:
- **Codebase:** Intelligence, dependency graphs, and AST-based search.
- **Security:** Automated audits and constitution compliance scanning.
- **Academy:** Strategic briefing, performance metrics, and agent memory.
- **Hermes:** Standardized inter-agent messaging protocol.
- **Knowledge:** Structured Obsidian-style Wiki for persistent technical context.

## Monorepo Structure

```text
/
├── apps/               # Production applications (web, backend, etc.)
├── packages/           # Shared libraries
│   ├── shared-types/   # Single source of truth for types
│   └── framework-mcp/  # Core MCP tools and logic
└── .enderun/           # Governance, memory, and logs
```
