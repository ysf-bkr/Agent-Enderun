# Async Error Handling & Resilience Pattern

## 1. The Golden Rule
Every asynchronous operation (Promises, `async/await`) MUST be wrapped in a `try/catch` block. Unhandled rejections are considered critical system failures.

## 2. Bubble-Up Strategy
Do not handle errors at the data access (Repository) layer unless translating a database-specific exception into a Domain Error.
- **Repository:** Throw domain-specific errors (e.g., `NotFoundError`, `ConflictError`).
- **Service:** Catch, add business context if needed, and re-throw.
- **Controller:** Catch all domain errors, log them, and map them to standard HTTP responses (4xx, 5xx) using the centralized error handler.

## 3. Resilience & Retry Logic
For external API calls (e.g., Stripe, Twilio, 3rd party webhooks), implement an exponential backoff retry mechanism. Do not fail on the first network timeout.
```typescript
async function fetchWithRetry(url: string, options: any, retries = 3, delay = 1000) {
  try {
    return await api.get(url, options);
  } catch (error) {
    if (retries === 0 || (error.response && error.response.status < 500)) throw error;
    await new Promise(res => setTimeout(res, delay));
    return fetchWithRetry(url, options, retries - 1, delay * 2);
  }
}
```

## 4. Centralized Logging
Never use `console.log`. All caught errors must be passed to a central structured logger (e.g., `pino` or `winston`) with the `traceId` for full observability.
