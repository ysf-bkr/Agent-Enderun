import { TraceID } from "./brands.js";

/**
 * Project Phases
 */
export const PROJECT_PHASES = ["PHASE_0", "PHASE_1", "PHASE_2", "PHASE_3", "PHASE_4"] as const;
export type ProjectPhase = (typeof PROJECT_PHASES)[number];

/**
 * Execution Profiles
 */
export const EXECUTION_PROFILES = ["Lightweight", "Full"] as const;
export type ExecutionProfile = (typeof EXECUTION_PROFILES)[number];

/**
 * Task Priorities
 */
export const TASK_PRIORITIES = ["P0", "P1", "P2", "P3"] as const;
export type TaskPriority = (typeof TASK_PRIORITIES)[number];

/**
 * Task Statuses
 */
export const TASK_STATUSES = ["PENDING", "IN_PROGRESS", "BLOCKED", "COMPLETED", "FAILED"] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

/**
 * Action Types & Status
 */
export const ACTION_TYPES = ["CREATE", "MODIFY", "DELETE", "RESEARCH", "ORCHESTRATE"] as const;
export type ActionType = (typeof ACTION_TYPES)[number];

export const ACTION_STATUSES = ["SUCCESS", "FAILURE", "WAITING"] as const;
export type ActionStatus = (typeof ACTION_STATUSES)[number];
