import { formatPrice } from '../../utils/formatPrice';

interface PriceDisplayProps {
  price: number;
  compareAtPrice?: number | null;
  className?: string;
}

export default function PriceDisplay({ price, compareAtPrice, className = '' }: PriceDisplayProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-primary font-bold">{formatPrice(price)}</span>
      {compareAtPrice && compareAtPrice > price && (
        <span className="text-slate-400 line-through text-sm">{formatPrice(compareAtPrice)}</span>
      )}
    </div>
  );
}
