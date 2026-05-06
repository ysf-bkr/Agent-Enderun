# 🧠 ai-enderun-mcp (v0.0.1)

**Status:** 🛠️ Intelligence & Discovery Engine (Core)  
**Protocol:** Model Context Protocol (MCP) v1.0

**ai-enderun-mcp**, AI-Enderun'un "Beyni" ve "Gözü" olarak görev yapar. Bu paket, yapay zeka ajanlarının (Claude, Gemini vb.) yerel kod tabanınıza güvenli ve yapılandırılmış bir şekilde erişmesini sağlayan bir **Model Context Protocol (MCP)** sunucusudur.

[English](#english) | [Türkçe](#türkçe) | [Deutsch](#deutsch)

---

<a name="english"></a>

## 🇬🇧 English: Technical Overview

### 🛡️ Why MCP?
Modern AI models often struggle with "Context Drift" or limited awareness of large projects. This MCP server solves this by providing specialized tools that allow the AI to actively query your codebase, map dependencies, and understand the architectural state before making any changes.

### 🛠️ Available Tools (Capabilities)
The server exposes the following high-level tools to AI agents:

- **`search_codebase`**: Performs semantic and keyword-based searches.
- **`analyze_dependencies`**: Maps the relationship between files and packages.
- **`get_framework_status`**: Validates if the current project follows the `Gemini.md` constitution.
- **`read_memory`**: Directly interface with the `PROJECT_MEMORY.md`.

### 🚀 Integration Guide
Add this configuration to your AI client (e.g., `claude_desktop_config.json`):

```json
"mcpServers": {
  "ai-enderun-mcp": {
    "command": "npx",
    "args": ["-y", "ai-enderun-mcp"]
  }
}
```

---

<a name="türkçe"></a>

## 🇹🇷 Türkçe: Teknik Detaylar

### 🛡️ Neden MCP?
Modern yapay zeka modelleri genellikle büyük projelerde "Bağlam Kayması" (Context Drift) veya sınırlı farkındalık sorunları yaşarlar. Bu MCP sunucusu, yapay zekanın kod tabanınızı aktif olarak sorgulamasına, bağımlılıkları haritalandırmasına ve herhangi bir değişiklik yapmadan önce mimari durumu anlamasına olanak tanıyan özel araçlar sağlayarak bu sorunu çözer.

### 🛠️ Sunulan Araçlar (Yetenekler)
Sunucu, yapay zeka ajanlarına aşağıdaki üst düzey araçları sağlar:

- **`search_codebase`**: Semantik ve anahtar kelime tabanlı aramalar yapar.
- **`analyze_dependencies`**: Dosyalar ve paketler arasındaki ilişkiyi haritalandırır.
- **`get_framework_status`**: Mevcut projenin `Gemini.md` anayasasına uyup uymadığını doğrular.
- **`read_memory`**: Geçmiş bağlamı almak için doğrudan `PROJECT_MEMORY.md` ile etkileşim kurar.

### 🚀 Entegrasyon Rehberi
Bu yapılandırmayı AI istemcinize ekleyin (Örn: `claude_desktop_config.json`):

```json
"mcpServers": {
  "ai-enderun-mcp": {
    "command": "npx",
    "args": ["-y", "ai-enderun-mcp"]
  }
}
```

---

## 📜 Technical Requirements
- Node.js 20+
- MCP SDK (Model Context Protocol)

## 📜 License
MIT - Yusuf BEKAR
