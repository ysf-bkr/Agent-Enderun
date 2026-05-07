# PROJECT MEMORY — AI-Enderun

Bu dosya, projenin tek gerçeklik kaynağı (Single Source of Truth) ve kalıcı hafızasıdır.

## MEVCUT DURUM

| Aktif Faz | Profile | Son Güncelleme | Aktif Trace ID | Blokaj |
| :-------- | :------ | :------------- | :------------- | :----- |
| PHASE_0   | Lightweight | 2026-05-07 | 18969447-95fb-4a8f-b0af-18336c3f1931 | YOK |

## PROJE TANIMI

| Alan | Değer |
| :--- | :---- |
| Proje Adı | AI-Enderun |
| Platform | Agent skill sandbox / orchestration framework |
| Frontend | React 19 + Vite + Zustand + Tailwind |
| Backend | Node.js 20+ + Fastify |
| DB | PostgreSQL |
| Auth | Henüz netleştirilmedi |
| Deploy | Henüz netleştirilmedi |

## DOD DURUMU

| Faz | Durum | Not |
| :-- | :---- | :-- |
| PHASE_0 | IN_PROGRESS | Tool sözleşmeleri ve hafıza yapısı hizalanıyor |
| PHASE_1 | PENDING | `contract.version.json` ve ilk resmi kontratlar sonrası |
| PHASE_2 | PENDING | Feature geliştirme başlamadı |
| PHASE_3 | PENDING | Entegrasyon çalışmaları başlamadı |
| PHASE_4 | PENDING | Teslim aşamasına geçilmedi |

## KRİTİK KARARLAR

| Tarih | Karar | Gerekçe | Ajan |
| :---- | :---- | :------ | :--- |
| 2026-05-07 | Standalone Architecture | Maksimum esneklik ve bağımsızlık | @manager |
| 2026-05-07 | Contract-First Discipline | Sıfır hata ile ölçeklenebilir geliştirme | @manager |
| 2026-05-07 | Canonical MCP Tooling | Agent kabiliyetlerini korurken araç adlarını tek sözlükte hizalamak | @analyst |
| 2026-05-07 | UUID Trace Standard | Yeni görev zincirlerinde yalnızca UUID v4 kullanmak | @manager |

## TESLİM EDİLENLER

| Modül | Durum | Ajan | Tarih |
| :---- | :---- | :--- | :---- |
| Root ve paket README düzeni | Tamamlandı | @analyst | 2026-05-07 |
| Agent SOP temel kütüphanesi | Tamamlandı | @manager | 2026-05-07 |

## AKTİF GÖREVLER

| Trace ID | Görev | Ajan | Öncelik | Durum |
| :------- | :---- | :--- | :------ | :---- |
| 258ebde2-3c58-4cd6-afcd-a0952419b039 | Gelişmiş Denetim Testi | @analyst | P2 | IN_PROGRESS |
| 9bb9f0f8-bb5c-4176-8d3d-7a4d3e1bb997 | CLI implementasyon testi | @backend | P2 | IN_PROGRESS |
| e4ed34c1-6a55-4fd2-9f16-2ccf5ecadf8f | CLI test görevi | @backend | P2 | IN_PROGRESS |
| 6f8d0d7f-1f34-4f85-8b2b-3f2dcb6b8f6a | Agent hafızası ve beyin sözleşmelerini hizalama | @manager, @analyst | P1 | IN_PROGRESS |

## HISTORY (Kalıcı Hafıza)

### 2026-05-07 — README ve Dökümantasyon Güncellemesi

- **Ajan:** @analyst
- **Trace ID:** —
- **Yapılan:** Tüm README dosyaları (root, framework-mcp, shared-types, api) projenin "Enderun" kimliğine ve ajan yeteneklerine uygun şekilde detaylandırılarak güncellendi. Ajanların kurulum ve operasyonel protokolleri netleştirildi.
- **Karar:** Dökümantasyonun Türkçe ağırlıklı ancak global standartlarda tutulmasına karar verildi.
- **Sonraki Adım:** PHASE_1 hazırlıkları kapsamında ilk API dökümanlarının oluşturulması.

### 2026-05-07 — Görevlendirme ve Mülkiyet Analizi

- **Ajan:** @analyst
- **Trace ID:** ANALYST-001 (legacy)
- **Yapılan:** Proje dosyaları incelenerek @manager'ın @frontend'e web görevlendirmesi yapıp yapmadığı analiz edildi. Gemini.md üzerindeki mülkiyet matrisi teyit edildi.
- **Karar:** @frontend'in apps/web/ sahibi olduğu teyit edildi, ancak aktif operasyonel bir görev henüz atanmadı.
- **Sonraki Adım:** Phase 1 geçişi için tech-stack dökümanının detaylandırılması.

### 2026-05-07 — Hafıza ve Tooling Hizalaması

- **Ajan:** @analyst
- **Trace ID:** 6f8d0d7f-1f34-4f85-8b2b-3f2dcb6b8f6a
- **Yapılan:** `PROJECT_MEMORY.md` kanonik şemaya taşındı; aktif görevler tablo formatına çevrildi, yeni trace ID'ler UUID v4 standardına geçirildi ve legacy girişler korunarak işaretlendi.
- **Karar:** Hafıza yapısı agent kabiliyetlerini koruyacak şekilde genişletilecek, ancak artık tek şema olarak bu dosya kullanılacak.
- **Sonraki Adım:** Kontrat hash dosyasını bootstrap etmek ve tüm agent log dosyalarını başlatmak.
### 2026-05-07 — Ajan Yetenek ve Hafıza Analizi

- **Ajan:** @analyst (Antigravity)
- **Trace ID:** 6f8d0d7f-1f34-4f85-8b2b-3f2dcb6b8f6a
- **Yapılan:** Framework MCP araçları (`framework-mcp`) ve CLI (`bin/cli.js`) incelendi. Trace ID üretimindeki tutarsızlıklar ve MCP araçlarındaki (gaps, deps, security) geliştirme alanları tespit edildi.
- **Karar:** Trace ID formatının UUID v4 standardına çekilmesine ve programatik hafıza yönetimi için yeni MCP tool'ları eklenmesine karar verildi.
- **Sonraki Adım:** Uygulama planının (implementation_plan.md) onaylanması sonrası geliştirmelere başlanması.

### 2026-05-07 — Yayın Hazırlığı ve Temizlik

- **Ajan:** @manager
- **Trace ID:** 18969447-95fb-4a8f-b0af-18336c3f1931
- **Yapılan:** Proje GitHub ve npmjs yayınlama öncesi temizlendi. Build artıkları ve eski loglar silindi. Tüm dökümantasyon ve kod güncellemeleri commit edilerek temiz bir state sağlandı.
- **Karar:** Yayın öncesi logların temizlenmesine ve "clean build" state'ine geçilmesine karar verildi.
- **Sonraki Adım:** `git push` ve npm yayınlama işlemlerinin (varsa) manuel kontrolü.

### 2026-05-07 — Versiyon Yükseltme (v0.0.3)

- **Ajan:** @manager
- **Trace ID:** 18969447-95fb-4a8f-b0af-18336c3f1931
- **Yapılan:** npm yayınlama hatası (0.0.2 zaten mevcut) üzerine tüm paketlerin versiyonu `0.0.3` olarak güncellendi.
- **Karar:** Yayın hatalarını gidermek için tüm monorepo paketlerinin versiyonları senkronize edildi.
- **Sonraki Adım:** Yeniden `npm publish` yapılması.
