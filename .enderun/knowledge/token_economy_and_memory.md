# Token Economy & Agent Memory

This document defines the operating rules for managing token consumption while preserving full agent capabilities and maintaining a usable, persistent memory across sessions.

## Purpose

- Reduce prompt cost and improve response speed by delivering only the relevant context to each agent.
- Preserve a persistent project memory and per-agent private context so agents can recall prior actions and decisions without re-reading the entire codebase.
- Keep all agents fully capable: do not shrink agent roles or rules to save tokens.
- Use memory as a structured retrieval layer, not as a replacement for agent intelligence.

## Key Principles

### 1. Memory First, Not Memory Only

- Agents must always start by checking the persistent project memory and agent context before taking action.
- If the required information is already stored, the agent should use the stored summary instead of reading the full history or code again.
- Memory retrieval reduces repeated context, but agents still keep their full capability set intact.

### 2. Separate Persistent Memory from Live Context

- `PROJECT_MEMORY.md` is the shared project brain: phase, active tasks, decisions, release tracking.
- `memory-graph/shared-facts.json` is the shared facts store: tech stack, policy roster, contract location, active policies.
- `memory-graph/agent-contexts/{agent}.json` is private context for each agent.
- Use `get_agent_context` and `update_agent_context` for agent-specific memory.
- Use `read_project_memory` and `get_memory_insights` for project-wide state.

### 3. Keep Memory Summaries Short and Relevant

- Store only the essence of what changed, why it changed, and what remains pending.
- Do not duplicate entire logs or every code snippet.
- For long histories, preserve the last 3–5 key decisions in active memory and archive older details in a separate file if needed.

### 4. Use Tools, Not Manual Copying

- The available tools are the only safe way to read or write memory:
  - `read_project_memory`
  - `update_project_memory`
  - `get_agent_context`
  - `update_agent_context`
  - `get_memory_insights`
  - `update_shared_facts`
- Do not bypass them with raw file reads or writes.

### 5. Token Economy Rules

- Always `search_codebase` or `get_project_gaps` before reading large files.
- Prefer summaries over raw content.
- Only include the minimum relevant file snippets in prompts.
- Do not resend the same context multiple times in one session.
- Use `get_memory_insights` to extract the latest active tasks and decisions rather than reading the full `PROJECT_MEMORY.md` every time.

## Memory and Token Flow

### Session Startup

1. `read_project_memory` to restore the active phase, trace, tasks, and history.
2. `get_agent_context` for the current agent.
3. `get_memory_insights` for a compact summary of recent activity.
4. If the previous session is not fresh, use the agent context summary instead of reloading full histories.

### During Work

- When a user asks a question, first determine whether the answer depends on:
  - current project status,
  - active trace,
  - recent decisions,
  - per-agent execution state.
- If yes, retrieve the appropriate memory object and include only the relevant summary.
- If code context is needed, fetch only the directly impacted file or function.

### End of Session

- `update_project_memory` for `HISTORY` and `ACTIVE TASKS`.
- `update_agent_context` with a short summary of the work performed and the current agent state.
- Optionally `update_shared_facts` if the change affects shared policies, tech stack, or contract status.

## Agent Context Format

Agents should keep their private context small and specific.

Example file: `.enderun/memory-graph/agent-contexts/manager.json`

```json
{
  "lastSession": "2026-05-28T12:00:00Z",
  "lastTraceId": "01H7G8K5TJ5S6MF9Z7H8N4C2P",
  "recentDecisions": [
    "Release 0.8.8 metadata synchronization",
    "Do not reduce agent capability for token economy"
  ],
  "pendingReview": [
    "Token economy memory protocol draft",
    "Project phase transition strategy"
  ],
  "updatedAt": "2026-05-28T12:00:00Z"
}
```

## Memory Usage Guidelines

- `@manager`: stores strategic decisions, active task summaries, and phase transitions.
- `@orchestrator`: stores DAG state, task dependencies, and agent handoff summaries.
- `@analyst`: stores verification findings, rejected issues, and quality gate status.
- `@frontend`, `@backend`, `@security`, `@qa`: store recent implementation context, verification outcomes, and compliance notes.

## Avoiding Token Inefficiency

- Do not send the whole `PROJECT_MEMORY.md` in every prompt.
- Only include the relevant `ACTIVE TASKS`, `CRITICAL DECISIONS`, and the current trace if necessary.
- Use `get_memory_insights` to get a compact summary rather than full data.
- Avoid attaching full file contents unless the task requires precise code changes.

## When to Archive History

- If `PROJECT_MEMORY.md` history grows beyond 10 entries, move older entries into `.enderun/memory-graph/archive/`.
- Keep the active history list focused on recent strategic changes and release-critical decisions.
- The archive is still part of the project brain, but not part of every prompt.

## Summary

Token economy in Agent Enderun is not about limiting agent power.
It is about using structured memory, summaries, and retrieval tools so every agent can remember prior work and still operate at full capability.

- Keep agent rules intact.
- Use `PROJECT_MEMORY.md` for shared state.
- Use `agent-contexts` for private agent memory.
- Use the memory tools to read and update memory.
- Only include what is relevant in prompts.
