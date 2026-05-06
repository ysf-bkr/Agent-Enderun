# Agent Interaction & Coordination

## Roles & Responsibility Matrix
| Component | Primary Owner | Secondary |
|---|---|---|
| `apps/backend/` | @backend | @analyst |
| `apps/web/` | @frontend | @analyst |
| `packages/shared-types/` | @backend | @frontend |
| `.gemini/PROJECT_MEMORY.md` | @analyst | All (History only) |

## Communication Protocol
1. **Trace ID:** Her görev için @manager tarafından benzersiz bir UUID üretilir.
2. **Shared Types:** Backend ve Frontend kodlamaya başlamadan önce tiplerde anlaşmalıdır.
3. **Project Docs:** Projenin kapsamı [project-docs.md](file:///Users/ybekar/Desktop/Projeler/base/.gemini/docs/project-docs.md) üzerinden takip edilir. Kullanıcının ilettiği tüm detaylar buradadır.
4. **Project Memory:** Her oturum başında okunur, her oturum sonunda "HISTORY" kısmına özet eklenir.

## State Machine
- **PHASE_0 (Discovery):** Gereksinimlerin netleştirilmesi.
- **PHASE_1 (Architecture):** Kontratların (Shared Types) oluşturulması.
- **PHASE_2 (Development):** Özelliklerin geliştirilmesi.
- **PHASE_3 (Integration):** Entegrasyon testleri.
- **PHASE_4 (Deployment):** Canlıya çıkış.
