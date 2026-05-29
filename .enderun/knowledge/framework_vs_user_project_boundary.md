# Framework vs User Project Boundary

This is one of the most important rules in Agent Enderun.

## The Core Principle

There is a strict separation between two things:

1. **The Agent Enderun Framework** (the tool)
   - Located in: `framework-mcp/`, `.enderun/`, `bin/`, root config files (`panda.config.ts`, etc.)
   - Purpose: Governance, agents, MCP tools, CLI, knowledge base, blueprints

2. **The User's Application** (what the user is actually building)
   - Located in: `apps/backend/`, `apps/web/`, `src/`, project source code
   - Purpose: The real product the user wants to ship

## Golden Rule

**When the user is developing their own application, agents must never touch or suggest changes inside the framework's own code.**

All new code, files, features, and modifications must happen **exclusively** inside the user's project structure.

### Forbidden Actions (When Building User's Project)
- Creating files in `framework-mcp/src/utils/`, `framework-mcp/src/tools/`, etc.
- Modifying agent definitions in `.enderun/agents/`
- Editing `panda.config.ts` at the root (unless the project itself uses it directly)
- Adding new MCP tools unless the explicit task is "improve the framework"

### Allowed Actions
- Creating files in `apps/backend/src/...`
- Creating files in `apps/web/src/...`
- Adding blueprints and knowledge under `.enderun/` **only** when improving the framework for everyone
- Updating project-specific configs inside the user's `apps/` or root project files

## Why This Rule Exists

Violating this boundary causes:
- Broken framework installations for the user
- Confusion between "framework code" and "application code"
- Agents suggesting nonsense like putting reCAPTCHA logic inside the MCP server
- Loss of trust in the agent system

## Manager's Responsibility

`@manager` is responsible for immediately stopping and correcting any agent that crosses this line. Repeated violations must be recorded in `PROJECT_MEMORY.md`.

## Summary

Framework = Tool  
User's code = The actual project

Never mix the two.
