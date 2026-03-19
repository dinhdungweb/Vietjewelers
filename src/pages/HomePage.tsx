import { Helmet } from 'react-helmet-async';
import HeroSection from '../components/ui/HeroSection';
import CategoryCarousel from '../components/sections/CategoryCarousel';
import FeaturedProducts from '../components/sections/FeaturedProducts';
import NewCollectionBanner from '../components/sections/NewCollectionBanner';
import Testimonials from '../components/sections/Testimonials';
import IconBoxes from '../components/sections/IconBoxes';
import { useProducts } from '../hooks/useProducts';

export default function HomePage() {
  const { products, categories, loading } = useProducts();

  if (loading) return null;

  return (
    <>
      <Helmet>
        <title>VIETJEWELERS - Gold & Silver Jewelry</title>
        <meta
          name="description"
          content="Discover exquisite handcrafted gold and silver jewelry by Viet Jewelers. Vietnamese heritage meets modern design."
        />
        <link rel="canonical" href="https://vietjewelers.com/" />
      </Helmet>

      <HeroSection />
      <CategoryCarousel categories={categories} />
      <FeaturedProducts products={products} />
      <NewCollectionBanner />
      <Testimonials />
      <IconBoxes />
    </>
  );
}
