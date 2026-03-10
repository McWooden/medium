import Link from 'next/link';
import { getAllArticles } from '@/lib/articles';

export default function Home() {
    const articles = getAllArticles();

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <header className="mb-12 border-b pb-8">
                <h1 className="text-4xl font-bold mb-2">Zero Cost Medium</h1>
                <p className="text-gray-600">Premium publishing platform, hosted for free.</p>
            </header>

            <main className="grid gap-12">
                {articles.map((article) => (
                    <article key={article.slug} className="group">
                        <Link href={`/articles/${article.slug}`}>
                            <div className="flex flex-col md:flex-row gap-8">
                                {article.cover && (
                                    <div className="md:w-1/3">
                                        <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                                            <img
                                                src={article.cover}
                                                alt={article.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>
                                )}
                                <div className={article.cover ? "md:w-2/3" : "w-full"}>
                                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                                        <span>{article.author}</span>
                                        <span>•</span>
                                        <span>{article.date}</span>
                                        {article.categories && article.categories.length > 0 && (
                                            <>
                                                <span>•</span>
                                                <div className="flex gap-2">
                                                    {article.categories.map(cat => (
                                                        <span key={cat} className="bg-gray-100 px-2 py-0.5 rounded-full text-xs text-gray-600">
                                                            {cat}
                                                        </span>
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    <h2 className="text-2xl font-bold mb-3 group-hover:text-blue-600 transition-colors">
                                        {article.title}
                                    </h2>
                                    <p className="text-gray-600 line-clamp-3 mb-4">
                                        {article.excerpt}
                                    </p>
                                    <span className="text-blue-600 font-medium inline-flex items-center gap-1 group-hover:underline">
                                        Read more
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </span>
                                </div>
                            </div>
                        </Link>
                    </article>
                ))}
            </main>
        </div>
    );
}
