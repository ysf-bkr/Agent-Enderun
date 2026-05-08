# AI-Enderun (v0.0.5)

AI-Enderun, çoklu yapay zeka ajanlarını ortak bir anayasa (`Gemini.md`), faz tabanlı yürütme modeli ve kalıcı hafıza (`.gemini/PROJECT_MEMORY.md`) etrafında yöneten bir orkestrasyon çerçevesidir.

## Ne Sağlar?

- Agent odaklı çalışma modeli: `@manager`, `@analyst`, `@backend`, `@frontend`, `@explorer`, `@mobile`, `@native`
- Kalıcı hafıza ve görev takibi: `PROJECT_MEMORY.md`
- MCP tabanlı keşif/sorgulama: `packages/framework-mcp`
- Kontrat odaklı tip paylaşımı: `packages/shared-types`
- CLI ile hızlı operasyon: `ai-enderun`

## Hızlı Başlangıç

```bash
npx ai-enderun init
```

Adapter bazlı ilklendirme:

```bash
npx ai-enderun init gemini
npx ai-enderun init claude
npx ai-enderun init cursor
npx ai-enderun init codex
```

## Kurulum Sonrası Oluşan Çekirdek Yapı

```bash
.
├── .gemini/
│   ├── agents/
│   ├── docs/
│   ├── logs/
│   └── PROJECT_MEMORY.md
├── bin/cli.js
├── packages/
│   ├── framework-mcp/
│   └── shared-types/
├── mcp.json
├── Gemini.md
├── CLAUDE.md
├── CURSOR.md
└── CODEX.md
```

## CLI Komutları

```bash
ai-enderun status
ai-enderun trace:new "Auth modülü tasarımı" backend P1
ai-enderun init codex
ai-enderun version
```

Komut detayları:

- `status`: aktif faz, profil, trace ID ve aktif görevleri gösterir.
- `trace:new <desc> [agent] [priority]`: UUID v4 trace üretir, görevi `AKTİF GÖREVLER` tablosuna ekler.
- `init [adapter]`: framework dosyalarını hedef projeye kopyalar.
- `version`: framework sürümünü yazdırır.

## MCP Entegrasyonu

Varsayılan `mcp.json`:

```json
{
  "mcpServers": {
    "framework-mcp": {
      "command": "node",
      "args": ["packages/framework-mcp/dist/index.js"]
    }
  }
}
```

MCP sunucusu build:

```bash
cd packages/framework-mcp
npm install
npm run build
```

Ayrıntılı tool listesi için: `packages/framework-mcp/README.md`

## Hafıza ve İzlenebilirlik

Ana hafıza dosyası:

- `.gemini/PROJECT_MEMORY.md`

Operasyonel loglar:

- `.gemini/logs/manager.json`
- `.gemini/logs/analyst.json`
- `.gemini/logs/backend.json`
- `.gemini/logs/frontend.json`
- `.gemini/logs/explorer.json`
- `.gemini/logs/mobile.json`
- `.gemini/logs/native.json`

Önerilen iş akışı:

1. Görev için `trace:new` oluştur.
2. İlgili ajan, dosya değişiklikleri ile birlikte log kaydı yazsın.
3. Oturum sonunda `PROJECT_MEMORY.md` içinde `HISTORY` güncellensin.

## Kontrat Yönetimi

`packages/shared-types`, backend/frontend tip sözleşmesinin tek kaynağıdır.

- Tip güncelleme: `packages/shared-types/src/index.ts`
- Hash kaydı: `packages/shared-types/contract.version.json`

Ayrıntı: `packages/shared-types/README.md`

## Frontend Operasyon Test Sayfası

Bu repoda `apps/web/` altında ekleme + düzenleme akışını doğrulamak için bir sayfa bulunmaktadır.

Dosyalar:

- `apps/web/index.html`
- `apps/web/app.js`
- `apps/web/store.js`
- `apps/web/store.test.mjs`

Store testi çalıştırma:

```bash
node apps/web/store.test.mjs
```

## Sürüm ve Paket Notları

- Root paket sürümü: `0.0.5`
- MCP paket sürümü: `0.0.5`
- Shared-types paket sürümü: `0.0.5`

Yayın öncesi önerilen kontrol:

```bash
npm pack --dry-run
cd packages/framework-mcp && npm pack --dry-run
cd ../shared-types && npm pack --dry-run
```

## Lisans

MIT
