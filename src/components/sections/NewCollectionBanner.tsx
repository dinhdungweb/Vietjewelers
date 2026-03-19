import { Link } from 'react-router';

export default function NewCollectionBanner() {
  return (
    <section className="section-spacing">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link to="/collections/garnet-collection" className="relative group overflow-hidden rounded">
            <div className="aspect-[4/3] bg-background-secondary">
              <img
                src="https://vietjewelers.com/cdn/shop/files/rg-cresent-moon-embracing-the-sun-gp_2.jpg?v=1740834646&width=800"
                alt="New Collection"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 text-white">
              <span className="text-xs uppercase tracking-widest mb-2">New collection</span>
              <h3 className="text-xl md:text-2xl font-medium mb-4">Garnet Collection</h3>
              <span className="text-sm underline underline-offset-4 group-hover:text-primary transition-colors">
                Shop New Collection
              </span>
            </div>
          </Link>

          <Link to="/collections/men-collection" className="relative group overflow-hidden rounded">
            <div className="aspect-[4/3] bg-background-secondary">
              <img
                src="https://vietjewelers.com/cdn/shop/files/ek-chain-double-pole-gp.jpg?v=1740834639&width=800"
                alt="Men's Collection"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 text-white">
              <span className="text-xs uppercase tracking-widest mb-2">New collection</span>
              <h3 className="text-xl md:text-2xl font-medium mb-4">Men's Collection</h3>
              <span className="text-sm underline underline-offset-4 group-hover:text-primary transition-colors">
                Shop New Collection
              </span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
