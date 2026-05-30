# 🏛️ Agent Enderun — Enterprise AI Governance & Autonomous Orchestration Framework

> **Stable Release:** v0.9.4  
> **Author:** Yusuf BEKAR  
> **Trace ID:** `01HGT8J5E2N0W0W0W0W0W0W0W5`  
> **System Status:** 🟢 All Systems Operational | Build Compile: Clean | Type-Safety: 100% Verified

---

## 🇹🇷 TÜRKÇE — Proje Tanıtımı & Detaylı Kullanım Kılavuzu

**Agent Enderun**, sıradan bir kod şablon üreteci veya basit bir AI asistanı değildir; karmaşık, ölçeklenebilir ve kurumsal (enterprise) düzeydeki yazılım projeleri için özel olarak tasarlanmış bir **Yapay Zeka Yönetişimi ve Otonom Ordu Komuta Sistemidir**.

Sürüm **v0.9.4** itibarıyla sistem; kendi hafızasını yönetebilen, monorepo proje yollarını dinamik olarak haritalayan, tüm ajan seanslarını güvenli şekilde günlükleyen, farklı yapay zeka ekosistemlerini anayasal bir disiplin altında birleştiren ve **Claude Code / Desktop Sandbox kurallarına tam uyum sağlayan** yaşayan bir mühendislik organizmasıdır.

---

### ❓ Neden Agent Enderun?

Yapay zeka kodlama yardımcıları (Claude Code, Gemini CLI, Grok Build vb.) geliştikçe, kurumsal projelerde kontrolü kaybetmek çok daha kolay hale gelmiştir. Agent Enderun, aşağıdaki kritik **kurumsal problemleri çözmek** amacıyla doğmuştur:

1. **Kontrolsüz ve Hatalı Değişiklikler (Rogue AI):** Ajanların tüm kod dosyasını baştan yazmasını engelleyerek **milyonlarca satırlık kodları cerrahi hassasiyetle (`replace_text` / `patch_file` üzerinden)** değiştirmeye zorlar. Token tüketimini ve hata oranını %90 azaltır.
2. **Kayıp Hafıza ve Bağlam Drifti:** Ajanlar oturum değiştirdikçe projenin geçmişini ve mimari kararlarını unutur. Enderun, **`PROJECT_MEMORY.md`** dosyasını projenin değişmez tek doğruluk kaynağı (SSOT) haline getirerek, seanslar arası bağlam kaybını tamamen engeller.
3. **Frontend-Backend Tip Uyuşmazlığı:** Backend tip tanımlamalarında en ufak bir kayma olduğunda, otonom SHA-256 hash hesaplama ve kontrat denetleme motoru (`update-contract` / `verify-contract`) sayesinde arayüz kodları yazılmadan önce hatalar yakalanır.
4. **Çoklu Ajan Kaosu:** 10 farklı uzman yapay zeka ajanı, olay tabanlı asenkron bir haberleşme protokolü olan **Hermes Message Broker** üzerinden koordine edilir. Ajanlar birbirine rastgele müdahale edemez; tüm görevler bir İş Dağılım Grafiği (DAG) üzerinden komuta edilir.
5. **Sandbox ve Güvenlik Sınırlamaları:** Claude Code gibi modern araçların kernel düzeyindeki güvenlik yalıtımlarını (bubblewrap/seatbelt) ihlal etmemek adına, tüm bellek, kuyruk ve günlük mekanizmaları **proje kök klasöründeki lokal adaptör yollarında saklanır**; `/tmp` veya dış dizinleri kullanmayarak sıfır hata ile çalışır.

---

### 🚀 Sürüm v0.9.4 İle Gelen Devrimsel Yenilikler

1. **🔒 Claude Code & Desktop Sandbox Uyumlu MCP Mimarisi:**
   * Claude Desktop ve Claude Code CLI'ın güvenlik yalıtımlarına (sandbox) uyum sağlamak amacıyla, MCP sunucusunun otonom çalışacağı aktif proje dizinini dinamik çözümleyen `ENDERUN_PROJECT_ROOT` ortam değişkeni altyapısı sisteme entegre edildi.
   * `claude` adaptörü kurulurken, Claude Code CLI'ın projeyi otomatik keşfetmesini sağlayan proje-seviyesi **`.mcp.json`** dosyası otomatik oluşturulur.
2. **📂 Claude Desktop & CLI Yapılandırma Düzeltmeleri:**
   * Kod tabanında eskiden aranan yanlış `config.json` yolları temizlendi; yerine macOS ve Windows'taki gerçek Claude Desktop ayar dosyası olan **`claude_desktop_config.json`** ve küresel Claude Code CLI ayar dosyası olan **`~/.claude.json`** entegrasyonları getirildi.
