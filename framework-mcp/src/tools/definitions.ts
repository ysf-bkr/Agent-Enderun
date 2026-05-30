import { ToolDefinition } from "../tools/types.js";

export const TOOLS: ToolDefinition[] = [
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
                findings: { type: "string", description: "Optional comma-separated findings or details" }
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