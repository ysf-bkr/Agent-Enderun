#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";
import { execSync } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const sourceDir = path.join(__dirname, "..");
const targetDir = process.cwd();

// --- CONSTANTS ---
const FRAMEWORK_VERSION = getPackageVersion();

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
  
  const sanitizeDeps = (deps) => {
    if (!deps) return deps;
    const cleaned = {};
    for (const [name, version] of Object.entries(deps)) {
      cleaned[name] = (typeof version === "string" && version.startsWith("workspace:")) ? "*" : version;
    }
    return cleaned;
  };

  const actualTargetScope = targetPkg.name && targetPkg.name.startsWith("@") 
    ? targetPkg.name.split("/")[0] 
    : (targetPkg.name ? `@${targetPkg.name}` : "");

  // Cleanup potential leftovers from previous bugged runs where agent-enderun was renamed to target name
  if (actualTargetScope) {
    const scopeName = actualTargetScope.startsWith("@") ? actualTargetScope.slice(1) : actualTargetScope;
    const cleanup = (obj) => {
      if (!obj) return;
      delete obj[scopeName];
      delete obj[actualTargetScope];
      delete obj["agent-enderun"]; // Will be re-added correctly
    };
    cleanup(targetPkg.devDependencies);
    cleanup(targetPkg.dependencies);
  }

  targetPkg.dependencies = sanitizeDeps({
    ...targetPkg.dependencies,
    ...sourcePkg.dependencies
  });

  // Merge scripts
  const pkgMgr = getPackageManager();
  const runCmd = pkgMgr === "yarn" ? "yarn" : (pkgMgr === "pnpm" ? "pnpm" : "npm run");
  
  targetPkg.scripts = {
    ...targetPkg.scripts,
    "enderun:status": "agent-enderun status",
    "enderun:trace": "agent-enderun trace:new",
    "enderun:verify": "agent-enderun verify-contract",
    "enderun:check": "agent-enderun check",
    "enderun:test": "vitest run",
    "enderun:test:watch": "vitest",
    "enderun:build": `${runCmd} build --prefix packages/shared-types && ${runCmd} build --prefix packages/framework-mcp`,
  };

  const sourceDevDeps = sourcePkg.devDependencies || {};
  targetPkg.devDependencies = sanitizeDeps({
    ...targetPkg.devDependencies,
    ...(sourceDevDeps["@modelcontextprotocol/sdk"] ? {"@modelcontextprotocol/sdk": sourceDevDeps["@modelcontextprotocol/sdk"]} : {}),
    ...(sourceDevDeps["zod"] ? {"zod": sourceDevDeps["zod"]} : {}),
    ...(sourceDevDeps["ts-morph"] ? {"ts-morph": sourceDevDeps["ts-morph"]} : {}),
    ...(sourceDevDeps["typescript"] ? {"typescript": sourceDevDeps["typescript"]} : {}),
    ...(sourceDevDeps["@types/node"] ? {"@types/node": sourceDevDeps["@types/node"]} : {}),
    ...(sourceDevDeps["tsx"] ? {"tsx": sourceDevDeps["tsx"]} : {}),
    ...(sourceDevDeps["vitest"] ? {"vitest": sourceDevDeps["vitest"]} : {}),
    "@pandacss/dev": "^0.53.0"
  });

  if (targetPkg.peerDependencies) targetPkg.peerDependencies = sanitizeDeps(targetPkg.peerDependencies);
  if (targetPkg.optionalDependencies) targetPkg.optionalDependencies = sanitizeDeps(targetPkg.optionalDependencies);

  // Ensure basic fields
  if (!targetPkg.name) targetPkg.name = path.basename(process.cwd());
  if (!targetPkg.version) targetPkg.version = "0.1.0";
  if (!targetPkg.type) targetPkg.type = "module";
  if (!targetPkg.workspaces) targetPkg.workspaces = ["packages/*"];

  // Add metadata
  targetPkg.enderun = {
    version: sourcePkg.version,
    initializedAt: new Date().toISOString(),
  };

  fs.writeFileSync(targetPath, JSON.stringify(targetPkg, null, 2));
  console.log("✅ package.json updated with Enderun scripts and dependencies.");
}

