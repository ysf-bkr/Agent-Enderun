import fs from "fs";
import path from "path";
import { 
    getFrameworkDir, 
    prependToSection, 
    replaceSectionContent 
} from "../utils.js";
import { UPDATE_MEMORY_ARGS_SCHEMA } from "../schemas.js";

export const memoryTools = [
    {
        name: "update_project_memory",
        description: "Update a specific section of PROJECT_MEMORY.md (CURRENT STATUS, HISTORY, or ACTIVE TASKS) with new content.",
        inputSchema: {
            type: "object",
            properties: {
                section: {
                    type: "string",
                    enum: ["CURRENT STATUS", "HISTORY", "ACTIVE TASKS"],
                    description: "The section to update.",
                },
                content: {
                    type: "string",
                    description: "The new content to append or replace in that section.",
                },
            },
            required: ["section", "content"],
        },
    },
    {
        name: "read_project_memory",
        description: "Read the entire content of PROJECT_MEMORY.md safely. Use this instead of direct ReadFile tools to ensure framework compatibility.",
        inputSchema: { type: "object", properties: {} },
    },
];

export const memoryHandlers = {
    update_project_memory: async (args: unknown, projectRoot: string) => {
        const parsed = UPDATE_MEMORY_ARGS_SCHEMA.safeParse(args ?? {});
        if (!parsed.success) return { content: [{ type: "text", text: "Invalid section or content." }] };
        const { section, content } = parsed.data;
        const frameworkDir = getFrameworkDir(projectRoot);
        const memoryPath = path.join(projectRoot, frameworkDir, "PROJECT_MEMORY.md");
        const lockPath = memoryPath + ".lock";
        const lockOwner = `lock-${process.pid}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
        try {
            if (fs.existsSync(lockPath)) {
                const stats = fs.statSync(lockPath);
                if (Date.now() - stats.mtimeMs > 120000) fs.unlinkSync(lockPath);
                else return { content: [{ type: "text", text: "Memory is locked. Try again later." }] };
            }
            fs.writeFileSync(lockPath, JSON.stringify({ owner: lockOwner, createdAt: new Date().toISOString() }));
            let memoryContent = fs.readFileSync(memoryPath, "utf-8");
            if (section === "HISTORY") {
                let updated = false;
                const headers = ["HISTORY (Persistent Memory)", "HISTORY"];
                for (const h of headers) {
                    try {
                        memoryContent = prependToSection(memoryContent, h, content);
                        updated = true;
                        break;
                    } catch (e) {
                        // Ignore section not found
                    }
                }
                if (!updated) throw new Error("HISTORY section not found.");
            } else if (section === "CURRENT STATUS") {
                memoryContent = replaceSectionContent(memoryContent, "CURRENT STATUS", content);
            } else if (section === "ACTIVE TASKS") {
                memoryContent = replaceSectionContent(memoryContent, "ACTIVE TASKS", content);
            }
            fs.writeFileSync(memoryPath, memoryContent);
            if (fs.existsSync(lockPath) && fs.readFileSync(lockPath, "utf-8").includes(lockOwner)) fs.unlinkSync(lockPath);
            return { content: [{ type: "text", text: `Section ${section} updated successfully.` }] };
        } catch (error) {
            if (fs.existsSync(lockPath) && fs.readFileSync(lockPath, "utf-8").includes(lockOwner)) fs.unlinkSync(lockPath);
            return { content: [{ type: "text", text: `Memory update failed: ${error instanceof Error ? error.message : "Unknown error"}` }] };
        }
    },
    read_project_memory: async (args: unknown, projectRoot: string) => {
        try {
            const frameworkDir = getFrameworkDir(projectRoot);
            const memoryPath = path.join(projectRoot, frameworkDir, "PROJECT_MEMORY.md");
            if (!fs.existsSync(memoryPath)) return { content: [{ type: "text", text: `ERROR: ${frameworkDir}/PROJECT_MEMORY.md not found.` }] };
            return { content: [{ type: "text", text: fs.readFileSync(memoryPath, "utf-8") }] };
        } catch (error) {
            return { content: [{ type: "text", text: "ERROR: Failed to read PROJECT_MEMORY.md" }] };
        }
    },
};
