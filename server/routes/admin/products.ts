import { Router } from 'express';
import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { db } from '../../db/index.js';
import { products, productImages, productTags, productVariants, productCollections } from '../../db/schema.js';
import { eq } from 'drizzle-orm';
import { requireAuth } from '../../middleware/auth.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOADS_DIR = path.join(__dirname, '..', '..', 'uploads');

const upload = multer({
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    cb(null, allowed.includes(file.mimetype));
  },
});

const router = Router();
router.use(requireAuth);

function generateHandle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// POST /api/admin/products - create product
router.post('/', (req, res) => {
  try {
    const { title, description, vendor, categorySlug, categoryLabel, type, price, compareAtPrice,
      seoTitle, seoDescription, availability, tags, variants, collections: collHandles, images } = req.body;

    if (!title || !categorySlug || price === undefined) {
      res.status(400).json({ error: 'title, categorySlug, and price are required' });
      return;
    }

    const handle = req.body.handle || generateHandle(title);

    const existing = db.select().from(products).where(eq(products.handle, handle)).get();
    if (existing) {
      res.status(409).json({ error: 'Product with this handle already exists' });
      return;
    }

    const result = db.insert(products).values({
      handle,
      title,
      description: description || '',
      vendor: vendor || 'VIETJEWELERS',
      categorySlug,
      categoryLabel: categoryLabel || '',
      type: type || '',
      price: Number(price),
      compareAtPrice: compareAtPrice ? Number(compareAtPrice) : null,
      seoTitle: seoTitle || '',
      seoDescription: seoDescription || '',
      availability: availability || 'in_stock',
    }).run();

    const productId = Number(result.lastInsertRowid);

    // Insert tags
    if (tags?.length) {
      for (const tag of tags) {
        db.insert(productTags).values({ productId, tag }).run();
      }
    }

    // Insert variants
    if (variants?.length) {
      for (let i = 0; i < variants.length; i++) {
        const v = variants[i];
        db.insert(productVariants).values({
          productId,
          title: v.title,
          price: Number(v.price),
          available: v.available !== false,
          position: i,
        }).run();
      }
    }

    // Insert collection memberships
    if (collHandles?.length) {
      for (const ch of collHandles) {
        db.insert(productCollections).values({ productId, collectionHandle: ch }).run();
      }
    }

    // Insert images
    if (images?.length) {
      for (let i = 0; i < images.length; i++) {
        db.insert(productImages).values({
          productId,
          url: images[i],
          position: i,
        }).run();
      }
    }

    res.status(201).json({ handle, id: productId });
  } catch (err) {
    console.error('POST /api/admin/products error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/admin/products/:handle - update product
router.put('/:handle', (req, res) => {
  try {
    const row = db.select().from(products).where(eq(products.handle, String(req.params.handle))).get();
    if (!row) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    const { title, description, vendor, categorySlug, categoryLabel, type, price, compareAtPrice,
      seoTitle, seoDescription, availability, tags, variants, collections: collHandles, images } = req.body;

    db.update(products).set({
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(vendor !== undefined && { vendor }),
      ...(categorySlug !== undefined && { categorySlug }),
      ...(categoryLabel !== undefined && { categoryLabel }),
      ...(type !== undefined && { type }),
      ...(price !== undefined && { price: Number(price) }),
      ...(compareAtPrice !== undefined && { compareAtPrice: compareAtPrice ? Number(compareAtPrice) : null }),
      ...(seoTitle !== undefined && { seoTitle }),
      ...(seoDescription !== undefined && { seoDescription }),
      ...(availability !== undefined && { availability }),
      updatedAt: new Date().toISOString(),
    }).where(eq(products.handle, String(req.params.handle))).run();

    // Replace tags if provided
    if (tags !== undefined) {
      db.delete(productTags).where(eq(productTags.productId, row.id)).run();
      for (const tag of tags) {
        db.insert(productTags).values({ productId: row.id, tag }).run();
      }
    }

    // Replace variants if provided
    if (variants !== undefined) {
      db.delete(productVariants).where(eq(productVariants.productId, row.id)).run();
      for (let i = 0; i < variants.length; i++) {
        const v = variants[i];
        db.insert(productVariants).values({
          productId: row.id,
          title: v.title,
          price: Number(v.price),
          available: v.available !== false,
          position: i,
        }).run();
      }
    }

    // Replace collections if provided
    if (collHandles !== undefined) {
      db.delete(productCollections).where(eq(productCollections.productId, row.id)).run();
      for (const ch of collHandles) {
        db.insert(productCollections).values({ productId: row.id, collectionHandle: ch }).run();
      }
    }

    // Replace images if provided
    if (images !== undefined) {
      db.delete(productImages).where(eq(productImages.productId, row.id)).run();
      for (let i = 0; i < images.length; i++) {
        db.insert(productImages).values({
          productId: row.id,
          url: images[i],
          position: i,
        }).run();
      }
    }

    res.json({ success: true, handle: String(req.params.handle) });
  } catch (err) {
    console.error('PUT /api/admin/products/:handle error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/admin/products/:handle
router.delete('/:handle', (req, res) => {
  try {
    const row = db.select().from(products).where(eq(products.handle, String(req.params.handle))).get();
    if (!row) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    db.delete(products).where(eq(products.handle, String(req.params.handle))).run();
    res.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/admin/products/:handle error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/admin/products/:handle/images - upload images
router.post('/:handle/images', upload.array('images', 10), async (req, res) => {
  try {
    const row = db.select().from(products).where(eq(products.handle, String(req.params.handle))).get();
    if (!row) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    const files = req.files as Express.Multer.File[];
    if (!files?.length) {
      res.status(400).json({ error: 'No files uploaded' });
      return;
    }

    // Get current max position
    const existing = db.select().from(productImages).where(eq(productImages.productId, row.id)).all();
    let maxPos = existing.reduce((max, img) => Math.max(max, img.position ?? 0), -1);

    const urls: string[] = [];

    for (const file of files) {
      const hash = crypto.createHash('sha256').update(file.buffer).digest('hex').slice(0, 12);
      const timestamp = Date.now();
      const filename = `${hash}-${timestamp}-full.webp`;

      // Ensure uploads dir exists
      if (!fs.existsSync(UPLOADS_DIR)) {
        fs.mkdirSync(UPLOADS_DIR, { recursive: true });
      }

      // Resize to full (1200px wide) and save as webp
      await sharp(file.buffer)
        .resize(1200, null, { withoutEnlargement: true })
        .webp({ quality: 85 })
        .toFile(path.join(UPLOADS_DIR, filename));

      // Also create thumbnail
      const thumbFilename = `${hash}-${timestamp}-thumb.webp`;
      await sharp(file.buffer)
        .resize(200, 200, { fit: 'cover' })
        .webp({ quality: 80 })
        .toFile(path.join(UPLOADS_DIR, thumbFilename));

      const url = `/uploads/${filename}`;
      maxPos++;

      db.insert(productImages).values({
        productId: row.id,
        url,
        position: maxPos,
      }).run();

      urls.push(url);
    }

    res.json({ urls });
  } catch (err) {
    console.error('POST /api/admin/products/:handle/images error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/admin/products/:handle/images/:id
router.delete('/:handle/images/:id', (req, res) => {
  try {
    const imgId = Number(req.params.id);
    db.delete(productImages).where(eq(productImages.id, imgId)).run();
    res.json({ success: true });
  } catch (err) {
    console.error('DELETE image error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
