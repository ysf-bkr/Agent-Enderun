import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { getFrameworkDir } from "../utils/memory.js";

interface HermesMessage {
  timestamp: string;
  from: string;
  to: string;
  category: "ACTION" | "DELEGATION" | "INFO" | "ALERT";
  traceId: string;
  content: string;
  status: "PENDING" | "PROCESSED";
}

/**
 * Start the live Hermes Orchestration & Message Loop
 */
export function orchestrateCommand() {
  const frameworkDir = getFrameworkDir();
  const messagesDir = path.join(process.cwd(), frameworkDir, "messages");
  const statusPath = path.join(process.cwd(), frameworkDir, "STATUS.md");

  console.log(`\n================================================================`);
  console.log(`🏛️  AGENT ENDERUN — DYNAMIC HERMES ORCHESTRATÖR DÖNGÜSÜ`);
  console.log(`================================================================`);
  console.log(`🛰️  Hermes Message Broker dinleniyor: ${frameworkDir}/messages/...`);

  if (!fs.existsSync(messagesDir)) {
    fs.mkdirSync(messagesDir, { recursive: true });
  }

  // Scan all JSON files in the messages directory
  const messageFiles = fs.readdirSync(messagesDir).filter(f => f.endsWith(".json"));
  const pendingMessages: HermesMessage[] = [];

  for (const file of messageFiles) {
    const filePath = path.join(messagesDir, file);
    try {
      const content = fs.readFileSync(filePath, "utf8").trim();
      if (!content) continue;
      // Messages are stored as newline-delimited JSON
      const lines = content.split("\n");
      lines.forEach((line, index) => {
        if (!line.trim()) return;
        const msg = JSON.parse(line) as HermesMessage;
        if (msg.status === "PENDING") {
          pendingMessages.push(msg);
        }
      });
    } catch (e) {
      // ignore malformed lines
    }
  }

  if (pendingMessages.length === 0) {
    console.log(`\n🟢 Kuyruk Temiz: İşlenecek aktif Hermes mesajı bulunamadı.`);
    console.log(`💡 İpucu: Bir uzman ajanı tetiklemek için send_agent_message aracını kullanın.`);
    return;
  }

  console.log(`\n📥 Kuyrukta ${pendingMessages.length} adet bekleyen Hermes mesajı tespit edildi:\n`);

  // Process the first pending message
  const activeMessage = pendingMessages[0];
  const toAgent = activeMessage.to;
  const fromAgent = activeMessage.from;

  console.log(`✉️  [GÖNDEREN]   : ${fromAgent}`);
  console.log(`📥 [ALICI]      : ${toAgent}`);
  console.log(`🆔 [TRACE ID]   : ${activeMessage.traceId}`);
  console.log(`🏷️  [KATEGORİ]   : ${activeMessage.category}`);
  console.log(`💬 [MESAJ]      : "${activeMessage.content}"`);
  console.log(`----------------------------------------------------------------`);

  // 1. Transition the target agent state to EXECUTING in STATUS.md
  console.log(`⏳ Ajan Durum Geçişi: ${toAgent} durumu EXECUTING olarak kilitleniyor...`);
  transitionAgentState(statusPath, toAgent, "EXECUTING", activeMessage.content);

  console.log(`\n🤖 Görev Devredildi!`);
  console.log(`👉 Lütfen ${toAgent} agent talimatlarını (${frameworkDir}/agents/${toAgent.replace("@", "")}.md) okuyun ve görevi yerine getirin.`);
  console.log(`💡 Görev tamamlandığında, mesajı PROCESSED olarak işaretlemek ve ajanı boşa çıkarmak için:`);
  console.log(`   npx agent-enderun status komutuyla kontrol edin.`);
}

function transitionAgentState(statusPath: string, agent: string, state: string, task: string) {
  if (!fs.existsSync(statusPath)) return;
  try {
    let content = fs.readFileSync(statusPath, "utf8");
    const lines = content.split("\n");
    const targetName = agent;

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes(`| ${targetName} |`)) {
        // e.g., | @backend | IDLE | — | — | 9.2/10 | — |
        const parts = lines[i].split("|");
        if (parts.length >= 7) {
          parts[2] = ` ${state} `;
          parts[3] = ` ${task.slice(0, 20)}... `;
          lines[i] = parts.join("|");
          break;
        }
      }
    }

    fs.writeFileSync(statusPath, lines.join("\n"));
    console.log(`✅ STATUS.md üzerinde ${agent} durumu başarıyla '${state}' yapıldı.`);
  } catch (e) {
    console.error("❌ STATUS.md güncellenirken hata oluştu:", e);
  }
}
