import { TraceID, AgentID } from "./brands.js";
import { ActionType, ActionStatus } from "./constants.js";

/**
 * Audit & Agent Logging Types
 */
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
