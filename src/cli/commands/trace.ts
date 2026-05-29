import fs from "fs";

import { getMemoryPath, acquireMemoryLock, releaseMemoryLock } from "../utils/memory.js";
import { generateULID } from "../utils/time.js";
import { sanitizeTableCell, normalizeAgentName, normalizePriority, insertTaskRow } from "../utils/string.js";

/**
 * Generate a new Trace ID and add it to project memory.
 */
export function traceNewCommand(description: string, agent = "manager", priority = "P2"): string | void {
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
        console.warn(`
✅ New Trace ID created: ${traceId}`);
        console.warn(`📝 Added to task list: ${description}
`);
        return traceId;
    } finally {
        releaseMemoryLock(lockPath);
    }
}
