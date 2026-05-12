import fs from "fs";
import path from "path";
import { Project } from "ts-morph";
import { resolveSafePath } from "../utils.js";
import { ANALYZE_DATABASE_SCHEMA_ARGS_SCHEMA } from "../schemas.js";

export const databaseTools = [
    {
        name: "analyze_database_schema",
        description: "Scans the backend codebase (e.g., Kysely migrations or Prisma schemas) to extract and visualize the database schema as a Mermaid ER diagram.",
        inputSchema: {
            type: "object",
            properties: {
                path: { type: "string", description: "Path to scan for DB definitions", default: "apps/backend" },
            },
        },
    },
];

export const databaseHandlers = {
    analyze_database_schema: async (args: any, projectRoot: string) => {
        const parsed = ANALYZE_DATABASE_SCHEMA_ARGS_SCHEMA.safeParse(args ?? {});
        const targetPath = parsed.success ? parsed.data.path : "apps/backend";
        try {
            const safeTargetPath = resolveSafePath(projectRoot, targetPath);
            if (!fs.existsSync(safeTargetPath)) return { content: [{ type: "text", text: "Database path not found." }] };
            const tsProject = new Project();
            tsProject.addSourceFilesAtPaths(path.join(safeTargetPath, "**/*.{ts,tsx}"));
            let mermaid = "erDiagram\n", tablesFound = 0;
            for (const sourceFile of tsProject.getSourceFiles()) {
                const text = sourceFile.getFullText();
                const tableMatches = Array.from(text.matchAll(/\.createTable\(['"]([^'"]+)['"]\)/g));
                for (const match of tableMatches) {
                    const tableName = match[1]; tablesFound++;
                    mermaid += `  ${tableName} {\n`;
                    const colRegex = /\.addColumn\(['"]([^'"]+)['"]\s*,\s*['"]([^'"]+)['"]/g;
                    let colMatch; while ((colMatch = colRegex.exec(text)) !== null) {
                        mermaid += `    ${colMatch[2].replace(/[^a-zA-Z0-9]/g, '_')} ${colMatch[1]}\n`;
                    }
                    mermaid += `  }\n`;
                }
            }
            if (tablesFound === 0) return { content: [{ type: "text", text: "No database tables detected." }] };
            return { content: [{ type: "text", text: `### DATABASE SCHEMA MAP\n\n\`\`\`mermaid\n${mermaid}\n\`\`\`\n\n**Total Tables Detected:** ${tablesFound}` }] };
        } catch (error) {
            return { content: [{ type: "text", text: "Database schema analysis failed." }] };
        }
    },
};
