// API Configuration and Service Functions

import { 
  Product, 
  BackendProduct, 
  SearchProductsResponse, 
  ProductsResponse,
  Category,
  BackendCategory,
  CategoriesResponse 
} from '../types/product';
import {
  OTPSendRequest,
  OTPSendResponse,
  OTPVerifyRequest,
  OTPVerifyResponse,
  OTPResendRequest,
  OTPResendResponse
} from '../types/otp';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://pcprimedz.onrender.com';

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

// Normalize backend product data to frontend format
function normalizeProduct(product: BackendProduct | any): Product {
  // Build specs array from backend hardware fields
  // Handle both English and French field names from backend
  const specs: { label: string; value: string }[] = [];
  
  // Processor (English: processor, cpu; French: processeur)
  if (product.processor || product.cpu) {
    specs.push({ label: 'Processeur', value: product.processor || product.cpu });
  }
  
  // Graphics Card (English: graphics_card, gpu; French: carte graphique)
  if (product.graphics_card || product.gpu) {
    specs.push({ label: 'Carte Graphique', value: product.graphics_card || product.gpu });
  }
  
  // RAM
  if (product.ram) specs.push({ label: 'Mémoire RAM', value: product.ram });
  
  // Storage
  if (product.storage) specs.push({ label: 'Stockage', value: product.storage });
  
  // Motherboard
  if (product.motherboard) specs.push({ label: 'Carte Mère', value: product.motherboard });
  
  // Power Supply (English: power_supply; French: alimentation)
  if (product.power_supply || product.alimentation) {
    specs.push({ label: 'Alimentation', value: product.power_supply || product.alimentation });
  }
  
  // Case (English: case_type; French: boîtier)
  if (product.case_type || product.boîtier) {
    specs.push({ label: 'Boîtier', value: product.case_type || product.boîtier });
  }
  
  // Cooling (English: cooling; French: refroidissement)
  if (product.cooling || product.refroidissement) {
    specs.push({ label: 'Refroidissement', value: product.cooling || product.refroidissement });
  }
  
  // Operating System (English: operating_system; French: système)
  if (product.operating_system || product.système) {
    specs.push({ label: 'Système', value: product.operating_system || product.système });
  }
  
  // Screen
  if (product.screen) specs.push({ label: 'Écran', value: product.screen });
  
  // Battery
  if (product.battery) specs.push({ label: 'Batterie', value: product.battery });
  
  // Camera
  if (product.camera) specs.push({ label: 'Caméra', value: product.camera });

  return {
    ...product,
    // Use image_url from backend as image
    image: product.image_url || product.image || '',
    // Handle multiple images (fallback to single image array if not provided)
    images: product.images || (product.image_url ? [product.image_url] : product.image ? [product.image] : []),
    // Extract category name if category is an object
    category: typeof product.category === 'object' && product.category !== null 
      ? product.category.name 
      : product.category || 'Uncategorized',
    // Normalize price fields
    price: product.price || 0,
    oldPrice: product.old_price || product.oldPrice,
    originalPrice: product.original_price || product.originalPrice,
    // Normalize condition
    condition: product.etat || product.condition,
    // Normalize promo flags
    isPromo: product.is_promo || product.is_promotion || product.isPromo || false,
    // Normalize warranty
    warrantyMonths: product.warranty_months || product.warrantyMonths,
    // Stock status
    inStock: product.quantity ? product.quantity > 0 : true,
    // Hardware specs
    specs: specs.length > 0 ? specs : undefined,
    // Policy info (handle both English and French field names)
    delivery_info: product.delivery_info,
    warranty_info: product.warranty_info || product.garantie,
    return_policy: product.return_policy || product.retour,
  };
}

// Normalize backend category data to frontend format
// Only expose fields actually used in the UI
function normalizeCategory(category: BackendCategory | any): Category {
  return {
    id: category.id,
    name: category.name,
    description: category.description,
  };
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
      let errorData: any = {};
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { message: `HTTP Error: ${response.status}` };
      }
      
      console.error(`API Error [${response.status}] ${endpoint}:`, {
        status: response.status,
        statusText: response.statusText,
        body: options.body,
        response: errorData,
      });

      throw new ApiError(
        errorData.message || errorData.error || `HTTP Error: ${response.status}`,
        response.status,
        errorData
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    console.error(`Fetch Error ${endpoint}:`, error);
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
    const data = await fetchApi<any>(`/products/${id}`);
    return normalizeProduct(data);
  },

  // Get all products
  // GET /products/all
  getAllProducts: async (): Promise<Product[]> => {
    const data = await fetchApi<any[]>('/products/all');
    return data.map(normalizeProduct);
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

    const data = await fetchApi<any>(`/products/search?${searchParams.toString()}`);
    
    // Normalize the response
    return {
      products: (data.products || []).map(normalizeProduct),
      total: data.total || 0,
      limit: data.limit || params.limit || 10,
      offset: data.offset || params.offset || 0,
      hasMore: data.hasMore || false,
    };
  },
};

