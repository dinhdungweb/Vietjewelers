import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';

interface CategoryCardProps {
  slug: string;
  label: string;
  image: string;
}

export default function CategoryCard({ slug, label, image }: CategoryCardProps) {
  const { t } = useTranslation();

  return (
    <Link to={`/category/${slug}`} className="group relative aspect-square overflow-hidden cursor-pointer block">
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
        style={{ backgroundImage: `url('${image}')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <div className="absolute bottom-6 left-6 right-6 flex flex-col items-center">
        <h4 className="text-white text-xl font-bold uppercase tracking-widest text-center">{label}</h4>
        <span className="text-white/80 text-xs font-semibold uppercase mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {t('categories.explore')}
        </span>
      </div>
    </Link>
  );
}
