import { Truck, ShieldCheck, Headphones, CreditCard } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const ITEMS: { icon: LucideIcon; title: string; desc: string }[] = [
  {
    icon: Truck,
    title: 'Free Shipping',
    desc: 'Free Shipping for orders over $130',
  },
  {
    icon: ShieldCheck,
    title: 'Money Guarantee',
    desc: 'Within 30 days for an exchange.',
  },
  {
    icon: Headphones,
    title: 'Online Support',
    desc: '24 hours a day, 7 days a week',
  },
  {
    icon: CreditCard,
    title: 'Flexible Payment',
    desc: 'Pay with Multiple Credit Cards',
  },
];

export default function IconBoxes() {
  return (
    <section className="section-spacing pb-20">
      <div className="container-fluid">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {ITEMS.map((item) => (
            <div key={item.title} className="flex items-start gap-4 p-4">
              <div className="flex-shrink-0 w-[50px] h-[50px] flex items-center justify-center">
                <item.icon className="w-10 h-10 text-primary" strokeWidth={1.2} />
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-sm font-semibold uppercase tracking-wider mb-1">{item.title}</h3>
                <p className="text-sm text-foreground-secondary">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
