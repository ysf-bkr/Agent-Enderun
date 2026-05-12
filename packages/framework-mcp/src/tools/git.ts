import path from "path";
import { execSync } from "child_process";
import { GENERATE_SEMANTIC_COMMIT_MESSAGE_ARGS_SCHEMA } from "../schemas.js";

export const gitTools = [
    {
        name: "generate_semantic_commit_message",
        description: "Analyzes staged git changes and generates a structured semantic commit message based on project standards.",
        inputSchema: {
            type: "object",
            properties: {
                traceId: { type: "string", description: "The active Trace ID (ULID)" },
            },
            required: ["traceId"],
        },
    },
];

export const gitHandlers = {
    generate_semantic_commit_message: async (args: any, projectRoot: string) => {
        const parsed = GENERATE_SEMANTIC_COMMIT_MESSAGE_ARGS_SCHEMA.safeParse(args ?? {});
        if (!parsed.success) return { content: [{ type: "text", text: "Invalid traceId argument." }] };
        try {
            const diff = execSync("git diff --staged", { encoding: "utf-8", cwd: projectRoot });
            if (!diff) return { content: [{ type: "text", text: "No staged changes found." }] };
            const files = execSync("git diff --staged --name-only", { encoding: "utf-8", cwd: projectRoot }).split("\n").filter(Boolean);
            let type = "feat", scope = "code";
            if (files.some(f => f.includes(".md"))) type = "docs";
            else if (files.some(f => f.includes("shared-types"))) type = "arch";
            else if (files.some(f => f.includes("framework-mcp"))) type = "chore";
            else if (files.some(f => f.includes("bin/cli.js"))) type = "fix";
            else if (files.some(f => f.includes("test"))) type = "test";
            if (files.some(f => f.includes("apps/web"))) scope = "web";
            else if (files.some(f => f.includes("apps/backend"))) scope = "backend";
            else if (files.some(f => f.includes("packages/shared-types"))) scope = "contract";
            else if (files.some(f => f.includes("packages/framework-mcp"))) scope = "mcp";
            const summary = files.length === 1 ? `update ${path.basename(files[0])}` : `update ${files.length} files`;
            return { content: [{ type: "text", text: `### SUGGESTED SEMANTIC COMMIT MESSAGE\n\n\`[${parsed.data.traceId}] ${type}(${scope}): ${summary}\`\n\n**Files Analyzed:**\n${files.map(f => `- ${f}`).join("\n")}` }] };
        } catch (error) {
            return { content: [{ type: "text", text: "Failed to generate commit message." }] };
        }
    },
};
