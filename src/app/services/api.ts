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

export default productApi;
