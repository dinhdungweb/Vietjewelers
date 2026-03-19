import { Link, useParams } from 'react-router';
import { Helmet } from 'react-helmet-async';
import { useBlogPosts } from '../hooks/useBlogPosts';

export default function BlogPostPage() {
  const { handle } = useParams<{ handle: string }>();
  const { posts: allPosts } = useBlogPosts();
  const post = allPosts.find((p) => p.handle === handle) || null;

  if (!post) {
    return (
      <div className="container py-20 text-center">
        <p className="text-foreground-secondary">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{post.title} | Viet Jewelers Blog</title>
        <meta name="description" content={post.excerpt} />
      </Helmet>
    <div>
      <div className="page-header">
        <div className="breadcrumb mb-3">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/blogs/news">News</Link>
          <span>/</span>
          <span>{post.title}</span>
        </div>
        <h1>{post.title}</h1>
        <p className="text-foreground-secondary text-sm mt-2">{post.date}</p>
      </div>

      <div className="container max-w-3xl section-spacing pb-20">
        {post.image && (
          <img
            src={post.image}
            alt={post.title}
            className="w-full rounded mb-8"
            referrerPolicy="no-referrer"
          />
        )}
        <div
          className="prose prose-sm max-w-none text-foreground"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="mt-10 pt-6 border-t border-border">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  to={`/blogs/news?tag=${encodeURIComponent(tag)}`}
                  className="text-xs px-3 py-1.5 border border-border rounded-full text-foreground-secondary hover:border-primary hover:text-primary transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
