import { TOOLS } from "./definitions.js";
import { handleReadFile } from "./file_system/read_file.js";
import { handleWriteFile } from "./file_system/write_file.js";
import { handleReplaceText } from "./file_system/replace_text.js";
import { handlePatchFile } from "./file_system/patch_file.js";
import { handleGetFrameworkStatus } from "./framework/get_status.js";
import { handleUpdateProjectMemory } from "./framework/update_memory.js";
import { handleOrchestrateLoop } from "./framework/orchestrate.js";
import { handleUpdateContractHash } from "./framework/update_contract_hash.js";
import { handleSendAgentMessage } from "./messaging/send_message.js";
import { handleLogAgentAction } from "./messaging/log_action.js";
import { ToolResult, ToolArgs } from "./types.js";

// Define a type for the tool handlers
export type ToolHandler = (projectRoot: string, args: ToolArgs) => ToolResult;

// Map of tool names to their handler functions
export const toolHandlers: Record<string, ToolHandler> = {
    read_file: handleReadFile,
    write_file: handleWriteFile,
    replace_text: handleReplaceText,
    patch_file: handlePatchFile,
    get_framework_status: handleGetFrameworkStatus,
    update_project_memory: handleUpdateProjectMemory,
    orchestrate_loop: handleOrchestrateLoop,
    send_agent_message: handleSendAgentMessage,
    log_agent_action: handleLogAgentAction,
    update_contract_hash: handleUpdateContractHash,
};

export { TOOLS };
