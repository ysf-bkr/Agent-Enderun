import path from "path";
import fs from "fs";

import { findClaudeConfigPath, addMcpServerToClaude } from "./utils/claude.js";
import { writeJsonFile, writeTextFile } from "./utils/fs.js";

export const ADAPTER_IDS = ["gemini", "claude", "grok", "antigravity", "antigravity-cli"] as const;
export type AdapterId = (typeof ADAPTER_IDS)[number];

export interface AdapterConfig {
  id: AdapterId;
  /** Runtime framework directory created by init */
  frameworkDir: string;
  /** Root shim file (e.g. gemini.md) */
  shimFile: string;
  /** Package template copied into frameworkDir */
  templateDir: ".enderun";
  /** Extra directories under frameworkDir (gemini only for nested auto-scaffold) */
  nestedDirs?: string[];
}

export const ADAPTERS: Record<AdapterId, AdapterConfig> = {
    gemini: {
        id: "gemini",
        frameworkDir: ".gemini",
        shimFile: "gemini.md",
        templateDir: ".enderun",
        nestedDirs: ["antigravity", "antigravity-cli"],
    },
    claude: {
        id: "claude",
        frameworkDir: ".claude",
        shimFile: "claude.md",
        templateDir: ".enderun",
    },
    grok: {
        id: "grok",
        frameworkDir: ".agent", // Future-proof agent-centric directory for Grok/X.ai
        shimFile: "grok.md",
        templateDir: ".enderun",
    },
    antigravity: {
        id: "antigravity",
        frameworkDir: ".gemini/antigravity",
        shimFile: "agent.md",
        templateDir: ".enderun",
    },
    "antigravity-cli": {
        id: "antigravity-cli",
        frameworkDir: ".gemini/antigravity-cli",
        shimFile: "agent.md",
        templateDir: ".enderun",
    },
};

/** 
 * All framework runtime directories (for discovery). 
 * Verified against 2026 industry standards for Claude Code (.claude/)
 * and internal standards for Antigravity (.gemini/antigravity/).
 */
export const FRAMEWORK_DIR_CANDIDATES = [
    ".gemini/antigravity",
    ".gemini/antigravity-cli",
    ".gemini",
    ".claude",
    ".agent",
    ".enderun",
] as const;

const SHIM_FILES = ADAPTER_IDS.map((id) => ADAPTERS[id].shimFile);

export function resolveAdapter(input?: string): AdapterConfig {
    const normalized = (input || "gemini").toLowerCase() as AdapterId;
    if (ADAPTER_IDS.includes(normalized)) {
        return ADAPTERS[normalized];
    }
    console.warn(`⚠️  Unknown adapter "${input}". Falling back to gemini (.gemini/).`);
    return ADAPTERS.gemini;
}

export function isAdapterShimFile(fileName: string): boolean {
    return SHIM_FILES.includes(fileName);
}

