# Performance Guidelines

## Frontend
- Use `React.memo` for expensive components.
- Minimize bundle size (target <150kb initial).
- Avoid layout shifts (CLS).

## Backend
- Use indexes for frequent queries.
- Optimize N+1 problems via joins.
- Use caching for static/rarely changed data.
