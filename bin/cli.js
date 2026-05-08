#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const sourceDir = path.join(__dirname, "..");
const targetDir = process.cwd();

// --- HELPER FUNCTIONS ---

function getPackageVersion() {
  const pkg = JSON.parse(fs.readFileSync(path.join(sourceDir, "package.json"), "utf8"));
  return pkg.version;
}

function getMemoryPath() {
  return path.join(targetDir, ".enderun", "PROJECT_MEMORY.md");
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
  const sectionHeader = "## ACTIVE TASKS";
  const tableDivider = "| :--- | :--- | :--- | :--- | :--- |";
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

// --- COMMANDS ---

/**
 * Scaffold the framework into the target project.
 */
async function initCommand(selectedAdapter) {
  const ADAPTERS = {
    gemini: ["GEMINI.md", "gemini-extension.json"],
    claude: ["CLAUDE.md"],
    cursor: ["CURSOR.md"],
    codex: ["CODEX.md"],
  };

  const CORE_FILES = [
    ".enderun",
    "docs",
    "mcp.json",
    "ENDERUN.md",
    "README.md",
    "package.json",
    "packages/framework-mcp",
    "packages/shared-types",
  ];

  console.log("🚀 Installing AI Agent Framework...");
  
  let filesToCopy = [...CORE_FILES];
  
  if (selectedAdapter) {
    if (!ADAPTERS[selectedAdapter]) {
      console.error(`❌ Invalid adapter: ${selectedAdapter}. Available: gemini, claude, cursor, codex`);
      process.exit(1);
    }
    filesToCopy = [...CORE_FILES, ...ADAPTERS[selectedAdapter]];
  } else {
    Object.values(ADAPTERS).forEach(list => filesToCopy.push(...list));
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
      console.log(`✅ ${item} created.`);
    }
  }

  // --- Post-Install Hooks (Smart Setup) ---
  
  console.log("\n🛠️  Running smart configuration for adapters...");

  if (selectedAdapter === "gemini" || !selectedAdapter) {
    try {
      const geminiAgentsDir = path.join(targetDir, ".gemini", "agents");
      const enderunAgentsDir = path.relative(path.join(targetDir, ".gemini"), path.join(targetDir, ".enderun", "agents"));
      
      if (!fs.existsSync(path.join(targetDir, ".gemini"))) {
        fs.mkdirSync(path.join(targetDir, ".gemini"), { recursive: true });
      }
      
      if (!fs.existsSync(geminiAgentsDir)) {
        fs.symlinkSync(enderunAgentsDir, geminiAgentsDir, "dir");
        console.log("🔗 Gemini: Created symlink from .gemini/agents to .enderun/agents");
      }
    } catch (err) {
      console.warn("⚠️  Gemini: Could not create symlink (might need admin rights or already exists).");
    }
  }

  if (selectedAdapter === "claude" || !selectedAdapter) {
    const mcpPath = path.join(targetDir, "packages/framework-mcp/src/index.ts");
    console.log("\n📝 Claude Code Setup:");
    console.log("To enable AI-Enderun tools in Claude Code, run this command:");
    console.log(`\x1b[36mclaude config add framework-mcp npx tsx ${mcpPath}\x1b[0m`);
  }

  if (selectedAdapter === "cursor" || !selectedAdapter) {
    // Add cursor-specific rules or settings if needed
    console.log("✨ Cursor: Adapter CLAUDE.md is ready to guide your AI.");
  }

  console.log("\n✨ Framework successfully installed! (v" + getPackageVersion() + ")");
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
 * Print the current framework status.
 */
function statusCommand() {
  const memoryPath = getMemoryPath();
  if (!fs.existsSync(memoryPath)) {
    console.error("❌ Error: .enderun/PROJECT_MEMORY.md not found. Please run 'init' first.");
    return;
  }

  const content = fs.readFileSync(memoryPath, "utf8");
  const statusMatch = content.match(/\| Active Phase \| Profile \| Last Update \| Active Trace ID \| Blockers \|\n\| :----------- \| :------ \| :---------- \| :-------------- \| :------- \|\n\| (.*?) \| (.*?) \| (.*?) \| (.*?) \| (.*?) \|/);
  
  console.log("\n📊 --- PROJECT STATUS ---");
  if (statusMatch) {
    console.log(`🔹 Phase: ${statusMatch[1].trim()}`);
    console.log(`🧭 Profile: ${statusMatch[2].trim()}`);
    console.log(`📅 Update: ${statusMatch[3].trim()}`);
    console.log(`🆔 Trace ID: ${statusMatch[4].trim()}`);
    console.log(`⛔ Blockers: ${statusMatch[5].trim()}`);
  }

  const tasksSection = content.match(/## ACTIVE TASKS\n\n([\s\S]*?)\n\n##/);
  if (tasksSection) {
    console.log("\n📋 Active Tasks:");
    console.log(tasksSection[1].trim());
  }

  console.log("\n-----------------------\n");
}

/**
 * Generate a new Trace ID and add it to project memory.
 */
function traceNewCommand(description, agent = "manager", priority = "P2") {
  const memoryPath = getMemoryPath();
  if (!fs.existsSync(memoryPath)) {
    console.error("❌ Error: PROJECT_MEMORY.md not found.");
    return;
  }

  const traceId = generateULID();
  const safeDescription = sanitizeTableCell(description);
  const safeAgent = normalizeAgentName(agent);
  const safePriority = normalizePriority(priority);
  const newTask = `| ${traceId} | ${safeDescription} | @${safeAgent} | ${safePriority} | IN_PROGRESS |`;
  const lockPath = `${memoryPath}.lock`;

  if (!acquireMemoryLock(lockPath)) {
    console.error("❌ Error: Memory lock timeout (5 retries).");
    return;
  }

  try {
    const content = fs.readFileSync(memoryPath, "utf8");
    const updated = insertTaskRow(content, newTask);
    if (!updated) {
      console.error("❌ Error: ACTIVE TASKS table not found, task could not be added.");
      return;
    }

    fs.writeFileSync(memoryPath, updated);
    console.log(`\n✅ New Trace ID created: ${traceId}`);
    console.log(`📝 Added to task list: ${description}\n`);
  } finally {
    releaseMemoryLock(lockPath);
  }
}

/**
 * Verify the shared-types contract hash.
 */
function verifyContractCommand() {
  const sharedDir = path.join(targetDir, "packages/shared-types/src");
  const contractPath = path.join(targetDir, "packages/shared-types/contract.version.json");

  if (!fs.existsSync(sharedDir) || !fs.existsSync(contractPath)) {
    console.error("❌ Error: Shared types or contract.version.json not found.");
    return;
  }

  const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(d, e.name);
    return e.isDirectory() ? walk(p) : (p.endsWith(".ts") ? [p] : []);
  });

  const files = walk(sharedDir).sort();
  const h = crypto.createHash("sha256");
  for (const f of files) {
    h.update(fs.readFileSync(f));
  }
  const currentHash = h.digest("hex");
  
  try {
    const stored = JSON.parse(fs.readFileSync(contractPath, "utf8")).contract_hash;
    if (currentHash === stored) {
      console.log("✅ Contract hash verified! (MATCH)");
    } else {
      console.error(`❌ HASH MISMATCH!\nExpected: ${stored}\nActual:   ${currentHash}`);
      process.exit(1);
    }
  } catch (err) {
    console.error("❌ Error reading contract.version.json");
    process.exit(1);
  }
}

// --- MAIN DISPATCHER ---

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
        console.error("❌ Usage: ai-enderun trace:new <description> [agent] [priority]");
      } else {
        traceNewCommand(args[0], args[1], args[2]);
      }
      break;
    case "verify-contract":
      verifyContractCommand();
      break;
    case "version":
    case "-v":
    case "--version":
      console.log(`v${getPackageVersion()}`);
      break;
    default:
      console.log(`
🤖 AI-Enderun CLI (v${getPackageVersion()})

Available Commands:
  init [adapter]    Initialize the framework (gemini, claude, cursor, codex)
  status            Show current phase and task status
  trace:new <desc>  Generate a new Trace ID and add the task to memory
  verify-contract   Check if shared types match the stored hash
  version           Show version information

Example:
  ai-enderun trace:new "Auth module design" backend P1
      `);
      break;
  }
}

main().catch(console.error);
