import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

// ESM-compatible __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// The framework source root (where bin/cli.js lives)
// tests/integration/ → ../../ → project root
const FRAMEWORK_ROOT = path.resolve(__dirname, '../..');
const CLI = path.join(FRAMEWORK_ROOT, 'bin/cli.js');

let testDir: string;

// ─── Setup: create a real temp dir and run the init command ───────────────────
// We set ENDERUN_SKIP_INSTALL=1 to skip the `npm install` step during init
// (this is only for testing — production installs always run npm install)
beforeAll(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'enderun-e2e-'));
    execSync(`node ${CLI} init gemini --yes`, {
        cwd: testDir,
        stdio: 'pipe',
        timeout: 90000,
        env: { ...process.env, ENDERUN_SKIP_INSTALL: '1' },
    });
});

afterAll(() => {
    // Clean up the temp dir
    if (testDir && fs.existsSync(testDir)) {
        fs.rmSync(testDir, { recursive: true, force: true });
    }
});

// ─── 1. Directory Structure ────────────────────────────────────────────────────
describe('1. Installation: Directory Structure', () => {
    const requiredDirs = [
        '.gemini',
        '.gemini/agents',
        '.gemini/knowledge',
        '.gemini/logs',
        '.gemini/messages',
        '.gemini/docs',
        '.gemini/docs/api',
        'packages/shared-types',
        'packages/framework-mcp',
    ];

    for (const dir of requiredDirs) {
        it(`should create directory: ${dir}`, () => {
            expect(fs.existsSync(path.join(testDir, dir))).toBe(true);
        });
    }
});

// ─── 2. Core File Presence ────────────────────────────────────────────────────
describe('2. Installation: Core Files', () => {
    const requiredFiles = [
        '.gemini/ENDERUN.md',
        '.gemini/PROJECT_MEMORY.md',
        '.gemini/STATUS.md',
        '.gemini/BRAIN_DASHBOARD.md',
        '.gemini/cli-commands.json',
        '.gemini/config.json',
        '.gemini/docs/tech-stack.md',
        'gemini.md',
        'gemini-extension.json',
        'mcp.json',
        '.env.example',
        'package.json',
        'tsconfig.json',
        'panda.config.ts',
    ];

    for (const file of requiredFiles) {
        it(`should create file: ${file}`, () => {
            expect(fs.existsSync(path.join(testDir, file))).toBe(true);
        });
    }
});

// ─── 3. Placeholder Replacement ───────────────────────────────────────────────
describe('3. Installation: Placeholder Replacement', () => {
    it('should replace {{FRAMEWORK_DIR}} with .gemini in gemini.md', () => {
        const content = fs.readFileSync(path.join(testDir, 'gemini.md'), 'utf-8');
        expect(content).not.toContain('{{FRAMEWORK_DIR}}');
        expect(content).toContain('.gemini/ENDERUN.md');
    });

    it('should replace {{FRAMEWORK_DIR}} in ENDERUN.md constitution', () => {
        const content = fs.readFileSync(path.join(testDir, '.gemini/ENDERUN.md'), 'utf-8');
        expect(content).not.toContain('{{FRAMEWORK_DIR}}');
        expect(content).toContain('.gemini/');
    });

    it('should replace {{ADAPTER}} in ENDERUN.md', () => {
        const content = fs.readFileSync(path.join(testDir, '.gemini/ENDERUN.md'), 'utf-8');
        expect(content).not.toContain('{{ADAPTER}}');
        expect(content).toContain('gemini.md');
    });

    it('should replace {{FRAMEWORK_DIR}} in gemini-extension.json', () => {
        const content = fs.readFileSync(path.join(testDir, 'gemini-extension.json'), 'utf-8');
        expect(content).not.toContain('{{FRAMEWORK_DIR}}');
        expect(content).toContain('.gemini/ENDERUN.md');
    });
});

// ─── 4. Agent Files ───────────────────────────────────────────────────────────
describe('4. Installation: Agent Definitions', () => {
    const agents = ['manager', 'backend', 'frontend', 'analyst', 'git', 'explorer'];

    for (const agent of agents) {
        it(`should install agent definition: ${agent}.md`, () => {
            expect(fs.existsSync(path.join(testDir, `.gemini/agents/${agent}.md`))).toBe(true);
        });
    }
});

// ─── 5. Knowledge Base ────────────────────────────────────────────────────────
describe('5. Installation: Knowledge Base', () => {
    it('should install knowledge base articles', () => {
        const kbDir = path.join(testDir, '.gemini/knowledge');
        const files = fs.readdirSync(kbDir).filter(f => f.endsWith('.md'));
        expect(files.length).toBeGreaterThan(10);
    });

    it('should install hermes_protocol.md in knowledge base', () => {
        expect(fs.existsSync(path.join(testDir, '.gemini/knowledge/hermes_protocol.md'))).toBe(true);
    });
});

// ─── 6. package.json Integrity ────────────────────────────────────────────────
describe('6. Installation: package.json Integrity', () => {
    let pkg: Record<string, any>;

    beforeAll(() => {
        pkg = JSON.parse(fs.readFileSync(path.join(testDir, 'package.json'), 'utf-8'));
    });

    it('should contain enderun scripts', () => {
        expect(pkg.scripts).toHaveProperty('enderun:build');
        expect(pkg.scripts).toHaveProperty('enderun:test');
        expect(pkg.scripts).toHaveProperty('enderun:check');
    });

    it('should have workspaces defined', () => {
        expect(pkg.workspaces).toContain('packages/*');
    });
});

// ─── 7. CLI Health Check ──────────────────────────────────────────────────────
describe('7. CLI: Health Check', () => {
    it('should detect the .gemini framework directory', () => {
        // Note: full `check` requires npm install + build (skipped in E2E test mode).
        // We verify the core scaffold is detectable instead.
        const constitutionExists = fs.existsSync(path.join(testDir, '.gemini/ENDERUN.md'));
        const memoryExists = fs.existsSync(path.join(testDir, '.gemini/PROJECT_MEMORY.md'));
        expect(constitutionExists).toBe(true);
        expect(memoryExists).toBe(true);
    });

    it('should run version check without errors', () => {
        const output = execSync(`node ${CLI} version`, {
            cwd: testDir,
            encoding: 'utf-8',
        });
        expect(output.trim()).toMatch(/^v\d+\.\d+\.\d+$/);
    });
});

// ─── 8. CLI Commands ──────────────────────────────────────────────────────────
describe('8. CLI: Core Commands', () => {
    it('should output version string', () => {
        const output = execSync(`node ${CLI} version`, {
            cwd: testDir,
            encoding: 'utf-8',
        });
        expect(output.trim()).toMatch(/^v\d+\.\d+\.\d+$/);
    });

    it('should generate a new trace ID', () => {
        const output = execSync(`node ${CLI} trace:new "E2E Test Trace"`, {
            cwd: testDir,
            encoding: 'utf-8',
        });
        expect(output).toContain('Trace ID');
        expect(output).toMatch(/[0-9A-Z]{26}/); // ULID format
    });
});
