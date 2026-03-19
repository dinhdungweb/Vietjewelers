import { Link } from 'react-router';
import type { Category } from '../../types/product';

interface CategoryCarouselProps {
  categories: Category[];
}

const CATEGORY_ORDER = ['bracelets', 'pendants', 'earrings', 'rings', 'nose-ring', 'brooch'];

export default function CategoryCarousel({ categories }: CategoryCarouselProps) {
  // Order categories to match live site
  const ordered = CATEGORY_ORDER
    .map((slug) => categories.find((c) => c.slug === slug))
    .filter(Boolean) as Category[];

  // Add any remaining categories not in the order
  const remaining = categories.filter((c) => !CATEGORY_ORDER.includes(c.slug));
  const allCategories = [...ordered, ...remaining];

  if (allCategories.length === 0) return null;

  return (
    <section className="section-spacing">
      <div className="container">
        <h2 className="text-2xl md:text-3xl font-medium text-center mb-10">
          Shop by Categories
        </h2>

        <div className="flex gap-6 md:gap-8 overflow-x-auto scrollbar-hide pb-4 justify-center flex-wrap">
          {allCategories.map((cat) => (
            <Link
              key={cat.slug}
              to={`/collections/${cat.slug}`}
              className="flex flex-col items-center gap-3 flex-shrink-0 group"
            >
              <div className="w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full overflow-hidden border-2 border-border group-hover:border-primary transition-colors">
                <img
                  src={cat.image}
                  alt={cat.label}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                {cat.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