export function remapFrameworkContent(
    content: string,
    frameworkDir: string,
    adapterId: AdapterId,
): string {
    let result = content;
    result = result.replace(/\{\{FRAMEWORK_DIR\}\}/g, frameworkDir);
    result = result.replace(/\{\{ADAPTER\}\}/g, adapterId);
    result = result.replace(/\.enderun\//g, `${frameworkDir}/`);
    result = result.replace(/`\.enderun`/g, `\`${frameworkDir}\``);
    result = result.replace(/\.enderun(?![\w/-])/g, frameworkDir);

    // Read config paths dynamically to map directory tokens
    let backend = "apps/backend";
    let frontend = "apps/web";
    let docs = "docs";
    let tests = "tests";
    try {
        const configPath = path.join(process.cwd(), frameworkDir, "config.json");
        if (fs.existsSync(configPath)) {
            const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
            if (config.paths) {
                if (config.paths.backend) backend = config.paths.backend;
                if (config.paths.frontend) frontend = config.paths.frontend;
                if (config.paths.docs) docs = config.paths.docs;
                if (config.paths.tests) tests = config.paths.tests;
            }
        }
    } catch {
        // ignore
    }

    result = result.replace(/\{\{BACKEND_DIR\}\}/g, backend);
    result = result.replace(/\{\{FRONTEND_DIR\}\}/g, frontend);
    result = result.replace(/\{\{DOCS_DIR\}\}/g, docs);
    result = result.replace(/\{\{TESTS_DIR\}\}/g, tests);

    return result;
}

export function buildMcpServerEntry(projectRoot: string) {
    return {
        command: "node",
        args: [path.join(projectRoot, "framework-mcp/dist/index.js")],
        env: {},
    };
}

function writeAntigravityScaffold(frameworkDirPath: string): void {
    const antigravityReadme = `# Antigravity IDE — Agent Enderun

Antigravity IDE integration for the Gemini adapter.

- Framework root: \`${path.basename(frameworkDirPath)}/\`
- Nested path: \`antigravity/\`
- Use the parent \`mcp_config.json\` and \`gemini.md\` entrypoint at the project root.
`;

    const antigravityCliReadme = `# Antigravity CLI — Agent Enderun

Antigravity CLI integration for the Gemini adapter.

- Framework root: \`${path.basename(frameworkDirPath)}/\`
- Nested path: \`antigravity-cli/\`
- Register MCP from the project root \`mcp.json\` or \`.gemini/mcp_config.json\`.
`;

    writeTextFile(path.join(frameworkDirPath, "antigravity/README.md"), antigravityReadme);
    writeTextFile(path.join(frameworkDirPath, "antigravity-cli/README.md"), antigravityCliReadme);
}

/**
 * Adapter-specific MCP and IDE hooks after scaffold.
 */
export function runAdapterPostInit(adapter: AdapterConfig, projectRoot: string): void {
    const mcpEntry = buildMcpServerEntry(projectRoot);
    const mcpBlock = { mcpServers: { "agent-enderun": mcpEntry } };

    switch (adapter.id) {
    case "gemini": {
        writeJsonFile(path.join(projectRoot, adapter.frameworkDir, "mcp_config.json"), mcpBlock);
        writeAntigravityScaffold(path.join(projectRoot, adapter.frameworkDir));
        console.warn(`✅ Gemini MCP → ${adapter.frameworkDir}/mcp_config.json`);
        console.warn(`✅ Antigravity → ${adapter.frameworkDir}/antigravity/ & antigravity-cli/`);
        break;
    }
    case "antigravity": {
        writeJsonFile(path.join(projectRoot, adapter.frameworkDir, "mcp_config.json"), mcpBlock);
        console.warn(`✅ Antigravity IDE MCP → ${adapter.frameworkDir}/mcp_config.json`);
        break;
    }
    case "antigravity-cli": {
        writeJsonFile(path.join(projectRoot, adapter.frameworkDir, "mcp_config.json"), mcpBlock);
        console.warn(`✅ Antigravity CLI MCP → ${adapter.frameworkDir}/mcp_config.json`);
        break;
    }
    case "grok": {
        writeJsonFile(path.join(projectRoot, adapter.frameworkDir, "mcp_config.json"), mcpBlock);
        console.warn(`✅ Grok MCP → ${adapter.frameworkDir}/mcp_config.json`);
        break;
    }
    case "claude": {
        const configPath = findClaudeConfigPath();
        if (configPath) {
            const ok = addMcpServerToClaude(configPath, "agent-enderun", mcpEntry);
            if (ok) {
                console.warn(`✅ Claude MCP registered → ${configPath}`);
            } else {
                console.warn("⚠️  Could not patch Claude config automatically.");
            }
        } else {
            console.warn("⚠️  Claude config not found. Add MCP manually (see README).");
        }
        writeJsonFile(path.join(projectRoot, adapter.frameworkDir, "mcp_config.json"), mcpBlock);
        break;
    }
    default:
        break;
    }

    // Keep root mcp.json in sync when missing or empty
    const rootMcpPath = path.join(projectRoot, "mcp.json");
    if (!fs.existsSync(rootMcpPath)) {
        writeJsonFile(rootMcpPath, mcpBlock);
    }
}
