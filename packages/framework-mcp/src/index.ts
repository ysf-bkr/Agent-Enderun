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
    version: "0.0.2",
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

const UPDATE_MEMORY_ARGS_SCHEMA = z.object({
  section: z.enum(["MEVCUT DURUM", "HISTORY", "AKTİF GÖREVLER"]),
  content: z.string().min(1),
});

const ANALYZE_DEPENDENCIES_ARGS_SCHEMA = z.object({
  path: z.string().min(1),
});

const FRAMEWORK_VERSION = "0.0.2";

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

function collectMarkdownArtifacts(projectRoot: string): string[] {
  const docsRoot = path.join(projectRoot, ".gemini", "docs");
  if (!fs.existsSync(docsRoot)) return [];

  return collectFilesRecursively(docsRoot, new Set(["md"])).map((filePath) =>
    path.relative(projectRoot, filePath),
  );
}

function replaceSectionContent(
  markdown: string,
  sectionTitle: string,
  newBody: string,
): string {
  const escaped = sectionTitle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const sectionRegex = new RegExp(
    `## ${escaped}[\\s\\S]*?(?=\\n## |$)`,
    "m",
  );
  if (!sectionRegex.test(markdown)) {
    throw new Error(`Section not found: ${sectionTitle}`);
  }

  return markdown.replace(
    sectionRegex,
    `## ${sectionTitle}\n\n${newBody.trim()}\n`,
  );
}

