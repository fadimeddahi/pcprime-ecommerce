// Product Type Definitions

export interface Product {
  id: number | string;
  name: string;
  category: string;
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
  rating?: number;
  reviews?: number;
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
