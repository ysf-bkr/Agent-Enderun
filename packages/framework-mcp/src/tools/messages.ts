import fs from "fs";
import path from "path";
import { getFrameworkDir } from "../utils.js";
import { 
    SEND_AGENT_MESSAGE_ARGS_SCHEMA, 
    READ_AGENT_MESSAGES_ARGS_SCHEMA,
    GET_AGENT_INBOX_STATS_ARGS_SCHEMA
} from "../schemas.js";

export const messageTools = [
    {
        name: "send_agent_message",
        description: "Sends a message to another specialized agent following the Hermes Protocol.",
        inputSchema: {
            type: "object",
            properties: {
                to: { type: "string", description: "Recipient agent name" },
                message: { type: "string", description: "The message content" },
                traceId: { type: "string", description: "The active Trace ID" },
                category: { type: "string", enum: ["ACTION", "DELEGATION", "INFO", "ALERT"], default: "INFO" },
                priority: { type: "string", enum: ["LOW", "MEDIUM", "HIGH", "URGENT"], default: "MEDIUM" },
            },
            required: ["to", "message", "traceId"],
        },
    },
    {
        name: "read_agent_messages",
        description: "Reads messages sent to the current agent. Filters by Trace ID if provided.",
        inputSchema: {
            type: "object",
            properties: {
                agent: { type: "string", description: "Current agent name reading their messages" },
                traceId: { type: "string", description: "Optional Trace ID to filter messages" },
            },
            required: ["agent"],
        },
    },
    {
        name: "get_agent_inbox_stats",
        description: "Returns statistics about the agent's inbox (total, unread, priority distribution).",
        inputSchema: {
            type: "object",
            properties: {
                agent: { type: "string", description: "Agent name" },
            },
            required: ["agent"],
        },
    },
];

interface Message {
    timestamp: string;
    from: string;
    traceId: string;
    category: "ACTION" | "DELEGATION" | "INFO" | "ALERT";
    priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
    content: string;
    read: boolean;
}

function normalizeAgentName(agent: string): string | null {
    const normalized = agent.replace(/^@/, "").trim();
    return /^[a-z0-9_-]+$/i.test(normalized) ? normalized : null;
}

export const messageHandlers = {
    send_agent_message: async (args: unknown, projectRoot: string) => {
        const parsed = SEND_AGENT_MESSAGE_ARGS_SCHEMA.safeParse(args ?? {});
        if (!parsed.success) return { content: [{ type: "text", text: "Invalid message arguments." }] };
        try {
            const frameworkDir = getFrameworkDir(projectRoot);
            const recipient = normalizeAgentName(parsed.data.to);
            if (!recipient) return { content: [{ type: "text", text: "Invalid recipient agent name." }] };
            const messagesDir = path.join(projectRoot, frameworkDir, "messages");
            if (!fs.existsSync(messagesDir)) fs.mkdirSync(messagesDir, { recursive: true });
            const messagePath = path.join(messagesDir, `${recipient}.json`);
            const messages = (fs.existsSync(messagePath) ? JSON.parse(fs.readFileSync(messagePath, "utf-8")) : []) as Message[];
            messages.push({ 
                timestamp: new Date().toISOString(), 
                from: "manager", 
                traceId: parsed.data.traceId, 
                category: parsed.data.category,
                priority: parsed.data.priority,
                content: parsed.data.message, 
                read: false 
            });
            fs.writeFileSync(messagePath, JSON.stringify(messages, null, 2));
            return { content: [{ type: "text", text: `Hermes: Message sent to @${recipient} [${parsed.data.category} | ${parsed.data.priority}].` }] };
        } catch (error) {
            return { content: [{ type: "text", text: "Failed to send message via Hermes." }] };
        }
    },
    read_agent_messages: async (args: unknown, projectRoot: string) => {
        const parsed = READ_AGENT_MESSAGES_ARGS_SCHEMA.safeParse(args ?? {});
        if (!parsed.success) return { content: [{ type: "text", text: "Invalid agent name." }] };
        try {
            const frameworkDir = getFrameworkDir(projectRoot);
            const agentName = normalizeAgentName(parsed.data.agent);
            if (!agentName) return { content: [{ type: "text", text: "Invalid agent name." }] };
            const messagePath = path.join(projectRoot, frameworkDir, "messages", `${agentName}.json`);
            if (!fs.existsSync(messagePath)) return { content: [{ type: "text", text: "No messages found." }] };
            const messages = JSON.parse(fs.readFileSync(messagePath, "utf-8")) as Message[];
            const unread = messages.filter((m) => !m.read && (!parsed.data.traceId || m.traceId === parsed.data.traceId));
            
            fs.writeFileSync(messagePath, JSON.stringify(messages.map((m) => (
                !m.read && (!parsed.data.traceId || m.traceId === parsed.data.traceId) ? { ...m, read: true } : m
            )), null, 2));
            
            if (unread.length === 0) return { content: [{ type: "text", text: "No new messages." }] };
            
            const formatted = unread.map((m) => 
                `- [${m.priority}] **${m.from}** (${m.category}): ${m.content} *(Trace: ${m.traceId})*`
            ).join("\n");
            
            return { content: [{ type: "text", text: `### HERMES INBOX: @${agentName}\n\n${formatted}` }] };
        } catch (error) {
            return { content: [{ type: "text", text: "Failed to read messages." }] };
        }
    },
    get_agent_inbox_stats: async (args: unknown, projectRoot: string) => {
        const parsed = GET_AGENT_INBOX_STATS_ARGS_SCHEMA.safeParse(args ?? {});
        if (!parsed.success) return { content: [{ type: "text", text: "Invalid agent name." }] };
        try {
            const frameworkDir = getFrameworkDir(projectRoot);
            const agentName = normalizeAgentName(parsed.data.agent);
            if (!agentName) return { content: [{ type: "text", text: "Invalid agent name." }] };
            const messagePath = path.join(projectRoot, frameworkDir, "messages", `${agentName}.json`);
            if (!fs.existsSync(messagePath)) return { content: [{ type: "text", text: "Inbox empty." }] };
            const messages = JSON.parse(fs.readFileSync(messagePath, "utf-8")) as Message[];
            const unread = messages.filter(m => !m.read);
            
            const priorityDist = messages.reduce((acc, m) => {
                acc[m.priority] = (acc[m.priority] || 0) + 1;
                return acc;
            }, {} as Record<string, number>);

            return { 
                content: [{ 
                    type: "text", 
                    text: `### INBOX STATS: @${agentName}\n- Total: ${messages.length}\n- Unread: ${unread.length}\n- Priority Distribution: ${JSON.stringify(priorityDist)}` 
                }] 
            };
        } catch (error) {
            return { content: [{ type: "text", text: "Failed to get inbox stats." }] };
        }
    }
};
