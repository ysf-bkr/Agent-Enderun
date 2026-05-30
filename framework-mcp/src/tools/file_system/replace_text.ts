import fs from "fs";
import { safePath } from "../../utils/security.js";
import { ToolArgs, ToolResult } from "../types.js";

export function handleReplaceText(projectRoot: string, args: ToolArgs): ToolResult {
    const filePath = safePath(projectRoot, args.path as string);
    let content = fs.readFileSync(filePath, "utf8");
    const oldText = args.oldText as string;
    const newText = args.newText as string;

    if (!content.includes(oldText)) {
        throw new Error(`Text not found in file: ${oldText.slice(0, 100)}...`);
    }

    content = content.replace(oldText, newText);
    fs.writeFileSync(filePath, content);
    return { content: [{ type: "text", text: `✅ Surgical edit successful in ${args.path}` }] };
}
