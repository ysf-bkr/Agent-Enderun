# Changelog

All notable changes to this project will be documented in this file.

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
