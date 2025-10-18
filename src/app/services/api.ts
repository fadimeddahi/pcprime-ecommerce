// API Configuration and Service Functions

import { Product, SearchProductsResponse, ProductsResponse } from '../types/product';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// API Error Class
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Generic fetch wrapper with error handling
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || `HTTP Error: ${response.status}`,
        response.status,
        errorData
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error instanceof Error ? error.message : 'Network error occurred',
      undefined,
      error
    );
  }
}

// Product API Service
export const productApi = {
  // Get single product by ID
  // GET /products/:id
  getProductById: async (id: string | number): Promise<Product> => {
    return fetchApi<Product>(`/products/${id}`);
  },

  // Get all products
  // GET /products/all
  getAllProducts: async (): Promise<Product[]> => {
    return fetchApi<Product[]>('/products/all');
  },

  // Search products with pagination
  // GET /products/search?q=query&limit=10&offset=0
  searchProducts: async (params: {
    q: string;
    limit?: number;
    offset?: number;
  }): Promise<SearchProductsResponse> => {
    const searchParams = new URLSearchParams({
      q: params.q,
      limit: (params.limit || 10).toString(),
      offset: (params.offset || 0).toString(),
    });

    return fetchApi<SearchProductsResponse>(`/products/search?${searchParams.toString()}`);
  },
};

export default productApi;
