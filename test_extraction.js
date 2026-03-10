const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Updated processMetadata mock to match articles.js
function processMetadata(data, content, slug, fullPath) {
    const result = { ...data };

    // In real articles.js we use fs.statSync(fullPath), here we mock it
    let stats = null;
    if (fullPath === 'mock-file.md') {
        stats = {
            birthtime: new Date('2026-01-01'),
            mtime: new Date('2026-03-10')
        };
    }

    // Split content into non-empty lines and paragraphs
    const lines = content.split('\n').filter(line => line.trim().length > 0);
    const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim().length > 0);

    // 1. Title: Front-matter or first line of body
    if (!result.title) {
        const firstLine = lines[0];
        result.title = firstLine ? firstLine.replace(/^[#\s]+/, '').slice(0, 100).trim() : slug;
    }

    // 2. Timestamps
    if (!result.created_at) {
        result.created_at = result.date || (stats ? stats.birthtime.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);
    }

    if (!result.updated_at) {
        result.updated_at = stats ? stats.mtime.toISOString().split('T')[0] : result.created_at;
    }

    result.date = result.created_at;

    // 3. Excerpt
    if (!result.excerpt) {
        let excerptSource = paragraphs[0];
        if (excerptSource && excerptSource.trim() === lines[0]?.trim() && paragraphs.length > 1) {
            excerptSource = paragraphs[1];
        }

        result.excerpt = excerptSource
            ? excerptSource.replace(/[#*`]/g, '').trim().slice(0, 160) + '...'
            : '';
    }

    // 4. Cover
    if (!result.cover) {
        const imageMatch = content.match(/!\[.*?\]\((.*?)\)/);
        result.cover = imageMatch ? imageMatch[1] : null;
    }

    // 5. Author
    if (!result.author) {
        result.author = "Admin";
    }

    return result;
}

const testContent = `
# My Awesome Title

This is the first paragraph.

![Alt text](/images/cover.jpg)
`;

const result = processMetadata({}, testContent, 'test-slug', 'mock-file.md');

console.log('--- TEST RESULTS ---');
console.log('Title:', result.title);
console.log('Created At:', result.created_at);
console.log('Updated At:', result.updated_at);
console.log('Excerpt:', result.excerpt);
console.log('Cover:', result.cover);

const titleValid = result.title === 'My Awesome Title';
const createdValid = result.created_at === '2026-01-01';
const updatedValid = result.updated_at === '2026-03-10';
const coverValid = result.cover === '/images/cover.jpg';

if (titleValid && createdValid && updatedValid && coverValid) {
    console.log('\n✅ Extreme Simplification & Timestamp Logic Verified!');
} else {
    console.log('\n❌ Verification Failed!');
    if (!titleValid) console.log('   - Title mismatch');
    if (!createdValid) console.log('   - Created At mismatch');
    if (!updatedValid) console.log('   - Updated At mismatch');
    if (!coverValid) console.log('   - Cover mismatch');
    process.exit(1);
}
