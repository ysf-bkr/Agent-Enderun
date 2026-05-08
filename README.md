# AI-Enderun v0.1.1

English | [Turkce](#turkce)

AI-Enderun is an agent orchestration framework that turns AI assistants into disciplined engineering collaborators. It combines a constitutional rule set, project memory, shared contracts, and an MCP server so multiple AI clients can work with the same standards.

---

## English

### What It Is

AI-Enderun provides a structured operating model for AI-driven software delivery.

- `ENDERUN.md` defines the global constitution.
- `.enderun/` stores AI operating assets such as agent SOPs, memory, logs, and dashboards.
- `docs/` stores **User/Project Requirements** (e.g., `project-docs.md`, `requirements.md`).
- `packages/shared-types` stores the contract-first type layer.
- `packages/framework-mcp` exposes the MCP server and framework tools.
- `bin/cli.js` provides the `ai-enderun` CLI.

### 🚀 Getting Started

1.  **Initialize:** Run `npx ai-enderun init gemini` (or `claude`, `cursor`, `codex`).
2.  **Define Stack:** Fill in your project's technology stack in `docs/tech-stack.md`.
3.  **Define Requirements:** Place your project goals and user stories in the root `docs/project-docs.md` file.
4.  **Start Orchestration:** Generate your first Trace ID (ULID): `ai-enderun trace:new "Initial project setup"`
5.  **Collaborate:** Talk to your AI assistant. It will automatically detect the `ENDERUN.md` constitution and follow the specialized SOPs in `.enderun/agents/`.

### Directory Model

```text
.
|-- .enderun/
|   |-- agents/             # Agent SOP (Standard Operating Procedure) files
|   |-- docs/               # Framework-specific technical documentation
|   |   |-- ARCHITECTURE.md
|   |   `-- api/            # API Contracts (OpenAPI/Shared-types)
|   |-- logs/               # Structured JSON logs of agent actions
|   |-- PROJECT_MEMORY.md   # Single Source of Truth for project state
|   `-- config.json
|-- docs/                   # User project requirements (The "What" to build)
|   |-- project-docs.md
|   `-- tech-stack.md
|-- packages/
|   |-- framework-mcp/      # Core MCP server tools
|   `-- shared-types/       # Contract-first type definitions
|-- ENDERUN.md              # The Supreme Constitution
|-- GEMINI.md / CLAUDE.md   # Client-specific adapter instructions
`-- package.json
```

### 🤖 The 7 Specialists (Agent Roles)

AI-Enderun defines 7 distinct roles, each with its own SOP (Standard Operating Procedure) in `.enderun/agents/`:

1.  **@manager (CTO & Controller):**
    *   The orchestrator. Generates Trace IDs (ULID), selects the Execution Profile, and assigns tasks via a strict "Briefing Template."
    *   **Goal:** Maintain high-level discipline and ensure the project follows the `ENDERUN.md` rules.

2.  **@analyst (QA & Memory Gate):**
    *   The auditor. Maintains `PROJECT_MEMORY.md`, audits phase transitions (DoD), and manages walkthroughs.
    *   **Goal:** Ensure no task is approved without meeting quality standards and maintaining architectural integrity.

3.  **@backend (Architect):**
    *   Expert in Node.js, Fastify, and PostgreSQL. Responsible for "Contract-First" development and database schemas via Kysely.
    *   **Goal:** Build secure, layered, and strictly typed server logic.

4.  **@frontend (UI/UX Architect):**
    *   Expert in React 19, Vite, and Panda CSS. Enforces the "Zero UI Library Policy" (No shadcn/ui, no MUI).
    *   **Goal:** Build premium, fluid, and original interfaces from scratch using Panda CSS tokens.

5.  **@explorer (Investigator):**
    *   The research specialist. Scans the codebase, maps dependencies, and provides context to other agents before they act.
    *   **Goal:** Eliminate "blind reading" and provide actionable architectural insights.

6.  **@mobile (App Specialist):**
    *   Expert in React Native and Expo. Focuses on mobile-first performance and native-feeling interactions.
    *   **Goal:** Extend the project's reach to iOS and Android with the same architectural discipline.

7.  **@native (Desktop Architect):**
    *   Expert in Tauri and Electron. Manages desktop-specific logic, security, and OS-level integrations.
    *   **Goal:** Deliver secure, lightweight desktop experiences.

### Key Principles

- **Procedural Continuity:** Agents MUST follow existing code patterns and styles. "Finish how you started."
- **Contract-First:** No coding without approved `shared-types` and API documentation.
- **Memory-Driven:** Every agent checks `CRITICAL DECISIONS` in `PROJECT_MEMORY.md` before acting.
- **Search-Before-Reading:** Agents scan context using MCP tools before opening files.

---

## Turkce

### Nedir

AI-Enderun, yapay zeka yardimcilarini disiplinli muhendislik ekip arkadaslarina donusturen bir orkestrasyon catiridir. Anayasa benzeri kurallar, kalici proje hafizasi, paylasilan kontratlar ve MCP sunucusu ile farkli AI istemcilerini ayni standartlarda toplar.

### 🤖 7 Uzman Ajan (Roller)

1.  **@manager (CTO & Denetleyici):** Sureci yonetir, Trace ID uretir ve gorev dagilimi yapar.
2.  **@analyst (Kalite & Hafiza):** Proje hafizasini tutar, faz gecislerini denetler ve DoD (Done) kontrolu yapar.
3.  **@backend (Mimar):** Node.js ve veritabani mimarisinden sorumludur. Kontrat-oncelikli gelistirme yapar.
4.  **@frontend (Arayuz Mimari):** React 19 ve Panda CSS uzmanidir. Hazir kutuphane kullanmadan (Zero UI Library) ozgun tasarimlar uretir.
5.  **@explorer (Arastirmaci):** Kod dizinini tarar, bagimliliklari haritalandirir ve diger ajanlara baglam (context) saglar.
6.  **@mobile (Mobil Uzman):** React Native ve Expo ile yuksek performansli mobil uygulamalar gelistirir.
7.  **@native (Masaustu Mimari):** Tauri ve Electron ile masaustu entegrasyonlarini ve guvenligini yonetir.

### CLI Komutlari

```bash
ai-enderun init [adapter]    # Kurulum (gemini, claude, cursor)
ai-enderun status            # Proje durumunu ve aktif gorevleri gosterir
ai-enderun trace:new <desc>  # Yeni bir gorev zinciri (ULID) baslatir
ai-enderun verify-contract   # Kontrat uyumunu kontrol eder
```

### 🚀 Başlangıç Rehberi

1.  **Kurulum:** `npx ai-enderun init gemini` (veya `claude`, `cursor`, `codex`) komutunu çalıştırın.
2.  **Teknoloji Yığınını Belirleyin:** `docs/tech-stack.md` dosyasını projenize göre doldurun.
3.  **Gereksinimleri Ekleyin:** Proje hedeflerinizi ve kullanıcı hikayelerinizi kök dizindeki `docs/project-docs.md` dosyasına yerleştirin.
4.  **Görevi Başlatın:** İlk görev zincirini (ULID) oluşturun: `ai-enderun trace:new "Proje iskeletini oluştur"`
5.  **Ajanlarla Çalışın:** Yapay zeka yardımcınızla konuşun. Artık projenizdeki `ENDERUN.md` anayasasını ve `.enderun/agents/` içindeki uzman rollerini tanıyarak disiplinli bir şekilde çalışacaktır.

### v0.1.1 Yenilikleri

- **Akilli Kurulum:** Gemini icin otomatik symlink, Claude icin otomatik MCP kurulum yardimcisi.
- **Süreklilik İlkesi:** Ajanlarin mevcut kod yazim tarzina ve mimari kararlara sadik kalma zorunlulugu.
- **Doküman Ayrıştırma:** Kök `docs/` kullanıcı gereksinimleri için, `.enderun/docs/` ise framework kuralları için ayrıldı.

## License

MIT
