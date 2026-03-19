import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router';
import { Helmet } from 'react-helmet-async';
import { useBlogPosts } from '../hooks/useBlogPosts';

export default function BlogPage() {
  const { posts } = useBlogPosts();
  const [searchParams] = useSearchParams();
  const activeTag = searchParams.get('tag');

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    posts.forEach((p) => p.tags.forEach((t) => tagSet.add(t)));
    return Array.from(tagSet).sort();
  }, [posts]);

  const filteredPosts = activeTag
    ? posts.filter((p) => p.tags.includes(activeTag))
    : posts;

  return (
    <>
      <Helmet>
        <title>Blog | Viet Jewelers - Jewelry News & Tips</title>
        <meta name="description" content="Read the latest news, tips, and stories from Viet Jewelers. Learn about jewelry care, styling, custom orders, and more from our Hanoi Old Quarter workshop." />
      </Helmet>

      <div className="page-header">
        <div className="breadcrumb mb-3">
          <Link to="/">Home</Link>
          <span>/</span>
          <span>News</span>
        </div>
        <h1>News</h1>
      </div>

      <div className="container py-8 lg:py-12 pb-20">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Blog grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <Link key={post.handle} to={`/blogs/news/${post.handle}`} className="group">
                  <div className="aspect-[16/9] bg-background-secondary rounded overflow-hidden mb-4">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex gap-2 mb-2 flex-wrap">
                    {post.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="text-[10px] uppercase tracking-wider text-primary font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-base font-medium group-hover:text-primary transition-colors mb-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-foreground-secondary line-clamp-2 hidden md:block">{post.excerpt}</p>
                  <span className="text-xs text-primary font-medium mt-3 inline-block group-hover:underline">Read more</span>
                </Link>
              ))}
            </div>

            {filteredPosts.length === 0 && (
              <p className="text-center text-foreground-secondary py-12">No articles found.</p>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Tags</h4>
            <div className="flex flex-wrap gap-2">
              {activeTag && (
                <Link
                  to="/blogs/news"
                  className="text-xs px-3 py-1.5 border border-primary bg-primary text-white rounded-full"
                >
                  All
                </Link>
              )}
              {allTags.map((tag) => (
                <Link
                  key={tag}
                  to={`/blogs/news?tag=${encodeURIComponent(tag)}`}
                  className={`text-xs px-3 py-1.5 border rounded-full transition-colors ${
                    activeTag === tag
                      ? 'border-primary bg-primary text-white'
                      : 'border-border text-foreground-secondary hover:border-primary hover:text-primary'
                  }`}
                >
                  {tag}
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
