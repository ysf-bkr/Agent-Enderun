import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { 
    getFrameworkDir, 
    collectMarkdownArtifacts, 
    FRAMEWORK_VERSION 
} from "../utils.js";
import { VERIFY_FRAMEWORK_HEALTH_ARGS_SCHEMA } from "../schemas.js";

export const frameworkTools = [
    {
        name: "get_framework_status",
        description: "Get the current status of the AI Agent Framework, including active phase and agent states.",
        inputSchema: { type: "object", properties: {} },
    },
    {
        name: "get_project_gaps",
        description: "Scans the project structure against the defined standards in ENDERUN.md and identifies missing files, folders, or documentation.",
        inputSchema: { type: "object", properties: {} },
    },
    {
        name: "codebase_status",
        description: "Compatibility alias for get_framework_status.",
        inputSchema: { type: "object", properties: {} },
    },
    {
        name: "get_memory_insights",
        description: "Analyze PROJECT_MEMORY.md and BRAIN_DASHBOARD.md to provide insights on what was done, what is being done, and the history.",
        inputSchema: { type: "object", properties: {} },
    },
    {
        name: "codebase_context",
        description: "Compatibility helper for non-code context discovery. Lists known markdown artifacts under docs/ and memory files.",
        inputSchema: { type: "object", properties: {} },
    },
    {
        name: "get_system_time",
        description: "Get the current system time in ISO-8601 format (UTC). Use this instead of Shell 'date' commands.",
        inputSchema: { type: "object", properties: {} },
    },
    {
        name: "bootstrap_legacy_memory",
        description: "Analyzes a pre-existing codebase to automatically generate the initial project memory, learning its tech stack and architecture.",
        inputSchema: { type: "object", properties: {} },
    },
    {
        name: "verify_framework_health",
        description: "Runs the framework's internal 'check' command and reports system health status via MCP.",
        inputSchema: {
            type: "object",
            properties: {
                detailed: { type: "boolean", default: false, description: "Include detailed issues if any." },
            },
        },
    },
];

