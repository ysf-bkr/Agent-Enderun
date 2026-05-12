# Security Scanning Standards

## Rules
1. **No Raw SQL**: Always use Kysely query builder to prevent SQL injection.
2. **Secrets Management**: Never hardcode API keys or passwords. Use `.env` files.
3. **Audit**: Run `agent-enderun check:security` before every PR.
