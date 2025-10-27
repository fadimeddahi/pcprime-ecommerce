"use client";

import { useParams } from 'next/navigation';
import ProductDetail from '../../components/product-detail';
import { useProduct } from '../../hooks/useProducts';

export default function DynamicProductPage() {
  const params = useParams();
  const productId = params?.id as string;

  const { data: product, isLoading, error } = useProduct(productId);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-[#0a0a0a] to-[#1a1a1a]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#fe8002] mx-auto"></div>
          <p className="text-white mt-4 text-xl font-bold">Chargement du produit...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-[#0a0a0a] to-[#1a1a1a]">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-500 mb-4">❌ Erreur</h1>
          <p className="text-gray-400 text-lg">{error.message || "Impossible de charger le produit"}</p>
          <a href="/" className="mt-6 inline-block bg-gradient-to-r from-[#fe8002] to-[#ff4500] text-white font-bold px-8 py-3 rounded-xl hover:scale-105 transition-all">
            Retour à l'accueil
          </a>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-[#0a0a0a] to-[#1a1a1a]">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-400 mb-4">🔍 Produit introuvable</h1>
          <p className="text-gray-500 text-lg">Le produit demandé n'existe pas.</p>
          <a href="/" className="mt-6 inline-block bg-gradient-to-r from-[#fe8002] to-[#ff4500] text-white font-bold px-8 py-3 rounded-xl hover:scale-105 transition-all">
            Retour à l'accueil
          </a>
        </div>
      </div>
    );
  }

  return <ProductDetail product={product} />;
}
