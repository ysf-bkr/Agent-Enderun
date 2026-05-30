import fs from "fs";
import { safePath } from "../../utils/security.js";
import { ToolArgs, ToolResult } from "../types.js";

export function handleReadFile(projectRoot: string, args: ToolArgs): ToolResult {
    const filePath = safePath(projectRoot, args.path as string);
    const content = fs.readFileSync(filePath, "utf8");
    return { content: [{ type: "text", text: content }] };
}
