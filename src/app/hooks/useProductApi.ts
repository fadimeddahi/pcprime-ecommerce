"use client";

import React from 'react';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { productApi } from '../services/api';
import { Product, SearchProductsResponse } from '../types/product';

// Query Keys
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters?: any) => [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string | number) => [...productKeys.details(), id] as const,
  search: (query: string, limit?: number, offset?: number) => 
    [...productKeys.all, 'search', { query, limit, offset }] as const,
};

// Hook to get a single product by ID
export function useProduct(id: string | number, enabled = true): UseQueryResult<Product, Error> {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => productApi.getProductById(id),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}

// Hook to get all products
export function useAllProducts(): UseQueryResult<Product[], Error> {
  return useQuery({
    queryKey: productKeys.lists(),
    queryFn: () => productApi.getAllProducts(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}

// Hook to search products with pagination
export function useSearchProducts(
  searchQuery: string,
  limit: number = 10,
  offset: number = 0,
  enabled = true
): UseQueryResult<SearchProductsResponse, Error> {
  return useQuery({
    queryKey: productKeys.search(searchQuery, limit, offset),
    queryFn: () => productApi.searchProducts({ q: searchQuery, limit, offset }),
    enabled: enabled && searchQuery.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 2,
  });
}

// Helper hook for pagination
export function usePaginatedSearch(searchQuery: string, pageSize: number = 10) {
  const [currentPage, setCurrentPage] = React.useState(0);
  
  const offset = currentPage * pageSize;
  
  const { data, isLoading, isError, error } = useSearchProducts(
    searchQuery,
    pageSize,
    offset,
    searchQuery.length > 0
  );

  const totalPages = data?.total ? Math.ceil(data.total / pageSize) : 0;

  const goToPage = (page: number) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  };

  const nextPage = () => goToPage(currentPage + 1);
  const prevPage = () => goToPage(currentPage - 1);

  return {
    products: data?.products || [],
    total: data?.total || 0,
    currentPage,
    totalPages,
    isLoading,
    isError,
    error,
    goToPage,
    nextPage,
    prevPage,
    hasNextPage: currentPage < totalPages - 1,
    hasPrevPage: currentPage > 0,
  };
}
