import { codebaseTools, codebaseHandlers } from "./codebase.js";
import { frameworkTools, frameworkHandlers } from "./framework.js";
import { securityTools, securityHandlers } from "./security.js";
import { memoryTools, memoryHandlers } from "./memory.js";
import { contractTools, contractHandlers } from "./contract.js";
import { academyTools, academyHandlers } from "./academy.js";
import { messageTools, messageHandlers } from "./messages.js";
import { gitTools, gitHandlers } from "./git.js";
import { databaseTools, databaseHandlers } from "./database.js";
import { knowledgeTools, knowledgeHandlers } from "./knowledge.js";
import { repositoryTools, repositoryHandlers } from "./repository.js";

export const allTools = [
    ...codebaseTools,
    ...frameworkTools,
    ...securityTools,
    ...memoryTools,
    ...contractTools,
    ...academyTools,
    ...messageTools,
    ...gitTools,
    ...databaseTools,
    ...knowledgeTools,
    ...repositoryTools,
];

export const allHandlers: Record<string, (args: unknown, projectRoot: string) => Promise<unknown>> = {
    ...codebaseHandlers,
    ...frameworkHandlers,
    ...securityHandlers,
    ...memoryHandlers,
    ...contractHandlers,
    ...academyHandlers,
    ...messageHandlers,
    ...gitHandlers,
    ...databaseHandlers,
    ...knowledgeHandlers,
    ...repositoryHandlers,
};

// Add compatibility aliases
allHandlers.codebase_search = allHandlers.search_codebase;
allHandlers.codebase_graph_query = allHandlers.analyze_dependencies;
allHandlers.codebase_status = allHandlers.get_framework_status;
allHandlers.codebase_context_search = allHandlers.search_codebase; // Modified in original but search_codebase handles extension
