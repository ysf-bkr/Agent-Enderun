import fs from "fs";
import path from "path";
import { getFrameworkDir } from "../utils.js";
import { 
    GET_ACADEMY_PERFORMANCE_ARGS_SCHEMA, 
    GENERATE_STRATEGIC_BRIEFING_ARGS_SCHEMA,
    GENERATE_ACADEMY_PROGRESS_REPORT_ARGS_SCHEMA,
    GET_AGENT_AUDIT_REPORT_ARGS_SCHEMA,
    LOG_AGENT_ACTION_ARGS_SCHEMA
} from "../schemas.js";

export const academyTools = [
    {
        name: "get_academy_performance",
        description: "Aggregates performance data from all agents to provide a global overview of the Academy's health and intelligence growth.",
        inputSchema: {
            type: "object",
            properties: {
                periodDays: {
                    type: "number",
                    description: "Number of days to include in the report",
                    default: 30,
                },
            },
        },
    },
    {
        name: "generate_strategic_briefing",
        description: "Generates a high-level strategic briefing for the user, summarizing Academy health, progress, and future strategy.",
        inputSchema: {
            type: "object",
            properties: {
                focusArea: {
                    type: "string",
                    description: "Optional area to focus on (e.g. 'quality', 'velocity', 'architecture')",
                },
            },
        },
    },
    {
        name: "generate_academy_progress_report",
        description: "Generates a comprehensive narrative report on the Academy's progress, milestones, and challenges.",
        inputSchema: {
            type: "object",
            properties: {
                days: {
                    type: "number",
                    description: "Number of days to include in the report",
                    default: 7,
                },
            },
        },
    },
    {
        name: "get_agent_audit_report",
        description: "Generates a summary report of an agent's activities based on their logs. Useful for self-improvement and progress tracking.",
        inputSchema: {
            type: "object",
            properties: {
                agent: {
                    type: "string",
                    description: "Agent name (e.g. analyst, backend)",
                },
                days: {
                    type: "number",
                    description: "Number of recent days to analyze",
                    default: 7,
                },
            },
            required: ["agent"],
        },
    },
    {
        name: "log_agent_action",
        description: "Safely append a structured log entry to the agent's log file.",
        inputSchema: {
            type: "object",
            properties: {
                agent: { type: "string", description: "Agent name" },
                action: { type: "string", description: "Action performed" },
                requestId: { type: "string", description: "Trace ID or Request ID" },
                files: { type: "array", items: { type: "string" }, description: "Files affected" },
                status: { type: "string", enum: ["SUCCESS", "FAILURE"], description: "Action status" },
                summary: { type: "string", description: "Short English summary" },
                details: { type: "object", description: "Additional details" },
            },
            required: ["agent", "action", "requestId", "status", "summary"],
        },
    },
];

interface AgentLog {
    timestamp: string;
    status: string;
    [key: string]: unknown;
}