3. **🛸 Grok Entegrasyonunun Sektör Standartlarına Uyumlanması:**
   * Grok adaptörünün kullandığı varsayılan çalışma dizini jenerik `.agent` yerine, resmi ve topluluk standardı olan **`.grok/`** ve **`grok.md`** olarak güncellendi. Geriye dönük uyumluluk korunarak `.agent` aday dizin listesinde tutuldu.
4. **🧹 Kod Tekrarlarının Arındırılması ve SSOT Standardı:**
   * `src/cli/utils/app.ts` içerisindeki mükerrer `getFrameworkDir` ve `getMemoryPath` fonksiyonları arındırılarak, `./memory.js` üzerindeki tekil doğruluk kaynağı ile birleştirildi.

---

### 💎 Stratejik Platform Sinerjisi (Dört Büyük Güç)

Agent Enderun, sektörün öncüsü olan yapay zeka ekosistemlerini bir araya getirerek her birine stratejik bir rol atar:
* **🚀 Claude Code (Operasyonel Cerrahi):** **Saha Mühendisi**. Kod tabanındaki otonom ve milimetrik cerrahi düzenlemeleri (Surgical Edits) gerçekleştirir.
* **♊ Gemini & Vertex AI (Komuta İstihbaratı):** **Stratejik Karar Merkezi**. Proje geçmişini, mimari kararları analiz eder ve yüksek seviyeli stratejik yönlendirmeler yapar.
* **🛸 Antigravity (İç Disiplin & Akademi):** **Askeri Akademi**. İç standartları, anayasal uyumu korumak amacıyla izole edilmiş, yüksek disiplinli geliştirme ve test ortamı sağlar.
* **🤖 Grok / X.ai (Otonom Keşif Kanadı):** **Deneysel Keşif**. Gelecek vizyonlu otonom protokolleri test eder ve yapay zeka gügümlü geliştirme sınırlarını zorlar.

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

### 🛠️ Kurulum & Adaptör Entegrasyon Kılavuzu

#### 1. Gemini Adaptörü Kurulumu
Gemini CLI veya Vertex AI entegrasyonu için proje dizininizde aşağıdaki komutu çalıştırın:
```bash
npx agent-enderun init gemini
```
*   **Oluşturulan Yapı:** Proje kökünde `.gemini/` dizini ve `gemini.md` (SSOT şim dosyası) oluşturulur.
*   **Aktivasyon:** Gemini CLI'a `.gemini/mcp_config.json` dosyasını tanıtın.

#### 2. Claude Adaptörü Kurulumu (Claude Code & Desktop)
Claude Desktop uygulamasında ve Claude Code CLI aracında otonom orduyu aktif etmek için:
```bash
npx agent-enderun init claude
```
*   **Oluşturulan Yapı:** Proje kökünde `.claude/` dizini, `claude.md` ve en önemlisi proje-seviyesinde **`.mcp.json`** dosyası oluşturulur.
*   **Küresel Kayıt:** Komut, sisteminizde kurulu olan Claude Desktop yapılandırmasını (`claude_desktop_config.json`) ve Claude Code küresel yapılandırmasını (`~/.claude.json`) tarayarak MCP sunucusunu otomatik olarak kaydeder.

#### 3. Grok Adaptörü Kurulumu
xAI Grok Build veya topluluk CLI araçları için:
```bash
npx agent-enderun init grok
```
*   **Oluşturulan Yapı:** Proje kökünde **`.grok/`** dizini ve **`grok.md`** şim dosyası oluşturulur.

#### 4. Antigravity Adaptörü Kurulumu
Antigravity IDE ve CLI entegrasyonlarını etkinleştirmek için:
```bash
npx agent-enderun init antigravity
```
*   **Oluşturulan Yapı:** `.gemini/antigravity/` veya `.gemini/antigravity-cli/` dizinleri altında yüksek disiplinli izole çalışma ortamları oluşturulur.

---

### 🕹️ CLI Komut Referansı ve Parametreleri

Enderun CLI, `agent-enderun` (veya `npx agent-enderun`) komutu ile yönetilir.

#### `init [adapter]`
Seçilen yapay zeka/IDE adaptörünü projeye kurar.
*   **Kullanım:** `npx agent-enderun init [gemini | claude | grok | antigravity]`
*   **Örnek:** `npx agent-enderun init claude`

#### `status`
Projenin aktif fazını (Phase 0 - 4), aktif Trace ID'sini ve uzman ajanların durum puanlarını listeler.
*   **Kullanım:** `npx agent-enderun status`

