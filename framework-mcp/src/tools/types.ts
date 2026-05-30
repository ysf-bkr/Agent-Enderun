export interface ToolDefinition {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: Record<string, { type: string; description?: string; enum?: string[] }>;
        required?: string[];
    };
}

export interface CallToolRequest {
    params: {
        name: string;
        arguments?: ToolArgs;
    };
}

export interface ToolArgs {
    path?: string;
    content?: string;
    oldText?: string;
    newText?: string;
    startLine?: number;
    endLine?: number;
    newContent?: string;
    section?: string;
    to?: string;
    category?: "ACTION" | "DELEGATION" | "INFO" | "ALERT";
    traceId?: string;
    agent?: string;
    action?: string;
    status?: "SUCCESS" | "FAILURE";
    summary?: string;
    findings?: string;
}

export interface ToolResult {
    isError?: boolean;
    content: Array<{ type: "text"; text: string }>;
}
