# Blueprint-Driven Construction & Evolution

## Overview
Blueprint-Driven Construction is the primary method for building and expanding the Agent Enderun ecosystem. It ensures that every new application or feature is built upon a "Gold Standard" foundation.

## Core Mechanics

### 1. Discovering Capabilities
Agents must use the `list_blueprints` tool to find existing architectural patterns, UI components, and logic hooks before writing any code.

### 2. Instantiating Standards
Once a blueprint is identified, the `instantiate_blueprint` tool is used to clone the template into the target application directory.
- **Example:** Cloning `backend/errors` into `apps/backend/src/errors`.

### 3. Dynamic Evolution (Capability Growth)
When an agent develops a high-quality, reusable solution (e.g., a complex data table or a specific auth service), they MUST save it as a new blueprint using the `save_as_blueprint` tool.
- **Goal:** The `blueprints/` directory is not static; it grows as the project tackles more complex challenges.

## Guidelines for Agents
- **Consistency first:** Always check for a blueprint before building from scratch.
- **Refinement:** If an existing blueprint is outdated, update it via `save_as_blueprint` after a successful implementation.
- **Documentation:** Always provide a description when saving a new blueprint to help other agents understand its purpose.
