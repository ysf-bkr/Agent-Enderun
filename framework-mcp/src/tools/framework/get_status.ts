import { safeExec } from "../../utils/cli.js";
import { ToolResult } from "../types.js";

export function handleGetFrameworkStatus(projectRoot: string): ToolResult {
    const output = safeExec("npx", ["agent-enderun", "status"], projectRoot);
    return { content: [{ type: "text", text: output }] };
}
