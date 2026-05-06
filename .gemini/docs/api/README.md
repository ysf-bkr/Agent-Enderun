# 📡 API Kontrat Merkezi (API Contract Hub)

Bu dizin, **AI-Enderun** projesinin tüm ağ iletişim protokollerini ve endpoint dökümantasyonunu içerir. "Sıfır Hata" prensibi gereği, backend ve frontend arasındaki tüm etkileşimler burada önceden tanımlanmalıdır.

---

## 🛡️ Altın Kurallar

1. **Kontratsız Kod Yasaktır:** `@backend` bir endpoint yazmadan önce dökümanını hazırlamalı, `@frontend` dökümanı okumadan kod yazmamalıdır.
2. **SSoT Uyumu:** Tüm dökümanlar `packages/shared-types` içindeki tiplerle %100 uyumlu olmalıdır.
3. **Traceability:** Her endpoint tanımı, oluşturulduğu görevin `Trace ID`'sini içermelidir.
4. **Versioning:** Kontratlardaki breaking change'ler mutlaka `@analyst` denetiminden geçmelidir.

---

## 📋 Endpoint İndeksi

| Domain | Durum | Endpoint Sayısı | Sorumlu | Son Güncelleme |
| :--- | :--- | :--- | :--- | :--- |
| **Auth** | ⏳ Beklemede | 0 | @backend | — |
| **User** | ⏳ Beklemede | 0 | @backend | — |
| **Project** | ⏳ Beklemede | 0 | @backend | — |

---

## 📌 Operasyonel Akış

### 🟢 Backend Protokolü
- Yeni bir endpoint tasarlandığında ilgili `[domain].md` dosyasını oluşturun veya güncelleyin.
- `shared-types` referanslarını (DTO ve Response tipleri) net bir şekilde belirtin.
- Hata kodlarını (400, 401, 404 vb.) ve fırlatılma koşullarını dökümante edin.

### 🔵 Frontend Protokolü
- Geliştirmeye başlamadan önce bu dizini tarayın.
- Kontrat dökümanı eksikse veya güncel değilse `@backend` ajanına `P1` öncelikli direktif gönderin.
- Tahmin yürüterek veya mock verilerle (anayasa izni dışında) çalışmayın.

---

## 📝 Standart Belgeleme Formatı

Her `[domain].md` dosyası aşağıdaki profesyonel şablonu izlemelidir:

```markdown
# [Domain] API Kontratı

## Genel Bakış
[Domain'in amacı ve sorumluluğu]

## Endpoint'ler

### [METHOD] /api/v1/[path]
- **Açıklama:** [İşlev]
- **Auth:** [Gerekli/Değil] - [Rol]
- **Request (DTO):** `shared-types` -> `XxxDTO`
- **Response (200):** `shared-types` -> `XxxResponse`
- **Hatalar:** 400 (Validation), 401 (Unauthorized), 404 (Not Found)
- **Trace ID:** [UUID]
- **Güncelleme:** YYYY-MM-DD
```

---

*Bu döküman @analyst tarafından düzenli olarak denetlenmektedir.*
