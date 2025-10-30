import HeroProductCarousel from "./components/hero-product-carousel";
import Products from "./components/products";

export default function Home() {
  return (
    <main className="w-full min-h-screen">
      <HeroProductCarousel />
      <Products />
    </main>
  );
}
