# 🏛️ Agent Enderun — Enterprise AI Governance & Autonomous Orchestration Framework

> **Stable Release:** v0.9.3  
> **Author:** Yusuf BEKAR  
> **Trace ID:** `01HGT8J5E2N0W0W0W0W0W0W0W4`  
> **System Status:** 🟢 All Systems Operational | Build Compile: Clean | Type-Safety: 100% Verified

---

## 🇹🇷 TÜRKÇE — Proje Tanıtımı & Dokümantasyonu

**Agent Enderun**, sıradan bir kod şablon üreteci veya basit bir AI asistanı değildir; karmaşık, ölçeklenebilir ve kurumsal (enterprise) düzeydeki yazılım projeleri için özel olarak tasarlanmış bir **Yapay Zeka Yönetişimi ve Otonom Ordu Komuta Sistemidir**.

Sürüm **v0.9.2** itibarıyla sistem; kendi hafızasını yönetebilen, monorepo proje yollarını dinamik olarak haritalayan, tüm ajan seanslarını güvenli şekilde günlükleyen ve farklı yapay zeka ekosistemlerini anayasal bir disiplin altında birleştiren **"Yaşayan Bir Mühendislik Organizması"** haline getirilmiştir.

---

### 🚀 Sürüm v0.9.2 İle Gelen Devrimsel Yenilikler

1. **`log_agent_action` (Otonom Telemetri ve Seans Günlüğü):**
   * Tüm uzman ajanların anayasaya göre seans sonunda çalıştırmak zorunda olduğu `log_agent_action` MCP aracı sisteme entegre edildi.
   * Ajan faaliyetlerini otomatik olarak `.enderun/logs/{agent}.json` veya `.gemini/antigravity-cli/logs/{agent}.json` altında güvenle kayıt altına alan merkezi kilit sistemli telemetri altyapısı kuruldu.

2. **`update-contract` (Sözleşme Senkronizasyon Otomasyonu):**
   * Backend tipleri değiştiğinde SHA-256 hash'ini otomatik hesaplayıp `apps/backend/contract.version.json` dosyasına yazan `update-contract` CLI komutu ve `update_contract_hash` MCP aracı eklendi.
   * Bu sayede frontend/backend arasındaki tip uyuşmazlığı tespiti ve senkronizasyonu otonom olarak yapılabilir hale getirildi.

3. **İleri Seviye Klasör Keşfi (Antigravity Entegrasyonu):**
   * Dizin tespit mekanizmasındaki aday listesine `.gemini/antigravity` ve `.gemini/antigravity-cli` gibi iç içe geçmiş (nested) yollar eklenerek Antigravity (IDE & CLI) çalışma ortamları için 100% hatasız bir entegrasyon sağlandı.

4. **Dinamik Framework Klasör Keşfi (Multi-Adapter Engine):**
   * CLI aracı; çalışma anında projede aktif olan framework klasörünü `[.gemini/antigravity, .gemini/antigravity-cli, .gemini, .claude, .agent, .enderun]` adayları arasından otomatik olarak keşfeder.

5. **Yapılandırılabilir Klasör Haritalaması (Dynamic Paths Map):**
   * Projede kullanılan `backend`, `frontend`, `docs` ve `tests` dizin yolları artık dinamik olarak yönetilir. Bilgiler `config.json` içerisindeki `paths` bloğundan okunur.

6. **Hermes Otonom Orkestrasyon Döngüsü (`orchestrate` / `loop`):**
   * Yapay zeka ajanlarının asenkron olay tabanlı (event-driven) haberleşme kanalı olan **Hermes Message Broker** devreye alındı. `agent-enderun orchestrate` komutu asenkron delege görevleri otonom olarak yönlendirir.

---

### 💎 Stratejik Platform Sinerjisi (Dört Büyük Güç)

Agent Enderun, sektörün öncüsü olan yapay zeka ekosistemlerini bir araya getirerek her birine stratejik bir rol atar:
* **🚀 Claude Code (Operasyonel Cerrahi):** **Saha Mühendisi**. Kod tabanındaki otonom ve milimetrik cerrahi düzenlemeleri (Surgical Edits) gerçekleştirir.
* **♊ Gemini & Vertex AI (Komuta İstihbaratı):** **Stratejik Karar Merkezi**. Proje geçmişini, mimari kararları analiz eder ve yüksek seviyeli stratejik yönlendirmeler yapar.
* **🛸 Antigravity (İç Disiplin & Akademi):** **Askeri Akademi**. İç standartları, anayasal uyumu korumak amacıyla izole edilmiş, yüksek disiplinli geliştirme ve test ortamı sağlar.
* **🤖 Grok / X.ai (Otonom Keşif Kanadı):** **Deneysel Keşif**. Gelecek vizyonlu otonom protokolleri test eder ve yapay zeka güdümlü geliştirme sınırlarını zorlar.

