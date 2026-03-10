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
                <header className="mb-12">
                    <div className="flex items-center gap-3 text-gray-500 mb-4">
                        <span className="font-medium text-black">{article.author}</span>
                        <span>•</span>
                        <time>{article.date}</time>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                        {article.title}
                    </h1>
                    <p className="text-xl text-gray-600 italic">
                        {article.excerpt}
                    </p>
                </header>

                <div className="aspect-video bg-gray-100 rounded-xl mb-12 flex items-center justify-center text-gray-400 font-medium border border-gray-200">
                    Hero Image Placeholder
                </div>

                <div
                    className="prose prose-lg max-w-none prose-headings:font-bold prose-a:text-blue-600"
                    dangerouslySetInnerHTML={{ __html: article.contentHtml || '' }}
                />
            </article>

            <footer className="mt-20 pt-12 border-t text-center text-gray-500">
                <p>© 2026 Zero Cost Medium. Built with Next.js and Netlify CMS.</p>
            </footer>
        </div>
    );
}