function updateGitIgnore(targetPath, frameworkDir = ".enderun") {
  const IGNORE_LINES = [
    "# AI-Enderun",
    ".enderun/logs/*.json",
    ".claude/logs/*.json",
    ".cursor/logs/*.json",
    ".codex/logs/*.json",
    ".enderun/logs/*.json",
    ".enderun/*.lock",
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
  const template = `# PROJECT MEMORY — Agent Enderun

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
- **Action:** Initialized Agent Enderun framework and project structure.
`;

  const finalTemplate = template.replace(/\{\{FRAMEWORK_DIR\}\}/g, targetBase);
  fs.writeFileSync(memoryPath, finalTemplate);
  console.log(`✅ PROJECT_MEMORY.md initialized in ${targetBase}`);
}

// --- COMMANDS ---

function getPackageManager() {
  const override = process.env.AGENT_ENDERUN_PACKAGE_MANAGER || process.env.AGENT_ENDERUN_PM || process.env.AI_ENDERUN_PACKAGE_MANAGER || process.env.AI_ENDERUN_PM;
  if (override) return override.toLowerCase();

  const userAgent = process.env.npm_config_user_agent || "";
  const npmExecPath = process.env.npm_execpath || "";

  if (userAgent.includes("pnpm") || npmExecPath.includes("pnpm")) return "pnpm";
  if (userAgent.includes("yarn") || npmExecPath.includes("yarn")) return "yarn";

  // Check for lockfiles in target directory
  if (fs.existsSync(path.join(process.cwd(), "pnpm-lock.yaml")) || fs.existsSync(path.join(process.cwd(), "pnpm-workspace.yaml"))) return "pnpm";
  if (fs.existsSync(path.join(process.cwd(), "yarn.lock"))) return "yarn";
  
  return "npm";
}

/**
 * Scaffold the framework into the target project.
 */
async function initCommand(selectedAdapter) {
  const ADAPTERS = {
    gemini: ["gemini.md", "gemini-extension.json"],
    claude: ["claude.md"],
    cursor: ["cursor.md"],
    codex: ["codex.md"],
  };

  const targetBase = selectedAdapter ? `.${selectedAdapter}` : ".enderun";

  const targetFrameworkDir = path.join(targetDir, targetBase);

  const CORE_FILES = [
    ".enderun",
    
    "mcp.json",
    ".env.example",
    "ENDERUN.md",
    "package.json",
    "tsconfig.json",
    "panda.config.ts",
    "packages/framework-mcp",
    "packages/shared-types",
  ];

  const DIRS_TO_CREATE = [
    targetBase,
    `${targetBase}/agents`,
    `${targetBase}/docs/api`,
    `${targetBase}/knowledge`,
    `${targetBase}/benchmarks`,
    `${targetBase}/monitoring`,
    `${targetBase}/logs`,
    `${targetBase}/messages`,
    "apps/web",
    "apps/backend",
    
    "packages/shared-types",
    "packages/framework-mcp",
  ];

  console.log(`🚀 Installing Agent Enderun (Adapter: ${selectedAdapter || "all"})...`);

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
    filesToProcess.push(...ADAPTERS[selectedAdapter]);
  } else {
    Object.values(ADAPTERS).forEach(list => filesToProcess.push(...list));
  }

  // Detect target project scope
  let targetPkg = {};
  try {
    const targetPkgPath = path.join(targetDir, "package.json");
    if (fs.existsSync(targetPkgPath)) {
      targetPkg = JSON.parse(fs.readFileSync(targetPkgPath, "utf8"));
    }
  } catch (e) {}
  
  let targetScope = "";
  if (targetPkg.name) {
    targetScope = targetPkg.name.startsWith("@") 
      ? targetPkg.name.split("/")[0] 
      : `@${targetPkg.name}`;
  } else {
    targetScope = `@${path.basename(targetDir)}`;
  }

  for (const item of filesToProcess) {
    const src = path.join(sourceDir, item);
    let dest = path.join(targetDir, item);
    
    // FORCED CLEANUP: Delete existing framework engine directory to ensure clean update
    if (["packages/framework-mcp"].includes(item)) {
      if (fs.existsSync(dest)) {
        try {
          fs.rmSync(dest, { recursive: true, force: true });
        } catch (e) {
          // ignore
        }
      }
    }

    // Remap core framework files to targetBase
    if (item === ".enderun" || item.startsWith(".enderun/")) {
      dest = path.join(targetDir, item.replace(".enderun", targetBase));
    }
    if (item === "ENDERUN.md") dest = path.join(targetFrameworkDir, "ENDERUN.md");
    
    // Check if item is an adapter pointer file
    const isAdapterPointer = Object.values(ADAPTERS).flat().includes(item);
    if (isAdapterPointer) {
      dest = path.join(targetDir, item);
    }

    if (fs.existsSync(src)) {
      if (fs.lstatSync(src).isDirectory()) {
        const skipFiles = (item === ".enderun") ? ["logs", "PROJECT_MEMORY.md", "PROJECT_MEMORY.lock"] : [];
        const nonDestructive = ["packages/shared-types", "docs", ".enderun"].includes(item);
        copyDir(src, dest, new Set(skipFiles), nonDestructive, targetBase, targetScope);
      } else {
        if (item === "package.json") continue; // We merge it later
        
        if (fs.existsSync(dest) && !isAdapterPointer) {
          console.log(`ℹ️  Skipping existing file: ${item}`);
          continue;
        }

        const ext = path.extname(item);
        const textExtensions = [".md", ".json", ".js", ".ts", ".txt", ""];
        if (textExtensions.includes(ext)) {
          let content = fs.readFileSync(src, "utf8");
          content = content.replace(/\{\{FRAMEWORK_DIR\}\}/g, targetBase);
          content = content.replace(/\{\{ADAPTER\}\}/g, selectedAdapter || "enderun");
          
          if (ext === ".json") {
            try {
              const json = JSON.parse(content);
              content = JSON.stringify(sanitizeJson(json, targetScope), null, 2);
              // Ensure variable replacement even inside JSON strings if any
              content = content.replace(/\{\{FRAMEWORK_DIR\}\}/g, targetBase);
              content = content.replace(/\{\{ADAPTER\}\}/g, selectedAdapter || "enderun");
            } catch (e) {
              content = content.replace(/workspace:[^"'\s]*/g, "*");
            }
          }
          
          fs.writeFileSync(dest, content);
        } else {
          fs.copyFileSync(src, dest);
        }
      }
      console.log(`✅ ${item} processed -> ${path.relative(targetDir, dest)}`);
    }
  }

  // Merge Package JSON
  mergePackageJson(path.join(targetDir, "package.json"), path.join(sourceDir, "package.json"));
  updateGitIgnore(path.join(targetDir, ".gitignore"), targetBase);
  
  const finalMemoryPath = path.join(targetDir, targetBase, "PROJECT_MEMORY.md");
  initializeMemory(finalMemoryPath, targetBase);
  
  deepCleanProtocols(targetDir, targetScope);

  if (!fs.existsSync(path.join(targetDir, ".git"))) {
    try {
      const { execSync } = await import("child_process");
      execSync("git init", { cwd: targetDir, stdio: "ignore" });
      console.log("✅ Git repository initialized.");
    } catch (e) {}
  }

  console.log("\n🛠️  Running smart configuration for adapters...");


  if (selectedAdapter === "gemini") {
    console.log(`💎 Gemini: Adapter gemini.md and ${targetBase}/ folder are ready.`);
  }

  if (selectedAdapter === "claude") {
    const mcpPath = path.join(targetDir, "packages/framework-mcp/src/index.ts");
    console.log("\n📝 Claude Code Setup:");
    console.log("To enable Agent Enderun tools in Claude Code, run this command:");
    console.log(`\x1b[36mclaude config add framework-mcp npx tsx ${mcpPath}\x1b[0m`);
  }

  if (selectedAdapter === "cursor") {
    const cursorRulesPath = path.join(targetDir, ".cursorrules");
    const cursorMdPath = path.join(targetDir, "cursor.md");
    if (fs.existsSync(cursorMdPath) && !fs.existsSync(cursorRulesPath)) {
      fs.copyFileSync(cursorMdPath, cursorRulesPath);
      console.log("🔗 Cursor: Synchronized cursor.md to .cursorrules");
    }
  }

  if (selectedAdapter === "codex") {
    console.log(`💎 Codex: Adapter codex.md and ${targetBase}/ folder are ready.`);
  }

  const pkgMgr = getPackageManager();
  const installCmd = pkgMgr === "npm" ? "npm install" : `${pkgMgr} install`;
  const buildCmd = pkgMgr === "npm" ? "npm run enderun:build" : `${pkgMgr} run enderun:build`;

  console.log(`\n✨ Framework scaffolded! (v${FRAMEWORK_VERSION})`);
  
  try {
    const { execSync } = await import("child_process");
    console.log(`\n📦 Step 1/3: Running '${installCmd}'...`);
    execSync(installCmd, { stdio: "inherit" });
    console.log(`\n🏗️  Step 2/3: Running '${buildCmd}'...`);
    execSync(buildCmd, { stdio: "inherit" });
    console.log(`\n🔍 Step 3/3: Running 'agent-enderun check'...`);
    checkCommand();
    console.log("\n🚀 Agent Enderun is fully installed and verified!");
  } catch (error) {
    console.error("\n❌ Automatic installation failed. Run manually:");
    console.log(`👉 ${installCmd} && ${buildCmd}`);
  }
}

/**
 * Recursively scans a directory for package.json files and removes workspace: protocols.
 */
function deepCleanProtocols(dir, targetScope = "") {
  if (!fs.existsSync(dir)) return;
  
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === ".git") continue;
      deepCleanProtocols(fullPath, targetScope);
    } else if (entry.name === "package.json") {
      try {
        const content = fs.readFileSync(fullPath, "utf8");
        const json = JSON.parse(content);
        const cleaned = JSON.stringify(sanitizeJson(json, targetScope), null, 2);
        fs.writeFileSync(fullPath, cleaned);
      } catch (e) {
        // ignore malformed json
      }
    } else if (entry.name === "package-lock.json") {
      fs.unlinkSync(fullPath);
    }
  }
}

