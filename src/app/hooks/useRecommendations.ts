import { useQuery } from '@tanstack/react-query';
import { productApi } from '../services/api';
import { UpsellOffer, getRecommendedCategories } from '../types/upsell';
import { Product } from '../types/product';

// Convert Product to UpsellOffer
const convertToUpsellOffer = (product: Product): UpsellOffer => ({
  id: Number(product.id),
  uuid: product.uuid,
  name: product.name,
  price: product.price,
  old_price: product.old_price,
  discount: product.discount,
  image: product.image,
  is_promo: product.is_promo || false,
  category: product.category,
  stock: product.inStock ? 100 : 0, // Convert boolean to number (100 if in stock, 0 if not)
});

// Fetch all products once and cache them
const fetchAllProducts = async (): Promise<Product[]> => {
  return await productApi.getAllProducts();
};

// Get recommendations based on category
export const useRecommendations = (category?: string, excludeIds: number[] = []) => {
  return useQuery({
    queryKey: ['recommendations', category, excludeIds],
    queryFn: async (): Promise<UpsellOffer[]> => {
      const allProducts = await fetchAllProducts();
      
      if (!category) {
        // If no category, get promo items
        return allProducts
          .filter(p => p.is_promo && !excludeIds.includes(Number(p.id)))
          .sort((a, b) => (b.discount || 0) - (a.discount || 0))
          .slice(0, 4)
          .map(convertToUpsellOffer);
      }

      const suggestedCategories = getRecommendedCategories(category);
      
      if (suggestedCategories.length === 0) {
        // Fallback: get promo items
        return allProducts
          .filter(p => p.is_promo && !excludeIds.includes(Number(p.id)))
          .sort((a, b) => (b.discount || 0) - (a.discount || 0))
          .slice(0, 4)
          .map(convertToUpsellOffer);
      }

      // Filter products from suggested categories
      const recommendations = allProducts
        .filter(p => 
          suggestedCategories.includes(p.category) && 
          !excludeIds.includes(Number(p.id))
        )
        .sort((a, b) => (b.discount || 0) - (a.discount || 0))
        .slice(0, 4)
        .map(convertToUpsellOffer);

      return recommendations;
    },
    enabled: true,
  });
};

// Get promo products
export const usePromoProducts = (limit: number = 4, excludeIds: number[] = []) => {
  return useQuery({
    queryKey: ['promo-products', limit, excludeIds],
    queryFn: async (): Promise<UpsellOffer[]> => {
      const allProducts = await fetchAllProducts();
      
      return allProducts
        .filter(p => p.is_promo && !excludeIds.includes(Number(p.id)))
        .sort((a, b) => (b.discount || 0) - (a.discount || 0))
        .slice(0, limit)
        .map(convertToUpsellOffer);
    },
  });
};

// Get recommendations for multiple cart items
export const useCartRecommendations = (cartItems: Array<{ id: number; category: string }>) => {
  return useQuery({
    queryKey: ['cart-recommendations', cartItems],
    queryFn: async (): Promise<UpsellOffer[]> => {
      const allProducts = await fetchAllProducts();
      
      if (cartItems.length === 0) {
        // Show promo products if cart is empty
        return allProducts
          .filter(p => p.is_promo)
          .sort((a, b) => (b.discount || 0) - (a.discount || 0))
          .slice(0, 4)
          .map(convertToUpsellOffer);
      }

      const cartIds = cartItems.map(item => item.id);
      const allCategories = [...new Set(cartItems.map(item => item.category))];
      
      // Get all suggested categories
      const suggestedCategories = new Set<string>();
      allCategories.forEach(cat => {
        getRecommendedCategories(cat).forEach(sugCat => suggestedCategories.add(sugCat));
      });

      if (suggestedCategories.size === 0) {
        return allProducts
          .filter(p => p.is_promo && !cartIds.includes(Number(p.id)))
          .sort((a, b) => (b.discount || 0) - (a.discount || 0))
          .slice(0, 4)
          .map(convertToUpsellOffer);
      }

      // Filter products from suggested categories
      const recommendations = allProducts
        .filter(p => 
          Array.from(suggestedCategories).includes(p.category) && 
          !cartIds.includes(Number(p.id))
        )
        .sort((a, b) => {
          // Sort by: promo first, then discount, then price
          if (a.is_promo && !b.is_promo) return -1;
          if (!a.is_promo && b.is_promo) return 1;
          return (b.discount || 0) - (a.discount || 0);
        })
        .slice(0, 4)
        .map(convertToUpsellOffer);

      return recommendations;
    },
    enabled: cartItems.length >= 0,
  });
};
