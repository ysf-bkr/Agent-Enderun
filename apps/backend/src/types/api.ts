import { TraceID } from "./brands.js";

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
