# ai-enderun-shared-types (v0.0.2)

`ai-enderun-shared-types`, AI-Enderun içinde backend/frontend arasında paylaşılan tip sözleşmelerinin merkezi paketidir.

## Amaç

- ID ve DTO tiplerini tek yerde toplamak
- Contract-first geliştirmeyi desteklemek
- Faz geçişlerinde sözleşme doğrulaması yapmak

## Güncel Dizin Yapısı

```bash
shared-types/
├── src/
│   └── index.ts
├── dist/
│   ├── index.js
│   ├── index.d.ts
│   └── *.map
├── contract.version.json
├── package.json
└── tsconfig.json
```

## Geliştirme Komutları

```bash
cd packages/shared-types
npm install
npm run build
npm run typecheck
```

Not: Bu pakette `tsc` local devDependency olarak kullanılır.

## Yayın Davranışı

Paket yayınına giren dosyalar:

- `dist/`
- `README.md`
- `package.json`

Kontrol:

```bash
npm pack --dry-run
```

## Kontrat Hash Doğrulama

`contract.version.json` içindeki hash ile kaynak hash'i karşılaştırma:

```bash
CURRENT_HASH=$(find packages/shared-types/src -name "*.ts" | sort | xargs shasum -a 256 | shasum -a 256 | awk '{print $1}')
STORED_HASH=$(jq -r '.contract_hash' packages/shared-types/contract.version.json)
[ "$CURRENT_HASH" = "$STORED_HASH" ] && echo "HASH OK" || echo "HASH MISMATCH"
```

## Kullanım Örneği

```ts
import type { ApiResponse, UserID } from "ai-enderun-shared-types";

function asUserId(raw: string): UserID {
  return raw as UserID;
}

const response: ApiResponse<{ id: UserID }> = {
  success: true,
  data: { id: asUserId("u-123") },
};
```

## Değişiklik Protokolü

1. `src/index.ts` güncelle.
2. `npm run typecheck` çalıştır.
3. `npm run build` ile `dist` üret.
4. `contract.version.json` hash güncelle.
5. `PROJECT_MEMORY.md` ve ilgili log dosyasında değişikliği kaydet.

## Lisans

MIT
