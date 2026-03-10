import { getArticleData, getAllArticles } from '@/lib/articles';
import Link from 'next/link';

export async function generateStaticParams() {
    const articles = getAllArticles();
    return articles.map((article) => ({
        slug: article.slug,
    }));
}

export default async function ArticlePage({ params }) {
    const { slug } = await params;
    const article = await getArticleData(slug);

    return (
        <div className="max-w-3xl mx-auto px-4 py-12">
            <nav className="mb-12">
                <Link
                    href="/"
                    className="text-gray-500 hover:text-black flex items-center gap-2 transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to home
                </Link>
            </nav>

            <article>
                <div
                    className="prose prose-lg max-w-none prose-headings:font-bold prose-a:text-blue-600"
                    dangerouslySetInnerHTML={{ __html: article.contentHtml || '' }}
                />

                <div className="mt-12 pt-8 border-t flex flex-wrap items-center gap-3 text-sm text-gray-500">
                    <span className="font-medium text-black">{article.author}</span>
                    <span>•</span>
                    <time>{article.created_at}</time>
                    {article.updated_at && article.updated_at !== article.created_at && (
                        <span className="italic">(Updated {article.updated_at})</span>
                    )}
                    {article.categories && article.categories.length > 0 && (
                        <div className="flex gap-2 ml-auto">
                            {article.categories.map(cat => (
                                <span key={cat} className="bg-gray-100 px-3 py-1 rounded-full text-xs text-gray-600 font-medium">
                                    {cat}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </article>
        </div>
    );
}
