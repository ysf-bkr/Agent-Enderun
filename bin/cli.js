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

function generateUUID() {
  return crypto.randomUUID();
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

  const CORE_FILES = [".gemini", "mcp.json", ".env.example", ".socraticodecontextartifacts.json"];

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
  fs.mkdirSync(dest, { recursive: true });
  fs.readdirSync(src, { withFileTypes: true }).forEach(entry => {
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
  const statusMatch = content.match(/\| Aktif Faz \| Son Güncelleme \| Aktif Trace ID \|\n\| :-------- \| :------------- \| :------------- \|\n\| (.*?) \| (.*?) \| (.*?) \|/);
  
  console.log("\n📊 --- PROJE DURUMU ---");
  if (statusMatch) {
    console.log(`🔹 Faz: ${statusMatch[1].trim()}`);
    console.log(`📅 Güncelleme: ${statusMatch[2].trim()}`);
    console.log(`🆔 Trace ID: ${statusMatch[3].trim()}`);
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
function traceNewCommand(description, agent = "manager") {
  const memoryPath = getMemoryPath();
  if (!fs.existsSync(memoryPath)) {
    console.error("❌ Hata: PROJECT_MEMORY.md bulunamadı.");
    return;
  }

  const traceId = `TRACE-${generateUUID().slice(0, 8).toUpperCase()}`;
  const date = new Date().toISOString().split('T')[0];
  const newTask = `- [ ] [${traceId}] ${description} (@${agent})`;

  let content = fs.readFileSync(memoryPath, "utf8");
  content = content.replace("## AKTİF GÖREVLER\n\n", `## AKTİF GÖREVLER\n\n${newTask}\n`);
  
  fs.writeFileSync(memoryPath, content);
  console.log(`\n✅ Yeni Trace ID oluşturuldu: ${traceId}`);
  console.log(`📝 Görev listesine eklendi: ${description}\n`);
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
        console.error("❌ Kullanım: ai-agent-framework trace:new <açıklama> [agent]");
      } else {
        traceNewCommand(args[0], args[1]);
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
  ai-agent-framework trace:new "Auth modülü tasarımı" backend
      `);
      break;
  }
}

main().catch(console.error);
