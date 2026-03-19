import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { parse } from 'csv-parse/sync';
import { join } from 'path';

const ROOT = join(import.meta.dirname, '..');
const CSV_PATH = join(ROOT, 'products_export_1.csv');
const OUT_DIR = join(ROOT, 'public', 'data');

// Category mapping from Google Shopping path or Type field
const CATEGORY_MAP: Record<string, { slug: string; label: string }> = {
  'rings': { slug: 'rings', label: 'Rings' },
  'earrings': { slug: 'earrings', label: 'Earrings' },
  'necklaces': { slug: 'necklaces', label: 'Necklaces' },
  'charms & pendants': { slug: 'charms-pendants', label: 'Charms & Pendants' },
  'bracelets': { slug: 'bracelets', label: 'Bracelets' },
  'body jewelry': { slug: 'body-jewelry', label: 'Body Jewelry' },
  'watches': { slug: 'watches', label: 'Watches' },
  'brooches & lapel pins': { slug: 'brooches', label: 'Brooches & Lapel Pins' },
};

// Map product Type to category slug
const TYPE_TO_CATEGORY: Record<string, string> = {
  'silver ring': 'rings',
  'gold ring': 'rings',
  'gold plate silver ring': 'rings',
  'ear hoop': 'earrings',
  'ear hook': 'earrings',
  'ear stud': 'earrings',
  'ear cuff': 'earrings',
  'hoopies': 'earrings',
  'silver necklace': 'necklaces',
  'gold necklace': 'necklaces',
  'pendant': 'charms-pendants',
  'chain bracelet': 'bracelets',
  'bangle': 'bracelets',
  'nose ring': 'body-jewelry',
  'grillz': 'body-jewelry',
  'brooch': 'brooches',
  'chain': 'necklaces',
};

interface CsvRow {
  Handle: string;
  Title: string;
  'Body (HTML)': string;
  Vendor: string;
  'Product Category': string;
  Type: string;
  Tags: string;
  Published: string;
  'Variant Price': string;
  'Variant Compare At Price': string;
  'Image Src': string;
  'Image Position': string;
  'SEO Title': string;
  'SEO Description': string;
  Status: string;
  'Option1 Name': string;
  'Option1 Value': string;
  'Variant Inventory Qty': string;
}

// Map product type to collection handles
const TYPE_TO_COLLECTIONS: Record<string, string[]> = {
  'silver ring': ['rings', 'silver-ring'],
  'gold ring': ['rings'],
  'gold plate silver ring': ['rings', 'gold-plate-silver-ring'],
  'ear hoop': ['earrings', 'ear-hoop'],
  'ear hook': ['earrings', 'ear-hook'],
  'ear stud': ['earrings', 'ear-stud'],
  'ear cuff': ['earrings', 'ear-cuff'],
  'hoopies': ['earrings', 'ear-hoop'],
  'silver necklace': ['pendants', 'silver-necklace'],
  'gold necklace': ['pendants'],
  'gold plate silver necklace': ['pendants', 'gold-plate-silver-necklace'],
  'pendant': ['pendants', 'pendant'],
  'chain bracelet': ['bracelets', 'chain-bracelet'],
  'bangle': ['bracelets', 'bangle'],
  'anklet': ['bracelets', 'anklet'],
  'nose ring': ['nose-ring'],
  'nostril': ['nose-ring', 'nostril'],
  'septum': ['nose-ring', 'septum'],
  'grillz': ['grillz'],
  'brooch': ['brooch'],
  'chain': ['pendants', 'chain'],
  'toe ring': ['rings', 'toe-ring'],
  'texture band ring': ['rings', 'texture-band-ring'],
  'shaky ring': ['rings', 'shaky-rings'],
  'stone ring': ['rings', 'stone-ring'],
};

// Order matters: check more specific keys first (e.g., "earrings" before "rings")
const CATEGORY_MATCH_ORDER = [
  'earrings',
  'brooches & lapel pins',
  'charms & pendants',
  'body jewelry',
  'bracelets',
  'necklaces',
  'watches',
  'rings',
];

function extractCategoryFromPath(categoryPath: string): string | null {
  if (!categoryPath) return null;
  const lower = categoryPath.toLowerCase();
  for (const key of CATEGORY_MATCH_ORDER) {
    if (lower.includes(key)) return CATEGORY_MAP[key].slug;
  }
  return null;
}

function inferCategoryFromType(type: string): string {
  if (!type) return 'other';
  const lower = type.toLowerCase().trim();
  return TYPE_TO_CATEGORY[lower] || 'other';
}

function sanitizeHtml(html: string): string {
  if (!html) return '';
  // Strip data- attributes but keep safe HTML tags
  return html
    .replace(/\s*data-[\w-]+="[^"]*"/g, '')
    .replace(/\s*data-[\w-]+='[^']*'/g, '')
    .trim();
}

