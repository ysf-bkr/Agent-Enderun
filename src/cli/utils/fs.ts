import fs from "fs";
import path from "path";

import { remapFrameworkContent } from "../adapters.js"; // Import from the new adapters.js
import type { AdapterId } from "../adapters.js";

export function updateGitIgnore(targetPath: string, frameworkDir = ".gemini"): void {
    const IGNORE_LINES = [
        "# AI-Enderun",
        `${frameworkDir}/logs/*.json`,
        `${frameworkDir}/*.lock`,
        ".env",
        ".DS_Store",
    ];

    let content = "";
    if (fs.existsSync(targetPath)) {
        content = fs.readFileSync(targetPath, "utf8");
    }

    const lines = content.split("\n").map((l) => l.trim());
    let added = false;

    for (const line of IGNORE_LINES) {
        if (!lines.includes(line)) {
            content += (content.endsWith("\n") || content === "" ? "" : "\n") + line + "\n";
            added = true;
        }
    }

    if (added) {
        fs.writeFileSync(targetPath, content);
        console.warn("✅ .gitignore updated.");
    }
}

export function ensureDir(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

export function writeTextFile(filePath: string, content: string): void {
    ensureDir(path.dirname(filePath));
    // Use template literal for content handling to avoid issues with raw newlines
    fs.writeFileSync(filePath, content.endsWith("\n") ? content : `${content}\n`);
}

export function writeJsonFile(filePath: string, value: unknown): void {
    writeTextFile(filePath, JSON.stringify(value, null, 2));
}

interface SanitizeJsonFunction {
  (obj: any, targetScope?: string): any;
}

export function copyDir(
    src: string,
    dest: string,
    skipSet = new Set<string>(),
    nonDestructive = false,
    frameworkDir = ".gemini",
    targetScope = "",
    sanitizeJson: SanitizeJsonFunction,
    adapterId: AdapterId = "gemini",
): void {
    const DEFAULT_SKIP = new Set(["node_modules", ".git", ".DS_Store", "package-lock.json"]);
    const actualSkip = new Set([...DEFAULT_SKIP, ...skipSet]);

    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }

    fs.readdirSync(src, { withFileTypes: true }).forEach((entry) => {
        if (actualSkip.has(entry.name)) return;

        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            copyDir(
                srcPath,
                destPath,
                skipSet,
                nonDestructive,
                frameworkDir,
                targetScope,
                sanitizeJson,
                adapterId,
            );
        } else {
            if (nonDestructive && fs.existsSync(destPath)) {
                return;
            }

            const ext = path.extname(entry.name);
            const textExtensions = [".md", ".json", ".js", ".ts", ".txt", ""];

            if (textExtensions.includes(ext)) {
                let content = fs.readFileSync(srcPath, "utf8");
                content = remapFrameworkContent(content, frameworkDir, adapterId); // Use the new remap function

                if (ext === ".json") {
                    try {
                        const json = JSON.parse(content);
                        content = JSON.stringify(sanitizeJson(json, targetScope), null, 2);
                        content = remapFrameworkContent(content, frameworkDir, adapterId); // Remap again after JSON.stringify for any placeholders
                    } catch {
                        content = content.replace(/workspace:[^"'\s]*/g, "*");
                    }
                } else {
                    content = content.replace(/workspace:[^"'\s]*/g, "*");
                }

                fs.writeFileSync(destPath, content);
            } else {
                fs.copyFileSync(srcPath, destPath);
            }
        }
    });
}

export function collectFiles(dir: string, extensions: string[]): string[] {
    let results: string[] = [];
    if (!fs.existsSync(dir)) return results;
    const list = fs.readdirSync(dir);
    list.forEach((file) => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            if (!file.includes("node_modules") && !file.includes(".git")) {
                results = results.concat(collectFiles(file, extensions));
            }
        } else if (extensions.includes(path.extname(file))) {
            results.push(file);
        }
    });
    return results;
}
