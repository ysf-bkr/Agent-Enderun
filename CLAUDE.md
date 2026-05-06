# AI Agent Framework — Claude Code Adapter (v1.0.5)

This file is the Claude Code adapter layer.
Core framework rules and agent capabilities are defined in `./Gemini.md`.

## Mandatory Startup

1. Read `./Gemini.md` completely (single source of truth).
2. Read `.gemini/PROJECT_MEMORY.md` (`MEVCUT DURUM`, `AKTİF GÖREVLER`, `HISTORY`).
3. Read relevant SOP files in `.gemini/agents/`.
4. Use MCP tools before opening files directly when possible.

## Agent Capability Preservation Rule

- Do not redefine agent roles in this file.
- Do not fork or duplicate `.gemini/agents/*` content.
- Treat `.gemini/agents/*` as the canonical skill source for all clients.

## Claude-Specific Notes

- Follow Claude Code conventions for tool usage and file edits.
- Keep outputs aligned with the same phase discipline from `Gemini.md`.
- If any instruction conflicts, `Gemini.md` has higher priority.

## MCP (Claude Code)

Use the existing MCP server configuration and tools:
- `get_framework_status`
- `search_codebase`
- `analyze_dependencies`
- `get_memory_insights`
- `get_project_gaps`
- `security_audit_scan`

## Completion Requirement

At the end of each substantial task:
1. Update `.gemini/PROJECT_MEMORY.md` history.
2. Keep trace and phase fields consistent with performed work.
