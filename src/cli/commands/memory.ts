import fs from "fs";
import path from "path";

import { getMemoryPath, acquireMemoryLock, releaseMemoryLock } from "../utils/memory.js";

export function updateProjectMemoryCommand(section: string, content: string) {
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
            for (const h of headers) {
                sectionIndex = memoryContent.indexOf(h);
                if (sectionIndex !== -1) {
                    break;
                }
            }

            if (sectionIndex === -1) {
                console.error("❌ Error: HISTORY section not found.");
                return;
            }
            const headerEnd = memoryContent.indexOf("\n", sectionIndex) + 1;
            memoryContent =
                memoryContent.slice(0, headerEnd) +
                `\n${content.trim()}\n` +
                memoryContent.slice(headerEnd);

            // --- Auto-Prune Logic ---
            const historySplit = memoryContent.split("### ");
            if (historySplit.length > 11) { // Title + 10 entries
                const frameworkDir = path.dirname(memoryPath);
                const archiveDir = path.join(frameworkDir, "archive/history");
                if (!fs.existsSync(archiveDir)) fs.mkdirSync(archiveDir, { recursive: true });

                const toArchive = historySplit.slice(11); // Keep the first 10 entries (newest)
                const preserved = historySplit.slice(0, 11);
                
                const archiveContent = "### " + toArchive.join("### ");
                const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
                fs.writeFileSync(path.join(archiveDir, `history-${timestamp}.md`), archiveContent);
                
                memoryContent = preserved.join("### ").trim() + "\n";
                console.warn(`📦 Auto-Pruned: ${toArchive.length} old entries moved to archive.`);
            }
            // ------------------------
        } else {
            const escaped = section.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            const sectionRegex = new RegExp(`## ${escaped}[\\s\\S]*?(?=\\n## |$)`, "m");
            if (!sectionRegex.test(memoryContent)) {
                console.error(`❌ Error: Section not found: ${section}`);
                return;
            }
            memoryContent = memoryContent.replace(
                sectionRegex,
                `## ${section}\n\n${content.trim()}\n`,
            );
        }

        fs.writeFileSync(memoryPath, memoryContent);
        console.warn(`✅ Section ${section} updated in PROJECT_MEMORY.md`);
    } finally {
        releaseMemoryLock(lockPath);
    }
}
