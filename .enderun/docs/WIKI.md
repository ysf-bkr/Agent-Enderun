# Project Wiki

This wiki is the central index for project documentation.

## Quick Links

- [Architecture]({{FRAMEWORK_DIR}}/ARCHITECTURE.md): Repository structure, boundaries, and workflow model.
- [Tech Stack]({{FRAMEWORK_DIR}}/tech-stack.md): Approved technologies and engineering standards.
- [Project Docs]({{FRAMEWORK_DIR}}/project-docs.md): Product scope and active development scenario.
- [Agent Interaction]({{FRAMEWORK_DIR}}/agent-interaction.md): Responsibility model and collaboration flow.
- [API Contracts]({{FRAMEWORK_DIR}}/api/README.md): Endpoint documentation and contract index.

## Documentation Rules

- Keep project-facing documentation inside `docs/`.
- Keep AI memory, logs, and generated operational artifacts inside `{{FRAMEWORK_DIR}}/`.
- Update API references when shared contracts or endpoints change.
- Keep English as the primary documentation language.

## Collaboration Overview

- `@manager` coordinates direction and traceability.
- `@explorer` maps code context and impact zones.
- `@backend` owns backend architecture and contracts.
- `@frontend` implements UI against approved contracts.
- `@analyst` maintains memory quality, audits, and readiness.

## Update Policy

Review this wiki whenever repository structure, key standards, or documentation entry points change.
