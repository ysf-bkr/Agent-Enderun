# 📜 API Documentation Registry

This directory serves as the Single Source of Truth for all API endpoints and contracts.

## 📂 Directory Structure
- `auth.md`: Authentication & Authorization endpoints.
- `users.md`: User profile and management.
- `errors.md`: Standard error codes and troubleshooting.

## ⚖️ Rules of Engagement
1. **Contract-First**: Every document here MUST match the types in `packages/shared-types`.
2. **Versioning**: Major changes require a version bump in `contract.version.json`.
3. **Immutability**: Once a version is deployed, endpoints should not be modified without a migration path.
