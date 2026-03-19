import { Router } from 'express';
import { db } from '../../db/index.js';
import { categories } from '../../db/schema.js';
import { eq } from 'drizzle-orm';
import { requireAuth } from '../../middleware/auth.js';

const router = Router();
router.use(requireAuth);

// POST /api/admin/categories
router.post('/', (req, res) => {
  try {
    const { slug, label, image, sortOrder } = req.body;
    if (!slug || !label) {
      res.status(400).json({ error: 'slug and label are required' });
      return;
    }

    const existing = db.select().from(categories).where(eq(categories.slug, slug)).get();
    if (existing) {
      res.status(409).json({ error: 'Category already exists' });
      return;
    }

    db.insert(categories).values({
      slug,
      label,
      image: image || '',
      sortOrder: sortOrder ?? 0,
    }).run();

    res.status(201).json({ slug });
  } catch (err) {
    console.error('POST /api/admin/categories error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/admin/categories/:slug
router.put('/:slug', (req, res) => {
  try {
    const existing = db.select().from(categories).where(eq(categories.slug, req.params.slug)).get();
    if (!existing) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }

    const { label, image, sortOrder } = req.body;
    db.update(categories).set({
      ...(label !== undefined && { label }),
      ...(image !== undefined && { image }),
      ...(sortOrder !== undefined && { sortOrder }),
    }).where(eq(categories.slug, req.params.slug)).run();

    res.json({ success: true });
  } catch (err) {
    console.error('PUT /api/admin/categories/:slug error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
