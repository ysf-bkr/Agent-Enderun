import fs from "fs";
import path from "path";
import { safePath } from "../../utils/security.js";
import { ToolArgs, ToolResult } from "../types.js";

export function handleWriteFile(projectRoot: string, args: ToolArgs): ToolResult {
    const filePath = safePath(projectRoot, args.path as string);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, args.content as string);
    return { content: [{ type: "text", text: `✅ File written: ${args.path}` }] };
}
