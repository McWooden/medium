import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const articlesDirectory = path.join(process.cwd(), 'content/articles');

/**
 * Get all articles with front-matter.
 * @returns {Array}
 */
/**
 * Helper to extract metadata from body if missing
 */
function processMetadata(data, content, slug, fullPath) {
    const result = { ...data };
    let stats = null;

    try {
        if (fullPath && fs.existsSync(fullPath)) {
            stats = fs.statSync(fullPath);
        }
    } catch (e) {
        console.error(`Error reading stats for ${fullPath}:`, e);
    }

    // Split content into non-empty lines and paragraphs
    const lines = content.split('\n').filter(line => line.trim().length > 0);
    const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim().length > 0);

    // 1. Title: Front-matter or first line of body
    if (!result.title) {
        const firstLine = lines[0] || '';
        result.title = firstLine.replace(/^[#\s]+/, '').trim().slice(0, 100) || slug;
    }

    // 2. Timestamps: Front-matter or file system stats
    if (!result.created_at) {
        const fallbackDate = new Date().toISOString().split('T')[0];
        result.created_at = result.date || (stats ? stats.birthtime.toISOString().split('T')[0] : fallbackDate);
    }

    if (!result.updated_at) {
        result.updated_at = stats ? stats.mtime.toISOString().split('T')[0] : result.created_at;
    }

    // Alias date to created_at for backward compatibility
    result.date = result.created_at;

    // 3. Excerpt: Front-matter or first paragraph (skipping the title if it was the first paragraph)
    if (!result.excerpt) {
        // If the first paragraph is the title, take the second one
        let excerptSource = paragraphs[0];
        if (excerptSource && excerptSource.trim() === (lines[0] || '').trim() && paragraphs.length > 1) {
            excerptSource = paragraphs[1];
        }

        result.excerpt = excerptSource
            ? excerptSource.replace(/[#*`]/g, '').trim().slice(0, 160) + '...'
            : '';
    }

    // 4. Cover: Front-matter or first image in body
    if (!result.cover) {
        const imageMatch = content.match(/!\[.*?\]\((.*?)\)/);
        result.cover = imageMatch ? imageMatch[1] : null;
    }

    // 5. Author: Fallback
    if (!result.author) {
        result.author = "Admin";
    }

    return result;
}

/**
 * Get all articles with front-matter.
 * @returns {Array}
 */
export function getAllArticles() {
    const fileNames = fs.readdirSync(articlesDirectory);
    const allArticlesData = fileNames.map((fileName) => {
        const slug = fileName.replace(/\.md$/, '');
        const fullPath = path.join(articlesDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents);

        return {
            slug,
            ...processMetadata(data, content, slug, fullPath),
        };
    });

    return allArticlesData.sort((a, b) => {
        if (a.date < b.date) {
            return 1;
        } else {
            return -1;
        }
    });
}

/**
 * Get a single article by slug including rendered HTML.
 * @param {string} slug 
 * @returns {Promise}
 */
export async function getArticleData(slug) {
    const fullPath = path.join(articlesDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    const processedContent = await remark()
        .use(html)
        .process(content);
    const contentHtml = processedContent.toString();

    return {
        slug,
        contentHtml,
        ...processMetadata(data, content, slug, fullPath),
    };
}
