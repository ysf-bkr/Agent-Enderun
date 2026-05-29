import fs from "fs";

import { updateMemoryForGeneratedApp, collectCreateAppDescription, inferAppSpec, createBackendFiles, createWebFiles, updateProjectDocs } from "../utils/app.js";
import { traceNewCommand } from "./trace.js";
import { getMemoryPath } from "../utils/memory.js";

/**
 * Generate a new application based on natural language input.
 */
export async function createAppCommand(args: string[]) {
    const description = await collectCreateAppDescription(args);
    const spec = inferAppSpec(description);

    console.warn(`🚀 Generating Enterprise App: ${spec.title}...`);

    createBackendFiles(spec);
    createWebFiles(spec);
    updateProjectDocs(spec);

    const memoryPath = getMemoryPath();
    let traceId = "01HGT8J5E2N0W0W0W0W0W0W0W0"; // default fallback

    if (fs.existsSync(memoryPath)) {
        const memory = fs.readFileSync(memoryPath, "utf8");
        const match = memory.match(/- Trace ID: (.*)/);
        if (match) traceId = match[1].trim();
    }

    const activeTraceId = traceNewCommand(`Generate ${spec.title} from natural language request`, "manager", "P1") || traceId;
    updateMemoryForGeneratedApp(spec, activeTraceId);

    console.warn("\n✨ Application scaffolded successfully!");
    console.warn("📜 Updated project docs and app-local types contract");
    console.warn("\nNext commands:");
    console.warn("  npm install");
    console.warn("  npm run enderun:build");
    console.warn("  agent-enderun frontend:dev\n");
}
