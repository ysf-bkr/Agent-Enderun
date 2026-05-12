import path from "path";
import fs from "fs";

export const FRAMEWORK_VERSION = "0.4.6";

export function getFrameworkDir(projectRoot: string): string {
    const adapters = [".gemini", ".claude", ".cursor", ".codex", ".enderun"];
    for (const adp of adapters) {
        const fullPath = path.join(projectRoot, adp);
        if (fs.existsSync(fullPath) && fs.lstatSync(fullPath).isDirectory()) {
            return adp;
        }
    }
    return ".enderun";
}

export function resolveSafePath(projectRoot: string, targetPath: string): string {
    const resolved = path.resolve(projectRoot, targetPath);
    const relative = path.relative(projectRoot, resolved);
    if (relative.startsWith("..") || path.isAbsolute(relative)) {
        throw new Error("Path escapes project root.");
    }
    return resolved;
}

export function collectFilesRecursively(targetPath: string, extensions: Set<string>): string[] {
    const results: string[] = [];
    const entries = fs.readdirSync(targetPath, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(targetPath, entry.name);
        if (entry.isDirectory()) {
            if (entry.name === "node_modules" || entry.name === ".git")
                continue;
            results.push(...collectFilesRecursively(fullPath, extensions));
            continue;
        }
        const ext = path.extname(entry.name).slice(1).toLowerCase();
        if (extensions.has(ext))
            results.push(fullPath);
    }
    return results;
}

export function buildLineMatches(files: string[], matcher: (line: string) => boolean, maxResults: number, projectRoot: string): string[] {
    const matches: string[] = [];
    for (const filePath of files) {
        if (matches.length >= maxResults)
            break;
        const content = fs.readFileSync(filePath, "utf-8");
        const lines = content.split("\n");
        for (let i = 0; i < lines.length; i++) {
            if (matches.length >= maxResults)
                break;
            const line = lines[i];
            if (!matcher(line))
                continue;
            const relativePath = path.relative(projectRoot, filePath);
            matches.push(`${relativePath}:${i + 1}:${line}`);
        }
    }
    return matches;
}

export function collectMarkdownArtifacts(projectRoot: string): string[] {
    const frameworkDir = getFrameworkDir(projectRoot);
    const searchPaths = [
        path.join(projectRoot, "docs"),
        path.join(projectRoot, frameworkDir, "docs")
    ];
    
    const results: string[] = [];
    for (const docsRoot of searchPaths) {
        if (fs.existsSync(docsRoot)) {
            results.push(...collectFilesRecursively(docsRoot, new Set(["md"])).map((filePath) => path.relative(projectRoot, filePath)));
        }
    }
    return Array.from(new Set(results));
}

export function replaceSectionContent(markdown: string, sectionTitle: string, newBody: string): string {
    const escaped = sectionTitle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const sectionRegex = new RegExp(`## ${escaped}[\\s\\S]*?(?=\\n## |$)`, "m");
    if (!sectionRegex.test(markdown)) {
        throw new Error(`Section not found: ${sectionTitle}`);
    }
    return markdown.replace(sectionRegex, `## ${sectionTitle}\n\n${newBody.trim()}\n`);
}

export function prependToSection(markdown: string, sectionTitle: string, contentToPrepend: string): string {
    const escaped = sectionTitle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const sectionRegex = new RegExp(`(## ${escaped}\\n)([\\s\\S]*?)(?=\\n## |$)`, "m");
    const match = markdown.match(sectionRegex);
    if (!match) {
        throw new Error(`Section not found: ${sectionTitle}`);
    }
    const currentBody = match[2].trimStart();
    const updatedBody = `${contentToPrepend.trim()}\n\n${currentBody}`.trim();
    return markdown.replace(sectionRegex, `$1\n${updatedBody}\n`);
}
