# Error Handling Strategy

1. **Centralized Catch**: All errors are caught at the controller level (Bubble-up strategy from Repository/Service).
2. **Resilience**: External API calls MUST use Exponential Backoff retry logic.
3. **Standard Format**: 
   ```json
   {
     "error": "ERR_CODE",
     "message": "Human readable",
     "traceId": "ULID"
   }
   ```
4. **Logging**: All errors must be logged with the associated Trace ID using a structured logger (no `console.log`).
