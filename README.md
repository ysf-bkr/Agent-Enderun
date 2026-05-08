# AI-Enderun (v0.0.10 Master)

[English](#english) | [Türkçe](#türkçe)

---

# English

AI-Enderun is a **Supreme Performance AI Orchestration Framework** designed to transform AI assistants into disciplined, specialized, and highly efficient engineering collaborators. It bridges the gap between raw AI capabilities and enterprise-grade engineering standards through a **Constitutional System**, **Persistent Project Memory**, and a **Multi-Agent Orchestration Layer**.

Starting from **v0.0.10 Master**, the framework implements a **"Clean Root" Policy**, relocating all AI-specific logic, memory, and specialized instructions into hidden, adapter-specific directories (e.g., `.gemini/`, `.claude/`), preserving your project root for pure production code and requirements.

## 🎖️ Core Pillars

- **The Constitution (ENDERUN.md):** A project-wide set of laws that all AI clients must follow, ensuring stylistic and architectural continuity.
- **The Digital Brain (PROJECT_MEMORY.md):** A sortable, persistent memory using **ULIDs** to track every decision, task, and historical change.
- **Specialized Orchestration:** A team of 8 distinct agent specialists, each governed by its own SOP (Standard Operating Procedure).
- **Contract-First Architecture:** Forced synchronization between Backend and Frontend via `shared-types` and API Contract registries.
- **Zero UI Library Policy:** Maximizing architectural originality and performance by enforcing **Panda CSS** and banning generic UI libraries (shadcn/ui, MUI, etc.).

## 🚀 Getting Started

```bash
# 1. Initialize the framework (Choose your adapter: gemini, claude, cursor, codex)
npx ai-enderun init gemini

# 2. Set up the environment
npm install && npm run enderun:build

# 3. Verify health
ai-enderun check
```

1.  **Define the Mission:** Fill in `docs/project-docs.md` (Requirements) and `docs/tech-stack.md`.
2.  **Start a Trace:** Every task needs a Trace ID (ULID). Run `ai-enderun trace:new "Task description"`.
3.  **Collaborate:** Talk to your AI. It will autonomously read the Constitution and activate the necessary specialist.

## 👥 The 8 Specialists (Agent Academy)

AI-Enderun orchestrates 8 specialized roles, found in `.<adapter>/agents/`:

| Agent | Role | Tech Stack |
| :--- | :--- | :--- |
| **@manager** | CTO & Controller | Orchestration, ULID, Memory Mgmt |
| **@analyst** | QA & Memory Gate | DoD Audit, Documentation, Walkthroughs |
| **@backend** | Backend Architect | Node.js, Fastify, Kysely, PostgreSQL |
| **@frontend** | UI/UX Architect | React 19, Vite, Zustand, Panda CSS |
| **@explorer** | Investigator | AST Analysis, Dependency Mapping |
| **@mobile** | App Specialist | React Native, Expo, Performance |
| **@native** | Desktop Architect | Tauri, Electron, OS Integration |
| **@git** | VC Specialist | Git CLI, Atomic Commits, Snapshots |

## 🛠️ MCP Toolset (Advanced Intelligence)

The **AI-Enderun MCP Server** exposes specialized tools to your AI assistant:

- **`get_framework_status`:** Check the active phase and health.
- **`search_codebase`:** Memory-efficient, case-insensitive search.
- **`analyze_dependencies`:** AST-based (ts-morph) dependency tree mapping.
- **`get_memory_insights`:** Summarized insights from the Project Memory.
- **`security_audit_scan`:** Detects unsafe code (any, console.log) via AST analysis.
- **`verify_api_contract`:** Validates code against the shared API documentation.
- **`log_agent_action`:** Records structured JSON logs for traceability.

---

# Türkçe

AI-Enderun, yapay zeka yardımcılarını disiplinli, uzmanlaşmış ve yüksek verimli mühendislik ekip arkadaşlarına dönüştürmek için tasarlanmış **Üstün Performanslı AI Orkestrasyon Çerçevesidir**. Ham yapay zeka yetenekleri ile kurumsal düzeydeki mühendislik standartları arasındaki köprüyü; **Anayasal Sistem**, **Kalıcı Proje Hafızası** ve **Çoklu Ajan Orkestrasyon Katmanı** aracılığıyla kurar.

**v0.0.10 Master** sürümünden itibaren, framework **"Temiz Kök Dizin" (Clean Root)** politikasını uygular; tüm AI mantığını, hafızasını ve uzman talimatlarını adaptöre özel gizli dizinlere (örn: `.gemini/`, `.claude/`) taşıyarak proje kök dizininizi sadece üretim kodu ve gereksinimler için korur.

## 🎖️ Temel Sütunlar

- **Anayasa (ENDERUN.md):** Tüm AI istemcilerinin uyması gereken, stilistik ve mimari sürekliliği garanti eden kurallar dizisi.
- **Dijital Beyin (PROJECT_MEMORY.md):** Her kararı, görevi ve tarihsel değişikliği izlemek için **ULID** kullanan, sıralanabilir kalıcı hafıza.
- **Uzmanlaşmış Orkestrasyon:** Her biri kendi SOP'u (Standart Operasyon Prosedürü) ile yönetilen 8 farklı uzman ajan ekibi.
- **Sözleşme Öncelikli Mimari:** `shared-types` ve API Sözleşme sicilleri aracılığıyla Backend ve Frontend arasında zorunlu senkronizasyon.
- **Sıfır UI Kütüphanesi Politikası:** **Panda CSS** kullanımını zorunlu kılarak ve genel UI kütüphanelerini (shadcn/ui, MUI vb.) yasaklayarak mimari özgünlüğü ve performansı maksimize eder.

## 🚀 Başlangıç

```bash
# 1. Framework'ü kurun (Adaptörünüzü seçin: gemini, claude, cursor, codex)
npx ai-enderun init gemini

# 2. Ortamı hazırlayın
npm install && npm run enderun:build

# 3. Sağlık kontrolü yapın
ai-enderun check
```

1.  **Görevi Tanımlayın:** `docs/project-docs.md` (Gereksinimler) ve `docs/tech-stack.md` dosyalarını doldurun.
2.  **İz Başlatın:** Her görevin bir Trace ID'ye (ULID) ihtiyacı vardır. `ai-enderun trace:new "Görev açıklaması"` komutunu çalıştırın.
3.  **İşbirliği Yapın:** AI'nızla konuşun. Anayasayı otomatik olarak okuyacak ve gerekli uzman ajanı devreye alacaktır.

## 👥 8 Uzman (Ajan Akademisi)

AI-Enderun, `.<adapter>/agents/` dizininde bulunan 8 uzman rolü yönetir:

| Ajan | Rol | Teknoloji Yığını |
| :--- | :--- | :--- |
| **@manager** | CTO & Denetleyici | Orkestrasyon, ULID, Hafıza Yönetimi |
| **@analyst** | Kalite & Hafıza | DoD Denetimi, Dökümantasyon, Walkthrough |
| **@backend** | Backend Mimarı | Node.js, Fastify, Kysely, PostgreSQL |
| **@frontend** | UI/UX Mimarı | React 19, Vite, Zustand, Panda CSS |
| **@explorer** | Araştırmacı | AST Analizi, Bağımlılık Haritalama |
| **@mobile** | Mobil Uzmanı | React Native, Expo, Performans |
| **@native** | Masaüstü Mimarı | Tauri, Electron, OS Entegrasyonu |
| **@git** | Sürüm Kontrol Uzmanı | Git CLI, Atomik Commit'ler, Snapshot'lar |

## 🛠️ MCP Araç Seti (İleri Zeka)

**AI-Enderun MCP Sunucusu**, yapay zeka yardımcınıza özel araçlar sunar:

- **`get_framework_status`:** Aktif fazı ve sistem sağlığını kontrol eder.
- **`search_codebase`:** Hafıza verimli, büyük-küçük harf duyarsız arama.
- **`analyze_dependencies`:** AST tabanlı (ts-morph) bağımlılık ağacı haritalama.
- **`get_memory_insights` :** Proje hafızasından özetlenmiş içgörüler sunar.
- **`security_audit_scan`:** AST analizi ile güvenli olmayan kodları (any, console.log) tespit eder.
- **`verify_api_contract`:** Kodun paylaşılan API dökümantasyonuyla uyumunu doğrular.
- **`log_agent_action`:** İzlenebilirlik için yapılandırılmış JSON logları kaydeder.

---

## License

MIT - (c) 2026 Yusuf BEKAR
