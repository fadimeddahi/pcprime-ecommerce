// React Query Hooks for Categories API

import { useQuery } from '@tanstack/react-query';
import type { UseQueryOptions } from '@tanstack/react-query';
import { categoryApi } from '../services/api';
import { Category, BackendCategory } from '../types/product';

// Query Keys
export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  details: () => [...categoryKeys.all, 'detail'] as const,
  detail: (id: string | number) => [...categoryKeys.details(), id] as const,
};

// Hook: Get all categories
// GET /categories/all
export const useAllCategories = (
  options?: Omit<UseQueryOptions<Category[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<Category[], Error>({
    queryKey: categoryKeys.lists(),
    queryFn: () => categoryApi.getAllCategories(),
    staleTime: 10 * 60 * 1000, // 10 minutes (categories don't change often)
    ...options,
  });
};

// Hook: Get single category by ID with products
// GET /categories/:id
export const useCategory = (
  id: string | number,
  options?: Omit<UseQueryOptions<BackendCategory, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<BackendCategory, Error>({
    queryKey: categoryKeys.detail(id),
    queryFn: () => categoryApi.getCategoryById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};
