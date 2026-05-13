import { describe, it, expect, vi } from 'vitest';
import { securityHandlers } from '../src/tools/security.js';
import fs from 'fs';
import { Project } from 'ts-morph';

vi.mock('fs');
vi.mock('ts-morph', async (importOriginal) => {
    const actual = await importOriginal<typeof import('ts-morph')>();
    return {
        ...actual,
        Project: vi.fn().mockImplementation(() => ({
            addSourceFilesAtPaths: vi.fn(),
            getSourceFiles: vi.fn().mockReturnValue([]),
        })),
    };
});

describe('Security Tools - Constitution Compliance', () => {
    const projectRoot = '/root';

    it('should return compliance success if no violations found', async () => {
        vi.mocked(fs.existsSync).mockReturnValue(true);
        vi.mocked(fs.lstatSync).mockReturnValue({ isDirectory: () => true } as any);
        
        const result = await securityHandlers.analyze_constitution_compliance({ path: 'src' }, projectRoot);
        expect(result.content[0].text).toContain('ALL SYSTEMS COMPLIANT');
    });

    it('should detect library violations in single files', async () => {
        vi.mocked(fs.existsSync).mockReturnValue(true);
        vi.mocked(fs.lstatSync).mockReturnValue({ isDirectory: () => false } as any);
        vi.mocked(fs.readFileSync).mockReturnValue("import { Button } from 'antd';");
        
        const result = await securityHandlers.analyze_constitution_compliance({ path: 'src/App.tsx' }, projectRoot);
        expect(result.content[0].text).toContain('Violation of Zero UI Library Policy');
    });

    it('should fail if path escapes root', async () => {
        const result = await securityHandlers.analyze_constitution_compliance({ path: '../../etc' }, projectRoot);
        expect(result.content[0].text).toBe('Compliance analysis failed.');
    });
});
