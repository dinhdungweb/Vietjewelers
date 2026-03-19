import { useTranslation } from 'react-i18next';
import CategoryCard from '../ui/CategoryCard';
import type { Category } from '../../types/product';

// Default category images from original design
const CATEGORY_IMAGES: Record<string, string> = {
  rings: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDapA7JsqD2jdnpAmD9Dd-68NTfLbM1BggmBRYrAPHkq8Cwx8kboBomlsbYMbeiRLjZrxq0VbrsXabFr1YWvRzgsySApuDZ5g9_BdFAofGM6om6hRgyiPR9pkapIHkR3LaXmGOTtphrKDK1s05GEsVnTEHQZP_Til8umN6ob7lqA8-8QzmjFhu06f2V58tKEhdh623GzFLvvdpf2hUsEDCpduiV6KOtIcyVyGV-ge8dQGpSHkrGZfh5H_yjPKhavox_rtfu7XwXWw',
  bracelets: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDV-57BXzDWr6tNQxWt1OD-u7i0EimgcCrissJPDMTq2WTWWKxSYa7wkVmS9DuB-el-mGh30KkaLvF45I_-mevZZ72IVbrVaTTLx3eE8WjVD9ZhGHZcMMNePz-LGk-vtuKLgARGj-vPbOn2hNgqhMqYoLPH7nr242e_4fMogIxkQfvqbU5SBCQA0UykuBLaxv3Hux_mEp5QN5pGCnRxhj7Mi7WYK4_8L1FR-Ll8dtWWeqIgaHlKFZ0ltDT2JXlfrlAljPdnKvAriA',
  necklaces: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBSpu3Uql5DNMHw0JKliirANLtohxRSGBztCXaZP9IUgEip48FYHulMekGe4DXYgThVNv_oPTQwTzCTYvmGLboPfkn4LwRUPUlwcwA0SWGTJa9WMGKJPNH3VwQ2g6YjdytVNeoA2lRao_gaBRlffNYpLjf-2_YrkKjXTu89772pgfWII2YjQKW_BeS-E_71zluCtkJiR-ngmwTbyqfHxBaBFt1BQkC6zrg_k66gwqMXmNu2SWScUIn0zjkSzVtUL-QQV-4ih5mEKw',
  earrings: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDADFLANcU-fh3AKDSM0YWv0SP_PuBf73c1vKcoUWFkPiJcxlKt1W94ro14UtUvDeG66xjRCOMMApL0qV-ISTLD2oiYsYmD6Om4yvuoElPmuowJaVwpXnGKBK32h0qT0MN-kg2A086S0JpJVy5Oz3CFFJC1RciAHfknLP51IVBKXki1yLehlwUD0qTNMnSbPavGyAuJBZC1eA5rBzgx9IybS-HpQyjXKELY3f2rQgBMUjfm7tvVzWISea7F-hA2zuV3Se_s6msiDg',
};

interface CategoryGridProps {
  categories: Category[];
}

export default function CategoryGrid({ categories }: CategoryGridProps) {
  const { t } = useTranslation();

  // Show top 4 categories with best images
  const displayCategories = ['rings', 'earrings', 'necklaces', 'bracelets'];
  const displayed = displayCategories
    .map(slug => categories.find(c => c.slug === slug))
    .filter(Boolean) as Category[];

  return (
    <section className="max-w-[1440px] mx-auto px-6 py-16 md:py-20">
      <div className="flex flex-col items-center mb-12">
        <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
          {t('categories.title')}
        </h3>
        <div className="w-20 h-1 bg-primary mt-2" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {displayed.map(cat => (
          <CategoryCard
            key={cat.slug}
            slug={cat.slug}
            label={t(`categories.${cat.slug}`, cat.label)}
            image={CATEGORY_IMAGES[cat.slug] || cat.image}
          />
        ))}
      </div>
    </section>
  );
}
