# Legacy Onboarding Strategy

When ingesting a legacy codebase:
1. Run `agent-enderun explorer:graph` to map the architecture.
2. Identify "Hot Spots" via `explorer:audit`.
3. Wrap core modules in tests before refactoring.
4. Gradually introduce Branded Types.
