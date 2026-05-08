import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { Project, SyntaxKind } from "ts-morph";

const server = new Server(
  {
    name: "ai-enderun-mcp",
    version: "0.1.1",
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
  section: z.enum(["CURRENT STATUS", "HISTORY", "ACTIVE TASKS"]),
  content: z.string().min(1),
});

const ANALYZE_DEPENDENCIES_ARGS_SCHEMA = z.object({
  path: z.string().min(1),
});

const LOG_AGENT_ACTION_ARGS_SCHEMA = z.object({
  agent: z.string().min(1),
  action: z.string().min(1),
  requestId: z.string().min(1),
  files: z.array(z.string()).default([]),
  status: z.enum(["SUCCESS", "FAILURE"]),
  summary: z.string().min(1),
  details: z.record(z.any()).default({}),
});

const FRAMEWORK_VERSION = "0.1.1";

function getFrameworkDir(projectRoot: string): string {
  const adapters = [".gemini", ".claude", ".cursor", ".codex", ".enderun"];
  for (const adp of adapters) {
    const fullPath = path.join(projectRoot, adp);
    if (fs.existsSync(fullPath) && fs.lstatSync(fullPath).isDirectory()) {
      return adp;
    }
  }
  return ".enderun";
}

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
  const docsRoot = path.join(projectRoot, "docs");
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
  const sectionRegex = new RegExp(`## ${escaped}[\\s\\S]*?(?=\\n## |$)`, "m");
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
  const sectionRegex = new RegExp(
    `(## ${escaped}\\n)([\\s\\S]*?)(?=\\n## |$)`,
    "m",
  );
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
          "Compatibility helper for non-code context discovery. Lists known markdown artifacts under docs/ and memory files.",
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
          "Scans the project structure against the defined standards in ENDERUN.md and identifies missing files, folders, or documentation.",
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
              enum: ["CURRENT STATUS", "HISTORY", "ACTIVE TASKS"],
              description: "The section to update.",
            },
            content: {
              type: "string",
              description:
                "The new content to append or replace in that section.",
            },
          },
          required: ["section", "content"],
        },
      },
      {
        name: "verify_api_contract",
        description:
          "Verify if the shared-types match the stored contract hash in contract.version.json.",
        inputSchema: { type: "object", properties: {} },
      },
      {
        name: "update_contract_hash",
        description:
          "Generate a new hash for shared-types and update contract.version.json.",
        inputSchema: { type: "object", properties: {} },
      },
      {
        name: "log_agent_action",
        description:
          "Safely append a structured log entry to the agent's log file.",
        inputSchema: {
          type: "object",
          properties: {
            agent: {
              type: "string",
              description: "Agent name (e.g. analyst, backend)",
            },
            action: {
              type: "string",
              description: "Action performed (e.g. CREATE, MODIFY)",
            },
            requestId: {
              type: "string",
              description: "Trace ID or Request ID",
            },
            files: {
              type: "array",
              items: { type: "string" },
              description: "Files affected",
            },
            status: {
              type: "string",
              enum: ["SUCCESS", "FAILURE"],
              description: "Action status",
            },
            summary: { type: "string", description: "Short English summary" },
            details: { type: "object", description: "Additional details" },
          },
          required: ["agent", "action", "requestId", "status", "summary"],
        },
      },
      {
        name: "get_system_time",
        description: "Get the current system time in ISO-8601 format (UTC). Use this instead of Shell 'date' commands.",
        inputSchema: { type: "object", properties: {} },
      },
      {
        name: "read_project_memory",
        description: "Read the entire content of .enderun/PROJECT_MEMORY.md safely. Use this instead of direct ReadFile tools to ensure framework compatibility.",
        inputSchema: { type: "object", properties: {} },
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
        const frameworkDir = getFrameworkDir(projectRoot);
        const memoryPath = path.join(
          projectRoot,
          frameworkDir,
          "PROJECT_MEMORY.md",
        );
        const memoryContent = fs.readFileSync(memoryPath, "utf-8");
        const statusRowMatch = memoryContent.match(
          /\| Active Phase \| Profile \| Last Update \| Active Trace ID \| Blockers \|\n\| :----------- \| :------ \| :---------- \| :-------------- \| :------- \|\n\| ([^|]+) \| ([^|]+) \| ([^|]+) \| ([^|]+) \| ([^|]+) \|/,
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
          pattern: /sql`/,
          message: "Potential Raw SQL usage detected (check Kysely usage)",
          severity: "HIGH",
        },
        {
          pattern: /(?<!\/\/\s*)console\.log/,
          message: "console.log found in production code",
          severity: "LOW",
        },
        {
          pattern: /(password|secret|api_?key)\s*[:=]\s*['"][^'"]+['"]/i,
          message: "Potential hardcoded secret/password detected",
          severity: "CRITICAL",
        },
        {
          pattern: /:\s*any(?!\w)/,
          message: "Usage of 'any' type detected",
          severity: "MEDIUM",
        },
        {
          pattern: /(?<!\w)eval\s*\(/,
          message: "Dangerous 'eval()' usage detected",
          severity: "HIGH",
        },
        {
          pattern: /\.innerHTML\s*=/,
          message: "Unsafe innerHTML assignment detected (XSS risk)",
          severity: "MEDIUM",
        },
        {
          pattern: /dangerouslySetInnerHTML/,
          message: "React dangerouslySetInnerHTML detected",
          severity: "MEDIUM",
        },
        {
          pattern: /TODO:/,
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

        // Regex-based scans (for simple patterns)
        for (const rule of scanRules) {
          const ruleMatches = buildLineMatches(
            files,
            (line) => {
              if (typeof rule.pattern === "string") {
                return line.includes(rule.pattern);
              } else {
                return rule.pattern.test(line);
              }
            },
            5,
            projectRoot,
          );
          if (ruleMatches.length > 0) {
            vulnerabilities.push(
              `[${rule.severity}] ${rule.message}:\n${ruleMatches.join("\n")}`,
            );
          }
        }

        // AST-based scans (for deeper structural analysis)
        const tsProject = new Project({
          compilerOptions: { allowJs: true },
        });
        tsProject.addSourceFilesAtPaths(
          path.join(safeTargetPath, "**/*.{ts,tsx}"),
        );

        for (const sourceFile of tsProject.getSourceFiles()) {
          const relativePath = path.relative(
            projectRoot,
            sourceFile.getFilePath(),
          );

          // 1. Precise 'any' detection
          sourceFile.forEachDescendant((node) => {
            if (node.getKindName() === "AnyKeyword") {
              const line = node.getStartLineNumber();
              vulnerabilities.push(
                `[MEDIUM] Precise 'any' type detected in AST at ${relativePath}:${line}`,
              );
            }

            // 2. Precise 'console.log' detection
            if (node.getKind() === SyntaxKind.CallExpression) {
              const callExp = node.asKind(SyntaxKind.CallExpression);
              const expression = callExp?.getExpression();
              if (expression?.getText() === "console.log") {
                const line = node.getStartLineNumber();
                vulnerabilities.push(
                  `[LOW] Production 'console.log' detected in AST at ${relativePath}:${line}`,
                );
              }
            }
          });
        }

        return {
          content: [
            {
              type: "text",
              text:
                vulnerabilities.length > 0
                  ? `### ADVANCED SECURITY AUDIT RESULTS\n\n${Array.from(new Set(vulnerabilities)).join("\n\n")}`
                  : "No security patterns or rule violations detected (Regex & AST verified).",
            },
          ],
        };
      } catch (error) {
        return { content: [{ type: "text", text: "Security scan failed." }] };
      }
    }

    case "get_memory_insights": {
      try {
        const frameworkDir = getFrameworkDir(projectRoot);
        const memoryPath = path.join(
          projectRoot,
          frameworkDir,
          "PROJECT_MEMORY.md",
        );
        const dashboardPath = path.join(
          projectRoot,
          frameworkDir,
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
          memory.split("## ACTIVE TASKS")[1]?.split("##")[0] ||
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
        const frameworkDir = getFrameworkDir(projectRoot);
        const memoryPath = path.join(
          projectRoot,
          frameworkDir,
          "PROJECT_MEMORY.md",
        );
        const dashboardPath = path.join(
          projectRoot,
          frameworkDir,
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
      const missing: string[] = [];
      const checkPaths = [
        { path: "apps", type: "folder", optional: true },
        { path: "packages/shared-types/src", type: "folder" },
        { path: ".enderun/docs/api", type: "folder", optional: true },
        { path: ".env", type: "file", optional: true },
        { path: ".env.example", type: "file" },
        { path: path.join(getFrameworkDir(projectRoot), "PROJECT_MEMORY.md"), type: "file" },
        { path: path.join(getFrameworkDir(projectRoot), "BRAIN_DASHBOARD.md"), type: "file" },
        { path: "docs/tech-stack.md", type: "file" },
        { path: "docs/project-docs.md", type: "file" },
      ];

      for (const item of checkPaths) {
        const fullPath = path.join(projectRoot, item.path);
        if (!fs.existsSync(fullPath) && !item.optional) {
          missing.push(`[MISSING ${item.type.toUpperCase()}] ${item.path}`);
        }
      }

      // Additional dynamic checks
      const frameworkDir = getFrameworkDir(projectRoot);
      const agentsDir = path.join(projectRoot, frameworkDir, "agents");
      if (fs.existsSync(agentsDir)) {
        const agents = fs
          .readdirSync(agentsDir)
          .filter((f) => f.endsWith(".md"));
        for (const agent of agents) {
          const agentName = agent.replace(".md", "");
          const logFile = path.join(
            projectRoot,
            frameworkDir,
            "logs",
            `${agentName}.json`,
          );
          if (!fs.existsSync(logFile)) {
            missing.push(
              `[MISSING LOG FILE] .enderun/logs/${agentName}.json (Expected for agent ${agentName})`,
            );
          }
        }
      } else {
        missing.push(`[MISSING FOLDER] .enderun/agents`);
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
          queryRegex = new RegExp(query, "i"); // make search case-insensitive by default
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

        // Fast search with limited results
        const matches: string[] = [];
        const MAX_RESULTS = 30;

        for (const filePath of files) {
          if (matches.length >= MAX_RESULTS) break;
          const content = fs.readFileSync(filePath, "utf-8");
          const lines = content.split("\n");

          for (let i = 0; i < lines.length; i++) {
            if (matches.length >= MAX_RESULTS) break;
            const line = lines[i];
            if (queryRegex.test(line)) {
              const relativePath = path.relative(projectRoot, filePath);
              matches.push(`- ${relativePath}:${i + 1}: ${line.trim()}`);
            }
          }
        }

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

        const tsProject = new Project({
          compilerOptions: { allowJs: true },
        });

        if (stats.isDirectory()) {
          tsProject.addSourceFilesAtPaths(
            path.join(fullPath, "**/*.{ts,tsx,js,jsx}"),
          );
          const sourceFiles = tsProject.getSourceFiles();
          return {
            content: [
              {
                type: "text",
                text: `Directory contains ${sourceFiles.length} source files. Use a specific file path for deep dependency analysis.`,
              },
            ],
          };
        } else {
          const sourceFile = tsProject.addSourceFileAtPath(fullPath);
          const imports = sourceFile.getImportDeclarations();
          const importDetails = imports.map((imp) => {
            const moduleSpecifier = imp.getModuleSpecifierValue();
            const source = imp.getModuleSpecifierSourceFile();
            const resolvedPath = source
              ? path.relative(projectRoot, source.getFilePath())
              : "unresolved/external";
            return `- ${moduleSpecifier} (${resolvedPath})`;
          });

          return {
            content: [
              {
                type: "text",
                text: `Dependencies for ${targetPath}:\n${importDetails.length > 0 ? importDetails.join("\n") : "No imports found."}`,
              },
            ],
          };
        }
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text:
                "Analysis failed: " +
                (error instanceof Error ? error.message : String(error)),
            },
          ],
        };
      }
    }
    case "update_project_memory": {
      const parsed = UPDATE_MEMORY_ARGS_SCHEMA.safeParse(args ?? {});
      if (!parsed.success) {
        return {
          content: [{ type: "text", text: "Invalid section or content." }],
        };
      }

      const { section, content } = parsed.data;
      const memoryPath = path.join(
        projectRoot,
        ".enderun",
        "PROJECT_MEMORY.md",
      );
      const lockPath = memoryPath + ".lock";
      const lockOwner = `lock-${process.pid}-${Date.now()}-${Math.random().toString(16).slice(2)}`;

      try {
        // Lock protocol (simplified for MCP)
        if (fs.existsSync(lockPath)) {
          const stats = fs.statSync(lockPath);
          const now = Date.now();
          if (now - stats.mtimeMs > 120000) {
            // 2 minutes stale
            fs.unlinkSync(lockPath); // Override stale lock
          } else {
            return {
              content: [
                { type: "text", text: "Memory is locked. Try again later." },
              ],
            };
          }
        }
        fs.writeFileSync(
          lockPath,
          JSON.stringify({
            owner: lockOwner,
            createdAt: new Date().toISOString(),
          }),
        );

        let memoryContent = fs.readFileSync(memoryPath, "utf-8");

        if (section === "HISTORY") {
          memoryContent = prependToSection(
            memoryContent,
            "HISTORY (Persistent Memory)",
            content,
          );
        } else if (section === "CURRENT STATUS") {
          memoryContent = replaceSectionContent(
            memoryContent,
            "CURRENT STATUS",
            content,
          );
        } else if (section === "ACTIVE TASKS") {
          memoryContent = replaceSectionContent(
            memoryContent,
            "ACTIVE TASKS",
            content,
          );
        }

        fs.writeFileSync(memoryPath, memoryContent);
        if (fs.existsSync(lockPath)) {
          const lockContent = fs.readFileSync(lockPath, "utf-8");
          if (lockContent.includes(lockOwner)) {
            fs.unlinkSync(lockPath);
          }
        }

        return {
          content: [
            { type: "text", text: `Section ${section} updated successfully.` },
          ],
        };
      } catch (error) {
        if (fs.existsSync(lockPath)) {
          const lockContent = fs.readFileSync(lockPath, "utf-8");
          if (lockContent.includes(lockOwner)) {
            fs.unlinkSync(lockPath);
          }
        }
        const message =
          error instanceof Error ? error.message : "Unknown error";
        return {
          content: [{ type: "text", text: `Memory update failed: ${message}` }],
        };
      }
    }

    case "verify_api_contract": {
      try {
        const sharedTypesDir = path.join(
          projectRoot,
          "packages/shared-types/src",
        );
        const contractJsonPath = path.join(
          projectRoot,
          "packages/shared-types/contract.version.json",
        );

        if (
          !fs.existsSync(sharedTypesDir) ||
          !fs.existsSync(contractJsonPath)
        ) {
          return {
            content: [
              {
                type: "text",
                text: "Missing shared-types directory or contract.version.json",
              },
            ],
          };
        }

        const files = collectFilesRecursively(sharedTypesDir, new Set(["ts"]));
        files.sort(); // Sort to ensure consistent hashing

        const hash = crypto.createHash("sha256");
        for (const file of files) {
          const fileContent = fs.readFileSync(file);
          hash.update(fileContent);
        }
        const currentHash = hash.digest("hex");

        const contractJson = JSON.parse(
          fs.readFileSync(contractJsonPath, "utf-8"),
        );
        const storedHash = contractJson.contract_hash;

        if (currentHash === storedHash) {
          return {
            content: [
              {
                type: "text",
                text: "✅ MATCH: Contract is valid and synchronized.",
              },
            ],
          };
        } else {
          return {
            content: [
              {
                type: "text",
                text: `❌ MISMATCH: Current hash (${currentHash.slice(0, 8)}...) does not match stored hash (${storedHash.slice(0, 8)}...). 
Contract is invalid or out of date!

**How to fix:**
1. Review changes in 'packages/shared-types/src/'.
2. Run the MCP tool 'update_contract_hash' or use CLI:
   \`npm run update-contract\` (if configured)`,
              },
            ],
          };
        }
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text:
                "Failed to verify contract: " +
                (error instanceof Error ? error.message : String(error)),
            },
          ],
        };
      }
    }

    case "update_contract_hash": {
      try {
        const sharedTypesDir = path.join(
          projectRoot,
          "packages/shared-types/src",
        );
        const contractJsonPath = path.join(
          projectRoot,
          "packages/shared-types/contract.version.json",
        );

        if (!fs.existsSync(sharedTypesDir)) {
          return {
            content: [{ type: "text", text: "Missing shared-types directory" }],
          };
        }

        const files = collectFilesRecursively(sharedTypesDir, new Set(["ts"]));
        if (files.length === 0) {
          return {
            content: [
              {
                type: "text",
                text: "⚠️ WARNING: No TypeScript files found in shared-types/src. Hash not updated.",
              },
            ],
          };
        }
        files.sort();

        const hash = crypto.createHash("sha256");
        for (const file of files) {
          const fileContent = fs.readFileSync(file);
          hash.update(fileContent);
        }
        const currentHash = hash.digest("hex");

        let contractJson: any = {};
        if (fs.existsSync(contractJsonPath)) {
          contractJson = JSON.parse(fs.readFileSync(contractJsonPath, "utf-8"));
        }
        contractJson.contract_hash = currentHash;
        contractJson.last_updated = new Date().toISOString();

        fs.writeFileSync(
          contractJsonPath,
          JSON.stringify(contractJson, null, 2),
        );

        return {
          content: [
            {
              type: "text",
              text: `SUCCESS: Contract hash updated to ${currentHash}`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text:
                "Failed to update contract hash: " +
                (error instanceof Error ? error.message : String(error)),
            },
          ],
        };
      }
    }

    case "log_agent_action": {
      const parsed = LOG_AGENT_ACTION_ARGS_SCHEMA.safeParse(args ?? {});
      if (!parsed.success) {
        return {
          content: [
            { type: "text", text: "Invalid arguments for log_agent_action." },
          ],
        };
      }

      try {
        const frameworkDir = getFrameworkDir(projectRoot);
        const logsDir = path.join(projectRoot, frameworkDir, "logs");
        if (!fs.existsSync(logsDir)) {
          fs.mkdirSync(logsDir, { recursive: true });
        }
 
        const logPath = path.join(logsDir, `${parsed.data.agent}.json`);
        let logs: any[] = [];

        if (fs.existsSync(logPath)) {
          try {
            logs = JSON.parse(fs.readFileSync(logPath, "utf-8"));
            if (!Array.isArray(logs)) logs = [];
          } catch {
            logs = [];
          }
        }

        const newEntry = {
          timestamp: new Date().toISOString(),
          ...parsed.data,
        };

        logs.push(newEntry);
        fs.writeFileSync(logPath, JSON.stringify(logs, null, 2));

        return {
          content: [
            {
              type: "text",
              text: `SUCCESS: Logged action to ${parsed.data.agent}.json`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text:
                "Failed to log action: " +
                (error instanceof Error ? error.message : String(error)),
            },
          ],
        };
      }
    }

    case "get_system_time": {
      return {
        content: [{ type: "text", text: new Date().toISOString() }],
      };
    }

    case "read_project_memory": {
      try {
        const frameworkDir = getFrameworkDir(projectRoot);
        const memoryPath = path.join(projectRoot, frameworkDir, "PROJECT_MEMORY.md");
        if (!fs.existsSync(memoryPath)) {
          return { content: [{ type: "text", text: `ERROR: ${frameworkDir}/PROJECT_MEMORY.md not found.` }] };
        }
        const content = fs.readFileSync(memoryPath, "utf-8");
        return { content: [{ type: "text", text: content }] };
      } catch (error) {
        return { content: [{ type: "text", text: "ERROR: Failed to read PROJECT_MEMORY.md" }] };
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