export const academyHandlers = {
    get_academy_performance: async (args: unknown, projectRoot: string) => {
        const parsed = GET_ACADEMY_PERFORMANCE_ARGS_SCHEMA.safeParse(args ?? {});
        const days = parsed.success ? parsed.data.periodDays : 30;
        try {
            const frameworkDir = getFrameworkDir(projectRoot);
            const logsDir = path.join(projectRoot, frameworkDir, "logs");
            if (!fs.existsSync(logsDir)) return { content: [{ type: "text", text: "No logs found." }] };
            const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
            let totalActions = 0, totalSuccess = 0;
            const agentStats = fs.readdirSync(logsDir).filter(f => f.endsWith(".json")).map(file => {
                const logs = (JSON.parse(fs.readFileSync(path.join(logsDir, file), "utf-8")) as AgentLog[]).filter((l) => new Date(l.timestamp) >= cutoff);
                const success = logs.filter((l) => l.status === "SUCCESS").length;
                totalActions += logs.length; totalSuccess += success;
                return { agent: file.replace(".json", ""), actions: logs.length, successRate: (success / (logs.length || 1)) * 100 };
            }).filter(s => s.actions > 0);
            return { content: [{ type: "text", text: `### GLOBAL ACADEMY PERFORMANCE REPORT\n\n- **Analysis Period:** Last ${days} days\n- **Global Success Rate:** ${((totalSuccess / (totalActions || 1)) * 100).toFixed(1)}%\n\n**Agent Breakdown:**\n` + agentStats.map(s => `- **@${s.agent}:** ${s.actions} actions (${s.successRate.toFixed(1)}% success)`).join("\n") }] };
        } catch (error) {
            return { content: [{ type: "text", text: "Failed to generate global performance report." }] };
        }
    },
    generate_strategic_briefing: async (args: unknown, projectRoot: string) => {
        try {
            const frameworkDir = getFrameworkDir(projectRoot);
            const logsDir = path.join(projectRoot, frameworkDir, "logs");
            let totalActions = 0, successCount = 0;
            if (fs.existsSync(logsDir)) {
                fs.readdirSync(logsDir).filter(f => f.endsWith(".json")).forEach(file => {
                    const logs = JSON.parse(fs.readFileSync(path.join(logsDir, file), "utf-8")) as AgentLog[];
                    totalActions += logs.length; successCount += logs.filter((l) => l.status === "SUCCESS").length;
                });
            }
            const successRate = (successCount / (totalActions || 1)) * 100;
            return { content: [{ type: "text", text: `# 🏛️ ACADEMY STRATEGIC BRIEFING\n\n- **Academy Health:** ${successRate.toFixed(1)}% Success Rate over ${totalActions} actions.\n**Status:** READY FOR PHASE_1 COMPLETION.` }] };
        } catch (error) {
            return { content: [{ type: "text", text: "Strategic briefing generation failed." }] };
        }
    },
    generate_academy_progress_report: async (args: unknown, projectRoot: string) => {
        const parsed = GENERATE_ACADEMY_PROGRESS_REPORT_ARGS_SCHEMA.safeParse(args ?? {});
        const days = parsed.success ? parsed.data.days : 7;
        try {
            const frameworkDir = getFrameworkDir(projectRoot);
            const memoryPath = path.join(projectRoot, frameworkDir, "PROJECT_MEMORY.md");
            const memoryContent = fs.existsSync(memoryPath) ? fs.readFileSync(memoryPath, "utf-8") : "";
            const historySection = memoryContent.match(/## HISTORY[\s\S]*$/m)?.[0] ?? "";
            const milestones = Array.from(historySection.matchAll(/### (.*)\n\n- \*\*Agent:\*\* (.*)\n- \*\*Trace ID:\*\* (.*)\n- \*\*Action:\*\* (.*)/g)).slice(0, 5).map(m => `- [${m[1]}] **${m[2]}:** ${m[4]}`).join("\n");
            return { content: [{ type: "text", text: `# 🎓 AGENT ACADEMY PROGRESS REPORT\n\n## 🏆 Key Milestones Achieved\n${milestones}` }] };
        } catch (error) {
            return { content: [{ type: "text", text: "Failed to generate progress report." }] };
        }
    },
    get_agent_audit_report: async (args: unknown, projectRoot: string) => {
        const parsed = GET_AGENT_AUDIT_REPORT_ARGS_SCHEMA.safeParse(args ?? {});
        if (!parsed.success) return { content: [{ type: "text", text: "Invalid agent or days argument." }] };
        try {
            const frameworkDir = getFrameworkDir(projectRoot);
            const logPath = path.join(projectRoot, frameworkDir, "logs", `${parsed.data.agent}.json`);
            if (!fs.existsSync(logPath)) return { content: [{ type: "text", text: `No logs found for agent: ${parsed.data.agent}` }] };
            const cutoff = new Date(Date.now() - parsed.data.days * 24 * 60 * 60 * 1000);
            const logs = (JSON.parse(fs.readFileSync(logPath, "utf-8")) as AgentLog[]).filter((l) => new Date(l.timestamp) >= cutoff);
            const successCount = logs.filter((l) => l.status === "SUCCESS").length;
            return { content: [{ type: "text", text: `### AGENT AUDIT REPORT: ${parsed.data.agent.toUpperCase()}\n\n- **Total Actions:** ${logs.length}\n- **Success Rate:** ${((successCount / (logs.length || 1)) * 100).toFixed(1)}%` }] };
        } catch (error) {
            return { content: [{ type: "text", text: "Failed to generate audit report." }] };
        }
    },
    log_agent_action: async (args: unknown, projectRoot: string) => {
        const parsed = LOG_AGENT_ACTION_ARGS_SCHEMA.safeParse(args ?? {});
        if (!parsed.success) return { content: [{ type: "text", text: "Invalid arguments for log_agent_action." }] };
        try {
            const frameworkDir = getFrameworkDir(projectRoot);
            const logsDir = path.join(projectRoot, frameworkDir, "logs");
            if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });
            const logPath = path.join(logsDir, `${parsed.data.agent}.json`);
            let logs = fs.existsSync(logPath) ? JSON.parse(fs.readFileSync(logPath, "utf-8")) : [];
            if (!Array.isArray(logs)) logs = [];
            const requestId = parsed.data.requestId;
            if (requestId !== "—" && !/^[0-9A-Z]{26}$/.test(requestId)) return { content: [{ type: "text", text: "ERROR: requestId MUST be a 26-character ULID." }] };
            logs.push({ timestamp: new Date().toISOString(), ...parsed.data });
            fs.writeFileSync(logPath, JSON.stringify(logs, null, 2));
            return { content: [{ type: "text", text: `SUCCESS: Logged action to ${parsed.data.agent}.json` }] };
        } catch (error) {
            return { content: [{ type: "text", text: "Failed to log action." }] };
        }
    },
};
