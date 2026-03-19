import { useState, useEffect } from 'react';
import type { BlogPost } from '../types/product';

let cachedPosts: BlogPost[] | null = null;

export function useBlogPosts() {
  const [posts, setPosts] = useState<BlogPost[]>(cachedPosts || []);
  const [loading, setLoading] = useState(!cachedPosts);

  useEffect(() => {
    if (cachedPosts) return;
    fetch('/data/blog-posts.json')
      .then((r) => r.json())
      .then((data: BlogPost[]) => {
        cachedPosts = data;
        setPosts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return { posts, loading };
}
