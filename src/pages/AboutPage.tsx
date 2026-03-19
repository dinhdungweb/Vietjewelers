import { Link } from 'react-router';
import { Helmet } from 'react-helmet-async';
import { Gem, Heart, Sparkles } from 'lucide-react';

export default function AboutPage() {
  return (
    <>
      <Helmet>
        <title>About Us | Viet Jewelers - Handcrafted Jewelry in Hanoi Old Quarter</title>
        <meta name="description" content="Meet the young team of jewelers at Viet Jewelers, Hanoi Old Quarter. We handcraft silver & gold jewelry with Vietnamese heritage and modern design. Visit us at 152 Hang Bong." />
      </Helmet>

      <div className="page-header">
        <div className="breadcrumb mb-3">
          <Link to="/">Home</Link>
          <span>/</span>
          <span>About</span>
        </div>
        <h1>About Us</h1>
      </div>

      <div className="container py-8 lg:py-12 pb-20">
        {/* Story */}
        <div className="max-w-3xl mx-auto mb-16">
          <div className="text-base leading-relaxed text-foreground-secondary space-y-4">
            <p>We are a team of young jewelers based in Hanoi.</p>
            <p>Each of us comes from a different background, carries a different aesthetic, and brings a unique perspective into our work — but we are united by the same passion: craftsmanship.</p>
            <p>At Viet Jewelers, we believe jewelry is more than an accessory. It is a piece of identity, memory, and personal story. Every design is carefully handcrafted, from shaping the silver to setting the smallest stone, with respect for both tradition and individuality.</p>
            <p>We work closely as a collective — exchanging ideas, challenging one another, and constantly refining our skills — to create pieces that feel honest, thoughtful, and made to last.</p>
            <p>Rooted in Hanoi and inspired by the people who walk through our doors, we craft jewelry not to follow trends, but to grow with the wearer over time.</p>
          </div>
        </div>

        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center p-8">
            <div className="w-16 h-16 bg-background-secondary rounded-full flex items-center justify-center mx-auto mb-4">
              <Gem className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-3">Quality Craftsmanship</h3>
            <p className="text-sm text-foreground-secondary">
              Every piece is handcrafted with precision and care, using premium materials
              to ensure lasting beauty.
            </p>
          </div>
          <div className="text-center p-8">
            <div className="w-16 h-16 bg-background-secondary rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-3">Vietnamese Heritage</h3>
            <p className="text-sm text-foreground-secondary">
              Our designs are inspired by Vietnam's rich cultural heritage,
              blending tradition with modern aesthetics.
            </p>
          </div>
          <div className="text-center p-8">
            <div className="w-16 h-16 bg-background-secondary rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-3">Unique Design</h3>
            <p className="text-sm text-foreground-secondary">
              Each piece tells a story. We create unique designs that help you
              express your individual style.
            </p>
          </div>
        </div>

        {/* Visit us */}
        <div className="bg-background-secondary rounded-lg p-8 md:p-12 text-center">
          <h2 className="text-xl font-medium mb-3">Visit Our Store</h2>
          <p className="text-foreground-secondary mb-2">152 P. Hang Bong, Pho co Ha Noi, Hoan Kiem, Ha Noi</p>
          <p className="text-foreground-secondary mb-6">Open every day from 9am to 10pm</p>
          <Link to="/pages/contact" className="btn btn-primary">
            Contact Us
          </Link>
        </div>
      </div>
    </>
  );
}
