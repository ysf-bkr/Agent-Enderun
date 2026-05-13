import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { allTools, allHandlers } from "./tools/index.js";
import { FRAMEWORK_VERSION } from "./utils.js";

const server = new Server({
    name: "ai-enderun-mcp",
    version: FRAMEWORK_VERSION,
}, {
    capabilities: {
        tools: {},
    },
});

server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: allTools,
    };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    const projectRoot = process.cwd();
    
    // Handle compatibility for context search
    let effectiveArgs = args;
    if (name === "codebase_context_search") {
        effectiveArgs = { extension: "md", ...(args ?? {}) };
    }

    const handler = allHandlers[name];
    if (handler) {
        return await handler(effectiveArgs, projectRoot);
    }

    throw new Error(`Tool not found: ${name}`);
});

async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Framework MCP Server running on stdio");
}

main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});
