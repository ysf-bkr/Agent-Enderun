import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import { CallToolRequest, ToolResult } from "./tools/types.js";
import { TOOLS, toolHandlers } from "./tools/index.js";


// ─── Server Setup ─────────────────────────────────────────────────

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

server.setRequestHandler(ListToolsRequestSchema, async () => {
    return { tools: TOOLS };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const typedRequest = request as CallToolRequest;
    const { name, arguments: args } = typedRequest.params;
    const projectRoot = process.env.ENDERUN_PROJECT_ROOT || process.cwd();

    try {
        const handler = toolHandlers[name];
        if (!handler) {
            return {
                isError: true,
                content: [{ type: "text" as const, text: `Unknown tool: ${name}` }],
            };
        }
        return handler(projectRoot, args || {});
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown error occurred";
        return {
            isError: true,
            content: [{ type: "text" as const, text: message }],
        };
    }
});

// ─── Graceful Startup & Shutdown ──────────────────────────────────

async function run() {
    const transport = new StdioServerTransport();

    // Prevent unhandled errors from crashing the MCP stream
    process.on("uncaughtException", (error: Error) => {
        process.stderr.write(`[agent-enderun-mcp] Uncaught exception: ${error.message}
`);
    });
    process.on("unhandledRejection", (reason: unknown) => {
        const message = reason instanceof Error ? reason.message : String(reason);
        process.stderr.write(`[agent-enderun-mcp] Unhandled rejection: ${message}
`);
    });

    // Graceful shutdown on SIGINT/SIGTERM
    const shutdown = async () => {
        try {
            await server.close();
        } catch {
            // Already closed or failed — safe to ignore
        }
        process.exit(0);
    };
    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);

    await server.connect(transport);
}

run().catch((error: Error) => {
    process.stderr.write(`[agent-enderun-mcp] Fatal startup error: ${error.message}
`);
    process.exit(1);
});
