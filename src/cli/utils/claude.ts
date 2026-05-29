import fs from "fs";
import path from "path";

/**
 * Finds the Claude config file path (if it exists).
 */
export function findClaudeConfigPath(): string | null {
    const home = process.env.HOME || process.env.USERPROFILE;
    if (!home) return null;

    const possiblePaths = [
        path.join(home, ".config", "claude", "config.json"),
        path.join(home, ".claude", "config.json"),
        path.join(home, "Library", "Application Support", "Claude", "config.json"), // macOS Claude Desktop
        path.join(home, "Library", "Application Support", "Claude Code", "config.json"), // macOS Claude Code
        path.join(home, ".config", "Claude", "config.json"), // some Linux setups
    ];

    for (const p of possiblePaths) {
        if (fs.existsSync(p)) {
            return p;
        }
    }
    return null;
}

/**
 * Adds or updates an MCP server entry in Claude's config file.
 */
export function addMcpServerToClaude(configPath: string, serverName: string, serverConfig: Record<string, unknown>): boolean {
    try {
        let config: { mcpServers?: Record<string, Record<string, unknown>> } = { mcpServers: {} };

        if (fs.existsSync(configPath)) {
            const content = fs.readFileSync(configPath, "utf8");
            config = JSON.parse(content);
        }

        if (!config.mcpServers) {
            config.mcpServers = {};
        }

        config.mcpServers[serverName] = serverConfig;

        // Ensure parent directory exists
        const dir = path.dirname(configPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        fs.writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`);
        return true;
    } catch {
        return false;
    }
}
