import { Router } from 'express';
import { db } from '../db/index.js';
import { categories, products } from '../db/schema.js';
import { eq, sql } from 'drizzle-orm';

const router = Router();

// GET /api/categories
router.get('/', (_req, res) => {
  try {
    const cats = db.select().from(categories).all();

    // Compute product counts per category
    const counts = db.select({
      categorySlug: products.categorySlug,
      count: sql<number>`count(*)`.as('count'),
    })
      .from(products)
      .groupBy(products.categorySlug)
      .all();

    const countMap = new Map(counts.map(c => [c.categorySlug, c.count]));

    const result = cats
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
      .map(c => ({
        slug: c.slug,
        label: c.label,
        count: countMap.get(c.slug) || 0,
        image: c.image || '',
      }));

    res.json(result);
  } catch (err) {
    console.error('GET /api/categories error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
