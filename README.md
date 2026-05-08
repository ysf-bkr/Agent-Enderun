# AI-Enderun v0.0.9

English | [Turkce](#turkce)

AI-Enderun is an agent orchestration framework that turns AI assistants into disciplined engineering collaborators. It combines a constitutional rule set, project memory, shared contracts, and an MCP server so multiple AI clients can work with the same standards. **Starting from v0.0.9, AI-Enderun implements a 'Clean Root' policy, moving framework-specific files into adapter-specific hidden folders.**

---

## English

### What It Is

AI-Enderun provides a structured operating model for AI-driven software delivery.

- `ENDERUN.md` (now inside the adapter folder) defines the global constitution.
- `.<adapter>/` (e.g., `.gemini/`, `.claude/`) stores AI operating assets such as agent SOPs, memory, logs, and dashboards.
- `docs/` stores **User/Project Requirements** (e.g., `project-docs.md`, `requirements.md`).
- `packages/shared-types` stores the contract-first type layer.
- `packages/framework-mcp` exposes the MCP server and framework tools.
- `bin/cli.js` provides the `ai-enderun` CLI.

### 🚀 Getting Started

1.  **Initialize:** Run `npx ai-enderun init gemini` (or `claude`, `cursor`, `codex`).
2.  **Define Stack:** Fill in your project's technology stack in `docs/tech-stack.md`.
3.  **Define Requirements:** Place your project goals and user stories in the root `docs/project-docs.md` file.
4.  **Start Orchestration:** Generate your first Trace ID (ULID): `ai-enderun trace:new "Initial project setup"`
5.  **Collaborate:** Talk to your AI assistant. It will automatically detect the constitution and follow the specialized SOPs in `.<adapter>/agents/`.

### Directory Model

```text
.
|-- .<adapter>/             # e.g., .gemini/, .claude/, .enderun/
|   |-- agents/             # Agent SOP (Standard Operating Procedure) files
|   |-- docs/               # Framework-specific technical documentation
|   |   |-- ARCHITECTURE.md
|   |   `-- api/            # API Contracts (OpenAPI/Shared-types)
|   |-- logs/               # Structured JSON logs of agent actions
|   |-- PROJECT_MEMORY.md   # Single Source of Truth for project state
|   `-- ENDERUN.md          # The Supreme Constitution
|-- docs/                   # User project requirements (The "What" to build)
|   |-- project-docs.md
|   `-- tech-stack.md
|-- packages/
|   |-- framework-mcp/      # Core MCP server tools
|   `-- shared-types/       # Contract-first type definitions
|-- GEMINI.md / CLAUDE.md   # Linker files (if not moved inside adapter folder)
`-- package.json
```

### 🤖 The 8 Specialists (Agent Roles)

AI-Enderun defines 8 distinct roles, each with its own SOP (Standard Operating Procedure) in `.<adapter>/agents/`:

1.  **@manager (CTO & Controller):**
    *   **Tech:** Orchestration, ULID, Trace IDs, Project Memory.
    *   The orchestrator. Generates Trace IDs (ULID), selects the Execution Profile, and assigns tasks via a strict "Briefing Template."
    *   **Goal:** Maintain high-level discipline and ensure the project follows the `ENDERUN.md` rules.

2.  **@analyst (QA & Memory Gate):**
    *   **Tech:** Quality Assurance, DoD Audit, Memory Persistence.
    *   The auditor. Maintains `PROJECT_MEMORY.md`, audits phase transitions (DoD), and manages walkthroughs.
    *   **Goal:** Ensure no task is approved without meeting quality standards and maintaining architectural integrity.

3.  **@backend (Architect):**
    *   **Tech:** Node.js 20+, Fastify, Kysely (Query Builder), PostgreSQL, Branded Types.
    *   Responsible for "Contract-First" development and database schemas.
    *   **Goal:** Build secure, layered, and strictly typed server logic.

4.  **@frontend (UI/UX Architect):**
    *   **Tech:** React 19, Vite (SPA), Zustand, Panda CSS (Zero UI Policy).
    *   Enforces the "Zero UI Library Policy" (No shadcn/ui, no MUI).
    *   **Goal:** Build premium, fluid, and original interfaces from scratch using Panda CSS tokens.

5.  **@explorer (Investigator):**
    *   **Tech:** MCP Server, AST-based Analysis (ts-morph), Ripgrep.
    *   The research specialist. Scans the codebase, maps dependencies, and provides context to other agents.
    *   **Goal:** Eliminate "blind reading" and provide actionable architectural insights.

6.  **@mobile (App Specialist):**
    *   **Tech:** React Native, Expo, Native Modules.
    *   Expert in React Native and Expo. Focuses on mobile-first performance and native-feeling interactions.
    *   **Goal:** Extend the project's reach to iOS and Android with the same architectural discipline.

7.  **@native (Desktop Architect):**
    *   **Tech:** Tauri, Electron, Desktop Integrations.
    *   Expert in Tauri and Electron. Manages desktop-specific logic, security, and OS-level integrations.
    *   **Goal:** Deliver secure, lightweight desktop experiences.
8.  **@git (Version Control Specialist):**
    *   **Tech:** Git CLI, Atomic Commits, Phase Snapshots, Trace ID Tagging.
    *   The repository guardian. Responsible for atomic commits, phase snapshots, and maintaining a clean git history.
    *   **Goal:** Ensure 100% traceability and safe rollbacks using Trace IDs.

### Key Principles

- **Procedural Continuity:** Agents MUST follow existing code patterns and styles. "Finish how you started."
- **Contract-First:** No coding without approved `shared-types` and API documentation.
- **Memory-Driven:** Every agent checks `CRITICAL DECISIONS` in `PROJECT_MEMORY.md` before acting.
- **Proactive Engineering:** Agents autonomously implement professional standards (pagination, loading states, validation) without being prompted.
- **Search-Before-Reading:** Agents scan context using MCP tools before opening files.

### 💰 Token Efficiency & Smart Context

AI-Enderun is engineered to minimize costs while maximizing accuracy:
- **Search-Before-Reading:** Avoids dumping the entire codebase into the prompt.
- **Modular SOPs:** Specialized agents use small, focused instructions instead of monolithic prompts.
- **Phase-Based Workflow:** Narrow context windows by focusing only on current tasks.
- **Memory Consolidation:** Persistent `PROJECT_MEMORY.md` reduces the need for long message histories.

---

## Turkce

### Nedir

AI-Enderun, yapay zeka yardimcilarini disiplinli muhendislik ekip arkadaslarina donusturen bir orkestrasyon catiridir. Anayasa benzeri kurallar, kalici proje hafizasi, paylasilan kontratlar ve MCP sunucusu ile farkli AI istemcilerini ayni standartlarda toplar.

### 🤖 8 Uzman Ajan (Roller)

1.  **@manager (CTO & Denetleyici):** [ULID, Trace ID, Hafıza Yönetimi]
2.  **@analyst (Kalite & Hafıza):** [QA, DoD Audit, PROJECT_MEMORY.md]
3.  **@backend (Mimar):** [Node.js 20+, Fastify, Kysely, PostgreSQL, Branded Types]
4.  **@frontend (Arayüz Mimarı):** [React 19, Vite, Zustand, Panda CSS]
5.  **@explorer (Araştırmacı):** [MCP Server, AST Analysis (ts-morph), Ripgrep]
6.  **@mobile (Mobil Uzman):** [React Native, Expo, Mobil Performans]
7.  **@native (Masaüstü Mimarı):** [Tauri, Electron, OS-Level Integration]
8.  **@git (Sürüm Kontrol Uzmanı):** [Git CLI, Atomic Commits, Phase Snapshots]

### CLI Komutlari

```bash
ai-enderun init [adapter]    # Kurulum (gemini, claude, cursor)
ai-enderun status            # Proje durumunu ve aktif görevleri gösterir
ai-enderun trace:new <desc>  # Yeni bir görev zinciri (ULID) başlatır
ai-enderun check             # Sistem sağlık ve MCP kontrolü yapar
ai-enderun git:snapshot      # Faz bazlı git snapshot/tag oluşturur (@git)
ai-enderun code:scan         # Kod mimarisini ve bağımlılıkları tarar (@explorer)
ai-enderun ui:audit          # Arayüz ve Panda CSS denetimi yapar (@frontend)
ai-enderun verify-contract   # Kontrat uyumunu kontrol eder (@backend)
```

### 🚀 Başlangıç Rehberi

1.  **Kurulum:** `npx ai-enderun init gemini` (veya `claude`, `cursor`, `codex`) komutunu çalıştırın.
2.  **Teknoloji Yığınını Belirleyin:** `docs/tech-stack.md` dosyasını projenize göre doldurun.
3.  **Gereksinimleri Ekleyin:** Proje hedeflerinizi ve kullanıcı hikayelerinizi kök dizindeki `docs/project-docs.md` dosyasına yerleştirin.
4.  **Görevi Başlatın:** İlk görev zincirini (ULID) oluşturun: `ai-enderun trace:new "Proje iskeletini oluştur"`
5.  **Ajanlarla Çalışın:** Yapay zeka yardımcınızla konuşun. Artık projenizdeki anayasayı ve `.<adapter>/agents/` içindeki uzman rollerini tanıyarak disiplinli bir şekilde çalışacaktır.

### Ana Prensipler

- **Süreyisiz Süreklilik (Procedural Continuity):** Ajanlar mevcut kod düzenine ve stiline uymak zorundadır.
- **Sözleşme Öncelikli (Contract-First):** Onaylanmış `shared-types` ve API dökümanları olmadan kod yazılmaz.
- **Hafıza Odaklı:** Her ajan `PROJECT_MEMORY.md` üzerinden kararları kontrol eder.
- **Proaktif Mühendislik:** Ajanlar; sayfalama, yükleme ekranları ve doğrulama gibi standartları siz sormadan profesyonel düzeyde uygular.
- **Akıllı Tarama:** Gereksiz dosya okumak yerine sadece ilgili kısımları analiz eder.

### v0.0.9 Yenilikleri

- **8. Uzman Ajan (@git):** Atomik commit ve faz bazlı snapshot yönetimi için özel Git uzmanı eklendi.
- **Temiz Kök Dizin:** Framework dosyaları artık kök dizinde kalabalık yapmak yerine seçilen adaptörün gizli klasöründe (örn: `.gemini/`) toplanıyor.
- **Güvenli Kurulum:** `init` command artık kullanıcı dosyalarının üzerine yazmaz (Non-destructive).
- **Otomatik Derleme:** `package.json`'a eklenen `enderun:build` komutuyla tüm bileşenleri tek seferde derleyebilirsiniz.
- **Sağlık Kontrolü:** `ai-enderun check` komutu ile framework kurulumunu ve MCP sunucusunu anlık denetleyebilirsiniz.
- **Omni-Adapter .gitignore:** Tüm AI adaptörleri (Gemini, Claude vb.) için otomatik git güvenliği eklendi.

### 💰 Token Verimliliği ve Akıllı Bağlam

AI-Enderun, maliyetleri düşürmek ve doğruluğu artırmak için optimize edilmiştir:
- **Akıllı Tarama:** Tüm kod tabanını prompt'a yüklemek yerine sadece ilgili kısımları bulur ve okur.
- **Modüler SOP'lar:** Her ajan sadece kendi uzmanlık alanındaki talimatları okuyarak token tasarrufu sağlar.
- **Faz Bazlı Çalışma:** Sadece o anki göreve odaklanarak bağlam penceresini (context window) daraltır.
- **Hafıza Konsolidasyonu:** Proje geçmişini devasa mesaj geçmişleri yerine `PROJECT_MEMORY.md` üzerinden yönetir.

## License

MIT
