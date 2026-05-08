# AI-Enderun — Supreme Performance AI Orchestration (v0.0.5)

# Place in project root. This file is the single source of truth for all AI clients (Gemini CLI, Claude Code, etc.).

## 🎖️ AGENT CHECKLIST (MANDATORY IN EVERY RESPONSE)

> Every response MUST end with the **Agent Completion Report** defined in the [OUTPUT FLOWS] section.

---

## Constitution Status

This file (`./Gemini.md`) and the `.gemini/docs/` folder represent the "Supreme Law" of the project. All agents must read this file first in every session and strictly comply with its rules 100%.

---

## AGENT MODEL (How this Framework Works)

Each "agent" in this project is an independent AI conversation (Claude/GPT).

- **Orchestration:** Done by the user or an external tool (LangGraph/CrewAI).
- **Ajanlar:** @manager, @explorer, @backend, @frontend, @analyst.
- **State:** Persistent memory is stored in `.gemini/PROJECT_MEMORY.md`.
- **Communication:** Agents read the memory and exchange directives via the user.

---

## STEP 0 — STARTUP (EVERY SESSION, NON-NEGOTIABLE)

1. **Read ./Gemini.md First:** Read and fully understand this file.
2. **Read Project Memory:** `.gemini/PROJECT_MEMORY.md` dosyasını oku ve şu bilgileri çıkar:
   - `MEVCUT DURUM` → Hangi fazdayız? Aktif Trace ID var mı?
   - `KRİTİK KARARLAR` tablosu → Daha önce ne kararlaştırıldı?
   - `AKTİF GÖREVLER` tablosu → Bana atanmış görev var mı?
   - `PROJE TANIMI` ve `DOD DURUMU` bölümleri → Mimari çerçeve ve faz kalitesi net mi?
   - `HISTORY` bölümü → Son 3 girişi oku, önceki çalışmaları anla.

- [ ] Check `.gemini/docs/` Folder: Verify if `tech-stack.md` and `project-docs.md` exist.

4. **Default Stack:**
   - **Frontend:** React 19 + Vite (SPA) + Zustand + Panda CSS.
   - **Backend:** Node.js 20+ + Fastify + Kysely + PostgreSQL.
5. **OTURUM SONU ZORUNLULUĞU:** Her yanıt sonunda `.gemini/PROJECT_MEMORY.md` → `HISTORY` bölümüne özet ekle ve ilgili log dosyasına kayıt yaz. Bu adım atlanamaz.

---

## STEP 1 — VALIDATE BEFORE ACTING

If `tech-stack.md` is missing or empty, do not write code until the following is clarified:

| Unknown                              | Action               |
| ------------------------------------ | -------------------- |
| Target Audience                      | Ask — do not proceed |
| Platform (web / mobile / desktop)    | Ask — do not proceed |
| Database                             | Ask — do not proceed |
| Environment (prototype / production) | Ask — do not proceed |
| Auth required?                       | Ask — do not proceed |
| Monorepo or separate?                | Ask — do not proceed |
| Deploy target                        | Ask — do not proceed |
| i18n required?                       | Ask — do not proceed |

**Minor details** (port, file names) → Assume and state at the beginning: `Assumption: [what] — [why]`.

---

## PROJECT MEMORY & LOCK PROTOCOL

- **Memory Initialization:** All agents reference `.gemini/PROJECT_MEMORY.md` at the start of any task.
- **Kalıcı Hafıza Protokolü:** Every agent MUST append a summary to the **HISTORY** section of `PROJECT_MEMORY.md`.
- **Canonical Memory Shape:** `PROJECT_MEMORY.md` şu ana bölümleri korur: `MEVCUT DURUM`, `PROJE TANIMI`, `DOD DURUMU`, `KRİTİK KARARLAR`, `TESLİM EDİLENLER`, `AKTİF GÖREVLER`, `HISTORY`.
- **HISTORY Entry Format (Zorunlu):**

  ```markdown
  ### [YYYY-MM-DD] — [Görev Başlığı]

  - **Ajan:** @[agent-name]
  - **Trace ID:** [uuid veya —]
  - **Yapılan:** [Ne yapıldı, 2-3 cümle]
  - **Karar:** [Varsa önemli karar]
  - **Sonraki Adım:** [Ne yapılması gerekiyor]
  ```

- **MEVCUT DURUM Güncellemesi:** Her oturum sonunda `MEVCUT DURUM` tablosundaki `Aktif Faz`, `Son Güncelleme` ve `Aktif Trace ID` alanlarını güncelle.
- **Trace ID Rule:** Yeni görev zincirlerinde UUID v4 kullanılır. Arşivdeki legacy kısa ID'ler korunabilir, ancak yeni girişler UUID v4 formatına geçmelidir.
- **Memory Lock Rule:** To prevent concurrent writes, agents check for `.gemini/PROJECT_MEMORY.lock`.
  - If exists: Wait 1s, retry. (Max 5 retries).
  - After 5 retries: Report `BLOCKED — Memory Lock Timeout`.
  - On success: Create lock, write, delete lock.