#### `check`
Anayasal uyumluluk denetimlerini, kritik dosya bütünlüklerini ve dizin doğrulamalarını gerçekleştirir.
*   **Kullanım:** `npx agent-enderun check`

#### `trace:new [description]`
Belirli bir geliştirme zinciri için yeni bir Trace ID (ULID) tetikler.
*   **Kullanım:** `npx agent-enderun trace:new "Giriş modülü tasarımı" [agent-name] [priority]`
*   **Örnek:** `npx agent-enderun trace:new "Auth module design" backend P1`

#### `orchestrate` / `loop`
Hermes Message Broker asenkron event-driven ajanlar arası iletişim döngüsünü canlı olarak başlatır.
*   **Kullanım:** `npx agent-enderun orchestrate`

#### `verify-contract`
Frontend ve backend katmanları arasındaki tip bütünlüğünü ve `contract.version.json` uygunluğunu kontrol eder.
*   **Kullanım:** `npx agent-enderun verify-contract`

#### `update-contract`
Backend tiplerinde yapılan değişiklikleri tarayarak `contract.version.json` üzerindeki SHA-256 hash imzalarını otonom olarak günceller.
*   **Kullanım:** `npx agent-enderun update-contract`

#### `create-app [idea]`
Doğal dildeki açıklamalardan, kurumsal standartlarda kontrat-tabanlı monorepo uygulaması üretir.
*   **Kullanım:** `npx agent-enderun create-app "Müşteri CRM Paneli"`

---

### 📦 Geliştirici & npm Link Test Altyapısı

Paketi npm'de yayınlamadan önce yerelinizde derlemek ve test etmek için:
```bash
# Proje bağımlılıklarını yükleyin
npm install

# framework-mcp (MCP Sunucusu) ve CLI derlemelerini tetikleyin
npm run enderun:build

# Paketi global NPM havuzunuza bağlayın
npm link

# Boş bir test dizini açıp aracı bağlayın
mkdir enderun-test && cd enderun-test
npm init -y
npm link agent-enderun

# Herhangi bir adaptör kurulumunu başlatın
npx agent-enderun init gemini
```

---
---

## 🇺🇸 ENGLISH — Detailed Product Guide & Documentation

**Agent Enderun** is not a generic boilerplate generator or a simple AI wrapper; it is an elite, state-of-the-art **AI Governance and Autonomous Army Command System** designed for complex, scalable, and highly auditable enterprise software projects.

As of **v0.9.4**, the system operates as a **"Living Engineering Organism"** capable of managing its own persistent memory, dynamically mapping project directory scopes, secure-logging expert agent activities, and **fully complying with Claude Code & Desktop Sandbox standards**.

---

### ❓ Why Agent Enderun?

As AI coding assistants (Claude Code, Gemini CLI, Grok Build, etc.) become increasingly powerful, software projects are prone to rapid architectural drift and token wastage. Agent Enderun solves these critical **enterprise AI challenges**:

1. **Rogue AI Prevention (Surgical Edits):** It strictly prohibits agents from rewriting entire files. Instead, it forces them to execute micro-targeted changes via **`replace_text` / `patch_file` tools**, reducing API token consumption by up to 90%.
2. **Context Loss Prevention (SSOT Memory):** AI agents naturally lose project history across chats. Enderun seals all project milestones, decisions, and tasks into a self-pruning **`PROJECT_MEMORY.md`** file, ensuring absolute context continuity.
3. **Contract-First Safety (Frontend-Backend Drift):** Before any user interface code is written, API models and branded types are sealed. The otonomous contract verification engine checks SHA-256 type definitions to prevent integration drifts.
4. **Symmetric Orchestration (Hermes Protocol):** 10 specialized expert agents communicate via an asynchronous, event-driven message broker (**Hermes**), preventing chaotic, uncoordinated AI behavior.
5. **Sandbox & Security Compliance:** Modern CLI agents (like Claude Code) restrict filesystem access. By keeping all configurations, task logs, and queues local (inside `.gemini/`, `.claude/`, `.grok/`, etc.) in the project workspace, Enderun runs with **zero sandbox violations**.

---

### 🚀 Key Improvements in Version v0.9.4

1. **🔒 Claude Sandbox-Compliant MCP Architecture:**
   * Integrated the `ENDERUN_PROJECT_ROOT` environment variable mapping, allowing the Model Context Protocol (MCP) server to dynamically resolve the target workspace root even when globally spawned by Claude Desktop.
   * Added auto-generation of project-level **`.mcp.json`** files during Claude adapter initialization, enabling seamless project discovery for the Claude Code CLI.