---

### 🪖 Konsolide Edilmiş 10 Ajanlık Ordu Yapısı

Tüm operasyonlar, uzmanlık alanlarına göre ayrılmış ve Hermes protokolüyle birbirine bağlanmış 10 aktif ajan tarafından yönetilir:

| Ajan | Uzmanlık Rolü | Temel Sorumluluğu |
| :--- | :--- | :--- |
| **`@manager`** | Komuta & Strateji | Görev dağılımı (DAG), hafıza yönetimi (`PROJECT_MEMORY.md`), anayasa koruyuculuğu. |
| **`@quality`** | Kalite, Güvenlik & Analiz | AST zafiyet taramaları, anayasal uyum denetimi, kod inceleme checklistleri, test standartları kapısı, CI/CD kapsam denetimi. |
| **`@database`** | Veritabanı Mimarisi | Veritabanı şemaları, migration kuralları, index optimizasyonları ve veri tohumlama (seeding). |
| **`@backend`** | İş Mantığı (Domain Logic) | API tasarımı, branded types, katmanlı mimari (Route -> Controller -> Service -> Repository), audit günlüğü kontrolü. |
| **`@frontend`** | Akıcı Responsive UI | Panda CSS tasarımı, responsive-first arayüzler, custom React kancaları, rollback disiplini yönetimi. |
| **`@devops`** | Altyapı & Canlı Dağıtım | Native Node.js deploymentları, rollback planları, telemetri ve izleme (monitoring) kurulumları. |
| **`@explorer`** | Kod Analizi & Keşif | Kod tabanı analizi, bağımlılık grafikleri, legacy onboarding stratejileri. |
| **`@git`** | Sürüm Kontrolü | Trace ID uyumlu commit yönetimi, sürüm etiketleme ve dal (branch) hijyeni. |
| **`@mobile`** | Mobil Geliştirme | Expo ve React Native tabanlı mobil arayüz geliştirme otomasyonları. |
| **`@native`** | Native Masaüstü | Tauri ve Electron tabanlı yerel masaüstü uygulama entegrasyonları. |

---

### 🛡️ Enderun Disiplininin 5 Temel Direği

1. **Mutlak İzlenebilirlik (Trace ID):** Her karar, işlem ve commit, denetlenebilir olması adına 26 karakterli benzersiz bir ULID (Trace ID) ile mühürlenir.
2. **Önce Kontrat (Contract-First):** Backend ve frontend arasındaki veri kontratları ve tipler, herhangi bir arayüz kodu yazılmadan önce kesin olarak kilitlenir.
3. **Cerrahi Düzenleme Standardı:** Tüm dosyayı baştan yazmak yasaktır. Sadece değişmesi gereken satırlar `replace_text` / `patch_file` araçlarıyla milimetrik olarak değiştirilir.
4. **Otonom Bellek Arşivleme:** `PROJECT_MEMORY.md` kendi kendini temizleyen ve en güncel durumu koruyan bir SSOT (Single Source of Truth) olarak çalışır.
5. **Anayasal Otorite:** Tüm ajanlar `.enderun/ENDERUN.md` içinde tanımlanan Supreme Law (Yüce Yasa) kurallarına kayıtsız şartsız uymak zorundadır.

---

### 🛠️ CLI Komut Referansı

