import { Link } from 'react-router';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-background-secondary pb-14 md:pb-0">
      {/* Newsletter */}
      <div className="border-b border-border">
        <div className="container py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-medium text-heading mb-1">Let's get in touch</h3>
            <p className="text-foreground-secondary text-sm">
              Sign up for our newsletter and receive 10% off your first order!
            </p>
          </div>
          <form onSubmit={(e) => e.preventDefault()} className="flex w-full max-w-md">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 border border-border px-4 py-3 text-sm focus:outline-none focus:border-foreground rounded-l"
            />
            <button
              type="submit"
              className="bg-button text-button-text px-4 py-3 rounded-r hover:bg-foreground transition-colors"
              aria-label="Subscribe"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </form>
        </div>
      </div>

      {/* Main footer */}
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: Main Menu */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-heading mb-5">Main menu</h4>
            <ul className="space-y-2.5">
              <li><Link to="/" className="text-sm text-foreground-secondary hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/pages/about" className="text-sm text-foreground-secondary hover:text-primary transition-colors">About</Link></li>
              <li><Link to="/collections/all-products" className="text-sm text-foreground-secondary hover:text-primary transition-colors">Shop</Link></li>
              <li><Link to="/collections" className="text-sm text-foreground-secondary hover:text-primary transition-colors">Collection</Link></li>
              <li><Link to="/blogs/news" className="text-sm text-foreground-secondary hover:text-primary transition-colors">Blog</Link></li>
              <li><Link to="/pages/contact" className="text-sm text-foreground-secondary hover:text-primary transition-colors">Contact</Link></li>
              <li><Link to="/collections/service" className="text-sm text-foreground-secondary hover:text-primary transition-colors">Service</Link></li>
            </ul>
          </div>

          {/* Column 2: Information */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-heading mb-5">Information</h4>
            <ul className="space-y-2.5">
              <li><Link to="/" className="text-sm text-foreground-secondary hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/pages/about" className="text-sm text-foreground-secondary hover:text-primary transition-colors">About</Link></li>
              <li><Link to="/collections/all-products" className="text-sm text-foreground-secondary hover:text-primary transition-colors">Shop</Link></li>
              <li><Link to="/collections" className="text-sm text-foreground-secondary hover:text-primary transition-colors">Collection</Link></li>
              <li><Link to="/blogs/news" className="text-sm text-foreground-secondary hover:text-primary transition-colors">Blog</Link></li>
              <li><Link to="/pages/contact" className="text-sm text-foreground-secondary hover:text-primary transition-colors">Contact</Link></li>
              <li><Link to="/collections/service" className="text-sm text-foreground-secondary hover:text-primary transition-colors">Service</Link></li>
            </ul>
          </div>

          {/* Column 3: Our Store */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-heading mb-5">Our store</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-foreground-secondary">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>152 P. Hàng Bông, Phố cổ Hà Nội, Hoàn Kiếm, Hà Nội</span>
              </li>
              <li>
                <a href="tel:+84865705484" className="flex items-center gap-2 text-sm text-foreground-secondary hover:text-primary transition-colors">
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <span>+84865705484</span>
                </a>
              </li>
              <li>
                <a href="mailto:Vietjewelers@gmail.com" className="flex items-center gap-2 text-sm text-foreground-secondary hover:text-primary transition-colors">
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <span>Vietjewelers@gmail.com</span>
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-foreground-secondary">
                <Clock className="w-4 h-4 flex-shrink-0" />
                <span>Every day 9am - 10pm</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Social & Logo */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-heading mb-5">Follow us</h4>
            <div className="flex gap-3 mb-6">
              <a
                href="https://www.pinterest.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-[#E9E9E9] flex items-center justify-center text-foreground hover:bg-foreground hover:text-white transition-all duration-300"
                aria-label="Pinterest"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
                </svg>
              </a>
              <a
                href="https://www.facebook.com/VietJewelers"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-[#E9E9E9] flex items-center justify-center text-foreground hover:bg-foreground hover:text-white transition-all duration-300"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/vietjewelers"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-[#E9E9E9] flex items-center justify-center text-foreground hover:bg-foreground hover:text-white transition-all duration-300"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a
                href="https://twitter.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-[#E9E9E9] flex items-center justify-center text-foreground hover:bg-foreground hover:text-white transition-all duration-300"
                aria-label="Twitter"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
            <Link to="/">
              <img
                src="https://vietjewelers.com/cdn/shop/files/Logo_Ch.png?v=1740834295"
                alt="Viet Jewelers"
                className="h-10 opacity-60"
              />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <div className="container py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-foreground-secondary">
            © VIETJEWELERS {new Date().getFullYear()}
          </p>
          <div className="flex items-center gap-2">
            <img
              src="https://vietjewelers.com/cdn/shopifycloud/shopify/assets/payment_icons/visa-319d545c18571fdeae3f0f89f1a34b58a0f56c4b3faaf0813b15bff4d4ea8e01.svg"
              alt="Visa"
              className="h-6"
            />
            <img
              src="https://vietjewelers.com/cdn/shopifycloud/shopify/assets/payment_icons/master-173035bc8124581983d4bbe3764c20b394e35f0e1f11f9c20e5c25e81db5be60.svg"
              alt="Mastercard"
              className="h-6"
            />
            <img
              src="https://vietjewelers.com/cdn/shopifycloud/shopify/assets/payment_icons/paypal-49e4c1e03244b6d2de0d270ca0d22dd15da6e92cc7266e93eb43762df5aa355d.svg"
              alt="PayPal"
              className="h-6"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
