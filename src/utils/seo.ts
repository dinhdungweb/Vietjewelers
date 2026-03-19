import type { Product } from '../types/product';

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Viet Jewelers',
    url: 'https://vietjewelers.com',
    logo: 'https://vietjewelers.com/logo.svg',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+84865705484',
      email: 'Vietjewelers@gmail.com',
      contactType: 'customer service',
    },
    sameAs: [
      'https://www.instagram.com/vietjewelers',
      'https://zalo.me/3752213412889536069',
    ],
  };
}

export function productJsonLd(product: Product) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.seoDescription || product.title,
    image: product.images,
    brand: {
      '@type': 'Brand',
      name: 'VIETJEWELERS',
    },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'VND',
      availability: 'https://schema.org/InStock',
      url: `https://vietjewelers.com/products/${product.handle}`,
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