| Komut | Yetkili Ajan | Açıklama |
| :--- | :--- | :--- |
| `init [adapter]` | `@manager` | Seçilen IDE/Agent adaptörünü (`gemini`, `claude`, `grok`, `antigravity-cli`) yerel projenize kurar. |
| `status` | `@manager` | Aktif aşamayı, aktif Trace ID'yi ve ajanların anlık ordu durumlarını listeler. |
| `check` | `@quality` | Anayasal sağlık kontrolü, dosya bütünlüğü ve dizin doğrulaması yapar. |
| `trace:new [desc]` | `@manager` | Yeni bir Trace ID başlatarak görev zincirini ve izlenebilirliği tetikler. |
| `orchestrate` / `loop` | `@manager` | Canlı Hermes mesaj yönlendirici döngüsünü başlatarak asenkron ajan görevlerini yönlendirir. |
| `verify-contract` | `@backend` | Backend ile frontend arasındaki tip uyumluluğunu doğrular ve denetler. |
| `update-contract` | `@backend` | backend tip değişikliklerine göre güncel SHA-256 hash sözleşmesini otomatik üretir. |
| `create-app [idea]` | `@manager` | Doğal dildeki talep ve gereksinimlerden kurumsal monorepo uygulaması oluşturur. |

---

### 📦 npmjs Yayınlama & Prepublish Otomasyonu

Agent Enderun, npmjs üzerinde paketlenmeye kusursuz şekilde hazırdır:
* **Hazır Derleme Otomasyonu (`prepublishOnly`):** Paket yayına gönderilmeden önce `"prepublishOnly"` kancası tetiklenir ve `framework-mcp` (MCP Server) en güncel haliyle derlenerek dağıtıma hazır hale getirilir.
* **CLI Kaynak Bütünlüğü:** Tüm TypeScript derleme kaynakları (`src/`) paket içeriğine dahil edilmiştir.

Yerel projenizi test etmek veya npm link üzerinden kurmak için:
```bash
# Bağımlılıkları kurun ve MCP sunucusunu derleyin
npm install
npm run enderun:build

# Paketi yerel NPM havuzunuza linkleyin
npm link

# Test etmek istediğiniz boş bir klasöre gidin ve aracı bağlayın
mkdir test-projem && cd test-projem
npm init -y
npm link agent-enderun

# Adaptörü başlatın
npx agent-enderun init gemini
```

---
---

## 🇺🇸 ENGLISH — Project Showcase & Documentation

**Agent Enderun** is not just a boilerplate code generator or a simple AI assistant; it is a state-of-the-art **AI Governance and Autonomous Army Command System** designed for highly complex, scalable, and fully auditable enterprise software projects.

As of **v0.9.2**, the system operates as a **"Living Engineering Organism"** capable of managing its own memory, dynamically mapping monorepo project subfolders, secure-logging all agent sessions, and uniting disparate AI ecosystems under a single constitutional discipline.

---

### 🚀 Key Improvements in Version v0.9.2

1. **`log_agent_action` (Autonomous Telemetry Log):**
   * Formally integrated the `log_agent_action` MCP tool, which all expert agents are constitutionally required to call at the end of their sessions.
   * Established a secure, file-locked logging mechanism to automatically append agent telemetry to `.enderun/logs/{agent}.json` or `.gemini/antigravity-cli/logs/{agent}.json`.

2. **`update-contract` (Contract Sync Automation):**
   * Added the `update-contract` CLI command and `update_contract_hash` MCP tool to automatically calculate the SHA-256 hash of backend types and write it to `apps/backend/contract.version.json`.
   * This enables autonomous drift detection and seamless type synchronization between frontend and backend.

3. **Advanced Path Discovery (Antigravity Integration):**
   * Added nested framework directory candidates like `.gemini/antigravity` and `.gemini/antigravity-cli` to the path resolution engine, ensuring 100% error-free integration within Antigravity IDE and CLI runtime environments.

4. **Dynamic Framework Directory Discovery (Multi-Adapter Engine):**
   * The CLI dynamically discovers the active framework folder from an prioritized candidate list `[.gemini/antigravity, .gemini/antigravity-cli, .gemini, .claude, .agent, .enderun]`.

5. **Configurable Path Mapping (Dynamic Paths Map):**
   * Directories for `backend`, `frontend`, `docs`, and `tests` are fully dynamic and configurable via the `paths` block inside `config.json`.

6. **Hermes Autonomous Orchestration Loop (`orchestrate` / `loop`):**
   * Enabled the **Hermes Message Broker**—an event-driven asynchronous communication channel between expert AI agents.

---

### 💎 Strategic Platform Synergy (The Four Powers)

