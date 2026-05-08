# 🎖️ AI-Enderun Orchestration Framework (v0.0.5)

AI-Enderun, çoklu yapay zeka ajanlarını (Gemini, Claude, GPT) ortak bir anayasa (`Gemini.md`), faz tabanlı yürütme modeli ve kalıcı hafıza (`.gemini/PROJECT_MEMORY.md`) etrafında yöneten, yüksek disiplinli bir orkestrasyon çerçevesidir.

## 🏛️ Mimari Felsefe

Enderun usulü "Eğit ve Yönet" prensibiyle tasarlanan bu framework, yapay zekayı sadece bir araç olarak değil, projenin kurallarına (Anayasa) sıkı sıkıya bağlı profesyonel birer ekip üyesi olarak konumlandırır.

- **Contract-First:** Backend ve Frontend arasındaki iletişim her zaman `shared-types` üzerinden, kod yazılmadan önce başlar.
- **Zero UI Library Policy:** Estetik ve performans için hazır bileşen kütüphaneleri (shadcn, MUI) yerine **Panda CSS** ile özgün bileşen inşası zorunludur.
- **ULID Standard:** Tüm kimlikler, veritabanı performansı için kronolojik olarak sıralanabilir ULID formatındadır.
- **Proper API Design:** Hata yönetiminde gerçek HTTP durum kodları (4xx, 5xx) esastır; "200 OK + error" yapısı yasaklanmıştır.

## 👥 Ajan Kadrosu

| Ajan | Rol | Sorumluluk |
| :--- | :--- | :--- |
| **@manager** | CTO & Controller | Trace ID üretimi, görev dağıtımı ve faz geçiş onayı. |
| **@analyst** | QA Gate & Memory | Kalite denetimi, dökümantasyon ve hafıza tutarlılığı. |
| **@backend** | Architect | API kontratları, DB şeması ve iş mantığı. |
| **@frontend** | UI/UX Specialist | Panda CSS ile özgün arayüzler ve fluid tasarım. |
| **@explorer** | Research | Kod tabanı analizi, bağımlılık keşfi ve teknik araştırma. |

## 🛠️ Teknoloji Yığınımız

- **Core:** Node.js 20+ (ESM)
- **Frontend:** React 19 + Vite + Zustand + **Panda CSS**
- **Backend:** Fastify + Kysely + PostgreSQL
- **ID Standard:** ULID (26 karakter, sortable)
- **Monorepo:** npm Workspaces (Shared Types & Framework MCP)

## 🚀 Hızlı Başlangıç

### CLI Kurulumu
Framework'ü projenize dahil etmek ve komutları kullanmak için:

```bash
npx ai-enderun init
```

### Temel Komutlar
```bash
# Projenin anlık faz, görev ve trace durumunu gör
ai-enderun status

# Yeni bir görev zinciri (ULID) başlat
ai-enderun trace:new "Giriş sayfasının tasarımı" frontend P1

# Framework versiyonunu kontrol et
ai-enderun version
```

## 📦 Paket Yapısı

- `packages/shared-types`: Backend ve Frontend arasındaki tip sözleşmeleri.
- `packages/framework-mcp`: Agent yeteneklerini genişleten Model Context Protocol sunucusu.
- `.gemini/agents`: Ajanların davranışlarını ve kurallarını belirleyen SOP (Standard Operating Procedure) dosyaları.
- `.gemini/docs`: API spesifikasyonları ve teknik dökümantasyon.

## 📜 Anayasa (Gemini.md)

Projedeki her ajan, çalışmaya başlamadan önce `Gemini.md` dosyasını okumak ve buradaki kurallara %100 uymak zorundadır. Anayasaya aykırı kod yazımı (@analyst tarafından) reddedilir.

## 🛡️ Lisans

MIT © 2026 Yusuf BEKAR
