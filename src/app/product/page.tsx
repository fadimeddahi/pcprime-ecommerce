import ProductDetail from "../components/product-detail";

export default function ProductPage() {
  // Example product data
  const product = {
    id: 1,
    name: "PC Gamer RTX 4090 Ultimate",
    category: "PC Gaming",
    image: "/pc gamer.jpeg",
    price: 8999.99,
    oldPrice: 10999.99,
    description: "PC Gamer haute performance équipé d'une carte graphique RTX 4090, processeur Intel Core i9-13900K, 32GB RAM DDR5, et SSD NVMe 2TB. Parfait pour le gaming 4K et les applications professionnelles exigeantes.",
    specs: [
      { label: "Processeur", value: "Intel Core i9-13900K" },
      { label: "Carte Graphique", value: "NVIDIA RTX 4090 24GB" },
      { label: "Mémoire RAM", value: "32GB DDR5 6000MHz" },
      { label: "Stockage", value: "2TB NVMe SSD" },
      { label: "Alimentation", value: "1000W 80+ Gold" },
      { label: "Boîtier", value: "ATX RGB avec vitre trempée" },
      { label: "Refroidissement", value: "Watercooling AIO 360mm" },
      { label: "Système", value: "Windows 11 Pro" },
    ],
    inStock: true,
    rating: 4.8,
    reviews: 124,
    isPromo: true,
    isTopSeller: true,
  };

  return <ProductDetail product={product} />;
}
