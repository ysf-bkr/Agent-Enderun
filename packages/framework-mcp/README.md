# 🧠 ai-enderun-mcp (v0.0.2)

**Durum:** 🛠️ Zeka ve Keşif Motoru (Çekirdek)  
**Protokol:** Model Context Protocol (MCP) v1.0

**ai-enderun-mcp**, AI-Enderun framework'ünün "Duyuları" ve "Analiz Motoru"dur. Bu paket, yapay zeka ajanlarının (Claude, Gemini, Cursor vb.) kod tabanınıza güvenli, semantik ve yapılandırılmış bir şekilde erişmesini sağlayan bir **Model Context Protocol (MCP)** sunucusudur.

---

## 🛠️ Sunulan Araçlar (Yetenekler)

Sunucu, yapay zeka ajanlarına aşağıdaki profesyonel araçları sağlar:

| Araç | Açıklama |
| :--- | :--- |
| **`get_framework_status`** | Projenin aktif fazını, anayasa uyumluluğunu ve genel durumunu raporlar. |
| **`search_codebase`** | Kod tabanında semantik ve regex tabanlı derin aramalar yapar. Mantık ve desen bulmak için idealdir. |
| **`analyze_dependencies`** | Belirli bir dosya veya klasörün bağımlılıklarını ve import zincirini analiz eder. |
| **`get_memory_insights`** | `PROJECT_MEMORY.md` ve `BRAIN_DASHBOARD.md` dosyalarını analiz ederek bağlam özetleri sunar. |
| **`get_project_gaps`** | Proje yapısını `Gemini.md` standartlarına göre tarar ve eksik döküman/dosyaları tespit eder. |
| **`security_audit_scan`** | Kod tabanını; hardcoded secret'lar, raw SQL kullanımı ve güvensiz async desenleri için tarar. |

---

## 🚀 Entegrasyon Rehberi

### Claude Desktop (macOS/Windows)
`~/Library/Application Support/Claude/claude_desktop_config.json` dosyanıza ekleyin:

```json
{
  "mcpServers": {
    "ai-enderun-mcp": {
      "command": "node",
      "args": ["/yol/to/base/packages/framework-mcp/dist/index.js"]
    }
  }
}
```

### Geliştirme Modu
Yerel olarak test etmek için:
```bash
npm run dev # packages/framework-mcp dizininde
```

---

## 🛡️ Güvenlik Politikası
- **Path Escape Prevention:** Araçlar, proje kök dizini dışındaki dosyalara erişimi engeller.
- **Read-Only Operations:** MCP araçları sadece okuma ve analiz yapar, kod üzerinde değişiklik yapamaz (değişiklikler ajanlar tarafından önerilir).
- **Audit Logging:** Her MCP çağrısı sistem tarafından loglanır.

---

## 📜 Lisans
MIT - Yusuf BEKAR
