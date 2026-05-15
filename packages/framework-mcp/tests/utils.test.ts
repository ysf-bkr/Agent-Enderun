import { describe, it, expect, vi } from 'vitest';
import { 
    getFrameworkDir, 
    resolveSafePath, 
    replaceSectionContent, 
    prependToSection 
} from '../src/utils.js';
import fs from 'fs';
import path from 'path';

vi.mock('fs');

describe('Framework Utilities', () => {
    describe('getFrameworkDir', () => {
        it('should detect .gemini adapter if it exists', () => {
            vi.mocked(fs.existsSync).mockImplementation((p: unknown) => (p as string).endsWith('.gemini'));
            vi.mocked(fs.lstatSync).mockReturnValue({ isDirectory: () => true } as unknown as fs.Stats);
            
            const dir = getFrameworkDir('/root');
            expect(dir).toBe('.gemini');
        });

        it('should fallback to .enderun if no specific adapter found', () => {
            vi.mocked(fs.existsSync).mockReturnValue(false);
            const dir = getFrameworkDir('/root');
            expect(dir).toBe('.enderun');
        });
    });

    describe('resolveSafePath', () => {
        it('should resolve paths within project root', () => {
            const root = '/Users/user/project';
            const safe = resolveSafePath(root, 'docs/tech-stack.md');
            expect(safe).toBe(path.resolve(root, 'docs/tech-stack.md'));
        });

        it('should throw error if path escapes root', () => {
            const root = '/Users/user/project';
            expect(() => resolveSafePath(root, '../../etc/passwd')).toThrow('Path escapes project root.');
        });
    });

    describe('Markdown Section Manipulation', () => {
        const mockMarkdown = `
# TITLE
## HISTORY
- Old item

## OTHER
Content
`;

        it('should replace section content correctly', () => {
            const updated = replaceSectionContent(mockMarkdown, 'HISTORY', '- New item');
            expect(updated).toContain('## HISTORY\n\n- New item\n');
            expect(updated).not.toContain('- Old item');
        });

        it('should prepend to section correctly', () => {
            const updated = prependToSection(mockMarkdown, 'HISTORY', '- Prepend item');
            expect(updated).toContain('- Prepend item\n\n- Old item');
        });

        it('should throw error if section not found', () => {
            expect(() => replaceSectionContent(mockMarkdown, 'NON_EXISTENT', '...')).toThrow();
        });
    });
});
