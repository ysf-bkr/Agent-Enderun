# API Design Rules

1. **Versioned Routes**: All APIs must start with `/api/v1/`.
2. **Kebab-Case**: Use kebab-case for URL paths.
3. **Standard Responses**: Always wrap data in `{ data, traceId, timestamp }`.
4. **Method Discipline**: GET (read), POST (create), PUT (update), DELETE (remove).
