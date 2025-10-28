"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ProductDetail from "../components/product-detail";
import productApi from "../services/api";
import { Product } from "../types/product";
import { useTheme } from "../context/ThemeContext";

// Disable static generation for this page
export const dynamic = 'force-dynamic';

function ProductPageContent() {
  const searchParams = useSearchParams();
  const productId = searchParams.get("id");
  const { theme } = useTheme();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        setError("ID produit manquant");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await productApi.getProductById(productId);
        setProduct(data);
        setError(null);
      } catch (err: any) {
        console.error("Error fetching product:", err);
        setError(err.message || "Erreur lors du chargement du produit");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        theme === 'light' ? 'bg-gray-50' : 'bg-black'
      }`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#fe8002] mx-auto mb-4"></div>
          <p className={`text-xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
            Chargement du produit...
          </p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        theme === 'light' ? 'bg-gray-50' : 'bg-black'
      }`}>
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-6xl mb-4">😕</div>
          <h2 className={`text-2xl font-bold mb-4 ${
            theme === 'light' ? 'text-gray-900' : 'text-white'
          }`}>
            Produit introuvable
          </h2>
          <p className={`mb-6 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
            {error || "Le produit que vous recherchez n'existe pas."}
          </p>
          <a
            href="/"
            className="inline-block bg-gradient-to-r from-[#fe8002] to-[#ff4500] text-white font-bold px-8 py-3 rounded-xl hover:scale-105 transition-all shadow-lg"
          >
            Retour à l'accueil
          </a>
        </div>
      </div>
    );
  }

  return <ProductDetail product={product} />;
}

export default function ProductPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#fe8002] mx-auto mb-4"></div>
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            Chargement du produit...
          </p>
        </div>
      </div>
    }>
      <ProductPageContent />
    </Suspense>
  );
}
