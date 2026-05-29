# Agent Enderun — Grok / X.ai Adapter

This is the primary entry point when using Agent Enderun within the Grok / X.ai ecosystem.

The framework operates under a unified governance structure located in the `.enderun/` directory.

### Primary Constitution
All governance rules, agent checklists, and project memory live here:

👉 **[.enderun/ENDERUN.md](.enderun/ENDERUN.md)**

### 🤖 Agent Directive
You are operating under the Agent Enderun governance framework.

At the **start of every session**, before any work:
1. **Restore Memory:** Read `.enderun/PROJECT_MEMORY.md` to restore state, active Trace ID, and history.
2. **Load Identity:** Read the relevant agent definition under `.enderun/agents/{agent}.md` (default to `@manager`).
3. **Internalize Knowledge:** Reference the `.enderun/knowledge/` base for architectural and coding standards.

### 🛡️ Core Mandates
- **Surgical Edits:** Use `replace_text` or `patch_file` via MCP for precise changes.
- **Traceability:** Every action must inherit the active Trace ID from memory.
- **Contract First:** No implementation without verified types.

All paths and references inside the project must comply with the Supreme Constitution located at `.enderun/ENDERUN.md`.
