import { execSync } from "child_process";

import { getPackageVersion } from "../utils/pkg.js";

const FRAMEWORK_VERSION = getPackageVersion();

/**
 * Run ESLint for the project (same as npm run lint).
 */
export function lintCommand(): void {
    console.warn(`🔍 Running ESLint (v${FRAMEWORK_VERSION})...`);
    const projectRoot = process.cwd();
    try {
        execSync("npm run lint", {
            cwd: projectRoot,
            stdio: "inherit",
            env: process.env,
        });
        console.warn("\n✅ ESLint passed with no errors.");
    } catch {
        console.warn("\n❌ ESLint reported errors. Fix violations before committing.");
        console.warn("   Tip: npm run lint -- --fix");
        process.exit(1);
    }
}
