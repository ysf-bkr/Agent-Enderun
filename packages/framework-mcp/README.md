# AI-Enderun MCP Server v0.0.9

English | [Türkçe](#türkçe)

The `ai-enderun-mcp` package provides the Model Context Protocol server for AI-Enderun. It gives AI clients a structured way to inspect the codebase, audit conventions, manage project memory, and verify contract integrity.

## English

### Purpose

This package acts as the execution bridge between AI clients and the local repository.

### Included Capabilities

- **Framework Status & Memory:** High-level overview of active phases and tasks.
- **Search & Discovery:** AST-powered dependency analysis and codebase search.
- **Contract Verification:** Ensures shared types match the stored contract hash.
- **Security Audit:** Scans for anti-patterns (console.logs, raw SQL, etc.).
- **Structured Logging:** Centralized JSON logging for multi-agent traceability.

### Main Tools

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

### Development

```bash
cd packages/framework-mcp
npm install
npm run build
npm run dev
```

### Framework Role

This package reads and interprets:

- `.gemini/` for memory, logs, dashboards, and SOP files.
- `docs/` for project-facing documentation.
- `packages/shared-types/` for contract verification.

## Türkçe

`ai-enderun-mcp`, AI-Enderun için Model Context Protocol (MCP) sunucusunu sağlar. AI istemcilerine (Gemini, Claude vb.) kod tabanını incelemek, kuralları denetlemek, proje hafızasını yönetmek ve kontrat bütünlüğünü doğrulamak için yapısal bir arayüz sunar.

### Yetenekler

- **Framework Durumu & Hafıza:** Aktif fazlar ve görevlerin üst düzey özeti.
- **Arama & Keşif:** AST tabanlı bağımlılık analizi ve kod tabanı araması.
- **Kontrat Doğrulama:** Paylaşılan tiplerin kayıtlı hash ile eşleştiğinden emin olur.
- **Güvenlik Denetimi:** Anti-pattern'leri tarar (console.log, ham SQL vb.).
- **Yapısal Loglama:** Çoklu ajan takibi için merkezi JSON loglama.

### Kurulum

```bash
cd packages/framework-mcp
npm install
npm run build
npm run dev
```

## License

MIT
