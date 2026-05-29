#!/usr/bin/env node
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const cliPath = join(__dirname, "../src/cli/index.ts");

// use shell: false to prevent argument (quote) corruption
const child = spawn("npx", ["tsx", cliPath, ...process.argv.slice(2)], {
    stdio: "inherit",
    shell: false 
});

child.on("exit", (code) => {
    process.exit(code ?? 0);
});
