# 📑 API Documentation & Contracts

Bu dizin, AI-Enderun projesinin tüm API uç noktalarını (endpoints) ve veri kontratlarını barındırır. **Contract-First** disiplinimizin kalbi burasıdır.

## 📐 Kontrat Yönetimi

- **Dosya Yapısı:** Her domain (örn: `auth.md`, `user.md`, `order.md`) kendi dosyasında belgelenir.
- **Sorumluluk:** Kontratları `@backend` yazar, `@analyst` denetler, `@frontend` okur ve uygular.
- **Doğrulama:** Kontratlar ile `packages/shared-types` arasındaki uyum her faz geçişinde kontrol edilir.

## 📌 Endpoint İndeksi

| Domain | Dosya | Durum | Son Güncelleme |
| :--- | :--- | :--- | :--- |
| Auth | [[auth.md]] | PENDING | — |
| Users | [[user.md]] | PENDING | — |

## 🛡️ Hata Standartları

Tüm endpoint'ler şu yapıyı takip etmelidir:
- **401 Unauthorized:** Geçersiz token veya yetkisiz erişim.
- **404 Not Found:** Kaynak bulunamadı.
- **422 Unprocessable Entity:** Validasyon hataları.
- **500 Internal Server Error:** Beklenmeyen sunucu hataları.

**Trace ID:** Her API yanıtında `X-Trace-ID` header'ı ile ULID dönülmelidir.

---
*Bu döküman @analyst tarafından otomatik yönetilmektedir.*
