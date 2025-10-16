import Hero from "./components/hero";
import Products from "./components/products";
import OffersCarousel from "./components/offers-carousel";

export default function Home() {
  return (
    <main className="w-full min-h-screen">
      <Hero />
      <div className="container mx-auto px-4 py-8">
        <OffersCarousel />
      </div>
      <Products />
    </main>
  );
}
