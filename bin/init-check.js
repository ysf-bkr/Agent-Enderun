#!/usr/bin/env node

import fs from "fs";
import path from "path";

const targetDir = process.cwd();

const candidates = [
    ".gemini/antigravity",
    ".gemini/antigravity-cli",
    ".gemini",
    ".claude",
    ".grok",
    ".agent",
    ".enderun",
];
let frameworkDir = ".enderun";
for (const dir of candidates) {
    if (fs.existsSync(path.join(targetDir, dir))) {
        frameworkDir = dir;
        break;
    }
}

let backend = "apps/backend";
let docs = "docs";

try {
    const configPath = path.join(targetDir, frameworkDir, "config.json");
    if (fs.existsSync(configPath)) {
        const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
        if (config.paths) {
            if (config.paths.backend) backend = config.paths.backend;
            if (config.paths.docs) docs = config.paths.docs;
        }
    }
} catch (e) {
    // ignore
}

const CRITICAL_STRUCTURE = [
    `${frameworkDir}/agents`,
    `${frameworkDir}/knowledge`,
    `${frameworkDir}/memory-graph/agent-contexts`,
    `${frameworkDir}/logs`,
    `${frameworkDir}/queue`,
    `${frameworkDir}/PROJECT_MEMORY.md`,
    `${docs}/architecture/standards`,
    `${backend}/src/database`,
    `${backend}/src/seeds`,
    `${backend}/migrations`
];

function checkIntegrity() {
    console.warn("🔍 Running Agent Enderun Framework Integrity Check...");
    let isHealthy = true;

    for (const item of CRITICAL_STRUCTURE) {
        const fullPath = path.join(targetDir, item);
        if (!fs.existsSync(fullPath)) {
            console.error(`❌ Missing critical component: ${item}`);
            isHealthy = false;
        } else {
            console.warn(`✅ Verified: ${item}`);
        }
    }

    if (isHealthy) {
        console.warn("\n✨ Framework integrity verified. System is healthy.");
        process.exit(0);
    } else {
        console.error("\n❌ Framework integrity check FAILED. Some components are missing.");
        process.exit(1);
    }
}

checkIntegrity();
