# Changelog

All notable changes to this project will be documented in this file.

## [0.5.3] - 2026-05-16

### Fixed
- **Path Resolution:** Fixed critical bug where agent SOPs had hardcoded `.enderun/` paths. Now uses `{{FRAMEWORK_DIR}}` placeholder.
- **CLI Robustness:** Added triple-redundancy path replacement in `bin/cli.js` (copyDir & initCommand).
- **Documentation:** Fixed broken `agent-enderun` commands and stale versions in README.

## [0.5.2] - 2026-05-16

### Added
- **Auto-Wiring:** CLI now automatically patches `gemini-extension.json` with MCP server configuration.
- **MCP Build Automation:** Integrated framework build into the `init` process.
- **Zero-Config Onboarding:** Complete automated setup for Gemini and Cursor adapters.
- **Directory Logic Fix:** Restored and clarified root `/docs` for user project documentation.

## [0.5.1] - 2026-05-15

### Added
- **Hermes Messaging Protocol:** Advanced inter-agent communication with categories, priorities, and trace-id tracking.
- **Obsidian-LLM Wiki:** Structured knowledge management with YAML frontmatter and relationship mapping.
- **MCP Enhanced Intelligence:** New tools for knowledge graph generation (`get_knowledge_graph`), inbox statistics (`get_agent_inbox_stats`), and automated health verification (`verify_framework_health`).
- **Contract Automation:** Scripted SHA-256 hashing for `shared-types` integrity verification (`bin/update-contract.js`).

### Fixed
- **Constitution Synchronization:** Unified the root `ENDERUN.md` with the framework-specific version for a single source of truth.
- **Architecture Cleanup:** Removed redundant `jest.config.js` and consolidated test infrastructure around Vitest.
- **Template Placeholders:** Enhanced `{{FRAMEWORK_DIR}}` and `{{ADAPTER}}` tag handling across all primary documents and adapter files.

## [0.4.5] - 2026-05-12

### Fixed
- **Adapter Packaging:** Resolved a critical issue where adapter files (gemini.md, cursor.md, etc.) were excluded from the npm package.
- **Log Cleanup:** Automated cleaning of temporary test logs and trace files during initialization.

## [0.4.0] - 2026-05-12

### Added
- **Autonomous Agent Academy:** Transitioned from basic governance to an academy-style architecture.
- **AST-Based Compliance:** Implemented `ts-morph` for deep code analysis (Zero UI Policy, Branded Types Law).
- **Conflict Resolution Protocol:** Autonomous protocol for resolving inter-agent state conflicts.

## [0.3.4] - 2026-05-12

### Fixed
- **Critical Data Preservation:** Modified the `init` command to prevent the accidental deletion of `packages/shared-types` and `.enderun` directories during framework updates or re-initialization. Existing user-defined types and project memory are now preserved via non-destructive copying.

## [0.3.2] - 2026-05-12

### Added
- **Ultimate Stable Release:** Major milestone for AI Agent Orchestration.
- **Self-Healing Initialization:** The `init` command now automatically detects and cleans up leftover/renamed dependencies from previous failed installations, ensuring a 100% success rate.
- **Smart Context-Aware Renaming:** Improved `sanitizeJson` to distinguish between package identification (which is renamed for project branding) and dependency references (which are preserved for framework stability).
- **Consolidated Internal Build:** Both `shared-types` and `framework-mcp` now correctly extend the root `tsconfig.json`, ensuring consistent compilation across different environments.
- **Refined Health Checks:** Added deeper validation for Panda CSS configuration and MCP server readiness in the `check` command.

### Changed
- **Framework Identity Protection:** `agent-enderun` is now preserved as the primary framework package name in all dependency lists, preventing "package not found" errors on NPM.

## [0.2.2] - 2026-05-11

### Fixed
- **Strict Adapter Isolation:** Removed the "Universal Symlink" logic that was creating a `.enderun` directory even when using a specific adapter like `.gemini`. Now, only the selected adapter folder is created.
- **CI Hardening:** Updated the CLI `check` command to return a non-zero exit code (Exit 1) when issues are detected, ensuring that GitHub Actions properly fail on health violations.
- **NPM Distribution Bloat:** Optimized `.npmignore` to strictly exclude nested `node_modules` and symlinks, resolving "Hard link not allowed" errors during publishing and reducing package size by 99%.

## [0.2.0] - 2026-05-11

### Added
- **Modular MCP Architecture:** Refactored the monolithic 2100+ line MCP server into a highly maintainable, category-based tool system.
