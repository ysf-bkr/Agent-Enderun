import { describe, it, expect } from 'vitest';
import { FRAMEWORK_VERSION } from '../src/utils.js';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Read the expected version dynamically from package.json — no more manual bumps
const pkg = JSON.parse(readFileSync(resolve(__dirname, '../package.json'), 'utf8'));

describe('MCP Server Integrity', () => {
    it('should report the correct framework version matching package.json', () => {
        expect(FRAMEWORK_VERSION).toBe(pkg.version);
    });

    it('should export a valid semantic version string', () => {
        expect(FRAMEWORK_VERSION).toMatch(/^\d+\.\d+\.\d+$/);
    });
});
