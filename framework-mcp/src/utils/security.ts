import path from "path";
import fs from "fs";

/**
 * Validates and resolves a user-provided path to prevent path traversal attacks.
 * Ensures the resolved path stays within the project root boundary.
 */
export function safePath(projectRoot: string, userPath: string): string {
    const resolved = path.resolve(projectRoot, userPath);
    const normalizedRoot = path.resolve(projectRoot);

    if (!resolved.startsWith(normalizedRoot + path.sep) && resolved !== normalizedRoot) {
        throw new Error(`Access denied: path "${userPath}" escapes project root.`);
    }

    return resolved;
}

/**
 * Resolves the active framework directory by scanning known candidates.
 */
export function resolveFrameworkDir(projectRoot: string): string {
    const candidates = [
        ".gemini/antigravity",
        ".gemini/antigravity-cli",
        ".gemini",
        ".claude",
        ".grok",
        ".agent",
        ".enderun",
    ];

    for (const candidate of candidates) {
        const candidatePath = path.join(projectRoot, candidate);
        if (fs.existsSync(candidatePath)) {
            return candidate;
        }
    }

    return ".enderun";
}
