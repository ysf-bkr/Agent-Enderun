# 🏛️ Agent Enderun (v0.5.3) — The Supreme AI Governance Framework

**The Supreme AI Governance & Orchestration Framework for Enterprise Development**

[English](#english) | [Türkçe](#türkçe)

---

# English

## Executive Summary

Agent Enderun, yazılım ekipleri için tasarlanmış, **Anayasal Yönetişim (Constitutional Governance)** ve **Çoklu Ajan Orkestrasyonu (Multi-Agent Orchestration)** sağlayan kurumsal düzeyde bir framework'tür. 

### 🚀 v0.5.3: Zero-Config & Auto-Wiring
- **Auto-Wiring:** CLI automatically configures `gemini-extension.json` for MCP.
- **Automated Build:** Framework now compiles itself during initialization.
- **Smart Directory Logic:** Enhanced separation between framework and project docs.

### 🚀 v0.5.1: The Academy & Hermes Upgrade

Bu sürümle birlikte Agent Enderun, basit bir yönetişim aracından otonom bir **Ajan Akademisi**'ne dönüşmüştür:

- **📡 Hermes Messaging Protocol:** Ajanlar arası kategorize edilmiş (Action/Delegation/Info) ve önceliklendirilmiş iletişim bus'ı.
- **📚 Obsidian-Style LLM Wiki:** YAML metadata destekli, ilişkisel ve graf tabanlı teknik bilgi bankası yönetimi.
- **🛡️ Contract-First Automation:** API ve tip kontratlarının SHA-256 ile otomatik doğrulanması.
- **🤖 MCP Intelligence:** Bilgi grafiği üretme, inbox istatistikleri ve anlık sistem sağlığı denetimi sağlayan gelişmiş MCP araçları.

Agent Enderun is a **production-grade AI governance framework** designed for engineering teams that must maintain control, traceability, and discipline when using AI assistants for code generation. It transforms chaotic AI output into structured, auditable, enterprise-ready deliverables through:

- **Agent-Led Orchestration**: 8 specialized AI agent roles with defined responsibilities
- **Contract-First Development**: Shared TypeScript types as the single source of truth
- **Phase-Based Execution**: Strict workflow progression (PHASE_0 → PHASE_4)
- **Enterprise Auditability**: Every decision, action, and commit is logged and traceable
- **Modular MCP Intelligence**: 40+ tools across 12 categories for code analysis, security, and automation

---

## ⚡ 5-Minute Quick Start

### Prerequisites
- **Node.js**: 20+ (LTS recommended)
- **npm**: 9+
- **Git**: Initialized in your project root
- **Any AI Adapter**: Gemini, Claude, Cursor, or Codex (optional but recommended)

### Installation Steps

#### Step 1: Clone or Initialize
```bash
# Option A: Clone this framework repository
git clone https://github.com/ybekar/agent-enderun.git
cd agent-enderun

# Option B: Or use as npm package (when published)
npx agent-enderun init gemini
```

#### Step 2: Install Dependencies
```bash
npm install
```

#### Step 3: Build Framework
```bash
npm run enderun:build
```

#### Step 4: Verify Setup
```bash
agent-enderun check
```

Expected output:
```
✅ Framework active (v0.5.3)
✅ MCP Server ready
✅ Shared types compiled
✅ Agent logs initialized
✅ PROJECT_MEMORY.md found
```

---

## 🤖 Adapter Automation Levels

Choose your AI adapter when running `init`. Each has a different automation level:

| Adapter | Command | Automation | Notes |
| :--- | :--- | :---: | :--- |
| **Gemini** | `init gemini` | ✅ Full | MCP auto-wired into `gemini-extension.json`. One command, done. |
| **Cursor** | `init cursor` | ✅ Full | `cursor.md` auto-synced to `.cursorrules`. One command, done. |
| **Codex** | `init codex` | ✅ Full | Framework files placed in `.enderun/`. One command, done. |
| **Claude** | `init claude` | ⚠️ Semi | After init, run one extra command shown in the terminal to register MCP tools. |

> **Claude Note:** Claude Code requires explicit user approval for MCP tools due to its security model.
> After `init claude`, copy and run the `claude config add ...` command shown in the terminal output.

---

## 🎯 What You Can Do Right Now

### Initialize Your Project
```bash
# Creates {{FRAMEWORK_DIR}}/ directory with governance files
npx agent-enderun init gemini
```

### Check Project Health
```bash
# Runs security audit, compliance check, and dependency analysis
agent-enderun check

# Just security
agent-enderun check:security

# Just compliance
agent-enderun check:compliance
```

### View Project Status
```bash
# Shows current phase, active agents, and blockers
agent-enderun status
```

### Create a New Task
```bash
# Creates a ULID-based trace for a new feature
agent-enderun trace:new "Implement User Authentication" backend P1
```

### Verify API Contracts
```bash
# Ensures shared-types and API docs are synchronized
agent-enderun verify-contract
```

---

## 🏗️ Core Architecture

Agent Enderun consists of **4 integrated layers**:

### Layer 1: Governance ({{FRAMEWORK_DIR}}/)
```
{{FRAMEWORK_DIR}}/
├── ENDERUN.md              ← The "Supreme Law" (read this first!)
├── PROJECT_MEMORY.md       ← Single source of truth for state
├── STATUS.md               ← Agent status dashboard
├── cli-commands.json       ← CLI ownership mapping
├── agents/                 ← 8 agent role definitions
├── logs/                   ← Audit trail (agent.json files)
├── knowledge/              ← 16+ technical knowledge articles
└── docs/api/               ← API contract specifications
```

### Layer 2: Framework Core (bin/ + packages/)
```
bin/cli.js                 ← CLI bootstrapper
packages/
├── framework-mcp/         ← 40+ MCP tools (12 categories)
└── shared-types/          ← Branded types (single source of truth)
```

### Layer 3: Documentation (docs/)
```
docs/
├── tech-stack.md          ← Approved technology stack
├── project-docs.md        ← Product requirements (template)
└── [your project files]   ← Your documents (agents will read these)
```

### Layer 4: Application (apps/) — YOURS
```
apps/
├── backend/               ← Your backend app (create this)
├── web/                   ← Your frontend app (create this)
└── [other apps]/          ← Mobile, desktop, etc.
```

---

## 🎓 The Agent Academy — 8 Specialized Roles

Each agent has a defined **Standard Operating Procedure (SOP)** and reads the constitution before every action.

| Agent | Specialty | What They Do |
|---|---|---|
| **@manager** | Orchestration | Runs the phase machine, creates trace IDs, delegates tasks, updates PROJECT_MEMORY |
| **@analyst** | Quality Control | Security audits, compliance checks, documentation debt, code review |
| **@backend** | Data Architecture | Database schema, API contracts, shared-types integrity, Kysely standards |
| **@frontend** | UI Development | React components, Panda CSS styling, Zero-UI Library enforcement, responsive design |
| **@explorer** | Code Intelligence | Dependency graphs, complexity analysis, dead code detection, legacy code mapping |
| **@git** | Repository Master | Semantic commits, branch management, conflict resolution, merge strategies |
| **@mobile** | Mobile Apps | React Native, Expo, iOS/Android specifics, performance optimization |
| **@native** | Native Apps | Tauri, Electron, native performance, IPC protocols, system integration |

---

## 🛠️ MCP Tools Reference

The framework provides **40+ tools** organized in 12 categories. Agents use these automatically.

### Framework Tools
- `get_framework_status` — Check framework health
- `get_project_gaps` — Identify missing files/structure
- `get_memory_insights` — Analyze PROJECT_MEMORY
- `bootstrap_legacy_memory` — Auto-detect existing projects

### Codebase Tools
- `search_codebase` — Find code patterns
- `analyze_dependencies` — Map imports/exports
- `analyze_codebase_intelligence` — Find complexity & dead code
- `generate_dependency_graph` — Mermaid diagrams

### Security & Compliance
- `security_audit_scan` — Check for secrets, SQL injection, console.log
- `analyze_constitution_compliance` — Enforce ENDERUN.md rules

### Contract Management
- `verify_api_contract` — Hash verification
- `verify_contract_integrity` — Type synchronization
- `update_contract_hash` — Sync shared-types

### Git & Commits
- `generate_semantic_commit_message` — Auto-generate commit messages

### Academy Intelligence
- `get_academy_performance` — Agent success rates
- `generate_strategic_briefing` — High-level reports
- `log_agent_action` — Structured logging

### Repository Health
- `validate_repository_health` — Run lint/test/build
- `analyze_documentation_debt` — Find missing JSDoc/READMEs

### Agent Collaboration
- `send_agent_message` — Inter-agent communication
- `read_agent_messages` — Check agent inbox

### Database & Knowledge
- `analyze_database_schema` — Extract ER diagrams
- `search_knowledge_base` — Find technical guides
- `update_knowledge_base` — Add knowledge entries

---

## 📖 How Agents Read Your Project

When you add documentation to `docs/`, agents automatically discover and use it:

```
docs/
├── project-docs.md        ← Agents read here for requirements
├── tech-stack.md          ← Technology decisions
├── design-system.md       ← (optional) UI patterns
├── api-guide.md           ← (optional) API examples
└── architecture.md        ← (optional) System design
```

Agents use the `search_knowledge_base` tool to find answers to common questions.

---

## ✅ Complete Installation Checklist

- [ ] **Node.js 20+** installed (`node --version`)
- [ ] **npm 9+** installed (`npm --version`)
- [ ] **Git** initialized (`git init`)
- [ ] **Framework installed** (`npm install && npm run enderun:build`)
- [ ] **Health check passed** (`agent-enderun check` shows ✅)
- [ ] **First task created** (`agent-enderun trace:new "Your task" backend P1`)
- [ ] **Docs created** (add files to `docs/` for agents to read)
- [ ] **MCP connected** (agents can now use tools)

---

## 🚀 First Real Task

Once everything is installed, try this:

```bash
# Step 1: Create a real project requirement
echo "# User Authentication

Implement JWT-based authentication with refresh tokens.
- Email/password login
- Logout endpoint
- Token refresh mechanism
" > docs/requirements.md

# Step 2: Create a task
agent-enderun trace:new "Implement Auth Module" backend P1

# Step 3: Agents read requirements and build
# (They will automatically read docs/requirements.md)
```

---

## 📁 Project Structure

```
agent-enderun/
├── README.md                          ← This file
├── package.json                       ← Root npm config
├── bin/
│   └── cli.js                         ← CLI entry point
├── docs/                              ← Your project docs (agents read these)
│   ├── tech-stack.md
│   └── project-docs.md
├── packages/
│   ├── shared-types/                  ← Branded types (contract)
│   │   ├── src/index.ts
│   │   └── contract.version.json      ← SHA-256 integrity hash
│   └── framework-mcp/                 ← MCP server (40+ tools)
│       └── src/tools/
│           ├── academy.ts
│           ├── codebase.ts
│           ├── security.ts
│           ├── contract.ts
│           ├── git.ts
│           ├── knowledge.ts
│           ├── database.ts
│           ├── memory.ts
│           ├── messages.ts
│           ├── repository.ts
│           └── framework.ts
├── apps/                              ← Your applications (start here)
│   ├── backend/                       ← (you create this)
│   └── web/                           ← (you create this)
└── {{FRAMEWORK_DIR}}/                          ← Framework governance
    ├── ENDERUN.md                     ← Constitution (MANDATORY READ)
    ├── PROJECT_MEMORY.md              ← State machine
    ├── STATUS.md                      ← Agent dashboard
    ├── cli-commands.json              ← Command ownership
    ├── config.json                    ← Configuration
    ├── agents/                        ← 8 agent role docs
    │   ├── manager.md
    │   ├── analyst.md
    │   ├── backend.md
    │   ├── frontend.md
    │   ├── explorer.md
    │   ├── git.md
    │   ├── mobile.md
    │   └── native.md
    ├── logs/                          ← Audit trail
    │   ├── manager.json
    │   ├── backend.json
    │   ├── frontend.json
    │   ├── analyst.json
    │   ├── explorer.json
    │   ├── git.json
    │   ├── mobile.json
    │   └── native.json
    ├── knowledge/                     ← 16+ technical guides
    │   ├── branded_types_pattern.md
    │   ├── async_error_handling.md
    │   ├── security_scanning.md
    │   ├── contract_versioning.md
    │   ├── git_commit_strategy.md
    │   ├── testing_standards.md
    │   └── [12 more...]
    ├── messages/                      ← Inter-agent communication
    └── docs/
        ├── api/                       ← API contracts
        │   ├── auth.md
        │   ├── errors.md
        │   └── README.md
        └── [other docs]
```

---

## 💡 Frequently Asked Questions

### Q: What does "contract-first" mean?
**A:** All API shapes and domain models are defined in `packages/shared-types/src/index.ts` **before** any code is written. Frontend and backend must both use these types, ensuring perfect alignment.

### Q: Do agents actually understand all this?
**A:** Yes. Before every action, agents read:
1. `ENDERUN.md` (the constitution)
2. `{{FRAMEWORK_DIR}}/PROJECT_MEMORY.md` (project state)
3. `docs/` files (your requirements)
4. `{{FRAMEWORK_DIR}}/knowledge/` (technical guidelines)

### Q: What if I don't use an AI adapter?
**A:** The framework still works as a **collaborative development platform**. You and your team use it to enforce:
- Phase progression
- Audit logging
- Shared type discipline
- API contract verification

### Q: Can I extend the MCP tools?
**A:** Yes. Add new tool files in `packages/framework-mcp/src/tools/`, define the schema, and export the handler. The CLI will automatically discover them.

### Q: How do I add my own agents?
**A:** Create a markdown file in `{{FRAMEWORK_DIR}}/agents/your-agent.md`, define the SOP, and add a CLI mapping in `{{FRAMEWORK_DIR}}/cli-commands.json`.

### Q: Is this production-ready?
**A:** The **framework** is production-ready. Individual features (like `apps/`) depend on what you build. Start with `apps/backend` or `apps/web`.

---

## 🔗 Key Files to Read First

1. **`{{FRAMEWORK_DIR}}/ENDERUN.md`** — The constitution (rules all agents must follow)
2. **`{{FRAMEWORK_DIR}}/PROJECT_MEMORY.md`** — Current project state and history
3. **`docs/tech-stack.md`** — Technology decisions
4. **`packages/shared-types/src/index.ts`** — The contract (types)
5. **`README.md`** (this file) — How to use the framework

---

## 📞 Support & Contribution

### Report Issues
File issues with clear reproduction steps and framework version.

### Contribute
1. Read `{{FRAMEWORK_DIR}}/ENDERUN.md`
2. Follow the agent role guidelines
3. Submit PRs with semantic commit messages
4. Ensure tests pass: `npm run enderun:build`

### License
MIT © 2026 Yusuf BEKAR

---

# Türkçe

## Genel Özet

Agent Enderun, **kurumsal-grade bir yapay zeka yönetim çerçevesidir** ve yapay zeka asistanlarını kontrol altında tutmanız, izlenebilir olmasını sağlamanız ve disiplinli kod üretimini garantilamanız için tasarlanmıştır.

- **Ajan Orkestrasyonu**: 8 uzmanlaşmış yapay zeka rolü
- **Sözleşme-İlk Geliştirme**: Paylaşılan TypeScript türleri
- **Faz Tabanlı Yürütme**: Sıkı iş akışı (PHASE_0 → PHASE_4)
- **Kurumsal Denetim**: Her karar, işlem ve commit kaydedilir
- **Modüler MCP Zekası**: 40+ araç, 12 kategori

---

## ⚡ 5 Dakikalık Hızlı Başlangıç

### Gereksinimler
- **Node.js**: 20+ (LTS önerilir)
- **npm**: 9+
- **Git**: Proje kökünde başlatılmış
- **AI Adaptörü** (opsiyonel): Gemini, Claude, Cursor veya Codex

### Kurulum Adımları

#### Adım 1: Clone veya İnit
```bash
# Seçenek A: Framework repository'sini klonla
git clone https://github.com/ybekar/agent-enderun.git
cd agent-enderun

# Seçenek B: veya npm paketi olarak kullan
npx agent-enderun init gemini
```

#### Adım 2: Bağımlılıkları Yükle
```bash
npm install
```

#### Adım 3: Framework'ü Derle
```bash
npm run enderun:build
```

#### Adım 4: Kurulumu Doğrula
```bash
agent-enderun check
```

Beklenen çıktı:
```
✅ Framework aktif (v0.5.3)
✅ MCP Sunucu hazır
✅ Paylaşılan türler derlenmiş
✅ Agent logları başlatılmış
✅ PROJECT_MEMORY.md bulundu
```

---

## 🎯 Şu Anda Yapabileceğiniz İşler

### Projeyi Başlat
```bash
npx agent-enderun init gemini
```

### Sağlık Durumunu Kontrol Et
```bash
agent-enderun check                 # Tam kontrol
agent-enderun check:security        # Sadece güvenlik
agent-enderun check:compliance      # Sadece uyum
```

### Proje Durumunu Görüntüle
```bash
agent-enderun status
```

### Yeni Görev Oluştur
```bash
agent-enderun trace:new "Kullanıcı Doğrulama Uygulaması" backend P1
```

### API Kontratlarını Doğrula
```bash
agent-enderun verify-contract
```

---

## 🤖 Adaptör Otomasyon Seviyeleri

`init` komutunu çalıştırırken adaptörünüzü seçin. Her adaptörün otomasyon seviyesi farklıdır:

| Adaptör | Komut | Otomasyon | Not |
| :--- | :--- | :---: | :--- |
| **Gemini** | `init gemini` | ✅ Tam | MCP `gemini-extension.json`'a otomatik yazılır. Tek komut, bitti. |
| **Cursor** | `init cursor` | ✅ Tam | `cursor.md` otomatik olarak `.cursorrules`'a kopyalanır. Tek komut, bitti. |
| **Codex** | `init codex` | ✅ Tam | Framework dosyaları `.enderun/` dizinine yerleştirilir. Tek komut, bitti. |
| **Claude** | `init claude` | ⚠️ Yarı | Init sonrası terminalde gösterilen `claude config add ...` komutunu çalıştırmanız gerekir. |

> **Claude Notu:** Claude Code, güvenlik modeli gereği MCP araçlarının kullanıcı tarafından açıkça onaylanmasını zorunlu kılar.
> `init claude` sonrası terminal çıktısındaki `claude config add ...` komutunu kopyalayıp çalıştırın.

---

## 🏗️ Temel Mimari

Agent Enderun **4 entegre katmandan** oluşur:

### Katman 1: Yönetişim ({{FRAMEWORK_DIR}}/)
- `ENDERUN.md` — Anayasa (bunu ilk oku!)
- `PROJECT_MEMORY.md` — Proje durumu
- `agents/` — 8 ajan rolü tanımları
- `logs/` — Denetim kaydı
- `knowledge/` — 16+ teknik rehberi
- `docs/api/` — API sözleşmeleri

### Katman 2: Framework Çekirdeği
- `packages/framework-mcp/` — 40+ MCP aracı
- `packages/shared-types/` — Paylaşılan türler (sözleşme)
- `bin/cli.js` — CLI başlatıcısı

### Katman 3: Dokümantasyon
- `docs/tech-stack.md` — Teknoloji kararları
- `docs/project-docs.md` — Ürün gereksinimleri
- Ajanlar bu dosyaları okurlar

### Katman 4: Uygulamalarınız
- `apps/backend/` — Backend uygulaması (siz oluşturun)
- `apps/web/` — Frontend uyguması (siz oluşturun)

---

## 🎓 Ajan Akademisi — 8 Uzman Rol

| Ajan | Uzmanlık | Görev |
|---|---|---|
| **@manager** | Orkestrasyoun | Faz yönetimi, trace ID, görev delegasyonu |
| **@analyst** | Kalite Kontrol | Güvenlik denetimi, uyum kontrolü, kod incelemesi |
| **@backend** | Veri Mimarisi | Veritabanı, API kontratları, Kysely standartları |
| **@frontend** | UI Geliştirme | React, Panda CSS, bileşen tasarımı |
| **@explorer** | Kod Zekası | Bağımlılıklar, karmaşıklık, ölü kod |
| **@git** | Repository Ustası | Semantik commit'ler, branch yönetimi |
| **@mobile** | Mobil Uygulamalar | React Native, Expo, iOS/Android |
| **@native** | Yerel Uygulamalar | Tauri, Electron, sistem entegrasyonu |

---

## ✅ Komple Kurulum Kontrol Listesi

- [ ] **Node.js 20+** yüklü (`node --version`)
- [ ] **npm 9+** yüklü (`npm --version`)
- [ ] **Git** başlatılmış (`git init`)
- [ ] **Framework yüklü** (`npm install && npm run enderun:build`)
- [ ] **Sağlık kontrolü geçti** (`agent-enderun check` ✅ gösteriyor)
- [ ] **İlk görev oluşturuldu** (`agent-enderun trace:new "Görev" backend P1`)
- [ ] **Doklar oluşturuldu** (`docs/` klasörüne dosya ekledim)
- [ ] **MCP bağlandı** (ajanlar araçları kullanabiliyor)

---

## 🚀 İlk Gerçek Görev

Kurulum tamamlandıktan sonra bunu deneyin:

```bash
# Adım 1: Gerçek gereksinim yazın
echo "# Kullanıcı Doğrulaması

JWT tabanlı kimlik doğrulama sistemi kurun.
- Email/şifre girişi
- Oturumu kapat endpoint'i
- Token yenileme mekanizması
" > docs/requirements.md

# Adım 2: Görev oluşturun
agent-enderun trace:new "Auth Modülü Uygula" backend P1

# Adım 3: Ajanlar sizin için çalışır
# (Otomatik olarak docs/requirements.md okurlar)
```

---

## 📁 Proje Yapısı

```
agent-enderun/
├── docs/                 ← Ajanların okuyacağı dokümantasyon
├── packages/
│   ├── shared-types/     ← Paylaşılan türler (sözleşme)
│   └── framework-mcp/    ← MCP sunucusu (40+ araç)
├── apps/                 ← Uygulamalarınız (siz oluşturun)
├── {{FRAMEWORK_DIR}}/             ← Yönetişim dosyaları
│   ├── ENDERUN.md        ← Anayasa (OKUNMALI)
│   ├── PROJECT_MEMORY.md ← Proje durumu
│   ├── agents/           ← 8 ajan tanımı
│   ├── logs/             ← Denetim kaydı
│   ├── knowledge/        ← 16+ rehber
│   └── docs/api/         ← API sözleşmeleri
└── bin/
    └── cli.js            ← CLI giriş noktası
```

---

## 💡 Sıkça Sorulan Sorular

### S: "Sözleşme-ilk" ne demek?
**C:** Tüm API şekilleri ve alan modelleri `packages/shared-types` içinde **kod yazılmadan önce** tanımlanır. Frontend ve backend aynı türleri kullanır.

### S: Ajanlar bütün bunları anlıyor mu?
**C:** Evet. Her işlem öncesi şunları okurlar:
1. `ENDERUN.md` (anayasa)
2. `{{FRAMEWORK_DIR}}/PROJECT_MEMORY.md` (proje durumu)
3. `docs/` dosyaları (gereksinimler)
4. `{{FRAMEWORK_DIR}}/knowledge/` (teknik rehberler)

### S: AI adaptörü kullanmak zorunlu mu?
**C:** Hayır. Framework, AI'sız da işlev görür. Faz ilerleme, denetim kaydı ve tür disiplini zorunludur.

### S: MCP araçlarını genişletebilir miyim?
**C:** Evet. `packages/framework-mcp/src/tools/` klasörüne yeni dosya ekleyin.

### S: Kendi ajanlarımı ekleyebilir miyim?
**C:** Evet. `{{FRAMEWORK_DIR}}/agents/` klasörüne `.md` dosyası oluşturun ve CLI mapping'ini güncelleyin.

### S: Üretim için hazır mı?
**C:** Framework hazır. `apps/` klasörü tamamen sizin.

---

## 🔗 Önce Okumanız Gereken Dosyalar

1. **`{{FRAMEWORK_DIR}}/ENDERUN.md`** — Anayasa
2. **`{{FRAMEWORK_DIR}}/PROJECT_MEMORY.md`** — Proje durumu
3. **`docs/tech-stack.md`** — Teknoloji kararları
4. **`packages/shared-types/src/index.ts`** — Sözleşme (türler)
5. **`README.md`** — Bu dosya

---

## 📞 Destek & Katkı

### Sorun Bildir
Net adımlarla ve versiyon numarası ile sorun bildir.

### Katkıda Bulun
1. `{{FRAMEWORK_DIR}}/ENDERUN.md` oku
2. Agent rolü yönergelerine uyun
3. Semantik commit'ler gönder
4. Testleri geç: `npm run enderun:build`

### Lisans
MIT © 2026 Yusuf BEKAR
```bash
agent-enderun status
```

### 4. Advanced Intelligence Commands
```bash
# Run Security Audit
agent-enderun check:security

# Generate Dependency Graph
agent-enderun explorer:graph

# Get Commit Suggestion
agent-enderun git:commit [TRACE-ID]
```

---

## 📂 Consolidated Framework Structure (`{{FRAMEWORK_DIR}}/`)

All governance and engineering assets are consolidated under the framework directory for a clean project root.

```text
.
├── {{FRAMEWORK_DIR}}/
│   ├── ENDERUN.md           # Supreme Law (Constitution)
│   ├── PROJECT_MEMORY.md    # Working Memory & History
│   ├── BRAIN_DASHBOARD.md   # Intelligence & Performance Stats
│   ├── cli-commands.json    # Agent-to-CLI Mapping
│   ├── agents/              # 8 Specialized Agent SOPs
│   ├── knowledge/           # 17+ Enterprise Knowledge Articles
│   ├── docs/                # API Contracts, Security, Privacy, Strategy
│   ├── logs/                # Traceable structured JSON logs
│   ├── benchmarks/          # Performance metrics
│   └── monitoring/          # System health hooks
├── bin/                     # CLI Entry Point
├── packages/                # Shared Types & MCP Engine
└── apps/                    # Production Modules (Backend, Web, Mobile)
```

---

## 🛡️ Engineering Standards

-   **Zero Mock Policy:** Placeholders are forbidden. Every line of code must be functional.
-   **Branded Types:** IDs must be type-safe (e.g., `UserID` vs `string`).
-   **Panda CSS Only:** Zero-runtime CSS-in-JS for high-performance UI.
-   **Contract-First:** Schemas are defined in `shared-types` BEFORE implementation.

---

## 📜 License
MIT © 2026 Yusuf BEKAR — **Agent Enderun: The Future of AI Governance.**
