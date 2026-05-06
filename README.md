# 🏛️ AI-Enderun — Supreme Performance AI Orchestration (v0.0.2)

**Geliştirici:** Yusuf BEKAR (Senior Software Architect)  
**Durum:** 🛠️ Üretim Hazırı Çoklu Ajan Çerçevesi  
**Felsefe:** Kıdemli Mühendislik Disiplini ve Enderun Bilgeliği

---

## 🛡️ Neden AI-Enderun?

AI kod asistanlarının genellikle karmaşık, yapılandırılmamış ve teknik borç üreten kodlar (AI Slop) ürettiği bir dönemde, **AI-Enderun** bir disiplin abidesi olarak yükselir. Osmanlı İmparatorluğu'nun seçkin **Enderun** okulundan ilham alan bu framework, AI ajanlarını basit sohbet botları olarak değil, katı bir **Anayasa (Gemini.md)** ve **Faz Tabanlı Yürütme** modelini izlemek zorunda olan yüksek rütbeli **Senior Mühendisler** olarak görür.

[Türkçe](#türkçe) | [English](#english) | [Deutsch](#deutsch)

---

<a name="türkçe"></a>

## 🇹🇷 Türkçe: Kapsamlı Rehber

### 👥 Uzman Ajan Kadrosu (Yetenekler)

| Ajan          | Rol                 | Temel Yetenekler & Sorumluluklar                                                                                                   |
| :------------ | :------------------ | :--------------------------------------------------------------------------------------------------------------------------------- |
| **@manager**  | **CTO / Lider**     | Orkestrasyon, Trace ID Yönetimi, Faz Kapıları (Phase Gates), Briefing Oluşturma ve Proje Sağlığı.                                  |
| **@explorer** | **Ar-Ge / Analist** | `framework-mcp` ile derin kod taraması, bağımlılık haritalama, semantik arama ve mimari keşif.                                     |
| **@backend**  | **Mimar**           | Node.js (Fastify), Veritabanı (Kysely/PostgreSQL), Katmanlı Mimari (Route->Controller->Service->Repository) ve API Kontrat Yazımı. |
| **@frontend** | **UX Mühendisi**    | React 19, Tailwind CSS, Atomic Design, Fluid Typography (`clamp`), Dinamik Tasarım Tokenları ve Premium Estetik.                   |
| **@mobile**   | **Mobil Uzmanı**    | React Native, Offline-First stratejileri, 60 FPS performans optimizasyonu ve Güvenli Depolama (Keychain).                          |
| **@native**   | **Sistem Uzmanı**   | Electron/Tauri, IPC Güvenliği, İşletim Sistemi API entegrasyonları ve Auto-Update sistemleri.                                      |
| **@analyst**  | **QA / Denetçi**    | Kontrat Doğrulama (SHA-256), Proje Hafızası (PROJECT_MEMORY) Yönetimi, QA Kapısı ve Walkthrough üretimi.                           |

### 🚀 Kurulum ve Yapılandırma

AI-Enderun framework'ünü herhangi bir projeye (yeni veya mevcut) dahil etmek için `npx` komutunu kullanabilirsiniz. Bu işlem, projenize kıdemli mühendislik standartlarını ve ajan yapılandırmalarını enjekte eder.

#### 1. Framework'ü İlklendirme

En temel kurulum için aşağıdaki komutu çalıştırın:

```bash
npx ai-enderun init
```

#### 2. AI Adaptörü Seçimi (Özel Talimatlar)

Kullandığınız AI asistanına göre özel yapılandırma dosyalarını (Anayasa dökümanları) yükleyebilirsiniz:

```bash
# Google Gemini için (Gemini.md yükler)
npx ai-enderun init gemini

# Anthropic Claude için (CLAUDE.md yükler)
npx ai-enderun init claude

# Cursor IDE için (CURSOR.md yükler)
npx ai-enderun init cursor

# GitHub Copilot / Codex için (CODEX.md yükler)
npx ai-enderun init codex
```

#### 3. MCP Sunucusunu Bağlama

AI asistanınızın (örn: Claude Desktop) projenizi derinlemesine analiz edebilmesi için MCP sunucusunu yapılandırın:

1. `packages/framework-mcp` dizinine gidin.
2. `npm install` ve `npm run build` komutlarını çalıştırın.
3. AI istemcinizin konfigürasyonuna MCP yolunu ekleyin (Detaylar: [framework-mcp/README.md](file:///Users/ybekar/Desktop/Projeler/base/packages/framework-mcp/README.md)).

### 🛠️ CLI Komutları (Derinlemesine)

- **`ai-agent-framework status`**: `PROJECT_MEMORY.md` dosyasını tarayarak projenin hangi fazda olduğunu, son kararları ve bekleyen görevleri terminale raporlar.
- **`ai-agent-framework trace:new <desc> [agent]`**: Yeni bir iş akışı başlatır. Benzersiz bir Trace ID üretir ve bu ID'yi hafızadaki `AKTİF GÖREVLER` tablosuna ilgili ajan etiketiyle ekler.
- **`ai-agent-framework init <adapter>`**: Projeyi sıfırdan kurar veya yeni bir AI adaptörü ekleyerek dökümantasyonu günceller.

---

<a name="english"></a>

## �� English: The Definitive Guide

### 👥 Specialized Agent Squad (Capabilities)

- **@manager (CTO):** Orchestration, Trace ID management, and phase gate control.
- **@explorer (R&D):** Deep codebase scanning and semantic search via `framework-mcp`.
- **@backend (Architect):** High-performance logic, Kysely/PostgreSQL, and API contract leadership.
- **@frontend (UX):** React 19, Fluid aesthetics, and advanced design token systems.
- **@mobile (Mobile):** High-performance React Native with offline-first capabilities.
- **@native (System):** Secure desktop integration via Electron or Tauri.
- **@analyst (QA):** Integrity auditing, memory consistency, and QA gatekeeping.

### 🚀 Quick Start

```bash
npx ai-enderun init
```

---

## 🏗️ Detaylı Proje Yapısı

Proje, hem monorepo standartlarını hem de AI ajanlarının hafıza yönetimini optimize eden hibrit bir yapıya sahiptir:

```bash
.
├── 📜 Gemini.md                  # Ana Anayasa: Tüm ajanların uyması gereken yüce kurallar.
├── 📜 CLAUDE.md / CURSOR.md      # Adaptör Dosyaları: Seçilen AI asistanına özel talimatlar.
├── 📁 bin/
│   └── ⚙️ cli.js                  # AI-Enderun CLI: Proje yönetimi ve Trace ID motoru.
├── 📁 .gemini/                   # 🧠 Framework Beyni
│   ├── 📁 agents/                # Ajan Personaları: Her rolün (backend, frontend vb.) SOP'ları.
│   │   ├── manager.md            # CTO orkestrasyon kuralları.
│   │   ├── backend.md            # API ve DB mimari standartları.
│   │   └── ...                   # Diğer uzman ajan tanımları.
│   ├── 📁 docs/                  # Teknik Dökümantasyon
│   │   ├── 📁 api/               # API Kontratları: Endpoint tanımları ve dökümanları.
│   │   ├── 📜 tech-stack.md      # Projenin teknoloji yığını kararları.
│   │   └── 📜 WIKI.md            # Genel proje bilgi bankası.
│   ├── 📁 logs/                  # İşlem Kayıtları: Ajan bazlı aktivite logları.
│   └── 📜 PROJECT_MEMORY.md      # 📍 SSoT: Projenin canlı hafızası ve durum takibi.
├── 📁 packages/                  # 📦 Modüler Paketler
│   ├── 📁 framework-mcp/         # Zeka Motoru: Kod analizi yapan MCP sunucusu.
│   │   ├── 📁 src/               # MCP tool tanımları ve mantığı.
│   │   └── 📜 package.json
│   └── 📁 shared-types/          # Tip Kontratı: Backend/Frontend ortak tipleri.
│       ├── 📁 src/               # TypeScript interface ve DTO tanımları.
│       └── 📜 contract.version.json # Kontrat bütünlük hash kaydı.
├── 📁 apps/                      # 🚀 Uygulamalar (PHASE_2'de oluşturulur)
│   ├── 📁 web/                   # React 19 Frontend uygulaması.
│   └── 📁 api/                   # Fastify Backend uygulaması.
├── 📜 package.json               # Ana proje bağımlılıkları.
└── 📜 mcp.json                   # MCP sunucu konfigürasyonu.
```

---

## � Yürütme Fazları (Execution Phases)

1. **PHASE_0: Discovery** - Stack onayı ve profil seçimi.
2. **PHASE_1: Architecture** - `shared-types` ve API kontratlarının onaylanması.
3. **PHASE_2: Development** - Core özelliklerin birim testlerle teslimi.
4. **PHASE_3: Integration** - Gerçek DB ve entegrasyon testleri.
5. **PHASE_4: Deployment** - Üretim dökümantasyonu ve yayına alım.

---

## 👨‍💻 Geliştirici Hakkında

**Yusuf BEKAR**, karmaşık sistemleri ve yüksek performanslı ekipleri yönetme konusundaki deneyimini AI çağına taşıyan bir Senior Software Architect'tir. AI-Enderun, mühendislik disiplininin AI ile birleştiği zirve noktadır.

---

> **Yüce Yasa:** Kıdemli disiplini bir seçenek değil, standarttır.
