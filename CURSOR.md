# AI-Enderun — Cursor Adapter (v0.0.9)

This file is the Cursor adapter layer.
Core framework rules and agent capabilities are defined in `{{FRAMEWORK_DIR}}/ENDERUN.md`.

## Mandatory Startup

1. Read `{{FRAMEWORK_DIR}}/ENDERUN.md` fully (single source of truth).
2. Read `{{FRAMEWORK_DIR}}/PROJECT_MEMORY.md` (`CURRENT STATUS`, `ACTIVE TASKS`, `HISTORY`).
3. Read related SOP files in `{{FRAMEWORK_DIR}}/agents/`.
4. Prefer MCP tools before direct file reads when possible.

## Agent Capability Preservation Rule

- Do not duplicate agent role definitions here.
- Do not fork `{{FRAMEWORK_DIR}}/agents/*` into Cursor-specific copies.
- Use `{{FRAMEWORK_DIR}}/agents/*` as the canonical capability source.

## Cursor-Specific Notes

- Apply Cursor workflow conventions for edits and reviews.
- Keep phase discipline and reporting aligned with `ENDERUN.md`.
- If any conflict appears, `GEMINI.md` has higher priority.

## MCP

Use the same MCP toolset:
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
