# 📡 API Contract Hub

Bu klasör, **@backend** tarafından yazılan tüm endpoint'lerin belgesidir.
**@frontend** bu klasörü okumadan herhangi bir API çağrısı yazamaz.

> **Kural:** Backend bir endpoint yazar → bu dosyayı günceller → Frontend okur → kodlar.
> Kontrat olmadan çalışmak yasaktır.

---

## 📋 Endpoint Listesi (İndeks)

| Domain | Dosya | Endpoint Sayısı | Son Güncelleme |
|---|---|---|---|
| *(Henüz endpoint yok)* | — | — | — |

---

## 📌 Nasıl Kullanılır?

### @backend için
1. Yeni endpoint yazdığında → `[domain].md` dosyası oluştur/güncelle
2. Yukarıdaki tabloyu güncelle
3. `shared-types` değiştiyse `contract.version.json` hash'ini güncelle

### @frontend için
1. Oturum başında bu dosyayı oku
2. Kullanacağın endpoint'in `[domain].md` dosyasını aç
3. Kontrat yoksa → `@backend`'e bildir, tahmin üzerinden çalışma

---

## 🗂️ Domain Dosyaları

*(Henüz oluşturulmadı. @backend ilk endpoint'ini yazdığında buraya eklenecek.)*

---

## 📝 Endpoint Belgeleme Şablonu

Her `[domain].md` dosyası şu formatı kullanır:

```markdown
# [Domain] API — Kontrat

## Endpoint Listesi
- [GET] /api/[path] — Kısa açıklama
- [POST] /api/[path] — Kısa açıklama

---

### [METHOD] /api/[path]
- **Açıklama:** Bu endpoint ne yapar?
- **Auth:** Gerekli mi? Hangi rol? (örn: Bearer Token, Admin)
- **Request Body:**
  ```typescript
  interface CreateXxxDTO {
    field: string;
  }
  ```
- **Query Params:** `?page=1&limit=20`
- **Response (200):**
  ```typescript
  interface XxxResponse {
    id: string;
    field: string;
    createdAt: string;
  }
  ```
- **Hata Kodları:**
  - `400` — Geçersiz istek
  - `401` — Auth gerekli
  - `404` — Kaynak bulunamadı
  - `409` — Çakışma
  - `500` — Sunucu hatası
- **shared-types Referansı:** `CreateXxxDTO`, `XxxResponse`
- **Son Güncelleme:** YYYY-MM-DD
- **Trace ID:** [uuid]
```

---

*Son güncelleme: —*
*Sorumlu: @backend (yazma) / @frontend (okuma)*
