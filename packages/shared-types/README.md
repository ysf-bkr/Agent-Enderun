# 📦 @ai-enderun/shared-types (v0.0.5)

Bu paket, AI-Enderun ekosistemindeki Backend ve Frontend arasındaki **tek gerçeklik kaynağı (SSOT)** olan tip sözleşmelerini barındırır.

## 🌟 Öne Çıkan Özellikler

- **Branded Types:** `UserID` ve `ProductID` gibi kimliklerin yanlışlıkla birbirinin yerine kullanılmasını engelleyen tip güvenliği.
- **Built-in ULID:** Zamana göre sıralanabilir, 26 karakterlik performanslı kimlik üretimi.
- **API Wrapper:** Tüm endpoint'ler için standart `ApiSuccess` ve `ApiError` yapıları.
- **Strict Error Handling:** Proper HTTP Status kodlarıyla senkronize hata tipleri.

## 🛠️ Temel Kullanım

### ULID ve ID Üretimi
```typescript
import { createUserID, createULID } from '@ai-enderun/shared-types';

const id = createUserID(); // ULID formatında UserID döner
const raw = createULID(); // Saf 26 karakterlik ULID string
```

### API Yanıt Yapısı
Framework, hatalarda `200 OK` dönülmesini kesinlikle yasaklar.

```typescript
// Başarılı Yanıt
const response: ApiResponse<User> = {
  success: true,
  data: { id: '...', name: 'Yusuf' }
};

// Hata Yanıtı (Gerçek HTTP 401/404 vb. ile birlikte)
const error: ApiError = {
  success: false,
  code: 'UNAUTHORIZED',
  message: 'Yetkisiz erişim.',
  statusCode: 401
};
```

## 📐 Mimari Kurallar

1. **Owner:** Bu paketin birincil sahibi `@backend` ajanıdır.
2. **Workflow:** Backend bir tip değiştirir -> `contract_hash` güncellenir -> Frontend dökümantasyonu okur ve tipi import eder.
3. **No Logic:** Bu paket sadece tip tanımları ve hafif yardımcılar (generator'lar) içermelidir; ağır iş mantığı barındıramaz.

## 🔨 Geliştirme

```bash
npm install
npm run build # npx tsc ile derler
```

## 📜 Lisans

MIT
