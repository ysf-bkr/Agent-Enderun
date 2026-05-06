# 📐 ai-enderun-shared-types (v0.0.1)

**Status:** 🛠️ Single Source of Truth (SSOT)  
**Philosophy:** Contract-First Discipline  
**Role:** The Technical Constitution

**AI-Enderun Shared-Types**, projenin tüm veri yapılarını, API kontratlarını ve tip tanımlarını yöneten merkezi dökümantasyon katmanıdır. 

[English](#english) | [Türkçe](#türkçe) | [Deutsch](#deutsch)

---

## 🏗️ Package Structure / Paket Yapısı

```bash
shared-types/
├── src/
│   ├── index.ts        # Ana export noktası / Main export point
│   ├── models/         # Veri modelleri / Data models (User, Business)
│   └── contracts/      # API arayüzleri / API interfaces
├── package.json        # Paket metadata / Package metadata
└── tsconfig.json       # TS derleme ayarları / TS config
```

---

<a name="english"></a>
## 🇬🇧 English: Developer Guide

### 🛡️ How to Extend the Contract?
1. **Define:** Create your new interface or type in the `src/` directory.
2. **Export:** Ensure it is exported through `src/index.ts`.
3. **Verify:** Run `ai-agent-framework contract:verify` to update the SHA-256 integrity hash.
4. **Publish:** Bump version and publish to the local/private registry.

---

<a name="türkçe"></a>
## 🇹🇷 Türkçe: Geliştirici Rehberi

### 🛡️ Kontrat Nasıl Genişletilir?
1. **Tanımla:** Yeni arayüz veya tipinizi `src/` dizini altında oluşturun.
2. **Dışa Aktar:** `src/index.ts` üzerinden export edildiğinden emin olun.
3. **Doğrula:** SHA-256 bütünlük hash'ini güncellemek için `ai-agent-framework contract:verify` komutunu çalıştırın.
4. **Yayınla:** Versiyonu artırın ve yerel/özel registry'ye gönderin.

---

<a name="deutsch"></a>
## 🇩🇪 Deutsch: Entwickler-Leitfaden

### 🛡️ Wie man den Vertrag erweitert?
1. **Definieren:** Erstellen Sie Ihr neues Interface oder Ihren neuen Typ im `src/`-Verzeichnis.
2. **Exportieren:** Stellen Sie sicher, dass es über `src/index.ts` exportiert wird.
3. **Verifizieren:** Führen Sie den Integritäts-Hash-Check durch.

---

## 📜 Example / Örnek / Beispiel

```typescript
export type UserID = string & { __brand: "UserID" };

export interface AppointmentContract {
  id: string;
  userId: UserID;
  date: string;
}
```

## 🚀 Installation / Kurulum
```bash
npm install ai-enderun-shared-types
```

## 📜 License
MIT - Yusuf BEKAR
