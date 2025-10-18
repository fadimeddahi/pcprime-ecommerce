// Product Type Definitions

// Backend category type (raw from API)
export interface BackendCategory {
  id: number;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
  image_url?: string;
  products?: any[]; // Full product objects may be included
}

// Frontend category type (minimal fields used in UI)
export interface Category {
  id: number;
  name: string;
  description?: string;
}

// Raw backend product type (before normalization)
export interface BackendProduct {
  id: number | string;
  name: string;
  category: Category | string; // Can be object or string from backend
  category_id?: number;
  image?: string;
  image_url?: string;
  price: number;
  old_price?: number;
  etat?: string;
  is_promo?: boolean;
  is_promotion?: boolean;
  discount?: number;
  warranty_months?: number;
  original_price?: number;
  description?: string;
  quantity?: number;
  rating?: number;
  reviews?: number;
  barcode?: string;
  brand?: string;
  created_at?: string;
  updated_at?: string;
}

// Normalized product type for frontend use
export interface Product {
  id: number | string;
  name: string;
  category: string; // Always a string after normalization
  category_id?: number;
  image: string;
  price: number;
  oldPrice?: number;
  condition?: string;
  isTopSeller?: boolean;
  isPromo?: boolean;
  discount?: number;
  warrantyMonths?: number;
  originalPrice?: number;
  description?: string;
  inStock?: boolean;
  quantity?: number;
  rating?: number;
  reviews?: number;
  barcode?: string;
  brand?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SearchProductsParams {
  q: string;
  limit?: number;
  offset?: number;
}

export interface SearchProductsResponse {
  products: Product[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
}

export interface CategoriesResponse {
  categories: Category[];
  total: number;
}