function main() {
  console.log('Reading CSV...');
  const csvContent = readFileSync(CSV_PATH, 'utf-8');

  const rows: CsvRow[] = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    relax_column_count: true,
  });

  console.log(`Parsed ${rows.length} rows`);

  // Group rows by handle
  const productMap = new Map<string, {
    main: CsvRow;
    images: string[];
    price: number;
    compareAtPrice: number | null;
    variants: Array<{ title: string; price: number; available: boolean }>;
  }>();

  for (const row of rows) {
    const handle = row.Handle?.trim();
    if (!handle) continue;

    const variantPrice = parseFloat(row['Variant Price']) || 0;
    const variantQty = parseInt(row['Variant Inventory Qty'] || '0', 10);
    const optionValue = row['Option1 Value']?.trim();

    if (!productMap.has(handle)) {
      const compareAt = parseFloat(row['Variant Compare At Price']) || null;
      const images: string[] = [];
      if (row['Image Src']?.trim()) {
        images.push(row['Image Src'].trim());
      }
      const variants: Array<{ title: string; price: number; available: boolean }> = [];
      if (optionValue && optionValue !== 'Default Title') {
        variants.push({ title: optionValue, price: variantPrice, available: variantQty > 0 });
      }
      productMap.set(handle, {
        main: row,
        images,
        price: variantPrice,
        compareAtPrice: compareAt,
        variants,
      });
    } else {
      const existing = productMap.get(handle)!;
      if (row['Image Src']?.trim()) {
        existing.images.push(row['Image Src'].trim());
      }
      if (!existing.main.Title?.trim() && row.Title?.trim()) {
        existing.main = row;
      }
      if (variantPrice > existing.price) {
        existing.price = variantPrice;
      }
      if (optionValue && optionValue !== 'Default Title') {
        existing.variants.push({ title: optionValue, price: variantPrice, available: variantQty > 0 });
      }
    }
  }

  console.log(`Found ${productMap.size} unique products`);

  // Build products array
  const products: Array<{
    handle: string;
    title: string;
    description: string;
    vendor: string;
    category: string;
    categoryLabel: string;
    type: string;
    tags: string[];
    price: number;
    compareAtPrice: number | null;
    images: string[];
    primaryImage: string;
    secondaryImage: string | null;
    seoTitle: string;
    seoDescription: string;
    variants: Array<{ title: string; price: number; available: boolean }>;
    availability: 'in_stock' | 'out_of_stock';
    collections: string[];
  }> = [];

  const categoryCounts = new Map<string, { count: number; image: string }>();

  for (const [handle, data] of productMap) {
    const { main, images, price, compareAtPrice } = data;

    // Filter: only active + published (check both main row and raw values)
    const status = main.Status?.trim().toLowerCase();
    const published = main.Published?.trim().toLowerCase();
    if (status !== 'active') continue;
    if (published !== 'true') continue;

    // Skip products with no images
    if (images.length === 0) continue;

    // Determine category
    let categorySlug = extractCategoryFromPath(main['Product Category']);
    if (!categorySlug) {
      categorySlug = inferCategoryFromType(main.Type);
    }

    const categoryInfo = Object.values(CATEGORY_MAP).find(c => c.slug === categorySlug)
      || { slug: categorySlug, label: categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1) };

    const tags = main.Tags
      ? main.Tags.split(',').map(t => t.trim()).filter(Boolean)
      : [];

    // Determine collections from type
    const typeKey = (main.Type?.trim() || '').toLowerCase();
    const collections = TYPE_TO_COLLECTIONS[typeKey] || [categoryInfo.slug];
    // Ensure main category is in collections
    if (!collections.includes(categoryInfo.slug) && categoryInfo.slug !== 'other') {
      collections.unshift(categoryInfo.slug);
    }

    const product = {
      handle,
      title: main.Title?.trim() || handle.replace(/-/g, ' ').toUpperCase(),
      description: sanitizeHtml(main['Body (HTML)'] || ''),
      vendor: main.Vendor?.trim() || 'VIETJEWELERS',
      category: categoryInfo.slug,
      categoryLabel: categoryInfo.label,
      type: main.Type?.trim() || '',
      tags,
      price,
      compareAtPrice,
      images,
      primaryImage: images[0],
      secondaryImage: images.length > 1 ? images[1] : null,
      seoTitle: main['SEO Title']?.trim() || '',
      seoDescription: main['SEO Description']?.trim() || '',
      variants: data.variants,
      availability: (data.variants.length === 0 || data.variants.some(v => v.available)) ? 'in_stock' as const : 'out_of_stock' as const,
      collections,
    };

    products.push(product);

    // Track category counts
    if (!categoryCounts.has(categoryInfo.slug)) {
      categoryCounts.set(categoryInfo.slug, { count: 0, image: images[0] });
    }
    categoryCounts.get(categoryInfo.slug)!.count++;
  }

  // Sort products by price descending (showcase high-value items first)
  products.sort((a, b) => b.price - a.price);

  console.log(`Processed ${products.length} active products`);

  // Build categories array
  const categories = Array.from(categoryCounts.entries())
    .map(([slug, { count, image }]) => {
      const info = Object.values(CATEGORY_MAP).find(c => c.slug === slug)
        || { slug, label: slug.charAt(0).toUpperCase() + slug.slice(1) };
      return {
        slug: info.slug,
        label: info.label,
        count,
        image,
      };
    })
    .sort((a, b) => b.count - a.count);

  console.log('Categories:', categories.map(c => `${c.label} (${c.count})`).join(', '));

  // Write output
  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(join(OUT_DIR, 'products.json'), JSON.stringify(products, null, 2));
  writeFileSync(join(OUT_DIR, 'categories.json'), JSON.stringify(categories, null, 2));

  console.log(`\nOutput written to ${OUT_DIR}/`);
  console.log(`  products.json: ${products.length} products`);
  console.log(`  categories.json: ${categories.length} categories`);
}

main();
