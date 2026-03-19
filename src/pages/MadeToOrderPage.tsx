import { Link } from 'react-router';
import { Helmet } from 'react-helmet-async';

export default function MadeToOrderPage() {
  return (
    <>
      <Helmet>
        <title>Made to Order | Viet Jewelers - Custom Jewelry in Hanoi</title>
        <meta name="description" content="Order custom-made jewelry at Viet Jewelers in Hanoi Old Quarter. From concept to creation, we craft unique pieces tailored to your style. Silver & gold available." />
      </Helmet>

      <div className="page-header">
        <div className="breadcrumb mb-3">
          <Link to="/">Home</Link>
          <span>/</span>
          <span>Made to Order</span>
        </div>
        <h1>Made to Order</h1>
      </div>

      <div className="container py-8 lg:py-12 pb-20">
        <div className="max-w-3xl mx-auto">
          <div className="prose prose-sm max-w-none text-foreground-secondary leading-relaxed space-y-6">
            <p className="text-base">At Viet Jewelers, we specialize in creating custom jewelry that tells your story. Whether you have a specific design in mind or need guidance from our artisans, we'll work closely with you to bring your vision to life.</p>

            <h2 className="text-xl font-medium text-foreground">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
              <div className="text-center p-6 bg-background-secondary rounded-lg">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 text-primary font-bold text-lg">1</div>
                <h3 className="text-sm font-semibold mb-2 text-foreground">Consultation</h3>
                <p className="text-xs">Share your design idea with us — through a sketch, photo, or description.</p>
              </div>
              <div className="text-center p-6 bg-background-secondary rounded-lg">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 text-primary font-bold text-lg">2</div>
                <h3 className="text-sm font-semibold mb-2 text-foreground">Crafting</h3>
                <p className="text-xs">Our artisans handcraft your piece using premium silver or gold materials.</p>
              </div>
              <div className="text-center p-6 bg-background-secondary rounded-lg">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 text-primary font-bold text-lg">3</div>
                <h3 className="text-sm font-semibold mb-2 text-foreground">Delivery</h3>
                <p className="text-xs">Pick up at our store or have it shipped to your location worldwide.</p>
              </div>
            </div>

            <h2 className="text-xl font-medium text-foreground">What We Can Make</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Custom rings (engagement, wedding, signet, statement)</li>
              <li>Personalized necklaces and pendants</li>
              <li>Custom earrings and ear cuffs</li>
              <li>Bracelets and bangles</li>
              <li>Custom grillz</li>
              <li>Engraved jewelry with names, dates, or symbols</li>
            </ul>

            <h2 className="text-xl font-medium text-foreground">Processing Time</h2>
            <p>Custom orders typically take 3-7 working days depending on complexity. Rush orders may be available — please contact us for details.</p>

            <h2 className="text-xl font-medium text-foreground">Pricing</h2>
            <p>Custom pricing depends on design complexity, material choice, and size. We provide a quote before starting any work. No hidden fees.</p>

            <div className="bg-background-secondary rounded-lg p-6 text-center mt-8">
              <h3 className="text-lg font-medium text-foreground mb-2">Start Your Custom Order</h3>
              <p className="mb-4">Contact us to discuss your custom jewelry design.</p>
              <div className="flex gap-3 justify-center">
                <Link to="/pages/contact" className="btn btn-primary">
                  Contact Us
                </Link>
                <a href="https://www.instagram.com/vietjewelers" target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                  Message on Instagram
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
