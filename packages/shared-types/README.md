# AI-Enderun Shared Types (v0.3.4)

English | [Türkçe](#türkçe)

The `@ai-enderun/shared-types` package is the "Supreme Law" of data within the Agent Enderun framework. It ensures perfect synchronization between backend and frontend through a **Contract-First** approach.

## English

### Core Principles

- **Zero Drift:** Backend and frontend implementation must strictly follow these types.
- **Branded Types:** We use the "Branded Types" pattern to ensure type safety for domain identifiers (e.g., `UserID` vs. `ProjectID`).
- **Atomic Versioning:** Every change to this package triggers a hash mismatch in the framework, forcing a contract verification step.

### Key Components

#### Branded Identifiers
Prevents accidental usage of a UserID where a ProjectID is expected.
```typescript
export type UserID = string & { readonly __brand: "UserID" };
export type ProjectID = string & { readonly __brand: "ProjectID" };
```

#### API Contracts
Standardized shapes for requests and responses.
```typescript
export interface ApiResponse<T> {
  data: T;
  traceId: string;
  timestamp: string;
}
```

### Contract Workflow

1. **Modify**: Update `src/index.ts` with new DTOs or Types.
2. **Build**: `npm run build`
3. **Verify**: Run `agent-enderun verify-contract` to detect changes.
4. **Sync**: Update `contract.version.json` with the new hash using the MCP tool `update_contract_hash`.

## Türkçe

`@ai-enderun/shared-types`, Agent Enderun çerçevesindeki verilerin "Yüce Yasası"dır. **Kontrat Öncelikli** (Contract-First) yaklaşımıyla backend ve frontend arasında kusursuz bir uyum sağlar.

### Temel Özellikler

- **Branded Types:** Kimlik karışıklıklarını önlemek için özel tipler kullanılır.
- **API Sözleşmeleri:** Tüm istek ve yanıtlar için standart şablonlar.
- **Hash Doğrulama:** Tip değişiklikleri merkezi bir hash üzerinden takip edilir.

### Geliştirme

```bash
npm install
npm run build
npm run typecheck
```

## License

MIT
