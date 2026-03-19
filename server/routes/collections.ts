import { Router } from 'express';
import { db } from '../db/index.js';
import { collections, productCollections } from '../db/schema.js';
import { eq, sql } from 'drizzle-orm';

const router = Router();

// GET /api/collections
router.get('/', (_req, res) => {
  try {
    const colls = db.select().from(collections).all();

    // Compute product counts per collection
    const counts = db.select({
      collectionHandle: productCollections.collectionHandle,
      count: sql<number>`count(*)`.as('count'),
    })
      .from(productCollections)
      .groupBy(productCollections.collectionHandle)
      .all();

    const countMap = new Map(counts.map(c => [c.collectionHandle, c.count]));

    const result = colls
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
      .map(c => ({
        handle: c.handle,
        title: c.title,
        image: c.image ?? null,
        parentHandle: c.parentHandle ?? null,
        productCount: countMap.get(c.handle) || 0,
      }));

    res.json(result);
  } catch (err) {
    console.error('GET /api/collections error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/collections/:handle
router.get('/:handle', (req, res) => {
  try {
    const coll = db.select().from(collections).where(eq(collections.handle, req.params.handle)).get();
    if (!coll) {
      res.status(404).json({ error: 'Collection not found' });
      return;
    }

    res.json({
      handle: coll.handle,
      title: coll.title,
      image: coll.image ?? null,
      parentHandle: coll.parentHandle ?? null,
      productCount: 0,
    });
  } catch (err) {
    console.error('GET /api/collections/:handle error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
