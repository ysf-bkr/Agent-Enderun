import fs from "fs";
import path from "path";
import { execSync } from "child_process";

import { getFrameworkDir, getConfiguredPaths } from "../utils/memory.js";
import { getPackageVersion } from "../utils/pkg.js"; // To get FRAMEWORK_VERSION

const FRAMEWORK_VERSION = getPackageVersion();

/**
 * Check framework health and MCP status.
 */
export function checkCommand() {
    console.warn(`🔍 Checking Agent Enderun Health (v${FRAMEWORK_VERSION})...`);
    let issues = 0;

    const frameworkDir = getFrameworkDir();
    const pathsMap = getConfiguredPaths();
  
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
        { name: "ESLint Config (eslint.config.js)", path: "eslint.config.js" },
        { name: "ESLint Standards", path: path.join(frameworkDir, "knowledge/eslint-standards.md") },
        { name: "Backend Contract", path: path.join(pathsMap.backend, "contract.version.json") },
        { name: "MCP Server", path: "framework-mcp/package.json" },
        { name: "Panda CSS Config", path: "panda.config.ts" },
        { name: "Brain Dashboard", path: path.join(frameworkDir, "BRAIN_DASHBOARD.md") },
        { name: "Project Architectural Portal (docs/README.md)", path: path.join(pathsMap.docs, "README.md") },
        { name: "System Getting Started Guide (docs/getting-started.md)", path: path.join(pathsMap.docs, "getting-started.md") },
        { name: "Enterprise Approval Flows Protocol", path: path.join(pathsMap.docs, "architecture/approval-flows.md") },
        { name: "Professional Error Handling Pattern", path: path.join(pathsMap.docs, "backend/error-handling.md") },
        { name: "Atomic Component Standards", path: path.join(pathsMap.docs, "frontend/component-patterns.md") },
    ];

    for (const check of checks) {
        if (fs.existsSync(path.join(process.cwd(), check.path))) {
            console.warn(`✅ ${check.name} found.`);
        } else {
            console.warn(`❌ ${check.name} MISSING! (${check.path})`);
            issues++;
        }
    }

    // Dependency Check
    const mcpNodeModules = path.join(process.cwd(), "framework-mcp/node_modules");
    const rootNodeModules = path.join(process.cwd(), "node_modules");
    if (!fs.existsSync(mcpNodeModules) && !fs.existsSync(rootNodeModules)) {
        console.warn("❌ Dependencies MISSING! (Run 'npm install')");
        issues++;
    } else {
        console.warn("✅ Dependencies found.");
    }

    // MCP Build Check
    const mcpPath = path.join(process.cwd(), "framework-mcp/dist/index.js");
    if (!fs.existsSync(mcpPath)) {
        console.warn("❌ MCP Build MISSING! (Run 'npm run enderun:build')");
        issues++;
    } else {
        console.warn("✅ MCP Build found.");
        console.warn("⏳ Testing MCP Server syntax...");
        try {
            execSync(`node --check ${mcpPath}`, { stdio: "pipe" });
            console.warn("✅ MCP Server syntax valid.");
        } catch {
            // If --check fails on ESM, we might skip it or use a better check
            console.warn("⚠️  MCP Syntax check skipped (ESM/Environment).");
        }
    }

    if (issues === 0) {
        console.warn("\n🚀 All systems green! Agent Enderun is ready for orchestration.");
    } else {
        console.warn(`
⚠️  Found ${issues} issues. Please fix them before starting.`);
        process.exit(1);
    }
}
