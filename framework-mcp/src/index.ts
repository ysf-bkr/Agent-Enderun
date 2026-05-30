import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const server = new Server(
    {
        name: "agent-enderun-mcp",
        version: "0.9.4",
    },
    {
        capabilities: {
            tools: {},
        },
    }
);

const TOOLS: any[] = [
    {
        name: "read_file",
        description: "Read the content of a file within the project.",
        inputSchema: {
            type: "object",
            properties: {
                path: { type: "string", description: "Path to the file relative to project root" },
            },
            required: ["path"],
        },
    },
    {
        name: "write_file",
        description: "Write content to a file. Creates directories if missing.",
        inputSchema: {
            type: "object",
            properties: {
                path: { type: "string", description: "Path to the file relative to project root" },
                content: { type: "string", description: "Complete content of the file" },
            },
            required: ["path", "content"],
        },
    },
    {
        name: "replace_text",
        description: "Surgically replace a string in a file with another string.",
        inputSchema: {
            type: "object",
            properties: {
                path: { type: "string", description: "Path to the file" },
                oldText: { type: "string", description: "The exact text to find" },
                newText: { type: "string", description: "The text to replace it with" },
            },
            required: ["path", "oldText", "newText"],
        },
    },
    {
        name: "patch_file",
        description: "Safely update a file by replacing a specific line range with new content.",
        inputSchema: {
            type: "object",
            properties: {
                path: { type: "string", description: "Path to the file" },
                startLine: { type: "number", description: "Starting line number (1-indexed)" },
                endLine: { type: "number", description: "Ending line number (inclusive)" },
                newContent: { type: "string", description: "The new lines to insert" },
            },
            required: ["path", "startLine", "endLine", "newContent"],
        },
    },
    {
        name: "get_framework_status",
        description: "Get the current project phase, active traces, and agent states.",
        inputSchema: { type: "object", properties: {} },
    },
    {
        name: "update_project_memory",
        description: "Update a specific section in PROJECT_MEMORY.md.",
        inputSchema: {
            type: "object",
            properties: {
                section: { type: "string", description: "Section name (e.g., HISTORY, ACTIVE TASKS)" },
                content: { type: "string", description: "Markdown content to append or set" },
            },
            required: ["section", "content"],
        },
    },
    {
        name: "orchestrate_loop",
        description: "Process the pending Hermes messages and trigger dynamic state transitions.",
        inputSchema: { type: "object", properties: {} },
    },
    {
        name: "send_agent_message",
        description: "Send a Hermes protocol message to another agent.",
        inputSchema: {
            type: "object",
            properties: {
                to: { type: "string", description: "Target agent (e.g., @backend, @qa)" },
                category: { type: "string", enum: ["ACTION", "DELEGATION", "INFO", "ALERT"] },
                content: { type: "string", description: "Message content" },
                traceId: { type: "string", description: "Active Trace ID" },
            },
            required: ["to", "category", "content", "traceId"],
        },
    },
    {
        name: "log_agent_action",
        description: "Log an agent action to the framework logs.",
        inputSchema: {
            type: "object",
            properties: {
                agent: { type: "string", description: "The agent name (e.g., @manager, @backend)" },
                action: { type: "string", description: "Action type or name" },
                traceId: { type: "string", description: "The active Trace ID" },
                status: { type: "string", enum: ["SUCCESS", "FAILURE"], description: "The status of the action" },
                summary: { type: "string", description: "Brief description of the action taken" },
                findings: { type: "array", items: { type: "string" }, description: "Optional findings or details" }
            },
            required: ["agent", "action", "traceId", "status", "summary"]
        }
    },
    {
        name: "update_contract_hash",
        description: "Re-generate and synchronize the backend contract SHA-256 hash.",
        inputSchema: { type: "object", properties: {} }
    }
];

server.onRequest(ListToolsRequestSchema, async () => {
    return { tools: TOOLS };
});

