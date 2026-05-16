/**
 * Agent Enderun — Shared Types
 * 
 * This file is the Single Source of Truth for all Backend and Frontend communication.
 * All IDs use the Branded Types pattern for type safety.
 */

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

/**
 * Domain Models
 */
export interface User {
  id: UserID;
  email: string;
  fullName: string;
  role: "ADMIN" | "DEVELOPER" | "VIEWER";
  createdAt: string;
}

export interface UserProfile extends User {
  avatarUrl?: string;
  bio?: string;
  preferences: Record<string, unknown>;
}

/**
 * Project Status Types
 */
export type ProjectPhase = "PHASE_0" | "PHASE_1" | "PHASE_2" | "PHASE_3" | "PHASE_4";
export type ExecutionProfile = "Lightweight" | "Full";

export interface ProjectStatus {
  phase: ProjectPhase;
  profile: ExecutionProfile;
  lastUpdate: string;
  activeTraceId: TraceID | null;
  blockers: string[];
}

/**
 * Task Management Types
 */
export type TaskPriority = "P0" | "P1" | "P2" | "P3";
export type TaskStatus = "PENDING" | "IN_PROGRESS" | "BLOCKED" | "COMPLETED" | "FAILED";

export interface Task {
  id: TraceID;
  description: string;
  agent: AgentID;
  priority: TaskPriority;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}

/**
 * Audit & Agent Logging Types
 */
export type ActionType = "CREATE" | "MODIFY" | "DELETE" | "RESEARCH" | "ORCHESTRATE";
export type ActionStatus = "SUCCESS" | "FAILURE" | "WAITING";

export interface AgentActionLog {
  timestamp: string;
  agent: AgentID;
  action: ActionType;
  requestId: TraceID | "—";
  status: ActionStatus;
  summary: string;
  files?: string[];
  details?: Record<string, unknown>;
}

/**
 * API Response Wrappers
 */
export interface ApiResponse<T> {
  data: T;
  meta?: {
    requestId: TraceID;
    timestamp: string;
  };
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}
