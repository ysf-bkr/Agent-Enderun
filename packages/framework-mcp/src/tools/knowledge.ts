import fs from "fs";
import path from "path";
import { getFrameworkDir } from "../utils.js";
import { 
    SEARCH_KNOWLEDGE_BASE_ARGS_SCHEMA, 
    UPDATE_KNOWLEDGE_BASE_ARGS_SCHEMA 
} from "../schemas.js";

export const knowledgeTools = [
    {
        name: "search_knowledge_base",
        description: "Searches the Academy's internal knowledge base for architectural patterns, troubleshooting guides, and FAQs.",
        inputSchema: {
            type: "object",
            properties: {
                query: { type: "string", description: "Search query or topic" },
            },
            required: ["query"],
        },
    },
    {
        name: "update_knowledge_base",
        description: "Adds or updates an entry in the Academy's internal knowledge base.",
        inputSchema: {
            type: "object",
            properties: {
                topic: { type: "string", description: "The topic or title of the entry" },
                content: { type: "string", description: "The technical content or guide" },
            },
            required: ["topic", "content"],
        },
    },
];

export const knowledgeHandlers = {
    search_knowledge_base: async (args: unknown, projectRoot: string) => {
        const parsed = SEARCH_KNOWLEDGE_BASE_ARGS_SCHEMA.safeParse(args ?? {});
        if (!parsed.success) return { content: [{ type: "text", text: "Invalid search query." }] };
        try {
            const frameworkDir = getFrameworkDir(projectRoot);
            const kbDir = path.join(projectRoot, frameworkDir, "knowledge");
            if (!fs.existsSync(kbDir)) return { content: [{ type: "text", text: "Knowledge base is empty." }] };
            const results = fs.readdirSync(kbDir).filter(f => f.endsWith(".md")).map(file => {
                const content = fs.readFileSync(path.join(kbDir, file), "utf-8");
                if (content.toLowerCase().includes(parsed.data.query.toLowerCase()) || file.toLowerCase().includes(parsed.data.query.toLowerCase())) {
                    return `### ${file.replace(".md", "")}\n\n${content.slice(0, 300)}...`;
                }
                return null;
            }).filter(Boolean);
            return { content: [{ type: "text", text: results.length > 0 ? `### KNOWLEDGE BASE SEARCH RESULTS\n\n${results.join("\n\n---\n\n")}` : "No matching knowledge base entries found." }] };
        } catch (error) {
            return { content: [{ type: "text", text: "Knowledge base search failed." }] };
        }
    },
    update_knowledge_base: async (args: unknown, projectRoot: string) => {
        const parsed = UPDATE_KNOWLEDGE_BASE_ARGS_SCHEMA.safeParse(args ?? {});
        if (!parsed.success) return { content: [{ type: "text", text: "Invalid topic or content." }] };
        try {
            const frameworkDir = getFrameworkDir(projectRoot);
            const kbDir = path.join(projectRoot, frameworkDir, "knowledge");
            if (!fs.existsSync(kbDir)) fs.mkdirSync(kbDir, { recursive: true });
            fs.writeFileSync(path.join(kbDir, parsed.data.topic.replace(/[^a-z0-9]/gi, "_").toLowerCase() + ".md"), parsed.data.content);
            return { content: [{ type: "text", text: `Knowledge base updated: ${parsed.data.topic}` }] };
        } catch (error) {
            return { content: [{ type: "text", text: "Failed to update knowledge base." }] };
        }
    },
};
