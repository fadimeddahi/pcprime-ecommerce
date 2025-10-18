// React Query Hooks for Products API

import { useQuery } from '@tanstack/react-query';
import type { UseQueryOptions } from '@tanstack/react-query';
import { productApi } from '../services/api';
import { Product, SearchProductsResponse } from '../types/product';

// Query Keys
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters?: string) => [...productKeys.lists(), { filters }] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string | number) => [...productKeys.details(), id] as const,
  search: (q: string, limit?: number, offset?: number) => 
    [...productKeys.all, 'search', { q, limit, offset }] as const,
};



// Hook: Get single product by ID
// GET /products/:id
export const useProduct = (
  id: string | number,
  options?: Omit<UseQueryOptions<Product, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<Product, Error>({
    queryKey: productKeys.detail(id),
    queryFn: () => productApi.getProductById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

// Hook: Get all products
// GET /products/all
export const useAllProducts = (
  options?: Omit<UseQueryOptions<Product[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<Product[], Error>({
    queryKey: productKeys.lists(),
    queryFn: () => productApi.getAllProducts(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

// Hook: Search products with pagination
// GET /products/search?q=query&limit=10&offset=0
export const useSearchProducts = (
  q: string,
  limit: number = 10,
  offset: number = 0,
  options?: Omit<UseQueryOptions<SearchProductsResponse, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<SearchProductsResponse, Error>({
    queryKey: productKeys.search(q, limit, offset),
    queryFn: () => productApi.searchProducts({ q, limit, offset }),
    enabled: q.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
    ...options,
  });
};

// Re-export category hooks from useCategories.ts
export { useAllCategories, useCategory } from './useCategories';