export const frameworkHandlers = {
    bootstrap_legacy_memory: async (args: unknown, projectRoot: string) => {
        try {
            const frameworkDir = getFrameworkDir(projectRoot);
            const memoryPath = path.join(projectRoot, frameworkDir, "PROJECT_MEMORY.md");
            const pkgPath = path.join(projectRoot, "package.json");
            let techStack = "Unknown";
            if (fs.existsSync(pkgPath)) {
                const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
                const allDeps = Object.keys(pkg.dependencies || {}).concat(Object.keys(pkg.devDependencies || {}));
                const detected = [];
                if (allDeps.includes("react")) detected.push("React");
                if (allDeps.includes("next")) detected.push("Next.js");
                if (allDeps.includes("typescript")) detected.push("TypeScript");
                if (detected.length > 0) techStack = detected.join(", ");
            }
            const rootDirs = fs.readdirSync(projectRoot).filter(f => fs.lstatSync(path.join(projectRoot, f)).isDirectory() && !f.startsWith("."));
            const isMonorepo = rootDirs.includes("apps") || rootDirs.includes("packages");
            const date = new Date().toISOString().split("T")[0];
            const bootstrapContent = `# PROJECT MEMORY — Legacy Onboarding\n\n## CURRENT STATUS\n\n| Active Phase | Profile | Last Update | Active Trace ID | Blockers |\n| PHASE_1 | Full | ${date} | — | Legacy Onboarding |`;
            if (fs.existsSync(memoryPath)) fs.copyFileSync(memoryPath, memoryPath + ".bak");
            fs.writeFileSync(memoryPath, bootstrapContent);
            return { content: [{ type: "text", text: `Legacy Codebase Bootstrap complete. Detected Stack: ${techStack}.` }] };
        } catch (error) {
            return { content: [{ type: "text", text: "Failed to bootstrap legacy memory." }] };
        }
    },
    get_framework_status: async (args: unknown, projectRoot: string) => {
        try {
            const frameworkDir = getFrameworkDir(projectRoot);
            const memoryPath = path.join(projectRoot, frameworkDir, "PROJECT_MEMORY.md");
            const memoryContent = fs.readFileSync(memoryPath, "utf-8");
            const statusRowMatch = memoryContent.match(/\| Active Phase \| Profile \| Last Update \| Active Trace ID \| Blockers \|\n\| :----------- \| :------ \| :---------- \| :-------------- \| :------- \|\n\| ([^|]+) \| ([^|]+) \| ([^|]+) \| ([^|]+) \| ([^|]+) \|/);
            const phase = statusRowMatch?.[1]?.trim() ?? "UNKNOWN";
            const profile = statusRowMatch?.[2]?.trim() ?? "UNKNOWN";
            return {
                content: [{ type: "text", text: `Framework active (v${FRAMEWORK_VERSION}). Phase: ${phase}. Profile: ${profile}.` }],
            };
        } catch (error) {
            return { content: [{ type: "text", text: "Framework active. Memory unreadable." }] };
        }
    },
    get_project_gaps: async (args: unknown, projectRoot: string) => {
        const missing: string[] = [];
        const frameworkDir = getFrameworkDir(projectRoot);
        const checkPaths = [
            { path: "apps", type: "folder", optional: true },
            { path: "packages/shared-types/src", type: "folder" },
            { path: path.join(frameworkDir, "docs/api"), type: "folder", optional: true },
            { path: ".env", type: "file", optional: true },
            { path: ".env.example", type: "file" },
            { path: path.join(frameworkDir, "PROJECT_MEMORY.md"), type: "file" },
            { path: path.join(frameworkDir, "BRAIN_DASHBOARD.md"), type: "file" },
            { path: path.join(frameworkDir, "docs/tech-stack.md"), type: "file" },
            { path: path.join(frameworkDir, "docs/project-docs.md"), type: "file" },
        ];
        for (const item of checkPaths) {
            const fullPath = path.join(projectRoot, item.path);
            if (!fs.existsSync(fullPath) && !item.optional) {
                missing.push(`[MISSING ${item.type.toUpperCase()}] ${item.path}`);
            }
        }
        const agentsDir = path.join(projectRoot, frameworkDir, "agents");
        if (!fs.existsSync(agentsDir)) {
            missing.push(`[MISSING FOLDER] ${frameworkDir}/agents`);
        } else {
            const agents = fs.readdirSync(agentsDir).filter((f) => f.endsWith(".md")).map((f) => f.replace(".md", ""));
            const logsDir = path.join(projectRoot, frameworkDir, "logs");
            for (const agentName of agents) {
                const logFile = path.join(logsDir, `${agentName}.json`);
                if (!fs.existsSync(logFile)) {
                    missing.push(`[MISSING LOG FILE] ${frameworkDir}/logs/${agentName}.json (Expected for agent ${agentName})`);
                }
            }
        }
        return { content: [{ type: "text", text: missing.length > 0 ? `Detected Gaps:\n${missing.join("\n")}` : "No structural gaps detected based on core standards." }] };
    },
    get_memory_insights: async (args: unknown, projectRoot: string) => {
        try {
            const frameworkDir = getFrameworkDir(projectRoot);
            const memoryPath = path.join(projectRoot, frameworkDir, "PROJECT_MEMORY.md");
            const dashboardPath = path.join(projectRoot, frameworkDir, "BRAIN_DASHBOARD.md");
            const memory = fs.existsSync(memoryPath) ? fs.readFileSync(memoryPath, "utf-8") : "Memory file missing.";
            const dashboard = fs.existsSync(dashboardPath) ? fs.readFileSync(dashboardPath, "utf-8") : "Dashboard file missing.";
            const history = memory.split("## HISTORY")[1] || "No history found.";
            const activeTasks = memory.split("## ACTIVE TASKS")[1]?.split("##")[0] || "No active tasks.";
            const dashboardAgents = dashboard.split("## 📈 Visualizations")[0] || dashboard;
            return {
                content: [{ type: "text", text: `### LIVE MEMORY INSIGHTS\n\n**Active Tasks:**\n${activeTasks.trim()}\n\n**Recent History:**\n${history.trim().substring(0, 1000)}...\n\n**Brain Snapshot:**\n${dashboardAgents.trim().substring(0, 500)}...` }],
            };
        } catch (error) {
            return { content: [{ type: "text", text: "Failed to gather memory insights." }] };
        }
    },
    codebase_context: async (args: unknown, projectRoot: string) => {
        try {
            const artifacts = collectMarkdownArtifacts(projectRoot);
            const frameworkDir = getFrameworkDir(projectRoot);
            const memoryPath = path.join(projectRoot, frameworkDir, "PROJECT_MEMORY.md");
            const dashboardPath = path.join(projectRoot, frameworkDir, "BRAIN_DASHBOARD.md");
            return {
                content: [{ type: "text", text: "### CONTEXT ARTIFACTS\n\n" + `PROJECT_MEMORY: ${fs.existsSync(memoryPath) ? "present" : "missing"}\n` + `BRAIN_DASHBOARD: ${fs.existsSync(dashboardPath) ? "present" : "missing"}\n` + `Docs:\n${artifacts.length > 0 ? artifacts.join("\n") : "No markdown artifacts found."}` }],
            };
        } catch (error) {
            return { content: [{ type: "text", text: "Context discovery failed." }] };
        }
    },
    get_system_time: async () => {
        return { content: [{ type: "text", text: new Date().toISOString() }] };
    },
    verify_framework_health: async (args: unknown, projectRoot: string) => {
        const parsed = VERIFY_FRAMEWORK_HEALTH_ARGS_SCHEMA.safeParse(args ?? {});
        try {
            // Run the internal CLI check command via tsx to ensure we test current state
            // If the CLI is not yet linked, we might need a relative path
            const cliPath = path.join(projectRoot, "bin/cli.js");
            const output = execSync(`node ${cliPath} check`, { cwd: projectRoot, encoding: "utf-8", stdio: "pipe" });
            return { content: [{ type: "text", text: `### FRAMEWORK HEALTH CHECK\n\n${output}` }] };
        } catch (error: any) {
            return { content: [{ type: "text", text: `### FRAMEWORK HEALTH CHECK (FAILED)\n\n${error.stdout || error.message}` }] };
        }
    }
};
