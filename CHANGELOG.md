# CHANGELOG

All notable changes to this project will be documented in this file.

## [0.0.13] — 2026-05-08

### 🚀 Global Synchronization & Stabilization
- **Unified Versioning:** Synchronized v0.0.13 across all packages, CLI constants, agent SOPs, and documentation files.
- **Template Collision Fix:** Resolved a critical bug where `${entity}` in agent SOPs caused Gemini CLI template validation errors.
- **Full SOP Alignment:** Updated all 8 specialist agents with consistent header and footer versioning.

## [0.0.11] — 2026-05-08

### 🛡️ Resilience & Self-Healing Enhancements
- **Self-Healing Memory Lock:** Added a 2-minute stale lock detection and auto-override to `.enderun/agents/analyst.md` to prevent deadlocks during crashes.
- **MCP Fallback Mechanism:** Updated `@manager` with a critical fallback protocol. If the MCP server is down, agents automatically switch to direct file operations (`read_file`, `replace`).
- **QA Loop Prevention:** Introduced a strict "Max 3 Rejections" rule in `@manager` SOP to stop infinite agent-analyst correction loops and request user intervention.
- **Unified Versioning:** Synchronized v0.0.11 across all packages, CLI constants, and agent SOPs.

## [0.0.10] — 2026-05-08

### 🛡️ Super-Stabilization & Multi-AI Compatibility
- **Claude Code Fix:** Renamed `resource` variable in `@backend` SOP to prevent template validation errors.
- **Automated Git Orchestration:** The `init` command now automatically runs `git init` if a repository is not detected.
- **Proactive @git Agent:** Updated the `@git` specialist SOP to handle repository initialization autonomously.
- **Init Pathing Hardened:** Fixed a critical bug where the constitution and memory files were misplaced during initialization.
- **Agent Loading Fix:** Added mandatory YAML frontmatter to the `@git` specialist to resolve loading errors.
- **Unified Versioning:** Synchronized v0.0.10 across all packages, CLI constants, and agent SOPs.
- **Memory Scaffolding:** Ensured `PROJECT_MEMORY.md` is created in the correct adapter-specific folder.
- **Linker Placement:** Ensured `GEMINI.md`, `CLAUDE.md`, and `CURSOR.md` stay in the project root for optimal tool detection.

## [0.0.9] — 2026-05-08

### 🚀 Major Structural & Clean Root Enhancements
- **8th Specialist Agent (@git):** Introduced a dedicated Version Control Specialist to handle atomic commits and snapshots.
- **Specialized CLI Commands:** Added unique commands for all 8 agents (e.g., `git:snapshot`, `code:scan`, `ui:audit`) to the core CLI dictionary.
- **Omni-Adapter .gitignore:** Automatically handles log and lock exclusions for Gemini, Claude, Cursor, and Codex.
- **Adapter-Specific Folders:** Replaced the fixed `.enderun` folder with dynamic folders named after the selected adapter (e.g., `.gemini`, `.claude`).
- **Clean Root Policy:** Moved framework assets (`ENDERUN.md`, agent instructions) into hidden folders to reduce project clutter.
- **Non-Destructive Scaffolding:** `init` command now preserves existing user documentation in the root `docs/` folder.
- **Dynamic Path Detection:** System-wide support for adapter-specific folders in CLI, MCP, and Agent SOPs.
- **Environment Scaffolding:** Automatically includes `.env.example` in the core project setup.
- **Smarter MCP:** Upgraded MCP server to dynamically detect the project's framework folder and standardized tool descriptions to English.

## [0.0.8] — 2026-05-08

### 🏗️ Build Automation
- **Automated Root Scripts:** `init` command now automatically injects an `enderun:build` script into the target `package.json` for easy framework compilation.
- **Enhanced Diagnostics:** Improved `check` command to point users directly to the automated build script when components are missing.

## [0.0.7] — 2026-05-08

