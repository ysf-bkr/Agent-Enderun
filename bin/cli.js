#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const sourceDir = path.join(__dirname, "..");
const targetDir = process.cwd();

// --- YARDIMCI FONKSİYONLAR ---

function getPackageVersion() {
  const pkg = JSON.parse(fs.readFileSync(path.join(sourceDir, "package.json"), "utf8"));
  return pkg.version;
}

function getMemoryPath() {
  return path.join(targetDir, ".gemini", "PROJECT_MEMORY.md");
}

function generateULID(seedTime = Date.now()) {
  const ENCODING = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
  const ENCODING_LEN = ENCODING.length;
  let time = seedTime;
  const timeChars = new Array(10);
  for (let i = 9; i >= 0; i--) {
    timeChars[i] = ENCODING.charAt(time % ENCODING_LEN);
    time = Math.floor(time / ENCODING_LEN);
  }
  const randomChars = new Array(16);
  for (let i = 0; i < 16; i++) {
    randomChars[i] = ENCODING.charAt(Math.floor(Math.random() * ENCODING_LEN));
  }
  return timeChars.join("") + randomChars.join("");
}

function sleep(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

function acquireMemoryLock(lockPath, maxRetries = 5) {
  for (let attempt = 0; attempt < maxRetries; attempt += 1) {
    try {
      const fd = fs.openSync(lockPath, "wx");
      fs.closeSync(fd);
      return true;
    } catch (error) {
      if (error?.code !== "EEXIST") throw error;
      if (attempt < maxRetries - 1) sleep(1000);
    }
  }
  return false;
}

function releaseMemoryLock(lockPath) {
  if (fs.existsSync(lockPath)) fs.unlinkSync(lockPath);
}

function insertTaskRow(memoryContent, row) {
  const sectionHeader = "## AKTİF GÖREVLER";
  const tableDivider = "| :------- | :---- | :--- | :------ | :---- |";
  const sectionIndex = memoryContent.indexOf(sectionHeader);
  if (sectionIndex === -1) return null;
  const dividerIndex = memoryContent.indexOf(tableDivider, sectionIndex);
  if (dividerIndex === -1) return null;
  const dividerLineEnd = memoryContent.indexOf("\n", dividerIndex);
  if (dividerLineEnd === -1) return null;

  return (
    memoryContent.slice(0, dividerLineEnd + 1) +
    `${row}\n` +
    memoryContent.slice(dividerLineEnd + 1)
  );
}

function sanitizeTableCell(value) {
  return String(value).replace(/\|/g, "\\|").replace(/\r?\n/g, " ").trim();
}

function normalizeAgentName(agent) {
  return String(agent || "manager").replace(/^@+/, "").trim() || "manager";
}

function normalizePriority(priority) {
  const normalized = String(priority || "P2").toUpperCase().trim();
  return /^P[0-3]$/.test(normalized) ? normalized : "P2";
}

// --- KOMUTLAR ---

/**
 * Projeyi ilklendirir (Eski init.js mantığı)
 */
async function initCommand(selectedAdapter) {
  const ADAPTERS = {
    gemini: ["Gemini.md", "gemini-extension.json"],
    claude: ["CLAUDE.md"],
    cursor: ["CURSOR.md"],
    codex: ["CODEX.md"],
  };

  const CORE_FILES = [
    ".gemini",
    "mcp.json",
    ".env.example",
    "packages/framework-mcp",
    "packages/shared-types",
  ];

  console.log("🚀 AI Agent Framework kuruluyor...");
  
  let filesToCopy = [...CORE_FILES, ...ADAPTERS.gemini, ...ADAPTERS.claude, ...ADAPTERS.cursor, ...ADAPTERS.codex];
  
  if (selectedAdapter) {
    if (!ADAPTERS[selectedAdapter]) {
      console.error(`❌ Geçersiz adaptör: ${selectedAdapter}`);
      process.exit(1);
    }
    filesToCopy = [...CORE_FILES, "Gemini.md", ...ADAPTERS[selectedAdapter]];
  }

  for (const item of filesToCopy) {
    const src = path.join(sourceDir, item);
    const dest = path.join(targetDir, item);
    if (fs.existsSync(src)) {
      if (fs.lstatSync(src).isDirectory()) {
        copyDir(src, dest);
      } else {
        fs.copyFileSync(src, dest);
      }
      console.log(`✅ ${item} oluşturuldu.`);
    }
  }
  console.log("\n✨ Framework başarıyla kuruldu! (v" + getPackageVersion() + ")");
}

function copyDir(src, dest) {
  const SKIP_NAMES = new Set(["node_modules", ".git", ".DS_Store"]);

  fs.mkdirSync(dest, { recursive: true });
  fs.readdirSync(src, { withFileTypes: true }).forEach(entry => {
    if (SKIP_NAMES.has(entry.name)) return;

    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    entry.isDirectory() ? copyDir(srcPath, destPath) : fs.copyFileSync(srcPath, destPath);
  });
}

/**
 * Projenin mevcut durumunu gösterir
 */
function statusCommand() {
  const memoryPath = getMemoryPath();
  if (!fs.existsSync(memoryPath)) {
    console.error("❌ Hata: .gemini/PROJECT_MEMORY.md bulunamadı. Lütfen önce 'init' yapın.");
    return;
  }

  const content = fs.readFileSync(memoryPath, "utf8");
  const statusMatch = content.match(/\| Aktif Faz \| Profile \| Son Güncelleme \| Aktif Trace ID \| Blokaj \|\n\| :-------- \| :------ \| :------------- \| :------------- \| :----- \|\n\| (.*?) \| (.*?) \| (.*?) \| (.*?) \| (.*?) \|/);
  
  console.log("\n📊 --- PROJE DURUMU ---");
  if (statusMatch) {
    console.log(`🔹 Faz: ${statusMatch[1].trim()}`);
    console.log(`🧭 Profile: ${statusMatch[2].trim()}`);
    console.log(`📅 Güncelleme: ${statusMatch[3].trim()}`);
    console.log(`🆔 Trace ID: ${statusMatch[4].trim()}`);
    console.log(`⛔ Blokaj: ${statusMatch[5].trim()}`);
  }

  const tasksSection = content.match(/## AKTİF GÖREVLER\n\n([\s\S]*?)\n\n##/);
  if (tasksSection) {
    console.log("\n📋 Aktif Görevler:");
    console.log(tasksSection[1].trim());
  }

  console.log("\n-----------------------\n");
}

/**
 * Yeni bir Trace ID üretir ve hafızaya ekler
 */
function traceNewCommand(description, agent = "manager", priority = "P2") {
  const memoryPath = getMemoryPath();
  if (!fs.existsSync(memoryPath)) {
    console.error("❌ Hata: PROJECT_MEMORY.md bulunamadı.");
    return;
  }

  const traceId = generateULID();
  const safeDescription = sanitizeTableCell(description);
  const safeAgent = normalizeAgentName(agent);
  const safePriority = normalizePriority(priority);
  const newTask = `| ${traceId} | ${safeDescription} | @${safeAgent} | ${safePriority} | IN_PROGRESS |`;
  const lockPath = `${memoryPath}.lock`;

  if (!acquireMemoryLock(lockPath)) {
    console.error("❌ Hata: Bellek kilidi zaman aşımına uğradı (5 deneme).");
    return;
  }

  try {
    const content = fs.readFileSync(memoryPath, "utf8");
    const updated = insertTaskRow(content, newTask);
    if (!updated) {
      console.error("❌ Hata: AKTİF GÖREVLER tablosu bulunamadı, görev eklenemedi.");
      return;
    }

    fs.writeFileSync(memoryPath, updated);
    console.log(`\n✅ Yeni Trace ID oluşturuldu: ${traceId}`);
    console.log(`📝 Görev listesine eklendi: ${description}\n`);
  } finally {
    releaseMemoryLock(lockPath);
  }
}

// --- ANA DISPATCHER ---

async function main() {
  const [command, ...args] = process.argv.slice(2);

  switch (command) {
    case "init":
      await initCommand(args[0]);
      break;
    case "status":
      statusCommand();
      break;
    case "trace:new":
      if (!args[0]) {
        console.error("❌ Kullanım: ai-agent-framework trace:new <açıklama> [agent] [priority]");
      } else {
        traceNewCommand(args[0], args[1], args[2]);
      }
      break;
    case "version":
    case "-v":
    case "--version":
      console.log(`v${getPackageVersion()}`);
      break;
    default:
      console.log(`
🤖 AI-Enderun CLI (v${getPackageVersion()})

Kullanılabilir Komutlar:
  init [ai-name]    Framework'ü ilklendirir (gemini, claude, cursor, codex)
  status            Mevcut faz ve görev durumunu gösterir
  trace:new <desc>  Yeni bir Trace ID üretir ve görevi hafızaya ekler
  version           Versiyon bilgisini gösterir

Örnek:
  ai-enderun trace:new "Auth modülü tasarımı" backend P1
      `);
      break;
  }
}

main().catch(console.error);
