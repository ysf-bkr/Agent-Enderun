# AI-Enderun Shared Types v0.0.7

English | [Turkce](#turkce)

The `ai-enderun-shared-types` package is the contract-first type layer of AI-Enderun. It defines shared interfaces, branded identifiers, and API response shapes that backend and frontend agents must agree on before implementation.

## English

### Purpose

This package prevents drift between services, clients, and documentation.

### Principles

- Define shared types before implementation starts.
- Prefer branded identifiers for domain-safe IDs.
- Keep API success and error shapes explicit.
- Recalculate the contract hash whenever shared types change.

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
3. Update `contract.version.json` when the shared surface changes.
4. Reflect changes in `docs/api/` when endpoint contracts are affected.

## Turkce

`ai-enderun-shared-types`, AI-Enderun icindeki kontrat-oncelikli tip katmanidir. Backend ve frontend ajanlarinin implementasyondan once uzlasmasi gereken paylasilan arayuzleri, branded kimlik tiplerini ve API yanit sekillerini tanimlar.

### Temel Kurallar

- Ortak tipler implementasyondan once tanimlanir.
- Alan-guvenli ID yapisi icin branded tipler tercih edilir.
- API basari ve hata yapilari acik sekilde tanimlanir.
- Shared type degisikliginde kontrat hash'i guncellenir.

### Gelistirme

```bash
cd packages/shared-types
npm install
npm run build
npm run typecheck
```

## License

MIT
