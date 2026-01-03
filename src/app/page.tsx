import HeroProductCarousel from "./components/hero-product-carousel";
import Products from "./components/products";
import { Suspense } from "react";

export default function Home() {
  return (
    <main className="w-full min-h-screen">
      <HeroProductCarousel />
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-[#fe8002]">Loading...</div></div>}>
        <Products />
      </Suspense>
    </main>
  );
}