// Category API Service
export const categoryApi = {
  // Get all categories
  // GET /categories/all
  getAllCategories: async (): Promise<Category[]> => {
    const data = await fetchApi<any[]>('/categories/all');
    return data.map(normalizeCategory);
  },

  // Get single category by ID with products
  // GET /categories/:id
  getCategoryById: async (id: string | number): Promise<BackendCategory> => {
    const data = await fetchApi<BackendCategory>(`/categories/${id}`);
    // Return full backend category including products if present
    return {
      ...data,
      products: data.products ? data.products.map(normalizeProduct) : undefined
    };
  },
};

// Authentication Types
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
}

// Authentication API
export const authApi = {
  // POST /users/register
  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    const data = await fetchApi<AuthResponse>('/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    // Store token in localStorage if available
    if (typeof window !== 'undefined' && data.token) {
      localStorage.setItem('auth_token', data.token);
    }
    
    return data;
  },

  // POST /users/login
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const data = await fetchApi<AuthResponse>('/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    
    // Store token in localStorage if available
    if (typeof window !== 'undefined' && data.token) {
      localStorage.setItem('auth_token', data.token);
    }
    
    return data;
  },

  // Logout - Clear token
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  },

  // Get stored token
  getToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!authApi.getToken();
  },
};

// Order API Types
export interface OrderItem {
  product_id: number;
  quantity: number;
}

export interface CreateOrderRequest {
  phone_number: string;
  email: string;
  willaya: string;
  commune: string;
  full_name: string;
  notes: string;
  cart_items: OrderItem[];
}

export interface OrderResponse {
  id: number;
  user_id?: number;
  phone_number: string;
  email: string;
  willaya: string;
  commune: string;
  full_name: string;
  total_price: number;
  shipping_cost: number;
  status: string;
  created_at: string;
  updated_at: string;
}

// Order API Service
export const orderApi = {
  // POST /orders/direct
  // Create order with optional authentication
  // If authenticated (with token): Free shipping (0 DZD)
  // If anonymous (no token): Shipping cost 500 DZD
  createOrder: async (orderData: CreateOrderRequest): Promise<OrderResponse> => {
    const token = authApi.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    // Add Authorization header if user is logged in
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const data = await fetchApi<OrderResponse>('/orders/direct', {
      method: 'POST',
      headers,
      body: JSON.stringify(orderData),
    });
    
    return data;
  },
};

// PC Builder API Types
import { 
  CPU, 
  Motherboard, 
  RAM, 
  Storage, 
  Monitor, 
  BuildRequest, 
  BuildResponse 
} from '../types/pc-builder';

// PC Builder API Service
export const pcBuilderApi = {
  // GET /components/cpu
  getAllCPUs: async (): Promise<CPU[]> => {
    const data = await fetchApi<CPU[]>('/components/cpu');
    return data;
  },

  // GET /components/motherboard
  getAllMotherboards: async (): Promise<Motherboard[]> => {
    const data = await fetchApi<Motherboard[]>('/components/motherboard');
    return data;
  },

  // GET /components/ram
  getAllRAM: async (): Promise<RAM[]> => {
    const data = await fetchApi<RAM[]>('/components/ram');
    return data;
  },

  // GET /components/storage
  getAllStorage: async (): Promise<Storage[]> => {
    const data = await fetchApi<Storage[]>('/components/storage');
    return data;
  },

  // GET /components/monitor
  getAllMonitors: async (): Promise<Monitor[]> => {
    const data = await fetchApi<Monitor[]>('/components/monitor');
    return data;
  },

  // POST /build/check
  checkBuildCompatibility: async (buildData: BuildRequest): Promise<BuildResponse> => {
    const data = await fetchApi<BuildResponse>('/build/check', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(buildData),
    });
    return data;
  },
};

// OTP API Service
export const otpApi = {
  // POST /otp/send - Send OTP to email
  sendOTP: async (request: OTPSendRequest): Promise<OTPSendResponse> => {
    const data = await fetchApi<OTPSendResponse>('/otp/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
    return data;
  },

  // POST /otp/verify - Verify OTP code
  verifyOTP: async (request: OTPVerifyRequest): Promise<OTPVerifyResponse> => {
    const data = await fetchApi<OTPVerifyResponse>('/otp/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
    return data;
  },

  // POST /otp/resend - Resend OTP (auth required)
  resendOTP: async (request: OTPResendRequest, token?: string): Promise<OTPResendResponse> => {
    // Get token from localStorage if not provided
    const authToken = token || (typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null);
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    const data = await fetchApi<OTPResendResponse>('/otp/resend', {
      method: 'POST',
      headers,
      body: JSON.stringify(request),
    });
    return data;
  },
};

export default productApi;
