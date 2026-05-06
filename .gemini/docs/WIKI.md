# 🌐 PROJECT WIKI

Bu Wiki, projenin merkezi bilgi kaynağıdır. Tüm ajanlar bu dökümanları referans alarak çalışmalıdır.

## 📌 Hızlı Erişim

- **[Project Memory](.gemini/PROJECT_MEMORY.md):** Projenin anlık durumu, kararlar ve geçmiş.
- **[Tech Stack](.gemini/docs/tech-stack.md):** Kullanılan teknolojiler ve standartlar.
- **[API Contract Hub](.gemini/docs/api/README.md):** Backend endpoint kontratları — @frontend buradan okur.
- [Agent Interaction](.gemini/docs/agent-interaction.md): Ajanlar arası koordinasyon ve iletişim kuralları.
- [Project Docs](.gemini/docs/project-docs.md): Kullanıcı tarafından sağlanan proje detayları.

## 🏗️ Proje Mimarisi

Proje, `@manager` tarafından orkestre edilen, `@frontend`, `@backend` ve `@analyst` ajanlarının kolaboratif çalışmasıyla yürütülmektedir.

## 🔄 Ajan İletişim Akışı

```
@backend → endpoint yazar → .gemini/docs/api/[domain].md günceller
@frontend → .gemini/docs/api/ okur → API çağrısı yazar
@analyst  → kontrat bütünlüğünü denetler → HISTORY günceller
@manager  → Trace ID üretir → ajanları Briefing ile görevlendirir
```

## 📜 Temel Kurallar (Supreme Law)

1. **Contract-First:** Backend yazar → kontrat → Frontend okur → kodlar.
2. **Zero Mock:** Gerçekçi veri kullanımı.
3. **Supreme Aesthetics:** Frontend için en yüksek görsel kalite.
4. **Structured Logging:** Tüm işlemler `.gemini/logs/` altında kayıt altına alınır.
5. **Memory Protocol:** Her oturum başı PROJECT_MEMORY okur, her oturum sonu HISTORY yazar.

---

_Son Güncelleme: 2026-05-05_
