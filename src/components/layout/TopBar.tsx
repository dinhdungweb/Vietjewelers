import { Phone, Mail, MapPin } from 'lucide-react';
import { Link } from 'react-router';

export default function TopBar() {
  return (
    <div className="w-full bg-black text-white text-[11px] tracking-wider">
      <div className="container-fluid flex justify-between items-center py-2">
        <div className="flex items-center gap-6">
          <a
            href="tel:+84865705484"
            className="flex items-center gap-1.5 hover:text-primary transition-colors"
          >
            <Phone className="w-3 h-3" />
            <span>+84865705484</span>
          </a>
          <a
            href="mailto:Vietjewelers@gmail.com"
            className="hidden sm:flex items-center gap-1.5 hover:text-primary transition-colors"
          >
            <Mail className="w-3 h-3" />
            <span>Vietjewelers@gmail.com</span>
          </a>
        </div>
        <Link
          to="/pages/contact"
          className="flex items-center gap-1.5 hover:text-primary transition-colors"
        >
          <MapPin className="w-3 h-3" />
          <span className="hidden sm:inline">Find a Store</span>
        </Link>
      </div>
    </div>
  );
}
