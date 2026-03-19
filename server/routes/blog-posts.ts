import { Router } from 'express';
import { db } from '../db/index.js';
import { blogPosts, blogPostTags } from '../db/schema.js';
import { eq } from 'drizzle-orm';

const router = Router();

// GET /api/blog-posts
router.get('/', (_req, res) => {
  try {
    const posts = db.select().from(blogPosts).where(eq(blogPosts.published, true)).all();
    const allTags = db.select().from(blogPostTags).all();

    const tagsByPost = new Map<number, string[]>();
    for (const t of allTags) {
      const arr = tagsByPost.get(t.blogPostId) || [];
      arr.push(t.tag);
      tagsByPost.set(t.blogPostId, arr);
    }

    const result = posts
      .sort((a, b) => (b.date || '').localeCompare(a.date || ''))
      .map(p => ({
        handle: p.handle,
        title: p.title,
        excerpt: p.excerpt || '',
        image: p.image || '',
        tags: tagsByPost.get(p.id) || [],
        date: p.date,
        content: p.content || '',
      }));

    res.json(result);
  } catch (err) {
    console.error('GET /api/blog-posts error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/blog-posts/:handle
router.get('/:handle', (req, res) => {
  try {
    const post = db.select().from(blogPosts).where(eq(blogPosts.handle, req.params.handle)).get();
    if (!post) {
      res.status(404).json({ error: 'Blog post not found' });
      return;
    }

    const tags = db.select().from(blogPostTags).where(eq(blogPostTags.blogPostId, post.id)).all();

    res.json({
      handle: post.handle,
      title: post.title,
      excerpt: post.excerpt || '',
      image: post.image || '',
      tags: tags.map(t => t.tag),
      date: post.date,
      content: post.content || '',
    });
  } catch (err) {
    console.error('GET /api/blog-posts/:handle error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
