# Database Migration Standards

- Use Kysely migrations for all schema changes.
- **Never** modify an existing migration file.
- Always include an `down` migration for rollback.
- Name files with timestamp: `20260511_create_users.ts`.
