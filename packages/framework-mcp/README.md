# ai-enderun-mcp (v0.0.2)

`ai-enderun-mcp`, AI-Enderun ajanlarının projeyi güvenli biçimde taraması, sorgulaması ve hafıza görünürlüğü kazanması için kullanılan MCP sunucusudur.

## Paket Özeti

- Paket adı: `ai-enderun-mcp`
- Çalışma şekli: `stdio` transport
- Giriş noktası: `dist/index.js`
- Protokol: Model Context Protocol (MCP)

## Kurulum ve Build

```bash
cd packages/framework-mcp
npm install
npm run build
```

Geliştirme modu:

```bash
npm run dev
```

Üretim modu:

```bash
npm start
```

## MCP İstemci Konfigürasyonu

Örnek:

```json
{
  "mcpServers": {
    "framework-mcp": {
      "command": "node",
      "args": ["/abs/path/to/packages/framework-mcp/dist/index.js"]
    }
  }
}
```

## Tool Kataloğu

### Ana tool'lar

- `get_framework_status`
- `search_codebase`
- `analyze_dependencies`
- `get_memory_insights`
- `get_project_gaps`
- `security_audit_scan`
- `update_project_memory`

### Uyumluluk alias'ları

- `codebase_status` -> `get_framework_status`
- `codebase_search` -> `search_codebase`
- `codebase_graph_query` -> `analyze_dependencies`
- `codebase_context` -> context artifact listing
- `codebase_context_search` -> markdown odaklı arama

## Güvenlik ve Yazma Kapsamı

- Path escape engeli var (`resolveSafePath`): proje kökü dışı erişim reddedilir.
- Kod dosyaları üzerinde yazma yoktur.
- Sadece kontrollü hafıza güncellemesi desteklenir:
  - `update_project_memory` -> `MEVCUT DURUM`, `HISTORY`, `AKTİF GÖREVLER`
- Hafıza güncellemesinde lock dosyası kullanılır (`PROJECT_MEMORY.md.lock`).

## Pratik Örnekler

### Kod arama

```json
{
  "name": "search_codebase",
  "arguments": {
    "query": "trace:new",
    "extension": "js"
  }
}
```

### Bağımlılık analizi

```json
{
  "name": "analyze_dependencies",
  "arguments": {
    "path": "bin/cli.js"
  }
}
```

### Hafıza içgörüsü

```json
{
  "name": "get_memory_insights",
  "arguments": {}
}
```

## Yayın İçeriği

Paket sadece aşağıdakileri yayınlar:

- `dist/`
- `README.md`
- `package.json`

Kontrol:

```bash
npm pack --dry-run
```

## Sorun Giderme

- `Tool not found`:
  - İstemci eski cache tutuyor olabilir; MCP sunucusunu yeniden başlatın.
- `Memory is locked`:
  - Aynı anda başka işlem yazıyor olabilir, kısa süre sonra tekrar deneyin.
- `Path escapes project root`:
  - `path` argümanını proje köküne göre relatif verin.

## Lisans

MIT
