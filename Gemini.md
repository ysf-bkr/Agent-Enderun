# AI-Enderun — General Agent Adapter (v0.0.10)

This file is the general adapter layer for AI agents (Gemini, GPT-4o, etc.).
Core framework rules and agent capabilities are defined in `{{FRAMEWORK_DIR}}/ENDERUN.md`.

## Mandatory Startup

1. Read `{{FRAMEWORK_DIR}}/ENDERUN.md` fully (single source of truth).
2. Read `{{FRAMEWORK_DIR}}/PROJECT_MEMORY.md` (`CURRENT STATUS`, `ACTIVE TASKS`, `HISTORY`).
3. Read related SOP files in `{{FRAMEWORK_DIR}}/agents/`.
4. Prefer MCP tools before direct file reads when possible.

## Agent Capability Preservation Rule

- Do not duplicate agent role definitions here.
- Do not fork `{{FRAMEWORK_DIR}}/agents/*` into client-specific copies.
- Use `{{FRAMEWORK_DIR}}/agents/*` as the canonical capability source.

## MCP

Use the following MCP toolset:
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
1. Update `{{FRAMEWORK_DIR}}/PROJECT_MEMORY.md` history via `update_project_memory`.
2. Log the operation via `log_agent_action`.
3. Keep trace and phase fields consistent with performed work.
4. End your response with the **Agent Completion Report** defined in `ENDERUN.md`.
