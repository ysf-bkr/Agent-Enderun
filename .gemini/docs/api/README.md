# API Contract Hub

Bu dizin, backend ve frontend arasındaki tüm API anlaşmalarının (endpoint, DTO, response, hata semantiği) tek referans noktasıdır.

## Hedef

- Kontratsız implementasyonu engellemek
- Frontend/backend ayrışmasını düşürmek
- Faz geçişlerinde denetlenebilirlik sağlamak

## Zorunlu Kurallar

1. Endpoint yazılmadan önce kontrat dokümanı hazırlanır.
2. Frontend, kontrat dokümanı olmadan entegrasyon yazmaz.
3. Tip referansları `packages/shared-types` ile uyumlu olmalıdır.
4. Her endpoint kaydında `Trace ID` bulunmalıdır.
5. Breaking change durumunda `contract.version.json` ve `PROJECT_MEMORY.md` güncellenmelidir.

## Önerilen Dosya Yapısı

```bash
.gemini/docs/api/
├── README.md
├── auth.md
├── user.md
└── project.md
```

## Endpoint Kayıt Şablonu

```md
# [Domain] API Contract

## Summary
- Owner: @backend
- Trace ID: <uuid-v4>
- Last Update: YYYY-MM-DD

## Endpoints

### [METHOD] /api/v1/[path]
- Auth: Required | Optional
- Request DTO: `packages/shared-types/src/index.ts` -> `XxxRequest`
- Response DTO: `packages/shared-types/src/index.ts` -> `XxxResponse`
- Errors:
  - 400 VALIDATION_ERROR
  - 401 UNAUTHORIZED
  - 404 NOT_FOUND
- Notes: [iş kuralı]
```

## İnceleme Checklist

- Endpoint path/verb net mi?
- Request/response tipleri shared-types ile birebir mi?
- Hata kodları ve hata mesajları tanımlı mı?
- Auth gereksinimi açık mı?
- Trace ID mevcut mu?

## Faz Geçişi İçin Minimum Kriter

- PHASE_1 bitişi için: kritik domain kontratları dokümante edilmiş olmalı.
- PHASE_2 başlangıcı için: frontend tüketeceği endpointleri bu klasörde doğrulamış olmalı.

## Operasyon Notu

Bu klasör, `PROJECT_MEMORY.md` ve agent logları ile birlikte okunmalıdır. API kararları her zaman hafıza kayıtlarıyla ilişkilendirilmelidir.