function prependToSection(
  markdown: string,
  sectionTitle: string,
  contentToPrepend: string,
): string {
  const escaped = sectionTitle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const sectionRegex = new RegExp(`(## ${escaped}\\n)([\\s\\S]*?)(?=\\n## |$)`, "m");
  const match = markdown.match(sectionRegex);

  if (!match) {
    throw new Error(`Section not found: ${sectionTitle}`);
  }

  const currentBody = match[2].trimStart();
  const updatedBody = `${contentToPrepend.trim()}\n\n${currentBody}`.trim();
  return markdown.replace(sectionRegex, `$1\n${updatedBody}\n`);
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
        name: "codebase_search",
        description:
          "Compatibility alias for search_codebase. Use when older agent prompts still reference codebase_search.",
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
        name: "codebase_graph_query",
        description:
          "Compatibility alias for analyze_dependencies. Returns import-level dependency information for a file or folder.",
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
        name: "codebase_context",
        description:
          "Compatibility helper for non-code context discovery. Lists known markdown artifacts under .gemini/docs and memory files.",
        inputSchema: { type: "object", properties: {} },
      },
      {
        name: "codebase_context_search",
        description:
          "Compatibility alias for search_codebase focused on markdown artifacts. Defaults to md files.",
        inputSchema: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "Search query or regex pattern",
            },
            extension: {
              type: "string",
              description: "File extension filter (defaults to md)",
              default: "md",
            },
          },
          required: ["query"],
        },
      },
      {
        name: "get_project_gaps",
        description:
          "Scans the project structure against the defined standards in Gemini.md and identifies missing files, folders, or documentation.",
        inputSchema: { type: "object", properties: {} },
      },
      {
        name: "codebase_status",
        description: "Compatibility alias for get_framework_status.",
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
      {
        name: "update_project_memory",
        description:
          "Update a specific section of PROJECT_MEMORY.md (MEVCUT DURUM, HISTORY, or AKTİF GÖREVLER) with new content.",
        inputSchema: {
          type: "object",
          properties: {
            section: {
              type: "string",
              enum: ["MEVCUT DURUM", "HISTORY", "AKTİF GÖREVLER"],
              description: "The section to update.",
            },
            content: {
              type: "string",
              description: "The new content to append or replace in that section.",
            },
          },
          required: ["section", "content"],
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
    case "get_framework_status":
    case "codebase_status": {
      try {
        const memoryPath = path.join(
          projectRoot,
          ".gemini",
          "PROJECT_MEMORY.md",
        );
        const memoryContent = fs.readFileSync(memoryPath, "utf-8");
        const statusRowMatch = memoryContent.match(
          /\| Aktif Faz \| Profile \| Son Güncelleme \| Aktif Trace ID \| Blokaj \|\n\| :-------- \| :------ \| :------------- \| :------------- \| :----- \|\n\| ([^|]+) \| ([^|]+) \| ([^|]+) \| ([^|]+) \| ([^|]+) \|/,
        );
        const phase = statusRowMatch?.[1]?.trim() ?? "UNKNOWN";
        const profile = statusRowMatch?.[2]?.trim() ?? "UNKNOWN";
        return {
          content: [
            {
              type: "text",
              text: `Framework active (v${FRAMEWORK_VERSION}). Phase: ${phase}. Profile: ${profile}.`,
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
        {
          pattern: "eval(",
          message: "Dangerous 'eval()' usage detected",
          severity: "HIGH",
        },
        {
          pattern: ".innerHTML =",
          message: "Unsafe innerHTML assignment detected (XSS risk)",
          severity: "MEDIUM",
        },
        {
          pattern: "dangerouslySetInnerHTML",
          message: "React dangerouslySetInnerHTML detected",
          severity: "MEDIUM",
        },
        {
          pattern: "TODO:",
          message: "Outstanding TODO item found",
          severity: "LOW",
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
        const dashboardAgents =
          dashboard.split("## 📈 Visualizations")[0] || dashboard;

        return {
          content: [
            {
              type: "text",
              text: `### LIVE MEMORY INSIGHTS\n\n**Active Tasks:**\n${activeTasks.trim()}\n\n**Recent History:**\n${history.trim().substring(0, 1000)}...\n\n**Brain Snapshot:**\n${dashboardAgents.trim().substring(0, 500)}...`,
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

    case "codebase_context": {
      try {
        const artifacts = collectMarkdownArtifacts(projectRoot);
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

        return {
          content: [
            {
              type: "text",
              text:
                "### CONTEXT ARTIFACTS\n\n" +
                `PROJECT_MEMORY: ${fs.existsSync(memoryPath) ? "present" : "missing"}\n` +
                `BRAIN_DASHBOARD: ${fs.existsSync(dashboardPath) ? "present" : "missing"}\n` +
                `Docs:\n${artifacts.length > 0 ? artifacts.join("\n") : "No markdown artifacts found."}`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [{ type: "text", text: "Context discovery failed." }],
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
        { path: ".env.development", type: "file" },
        { path: ".gemini/PROJECT_MEMORY.md", type: "file" },
        { path: ".gemini/logs/manager.json", type: "file" },
        { path: ".gemini/logs/analyst.json", type: "file" },
        { path: ".gemini/logs/backend.json", type: "file" },
        { path: ".gemini/logs/frontend.json", type: "file" },
        { path: ".gemini/logs/explorer.json", type: "file" },
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

    case "search_codebase":
    case "codebase_search":
    case "codebase_context_search": {
      const mergedArgs =
        name === "codebase_context_search"
          ? { extension: "md", ...(args ?? {}) }
          : (args ?? {});
      const parsed = SEARCH_CODEBASE_ARGS_SCHEMA.safeParse(mergedArgs);
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

    case "analyze_dependencies":
    case "codebase_graph_query": {
      const parsed = ANALYZE_DEPENDENCIES_ARGS_SCHEMA.safeParse(args ?? {});
      if (!parsed.success) {
        return {
          content: [{ type: "text", text: "Invalid path argument." }],
        };
      }

      const targetPath = parsed.data.path;
      try {
        const fullPath = resolveSafePath(projectRoot, targetPath);
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
          const importRegex = /from\s+['"](.+?)['"]/g;
          const imports = [];
          let match;
          while ((match = importRegex.exec(content)) !== null) {
            const importPath = match[1];
            let resolved = "unresolved";
            
            // Basic relative path resolution
            if (importPath.startsWith(".")) {
              const absImport = path.resolve(path.dirname(fullPath), importPath);
              const possiblePaths = [absImport, absImport + ".ts", absImport + ".tsx", path.join(absImport, "index.ts")];
              for (const p of possiblePaths) {
                if (fs.existsSync(p)) {
                  resolved = path.relative(projectRoot, p);
                  break;
                }
              }
            }
            
            imports.push(`- ${importPath} (${resolved})`);
          }
          
          return {
            content: [
              {
                type: "text",
                text: `Dependencies for ${targetPath}:\n${imports.length > 0 ? imports.join("\n") : "No imports found."}`,
              },
            ],
          };
        }
      } catch (error) {
        return { content: [{ type: "text", text: "Analysis failed." }] };
      }
    }
    case "update_project_memory": {
      const parsed = UPDATE_MEMORY_ARGS_SCHEMA.safeParse(args ?? {});
      if (!parsed.success) {
        return { content: [{ type: "text", text: "Invalid section or content." }] };
      }

      const { section, content } = parsed.data;
      const memoryPath = path.join(projectRoot, ".gemini", "PROJECT_MEMORY.md");
      const lockPath = memoryPath + ".lock";

      try {
        // Lock protocol (simplified for MCP)
        if (fs.existsSync(lockPath)) {
          return { content: [{ type: "text", text: "Memory is locked. Try again later." }] };
        }
        fs.writeFileSync(lockPath, "LOCKED");

        let memoryContent = fs.readFileSync(memoryPath, "utf-8");
        
        if (section === "HISTORY") {
          memoryContent = prependToSection(
            memoryContent,
            "HISTORY (Kalıcı Hafıza)",
            content,
          );
        } else if (section === "MEVCUT DURUM") {
          memoryContent = replaceSectionContent(
            memoryContent,
            "MEVCUT DURUM",
            content,
          );
        } else if (section === "AKTİF GÖREVLER") {
          memoryContent = replaceSectionContent(
            memoryContent,
            "AKTİF GÖREVLER",
            content,
          );
        }

        fs.writeFileSync(memoryPath, memoryContent);
        fs.unlinkSync(lockPath);

        return { content: [{ type: "text", text: `Section ${section} updated successfully.` }] };
      } catch (error) {
        if (fs.existsSync(lockPath)) fs.unlinkSync(lockPath);
        const message = error instanceof Error ? error.message : "Unknown error";
        return {
          content: [{ type: "text", text: `Memory update failed: ${message}` }],
        };
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
