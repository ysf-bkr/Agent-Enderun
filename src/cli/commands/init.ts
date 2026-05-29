import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

import {
    resolveAdapter,
    isAdapterShimFile,
    remapFrameworkContent,
    runAdapterPostInit,
    type AdapterConfig,
} from "../adapters.js";
import { getPackageManager, mergePackageJson, deepCleanProtocols, sanitizeJson, getPackageVersion } from "../utils/pkg.js";
import { updateGitIgnore, ensureDir, writeJsonFile, copyDir } from "../utils/fs.js";
import { initializeMemory } from "../utils/memory.js";
import { checkCommand } from "./check.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const sourceDir = path.join(__dirname, "../../..");
const targetDir = process.cwd();

const FRAMEWORK_VERSION = getPackageVersion();

const CORE_FILES = [
    ".enderun",
    "mcp.json",
    ".env.example",
    "ENDERUN.md",
    "package.json",
    "tsconfig.json",
    "panda.config.ts",
    "vitest.config.ts",
    "framework-mcp",
    "docs",
    "eslint.config.js",
];

const FRAMEWORK_SUBDIRS = [
    "agents",
    "agents/schema",
    "skills",
    "knowledge",
    "benchmarks",
    "monitoring",
    "logs",
    "messages",
    "memory-graph",
    "memory-graph/agent-contexts",
    "queue",
    "queue/pending",
    "queue/processing",
    "queue/completed",
    "queue/failed",
    "queue/pipelines",
];

function buildDirsToCreate(adapter: AdapterConfig): string[] {
    const dirs = [
        adapter.frameworkDir,
        ...FRAMEWORK_SUBDIRS.map((d) => `${adapter.frameworkDir}/${d}`),
        "apps/web",
        "apps/backend",
        "docs",
        "framework-mcp",
        "tests",
    ];
    if (adapter.nestedDirs) {
        for (const nested of adapter.nestedDirs) {
            dirs.push(`${adapter.frameworkDir}/${nested}`);
        }
    }
    return [...new Set(dirs)];
}

/**
 * Scaffold the framework for a specific IDE adapter (separate runtime folder per IDE).
 */
