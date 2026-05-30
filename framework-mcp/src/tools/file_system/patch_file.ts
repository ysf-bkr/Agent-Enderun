import fs from "fs";
import { safePath } from "../../utils/security.js";
import { ToolArgs, ToolResult } from "../types.js";

export function handlePatchFile(projectRoot: string, args: ToolArgs): ToolResult {
    const filePath = safePath(projectRoot, args.path as string);
    const lines = fs.readFileSync(filePath, "utf8").split("\n");
    const start = (args.startLine as number) - 1;
    const end = args.endLine as number;
    const newContent = (args.newContent as string).split("\n");

    if (start < 0 || start > lines.length) {
        throw new Error(`Invalid start line: ${start + 1}. File has ${lines.length} lines.`);
    }
    if (end < start + 1 || end > lines.length) {
        throw new Error(`Invalid end line: ${end}. Must be between ${start + 1} and ${lines.length}.`);
    }

    lines.splice(start, end - start, ...newContent);
    fs.writeFileSync(filePath, lines.join("\n"));
    return { content: [{ type: "text", text: `✅ File patched successfully: ${args.path}` }] };
}

