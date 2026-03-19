import { Router } from 'express';
import { db } from '../../db/index.js';
import { blogPosts, blogPostTags } from '../../db/schema.js';
import { eq } from 'drizzle-orm';
import { requireAuth } from '../../middleware/auth.js';

const router = Router();
router.use(requireAuth);

// POST /api/admin/blog-posts
router.post('/', (req, res) => {
  try {
    const { handle, title, excerpt, image, date, content, published, tags } = req.body;
    if (!handle || !title) {
      res.status(400).json({ error: 'handle and title are required' });
      return;
    }

    const existing = db.select().from(blogPosts).where(eq(blogPosts.handle, handle)).get();
    if (existing) {
      res.status(409).json({ error: 'Blog post with this handle already exists' });
      return;
    }

    const result = db.insert(blogPosts).values({
      handle,
      title,
      excerpt: excerpt || '',
      image: image || '',
      date: date || new Date().toISOString().split('T')[0],
      content: content || '',
      published: published !== false,
    }).run();

    const postId = Number(result.lastInsertRowid);

    if (tags?.length) {
      for (const tag of tags) {
        db.insert(blogPostTags).values({ blogPostId: postId, tag }).run();
      }
    }

    res.status(201).json({ handle, id: postId });
  } catch (err) {
    console.error('POST /api/admin/blog-posts error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/admin/blog-posts/:handle
router.put('/:handle', (req, res) => {
  try {
    const post = db.select().from(blogPosts).where(eq(blogPosts.handle, req.params.handle)).get();
    if (!post) {
      res.status(404).json({ error: 'Blog post not found' });
      return;
    }

    const { title, excerpt, image, date, content, published, tags } = req.body;
    db.update(blogPosts).set({
      ...(title !== undefined && { title }),
      ...(excerpt !== undefined && { excerpt }),
      ...(image !== undefined && { image }),
      ...(date !== undefined && { date }),
      ...(content !== undefined && { content }),
      ...(published !== undefined && { published }),
      updatedAt: new Date().toISOString(),
    }).where(eq(blogPosts.handle, req.params.handle)).run();

    if (tags !== undefined) {
      db.delete(blogPostTags).where(eq(blogPostTags.blogPostId, post.id)).run();
      for (const tag of tags) {
        db.insert(blogPostTags).values({ blogPostId: post.id, tag }).run();
      }
    }

    res.json({ success: true });
  } catch (err) {
    console.error('PUT /api/admin/blog-posts/:handle error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/admin/blog-posts/:handle
router.delete('/:handle', (req, res) => {
  try {
    db.delete(blogPosts).where(eq(blogPosts.handle, req.params.handle)).run();
    res.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/admin/blog-posts/:handle error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
