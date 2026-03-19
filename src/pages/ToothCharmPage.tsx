import { Link } from 'react-router';
import { Helmet } from 'react-helmet-async';

export default function ToothCharmPage() {
  return (
    <>
      <Helmet>
        <title>Tooth Charm Service | Viet Jewelers - Custom Tooth Gems in Hanoi</title>
        <meta name="description" content="Get a custom tooth charm at Viet Jewelers in Hanoi Old Quarter. Professional tooth gem application with sterling silver and gold designs. Walk-ins welcome." />
      </Helmet>

      <div className="page-header">
        <div className="breadcrumb mb-3">
          <Link to="/">Home</Link>
          <span>/</span>
          <span>Tooth Charm</span>
        </div>
        <h1>Tooth Charm</h1>
      </div>

      <div className="container py-8 lg:py-12 pb-20">
        <div className="max-w-3xl mx-auto">
          <div className="prose prose-sm max-w-none text-foreground-secondary leading-relaxed space-y-6">
            <div className="aspect-video rounded-lg overflow-hidden mb-8">
              <img
                src="https://vietjewelers.com/cdn/shop/files/IMG_1352.jpg?v=1740834380&width=1200"
                alt="Tooth Charm Service at Viet Jewelers"
                className="w-full h-full object-cover"
              />
            </div>

            <h2 className="text-xl font-medium text-foreground">What is a Tooth Charm?</h2>
            <p>A tooth charm is a small piece of jewelry — typically crafted from sterling silver or gold — that is bonded to the surface of a tooth. It's a subtle, stylish way to add a unique sparkle to your smile.</p>

            <h2 className="text-xl font-medium text-foreground">Our Tooth Charm Service</h2>
            <p>At Viet Jewelers, we offer professional tooth charm application using high-quality materials and safe bonding techniques. Each charm is handcrafted by our skilled artisans, ensuring a unique and personalized look.</p>

            <h2 className="text-xl font-medium text-foreground">How It Works</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Choose your design from our collection or request a custom piece</li>
              <li>Our team will clean and prepare the tooth surface</li>
              <li>The charm is carefully bonded using dental-grade adhesive</li>
              <li>The process takes approximately 15-30 minutes</li>
            </ul>

            <h2 className="text-xl font-medium text-foreground">Pricing</h2>
            <p>Prices start from 200,000 VND depending on the design and material. Custom designs are available upon request.</p>

            <div className="bg-background-secondary rounded-lg p-6 text-center mt-8">
              <h3 className="text-lg font-medium text-foreground mb-2">Ready to sparkle?</h3>
              <p className="mb-4">Visit our store or contact us to book your tooth charm appointment.</p>
              <Link to="/pages/contact" className="btn btn-primary">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
