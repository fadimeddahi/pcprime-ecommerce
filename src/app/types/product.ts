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
  barcode?: string;
  brand?: string;
  created_at?: string;
  updated_at?: string;
  // Hardware specs from backend (English field names)
  processor?: string;
  graphics_card?: string;
  ram?: string;
  storage?: string;
  power_supply?: string;
  case_type?: string;
  cooling?: string;
  operating_system?: string;
  motherboard?: string;
  // Hardware specs from backend (French field names)
  cpu?: string;
  gpu?: string;
  screen?: string;
  battery?: string;
  camera?: string;
  refroidissement?: string;
  système?: string;
  alimentation?: string;
  boîtier?: string;
  // Policy info from backend
  delivery_info?: string;
  warranty_info?: string;
  return_policy?: string;
  garantie?: string;
  retour?: string;
}

// Normalized product type for frontend use
export interface Product {
  id: number | string;
  name: string;
  category: string; // Always a string after normalization
  category_id?: number;
  image: string;
  images?: string[]; // Multiple product images
  price: number;
  oldPrice?: number;
  old_price?: number;
  condition?: string;
  isTopSeller?: boolean; // Keep for future backend support
  isPromo?: boolean;
  is_promo?: boolean;
  discount?: number;
  warrantyMonths?: number;
  warranty_months?: number;
  originalPrice?: number;
  original_price?: number;
  description?: string;
  specs?: { label: string; value: string }[]; // Hardware specifications
  inStock?: boolean;
  quantity?: number;
  barcode?: string;
  brand?: string;
  created_at?: string;
  updated_at?: string;
<<<<<<< HEAD
  etat?: string;
  garantie?: string;
  retour?: string;
  // Technical specs
  cpu?: string;
  ram?: string;
  storage?: string;
  screen?: string;
  battery?: string;
  camera?: string;
  refroidissement?: string;
  système?: string;
  gpu?: string;
  alimentation?: string;
  boîtier?: string;
  number_sold?: number;
=======
  // Policy info from backend
  delivery_info?: string;
  warranty_info?: string;
  return_policy?: string;
>>>>>>> aea23088098f7ace1e8aa3b3a45f50a5214af666
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