Agent Enderun coordinates industry-leading AI environments by assigning each a specific strategic military role:
* **🚀 Claude Code (Operational Surgery):** The **Field Engineer**. Excels in executing precise, surgical, and autonomous codebase edits.
* **♊ Gemini & Vertex AI (Command Intelligence):** The **Command Center**. Analyzes project history, memory logs, and executes high-level strategic decisions.
* **🛸 Antigravity (Internal Discipline):** The **Military Academy**. Provides an isolated, high-discipline sandbox to preserve internal framework coding standards.
* **🤖 Grok / X.ai (Exploration Wing):** The **Autonomous Scouting**. Testing futuristic agent behaviors and pushing AI-driven developer limits.

---

### 🪖 The Consolidated 10-Agent Army

All workspace operations are divided among 10 specialized expert agents connected via the Hermes protocol:

| Agent | Specialization Role | Core Responsibility |
| :--- | :--- | :--- |
| **`@manager`** | Command & Strategy | Task dependency graphs (DAG), memory pruning (`PROJECT_MEMORY.md`), constitution compliance. |
| **`@quality`** | Quality, Security & Analysis | AST vulnerability scanning, constitutional audits, code review checklists, test standard gates, CI/CD coverage verification. |
| **`@database`** | Database Architecture | Database schemas, migration workflows, query optimization, and contract-aware seeding. |
| **`@backend`** | Domain Logic Specialist | API route design, branded types, layered architecture (Route -> Controller -> Service -> Repository), audit logging scan. |
| **`@frontend`** | Fluid Responsive UI | Panda CSS design, responsive-first interfaces, customized React hooks, rollback discipline management. |
| **`@devops`** | Infrastructure Specialist | Native Node.js deployments, rollback plans, monitoring & logging setups. |
| **`@explorer`** | Codebase Intelligence | Project analysis, dependency graph generation, legacy conversion strategies. |
| **`@git`** | Version Control | Semantic Trace-ID-aligned commits, release tagging, branch hygiene. |
| **`@mobile`** | Mobile Development | React Native / Expo UI automation and native builds. |
| **`@native`** | Desktop Engineering | Tauri and Electron desktop app integrations. |

---

### 🛡️ Five Pillars of Enderun Discipline

1. **Absolute Traceability (Trace ID):** Every single decision is stamped with a unique 26-character ULID (Trace ID) for thorough auditing.
2. **Contract-First:** Backend-frontend data contracts are defined and sealed before any user interface code is written.
3. **Surgical Edit Standard:** Rewriting entire files is strictly prohibited. Only modified lines are changed using `replace_text` / `patch_file`.
4. **Autonomous Memory Archiving:** `PROJECT_MEMORY.md` functions as a self-pruning Single Source of Truth (SSOT).
5. **Constitutional SSOT:** All agents must adhere to the supreme constitutional law defined in `.enderun/ENDERUN.md`.

---

### 🛠️ CLI Command Map

| Command | Authoritative Agent | Description |
| :--- | :--- | :--- |
| `init [adapter]` | `@manager` | Initialize the framework for a selected adapter (`gemini`, `claude`, `grok`, `antigravity-cli`). |
| `status` | `@manager` | Display active phase, Trace ID, and agent health scores. |
| `check` | `@quality` | Perform a constitutional health check, folder structure, and file integrity scan. |
| `trace:new [desc]` | `@manager` | Start a new task chain with a unique Trace ID. |
| `orchestrate` / `loop` | `@manager` | Spin up the live Hermes message-broker loop to route asynchronous agent actions. |
| `verify-contract` | `@backend` | Verify and seal type alignment between backend and frontend contracts. |
| `update-contract` | `@backend` | Automatically calculate and synchronize the backend contract SHA-256 hash. |
| `create-app [idea]` | `@manager` | Generate a corporate monorepo application from natural language requirements. |

---

### 📦 npmjs Publication & Prepublish Automation

Agent Enderun is fully optimized for immediate publication to npmjs:
* **Prepublish Build Automation Hook (`prepublishOnly`):** Triggers `npm run enderun:build` before publishing, ensuring compiled Model Context Protocol (MCP) server binaries are always built and up-to-date.
* **CLI Source Bundle Inclusion:** Bundles the `"src"` folder in the published package.

To test the package locally via npm link:
```bash
# Install root dependencies and build MCP
npm install
npm run enderun:build

# Create a global npm link
npm link

# Create a test folder and link package
mkdir test-project && cd test-project
npm init -y
npm link agent-enderun

# Boot the adapter scaffolding
npx agent-enderun init gemini
```

---

Developed with absolute discipline | Developer **Yusuf BEKAR** | Framework Version **v0.9.3**
