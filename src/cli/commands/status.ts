import fs from "fs";

import { getMemoryPath, getFrameworkDir } from "../utils/memory.js";

/**
 * Print the current framework status.
 */
export function statusCommand() {
    const memoryPath = getMemoryPath();
    const frameworkDir = getFrameworkDir();
    if (!fs.existsSync(memoryPath)) {
        console.error(`❌ Error: ${frameworkDir}/PROJECT_MEMORY.md not found. Please run 'init' first.`);
        return;
    }

    const content = fs.readFileSync(memoryPath, "utf8");
    
    // Format 1: Table Style (Original)
    const tableMatch = content.match(
        /\| Active Phase \| Profile \| Last Update \| Active Trace ID \| Blockers \|\n\| :----------- \| :------ \| :---------- \| :-------------- \| :------- \|\n\| (.*?) \| (.*?) \| (.*?) \| (.*?) \| (.*?) \|/,
    );

    // Format 2: List Style (New)
    const phaseMatch = content.match(/- Phase: (.*)/);
    const traceIdMatch = content.match(/- Trace ID: (.*)/);
    const profileMatch = content.match(/- Profile: (.*)/);
    const updateMatch = content.match(/- Last Update: (.*)/);
    const blockersMatch = content.match(/- Blockers: (.*)/);

    console.warn("\n📊 --- PROJECT STATUS ---");
    
    if (tableMatch) {
        console.warn(`🔹 Phase: ${tableMatch[1].trim()}`);
        console.warn(`🧭 Profile: ${tableMatch[2].trim()}`);
        console.warn(`📅 Update: ${tableMatch[3].trim()}`);
        console.warn(`🆔 Trace ID: ${tableMatch[4].trim()}`);
        console.warn(`⛔ Blockers: ${tableMatch[5].trim()}`);
    } else if (phaseMatch || traceIdMatch) {
        if (phaseMatch) console.warn(`🔹 Phase: ${phaseMatch[1].trim()}`);
        if (profileMatch) console.warn(`🧭 Profile: ${profileMatch[1].trim()}`);
        if (updateMatch) console.warn(`📅 Update: ${updateMatch[1].trim()}`);
        if (traceIdMatch) console.warn(`🆔 Trace ID: ${traceIdMatch[1].trim()}`);
        if (blockersMatch) console.warn(`⛔ Blockers: ${blockersMatch[1].trim()}`);
        
        // Check for manager state in list style
        const managerState = content.match(/- @manager state: (.*)/);
        if (managerState) console.warn(`🤖 Manager: ${managerState[1].trim()}`);
    } else {
        console.warn("⚠️  Status data could not be parsed in standard formats.");
    }

    const tasksSection = content.match(/## ACTIVE TASKS\n\n([\s\S]*?)(?=\n##|$)/);
    if (tasksSection) {
        console.warn("\n📋 Active Tasks:");
        console.warn(tasksSection[1].trim());
    }

    console.warn("\n-----------------------\n");
}
