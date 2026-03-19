import { Router } from 'express';
import { db } from '../../db/index.js';
import { collections, productCollections } from '../../db/schema.js';
import { eq } from 'drizzle-orm';
import { requireAuth } from '../../middleware/auth.js';

const router = Router();
router.use(requireAuth);

// POST /api/admin/collections
router.post('/', (req, res) => {
  try {
    const { handle, title, image, parentHandle, sortOrder } = req.body;
    if (!handle || !title) {
      res.status(400).json({ error: 'handle and title are required' });
      return;
    }

    const existing = db.select().from(collections).where(eq(collections.handle, handle)).get();
    if (existing) {
      res.status(409).json({ error: 'Collection already exists' });
      return;
    }

    db.insert(collections).values({
      handle,
      title,
      image: image || null,
      parentHandle: parentHandle || null,
      sortOrder: sortOrder ?? 0,
    }).run();

    res.status(201).json({ handle });
  } catch (err) {
    console.error('POST /api/admin/collections error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/admin/collections/:handle
router.put('/:handle', (req, res) => {
  try {
    const existing = db.select().from(collections).where(eq(collections.handle, req.params.handle)).get();
    if (!existing) {
      res.status(404).json({ error: 'Collection not found' });
      return;
    }

    const { title, image, parentHandle, sortOrder } = req.body;
    db.update(collections).set({
      ...(title !== undefined && { title }),
      ...(image !== undefined && { image }),
      ...(parentHandle !== undefined && { parentHandle }),
      ...(sortOrder !== undefined && { sortOrder }),
    }).where(eq(collections.handle, req.params.handle)).run();

    res.json({ success: true });
  } catch (err) {
    console.error('PUT /api/admin/collections/:handle error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/admin/collections/:handle
router.delete('/:handle', (req, res) => {
  try {
    db.delete(collections).where(eq(collections.handle, req.params.handle)).run();
    res.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/admin/collections/:handle error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/admin/collections/:handle/products - assign products to collection
router.put('/:handle/products', (req, res) => {
  try {
    const { productIds } = req.body;
    if (!Array.isArray(productIds)) {
      res.status(400).json({ error: 'productIds array required' });
      return;
    }

    // Remove existing assignments
    db.delete(productCollections)
      .where(eq(productCollections.collectionHandle, req.params.handle))
      .run();

    // Insert new assignments
    for (const pid of productIds) {
      db.insert(productCollections).values({
        productId: Number(pid),
        collectionHandle: req.params.handle,
      }).run();
    }

    res.json({ success: true });
  } catch (err) {
    console.error('PUT /api/admin/collections/:handle/products error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
