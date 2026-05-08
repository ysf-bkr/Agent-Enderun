# PROJECT MEMORY — AI-Enderun

Bu dosya, projenin tek gerçeklik kaynağı (Single Source of Truth) ve kalıcı hafızasıdır.

## MEVCUT DURUM

| Aktif Faz | Profile | Son Güncelleme | Aktif Trace ID | Blokaj |
| :-------- | :------ | :------------- | :------------- | :----- |
| PHASE_0   | Lightweight | 2026-05-08 | 760c3982-2a03-4a4a-8f5c-d5f79502e34a | YOK |

## PROJE TANIMI

| Alan | Değer |
| :--- | :---- |
| Proje Adı | AI-Enderun |
| Platform | Agent skill sandbox / orchestration framework |
| Frontend | React 19 + Vite + Zustand + Panda CSS |
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
| 2026-05-08 | Panda CSS Transition | Mimari disiplin ve tip güvenliği için Tailwind'den Panda CSS'e geçiş | @manager |
| 2026-05-08 | Zero UI Library Policy | Özgünlük ve tam kontrol için hazır kütüphanelerin yasaklanması | @manager |

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

### 2026-05-08 — Yayın Hazırlığı ve v0.0.5

- **Ajan:** @manager
- **Trace ID:** 760c3982-2a03-4a4a-8f5c-d5f79502e34a
- **Yapılan:** Loglar temizlendi, tüm paket versiyonları `v0.0.5` olarak güncellendi. Mimari değişiklikler (Panda CSS & Zero UI Library) sonrasında stabil bir yayın state'i oluşturuldu.
- **Karar:** Yayın öncesi logların temizlenmesine ve sürüm yükseltilmesine karar verildi.
- **Sonraki Adım:** `git push` ve npm yayınlama işlemlerinin gerçekleştirilmesi.

### 2026-05-08 — Panda CSS ve Özgün Tasarım Geçişi

- **Ajan:** @manager
- **Trace ID:** 760c3982-2a03-4a4a-8f5c-d5f79502e34a
- **Yapılan:** Projenin tasarım sistemi Tailwind'den Panda CSS'e taşındı. "Sıfır Hazır UI Kütüphanesi" (Zero UI Library) politikası kabul edildi. `Gemini.md`, `tech-stack.md` ve `frontend.md` dosyaları güncellendi.
- **Karar:** Mimari disiplini ve özgünlüğü en üst düzeye çıkarmak için Panda CSS + Custom UI Component (No Library) yaklaşımı benimsendi.
- **Sonraki Adım:** `apps/web` içerisinde Panda CSS kurulumunun yapılması ve config dosyasının oluşturulması.

### 2026-05-08 — Hafıza ve Yetenek Denetimi

- **Ajan:** @analyst
- **Trace ID:** 760c3982-2a03-4a4a-8f5c-d5f79502e34a
- **Yapılan:** Ajanların hafıza sistemi ve geçmişe dönük hatırlama kabiliyetleri test edildi. `PROJECT_MEMORY.md` ve log yapıları incelendi. Hafızanın tutarlı olduğu ve geçmişteki v0.0.4 yayın hazırlıklarını hatırladığı teyit edildi.
- **Karar:** Mevcut hafıza sistemi (Single Source of Truth) yeterli, ancak JSON loglamanın sürekliliği takip edilmeli.
- **Sonraki Adım:** Kullanıcının yönlendirmesine göre teknik geliştirmelere devam edilmesi.

### 2026-05-07 — Eksik Kaynak Dosyaları ve v0.0.4 Yayını

- **Ajan:** @manager
- **Trace ID:** 18969447-95fb-4a8f-b0af-18336c3f1931
- **Yapılan:** `pnpm dev` sırasında yaşanan `ERR_MODULE_NOT_FOUND` hatasını gidermek için `src` klasörleri yayın dosyalarına dahil edildi. Tüm paketler v0.0.4'e yükseltildi.
- **Karar:** Geliştirme modunda kaynak dosyalarına erişim gerekliliği nedeniyle `src` klasörlerinin pakete dahil edilmesine karar verildi.
- **Sonraki Adım:** Git push ve npm publish.

### 2026-05-07 — README ve Dökümantasyon Güncellemesi

- **Ajan:** @analyst
- **Trace ID:** —
- **Yapılan:** Tüm README dosyaları (root, framework-mcp, shared-types, api) projenin "Enderun" kimliğine ve ajan yeteneklerine uygun şekilde detaylandırılarak güncellendi.
- **Sonraki Adım:** PHASE_1 hazırlıkları kapsamında ilk API dökümanlarının oluşturulması.