server.onRequest(CallToolRequestSchema, async (request: any) => {
    const { name, arguments: args } = request.params as { name: string, arguments?: Record<string, unknown> };

    const projectRoot = process.cwd();

    try {
        switch (name) {
        case "read_file": {
            const filePath = path.join(projectRoot, args?.path as string);
            const content = fs.readFileSync(filePath, "utf8");
            return { content: [{ type: "text", text: content }] };
        }

        case "write_file": {
            const filePath = path.join(projectRoot, args?.path as string);
            fs.mkdirSync(path.dirname(filePath), { recursive: true });
            fs.writeFileSync(filePath, args?.content as string);
            return { content: [{ type: "text", text: `✅ File written: ${args?.path}` }] };
        }

        case "replace_text": {
            const filePath = path.join(projectRoot, args?.path as string);
            let content = fs.readFileSync(filePath, "utf8");
            const oldText = args?.oldText as string;
            const newText = args?.newText as string;
        
            if (!content.includes(oldText)) {
                throw new Error(`Text not found in file: ${oldText}`);
            }
        
            content = content.replace(oldText, newText);
            fs.writeFileSync(filePath, content);
            return { content: [{ type: "text", text: `✅ Surgical edit successful in ${args?.path}` }] };
        }

        case "patch_file": {
            const filePath = path.join(projectRoot, args?.path as string);
            const lines = fs.readFileSync(filePath, "utf8").split("\n");
            const start = (args?.startLine as number) - 1;
            const end = (args?.endLine as number);
            const newContent = (args?.newContent as string).split("\n");

            if (start < 0 || start > lines.length) throw new Error("Invalid start line.");
        
            lines.splice(start, end - start, ...newContent);
            fs.writeFileSync(filePath, lines.join("\n"));
            return { content: [{ type: "text", text: `✅ File patched successfully: ${args?.path}` }] };
        }

        case "get_framework_status": {
            const output = execSync("npx agent-enderun status").toString();
            return { content: [{ type: "text", text: output }] };
        }

        case "update_project_memory": {
            const section = args?.section as string;
            const content = args?.content as string;
            // Escape quotes for shell
            const safeContent = content.replace(/"/g, "\\\"");
            execSync(`npx agent-enderun update_project_memory "${section}" "${safeContent}"`);
            return { content: [{ type: "text", text: `✅ Section ${section} updated.` }] };
        }

        case "orchestrate_loop": {
            const output = execSync("npx agent-enderun orchestrate").toString();
            return { content: [{ type: "text", text: output }] };
        }

        case "send_agent_message": {
            interface SendAgentMessageArgs {
                to: string;
                category: "ACTION" | "DELEGATION" | "INFO" | "ALERT";
                content: string;
                traceId: string;
            }
            const { to, category, content, traceId } = args as any as SendAgentMessageArgs;
            const candidates = [
                ".gemini/antigravity",
                ".gemini/antigravity-cli",
                ".gemini",
                ".claude",
                ".grok",
                ".agent",
                ".enderun",
            ];
            let frameworkDir = ".gemini";
            for (const c of candidates) {
                if (fs.existsSync(path.join(projectRoot, c))) {
                    frameworkDir = c;
                    break;
                }
            }
            const messagePath = path.join(projectRoot, frameworkDir, "messages", `${to.replace("@", "")}.json`);
        
            const message = {
                timestamp: new Date().toISOString(),
                from: "@mcp",
                to,
                category,
                traceId,
                content,
                status: "PENDING"
            };

            fs.mkdirSync(path.dirname(messagePath), { recursive: true });
            fs.appendFileSync(messagePath, JSON.stringify(message) + "\n");
        
            return { content: [{ type: "text", text: `✅ Message sent to ${to}` }] };
        }

        case "log_agent_action": {
            interface LogAgentActionArgs {
                agent: string;
                action: string;
                traceId: string;
                status: "SUCCESS" | "FAILURE";
                summary: string;
                findings?: string[];
            }
            const { agent, action, traceId, status, summary, findings } = args as any as LogAgentActionArgs;
            
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
            for (const c of candidates) {
                if (fs.existsSync(path.join(projectRoot, c))) {
                    frameworkDir = c;
                    break;
                }
            }
            
            const agentName = agent.replace("@", "");
            const logPath = path.join(projectRoot, frameworkDir, "logs", `${agentName}.json`);
            
            const logEntry = {
                timestamp: new Date().toISOString(),
                agent,
                action,
                requestId: traceId,
                status,
                summary,
                findings: findings || []
            };
            
            fs.mkdirSync(path.dirname(logPath), { recursive: true });
            fs.appendFileSync(logPath, JSON.stringify(logEntry) + "\n");
            
            return { content: [{ type: "text", text: `✅ Action logged for ${agent} to ${path.join(frameworkDir, "logs", `${agentName}.json`)}` }] };
        }

        case "update_contract_hash": {
            const output = execSync("npx agent-enderun update-contract").toString();
            return { content: [{ type: "text", text: output }] };
        }

        default:
            throw new Error(`Unknown tool: ${name}`);
        }
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown error occurred";
        return {
            isError: true,
            content: [{ type: "text", text: message }],
        };
    }
});

async function run() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
}

run().catch(console.error);
