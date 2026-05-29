# Logging & Audit Standard

- **No Console.log:** Production code MUST NOT use `console.log`, `console.warn`, or `console.error`. These are FORBIDDEN in the codebase.
- **Structured Logging:** All logging MUST go through the centralized `Logger` service (`apps/backend/src/services/logger.ts`). Logs must be produced in JSON format.
- **Traceability:** Every log entry MUST include the active `traceId` context to ensure cross-agent and cross-service traceability.
- **Audit Logging:** Every state-mutating operation (POST, PUT, PATCH, DELETE) MUST trigger an `AuditService.log()` call, linking the action to the responsible agent, Trace ID, and entity ID.
- **Log Persistence:** Logs must be persisted in an structured manner suitable for downstream ingestion by log management systems.
