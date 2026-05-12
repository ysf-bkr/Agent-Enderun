# Repository Pattern Standards

## Purpose
Decouple the data access logic from the business logic. This ensures that changes in the database schema or ORM do not break the entire application.

## Principles
1. **Abstraction**: Use interfaces to define the repository contract.
2. **Implementation**: Use Kysely or preferred ORM for actual DB calls.
3. **Single Responsibility**: One repository per domain entity.