---

## FILE OWNERSHIP MATRIS

| Component                   | Primary Owner    | Secondary                             |
| --------------------------- | ---------------- | ------------------------------------- |
| `apps/backend/`             | @backend         | @analyst                              |
| `apps/web/`                 | @frontend        | @analyst                              |
| `apps/mobile/`              | @mobile          | @analyst                              |
| `apps/native/`              | @native          | @analyst                              |
| `packages/shared-types/`    | @backend         | @frontend                             |
| `.gemini/PROJECT_MEMORY.md` | @analyst         | All (History only)                    |
| `.gemini/docs/api/`         | @backend (yazar) | @analyst (denetler), @frontend (okur) |
| `.env.*`                    | @manager         | @backend                              |

---

## CORE PRINCIPLES

- **@manager Orchestration:** Manager analiz eder, ajanları seçer ve Briefing Template sağlar. Her görev için benzersiz bir `Trace ID` (UUID) üretmekten sorumludur.
- **Contract-First Approach:** Backend ve Frontend kod yazmadan önce `shared-types` ve `.gemini/docs/api/` üzerinden anlaşmalıdır. **@backend** endpoint yazar → `.gemini/docs/api/[domain].md` günceller → **@frontend** okur, sonra kodlar.
- **Auth & i18n Responsibility:** Auth (@backend), i18n (@frontend - logic / @analyst - content).
- **Zero Mock Policy:** Sahte veri yasak.
  - **Exception 1:** External 3rd party services (Stripe etc.) → `ADAPTER_PATTERN` + `SANDBOX_MODE`.
  - **Exception 2:** Unit Tests → Mocks allowed for external dependencies.
- **Branded Types Law:** Tüm ID'ler Branded Types (`packages/shared-types`) olmalıdır.
- **Search Before Reading:** Hiçbir ajan bir dosyayı körü körüne okumamalıdır; önce `search_codebase`, `analyze_dependencies`, `get_memory_insights` ve `get_project_gaps` ile bağlamı taramalıdır. Legacy prompt uyumluluğu için `codebase_search`, `codebase_graph_query`, `codebase_context`, `codebase_context_search` ve `codebase_status` alias'ları da desteklenir.
- **Full-Spectrum Responsive:** Her bileşen mobile-first başlar (320px) ve ultra-wide ekranlara (1920px+) kadar `clamp()` ve `aspect-ratio` ile akışkan (fluid) kalmalıdır.
- **Supreme Frontend Aesthetics:** @frontend, "AI slop" estetiğinden kaçınmalı; özgün, karakterli ve üretim kalitesinde arayüzler tasarlamalıdır. **Sıfır Hazır UI Kütüphanesi Politikası:** Ajanlar asla `shadcn/ui`, `MUI`, `Chakra UI` gibi hazır bileşen kütüphaneleri kullanmaz. Tüm UI bileşenleri (Button, Modal, Input vb.) Panda CSS ile sıfırdan ve projeye özgün olarak inşa edilmelidir.
- **Audit Logging:** Tüm kritik işlemler loglanmalıdır.

---

## ABSOLUTE DON'TS — KIRMIZI ÇİZGİLER

| Kural                          | Gerekçe                                                     |
| ------------------------------ | ----------------------------------------------------------- |
| `any` tipi yasak               | Type safety bozulur; `unknown` + type guard kullanılır.     |
| `console.log` yasak            | Production'da yasak; structured logger (`pino`) kullanılır. |
| Hardcoded secret yasak         | API key/token asla kod içinde olmaz; `.env` kullanılır.     |
| Raw SQL string yasak           | Sadece Kysely; injection riski.                             |
| Controller'da DB çağrısı yasak | Repository pattern zorunludur.                              |
| try/catch'siz async yasak      | Her async blok hata yönetimi içermeli.                      |
| İzinsiz dosya değişimi yasak   | File Ownership kuralı geçerlidir.                           |

---

## EXECUTION PROFILES

- **Lightweight Profile (MVP):** SaaS, MVP veya hızlı prototipler için. Sadece manager, backend, frontend, analyst ve explorer aktiftir.
- **Full Profile (Enterprise):** Karmaşık sistemler, mobil/native entegrasyonu olan veya yüksek güvenlik gerektiren projeler için. Tüm ajanlar aktiftir.

---

## ENVIRONMENT POLICY

- **Hierarchy:** `.env.development` (yerel), `.env.test` (CI), `.env.production` (deployment).
- **Management:** `@manager` stratejiyi belirler, `@backend` implementasyonu yapar. Sırlar asla commit edilmez, `.env.example` güncel tutulur.

---

## OUTPUT FLOWS — ZORUNLU ÇIKTI STANDARDI

