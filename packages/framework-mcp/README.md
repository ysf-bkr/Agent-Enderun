# 🔌 @ai-enderun/framework-mcp (v0.0.5)

AI-Enderun Model Context Protocol (MCP) sunucusu. Bu paket, AI ajanlarınızın projeniz üzerinde derinlemesine analiz yapmasını, hafızayı yönetmesini ve mimari boşlukları tespit etmesini sağlayan özel araçlar (tools) sunar.

## 🛠️ Sağlanan Araçlar (Agent Tools)

Ajanlar bu araçları kullanarak projenize "dokunabilirler":

- **`search_codebase`**: Kod tabanında semantik ve metinsel arama yapar.
- **`analyze_dependencies`**: Dosyalar ve modüller arası bağımlılık grafiğini çıkarır.
- **`get_memory_insights`**: `.gemini/PROJECT_MEMORY.md` üzerinden projenin o anki state'ini özetler.
- **`update_project_memory`**: Proje hafızasına güvenli ve kilitli (lock) yazma işlemi yapar.
- **`get_project_gaps`**: Dökümantasyon, test veya kontratlardaki eksikleri tespit eder.

## ⚙️ Kurulum ve Yapılandırma

`mcp.json` dosyanızda sunucuyu şu şekilde tanımlayabilirsiniz:

```json
{
  "mcpServers": {
    "ai-enderun-mcp": {
      "command": "node",
      "args": ["packages/framework-mcp/dist/index.js"]
    }
  }
}
```

## 🔨 Geliştirme ve Build

Sistemi derlemek için:

```bash
cd packages/framework-mcp
npm install
npm run build
```

Geliştirme modunda (build gerektirmeden) çalıştırmak için:

```bash
npm run mcp:dev
```

## 📜 Kurallar

- Hiçbir ajan bir dosyayı körü körüne okumamalıdır; her zaman önce `search_codebase` veya `get_memory_insights` ile bağlamı taramalıdır.
- Araçlar, AI-Enderun Anayasası'ndaki (`Gemini.md`) güvenlik sınırları içinde çalışır.

## 📜 Lisans

MIT
