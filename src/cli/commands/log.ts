import fs from "fs";
import path from "path";

import { getFrameworkDir } from "../utils/memory.js";
import { normalizeAgentName } from "../utils/string.js";

const targetDir = process.cwd(); // Assuming targetDir is process.cwd() in the CLI context

export function logAgentActionCommand(data: { agent?: unknown; action?: string; requestId?: string; status?: string; summary?: string; files?: string[]; details?: Record<string, unknown> }) {
    const frameworkDir = getFrameworkDir();
    const logsDir = path.join(targetDir, frameworkDir, "logs");
    if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir, { recursive: true });
    }

    const agent = normalizeAgentName(data.agent);
    const logPath = path.join(logsDir, `${agent}.json`);
    let logs: Record<string, unknown>[] = [];

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
    console.warn(`✅ Logged action to ${frameworkDir}/logs/${agent}.json`);
}