2. **📂 Robust Claude Config Resolution:**
   * Patched path resolution to look for macOS/Windows **`claude_desktop_config.json`** (instead of standard `config.json`) and Claude Code CLI global configuration **`~/.claude.json`**.
3. **🛸 Official Grok/xAI Directory Alignment:**
   * Aligned Grok's default `frameworkDir` from the generic `.agent` directory to the standard **`.grok/`** folder and **`grok.md`** shim file.
4. **🧹 Refactoring and Code Compaction:**
   * Removed duplicated local `getFrameworkDir` and `getMemoryPath` helpers in `src/cli/utils/app.ts`, merging them directly into `./memory.js` to respect the Single Source of Truth rule.

---

### 💎 Strategic Platform Synergy (The Four Powers)

Agent Enderun coordinates industry-leading AI environments by assigning each a specific strategic military role:
* **🚀 Claude Code (Operational Surgery):** The **Field Engineer**. Excels in executing precise, surgical, and autonomous codebase edits.
* **♊ Gemini & Vertex AI (Command Intelligence):** The **Command Center**. Analyzes project history, memory logs, and executes high-level strategic decisions.
* **🛸 Antigravity (Internal Discipline):** The **Military Academy**. Provides an isolated, high-discipline sandbox to preserve internal framework coding standards.
* **🤖 Grok / X.ai (Scouting Wing):** The **Scouting Specialist**. Explores futuristic agent behaviors and tests experimental protocols.

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
| **`@git`** | Version Control | Semantic Trace-ID-aligned commits, branch hygiene. |
| **`@mobile`** | Mobile Development | React Native / Expo UI automation and native builds. |
| **`@native`** | Desktop Engineering | Tauri and Electron desktop app integrations. |

---

### 🛠️ Adapter Scaffolding & Setup Guide

#### 1. Gemini Adapter
Initialize the Gemini CLI / Vertex AI environment:
```bash
npx agent-enderun init gemini
```
*   **Created Files:** `.gemini/` runtime folder, `gemini.md` (SSOT entrance), and `.gemini/mcp_config.json`.

#### 2. Claude Adapter (Claude Code CLI & Desktop App)
Bootstrap the framework for Anthropic's Claude:
```bash
npx agent-enderun init claude
```
*   **Created Files:** `.claude/` folder, `claude.md` shim, and project-level **`.mcp.json`** for Claude Code.
*   **Global Registration:** Automatically discovers and registers the MCP server in Claude Desktop's `claude_desktop_config.json` and Claude Code's `~/.claude.json`.

#### 3. Grok Adapter
Scaffold for xAI Grok Build:
```bash
npx agent-enderun init grok
```
*   **Created Files:** **`.grok/`** folder and **`grok.md`** shim file.

#### 4. Antigravity Adapter
Bootstrap the high-discipline sandbox for Antigravity IDE and CLI runtimes:
```bash
npx agent-enderun init antigravity
```
*   **Created Files:** `.gemini/antigravity/` or `.gemini/antigravity-cli/` isolated paths.

---

### 🕹️ CLI Command Reference

Execute commands via `agent-enderun` (or `npx agent-enderun`):

*   **`init [adapter]`**: Scaffold framework directories and register local/global MCP server instances.
*   **`status`**: Output active Phase (0-4), current active Trace ID, and agent capability logs.
*   **`check`**: Run a thorough framework integrity, folder alignment, and constitutional compliance check.
*   **`trace:new [desc] [agent] [priority]`**: Launch a new traceable task chain stamped with a unique ULID.
*   **`orchestrate` / `loop`**: Launch the Hermes live event-driven message-routing loop for asynchronous agent synchronization.
*   **`verify-contract`**: Perform a contract audit to ensure frontend types match backend schemas.
*   **`update-contract`**: Re-calculate type definitions and update `contract.version.json` with a new SHA-256 hash.
*   **`create-app [idea]`**: Autonomously generate a full-stack monorepo project starter based on natural language inputs.

---

### 📦 Local Package Testing & Development

To compile and link the package locally for development:
```bash
# Install package dependencies
npm install

# Compile the Model Context Protocol (MCP) server and build assets
npm run enderun:build

# Globally link package on your system
npm link

# Create a test folder and mount package
mkdir enderun-test && cd enderun-test
npm init -y
npm link agent-enderun

# Bootstrap scaffolding
npx agent-enderun init gemini
```

---

Developed with absolute discipline | Developer **Yusuf BEKAR** | Framework Version **v0.9.4**
