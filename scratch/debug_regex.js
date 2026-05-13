function replaceSectionContent(markdown, sectionTitle, newBody) {
    const escaped = sectionTitle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const sectionRegex = new RegExp(`## ${escaped}[\\s\\S]*?(?=\\n## |$)`);
    console.log("Regex:", sectionRegex);
    console.log("Match:", markdown.match(sectionRegex)?.[0]);
    return markdown.replace(sectionRegex, `## ${sectionTitle}\n\n${newBody.trim()}\n`);
}

const mockMarkdown = `
# TITLE
## HISTORY
- Old item

## OTHER
Content
`;

const updated = replaceSectionContent(mockMarkdown, 'HISTORY', '- New item');
console.log("Updated:\n", updated);
console.log("Contains Old:", updated.includes('- Old item'));
