/**
 * Seed script: imports existing JSON data from public/data/ into SQLite database.
 * Run with: npx tsx server/scripts/seed.ts
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from '../db/schema.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_DIR = path.join(__dirname, '..', 'data');
const DB_PATH = process.env.DB_PATH || path.join(DB_DIR, 'vietjewelers.db');
const DATA_DIR = path.join(__dirname, '..', '..', 'public', 'data');

// Ensure data dir exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

// Delete existing DB for clean seed
if (fs.existsSync(DB_PATH)) {
  fs.unlinkSync(DB_PATH);
  console.log('Deleted existing database');
}

const sqlite = new Database(DB_PATH);
sqlite.pragma('journal_mode = WAL');
sqlite.pragma('foreign_keys = ON');

const db = drizzle(sqlite, { schema });

// ─── Create tables ─────────────────────────────────────────
console.log('Creating tables...');
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    display_name TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    handle TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    vendor TEXT DEFAULT 'VIETJEWELERS',
    category_slug TEXT NOT NULL,
    category_label TEXT DEFAULT '',
    type TEXT DEFAULT '',
    price INTEGER NOT NULL,
    compare_at_price INTEGER,
    seo_title TEXT DEFAULT '',
    seo_description TEXT DEFAULT '',
    availability TEXT DEFAULT 'in_stock' CHECK(availability IN ('in_stock', 'out_of_stock')),
    sort_order INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS product_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    position INTEGER DEFAULT 0,
    alt_text TEXT DEFAULT ''
  );
  CREATE INDEX IF NOT EXISTS idx_product_images_product ON product_images(product_id, position);

  CREATE TABLE IF NOT EXISTS product_tags (
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    tag TEXT NOT NULL,
    PRIMARY KEY (product_id, tag)
  );
  CREATE INDEX IF NOT EXISTS idx_product_tags_tag ON product_tags(tag);

  CREATE TABLE IF NOT EXISTS product_variants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    price INTEGER NOT NULL,
    available INTEGER DEFAULT 1,
    position INTEGER DEFAULT 0
  );
  CREATE INDEX IF NOT EXISTS idx_variants_product ON product_variants(product_id);

  CREATE TABLE IF NOT EXISTS categories (
    slug TEXT PRIMARY KEY,
    label TEXT NOT NULL,
    image TEXT DEFAULT '',
    sort_order INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS collections (
    handle TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    image TEXT,
    parent_handle TEXT,
    sort_order INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS product_collections (
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    collection_handle TEXT NOT NULL REFERENCES collections(handle) ON DELETE CASCADE,
    PRIMARY KEY (product_id, collection_handle)
  );
  CREATE INDEX IF NOT EXISTS idx_pc_collection ON product_collections(collection_handle);

  CREATE TABLE IF NOT EXISTS blog_posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    handle TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    excerpt TEXT DEFAULT '',
    image TEXT DEFAULT '',
    date TEXT NOT NULL,
    content TEXT DEFAULT '',
    published INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS blog_post_tags (
    blog_post_id INTEGER NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
    tag TEXT NOT NULL,
    PRIMARY KEY (blog_post_id, tag)
  );

  CREATE TABLE IF NOT EXISTS testimonials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    title TEXT DEFAULT '',
    text TEXT NOT NULL,
    image TEXT DEFAULT '',
    sort_order INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  );
`);

console.log('Tables created.');

// ─── Helper: read JSON file ───────────────────────────────
function readJson<T>(filename: string): T {
  const filepath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filepath)) {
    console.warn(`Warning: ${filename} not found, skipping`);
    return [] as unknown as T;
  }
  return JSON.parse(fs.readFileSync(filepath, 'utf-8'));
}

// ─── Seed Categories ──────────────────────────────────────
console.log('Seeding categories...');
interface CategoryJson { slug: string; label: string; count: number; image: string; }
const categoriesData = readJson<CategoryJson[]>('categories.json');

const insertCategory = sqlite.prepare(
  'INSERT OR IGNORE INTO categories (slug, label, image, sort_order) VALUES (?, ?, ?, ?)'
);
for (let i = 0; i < categoriesData.length; i++) {
  const c = categoriesData[i];
  insertCategory.run(c.slug, c.label, c.image || '', i);
}
console.log(`  ${categoriesData.length} categories seeded`);

// ─── Seed Collections ─────────────────────────────────────
console.log('Seeding collections...');
interface CollectionJson { handle: string; title: string; image: string | null; parentHandle: string | null; productCount: number; }
const collectionsData = readJson<CollectionJson[]>('collections.json');

const insertCollection = sqlite.prepare(
  'INSERT OR IGNORE INTO collections (handle, title, image, parent_handle, sort_order) VALUES (?, ?, ?, ?, ?)'
);
for (let i = 0; i < collectionsData.length; i++) {
  const c = collectionsData[i];
  insertCollection.run(c.handle, c.title, c.image || null, c.parentHandle || null, i);
}
console.log(`  ${collectionsData.length} collections seeded`);

// ─── Seed Products ────────────────────────────────────────
console.log('Seeding products...');
interface VariantJson { title: string; price: number; available: boolean; }
interface ProductJson {
  handle: string; title: string; description: string; vendor: string;
  category: string; categoryLabel: string; type: string; tags: string[];
  price: number; compareAtPrice: number | null; images: string[];
  primaryImage: string; secondaryImage: string | null;
  seoTitle: string; seoDescription: string;
  variants: VariantJson[]; availability: string; collections: string[];
}
const productsData = readJson<ProductJson[]>('products.json');

const insertProduct = sqlite.prepare(`
  INSERT OR IGNORE INTO products (handle, title, description, vendor, category_slug, category_label, type, price, compare_at_price, seo_title, seo_description, availability, sort_order)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);
const insertImage = sqlite.prepare(
  'INSERT INTO product_images (product_id, url, position) VALUES (?, ?, ?)'
);
const insertTag = sqlite.prepare(
  'INSERT OR IGNORE INTO product_tags (product_id, tag) VALUES (?, ?)'
);
const insertVariant = sqlite.prepare(
  'INSERT INTO product_variants (product_id, title, price, available, position) VALUES (?, ?, ?, ?, ?)'
);
const insertPC = sqlite.prepare(
  'INSERT OR IGNORE INTO product_collections (product_id, collection_handle) VALUES (?, ?)'
);

const seedProducts = sqlite.transaction(() => {
  for (let i = 0; i < productsData.length; i++) {
    const p = productsData[i];
    const result = insertProduct.run(
      p.handle, p.title, p.description || '', p.vendor || 'VIETJEWELERS',
      p.category, p.categoryLabel || '', p.type || '',
      p.price, p.compareAtPrice || null,
      p.seoTitle || '', p.seoDescription || '',
      p.availability || 'in_stock', i
    );

    const productId = Number(result.lastInsertRowid);
    if (productId === 0) continue; // already existed

    // Images
    for (let j = 0; j < p.images.length; j++) {
      insertImage.run(productId, p.images[j], j);
    }

    // Tags
    for (const tag of p.tags) {
      insertTag.run(productId, tag);
    }

    // Variants
    for (let j = 0; j < p.variants.length; j++) {
      const v = p.variants[j];
      insertVariant.run(productId, v.title, v.price, v.available ? 1 : 0, j);
    }

    // Collections
    for (const ch of p.collections) {
      // Only insert if the collection exists
      const collExists = sqlite.prepare('SELECT 1 FROM collections WHERE handle = ?').get(ch);
      if (collExists) {
        insertPC.run(productId, ch);
      }
    }
  }
});

seedProducts();
console.log(`  ${productsData.length} products seeded`);

// ─── Seed Blog Posts ──────────────────────────────────────
console.log('Seeding blog posts...');
interface BlogPostJson { handle: string; title: string; excerpt: string; image: string; tags: string[]; date: string; content: string; }
const blogData = readJson<BlogPostJson[]>('blog-posts.json');

const insertBlogPost = sqlite.prepare(`
  INSERT OR IGNORE INTO blog_posts (handle, title, excerpt, image, date, content, published)
  VALUES (?, ?, ?, ?, ?, ?, 1)
`);
const insertBlogTag = sqlite.prepare(
  'INSERT OR IGNORE INTO blog_post_tags (blog_post_id, tag) VALUES (?, ?)'
);

for (const post of blogData) {
  const result = insertBlogPost.run(
    post.handle, post.title, post.excerpt || '', post.image || '',
    post.date || new Date().toISOString().split('T')[0], post.content || ''
  );
  const postId = Number(result.lastInsertRowid);
  if (postId > 0 && post.tags?.length) {
    for (const tag of post.tags) {
      insertBlogTag.run(postId, tag);
    }
  }
}
console.log(`  ${blogData.length} blog posts seeded`);

// ─── Seed Testimonials ────────────────────────────────────
console.log('Seeding testimonials...');
interface TestimonialJson { name: string; title: string; text: string; image: string; }
const testimonialsData = readJson<TestimonialJson[]>('testimonials.json');

const insertTestimonial = sqlite.prepare(
  'INSERT INTO testimonials (name, title, text, image, sort_order) VALUES (?, ?, ?, ?, ?)'
);
for (let i = 0; i < testimonialsData.length; i++) {
  const t = testimonialsData[i];
  insertTestimonial.run(t.name, t.title || '', t.text, t.image || '', i);
}
console.log(`  ${testimonialsData.length} testimonials seeded`);

// ─── Done ─────────────────────────────────────────────────
sqlite.close();
console.log('\n✅ Database seeded successfully at:', DB_PATH);
