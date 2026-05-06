# Tech Stack & Standards

## Core Technologies

- **Frontend:** React 19 + Vite (SPA)
- **Icons:** Lucide Icons (`lucide-react`)
- **State Management:** Zustand
- **Styling:** Tailwind CSS + "Supreme Frontend Aesthetics" Guidelines

## Design System (Adaptive Palette)

- **Strategy:** Proje bağlamına özel, dinamik renk paleti üretimi.
- **Modes:** Native Dark & Light mode desteği zorunludur.
- **Generation:** `@frontend` ajanı, `project-docs.md` içindeki marka kimliğine göre paleti kendi belirler.
- **Standard:** Tüm renkler CSS değişkenleri (`--color-*`) üzerinden yönetilmeli, hardcoded değerlerden kaçınılmalıdır.

## Architectural Standards

- **Backend:** Node.js 20+ + Fastify
- **Database:** PostgreSQL
- **Query Builder:** Kysely
- **Contract-First:** `packages/shared-types` üzerinden ortak tip tanımları.
- **Branded Types:** Tüm ID'ler markalı tip olmalıdır.
- **Zero Mock Policy:** Sahte veri yerine gerçek DB/Sandbox kullanımı.
- **Logging:** Yapısal JSON loglama (`.gemini/logs/`).

## Environment Management

- `.env.development` (Yerel)
- `.env.test` (CI)
- `.env.production` (Deployment)