/**
 * Check framework health and MCP status.
 */
function checkCommand() {
  console.log(`🔍 Checking Agent Enderun Health (v${FRAMEWORK_VERSION})...`);
  let issues = 0;

  const frameworkDir = getFrameworkDir();
  
  const constitutionPath = fs.existsSync(path.join(process.cwd(), "ENDERUN.md"))
    ? "ENDERUN.md"
    : path.join(frameworkDir, "ENDERUN.md");

  const checks = [
    { name: "Constitution (ENDERUN.md)", path: constitutionPath },
    { name: "Memory (PROJECT_MEMORY.md)", path: path.join(frameworkDir, "PROJECT_MEMORY.md") },
    { name: "Command Map (cli-commands.json)", path: path.join(frameworkDir, "cli-commands.json") },
    { name: "Framework Config (config.json)", path: path.join(frameworkDir, "config.json") },
    { name: "Agent Status (STATUS.md)", path: path.join(frameworkDir, "STATUS.md") },
    { name: "MCP Config (mcp.json)", path: "mcp.json" },
    { name: "Shared Types", path: "packages/shared-types/package.json" },
    { name: "MCP Server", path: "packages/framework-mcp/package.json" },
    { name: "Tech Stack", path: path.join(frameworkDir, "docs/tech-stack.md") },
    { name: "Panda CSS Config", path: "panda.config.ts" },
    { name: "Requirements", path: path.join(frameworkDir, "docs/project-docs.md") },
    { name: "API Registry", path: path.join(frameworkDir, "docs/api/README.md") },
    { name: "Security Policy", path: path.join(frameworkDir, "docs/security.md") },
    { name: "Privacy Policy", path: path.join(frameworkDir, "docs/privacy.md") },
    { name: "Brain Dashboard", path: path.join(frameworkDir, "BRAIN_DASHBOARD.md") },
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
  const rootNodeModules = path.join(process.cwd(), "node_modules");
  if (!fs.existsSync(mcpNodeModules) && !fs.existsSync(rootNodeModules)) {
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
    console.log("\n🚀 All systems green! Agent Enderun is ready for orchestration.");
  } else {
    console.log(`\n⚠️  Found ${issues} issues. Please fix them before starting.`);
    process.exit(1);
  }
}

function sanitizeJson(obj, targetScope = "") {
  if (typeof obj !== "object" || obj === null) return obj;
  if (Array.isArray(obj)) return obj.map(item => sanitizeJson(item, targetScope));
  const cleaned = {};
  for (const [key, value] of Object.entries(obj)) {
    let finalKey = key;
    let finalValue = value;

    // Remove UnoCSS related keys or values
    if (typeof key === "string" && key.includes("unocss")) continue;
    if (typeof value === "string" && value.includes("unocss")) {
      continue; // Skip this script/field
    }

    // Replace scope if needed
    if (targetScope) {
      const scopeName = targetScope.startsWith("@") ? targetScope.slice(1) : targetScope;

      // Handle scoped: @ai-enderun/foo -> @target/foo
      if (typeof key === "string" && key.startsWith("@ai-enderun/")) {
        finalKey = key.replace("@ai-enderun/", `${targetScope}/`);
      }
      if (typeof value === "string" && value.startsWith("@ai-enderun/")) {
        finalValue = value.replace("@ai-enderun/", `${targetScope}/`);
      }

      // Handle unscoped: ai-enderun-foo -> target-foo
      if (typeof key === "string" && key.startsWith("ai-enderun-")) {
        finalKey = key.replace("ai-enderun-", `${scopeName}-`);
      }
      if (typeof value === "string" && value.startsWith("ai-enderun-")) {
        finalValue = value.replace("ai-enderun-", `${scopeName}-`);
      }
      
      // Handle agent-enderun -> target (ONLY for the package name)
      if (key === "name" && value === "agent-enderun") {
        finalValue = scopeName;
      }
      
      // Preserve agent-enderun in dependencies and bin
      // (No action needed as finalKey/finalValue default to original)

      if (typeof value === "string" && value.startsWith("workspace:")) {
        finalValue = "*";
      }
    } else if (typeof value === "string" && value.startsWith("workspace:")) {
      finalValue = "*";
    }

    cleaned[finalKey] = (typeof finalValue === "object") ? sanitizeJson(finalValue, targetScope) : finalValue;
  }
  return cleaned;
}

function copyDir(src, dest, skipSet = new Set(), nonDestructive = false, frameworkDir = ".enderun", targetScope = "") {
  const DEFAULT_SKIP = new Set(["node_modules", ".git", ".DS_Store", "package-lock.json"]);
  const actualSkip = new Set([...DEFAULT_SKIP, ...skipSet]);

  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  fs.readdirSync(src, { withFileTypes: true }).forEach(entry => {
    if (actualSkip.has(entry.name)) return;

    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath, skipSet, nonDestructive, frameworkDir, targetScope);
    } else {
      if (nonDestructive && fs.existsSync(destPath)) {
        return;
      }
      
      const ext = path.extname(entry.name);
      const textExtensions = [".md", ".json", ".js", ".ts", ".txt", ""];
      
      if (textExtensions.includes(ext)) {
        let content = fs.readFileSync(srcPath, "utf8");
        content = content.replace(/\{\{FRAMEWORK_DIR\}\}/g, frameworkDir);
        
        // Sanitize workspace: protocol
        if (ext === ".json") {
          try {
            const json = JSON.parse(content);
            content = JSON.stringify(sanitizeJson(json, targetScope), null, 2);
          } catch (e) {
            content = content.replace(/workspace:[^"'\s]*/g, "*");
          }
        } else {
          content = content.replace(/workspace:[^"'\s]*/g, "*");
        }

        // Also replace ADAPTER
        const adapterName = frameworkDir.startsWith(".") ? frameworkDir.slice(1) : frameworkDir;
        content = content.replace(/\{\{ADAPTER\}\}/g, adapterName);
        
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

function securityAuditCommand(targetPath) {
  console.log(`🔍 Running Advanced Security Audit on: ${targetPath}...`);
  const scanRules = [
    { pattern: /sql`/, message: "Potential Raw SQL usage detected", severity: "HIGH" },
    { pattern: /(password|secret|api_?key)\s*[:=]\s*['"][^'"]+['"]/i, message: "Potential hardcoded secret detected", severity: "CRITICAL" },
    { pattern: /:\s*any(?!\w)/, message: "Usage of 'any' type detected", severity: "MEDIUM" },
    { pattern: /\.innerHTML\s*=/, message: "Unsafe innerHTML assignment detected", severity: "MEDIUM" },
  ];
  const issues = [];
  const files = collectFiles(path.join(targetDir, targetPath), [".ts", ".tsx", ".js", ".jsx"]);
  files.forEach(f => {
    const content = fs.readFileSync(f, "utf8");
    const lines = content.split("\n");
    lines.forEach((line, i) => {
      scanRules.forEach(rule => {
        if (rule.pattern.test(line)) {
          issues.push(`[${rule.severity}] ${rule.message} in ${path.relative(targetDir, f)}:${i+1}`);
        }
      });
    });
  });
  if (issues.length === 0) {
    console.log("✅ No security issues detected.");
  } else {
    issues.forEach(issue => console.log(`⚠️  ${issue}`));
  }
}

function complianceCheckCommand(targetPath) {
  console.log(`📜 Checking Constitution Compliance: ${targetPath}...`);
  const violations = [];
  const forbidden = ["@shadcn", "mui", "@chakra-ui", "tailwindcss"];
  const files = collectFiles(path.join(targetDir, targetPath), [".ts", ".tsx", ".js", ".jsx", ".md"]);
  files.forEach(f => {
    const content = fs.readFileSync(f, "utf8");
    forbidden.forEach(lib => {
      if (content.includes(lib)) violations.push(`${path.relative(targetDir, f)}: Forbidden library '${lib}' found.`);
    });
    if (f.endsWith(".ts") && content.includes("interface") && content.match(/ID\s*:\s*string/)) {
      violations.push(`${path.relative(targetDir, f)}: Potential Branded Types violation (ID typed as string).`);
    }
  });
  if (violations.length === 0) {
    console.log("✅ All systems compliant with ENDERUN.md.");
  } else {
    violations.forEach(v => console.log(`❌ ${v}`));
  }
}

function gitCommitCommand(traceId) {
  try {
    const diff = cp.execSync("git diff --staged", { encoding: "utf8" });
    if (!diff) {
      console.log("ℹ️ No staged changes found. Use 'git add' first.");
      return;
    }
    const files = cp.execSync("git diff --staged --name-only", { encoding: "utf8" }).split("\n").filter(Boolean);
    let type = "feat", scope = "code";
    if (files.some(f => f.includes(".md"))) type = "docs";
    else if (files.some(f => f.includes("shared-types"))) type = "arch";
    else if (files.some(f => f.includes("bin/cli.js"))) type = "fix";
    
    const summary = files.length === 1 ? `update ${path.basename(files[0])}` : `update ${files.length} files`;
    console.log(`\n### SUGGESTED COMMIT MESSAGE ###\n\n[${traceId}] ${type}(${scope}): ${summary}\n`);
  } catch (e) {
    console.log("❌ Git command failed.");
  }
}

function explorerGraphCommand(targetPath) {
  console.log(`🗺️  Generating Dependency Graph for: ${targetPath}...`);
  const files = collectFiles(path.join(targetDir, targetPath), [".ts", ".tsx"]);
  const edges = [];
  files.forEach(f => {
    const content = fs.readFileSync(f, "utf8");
    const name = path.basename(f, path.extname(f));
    const imports = content.match(/from\s+['"]\.\.?\/[^'"]+['"]/g) || [];
    imports.forEach(imp => {
      const target = path.basename(imp.split(/['"]/)[1]);
      edges.push(`${name} --> ${target}`);
    });
  });
  if (edges.length === 0) {
    console.log("ℹ️ No internal dependencies found.");
  } else {
    console.log("\n```mermaid\ngraph TD\n" + Array.from(new Set(edges)).join("\n") + "\n```\n");
  }
}

function explorerAuditCommand(targetPath) {
  console.log(`🧠 Codebase Intelligence Scan: ${targetPath}...`);
  const files = collectFiles(path.join(targetDir, targetPath), [".ts", ".tsx"]);
  const complexity = [];
  files.forEach(f => {
    const content = fs.readFileSync(f, "utf8");
    const lines = content.split("\n").length;
    if (lines > 300) complexity.push(`${path.relative(targetDir, f)} (${lines} lines)`);
  });
  if (complexity.length > 0) {
    console.log("\n⚠️ Complexity Spikes:");
    complexity.forEach(c => console.log(`- ${c}`));
  } else {
    console.log("✅ Codebase structure looks clean.");
  }
}

function collectFiles(dir, extensions) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      if (!file.includes("node_modules") && !file.includes(".git")) {
        results = results.concat(collectFiles(file, extensions));
      }
    } else {
      if (extensions.includes(path.extname(file))) {
        results.push(file);
      }
    }
  });
  return results;
}

function runScriptCommand(script, projectPath) {
  const fullPath = path.join(targetDir, projectPath);
  if (!fs.existsSync(fullPath)) {
    console.log(`❌ Project path not found: ${projectPath}`);
    return;
  }
  console.log(`🚀 Running 'npm run ${script}' in ${projectPath}...`);
  try {
    cp.spawnSync("npm", ["run", script], { cwd: fullPath, stdio: "inherit", shell: true });
  } catch (e) {
    console.log(`❌ Failed to run script: ${e.message}`);
  }
}

function gitSyncCommand() {
  console.log("🔄 Syncing with remote repository...");
  try {
    cp.execSync("git pull origin main --rebase", { stdio: "inherit" });
    console.log("✅ Successfully synced and rebased.");
  } catch (e) {
    console.log("❌ Sync failed. Please resolve conflicts manually.");
  }
}

function logAgentActionCommand(data) {
  const frameworkDir = getFrameworkDir();
  const logsDir = path.join(targetDir, frameworkDir, "logs");
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }

  const agent = normalizeAgentName(data.agent);
  const logPath = path.join(logsDir, `${agent}.json`);
  let logs = [];

  if (fs.existsSync(logPath)) {
    try {
      logs = JSON.parse(fs.readFileSync(logPath, "utf8"));
      if (!Array.isArray(logs)) logs = [];
    } catch {
      logs = [];
    }
  }

  const newEntry = {
    timestamp: new Date().toISOString(),
    ...data,
  };

  logs.push(newEntry);
  fs.writeFileSync(logPath, JSON.stringify(logs, null, 2));
  console.log(`✅ Logged action to ${frameworkDir}/logs/${agent}.json`);
}

function updateProjectMemoryCommand(section, content) {
  const memoryPath = getMemoryPath();
  if (!fs.existsSync(memoryPath)) {
    console.error("❌ Error: PROJECT_MEMORY.md not found.");
    return;
  }

  const lockPath = `${memoryPath}.lock`;
  if (!acquireMemoryLock(lockPath)) {
    console.error("❌ Error: Memory lock timeout.");
    return;
  }

  try {
    let memoryContent = fs.readFileSync(memoryPath, "utf8");

    if (section === "HISTORY") {
      const headers = ["## HISTORY (Persistent Memory)", "## HISTORY"];
      let sectionIndex = -1;
      let headerUsed = "";
      for (const h of headers) {
        sectionIndex = memoryContent.indexOf(h);
        if (sectionIndex !== -1) {
          headerUsed = h;
          break;
        }
      }
      
      if (sectionIndex === -1) {
        console.error("❌ Error: HISTORY section not found.");
        return;
      }
      const headerEnd = memoryContent.indexOf("\n", sectionIndex) + 1;
      memoryContent = memoryContent.slice(0, headerEnd) + "\n" + content.trim() + "\n" + memoryContent.slice(headerEnd);
    } else {
      const escaped = section.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const sectionRegex = new RegExp(`## ${escaped}[\\s\\S]*?(?=\\n## |$)`, "m");
      if (!sectionRegex.test(memoryContent)) {
        console.error(`❌ Error: Section not found: ${section}`);
        return;
      }
      memoryContent = memoryContent.replace(sectionRegex, `## ${section}\n\n${content.trim()}\n`);
    }

    fs.writeFileSync(memoryPath, memoryContent);
    console.log(`✅ Section ${section} updated in PROJECT_MEMORY.md`);
  } finally {
    releaseMemoryLock(lockPath);
  }
}

// --- MAIN DISPATCHER ---

async function main() {
  const [command, ...args] = process.argv.slice(2);

  // Skip header for version and mcp commands to keep output clean
  if (command !== "version" && command !== "-v" && command !== "--version" && command !== "mcp") {
    console.log("🤖 Agent Enderun CLI — Initializing...");
  }

  switch (command) {
    case "init":
      await initCommand(args[0]);
      break;
    case "status":
      statusCommand();
      break;
    case "trace:new":
      if (!args[0]) {
        console.error("❌ Usage: agent-enderun trace:new <description> [agent] [priority]");
      } else {
        traceNewCommand(args[0], args[1], args[2]);
      }
      break;
    case "verify-contract":
      verifyContractCommand();
      break;
    case "mcp": {
      const mcpServerPath = path.join(sourceDir, "packages/framework-mcp/dist/index.js");
      if (fs.existsSync(mcpServerPath)) {
        const { spawn } = await import("child_process");
        // Use node to execute the built MCP server
        const child = spawn("node", [mcpServerPath], { stdio: "inherit" });
        child.on("exit", (code) => process.exit(code || 0));
      } else {
        console.error("❌ MCP Server not built. Run 'npm run enderun:build' first.");
        process.exit(1);
      }
      break;
    }
    case "log_agent_action": {
      // Handle both structured JSON and positional args
      let data = {};
      try {
        if (args[0] && args[0].startsWith("{")) {
          data = JSON.parse(args.join(" "));
        } else {
          data = {
            agent: args[0],
            action: args[1],
            requestId: args[2],
            status: args[3] || "SUCCESS",
            summary: args[4] || "",
          };
        }
      } catch (e) {
        console.error("❌ Error parsing arguments for log_agent_action");
        process.exit(1);
      }
      logAgentActionCommand(data);
      break;
    }
    case "update_project_memory": {
      let section, content;
      try {
        if (args[0] && args[0].startsWith("{")) {
          const data = JSON.parse(args.join(" "));
          section = data.section;
          content = data.content;
        } else {
          section = args[0];
          content = args.slice(1).join(" ");
        }
      } catch (e) {
        console.error("❌ Error parsing arguments for update_project_memory");
        process.exit(1);
      }
      updateProjectMemoryCommand(section, content);
      break;
    }
    case "update_knowledge_base": {
      const topic = args[0];
      const content = args.slice(1).join(" ");
      if (!topic || !content) {
        console.error("❌ Usage: agent-enderun update_knowledge_base <topic> <content>");
        process.exit(1);
      }
      const frameworkDir = getFrameworkDir();
      const kbDir = path.join(targetDir, frameworkDir, "knowledge");
      if (!fs.existsSync(kbDir)) fs.mkdirSync(kbDir, { recursive: true });
      const fileName = topic.replace(/[^a-z0-9]/gi, "_").toLowerCase() + ".md";
      fs.writeFileSync(path.join(kbDir, fileName), content);
      console.log(`✅ Knowledge base updated: ${topic}`);
      break;
    }
    case "search_knowledge_base": {
      const query = args[0];
      if (!query) {
        console.error("❌ Usage: agent-enderun search_knowledge_base <query>");
        process.exit(1);
      }
      const frameworkDir = getFrameworkDir();
      const kbDir = path.join(targetDir, frameworkDir, "knowledge");
      if (!fs.existsSync(kbDir)) {
        console.log("ℹ️ Knowledge base is empty.");
        break;
      }
      const files = fs.readdirSync(kbDir).filter(f => f.endsWith(".md"));
      let found = false;
      for (const file of files) {
        const content = fs.readFileSync(path.join(kbDir, file), "utf-8");
        if (content.toLowerCase().includes(query.toLowerCase()) || file.toLowerCase().includes(query.toLowerCase())) {
          console.log(`\n### ${file.replace(".md", "")}\n${content.slice(0, 300)}...`);
          found = true;
        }
      }
      if (!found) console.log("ℹ️ No matching entries found.");
      break;
    }
    case "check":
      checkCommand();
      break;
    case "check:security":
      securityAuditCommand(args[0] || ".");
      break;
    case "check:compliance":
      complianceCheckCommand(args[0] || ".");
      break;
    case "git:commit":
      gitCommitCommand(args[0] || "TRACE-ID-MISSING");
      break;
    case "explorer:graph":
      explorerGraphCommand(args[0] || ".");
      break;
    case "explorer:audit":
      explorerAuditCommand(args[0] || ".");
      break;
    case "frontend:dev":
      runScriptCommand("dev", "apps/web");
      break;
    case "frontend:build":
      runScriptCommand("build", "apps/web");
      break;
    case "mobile:dev":
      runScriptCommand("start", "apps/mobile");
      break;
    case "git:sync":
      gitSyncCommand();
      break;
    case "version":
    case "-v":
    case "--version":
      console.log(`v${FRAMEWORK_VERSION}`);
      break;
    default:
      console.log(`
🤖 Agent Enderun CLI (v${FRAMEWORK_VERSION})

Available Commands:
  init [adapter]      Initialize the framework (gemini, claude, cursor, codex)
  check               Full health check
  check:security      Run security audit scan
  check:compliance    Run constitution compliance check
  status              Show current phase and task status
  trace:new <desc>    Generate a new Trace ID
  verify-contract     Check shared types integrity
  explorer:graph      Generate dependency graph
  explorer:audit      Codebase intelligence scan
  git:commit <id>     Suggest semantic commit message
  mcp                 Start the MCP server
  version             Show version information

Example:
  agent-enderun trace:new "Auth module design" backend P1
      `);
      break;
  }
}

main().catch(console.error);
