#!/usr/bin/env node

import { getPackageVersion } from "./utils/pkg.js";
import { initCommand } from "./commands/init.js";
import { checkCommand } from "./commands/check.js";
import { statusCommand } from "./commands/status.js";
import { traceNewCommand } from "./commands/trace.js";
import { updateProjectMemoryCommand } from "./commands/memory.js";
import { createAppCommand } from "./commands/app.js";
import { verifyApiContractCommand, updateApiContractCommand } from "./commands/contract.js";
import { orchestrateCommand } from "./commands/orchestrate.js";

/**
 * Main CLI entry point.
 */
async function main() {
    const args = process.argv.slice(2);
    const command = args[0];

    switch (command) {
    case "init":
        await initCommand(args[1]);
        break;

    case "check":
        checkCommand();
        break;

    case "status":
        statusCommand();
        break;

    case "trace:new": {
        const description = args[1] || "Default task";
        const agent = args[2] || "manager";
        const priority = args[3] || "P1";
        traceNewCommand(description, agent, priority);
        break;
    }

    case "update_project_memory": {
        const section = args[1];
        const content = args[2];
        if (!section || !content) {
            console.error("❌ Error: section and content are required.");
            process.exit(64);
        }
        updateProjectMemoryCommand(section, content);
        break;
    }

    case "create-app":
        await createAppCommand(args.slice(1));
        break;

    case "orchestrate":
    case "loop":
        orchestrateCommand();
        break;

    case "verify-contract":
        verifyApiContractCommand();
        break;

    case "update-contract":
        updateApiContractCommand();
        break;

    case "version":
    case "-v":
    case "--version":
        console.log(`v${getPackageVersion()}`);
        break;

    case "help":
    case "-h":
    case "--help":
    default:
        console.log(`
🤖 Agent Enderun CLI — Enterprise AI Orchestration

Usage:
  agent-enderun <command> [options]

Commands:
  init [adapter]      Initialize Agent Enderun framework (gemini, claude, grok, etc.)
  check               Perform an enterprise-grade system health check
  status              Show active phase, trace ID, and agent statuses
  trace:new <desc>    Start a new task chain with a unique Trace ID
  create-app <idea>   Generate a new full-stack app from natural language
  orchestrate         Start the dynamic Hermes agent orchestration loop
  verify-contract     Validate type alignment between backend and frontend
  update-contract     Generate and synchronize a new contract hash
  version             Show version information

Supported adapters (one init per IDE — separate folder each):
  - gemini       → .enderun/ (SSOT) + gemini.md
  - claude       → .enderun/ (SSOT) + claude.md
  - grok         → .enderun/ (SSOT) + grok.md
  - antigravity  → .enderun/ (SSOT) + agent.md

Example:
  agent-enderun init gemini
  agent-enderun check
  agent-enderun status
  agent-enderun trace:new "Auth module design" backend P1
      `);
        break;
    }
}

main().catch(console.error);
