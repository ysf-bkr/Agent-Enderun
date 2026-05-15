import { describe, it, expect } from 'vitest';
import { FRAMEWORK_VERSION } from '../src/utils.js';

describe('MCP Server Integrity', () => {
    it('should report the correct framework version', () => {
        expect(FRAMEWORK_VERSION).toBe('0.5.1');
    });

    it('should export a valid semantic version string', () => {
        expect(FRAMEWORK_VERSION).toMatch(/^\d+\.\d+\.\d+$/);
    });
});