### 🚀 Major Structural & Disciplinary Enhancements

- **Health Check System:** Introduced the `ai-enderun check` command to verify framework integrity and MCP server readiness.
- **Manager Hardening:** Updated `@manager` SOP with a mandatory MCP health check protocol during session startup.
- **Git Orchestration:** Actively manages the `@git` agent. Signals when to perform atomic commits and mandates phase-based snapshots during DoD transitions.
- **Documentation Decoupling:** Separated user requirements (root `docs/`) from framework constitution and technical rules (`.enderun/docs/`).
- **Memory Hardening & Continuity:** Established the **Procedural Continuity** principle. All agent SOPs updated to mandate consistency with existing code patterns and stylistic standards.
- **Smart Init System:** Upgraded CLI `init` command with post-install hooks. Automatically creates `.gemini/agents` symlinks and provides Claude Code MCP setup guidance.
- **Trace ID Standardization:** Completed the project-wide transition to 26-character **ULID** for all tasks and historical records.
- **Agent SOP v0.0.7-v0.0.9:** Synchronized all 8 agent files (@manager, @analyst, @backend, @frontend, @explorer, @mobile, @native, @git) with the latest framework version and continuity rules.

### 🚀 Major MCP Framework Enhancements

- **AST-Based Analysis:** Upgraded `analyze_dependencies` in MCP from simple Regex to `ts-morph` AST analysis for highly accurate dependency mapping.
- **Native Contract Tools:** Introduced `verify_api_contract` and `update_contract_hash` tools to MCP, eliminating fragile, OS-dependent Bash commands.
- **Robust Logging System:** Added `log_agent_action` tool for structured JSON logging, preventing file corruption caused by naive text appending.
- **Smart Lock Management:** Implemented a stale-lock detection mechanism (2-minute timeout) for `.enderun/PROJECT_MEMORY.md.lock` to prevent agents from getting permanently blocked after a crash.

### ✨ Improvements

- **Security Audit Accuracy:** Rewrote `security_audit_scan` regex patterns with negative lookbehinds to drastically reduce false-positives (e.g., ignoring `console.log` in comments).
- **Dynamic Gap Detection:** Upgraded `get_project_gaps` to dynamically scan `.enderun/agents/` directory for missing agent log files instead of using hardcoded paths.
- **Optimized Search:** Made `search_codebase` case-insensitive and memory-efficient by streaming results and applying a hard cap on matches.
- **Agent SOP Updates:** Updated `@analyst`, `@backend`, `@manager`, and `@explorer` to exclusively use the new native MCP tools.

---

## [0.0.5] — 2026-05-08

### 🚀 Major Changes

- **Brand Transformation:** Renamed the project from `ai-agent-framework` to **AI-Enderun**. Updated CLI commands accordingly.
- **ID Standard (ULID):** Migrated from UUID v4 to **ULID** (Universally Unique Lexicographical Sortable Identifier) for better database performance and chronological sortability.
- **Design System (Panda CSS):** Completely removed Tailwind CSS and integrated the type-safe, zero-runtime **Panda CSS**.
- **Zero UI Library Policy:** Banned the use of ready-made libraries like `shadcn/ui`, `MUI`; enforced original component construction using Panda CSS.
- **English Transition:** Migrated all documentation, agent SOPs, and project rules to English (Bilingual READMEs maintained).

### ✨ Improvements

- **API Response Standard:** Forbidden returning `200 OK` for errors; enforced real HTTP status codes (4xx, 5xx).
- **Documentation:** Modernized all README files with a professional bilingual structure.
- **Build Process:** Added central build scripts covering all packages to the root directory.

### 🐛 Bug Fixes

- Fixed repository URL errors during npm publish.
- Resolved name conflicts in CLI help texts.

---

## [0.0.4] — 2026-05-07

- Initial stable release preparations.
- Strengthened MCP server infrastructure.
- Created core agent SOPs.
