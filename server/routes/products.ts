import { Router } from 'express';
import { db } from '../db/index.js';
import { products, productImages, productTags, productVariants, productCollections } from '../db/schema.js';
import { eq, and, gte, lte, like, asc, desc, inArray, sql } from 'drizzle-orm';

const router = Router();

// Helper: assemble full Product object from DB rows
function assembleProduct(row: any, images: any[], tags: any[], variants: any[], collectionHandles: string[]) {
  const sortedImages = images.sort((a: any, b: any) => (a.position ?? 0) - (b.position ?? 0));
  const imageUrls = sortedImages.map((img: any) => img.url);
  return {
    handle: row.handle,
    title: row.title,
    description: row.description || '',
    vendor: row.vendor || 'VIETJEWELERS',
    category: row.categorySlug,
    categoryLabel: row.categoryLabel || '',
    type: row.type || '',
    tags: tags.map((t: any) => t.tag),
    price: row.price,
    compareAtPrice: row.compareAtPrice ?? null,
    images: imageUrls,
    primaryImage: imageUrls[0] || '',
    secondaryImage: imageUrls[1] || null,
    seoTitle: row.seoTitle || '',
    seoDescription: row.seoDescription || '',
    variants: variants.map((v: any) => ({
      title: v.title,
      price: v.price,
      available: Boolean(v.available),
    })),
    availability: row.availability || 'in_stock',
    collections: collectionHandles,
  };
}

// GET /api/products - list all products with optional filters
router.get('/', async (_req, res) => {
  try {
    const { category, collection, type, minPrice, maxPrice, availability, sort, search } = _req.query;

    // Get all products
    let allProducts = db.select().from(products).all();

    // Apply filters
    if (category) {
      allProducts = allProducts.filter(p => p.categorySlug === category);
    }
    if (availability) {
      allProducts = allProducts.filter(p => p.availability === availability);
    }
    if (type) {
      const typeStr = String(type).toLowerCase();
      allProducts = allProducts.filter(p => (p.type || '').toLowerCase().includes(typeStr));
    }
    if (minPrice) {
      const min = Number(minPrice);
      allProducts = allProducts.filter(p => p.price >= min);
    }
    if (maxPrice) {
      const max = Number(maxPrice);
      allProducts = allProducts.filter(p => p.price <= max);
    }

    // Filter by collection via join table
    if (collection) {
      const pcRows = db.select({ productId: productCollections.productId })
        .from(productCollections)
        .where(eq(productCollections.collectionHandle, String(collection)))
        .all();
      const productIds = new Set(pcRows.map(r => r.productId));
      allProducts = allProducts.filter(p => productIds.has(p.id));
    }

    // Search (simple LIKE on title)
    if (search) {
      const q = String(search).toLowerCase();
      allProducts = allProducts.filter(p => p.title.toLowerCase().includes(q));
    }

    // Sort
    const sortStr = String(sort || 'price-desc');
    switch (sortStr) {
      case 'price-asc': allProducts.sort((a, b) => a.price - b.price); break;
      case 'price-desc': allProducts.sort((a, b) => b.price - a.price); break;
      case 'name-asc': allProducts.sort((a, b) => a.title.localeCompare(b.title)); break;
      case 'name-desc': allProducts.sort((a, b) => b.title.localeCompare(a.title)); break;
      case 'date-new': allProducts.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || '')); break;
      case 'date-old': allProducts.sort((a, b) => (a.createdAt || '').localeCompare(b.createdAt || '')); break;
    }

    // Batch load related data for all products
    const productIds = allProducts.map(p => p.id);
    if (productIds.length === 0) {
      res.json([]);
      return;
    }

    const allImages = db.select().from(productImages).all();
    const allTags = db.select().from(productTags).all();
    const allVariants = db.select().from(productVariants).all();
    const allPC = db.select().from(productCollections).all();

    const imagesByProduct = new Map<number, any[]>();
    for (const img of allImages) {
      const arr = imagesByProduct.get(img.productId) || [];
      arr.push(img);
      imagesByProduct.set(img.productId, arr);
    }

    const tagsByProduct = new Map<number, any[]>();
    for (const tag of allTags) {
      const arr = tagsByProduct.get(tag.productId) || [];
      arr.push(tag);
      tagsByProduct.set(tag.productId, arr);
    }

    const variantsByProduct = new Map<number, any[]>();
    for (const v of allVariants) {
      const arr = variantsByProduct.get(v.productId) || [];
      arr.push(v);
      variantsByProduct.set(v.productId, arr);
    }

    const collsByProduct = new Map<number, string[]>();
    for (const pc of allPC) {
      const arr = collsByProduct.get(pc.productId) || [];
      arr.push(pc.collectionHandle);
      collsByProduct.set(pc.productId, arr);
    }

    const result = allProducts.map(p => assembleProduct(
      p,
      imagesByProduct.get(p.id) || [],
      tagsByProduct.get(p.id) || [],
      variantsByProduct.get(p.id) || [],
      collsByProduct.get(p.id) || [],
    ));

    res.json(result);
  } catch (err) {
    console.error('GET /api/products error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/products/:handle - single product
router.get('/:handle', async (req, res) => {
  try {
    const row = db.select().from(products).where(eq(products.handle, req.params.handle)).get();
    if (!row) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    const images = db.select().from(productImages).where(eq(productImages.productId, row.id)).all();
    const tags = db.select().from(productTags).where(eq(productTags.productId, row.id)).all();
    const variants = db.select().from(productVariants).where(eq(productVariants.productId, row.id)).all();
    const colls = db.select().from(productCollections).where(eq(productCollections.productId, row.id)).all();

    res.json(assembleProduct(row, images, tags, variants, colls.map(c => c.collectionHandle)));
  } catch (err) {
    console.error('GET /api/products/:handle error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
