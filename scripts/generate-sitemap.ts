import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = join(import.meta.dirname, '..');
const PRODUCTS_PATH = join(ROOT, 'public', 'data', 'products.json');
const CATEGORIES_PATH = join(ROOT, 'public', 'data', 'categories.json');
const OUT_PATH = join(ROOT, 'public', 'sitemap.xml');
const BASE_URL = 'https://vietjewelers.com';

interface Product { handle: string; }
interface Category { slug: string; }

function main() {
  const products: Product[] = JSON.parse(readFileSync(PRODUCTS_PATH, 'utf-8'));
  const categories: Category[] = JSON.parse(readFileSync(CATEGORIES_PATH, 'utf-8'));
  const today = new Date().toISOString().split('T')[0];

  const urls: { loc: string; priority: string; changefreq: string }[] = [
    { loc: '/', priority: '1.0', changefreq: 'weekly' },
    { loc: '/products', priority: '0.9', changefreq: 'weekly' },
    { loc: '/about', priority: '0.7', changefreq: 'monthly' },
    { loc: '/contact', priority: '0.7', changefreq: 'monthly' },
  ];

  for (const cat of categories) {
    urls.push({ loc: `/category/${cat.slug}`, priority: '0.8', changefreq: 'weekly' });
  }

  for (const product of products) {
    urls.push({ loc: `/products/${product.handle}`, priority: '0.6', changefreq: 'monthly' });
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${BASE_URL}${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  writeFileSync(OUT_PATH, xml);
  console.log(`Sitemap generated: ${urls.length} URLs → ${OUT_PATH}`);
}

main();
