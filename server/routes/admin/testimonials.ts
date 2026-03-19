import { Router } from 'express';
import { db } from '../../db/index.js';
import { testimonials } from '../../db/schema.js';
import { eq } from 'drizzle-orm';
import { requireAuth } from '../../middleware/auth.js';

const router = Router();
router.use(requireAuth);

// POST /api/admin/testimonials
router.post('/', (req, res) => {
  try {
    const { name, title, text, image, sortOrder } = req.body;
    if (!name || !text) {
      res.status(400).json({ error: 'name and text are required' });
      return;
    }

    const result = db.insert(testimonials).values({
      name,
      title: title || '',
      text,
      image: image || '',
      sortOrder: sortOrder ?? 0,
    }).run();

    res.status(201).json({ id: Number(result.lastInsertRowid) });
  } catch (err) {
    console.error('POST /api/admin/testimonials error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/admin/testimonials/:id
router.put('/:id', (req, res) => {
  try {
    const id = Number(req.params.id);
    const existing = db.select().from(testimonials).where(eq(testimonials.id, id)).get();
    if (!existing) {
      res.status(404).json({ error: 'Testimonial not found' });
      return;
    }

    const { name, title, text, image, sortOrder } = req.body;
    db.update(testimonials).set({
      ...(name !== undefined && { name }),
      ...(title !== undefined && { title }),
      ...(text !== undefined && { text }),
      ...(image !== undefined && { image }),
      ...(sortOrder !== undefined && { sortOrder }),
    }).where(eq(testimonials.id, id)).run();

    res.json({ success: true });
  } catch (err) {
    console.error('PUT /api/admin/testimonials/:id error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/admin/testimonials/:id
router.delete('/:id', (req, res) => {
  try {
    db.delete(testimonials).where(eq(testimonials.id, Number(req.params.id))).run();
    res.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/admin/testimonials/:id error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
