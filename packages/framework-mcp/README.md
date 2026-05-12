# AI-Enderun MCP Server (v0.3.4)

English | [Türkçe](#türkçe)

The `ai-enderun-mcp` package is the core intelligence engine of the Agent Enderun framework, implementing the Model Context Protocol (MCP).

## English

### 🛠️ Categorized Tools

#### 🛡️ Security & Compliance
- `security_audit_scan`: Scans for secrets, raw SQL, and unsafe patterns using AST.
- `analyze_constitution_compliance`: Verifies adherence to `ENDERUN.md` rules.

#### 🧠 Framework & Memory
- `get_framework_status`: Retrieves active phase and status.
- `update_project_memory`: Atomic updates to project brain sections.
- `bootstrap_legacy_memory`: Auto-generates memory for existing projects.
- `read_project_memory`: Safe read access to the project brain.

#### 🔍 Codebase Intelligence
- `search_codebase`: Regex-powered semantic search.
- `analyze_dependencies`: Deep import tracking and dependency mapping.
- `analyze_codebase_intelligence`: Detects complexity spikes and dead code.
- `generate_dependency_graph`: Creates Mermaid architecture maps.
- `analyze_database_schema`: Generates Mermaid ER diagrams from migration code.

#### 📜 Contract Management
- `verify_api_contract`: Checks shared-types integrity via hashing.
- `update_contract_hash`: Synchronizes the contract versioning.
- `verify_contract_integrity`: Ensures API docs and types are in sync.

#### 🎓 Academy & Orchestration
- `log_agent_action`: Records traceable agent activities.
- `get_academy_performance`: Aggregates success rates across the team.
- `send_agent_message`: Facilitates inter-agent collaboration.
- `read_agent_messages`: Inbox management for specialized agents.
- `generate_strategic_briefing`: High-level executive performance summary.
- `generate_academy_progress_report`: Narrative overview of project milestones.

#### 📦 Repository & Git
- `validate_repository_health`: Pre-commit health checks (lint/test/build).
- `analyze_documentation_debt`: Scans for missing JSDoc and READMEs.
- `generate_semantic_commit_message`: Automated commit messages based on diffs.

---

## Türkçe

### 🛠️ Kategorize Edilmiş Araçlar

- **Güvenlik:** `security_audit_scan`, `analyze_constitution_compliance`.
- **Hafıza:** `get_framework_status`, `update_project_memory`, `bootstrap_legacy_memory`.
- **Zeka:** `search_codebase`, `analyze_dependencies`, `generate_dependency_graph`, `analyze_database_schema`.
- **Kontrat:** `verify_api_contract`, `update_contract_hash`, `verify_contract_integrity`.
- **Orkestrasyon:** `send_agent_message`, `log_agent_action`, `generate_strategic_briefing`.
- **Repo:** `validate_repository_health`, `analyze_documentation_debt`, `generate_semantic_commit_message`.

## License

MIT