export async function initCommand(adapterInput?: string) {
    const adapter = resolveAdapter(adapterInput);
    const { frameworkDir, shimFile, templateDir } = adapter;
    const targetFrameworkDir = path.join(targetDir, frameworkDir);

    console.warn(`🚀 Installing Agent Enderun (Adapter: ${adapter.id} → ${frameworkDir}/)...`);

    if (!fs.existsSync(targetFrameworkDir)) {
        fs.mkdirSync(targetFrameworkDir, { recursive: true });
    }

    for (const dir of buildDirsToCreate(adapter)) {
        const fullPath = path.join(targetDir, dir);
        if (!fs.existsSync(fullPath)) {
            fs.mkdirSync(fullPath, { recursive: true });
            console.warn(`📂 Created directory: ${dir}`);
        }
    }

    const filesToProcess = [
        ...CORE_FILES,
        shimFile,
    ].filter(
        (f) =>
            CORE_FILES.includes(f) ||
      f === shimFile ||
      fs.existsSync(path.join(sourceDir, f)),
    );

    ensureDir(path.join(targetDir, "apps/backend"));
    const initContractPath = path.join(targetDir, "apps/backend/contract.version.json");
    if (!fs.existsSync(initContractPath)) {
        writeJsonFile(initContractPath, {
            contract_hash: "initial_hash_placeholder",
            last_updated: new Date().toISOString(),
        });
    }

    let targetPkg: Record<string, unknown> = {};
    try {
        const targetPkgPath = path.join(targetDir, "package.json");
        if (fs.existsSync(targetPkgPath)) {
            targetPkg = JSON.parse(fs.readFileSync(targetPkgPath, "utf8"));
        }
    } catch {
    // ignore
    }

    const pkgName = typeof targetPkg.name === "string" ? targetPkg.name : "";
    const targetScope = pkgName
        ? pkgName.startsWith("@")
            ? pkgName.split("/")[0]
            : `@${pkgName}`
        : `@${path.basename(targetDir)}`;

    for (const item of filesToProcess) {
        const src = path.join(sourceDir, item);
        let dest = path.join(targetDir, item);

        if (item === "framework-mcp" && fs.existsSync(dest)) {
            try {
                fs.rmSync(dest, { recursive: true, force: true });
            } catch {
                // ignore
            }
        }

        if (item === templateDir || item.startsWith(`${templateDir}/`)) {
            dest = path.join(targetDir, item.replace(templateDir, frameworkDir));
        }
        if (item === "ENDERUN.md") {
            dest = path.join(targetFrameworkDir, "ENDERUN.md");
        }
        if (isAdapterShimFile(item)) {
            dest = path.join(targetDir, item);
        }

        if (!fs.existsSync(src)) {
            continue;
        }

        if (fs.lstatSync(src).isDirectory()) {
            const skipFiles =
        item === templateDir ? ["logs", "PROJECT_MEMORY.md", "PROJECT_MEMORY.lock"] : [];
            const nonDestructive = ["docs", templateDir].includes(item);
            copyDir(
                src,
                dest,
                new Set(skipFiles),
                nonDestructive,
                frameworkDir,
                targetScope,
                sanitizeJson,
                adapter.id,
            );
        } else {
            if (item === "package.json") continue;

            if (fs.existsSync(dest) && !isAdapterShimFile(item)) {
                console.warn(`ℹ️  Skipping existing file: ${item}`);
                continue;
            }

            const ext = path.extname(item);
            const textExtensions = [".md", ".json", ".js", ".ts", ".txt", ""];
            if (textExtensions.includes(ext)) {
                let content = fs.readFileSync(src, "utf8");
                content = remapFrameworkContent(content, frameworkDir, adapter.id);

                if (ext === ".json") {
                    try {
                        const json = JSON.parse(content);
                        content = JSON.stringify(sanitizeJson(json, targetScope), null, 2);
                        content = remapFrameworkContent(content, frameworkDir, adapter.id);
                    } catch {
                        content = content.replace(/workspace:[^"'\s]*/g, "*");
                    }
                }

                fs.writeFileSync(dest, content);
            } else {
                fs.copyFileSync(src, dest);
            }
        }
        console.warn(`✅ ${item} processed -> ${path.relative(targetDir, dest)}`);
    }

    mergePackageJson(path.join(targetDir, "package.json"), path.join(sourceDir, "package.json"));
    updateGitIgnore(path.join(targetDir, ".gitignore"), frameworkDir);

    const finalMemoryPath = path.join(targetFrameworkDir, "PROJECT_MEMORY.md");
    initializeMemory(finalMemoryPath, frameworkDir);

    deepCleanProtocols(targetDir, targetScope);

    const sampleTestPath = path.join(targetDir, "tests/initial.test.ts");
    if (!fs.existsSync(sampleTestPath)) {
        fs.writeFileSync(
            sampleTestPath,
            `import { describe, it, expect } from "vitest";

describe("Initial Setup", () => {
  it("should verify the testing environment is active", () => {
    expect(true).toBe(true);
  });
});
`,
        );
    }

    if (!fs.existsSync(path.join(targetDir, ".git"))) {
        try {
            execSync("git init", { cwd: targetDir, stdio: "ignore" });
            console.warn("✅ Git repository initialized.");
        } catch {
            // ignore
        }
    }

    console.warn(`\n🛠️  Running ${adapter.id} adapter configuration...`);
    runAdapterPostInit(adapter, targetDir);

    console.warn(`\n♊ ${adapter.id.toUpperCase()}: Setup complete.`);
    console.warn(`   • Framework runtime: ${frameworkDir}/`);
    console.warn(`   • Entrypoint shim: ${shimFile}`);
    if (adapter.nestedDirs?.length) {
        console.warn(`   • Nested: ${adapter.nestedDirs.map((d) => `${frameworkDir}/${d}/`).join(", ")}`);
    }

    const pkgMgr = getPackageManager();
    const installCmd = pkgMgr === "npm" ? "npm install" : `${pkgMgr} install`;
    const buildCmd = pkgMgr === "npm" ? "npm run enderun:build" : `${pkgMgr} run enderun:build`;

    console.warn(`\n✨ Framework scaffolded! (v${FRAMEWORK_VERSION})`);

    if (process.env.ENDERUN_SKIP_INSTALL === "1") {
        console.warn("\n⏭️  Skipping install steps (ENDERUN_SKIP_INSTALL=1).");
        return;
    }

    try {
        execSync(installCmd, { stdio: "inherit" });
        console.warn(`\n🏗️  Step 2/3: Running '${buildCmd}'...`);
        execSync(buildCmd, { stdio: "inherit" });
        console.warn("\n🔍 Step 3/3: Running 'agent-enderun check'...");
        checkCommand();
        console.warn("\n🚀 Agent Enderun is fully installed and verified!");
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : String(e);
        console.error("\n❌ Automatic installation failed. Run manually:");
        console.warn(`👉 ${installCmd} && ${buildCmd}`);
        console.error(message);
    }
}
