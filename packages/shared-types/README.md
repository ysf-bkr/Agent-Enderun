# AI-Enderun Shared Types v0.0.9

English | [Türkçe](#türkçe)

The `ai-enderun-shared-types` package is the contract-first type layer of AI-Enderun. It defines shared interfaces, branded identifiers, and API response shapes that backend and frontend agents must agree on before implementation.

## English

### Purpose

This package prevents drift between services, clients, and documentation. It serves as the Single Source of Truth for the data contract.

### Principles

- **Contract-First:** Define shared types before implementation starts.
- **Branded Identifiers:** Prefer domain-safe IDs (e.g., `UserID`, `ProductID`).
- **Standardized Responses:** Keep API success and error shapes explicit and consistent.
- **ULID Standard:** Native support for 26-character sortable identifiers.
- **Hash Verification:** Recalculate the contract hash whenever shared types change.

### Development

```bash
cd packages/shared-types
npm install
npm run build
npm run typecheck
```

### Typical Usage

```typescript
import { ApiResponse, SessionID, UserID } from "ai-enderun-shared-types";
```

### Contract Workflow

1. Update `src/index.ts`.
2. Verify consuming packages still match the contract.
3. Update `contract.version.json` via MCP tools when the shared surface changes.
4. Reflect changes in root `docs/api/` when endpoint contracts are affected.

## Türkçe

`ai-enderun-shared-types`, AI-Enderun içindeki kontrat-öncelikli (contract-first) tip katmanıdır. Backend ve frontend ajanlarının kod yazmadan önce uzlaşması gereken paylaşılan arayüzleri, güvenli kimlik tiplerini ve API yanıt şekillerini tanımlar.

### Temel Kurallar

- **Önce Kontrat:** Ortak tipler implementasyondan önce tanımlanır.
- **Güvenli Kimlikler:** Hatalı eşleşmeleri önlemek için branded tipler (örn: `UserID`) kullanılır.
- **Standart Yanıtlar:** API başarı ve hata yapıları projenin tamamında tutarlı tutulur.
- **ULID Desteği:** 26 karakterlik sıralanabilir kimlikler için yerleşik destek sunar.
- **Hash Doğrulama:** Tip değişikliğinde kontrat hash'i güncellenerek senkronizasyon sağlanır.

### Geliştirme

```bash
cd packages/shared-types
npm install
npm run build
npm run typecheck
```

## License

MIT
