import { UserID, TraceID, AgentID } from "./brands.js";
import { ProjectPhase, ExecutionProfile, TaskPriority, TaskStatus } from "./constants.js";

/**
 * Base Entity Fields
 */
export interface BaseEntity {
  id: string; // Usually ULID
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

/**
 * Audit Log Model
 */
export interface AuditLog extends BaseEntity {
  entityName: string;
  entityId: string;
  action: "CREATE" | "UPDATE" | "DELETE" | "RESTORE";
  userId: UserID;
  previousState?: Record<string, unknown> | null;
  newState?: Record<string, unknown> | null;
  traceId: TraceID;
}

/**
 * User Model
 */
export interface User extends BaseEntity {
  id: UserID;
  email: string;
  fullName: string;
  role: "ADMIN" | "DEVELOPER" | "VIEWER";
}

export interface UserProfile extends User {
  avatarUrl?: string;
  bio?: string;
  preferences: Record<string, unknown>;
}

/**
 * Project Status
 */
export interface ProjectStatus {
  phase: ProjectPhase;
  profile: ExecutionProfile;
  lastUpdate: string;
  activeTraceId: TraceID | null;
  blockers: string[];
}

/**
 * Task Model
 */
export interface Task {
  id: TraceID;
  description: string;
  agent: AgentID;
  priority: TaskPriority;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}
