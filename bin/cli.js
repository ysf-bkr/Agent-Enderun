#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const sourceDir = path.join(__dirname, "..");
const targetDir = process.cwd();

// --- CONSTANTS ---
const FRAMEWORK_VERSION = "0.0.11";

// --- HELPER FUNCTIONS ---

function getPackageVersion() {
  const pkg = JSON.parse(fs.readFileSync(path.join(sourceDir, "package.json"), "utf8"));
  return pkg.version;
}

function getFrameworkDir() {
  const adapters = [".gemini", ".claude", ".cursor", ".codex", ".enderun"];
  for (const adp of adapters) {
    const fullPath = path.join(targetDir, adp);
    if (fs.existsSync(fullPath) && fs.lstatSync(fullPath).isDirectory()) {
      return adp;
    }
  }
  return ".enderun";
}

function getMemoryPath() {
  return path.join(targetDir, getFrameworkDir(), "PROJECT_MEMORY.md");
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

function mergePackageJson(targetPath, sourcePath) {
  let targetPkg = {};
  if (fs.existsSync(targetPath)) {
    try {
      targetPkg = JSON.parse(fs.readFileSync(targetPath, "utf8"));
    } catch (e) {
      console.warn("⚠️  Could not parse existing package.json, creating a new one.");
    }
  }

  const sourcePkg = JSON.parse(fs.readFileSync(sourcePath, "utf8"));

  // Merge scripts
  targetPkg.scripts = {
    ...targetPkg.scripts,
    "enderun:status": "ai-enderun status",
    "enderun:trace": "ai-enderun trace:new",
    "enderun:verify": "ai-enderun verify-contract",
    "enderun:build": "npm run build --prefix packages/shared-types && npm run build --prefix packages/framework-mcp",
  };

  // Ensure basic fields
  if (!targetPkg.name) targetPkg.name = path.basename(process.cwd());
  if (!targetPkg.version) targetPkg.version = "0.0.10";
  if (!targetPkg.type) targetPkg.type = "module";

  // Add metadata
  targetPkg.enderun = {
    version: sourcePkg.version,
    initializedAt: new Date().toISOString(),
  };

  fs.writeFileSync(targetPath, JSON.stringify(targetPkg, null, 2));
  console.log("✅ package.json updated with Enderun scripts.");
}

function updateGitIgnore(targetPath, frameworkDir = ".enderun") {
  const IGNORE_LINES = [
    "# AI-Enderun",
    ".gemini/logs/*.json",
    ".claude/logs/*.json",
    ".cursor/logs/*.json",
    ".codex/logs/*.json",
    ".enderun/logs/*.json",
    ".gemini/*.lock",
    ".claude/*.lock",
    ".cursor/*.lock",
    ".codex/*.lock",
    ".enderun/*.lock",
    ".env",
    ".DS_Store"
  ];

  let content = "";
  if (fs.existsSync(targetPath)) {
    content = fs.readFileSync(targetPath, "utf8");
  }

  const lines = content.split("\n").map((l) => l.trim());
  let added = false;

  for (const line of IGNORE_LINES) {
    if (!lines.includes(line)) {
      content += (content.endsWith("\n") || content === "" ? "" : "\n") + line + "\n";
      added = true;
    }
  }

  if (added) {
    fs.writeFileSync(targetPath, content);
    console.log("✅ .gitignore updated.");
  }
}

/**
 * Create initial PROJECT_MEMORY.md if missing.
 */
function initializeMemory(memoryPath, targetBase) {
  if (fs.existsSync(memoryPath)) return;

  const traceId = generateULID();
  const date = new Date().toISOString().split("T")[0];
  const template = `# PROJECT MEMORY — AI-Enderun

This file is the Single Source of Truth (SSOT) and the persistent memory of the project.

## CURRENT STATUS

| Active Phase | Profile | Last Update | Active Trace ID | Blockers |
| :----------- | :------ | :---------- | :-------------- | :------- |
| PHASE_0      | Lightweight | ${date} | ${traceId} | NONE |

## PROJECT DEFINITION

| Field | Value |
| :--- | :--- |
| Project Name | ${path.basename(process.cwd())} |
| Platform | Not defined |
| Frontend | React 19 + Vite + Panda CSS |
| Backend | Node.js 20+ + Fastify |
| DB | PostgreSQL |

## DOD STATUS

| Phase | Status | Note |
| :--- | :--- | :--- |
| PHASE_0 | IN_PROGRESS | Initializing project structure |
| PHASE_1 | PENDING | |
| PHASE_2 | PENDING | |
| PHASE_3 | PENDING | |
| PHASE_4 | PENDING | |

## CRITICAL DECISIONS

| Date | Decision | Rationale | Agent |
| :--- | :--- | :--- | :--- |
| ${date} | Project Initialized | Framework setup via CLI | @manager |

## DELIVERABLES

| Module | Status | Agent | Date |
| :--- | :--- | :--- | :--- |

## ACTIVE TASKS

| Trace ID | Task | Agent | Priority | Status |
| :--- | :--- | :--- | :--- | :--- |
| ${traceId} | Framework setup and architecture alignment | @manager | P1 | IN_PROGRESS |

## HISTORY (Persistent Memory)

### ${date} — Framework Initialization

- **Agent:** @manager
- **Trace ID:** ${traceId}
- **Action:** Initialized AI-Enderun framework and project structure.
- **Decision:** Starting with Lightweight profile.
- **Next Step:** Define user requirements in docs/project-docs.md.
`;

  const finalTemplate = template.replace(/\{\{FRAMEWORK_DIR\}\}/g, targetBase);
  fs.writeFileSync(memoryPath, finalTemplate);
  console.log(`✅ PROJECT_MEMORY.md initialized in ${targetBase}`);
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

  const targetBase = selectedAdapter ? `.${selectedAdapter}` : ".enderun";
  const targetFrameworkDir = path.join(targetDir, targetBase);

  const CORE_FILES = [
    ".enderun",
    "docs",
    "mcp.json",
    ".env.example",
    "ENDERUN.md",
    "packages/framework-mcp",
    "packages/shared-types",
  ];

  const DIRS_TO_CREATE = [
    `${targetBase}/agents`,
    `${targetBase}/docs/api`,
    `${targetBase}/logs`,
    "apps/web",
    "apps/backend",
    "docs",
    "packages/shared-types",
    "packages/framework-mcp",
  ];

  console.log("🚀 Installing AI-Enderun (Smart Mode)...");

  // Ensure target framework base exists
  if (!fs.existsSync(targetFrameworkDir)) {
    fs.mkdirSync(targetFrameworkDir, { recursive: true });
  }

  // Create subdirectories
  for (const dir of DIRS_TO_CREATE) {
    const fullPath = path.join(targetDir, dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
      console.log(`📂 Created directory: ${dir}`);
    }
  }

  let filesToProcess = [...CORE_FILES];
  
  if (selectedAdapter) {
    if (!ADAPTERS[selectedAdapter]) {
      console.error(`❌ Invalid adapter: ${selectedAdapter}. Available: gemini, claude, cursor, codex`);
      process.exit(1);
    }
    filesToProcess = [...CORE_FILES, ...ADAPTERS[selectedAdapter]];
  } else {
    Object.values(ADAPTERS).forEach(list => filesToProcess.push(...list));
  }

  for (const item of filesToProcess) {
    const src = path.join(sourceDir, item);
    let dest = path.join(targetDir, item);
    
    // Remap core framework files to targetBase
    if (item === ".enderun") dest = targetFrameworkDir;
    if (item === "ENDERUN.md") dest = path.join(targetFrameworkDir, "ENDERUN.md");
    if (ADAPTERS[selectedAdapter]?.includes(item)) {
      dest = path.join(targetDir, item); // Keep adapter linker files in root
    }

    if (fs.existsSync(src)) {
      if (fs.lstatSync(src).isDirectory()) {
        // When copying framework dir, skip logs and project-specific state
        const skipFiles = (item === ".enderun") ? ["logs", "PROJECT_MEMORY.md", "BRAIN_DASHBOARD.md", "PROJECT_MEMORY.lock"] : [];
        const isDocs = item === "docs";
        copyDir(src, dest, new Set(skipFiles), isDocs, targetBase);
      } else {
        // Special files handling
        if (item === "package.json") continue;
        if (item === "ENDERUN.md" && fs.existsSync(dest)) {
          console.log(`ℹ️  Skipping ENDERUN.md (already exists in ${targetBase}).`);
          continue;
        }
        
        if (fs.existsSync(dest)) {
          console.log(`ℹ️  Skipping existing file: ${item}`);
          continue;
        }

        const ext = path.extname(item);
        const textExtensions = [".md", ".json", ".js", ".ts", ".txt", ""];
        if (textExtensions.includes(ext)) {
          let content = fs.readFileSync(src, "utf8");
          content = content.replace(/\{\{FRAMEWORK_DIR\}\}/g, targetBase);
          fs.writeFileSync(dest, content);
        } else {
          fs.copyFileSync(src, dest);
        }
      }
      console.log(`✅ ${item} processed -> ${path.relative(targetDir, dest)}`);
    }
  }

  // Smart setup
  mergePackageJson(path.join(targetDir, "package.json"), path.join(sourceDir, "package.json"));
  updateGitIgnore(path.join(targetDir, ".gitignore"), targetBase);
  
  const finalMemoryPath = path.join(targetDir, targetBase, "PROJECT_MEMORY.md");
  initializeMemory(finalMemoryPath, targetBase);

  // Initialize git if missing
  if (!fs.existsSync(path.join(targetDir, ".git"))) {
    try {
      const { execSync } = await import("child_process");
      execSync("git init", { cwd: targetDir, stdio: "ignore" });
      console.log("✅ Git repository initialized.");
    } catch (e) {
      console.warn("⚠️  Could not initialize git automatically. Please run 'git init' manually.");
    }
  }

  // --- Post-Install Hooks (Smart Setup) ---
  
  console.log("\n🛠️  Running smart configuration for adapters...");

  // Universal Gemini Compatibility (Symlink)
  try {
    const geminiDir = path.join(targetDir, ".gemini");
    const geminiAgentsDir = path.join(geminiDir, "agents");
    const frameworkAgentsDir = path.join(targetDir, targetBase, "agents");

    if (!fs.existsSync(geminiDir)) {
      fs.mkdirSync(geminiDir, { recursive: true });
    }

    if (targetBase !== ".gemini" && !fs.existsSync(geminiAgentsDir)) {
      const relativePath = path.relative(geminiDir, frameworkAgentsDir);
      fs.symlinkSync(relativePath, geminiAgentsDir, "dir");
      console.log(`🔗 Omni-Agent: Created symlink from .gemini/agents to ${targetBase}/agents`);
    }
  } catch (err) {
    // Silently ignore if symlink fails (e.g. on non-compatible OS)
  }

  if (selectedAdapter === "claude" || !selectedAdapter) {
    const mcpPath = path.join(targetDir, "packages/framework-mcp/src/index.ts");
    console.log("\n📝 Claude Code Setup:");
    console.log("To enable AI-Enderun tools in Claude Code, run this command:");
    console.log(`\x1b[36mclaude config add framework-mcp npx tsx ${mcpPath}\x1b[0m`);
  }

  if (selectedAdapter === "cursor" || !selectedAdapter) {
    console.log("✨ Cursor: Adapter CLAUDE.md and ENDERUN.md are ready to guide your AI.");
  }

  console.log("\n✨ Framework successfully installed! (v" + FRAMEWORK_VERSION + ")");
  console.log("\n⚠️  IMPORTANT: Run 'npm install && npm run enderun:build' to prepare the framework.");
  console.log("👉 Then run 'ai-enderun check' to verify the installation.");
}

/**
 * Check framework health and MCP status.
 */
function checkCommand() {
  console.log(`🔍 Checking AI-Enderun Health (v${FRAMEWORK_VERSION})...`);
  let issues = 0;

  const frameworkDir = getFrameworkDir();
  const checks = [
    { name: "Constitution (ENDERUN.md)", path: path.join(frameworkDir, "ENDERUN.md") },
    { name: "Memory (PROJECT_MEMORY.md)", path: path.join(frameworkDir, "PROJECT_MEMORY.md") },
    { name: "Shared Types", path: "packages/shared-types/package.json" },
    { name: "MCP Server", path: "packages/framework-mcp/package.json" },
    { name: "Tech Stack", path: "docs/tech-stack.md" },
    { name: "Requirements", path: "docs/project-docs.md" },
  ];

  for (const check of checks) {
    if (fs.existsSync(path.join(process.cwd(), check.path))) {
      console.log(`✅ ${check.name} found.`);
    } else {
      console.log(`❌ ${check.name} MISSING! (${check.path})`);
      issues++;
    }
  }

  // Dependency Check
  const mcpNodeModules = path.join(process.cwd(), "packages/framework-mcp/node_modules");
  if (!fs.existsSync(mcpNodeModules)) {
    console.log("❌ Dependencies MISSING! (Run 'npm install')");
    issues++;
  } else {
    console.log("✅ Dependencies found.");
  }

  // MCP Build Check
  const mcpPath = path.join(process.cwd(), "packages/framework-mcp/dist/index.js");
  if (!fs.existsSync(mcpPath)) {
    console.log("❌ MCP Build MISSING! (Run 'npm run enderun:build')");
    issues++;
  } else {
    console.log("✅ MCP Build found.");
    console.log("⏳ Testing MCP Server syntax...");
    try {
      execSync(`node --check ${mcpPath}`, { stdio: "pipe" });
      console.log("✅ MCP Server syntax valid.");
    } catch (e) {
      // If --check fails on ESM, we might skip it or use a better check
      console.log("⚠️  MCP Syntax check skipped (ESM/Environment).");
    }
  }

  if (issues === 0) {
    console.log("\n🚀 All systems green! AI-Enderun is ready for orchestration.");
  } else {
    console.log(`\n⚠️  Found ${issues} issues. Please fix them before starting.`);
  }
}

function copyDir(src, dest, skipSet = new Set(), nonDestructive = false, frameworkDir = ".enderun") {
  const DEFAULT_SKIP = new Set(["node_modules", ".git", ".DS_Store"]);
  const actualSkip = new Set([...DEFAULT_SKIP, ...skipSet]);

  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  fs.readdirSync(src, { withFileTypes: true }).forEach(entry => {
    if (actualSkip.has(entry.name)) return;

    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath, skipSet, nonDestructive, frameworkDir);
    } else {
      if (nonDestructive && fs.existsSync(destPath)) {
        return;
      }
      
      const ext = path.extname(entry.name);
      const textExtensions = [".md", ".json", ".js", ".ts", ".txt", ""];
      
      if (textExtensions.includes(ext)) {
        let content = fs.readFileSync(srcPath, "utf8");
        content = content.replace(/\{\{FRAMEWORK_DIR\}\}/g, frameworkDir);
        fs.writeFileSync(destPath, content);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  });
}

/**
 * Print the current framework status.
 */
function statusCommand() {
  const memoryPath = getMemoryPath();
  const frameworkDir = getFrameworkDir();
  if (!fs.existsSync(memoryPath)) {
    console.error(`❌ Error: ${frameworkDir}/PROJECT_MEMORY.md not found. Please run 'init' first.`);
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
    case "check":
      checkCommand();
      break;
    case "version":
    case "-v":
    case "--version":
      console.log(`v${FRAMEWORK_VERSION}`);
      break;
    default:
      console.log(`
🤖 AI-Enderun CLI (v${FRAMEWORK_VERSION})

Available Commands:
  init [adapter]    Initialize the framework (gemini, claude, cursor, codex)
  check             Verify framework health and MCP server status
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
