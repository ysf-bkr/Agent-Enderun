# AI-Enderun MCP Server v0.0.6

English | [Turkce](#turkce)

The `ai-enderun-mcp` package provides the Model Context Protocol server for AI-Enderun. It gives AI clients a structured way to inspect the codebase, audit conventions, manage project memory, and verify contract integrity.

## English

### Purpose

This package acts as the execution bridge between AI clients and the local repository.

### Included Capabilities

- Framework status and memory insight tools.
- Search and dependency discovery helpers.
- Contract verification and contract hash updates.
- Security-oriented scans for common anti-patterns.
- Structured logging support for agent actions.

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

- `.enderun/` for memory, logs, dashboards, and SOP files
- `docs/` for project-facing documentation
- `packages/shared-types/` for contract verification

## Turkce

`ai-enderun-mcp`, AI-Enderun icin Model Context Protocol sunucusunu saglar. AI istemcilerine depoyu incelemek, kurallari denetlemek, proje hafizasini yonetmek ve kontrat butunlugunu dogrulamak icin yapisal bir arayuz verir.

### Icerik

- Framework durumu ve hafiza ozetleri
- Kod arama ve bagimlilik analizi
- Kontrat dogrulama ve hash guncelleme
- Yaygin anti-pattern taramalari
- Yapisal ajan loglama destegi

### Gelistirme

```bash
cd packages/framework-mcp
npm install
npm run build
npm run dev
```

## License

MIT
