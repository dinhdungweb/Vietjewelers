import { useState } from 'react';
import { Link } from 'react-router';
import { Helmet } from 'react-helmet-async';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission placeholder
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <>
      <Helmet>
        <title>Contact Us | Viet Jewelers - Visit Our Hanoi Old Quarter Store</title>
        <meta name="description" content="Contact Viet Jewelers at 152 Hang Bong, Hanoi Old Quarter. Open daily 9am-10pm. Custom jewelry orders, repairs, and inquiries. Call +84865705484 or email us." />
      </Helmet>

      <div className="page-header">
        <div className="breadcrumb mb-3">
          <Link to="/">Home</Link>
          <span>/</span>
          <span>Contact</span>
        </div>
        <h1>Contact Us</h1>
      </div>

      <div className="container py-8 lg:py-12 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Contact Form */}
          <div>
            <h2 className="text-lg font-medium mb-3">Send us a message</h2>
            <p className="text-sm text-foreground-secondary mb-6">If you've got great products you're making or looking to work with us then drop us a line.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full border border-border px-4 py-3 text-sm rounded focus:outline-none focus:border-foreground"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full border border-border px-4 py-3 text-sm rounded focus:outline-none focus:border-foreground"
                  placeholder="Your email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Message</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={5}
                  className="w-full border border-border px-4 py-3 text-sm rounded focus:outline-none focus:border-foreground resize-none"
                  placeholder="Your message"
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Submit Now
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div>
            <h2 className="text-lg font-medium mb-6">Our Information</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold mb-1">Address</h4>
                  <p className="text-sm text-foreground-secondary">
                    152 P. Hàng Bông, Phố cổ Hà Nội, Hoàn Kiếm, Hà Nội
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold mb-1">Phone</h4>
                  <a href="tel:+84865705484" className="text-sm text-foreground-secondary hover:text-primary transition-colors">
                    +84865705484
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold mb-1">Email</h4>
                  <a href="mailto:Vietjewelers@gmail.com" className="text-sm text-foreground-secondary hover:text-primary transition-colors">
                    Vietjewelers@gmail.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold mb-1">Opening Hours</h4>
                  <p className="text-sm text-foreground-secondary">Every day 9am - 10pm</p>
                </div>
              </div>
            </div>

            {/* Social */}
            <div className="mt-8 pt-6 border-t border-border">
              <h4 className="text-sm font-semibold mb-4">Follow Us</h4>
              <div className="flex gap-3">
                <a
                  href="https://www.instagram.com/vietjewelers"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-foreground-secondary hover:text-primary hover:border-primary transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </a>
                <a
                  href="https://www.facebook.com/VietJewelers"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-foreground-secondary hover:text-primary hover:border-primary transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href="https://zalo.me/3752213412889536069"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-foreground-secondary hover:text-primary hover:border-primary transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 48 48" fill="currentColor">
                    <path d="M24 0C10.745 0 0 10.745 0 24s10.745 24 24 24 24-10.745 24-24S37.255 0 24 0zm11.136 16.32c-.36-.864-1.44-1.44-2.592-1.44-1.44 0-2.592.864-3.168 1.872-.576-1.008-1.728-1.872-3.168-1.872-1.152 0-2.232.576-2.592 1.44-.72 1.728 1.008 4.032 5.76 6.912 4.752-2.88 6.48-5.184 5.76-6.912zM12.48 32.16c5.472 0 8.64-3.168 8.64-6.624 0-2.88-1.728-4.32-3.456-5.184 1.152-.72 1.872-1.872 1.872-3.168 0-2.592-2.592-4.032-5.76-4.032-2.016 0-4.32.72-5.76 1.728l1.44 2.592c1.008-.72 2.304-1.152 3.456-1.152 1.44 0 2.304.576 2.304 1.44 0 1.008-1.008 1.584-2.592 1.584H11.04v2.88h1.872c1.872 0 3.024.72 3.024 1.872 0 1.152-1.152 2.16-3.456 2.16-1.44 0-3.168-.576-4.32-1.44l-1.44 2.736c1.584 1.152 3.744 1.728 5.76 1.728z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