Her agent yanıtı şu sırayla yapılandırılır:

1. **Assumptions** — Yapılan varsayımlar.
2. **Problem** — Ne inşa edildiği ve neden (max 3 cümle).
3. **File Tree** — Oluşturulan/değiştirilen dosyalar.
4. **Code** — Eksiksiz kod (`...` ile kısaltma yasaktır).
5. **Tests** — Vitest (Web/Backend), Jest (Mobile), Playwright (Native).
6. **Dependency Map** — Sadece `@manager` yanıtları için zorunlu (Mermaid).
7. **Agent Completion Report** — Standart blok.

---

## STATE MACHINE — EXECUTION PHASES

| Faz     | Durum        | Giriş Kriteri | Çıkış Kriteri (DoD)                             |
| ------- | ------------ | ------------- | ----------------------------------------------- |
| PHASE_0 | Discovery    | —             | tech-stack.md onaylandı, Profile seçildi.       |
| PHASE_1 | Architecture | PHASE_0 tamam | shared-types onaylandı, contract hash üretildi. |
| PHASE_2 | Development  | PHASE_1 tamam | Core featurelar ve birim testler teslim edildi. |
| PHASE_3 | Integration  | PHASE_2 tamam | Gerçek DB ile entegrasyon testleri geçti.       |
| PHASE_4 | Deployment   | PHASE_3 tamam | Production deploy, walkthrough hazır.           |

---

## DEFINITION OF DONE (DoD) CHECKLIST

_DoD kontrolleri sadece seçilen (Lightweight/Full) profildeki **aktif** ajanları kapsar._

**PHASE_0 → PHASE_1:**

- [ ] `tech-stack.md` approved by @manager.
- [ ] Target Audience, Platform, DB defined.
- [ ] Execution Profile selected.

**PHASE_1 → PHASE_2:**

- [ ] `shared-types` approved by all parties.
- [ ] `contract.version.json` created and hash verified.
- [ ] OpenAPI schema documented in `.gemini/docs/api/`.

**PHASE_2 → PHASE_3:**

- [ ] All features delivered with Unit Tests (Vitest).
- [ ] MANDATORY Log schema implemented in all **active** agents.
- [ ] No `any` or `console.log` violations.

**PHASE_3 → PHASE_4:**

- [ ] Integration tests passed with real DB (TestContainers).
- [ ] Zero Mock Policy verified (except exceptions).

**PHASE_4 (Done):**

- [ ] `PROJECT_MEMORY.md` fully updated.
- [ ] Walkthrough documentation ready.

---

## API & CONTRACT MANAGEMENT

### 1. contract.version.json Schema

```json
{
  "version": "MAJOR.MINOR",
  "last_updated": "ISO-8601",
  "contract_hash": "sha256-...",
  "breaking_changes": [{ "version": "1.0", "description": "Initial" }]
}
```

### 2. CI Hash Verification

```bash
CURRENT_HASH=$(find packages/shared-types/src -name "*.ts" | sort | xargs sha256sum | sha256sum | awk '{print $1}')
STORED_HASH=$(jq -r '.contract_hash' packages/shared-types/contract.version.json)
[ "$CURRENT_HASH" = "$STORED_HASH" ] || (echo "HASH MISMATCH" && exit 1)
```

---

## MANDATORY LOG SCHEMA (JSON)

All agents MUST log to `.gemini/logs/[agent].json` using the available file-writing capability of the active client.
_Logs are stored as a **JSON Array**. Every turn appends a new object to the array._

```json
{
  "timestamp": "ISO-8601",
  "agent": "string",
  "action": "CREATE | MODIFY | DELETE | DECISION",
  "requestId": "uuid",
  "files": ["string[]"],
  "status": "SUCCESS | FAILURE",
  "summary": "İşlemin Türkçe özeti",
  "details": { "key": "value" }
}
```

---

## LANGUAGE POLICY

- **Language Alignment:** Başlıklar ve terminoloji İngilizce, içerik ve yorumlar Türkçe.
- **Code comments:** Türkçe (Neden yapıldığı).
- **Names:** English (Variable/File).

---

## ✅ HER YANIT SONU ZORUNLU BLOK (REPORT)

---

**Agent Completion Report** (v1.0.2)

- Mock kullanıldı mı? [ ] Hayır / [ ] Evet
- shared-types değişti mi? [ ] Hayır / [ ] Evet
- **API kontratı yazıldı/okundu mu? [ ] Hayır / [ ] Evet → .gemini/docs/api/[domain].md**
- Log yazıldı mı? [ ] Hayır / [ ] Evet → .gemini/logs/[agent].json
- **PROJECT_MEMORY HISTORY güncellendi mi? [ ] Hayır / [ ] Evet**
- Bir sonraki adım: [ne yapılmalı]
- Blokajlar: [varsa yaz, yoksa "YOK"]

---
