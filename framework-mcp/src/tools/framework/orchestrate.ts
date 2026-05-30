import { safeExec } from "../../utils/cli.js";
import { ToolResult } from "../types.js";

export function handleOrchestrateLoop(projectRoot: string): ToolResult {
    const output = safeExec("npx", ["agent-enderun", "orchestrate"], projectRoot);
    return { content: [{ type: "text", text: output }] };
}
