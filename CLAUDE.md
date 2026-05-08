# AI-Enderun — Claude Code Adapter (v0.1.0)

This file is the Claude Code adapter layer.
Core framework rules and agent capabilities are defined in `./ENDERUN.md`.

## Mandatory Startup

1. Read `./ENDERUN.md` completely (single source of truth).
2. Read `.enderun/PROJECT_MEMORY.md` (`CURRENT STATUS`, `ACTIVE TASKS`, `HISTORY`).
3. Read relevant SOP files in `.enderun/agents/`.
4. Use MCP tools before opening files directly when possible.

## Agent Capability Preservation Rule

- Do not redefine agent roles in this file.
- Do not fork or duplicate `.enderun/agents/*` content.
- Treat `.enderun/agents/*` as the canonical skill source for all clients.

## Claude-Specific Notes

- Follow Claude Code conventions for tool usage and file edits.
- Keep outputs aligned with the same phase discipline from `ENDERUN.md`.
- If any instruction conflicts, `ENDERUN.md` has higher priority.

## MCP (Claude Code)

Use the existing MCP server configuration and tools:
- `get_framework_status`
- `search_codebase`
- `analyze_dependencies`
- `get_memory_insights`
- `update_project_memory`
- `get_project_gaps`
- `security_audit_scan`
- `verify_api_contract`
- `update_contract_hash`
- `log_agent_action`

## Completion Requirement

At the end of each substantial task:
1. Update `.enderun/PROJECT_MEMORY.md` history via `update_project_memory`.
2. Log the operation via `log_agent_action`.
3. Keep trace and phase fields consistent with performed work.
4. End your response with the **Agent Completion Report** defined in `ENDERUN.md`.
