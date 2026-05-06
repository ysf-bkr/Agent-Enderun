import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import path from "path";
import fs from "fs";

const server = new Server(
  {
    name: "ai-agent-framework-mcp",
    version: "1.0.6",
  },
  {
    capabilities: {
      tools: {},
    },
  },
);

const SECURITY_AUDIT_ARGS_SCHEMA = z.object({
  path: z.string().default("."),
});

const SEARCH_CODEBASE_ARGS_SCHEMA = z.object({
  query: z.string().min(1).max(300),
  extension: z
    .string()
    .regex(/^[a-z0-9]+$/i)
    .default("ts"),
});

function resolveSafePath(projectRoot: string, targetPath: string): string {
  const resolved = path.resolve(projectRoot, targetPath);
  const relative = path.relative(projectRoot, resolved);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error("Path escapes project root.");
  }
  return resolved;
}

function collectFilesRecursively(
  targetPath: string,
  extensions: Set<string>,
): string[] {
  const results: string[] = [];
  const entries = fs.readdirSync(targetPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(targetPath, entry.name);

    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === ".git") continue;
      results.push(...collectFilesRecursively(fullPath, extensions));
      continue;
    }

    const ext = path.extname(entry.name).slice(1).toLowerCase();
    if (extensions.has(ext)) results.push(fullPath);
  }

  return results;
}

function buildLineMatches(
  files: string[],
  matcher: (line: string) => boolean,
  maxResults: number,
  projectRoot: string,
): string[] {
  const matches: string[] = [];

  for (const filePath of files) {
    if (matches.length >= maxResults) break;
    const content = fs.readFileSync(filePath, "utf-8");
    const lines = content.split("\n");

    for (let i = 0; i < lines.length; i++) {
      if (matches.length >= maxResults) break;
      const line = lines[i];
      if (!matcher(line)) continue;

      const relativePath = path.relative(projectRoot, filePath);
      matches.push(`${relativePath}:${i + 1}:${line}`);
    }
  }

  return matches;
}

