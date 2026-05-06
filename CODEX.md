# AI Agent Framework — Codex Adapter (v1.0.5)

This file is the Codex adapter layer.
Core framework rules and agent capabilities are defined in `./Gemini.md`.

## Mandatory Startup

1. Read `./Gemini.md` fully (single source of truth).
2. Read `.gemini/PROJECT_MEMORY.md` (`MEVCUT DURUM`, `AKTİF GÖREVLER`, `HISTORY`).
3. Read related SOP files in `.gemini/agents/`.
4. Prefer MCP tools before direct file reads when possible.

## Agent Capability Preservation Rule

- Do not duplicate agent role definitions here.
- Do not fork `.gemini/agents/*` into Codex-specific copies.
- Use `.gemini/agents/*` as the canonical capability source.

## Codex-Specific Notes

- Follow Codex edit/validation workflow conventions.
- Keep phase discipline and reporting aligned with `Gemini.md`.
- If any conflict appears, `Gemini.md` has higher priority.

## MCP

Use the same MCP toolset:
- `get_framework_status`
- `search_codebase`
- `analyze_dependencies`
- `get_memory_insights`
- `get_project_gaps`
- `security_audit_scan`
