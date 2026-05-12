# Security Policy

## Supported Versions
Only the latest v0.3.x version is supported for security updates.

## Reporting a Vulnerability
Please report security vulnerabilities to security@ai-enderun.com.

## Security Standards
- All inputs are validated via Zod.
- No raw SQL tags allowed.
- Branded types are used for ID protection.
- **AST-Based Compliance:** All UI components and types are scanned via Abstract Syntax Tree parsing to prevent library injection and enforce the Zero UI policy.
