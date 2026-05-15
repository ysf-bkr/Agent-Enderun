import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { Project } from "ts-morph";
import { 
    resolveSafePath, 
    getFrameworkDir 
} from "../utils.js";
import { 
    VALIDATE_REPOSITORY_HEALTH_ARGS_SCHEMA, 
    ANALYZE_DOCUMENTATION_DEBT_ARGS_SCHEMA 
} from "../schemas.js";

export const repositoryTools = [
    {
        name: "validate_repository_health",
        description: "Runs project health checks (lint, test, build) before critical actions like commits.",
        inputSchema: {
            type: "object",
            properties: {
                scope: { type: "string", enum: ["full", "lint", "test", "build"], default: "full" },
            },
        },
    },
    {
        name: "analyze_documentation_debt",
        description: "Scans the codebase for missing documentation, including JSDoc, READMEs, and API contracts.",
        inputSchema: {
            type: "object",
            properties: {
                path: { type: "string", description: "Path to scan (relative to project root)", default: "." },
            },
        },
    },
];

export const repositoryHandlers = {
    validate_repository_health: async (args: unknown, projectRoot: string) => {
        const parsed = VALIDATE_REPOSITORY_HEALTH_ARGS_SCHEMA.safeParse(args ?? {});
        const scope = parsed.success ? parsed.data.scope : "full";
        try {
            const pkgPath = path.join(projectRoot, "package.json");
            if (!fs.existsSync(pkgPath)) return { content: [{ type: "text", text: "package.json not found." }] };
            const scripts = JSON.parse(fs.readFileSync(pkgPath, "utf-8")).scripts || {};
            const runScript = (name: string) => scripts[name] ? { name, status: (execSync(`npm run ${name}`, { stdio: "pipe", cwd: projectRoot }) ? "PASSED" : "FAILED") } : { name, status: "SKIPPED" };
            const results = [];
            if (scope === "full" || scope === "lint") results.push(runScript("lint"));
            if (scope === "full" || scope === "test") results.push(runScript("test"));
            if (scope === "full" || scope === "build") results.push(runScript("build"));
            return { content: [{ type: "text", text: `### REPOSITORY HEALTH REPORT\n\n` + results.map(r => `- **${r.name.toUpperCase()}:** ${r.status}`).join("\n") }] };
        } catch (error) {
            return { content: [{ type: "text", text: "Health validation failed." }] };
        }
    },
    analyze_documentation_debt: async (args: unknown, projectRoot: string) => {
        const parsed = ANALYZE_DOCUMENTATION_DEBT_ARGS_SCHEMA.safeParse(args ?? {});
        const targetPath = parsed.success ? parsed.data.path : ".";
        try {
            const safeTargetPath = resolveSafePath(projectRoot, targetPath);
            const tsProject = new Project();
            tsProject.addSourceFilesAtPaths(path.join(safeTargetPath, "**/*.{ts,tsx}"));
            const missingJSDoc: string[] = [];
            for (const sourceFile of tsProject.getSourceFiles()) {
                const relativePath = path.relative(projectRoot, sourceFile.getFilePath());
                if (relativePath.includes("node_modules") || relativePath.includes("dist")) continue;
                sourceFile.getExportedDeclarations().forEach((declarations, name) => {
                    declarations.forEach(decl => { 
                        const d = decl as unknown as { getJsDocs?: () => unknown[] };
                        if (typeof d.getJsDocs === "function" && d.getJsDocs().length === 0) {
                            missingJSDoc.push(`${relativePath} -> ${name}`);
                        }
                    });
                });
            }
            const majorDirs = ["apps/backend", "apps/web", "packages/shared-types", "packages/framework-mcp"], missingREADME = majorDirs.filter(dir => fs.existsSync(path.join(projectRoot, dir)) && !fs.existsSync(path.join(projectRoot, dir, "README.md")));
            return { content: [{ type: "text", text: `### DOCUMENTATION DEBT REPORT\n\n**Missing JSDoc:**\n${missingJSDoc.slice(0, 10).join("\n")}\n\n**Missing README.md:**\n${missingREADME.join("\n")}` }] };
        } catch (error) {
            return { content: [{ type: "text", text: "Documentation debt scan failed." }] };
        }
    },
};
