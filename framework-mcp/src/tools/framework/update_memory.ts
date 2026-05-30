import { safeExec } from "../../utils/cli.js";
import { ToolArgs, ToolResult } from "../types.js";

export function handleUpdateProjectMemory(projectRoot: string, args: ToolArgs): ToolResult {
    const section = args.section as string;
    const content = args.content as string;
    // Using execFileSync with array args prevents command injection
    safeExec("npx", ["agent-enderun", "update_project_memory", section, content], projectRoot);
    return { content: [{ type: "text", text: `✅ Section ${section} updated.` }] };
}
