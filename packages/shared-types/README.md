# 📐 ai-enderun-shared-types (v0.0.2)

**Durum:** 🛠️ Tek Gerçeklik Kaynağı (SSoT)  
**Felsefe:** Contract-First Disiplini  
**Rol:** Teknik Anayasa ve Veri Kontratı

**ai-enderun-shared-types**, projenin tüm veri yapılarını, API kontratlarını ve tip tanımlarını yöneten merkezi katmandır. Backend ve Frontend arasındaki iletişimin "Sıfır Hata" ile yürümesini sağlayan teknik protokoldür.

---

## 🏗️ Paket Yapısı

```bash
shared-types/
├── src/
│   ├── index.ts        # Ana export noktası (Tüm tipler buradan dağılır)
│   ├── models/         # Domain modelleri (User, Project vb.)
│   ├── dtos/           # Request/Response nesneleri
│   └── branding.ts     # Branded Types (Type-safe ID'ler)
├── contract.version.json # Kontrat bütünlük hash'i
└── tsconfig.json       # TS konfigürasyonu
```

---

## 🛡️ Kontrat Güncelleme Protokolü

Yeni bir özellik eklenirken veya mevcut bir yapı değiştirilirken şu adımlar izlenmelidir:

1. **Tipleri Tanımla:** `src/` altında yeni tipleri oluşturun.
2. **Branded Types Kullan:** ID'ler için her zaman Branded Types kullanın (Örn: `UserID`).
3. **Export Et:** `index.ts` üzerinden dışa aktarın.
4. **Hash Güncelle:** `Gemini.md`'de belirtilen komutla `contract.version.json` dosyasındaki hash'i güncelleyin.
5. **@analyst Onayı:** Değişiklikler `@analyst` ajanı tarafından doğrulanmadan `PHASE_2`'ye geçilemez.

---

## 📜 Örnek Kullanım

```typescript
// Branded Type Örneği
export type UserID = string & { __brand: "UserID" };

// DTO Örneği
export interface CreateUserDTO {
  email: string;
  fullName: string;
}

// Response Örneği
export interface UserResponse {
  id: UserID;
  email: string;
  createdAt: string;
}
```

---

## 🚀 Kurulum ve Kullanım

Bu paket, monorepo içindeki diğer paketler tarafından tüketilmek üzere tasarlanmıştır:

```bash
# Monorepo içinde kullanım
npm install @ai-enderun/shared-types
```

---

## 📜 Lisans

MIT - Yusuf BEKAR
