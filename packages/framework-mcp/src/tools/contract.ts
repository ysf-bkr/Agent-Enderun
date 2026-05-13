import fs from "fs";
import path from "path";
import crypto from "crypto";
import { Project } from "ts-morph";
import { 
    getFrameworkDir, 
    collectFilesRecursively 
} from "../utils.js";
import { VERIFY_CONTRACT_INTEGRITY_ARGS_SCHEMA } from "../schemas.js";

export const contractTools = [
    {
        name: "verify_api_contract",
        description: "Verify if the shared-types match the stored contract hash in contract.version.json.",
        inputSchema: { type: "object", properties: {} },
    },
    {
        name: "update_contract_hash",
        description: "Generate a new hash for shared-types and update contract.version.json.",
        inputSchema: { type: "object", properties: {} },
    },
    {
        name: "verify_contract_integrity",
        description: "Deeply analyzes API documentation and shared types to ensure they are perfectly synchronized.",
        inputSchema: {
            type: "object",
            properties: {
                domain: {
                    type: "string",
                    description: "The API domain to verify (e.g. 'auth', 'user')",
                },
            },
            required: ["domain"],
        },
    },
];

export const contractHandlers = {
    verify_api_contract: async (args: unknown, projectRoot: string) => {
        try {
            const sharedTypesDir = path.join(projectRoot, "packages/shared-types/src");
            const contractJsonPath = path.join(projectRoot, "packages/shared-types/contract.version.json");
            if (!fs.existsSync(sharedTypesDir) || !fs.existsSync(contractJsonPath)) return { content: [{ type: "text", text: "Missing shared-types directory or contract.version.json" }] };
            const files = collectFilesRecursively(sharedTypesDir, new Set(["ts"])).sort();
            const hash = crypto.createHash("sha256");
            files.forEach(f => hash.update(fs.readFileSync(f)));
            const currentHash = hash.digest("hex");
            const storedHash = JSON.parse(fs.readFileSync(contractJsonPath, "utf-8")).contract_hash;
            return { content: [{ type: "text", text: currentHash === storedHash ? "✅ MATCH: Contract is valid and synchronized." : `❌ MISMATCH: Current hash (${currentHash.slice(0, 8)}...) does not match stored hash (${storedHash.slice(0, 8)}...).` }] };
        } catch (error) {
            return { content: [{ type: "text", text: "Failed to verify contract." }] };
        }
    },
    update_contract_hash: async (args: unknown, projectRoot: string) => {
        try {
            const sharedTypesDir = path.join(projectRoot, "packages/shared-types/src");
            const contractJsonPath = path.join(projectRoot, "packages/shared-types/contract.version.json");
            if (!fs.existsSync(sharedTypesDir)) return { content: [{ type: "text", text: "Missing shared-types directory" }] };
            const files = collectFilesRecursively(sharedTypesDir, new Set(["ts"])).sort();
            if (files.length === 0) return { content: [{ type: "text", text: "⚠️ WARNING: No TypeScript files found in shared-types/src. Hash not updated." }] };
            const hash = crypto.createHash("sha256");
            files.forEach(f => hash.update(fs.readFileSync(f)));
            const currentHash = hash.digest("hex");
            const contractJson = fs.existsSync(contractJsonPath) ? JSON.parse(fs.readFileSync(contractJsonPath, "utf-8")) : {};
            contractJson.contract_hash = currentHash;
            contractJson.last_updated = new Date().toISOString();
            fs.writeFileSync(contractJsonPath, JSON.stringify(contractJson, null, 2));
            return { content: [{ type: "text", text: `SUCCESS: Contract hash updated to ${currentHash}` }] };
        } catch (error) {
            return { content: [{ type: "text", text: "Failed to update contract hash." }] };
        }
    },
    verify_contract_integrity: async (args: unknown, projectRoot: string) => {
        const parsed = VERIFY_CONTRACT_INTEGRITY_ARGS_SCHEMA.safeParse(args ?? {});
        if (!parsed.success) return { content: [{ type: "text", text: "Invalid domain argument." }] };
        try {
            const frameworkDir = getFrameworkDir(projectRoot);
            const apiDocPath = path.join(projectRoot, frameworkDir, "docs/api", `${parsed.data.domain}.md`);
            const sharedTypesPath = path.join(projectRoot, "packages/shared-types/src/index.ts");
            if (!fs.existsSync(apiDocPath)) return { content: [{ type: "text", text: `API documentation not found for domain: ${parsed.data.domain}` }] };
            if (!fs.existsSync(sharedTypesPath)) return { content: [{ type: "text", text: "Shared types index.ts not found." }] };
            const sourceFile = new Project().addSourceFileAtPath(sharedTypesPath);
            const mentionedTypes = Array.from(fs.readFileSync(apiDocPath, "utf-8").matchAll(/`([^`]+)`/g)).map(m => m[1]).filter(t => /^[A-Z][a-zA-Z0-9]+(DTO|Response|Request|Status|Type)?$/.test(t));
            const uniqueTypes = Array.from(new Set(mentionedTypes));
            const missingTypes = uniqueTypes.filter(t => !sourceFile.getInterface(t) && !sourceFile.getTypeAlias(t) && !sourceFile.getEnum(t) && !sourceFile.getClass(t));
            return { content: [{ type: "text", text: `### CONTRACT INTEGRITY SHIELD: ${parsed.data.domain.toUpperCase()}\n\n` + `- **Missing/Undefined Types:** ${missingTypes.length > 0 ? `⚠️ ${missingTypes.join(", ")}` : "✅ All types synchronized"}\n\n` + `**Result:** ${missingTypes.length === 0 ? "PASSED" : "FAILED"}` }] };
        } catch (error) {
            return { content: [{ type: "text", text: "Contract verification failed." }] };
        }
    },
};
