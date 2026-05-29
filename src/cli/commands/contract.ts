import path from "path";
import fs from "fs";
import crypto from "crypto";
import { getConfiguredPaths } from "../utils/memory.js";

/**
 * Verify type safety between backend and frontend contracts.
 */
export function verifyApiContractCommand() {
    const projectRoot = process.cwd();
    const pathsMap = getConfiguredPaths();
    const sharedDir = path.join(projectRoot, pathsMap.backend, "src/types");
    const contractPath = path.join(projectRoot, pathsMap.backend, "contract.version.json");

    if (!fs.existsSync(sharedDir) || !fs.existsSync(contractPath)) {
        console.error("❌ Error: API types or contract version file missing.");
        return;
    }

    const walk = (d: string): string[] => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => {
        const fullPath = path.join(d, e.name);
        return e.isDirectory() ? walk(fullPath) : (e.name.endsWith(".ts") ? [fullPath] : []);
    });

    const hash = crypto.createHash("sha256");
    for (const filePath of walk(sharedDir).sort()) {
        hash.update(path.relative(projectRoot, filePath));
        hash.update("\0");
        hash.update(fs.readFileSync(filePath));
        hash.update("\0");
    }

    const currentHash = hash.digest("hex");
    const contract = JSON.parse(fs.readFileSync(contractPath, "utf8"));

    if (contract.contract_hash === currentHash) {
        console.warn("✅ Contract is valid and synchronized.");
    } else {
        console.error("❌ Error: Contract drift detected!");
        console.error(`   Stored: ${contract.contract_hash}`);
        console.error(`   Actual: ${currentHash}`);
        console.warn("\n👉 Run 'npm run update-contract' to re-sync.");
        process.exit(1);
    }
}
