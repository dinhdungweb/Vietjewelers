import { useState, useEffect } from 'react';
import { Link } from 'react-router';

const SLIDES = [
  {
    image: 'https://vietjewelers.com/cdn/shop/files/IMG_1352.jpg?v=1740834380&width=2000',
    subtitle: 'New Arrivals',
    title: 'Viet Jewelers\nGold & Silver Jewelry',
    cta: 'Shop Now',
    link: '/collections/all-products',
  },
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (SLIDES.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const slide = SLIDES[currentSlide];

  return (
    <section className="relative w-full h-[500px] md:h-[600px] lg:h-[85vh] overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
        style={{ backgroundImage: `url('${slide.image}')` }}
      >
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Content — left-aligned like live site */}
      <div className="relative h-full container-fluid flex flex-col items-start justify-center text-left text-white">
        <span
          className="uppercase tracking-[0.3em] text-xs md:text-sm font-medium mb-4 opacity-90"
        >
          {slide.subtitle}
        </span>
        <h2
          className="text-[28px] sm:text-4xl md:text-5xl lg:text-[50px] xl:text-[70px] font-medium leading-[1.15] max-w-3xl mb-8 whitespace-pre-line"
        >
          {slide.title}
        </h2>
        <Link
          to={slide.link}
          className="inline-flex items-center justify-center px-10 py-3.5 text-sm tracking-wider uppercase font-medium border border-white text-white bg-transparent hover:bg-white hover:text-black transition-all duration-300 rounded-[5px]"
        >
          {slide.cta}
        </Link>
      </div>

      {/* Dots */}
      {SLIDES.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                i === currentSlide ? 'bg-white scale-110' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
