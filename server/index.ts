import express from 'express';
import cors from 'cors';
import session from 'express-session';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Import routes
import productsRouter from './routes/products.js';
import categoriesRouter from './routes/categories.js';
import collectionsRouter from './routes/collections.js';
import blogPostsRouter from './routes/blog-posts.js';
import testimonialsRouter from './routes/testimonials.js';
import authRouter from './routes/auth.js';

// Admin routes
import adminProductsRouter from './routes/admin/products.js';
import adminCollectionsRouter from './routes/admin/collections.js';
import adminBlogPostsRouter from './routes/admin/blog-posts.js';
import adminTestimonialsRouter from './routes/admin/testimonials.js';
import adminCategoriesRouter from './routes/admin/categories.js';
import adminUploadRouter from './routes/admin/upload.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = Number(process.env.PORT) || 3002;
const SESSION_SECRET = process.env.SESSION_SECRET || 'vietjewelers-session-secret-change-in-production';

// ─── Middleware ─────────────────────────────────────────────
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Session setup (using default MemoryStore for dev, SQLite store can be added later)
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    sameSite: 'lax',
  },
}));

// ─── Static files ──────────────────────────────────────────
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// ─── Public API Routes ─────────────────────────────────────
app.use('/api/products', productsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/collections', collectionsRouter);
app.use('/api/blog-posts', blogPostsRouter);
app.use('/api/testimonials', testimonialsRouter);
app.use('/api/auth', authRouter);

// ─── Admin API Routes ──────────────────────────────────────
app.use('/api/admin/products', adminProductsRouter);
app.use('/api/admin/collections', adminCollectionsRouter);
app.use('/api/admin/blog-posts', adminBlogPostsRouter);
app.use('/api/admin/testimonials', adminTestimonialsRouter);
app.use('/api/admin/categories', adminCategoriesRouter);
app.use('/api/admin/upload', adminUploadRouter);

// ─── Serve frontend in production ──────────────────────────
const distDir = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  // SPA fallback: serve index.html for all non-API routes
  app.get('{*path}', (_req, res) => {
    res.sendFile(path.join(distDir, 'index.html'));
  });
}

// ─── Start server ──────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 VietJewelers API server running on http://localhost:${PORT}`);
  console.log(`   Public API: http://localhost:${PORT}/api/products`);
  console.log(`   Admin API:  http://localhost:${PORT}/api/admin/*`);
});

export default app;
