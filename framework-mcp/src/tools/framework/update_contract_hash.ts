import { safeExec } from "../../utils/cli.js";
import { ToolResult } from "../types.js";

export function handleUpdateContractHash(projectRoot: string): ToolResult {
    const output = safeExec("npx", ["agent-enderun", "update-contract"], projectRoot);
    return { content: [{ type: "text", text: output }] };
}
