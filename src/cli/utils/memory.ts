import fs from "fs";
import path from "path";
import { sleep } from "./time.js";
import { generateULID } from "./time.js";
import { FRAMEWORK_DIR_CANDIDATES } from "../adapters.js";

const targetDir = process.cwd();

export function getFrameworkDir(): string {
    for (const dir of FRAMEWORK_DIR_CANDIDATES) {
        const dirPath = path.join(targetDir, dir);
        if (!fs.existsSync(dirPath)) continue;
        const hasMemory = fs.existsSync(path.join(dirPath, "PROJECT_MEMORY.md"));
        const hasAgents = fs.existsSync(path.join(dirPath, "agents"));
        if (hasMemory || hasAgents) {
            return dir;
        }
    }
    for (const dir of FRAMEWORK_DIR_CANDIDATES) {
        if (fs.existsSync(path.join(targetDir, dir))) {
            return dir;
        }
    }
    return ".gemini";
}

export function getMemoryPath() {
    return path.join(targetDir, getFrameworkDir(), "PROJECT_MEMORY.md");
}

export function getConfiguredPaths(): { backend: string; frontend: string; docs: string; tests: string } {
    let backend = "apps/backend";
    let frontend = "apps/web";
    let docs = "docs";
    let tests = "tests";
    
    try {
        const frameworkDir = getFrameworkDir();
        const configPath = path.join(targetDir, frameworkDir, "config.json");
        if (fs.existsSync(configPath)) {
            const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
            if (config.paths) {
                if (config.paths.backend) backend = config.paths.backend;
                if (config.paths.frontend) frontend = config.paths.frontend;
                if (config.paths.docs) docs = config.paths.docs;
                if (config.paths.tests) tests = config.paths.tests;
            }
        }
    } catch {
        // ignore
    }
    return { backend, frontend, docs, tests };
}

export function acquireMemoryLock(lockPath: string, maxRetries = 5): boolean {
    for (let attempt = 0; attempt < maxRetries; attempt += 1) {
        try {
            const fd = fs.openSync(lockPath, "wx");
            fs.closeSync(fd);
            return true;
        } catch (error: unknown) {
            const err = error as NodeJS.ErrnoException;
            if (err?.code !== "EEXIST") throw error;
            if (attempt < maxRetries - 1) sleep(1000);
        }
    }
    return false;
}

export function releaseMemoryLock(lockPath: string): void {
    if (fs.existsSync(lockPath)) fs.unlinkSync(lockPath);
}

/**
 * Create initial PROJECT_MEMORY.md if missing.
 */
export function initializeMemory(memoryPath: string, targetBase: string): void {
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
    console.warn(`✅ PROJECT_MEMORY.md initialized in ${targetBase}`);
}
