import { sqliteTable, text, integer, primaryKey, index } from 'drizzle-orm/sqlite-core';

// ─── Admin Users ───────────────────────────────────────────
export const adminUsers = sqliteTable('admin_users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  username: text('username').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  displayName: text('display_name').notNull(),
  createdAt: text('created_at').default("(datetime('now'))"),
  updatedAt: text('updated_at').default("(datetime('now'))"),
});

// ─── Products ──────────────────────────────────────────────
export const products = sqliteTable('products', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  handle: text('handle').notNull().unique(),
  title: text('title').notNull(),
  description: text('description').default(''),
  vendor: text('vendor').default('VIETJEWELERS'),
  categorySlug: text('category_slug').notNull(),
  categoryLabel: text('category_label').default(''),
  type: text('type').default(''),
  price: integer('price').notNull(),
  compareAtPrice: integer('compare_at_price'),
  seoTitle: text('seo_title').default(''),
  seoDescription: text('seo_description').default(''),
  availability: text('availability', { enum: ['in_stock', 'out_of_stock'] }).default('in_stock'),
  sortOrder: integer('sort_order').default(0),
  createdAt: text('created_at').default("(datetime('now'))"),
  updatedAt: text('updated_at').default("(datetime('now'))"),
});

// ─── Product Images ────────────────────────────────────────
export const productImages = sqliteTable('product_images', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  productId: integer('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  url: text('url').notNull(),
  position: integer('position').default(0),
  altText: text('alt_text').default(''),
}, (table) => [
  index('idx_product_images_product').on(table.productId, table.position),
]);

// ─── Product Tags ──────────────────────────────────────────
export const productTags = sqliteTable('product_tags', {
  productId: integer('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  tag: text('tag').notNull(),
}, (table) => [
  primaryKey({ columns: [table.productId, table.tag] }),
  index('idx_product_tags_tag').on(table.tag),
]);

// ─── Product Variants ──────────────────────────────────────
export const productVariants = sqliteTable('product_variants', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  productId: integer('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  price: integer('price').notNull(),
  available: integer('available', { mode: 'boolean' }).default(true),
  position: integer('position').default(0),
}, (table) => [
  index('idx_variants_product').on(table.productId),
]);

// ─── Categories ────────────────────────────────────────────
export const categories = sqliteTable('categories', {
  slug: text('slug').primaryKey(),
  label: text('label').notNull(),
  image: text('image').default(''),
  sortOrder: integer('sort_order').default(0),
});

// ─── Collections ───────────────────────────────────────────
export const collections = sqliteTable('collections', {
  handle: text('handle').primaryKey(),
  title: text('title').notNull(),
  image: text('image'),
  parentHandle: text('parent_handle'),
  sortOrder: integer('sort_order').default(0),
});

// ─── Product ↔ Collection (many-to-many) ───────────────────
export const productCollections = sqliteTable('product_collections', {
  productId: integer('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  collectionHandle: text('collection_handle').notNull().references(() => collections.handle, { onDelete: 'cascade' }),
}, (table) => [
  primaryKey({ columns: [table.productId, table.collectionHandle] }),
  index('idx_pc_collection').on(table.collectionHandle),
]);

// ─── Blog Posts ────────────────────────────────────────────
export const blogPosts = sqliteTable('blog_posts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  handle: text('handle').notNull().unique(),
  title: text('title').notNull(),
  excerpt: text('excerpt').default(''),
  image: text('image').default(''),
  date: text('date').notNull(),
  content: text('content').default(''),
  published: integer('published', { mode: 'boolean' }).default(true),
  createdAt: text('created_at').default("(datetime('now'))"),
  updatedAt: text('updated_at').default("(datetime('now'))"),
});

// ─── Blog Post Tags ────────────────────────────────────────
export const blogPostTags = sqliteTable('blog_post_tags', {
  blogPostId: integer('blog_post_id').notNull().references(() => blogPosts.id, { onDelete: 'cascade' }),
  tag: text('tag').notNull(),
}, (table) => [
  primaryKey({ columns: [table.blogPostId, table.tag] }),
]);

// ─── Testimonials ──────────────────────────────────────────
export const testimonials = sqliteTable('testimonials', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  title: text('title').default(''),
  text: text('text').notNull(),
  image: text('image').default(''),
  sortOrder: integer('sort_order').default(0),
  createdAt: text('created_at').default("(datetime('now'))"),
});
