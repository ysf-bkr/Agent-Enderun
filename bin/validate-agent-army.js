#!/usr/bin/env node

import fs from "fs";
import path from "path";

const FRAMEWORK_CANDIDATES = [".gemini", ".claude", ".agent", ".enderun"];

function detectFrameworkDir() {
    for (const dir of FRAMEWORK_CANDIDATES) {
        const agentsPath = path.resolve(dir, "agents");
        const schemaPath = path.resolve(dir, "agents/agent_army_schema.json");
        if (fs.existsSync(agentsPath)) {
            return { frameworkDir: dir, agentsDir: agentsPath, schemaPath };
        }
    }
    return null;
}

const detected = detectFrameworkDir();
if (!detected) {
    console.error("❌ No framework agents/ directory found. Run: agent-enderun init <adapter>");
    console.error(`   Looked for: ${FRAMEWORK_CANDIDATES.map((d) => `${d}/agents`).join(", ")}`);
    process.exit(1);
}

const { frameworkDir, agentsDir, schemaPath } = detected;

console.log(`🛡️  STARTING AUTOMATED AGENT ARMY VALIDATION (${frameworkDir})...`);

try {
    if (!fs.existsSync(schemaPath)) {
        console.error(`❌ Schema missing: ${schemaPath}`);
        process.exit(1);
    }

    const schema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));
    const requiredKeys = schema.required;
    const files = fs.readdirSync(agentsDir);
    let totalFailed = 0;

    console.log("--------------------------------------------------");
    console.log("| Agent ID  | Status    | Score | Category       |");
    console.log("--------------------------------------------------");

    for (const fileName of files) {
        if (!fileName.endsWith(".md")) continue;
        const filePath = path.join(agentsDir, fileName);
        const content = fs.readFileSync(filePath, "utf8");

        const match = content.match(/^---\n([\s\S]*?)\n---/);
        if (!match) {
            console.log(`| ${fileName.padEnd(9)} | ❌ NO YAML | ----- | ---------------- |`);
            totalFailed++;
            continue;
        }

        const yamlContent = match[1];
        const agent = {};
        yamlContent.split("\n").forEach((line) => {
            const [key, ...valParts] = line.split(":");
            if (key && valParts.length > 0) {
                let val = valParts.join(":").trim();
                val = val.replace(/^['"]|['"]$/g, "");
                if (!isNaN(val) && val !== "") {
                    agent[key.trim()] = Number(val);
                } else {
                    agent[key.trim()] = val;
                }
            }
        });

        const missing = requiredKeys.filter((k) => agent[k] === undefined);

        if (missing.length > 0) {
            console.log(
                `| ${fileName.replace(".md", "").padEnd(9)} | ❌ FAILED  | ----- | ${`Missing: ${missing.join(",")}`.slice(0, 16)} |`,
            );
            totalFailed++;
        } else {
            console.log(
                `| ${agent.name.padEnd(9)} | ✅ PASSED  | ${String(agent.capability).padEnd(5)} | ${agent.role.substring(0, 14).padEnd(14)} |`,
            );
        }
    }

    console.log("--------------------------------------------------");
    if (totalFailed > 0) {
        console.error(`❌ Validation failed! Detected ${totalFailed} invalid agent configurations.`);
        process.exit(1);
    } else {
        console.log("🎉 SUCCESS: All core agents comply with the Master Agent Army Schema!");
    }
} catch (e) {
    console.error("❌ Critical error during schema validation:", e);
    process.exit(1);
}
