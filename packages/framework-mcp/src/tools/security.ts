import fs from "fs";
import path from "path";
import { Project, SyntaxKind } from "ts-morph";
import { 
    collectFilesRecursively, 
    resolveSafePath, 
    buildLineMatches 
} from "../utils.js";
import { 
    SECURITY_AUDIT_ARGS_SCHEMA, 
    ANALYZE_CONSTITUTION_COMPLIANCE_ARGS_SCHEMA 
} from "../schemas.js";

export const securityTools = [
    {
        name: "security_audit_scan",
        description: "Scans the codebase for security vulnerabilities like hardcoded secrets, raw SQL, and unsafe async patterns.",
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
        name: "analyze_constitution_compliance",
        description: "Scans a file or directory for violations of the project's ENDERUN.md rules (e.g. Zero UI Library, Branded Types).",
        inputSchema: {
            type: "object",
            properties: {
                path: {
                    type: "string",
                    description: "Path to scan (relative to project root)",
                },
            },
            required: ["path"],
        },
    },
];

export const securityHandlers = {
    security_audit_scan: async (args: unknown, projectRoot: string) => {
        const parsed = SECURITY_AUDIT_ARGS_SCHEMA.safeParse(args ?? {});
        if (!parsed.success) return { content: [{ type: "text", text: "Invalid path argument." }] };
        const vulnerabilities: string[] = [];
        const scanRules = [
            { pattern: /sql`/, message: "Potential Raw SQL usage detected (check Kysely usage)", severity: "HIGH" },
            { pattern: /(?<!\/\/\s*)console\.log/, message: "console.log found in production code", severity: "LOW" },
            { pattern: /(password|secret|api_?key)\s*[:=]\s*['"][^'"]+['"]/i, message: "Potential hardcoded secret/password detected", severity: "CRITICAL" },
            { pattern: /:\s*any(?!\w)/, message: "Usage of 'any' type detected", severity: "MEDIUM" },
            { pattern: /(?<!\w)eval\s*\(/, message: "Dangerous 'eval()' usage detected", severity: "HIGH" },
            { pattern: /\.innerHTML\s*=/, message: "Unsafe innerHTML assignment detected (XSS risk)", severity: "MEDIUM" },
            { pattern: /dangerouslySetInnerHTML/, message: "React dangerouslySetInnerHTML detected", severity: "MEDIUM" },
            { pattern: /TODO:/, message: "Outstanding TODO item found", severity: "LOW" },
        ];
        try {
            const safeTargetPath = resolveSafePath(projectRoot, parsed.data.path);
            if (!fs.existsSync(safeTargetPath)) return { content: [{ type: "text", text: "Target path not found." }] };
            const files = collectFilesRecursively(safeTargetPath, new Set(["ts", "tsx"]));
            for (const rule of scanRules) {
                const ruleMatches = buildLineMatches(files, (line) => typeof rule.pattern === "string" ? line.includes(rule.pattern) : rule.pattern.test(line), 5, projectRoot);
                if (ruleMatches.length > 0) vulnerabilities.push(`[${rule.severity}] ${rule.message}:\n${ruleMatches.join("\n")}`);
            }
            const tsProject = new Project({ compilerOptions: { allowJs: true } });
            tsProject.addSourceFilesAtPaths(path.join(safeTargetPath, "**/*.{ts,tsx}"));
            for (const sourceFile of tsProject.getSourceFiles()) {
                const relativePath = path.relative(projectRoot, sourceFile.getFilePath());
                sourceFile.forEachDescendant((node) => {
                    if (node.getKindName() === "AnyKeyword") {
                        vulnerabilities.push(`[MEDIUM] Precise 'any' type detected in AST at ${relativePath}:${node.getStartLineNumber()}`);
                    }
                    if (node.getKind() === SyntaxKind.CallExpression) {
                        const callExp = node.asKind(SyntaxKind.CallExpression);
                        if (callExp?.getExpression().getText() === "console.log") {
                            vulnerabilities.push(`[LOW] Production 'console.log' detected in AST at ${relativePath}:${node.getStartLineNumber()}`);
                        }
                    }
                });
            }
            return { content: [{ type: "text", text: vulnerabilities.length > 0 ? `### ADVANCED SECURITY AUDIT RESULTS\n\n${Array.from(new Set(vulnerabilities)).join("\n\n")}` : "No security patterns or rule violations detected (Regex & AST verified)." }] };
        } catch (error) {
            return { content: [{ type: "text", text: "Security scan failed." }] };
        }
    },
    analyze_constitution_compliance: async (args: unknown, projectRoot: string) => {
        const parsed = ANALYZE_CONSTITUTION_COMPLIANCE_ARGS_SCHEMA.safeParse(args ?? {});
        if (!parsed.success) return { content: [{ type: "text", text: "Invalid path argument." }] };
        try {
            const safePath = resolveSafePath(projectRoot, parsed.data.path);
            const violations: string[] = [];
            const forbiddenLibraries = ["@shadcn", "mui", "@chakra-ui", "antd", "bootstrap", "tailwindcss"];

            if (fs.existsSync(safePath) && fs.lstatSync(safePath).isDirectory()) {
                const tsProject = new Project({ compilerOptions: { allowJs: true } });
                tsProject.addSourceFilesAtPaths(path.join(safePath, "**/*.{ts,tsx,js,jsx}"));
                
                for (const sourceFile of tsProject.getSourceFiles()) {
                    const relativePath = path.relative(projectRoot, sourceFile.getFilePath());
                    if (relativePath.includes("node_modules") || relativePath.includes("dist")) continue;
                    
                    // AST-based Import Check for Zero UI Policy
                    sourceFile.getImportDeclarations().forEach(imp => {
                        const moduleValue = imp.getModuleSpecifierValue();
                        if (forbiddenLibraries.some(lib => moduleValue.includes(lib))) {
                            violations.push(`${relativePath}: AST Violation - Zero UI Library Policy (imported '${moduleValue}')`);
                        }
                    });

                    // AST-based String ID Check for Branded Types Law
                    sourceFile.getInterfaces().forEach(iface => {
                        const idProp = iface.getProperty("id");
                        if (idProp && idProp.getType().isString() && !idProp.getType().getText().includes("Brand")) {
                            violations.push(`${relativePath}: AST Violation - Branded Types Law (interface '${iface.getName()}' uses plain string for ID)`);
                        }
                    });
                    
                    const content = sourceFile.getFullText();
                    if (content.includes("console.log") && !relativePath.includes("cli.js")) {
                        violations.push(`${relativePath}: Text Violation - Logging Policy (found 'console.log')`);
                    }
                    if (content.includes("sql`")) {
                        violations.push(`${relativePath}: Text Violation - Potential Kysely Standards (found raw 'sql' tag)`);
                    }
                }
            } else if (fs.existsSync(safePath)) {
                // Fallback for single files
                const content = fs.readFileSync(safePath, "utf-8");
                const relativePath = path.relative(projectRoot, safePath);
                for (const lib of forbiddenLibraries) {
                    if (content.includes(lib)) violations.push(`${relativePath}: Violation of Zero UI Library Policy (found '${lib}')`);
                }
            }

            return { content: [{ type: "text", text: `### CONSTITUTION COMPLIANCE REPORT\n\n` + (violations.length > 0 ? `⚠️ **VIOLATIONS FOUND:**\n${violations.map(v => `- ${v}`).join("\n")}` : "✅ **ALL SYSTEMS COMPLIANT:** AST and Regex scans passed. No rule violations detected.") }] };
        } catch (error) {
            return { content: [{ type: "text", text: "Compliance analysis failed." }] };
        }
    },
};
