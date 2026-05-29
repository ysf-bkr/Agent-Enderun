/**
 * Branded Type Utility
 */
export type Brand<K, T> = K & { __brand: T };

/**
 * Entity IDs (Branded)
 */
export type TraceID = Brand<string, "TraceID">;
export type AgentID = Brand<string, "AgentID">;
export type ProjectID = Brand<string, "ProjectID">;
export type UserID = Brand<string, "UserID">;
