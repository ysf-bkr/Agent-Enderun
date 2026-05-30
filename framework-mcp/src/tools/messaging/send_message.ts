import fs from "fs";
import path from "path";
import { resolveFrameworkDir } from "../../utils/security.js";
import { ToolArgs, ToolResult } from "../types.js";

export function handleSendAgentMessage(projectRoot: string, args: ToolArgs): ToolResult {
    const { to, category, content, traceId } = args as Required<Pick<ToolArgs, "to" | "category" | "content" | "traceId">>;
    const frameworkDir = resolveFrameworkDir(projectRoot);
    const agentName = to.replace("@", "");
    const messagePath = path.join(projectRoot, frameworkDir, "messages", `${agentName}.json`);

    const message = {
        timestamp: new Date().toISOString(),
        from: "@mcp",
        to,
        category,
        traceId,
        content,
        status: "PENDING"
    };

    fs.mkdirSync(path.dirname(messagePath), { recursive: true });
    fs.appendFileSync(messagePath, JSON.stringify(message) + "\n");

    return { content: [{ type: "text", text: `✅ Message sent to ${to}` }] };
}