/**
 * Tool definitions
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "get_framework_status",
        description:
          "Get the current status of the AI Agent Framework, including active phase and agent states.",
        inputSchema: { type: "object", properties: {} },
      },
      {
        name: "search_codebase",
        description:
          "Semantic search across the codebase using grep for exact matches and context. Ideal for finding logic and patterns.",
        inputSchema: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "Search query or regex pattern",
            },
            extension: {
              type: "string",
              description: "File extension filter (e.g., ts, md)",
              default: "ts",
            },
          },
          required: ["query"],
        },
      },
      {
        name: "analyze_dependencies",
        description:
          "Analyze code dependencies for a specific file or folder using import tracking.",
        inputSchema: {
          type: "object",
          properties: {
            path: {
              type: "string",
              description: "Path to analyze (relative to project root)",
            },
          },
          required: ["path"],
        },
      },
      {
        name: "get_memory_insights",
        description:
          "Analyze PROJECT_MEMORY.md and BRAIN_DASHBOARD.md to provide insights on what was done, what is being done, and the history.",
        inputSchema: { type: "object", properties: {} },
      },
      {
        name: "get_project_gaps",
        description:
          "Scans the project structure against the defined standards in Gemini.md and identifies missing files, folders, or documentation.",
        inputSchema: { type: "object", properties: {} },
      },
      {
        name: "security_audit_scan",
        description:
          "Scans the codebase for security vulnerabilities like hardcoded secrets, raw SQL, and unsafe async patterns.",
        inputSchema: {
          type: "object",
          properties: {
            path: {
              type: "string",
              description: "Path to scan (relative to project root)",
              default: ".",
            },
          },
        },
      },
    ],
  };
});

/**
 * Tool execution logic
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  const projectRoot = process.cwd();

  switch (name) {
    case "get_framework_status": {
      try {
        const memoryPath = path.join(
          projectRoot,
          ".gemini",
          "PROJECT_MEMORY.md",
        );
        const memoryContent = fs.readFileSync(memoryPath, "utf-8");
        const phaseMatch = memoryContent.match(/\| Aktif Faz \| (.+?) \|/);
        const phase = phaseMatch ? phaseMatch[1].trim() : "UNKNOWN";
        return {
          content: [
            {
              type: "text",
              text: `Framework active (v1.0.5). Phase: ${phase}.`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            { type: "text", text: "Framework active. Memory unreadable." },
          ],
        };
      }
    }

    case "security_audit_scan": {
      const parsed = SECURITY_AUDIT_ARGS_SCHEMA.safeParse(args ?? {});
      if (!parsed.success) {
        return {
          content: [{ type: "text", text: "Invalid path argument." }],
        };
      }

      const vulnerabilities = [];
      let safeTargetPath: string;
      const scanRules = [
        {
          pattern: "sql`",
          message: "Potential Raw SQL usage detected (check Kysely usage)",
          severity: "HIGH",
        },
        {
          pattern: "console.log",
          message: "console.log found in production code",
          severity: "LOW",
        },
        {
          pattern: "password:",
          message: "Potential hardcoded secret/password detected",
          severity: "CRITICAL",
        },
        {
          pattern: "secret:",
          message: "Potential hardcoded secret detected",
          severity: "CRITICAL",
        },
        {
          pattern: "apiKey:",
          message: "Potential hardcoded API Key detected",
          severity: "CRITICAL",
        },
        {
          pattern: "any",
          message: "Usage of 'any' type detected",
          severity: "MEDIUM",
        },
      ];

      try {
        safeTargetPath = resolveSafePath(projectRoot, parsed.data.path);
        if (!fs.existsSync(safeTargetPath)) {
          return {
            content: [{ type: "text", text: "Target path not found." }],
          };
        }

        const files = collectFilesRecursively(
          safeTargetPath,
          new Set(["ts", "tsx"]),
        );

        for (const rule of scanRules) {
          const ruleMatches = buildLineMatches(
            files,
            (line) => line.includes(rule.pattern),
            5,
            projectRoot,
          );
          if (ruleMatches.length > 0) {
            vulnerabilities.push(
              `[${rule.severity}] ${rule.message}:\n${ruleMatches.join("\n")}`,
            );
          }
        }

        return {
          content: [
            {
              type: "text",
              text:
                vulnerabilities.length > 0
                  ? `### SECURITY AUDIT RESULTS\n\n${vulnerabilities.join("\n\n")}`
                  : "No common security patterns or rule violations detected.",
            },
          ],
        };
      } catch (error) {
        return { content: [{ type: "text", text: "Security scan failed." }] };
      }
    }

    case "get_memory_insights": {
      try {
        const memoryPath = path.join(
          projectRoot,
          ".gemini",
          "PROJECT_MEMORY.md",
        );
        const dashboardPath = path.join(
          projectRoot,
          ".gemini",
          "BRAIN_DASHBOARD.md",
        );

        const memory = fs.existsSync(memoryPath)
          ? fs.readFileSync(memoryPath, "utf-8")
          : "Memory file missing.";
        const dashboard = fs.existsSync(dashboardPath)
          ? fs.readFileSync(dashboardPath, "utf-8")
          : "Dashboard file missing.";

        const history = memory.split("## HISTORY")[1] || "No history found.";
        const activeTasks =
          memory.split("## AKTİF GÖREVLER")[1]?.split("##")[0] ||
          "No active tasks.";

        return {
          content: [
            {
              type: "text",
              text: `### LIVE MEMORY INSIGHTS\n\n**Active Tasks:**\n${activeTasks.trim()}\n\n**Recent History:**\n${history.trim().substring(0, 1000)}...`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            { type: "text", text: "Failed to gather memory insights." },
          ],
        };
      }
    }

    case "get_project_gaps": {
      const missing = [];
      const checkPaths = [
        { path: "apps", type: "folder" },
        { path: "packages/shared-types/src/index.ts", type: "file" },
        { path: ".gemini/docs/api/README.md", type: "file" },
        { path: ".env", type: "file" },
      ];

      for (const item of checkPaths) {
        const fullPath = path.join(projectRoot, item.path);
        if (!fs.existsSync(fullPath)) {
          missing.push(`[MISSING ${item.type.toUpperCase()}] ${item.path}`);
        }
      }

      return {
        content: [
          {
            type: "text",
            text:
              missing.length > 0
                ? `Detected Gaps:\n${missing.join("\n")}`
                : "No structural gaps detected based on core standards.",
          },
        ],
      };
    }

    case "search_codebase": {
      const parsed = SEARCH_CODEBASE_ARGS_SCHEMA.safeParse(args ?? {});
      if (!parsed.success) {
        return {
          content: [
            { type: "text", text: "Invalid query/extension argument." },
          ],
        };
      }

      const { query, extension } = parsed.data;
      try {
        const files = collectFilesRecursively(
          projectRoot,
          new Set([extension]),
        );
        let queryRegex: RegExp;
        try {
          queryRegex = new RegExp(query);
        } catch (error) {
          return {
            content: [
              {
                type: "text",
                text: "Invalid regex pattern in query.",
              },
            ],
          };
        }
        const matches = buildLineMatches(
          files,
          (line) => queryRegex.test(line),
          20,
          projectRoot,
        );
        const result = matches.join("\n");
        return {
          content: [{ type: "text", text: result || "No matches found." }],
        };
      } catch (error) {
        return {
          content: [
            { type: "text", text: "Search found no matches or failed." },
          ],
        };
      }
    }

    case "analyze_dependencies": {
      const targetPath = args?.path as string;
      try {
        const fullPath = path.resolve(projectRoot, targetPath);
        if (!fs.existsSync(fullPath))
          return {
            content: [{ type: "text", text: `Path not found: ${targetPath}` }],
          };
        const stats = fs.statSync(fullPath);
        if (stats.isDirectory()) {
          const files = fs
            .readdirSync(fullPath)
            .filter((f) => f.endsWith(".ts") || f.endsWith(".tsx"));
          return {
            content: [
              {
                type: "text",
                text: `Directory contains ${files.length} TS files.`,
              },
            ],
          };
        } else {
          const content = fs.readFileSync(fullPath, "utf-8");
          const imports = content.match(/from\s+['"](.+?)['"]/g) || [];
          return {
            content: [
              {
                type: "text",
                text: `Dependencies for ${targetPath}:\n${imports.join("\n")}`,
              },
            ],
          };
        }
      } catch (error) {
        return { content: [{ type: "text", text: "Analysis failed." }] };
      }
    }

    default:
      throw new Error(`Tool not found: ${name}`);
  }
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
