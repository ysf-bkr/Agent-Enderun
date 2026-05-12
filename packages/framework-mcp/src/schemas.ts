import { z } from "zod";

export const SECURITY_AUDIT_ARGS_SCHEMA = z.object({
    path: z.string().default("."),
});

export const SEARCH_CODEBASE_ARGS_SCHEMA = z.object({
    query: z.string().min(1).max(300),
    extension: z
        .string()
        .regex(/^[a-z0-9]+$/i)
        .default("ts"),
});

export const UPDATE_MEMORY_ARGS_SCHEMA = z.object({
    section: z.enum(["CURRENT STATUS", "HISTORY", "ACTIVE TASKS"]),
    content: z.string().min(1),
});

export const ANALYZE_DEPENDENCIES_ARGS_SCHEMA = z.object({
    path: z.string().min(1),
});

export const LOG_AGENT_ACTION_ARGS_SCHEMA = z.object({
    agent: z.string().min(1),
    action: z.string().min(1),
    requestId: z.string().min(1),
    files: z.array(z.string()).default([]),
    status: z.enum(["SUCCESS", "FAILURE"]),
    summary: z.string().min(1),
    details: z.record(z.any()).default({}),
});

export const SEND_AGENT_MESSAGE_ARGS_SCHEMA = z.object({
    to: z.string().min(1),
    message: z.string().min(1),
    traceId: z.string().min(1),
});

export const SEARCH_KNOWLEDGE_BASE_ARGS_SCHEMA = z.object({
    query: z.string().min(1),
});

export const UPDATE_KNOWLEDGE_BASE_ARGS_SCHEMA = z.object({
    topic: z.string().min(1),
    content: z.string().min(1),
});

export const ANALYZE_DATABASE_SCHEMA_ARGS_SCHEMA = z.object({
    path: z.string().default("apps/backend"),
});

export const GENERATE_STRATEGIC_BRIEFING_ARGS_SCHEMA = z.object({
    focusArea: z.string().optional(),
});

export const ANALYZE_CONSTITUTION_COMPLIANCE_ARGS_SCHEMA = z.object({
    path: z.string().min(1),
});

export const GENERATE_DEPENDENCY_GRAPH_ARGS_SCHEMA = z.object({
    path: z.string().default("src"),
    format: z.enum(["mermaid", "json"]).default("mermaid"),
});

export const GENERATE_ACADEMY_PROGRESS_REPORT_ARGS_SCHEMA = z.object({
    days: z.number().default(7),
});

export const ANALYZE_DOCUMENTATION_DEBT_ARGS_SCHEMA = z.object({
    path: z.string().default("."),
});

export const VALIDATE_REPOSITORY_HEALTH_ARGS_SCHEMA = z.object({
    scope: z.enum(["full", "lint", "test", "build"]).default("full"),
});

export const READ_AGENT_MESSAGES_ARGS_SCHEMA = z.object({
    agent: z.string().min(1),
});

export const VERIFY_CONTRACT_INTEGRITY_ARGS_SCHEMA = z.object({
    domain: z.string().min(1),
});

export const GENERATE_SEMANTIC_COMMIT_MESSAGE_ARGS_SCHEMA = z.object({
    traceId: z.string().min(1),
});

export const ANALYZE_CODEBASE_INTELLIGENCE_ARGS_SCHEMA = z.object({
    path: z.string().default("."),
});

export const GET_ACADEMY_PERFORMANCE_ARGS_SCHEMA = z.object({
    periodDays: z.number().default(30),
});

export const ANALYZE_PROCEDURAL_CONTINUITY_ARGS_SCHEMA = z.object({
    targetPath: z.string().min(1),
    referencePath: z.string().min(1),
});

export const GET_AGENT_AUDIT_REPORT_ARGS_SCHEMA = z.object({
    agent: z.string().min(1),
    days: z.number().default(7),
});
