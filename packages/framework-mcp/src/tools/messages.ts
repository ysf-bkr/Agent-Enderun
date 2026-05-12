import fs from "fs";
import path from "path";
import { getFrameworkDir } from "../utils.js";
import { 
    SEND_AGENT_MESSAGE_ARGS_SCHEMA, 
    READ_AGENT_MESSAGES_ARGS_SCHEMA 
} from "../schemas.js";

export const messageTools = [
    {
        name: "send_agent_message",
        description: "Sends a message to another specialized agent. Useful for collaboration and delegation.",
        inputSchema: {
            type: "object",
            properties: {
                to: { type: "string", description: "Recipient agent name" },
                message: { type: "string", description: "The message content" },
                traceId: { type: "string", description: "The active Trace ID" },
            },
            required: ["to", "message", "traceId"],
        },
    },
    {
        name: "read_agent_messages",
        description: "Reads messages sent to the current agent.",
        inputSchema: {
            type: "object",
            properties: {
                agent: { type: "string", description: "Current agent name reading their messages" },
            },
            required: ["agent"],
        },
    },
];

export const messageHandlers = {
    send_agent_message: async (args: any, projectRoot: string) => {
        const parsed = SEND_AGENT_MESSAGE_ARGS_SCHEMA.safeParse(args ?? {});
        if (!parsed.success) return { content: [{ type: "text", text: "Invalid message arguments." }] };
        try {
            const frameworkDir = getFrameworkDir(projectRoot);
            const recipient = parsed.data.to.replace(/^@/, "");
            const messagesDir = path.join(projectRoot, frameworkDir, "messages");
            if (!fs.existsSync(messagesDir)) fs.mkdirSync(messagesDir, { recursive: true });
            const messagePath = path.join(messagesDir, `${recipient}.json`);
            let messages = fs.existsSync(messagePath) ? JSON.parse(fs.readFileSync(messagePath, "utf-8")) : [];
            messages.push({ timestamp: new Date().toISOString(), from: "manager", traceId: parsed.data.traceId, content: parsed.data.message, read: false });
            fs.writeFileSync(messagePath, JSON.stringify(messages, null, 2));
            return { content: [{ type: "text", text: `Message sent to @${recipient}.` }] };
        } catch (error) {
            return { content: [{ type: "text", text: "Failed to send message." }] };
        }
    },
    read_agent_messages: async (args: any, projectRoot: string) => {
        const parsed = READ_AGENT_MESSAGES_ARGS_SCHEMA.safeParse(args ?? {});
        if (!parsed.success) return { content: [{ type: "text", text: "Invalid agent name." }] };
        try {
            const frameworkDir = getFrameworkDir(projectRoot);
            const agentName = parsed.data.agent.replace(/^@/, "");
            const messagePath = path.join(projectRoot, frameworkDir, "messages", `${agentName}.json`);
            if (!fs.existsSync(messagePath)) return { content: [{ type: "text", text: "No messages found." }] };
            const messages = JSON.parse(fs.readFileSync(messagePath, "utf-8"));
            const unread = messages.filter((m: any) => !m.read);
            fs.writeFileSync(messagePath, JSON.stringify(messages.map((m: any) => ({ ...m, read: true })), null, 2));
            return { content: [{ type: "text", text: unread.length === 0 ? "No new messages." : `### INBOX: @${agentName}\n\n` + unread.map((m: any) => `- **From:** ${m.from}\n  **Message:** ${m.content}`).join("\n\n") }] };
        } catch (error) {
            return { content: [{ type: "text", text: "Failed to read messages." }] };
        }
    },
};
