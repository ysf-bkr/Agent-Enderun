import fs from "fs";
import path from "path";
import { Project } from "ts-morph";
import { 
    collectFilesRecursively, 
    resolveSafePath 
} from "../utils.js";
import { 
    SEARCH_CODEBASE_ARGS_SCHEMA, 
    ANALYZE_DEPENDENCIES_ARGS_SCHEMA,
    ANALYZE_CODEBASE_INTELLIGENCE_ARGS_SCHEMA,
    ANALYZE_PROCEDURAL_CONTINUITY_ARGS_SCHEMA,
    GENERATE_DEPENDENCY_GRAPH_ARGS_SCHEMA
} from "../schemas.js";

export const codebaseTools = [
    {
        name: "search_codebase",
        description: "Semantic search across the codebase using grep for exact matches and context. Ideal for finding logic and patterns.",
        inputSchema: {
            type: "object",
            properties: {
                query: {
                    type: "string",
                    description: "Search query or regex pattern",
                },
                extension: {
                    type: "string",
                    description: "File extension filter (e.g., ts, md)",
                    default: "ts",
                },
            },
            required: ["query"],
        },
    },
    {
        name: "codebase_search",
        description: "Compatibility alias for search_codebase. Use when older agent prompts still reference codebase_search.",
        inputSchema: {
            type: "object",
            properties: {
                query: {
                    type: "string",
                    description: "Search query or regex pattern",
                },
                extension: {
                    type: "string",
                    description: "File extension filter (e.g., ts, md)",
                    default: "ts",
                },
            },
            required: ["query"],
        },
    },
    {
        name: "analyze_dependencies",
        description: "Analyze code dependencies for a specific file or folder using import tracking.",
        inputSchema: {
            type: "object",
            properties: {
                path: {
                    type: "string",
                    description: "Path to analyze (relative to project root)",
                },
            },
            required: ["path"],
        },
    },
    {
        name: "codebase_graph_query",
        description: "Compatibility alias for analyze_dependencies. Returns import-level dependency information for a file or folder.",
        inputSchema: {
            type: "object",
            properties: {
                path: {
                    type: "string",
                    description: "Path to analyze (relative to project root)",
                },
            },
            required: ["path"],
        },
    },
    {
        name: "analyze_codebase_intelligence",
        description: "Scans the codebase for complexity spikes and potential dead code (exported but unused symbols).",
        inputSchema: {
            type: "object",
            properties: {
                path: {
                    type: "string",
                    description: "Path to scan (relative to project root)",
                    default: ".",
                },
            },
        },
    },
    {
        name: "analyze_procedural_continuity",
        description: "Compares a target file with a reference file to identify stylistic or structural deviations. Ensures agents follow existing patterns.",
        inputSchema: {
            type: "object",
            properties: {
                targetPath: {
                    type: "string",
                    description: "Path to the newly created/modified file",
                },
                referencePath: {
                    type: "string",
                    description: "Path to an existing 'gold standard' file for comparison",
                },
            },
            required: ["targetPath", "referencePath"],
        },
    },
    {
        name: "generate_dependency_graph",
        description: "Generates a Mermaid-compatible dependency graph of the codebase or a specific directory.",
        inputSchema: {
            type: "object",
            properties: {
                path: {
                    type: "string",
                    description: "Path to scan (relative to project root)",
                    default: "src",
                },
                format: {
                    type: "string",
                    enum: ["mermaid", "json"],
                    default: "mermaid",
                },
            },
        },
    },
];

