export interface Product {
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
  variants: Variant[];
  availability: 'in_stock' | 'out_of_stock';
  collections: string[];
}

export interface Variant {
  title: string;
  price: number;
  available: boolean;
}

export interface Category {
  slug: string;
  label: string;
  count: number;
  image: string;
}

export interface Collection {
  handle: string;
  title: string;
  image: string | null;
  parentHandle: string | null;
  productCount: number;
}

export interface BlogPost {
  handle: string;
  title: string;
  excerpt: string;
  image: string;
  tags: string[];
  date: string;
  content: string;
}

export interface Testimonial {
  name: string;
  title: string;
  text: string;
  image: string;
}

export interface CartItem {
  product: Product;
  variant: Variant | null;
  quantity: number;
}
