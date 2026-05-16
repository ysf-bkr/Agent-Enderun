import fs from "fs";
import path from "path";
import { getFrameworkDir } from "../utils.js";
import { 
    SEARCH_KNOWLEDGE_BASE_ARGS_SCHEMA, 
    UPDATE_KNOWLEDGE_BASE_ARGS_SCHEMA,
    GET_KNOWLEDGE_GRAPH_ARGS_SCHEMA
} from "../schemas.js";

export const knowledgeTools = [
    {
        name: "search_knowledge_base",
        description: "Searches the Academy's Obsidian-style knowledge base using keywords or tags.",
        inputSchema: {
            type: "object",
            properties: {
                query: { type: "string", description: "Search query, topic, or tag (e.g. #security)" },
            },
            required: ["query"],
        },
    },
    {
        name: "update_knowledge_base",
        description: "Adds or updates an entry with mandatory YAML frontmatter for Obsidian compatibility.",
        inputSchema: {
            type: "object",
            properties: {
                topic: { type: "string", description: "The topic or title" },
                content: { type: "string", description: "Content (YAML frontmatter will be auto-generated if missing)" },
                tags: { type: "array", items: { type: "string" }, description: "Tags for the entry" },
            },
            required: ["topic", "content"],
        },
    },
    {
        name: "get_knowledge_graph",
        description: "Generates a Mermaid diagram showing relationships between knowledge entries based on 'related' metadata.",
        inputSchema: {
            type: "object",
            properties: {
                tag: { type: "string", description: "Filter by tag" },
            },
        },
    },
];

function parseFrontmatter(content: string) {
    const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!match) return { metadata: {}, body: content };
    const yaml = match[1];
    const metadata: Record<string, any> = {};
    yaml.split("\n").forEach(line => {
        const [key, ...val] = line.split(":");
        if (key && val.length > 0) metadata[key.trim()] = val.join(":").trim();
    });
    return { metadata, body: content.replace(match[0], "").trim() };
}

export const knowledgeHandlers = {
    search_knowledge_base: async (args: unknown, projectRoot: string) => {
        const parsed = SEARCH_KNOWLEDGE_BASE_ARGS_SCHEMA.safeParse(args ?? {});
        if (!parsed.success) return { content: [{ type: "text", text: "Invalid search query." }] };
        try {
            const frameworkDir = getFrameworkDir(projectRoot);
            const kbDir = path.join(projectRoot, frameworkDir, "knowledge");
            if (!fs.existsSync(kbDir)) return { content: [{ type: "text", text: "Knowledge base is empty." }] };
            
            const query = parsed.data.query.toLowerCase();
            const results = fs.readdirSync(kbDir).filter(f => f.endsWith(".md")).map(file => {
                const content = fs.readFileSync(path.join(kbDir, file), "utf-8");
                const { metadata, body } = parseFrontmatter(content);
                
                const matchesQuery = body.toLowerCase().includes(query) || 
                                   file.toLowerCase().includes(query) ||
                                   (metadata.tags && metadata.tags.toLowerCase().includes(query)) ||
                                   (metadata.title && metadata.title.toLowerCase().includes(query));

                if (matchesQuery) {
                    return `### ${metadata.title || file.replace(".md", "")}\n**Tags:** ${metadata.tags || "None"}\n\n${body.slice(0, 300)}...`;
                }
                return null;
            }).filter(Boolean);

            return { content: [{ type: "text", text: results.length > 0 ? `### KNOWLEDGE BASE SEARCH RESULTS\n\n${results.join("\n\n---\n\n")}` : "No matching knowledge entries found." }] };
        } catch (error) {
            return { content: [{ type: "text", text: "Knowledge base search failed." }] };
        }
    },
    update_knowledge_base: async (args: unknown, projectRoot: string) => {
        const parsed = UPDATE_KNOWLEDGE_BASE_ARGS_SCHEMA.safeParse(args ?? {});
        if (!parsed.success) return { content: [{ type: "text", text: "Invalid arguments." }] };
        try {
            const frameworkDir = getFrameworkDir(projectRoot);
            const kbDir = path.join(projectRoot, frameworkDir, "knowledge");
            if (!fs.existsSync(kbDir)) fs.mkdirSync(kbDir, { recursive: true });
            
            const fileName = parsed.data.topic.replace(/[^a-z0-9]/gi, "_").toLowerCase() + ".md";
            const tags = parsed.data.tags;
            
            let finalContent = parsed.data.content;
            if (!finalContent.startsWith("---")) {
                const frontmatter = `---\ntitle: ${parsed.data.topic}\ntags: [${tags.join(", ")}]\nlast_updated: ${new Date().toISOString()}\n---\n\n`;
                finalContent = frontmatter + finalContent;
            }

            fs.writeFileSync(path.join(kbDir, fileName), finalContent);
            return { content: [{ type: "text", text: `Obsidian Wiki updated: ${parsed.data.topic}` }] };
        } catch (error) {
            return { content: [{ type: "text", text: "Failed to update knowledge base." }] };
        }
    },
    get_knowledge_graph: async (args: unknown, projectRoot: string) => {
        try {
            const frameworkDir = getFrameworkDir(projectRoot);
            const kbDir = path.join(projectRoot, frameworkDir, "knowledge");
            if (!fs.existsSync(kbDir)) return { content: [{ type: "text", text: "Knowledge base empty." }] };
            
            const files = fs.readdirSync(kbDir).filter(f => f.endsWith(".md"));
            let mermaid = "graph TD\n";
            
            files.forEach(file => {
                const content = fs.readFileSync(path.join(kbDir, file), "utf-8");
                const { metadata } = parseFrontmatter(content);
                const id = file.replace(".md", "");
                const label = metadata.title || id;
                
                mermaid += `  ${id}["${label}"]\n`;
                
                if (metadata.related) {
                    const related = metadata.related.replace(/[\[\]]/g, "").split(",");
                    related.forEach((r: string) => {
                        mermaid += `  ${id} --> ${r.trim().replace(".md", "")}\n`;
                    });
                }
            });

            return { content: [{ type: "text", text: `### KNOWLEDGE GRAPH (Mermaid)\n\n\`\`\`mermaid\n${mermaid}\n\`\`\`` }] };
        } catch (error) {
            return { content: [{ type: "text", text: "Failed to generate knowledge graph." }] };
        }
    }
};