export const codebaseHandlers = {
    search_codebase: async (args: unknown, projectRoot: string) => {
        const parsed = SEARCH_CODEBASE_ARGS_SCHEMA.safeParse(args);
        if (!parsed.success) {
            return { content: [{ type: "text", text: "Invalid query/extension argument." }] };
        }
        const { query, extension } = parsed.data;
        try {
            const files = collectFilesRecursively(projectRoot, new Set([extension]));
            let queryRegex: RegExp;
            try {
                queryRegex = new RegExp(query, "i");
            } catch (error) {
                return { content: [{ type: "text", text: "Invalid regex pattern in query." }] };
            }
            const matches: string[] = [];
            const MAX_RESULTS = 30;
            for (const filePath of files) {
                if (matches.length >= MAX_RESULTS) break;
                const content = fs.readFileSync(filePath, "utf-8");
                const lines = content.split("\n");
                for (let i = 0; i < lines.length; i++) {
                    if (matches.length >= MAX_RESULTS) break;
                    const line = lines[i];
                    if (queryRegex.test(line)) {
                        const relativePath = path.relative(projectRoot, filePath);
                        matches.push(`- ${relativePath}:${i + 1}: ${line.trim()}`);
                    }
                }
            }
            return { content: [{ type: "text", text: matches.join("\n") || "No matches found." }] };
        } catch (error) {
            return { content: [{ type: "text", text: "Search failed." }] };
        }
    },
    analyze_dependencies: async (args: unknown, projectRoot: string) => {
        const parsed = ANALYZE_DEPENDENCIES_ARGS_SCHEMA.safeParse(args);
        if (!parsed.success) {
            return { content: [{ type: "text", text: "Invalid path argument." }] };
        }
        const targetPath = parsed.data.path;
        try {
            const fullPath = resolveSafePath(projectRoot, targetPath);
            if (!fs.existsSync(fullPath)) return { content: [{ type: "text", text: `Path not found: ${targetPath}` }] };
            const stats = fs.statSync(fullPath);
            const tsProject = new Project({ compilerOptions: { allowJs: true } });
            if (stats.isDirectory()) {
                tsProject.addSourceFilesAtPaths(path.join(fullPath, "**/*.{ts,tsx,js,jsx}"));
                const sourceFiles = tsProject.getSourceFiles();
                return { content: [{ type: "text", text: `Directory contains ${sourceFiles.length} source files. Use a specific file path for deep dependency analysis.` }] };
            } else {
                const sourceFile = tsProject.addSourceFileAtPath(fullPath);
                const imports = sourceFile.getImportDeclarations();
                const importDetails = imports.map((imp) => {
                    const moduleSpecifier = imp.getModuleSpecifierValue();
                    const source = imp.getModuleSpecifierSourceFile();
                    const resolvedPath = source ? path.relative(projectRoot, source.getFilePath()) : "unresolved/external";
                    return `- ${moduleSpecifier} (${resolvedPath})`;
                });
                return { content: [{ type: "text", text: `Dependencies for ${targetPath}:\n${importDetails.length > 0 ? importDetails.join("\n") : "No imports found."}` }] };
            }
        } catch (error) {
            return { content: [{ type: "text", text: "Analysis failed: " + (error instanceof Error ? error.message : String(error)) }] };
        }
    },
    analyze_codebase_intelligence: async (args: unknown, projectRoot: string) => {
        const parsed = ANALYZE_CODEBASE_INTELLIGENCE_ARGS_SCHEMA.safeParse(args);
        const targetPath = parsed.success ? parsed.data.path : ".";
        try {
            const safeTargetPath = resolveSafePath(projectRoot, targetPath);
            if (!fs.existsSync(safeTargetPath)) return { content: [{ type: "text", text: "Target path not found." }] };
            const tsProject = new Project({ compilerOptions: { allowJs: true } });
            tsProject.addSourceFilesAtPaths(path.join(safeTargetPath, "**/*.{ts,tsx}"));
            const complexitySpikes: string[] = [];
            const potentialDeadCode: string[] = [];
            for (const sourceFile of tsProject.getSourceFiles()) {
                const relativePath = path.relative(projectRoot, sourceFile.getFilePath());
                const lineCount = sourceFile.getEndLineNumber();
                if (lineCount > 300) complexitySpikes.push(`${relativePath} (${lineCount} lines)`);
                sourceFile.getExportedDeclarations().forEach((declarations, name) => {
                    const isUsed = tsProject.getSourceFiles().some(sf => {
                        if (sf === sourceFile) return false;
                        return sf.getImportDeclarations().some(i => i.getModuleSpecifierValue().includes(sourceFile.getBaseNameWithoutExtension()) && i.getNamedImports().some(ni => ni.getName() === name));
                    });
                    if (!isUsed && !sourceFile.getFilePath().includes("index.ts") && !sourceFile.getFilePath().includes("shared-types")) {
                        potentialDeadCode.push(`${relativePath} -> ${name}`);
                    }
                });
            }
            return { content: [{ type: "text", text: `### CODEBASE INTELLIGENCE REPORT\n\n**Complexity Spikes (>300 lines):**\n${complexitySpikes.length > 0 ? complexitySpikes.map(s => `- ${s}`).join("\n") : "- None detected"}\n\n**Potential Dead Code (Unused Exports):**\n${potentialDeadCode.length > 0 ? potentialDeadCode.map(d => `- ${d}`).join("\n") : "- None detected (within scanned scope)"}` }] };
        } catch (error) {
            return { content: [{ type: "text", text: "Intelligence scan failed." }] };
        }
    },
    analyze_procedural_continuity: async (args: unknown, projectRoot: string) => {
        const parsed = ANALYZE_PROCEDURAL_CONTINUITY_ARGS_SCHEMA.safeParse(args);
        if (!parsed.success) return { content: [{ type: "text", text: "Invalid targetPath or referencePath." }] };
        try {
            const targetFull = resolveSafePath(projectRoot, parsed.data.targetPath);
            const referenceFull = resolveSafePath(projectRoot, parsed.data.referencePath);
            if (!fs.existsSync(targetFull) || !fs.existsSync(referenceFull)) return { content: [{ type: "text", text: "One or both files not found." }] };
            const tsProject = new Project({ compilerOptions: { allowJs: true } });
            const targetFile = tsProject.addSourceFileAtPath(targetFull);
            const referenceFile = tsProject.addSourceFileAtPath(referenceFull);
            const deviations: string[] = [];
            const targetImports = targetFile.getImportDeclarations().map(i => i.getModuleSpecifierValue());
            const referenceImports = referenceFile.getImportDeclarations().map(i => i.getModuleSpecifierValue());
            const missingImports = referenceImports.filter(i => !targetImports.includes(i) && !i.startsWith("."));
            if (missingImports.length > 0) deviations.push(`Missing standard imports found in reference: ${missingImports.join(", ")}`);
            if (referenceFile.getClasses().length > 0 && targetFile.getClasses().length === 0) deviations.push("Reference uses classes, but target does not.");
            const targetFunctions = targetFile.getFunctions().map(f => f.getName());
            const referenceFunctions = referenceFile.getFunctions().map(f => f.getName());
            if (referenceFunctions.some(f => f?.startsWith("get")) && !targetFunctions.some(f => f?.startsWith("get"))) deviations.push("Reference uses 'get' prefix for functions, target does not.");
            return { content: [{ type: "text", text: deviations.length > 0 ? `### PROCEDURAL CONTINUITY DEVIATIONS\n\n${deviations.map(d => `- ${d}`).join("\n")}` : "No major structural or stylistic deviations detected based on reference." }] };
        } catch (error) {
            return { content: [{ type: "text", text: "Continuity analysis failed." }] };
        }
    },
    generate_dependency_graph: async (args: unknown, projectRoot: string) => {
        const parsed = GENERATE_DEPENDENCY_GRAPH_ARGS_SCHEMA.safeParse(args);
        const targetPath = parsed.success ? parsed.data.path : "src";
        const format = parsed.success ? parsed.data.format : "mermaid";
        try {
            const safeTargetPath = resolveSafePath(projectRoot, targetPath);
            if (!fs.existsSync(safeTargetPath)) return { content: [{ type: "text", text: "Target path not found." }] };
            const tsProject = new Project({ compilerOptions: { allowJs: true } });
            tsProject.addSourceFilesAtPaths(path.join(safeTargetPath, "**/*.{ts,tsx}"));
            const edges: { from: string; to: string }[] = [];
            for (const sourceFile of tsProject.getSourceFiles()) {
                const from = sourceFile.getBaseNameWithoutExtension();
                sourceFile.getImportDeclarations().forEach(imp => {
                    const moduleSpecifier = imp.getModuleSpecifierValue();
                    if (moduleSpecifier.startsWith(".")) {
                        const to = path.basename(moduleSpecifier, path.extname(moduleSpecifier));
                        edges.push({ from, to });
                    }
                });
            }
            if (format === "json") return { content: [{ type: "text", text: JSON.stringify(edges, null, 2) }] };
            let mermaid = "graph TD\n";
            const uniqueEdges = Array.from(new Set(edges.map(e => `${e.from} --> ${e.to}`)));
            if (uniqueEdges.length === 0) return { content: [{ type: "text", text: "No internal dependencies found in the scanned path." }] };
            mermaid += uniqueEdges.join("\n");
            return { content: [{ type: "text", text: `### VISUAL ARCHITECTURE MAP: ${targetPath}\n\n\`\`\`mermaid\n${mermaid}\n\`\`\`\n\n**Total Nodes:** ${new Set(edges.flatMap(e => [e.from, e.to])).size} | **Total Edges:** ${uniqueEdges.length}` }] };
        } catch (error) {
            return { content: [{ type: "text", text: "Dependency graph generation failed." }] };
        }
    },
};
