import { Router } from 'express';
import { db } from '../db/index.js';
import { testimonials } from '../db/schema.js';

const router = Router();

// GET /api/testimonials
router.get('/', (_req, res) => {
  try {
    const rows = db.select().from(testimonials).all();
    const result = rows
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
      .map(r => ({
        name: r.name,
        title: r.title || '',
        text: r.text,
        image: r.image || '',
      }));

    res.json(result);
  } catch (err) {
    console.error('GET /api/testimonials error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
