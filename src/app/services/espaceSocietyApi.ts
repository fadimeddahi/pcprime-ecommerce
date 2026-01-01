// Espace Entreprise API Service - User Side Only
// Based on Backend API Documentation

import {
  Company,
  CreateCompanyRequest,
  UpdateCompanyRequest,
  CompanyOrder,
  CreateCompanyOrderRequest,
  CompanyOrderResponse,
} from '../types/enterprise';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.primecomputerdz.dz';

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
        errorData.error || errorData.message || `HTTP Error: ${response.status}`,
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

// ==================== COMPANY MANAGEMENT API ====================
// All company endpoints require authentication

export const companyApi = {
  // POST /company/companies - Create new company
  // Requires: JWT token
  createCompany: async (data: CreateCompanyRequest): Promise<Company> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const company = await fetchApi<Company>('/company/companies', {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    
    return company;
  },

  // GET /company/GetCompanyByID/:id - Get company by ID
  // Requires: JWT token
  // Authorization: User can only access their own company
  getCompanyById: async (id: string): Promise<Company> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const company = await fetchApi<Company>(`/company/GetCompanyByID/${id}`, {
      method: 'GET',
      headers,
    });
    
    return company;
  },

  // PUT /company/update/:id - Update company
  // Requires: JWT token
  updateCompany: async (id: string, data: UpdateCompanyRequest): Promise<Company> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const company = await fetchApi<Company>(`/company/update/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });
    
    return company;
  },

  // DELETE /company/delete/:id - Delete company
  // Requires: JWT token
  deleteCompany: async (id: string): Promise<{ message: string }> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const result = await fetchApi<{ message: string }>(`/company/delete/${id}`, {
      method: 'DELETE',
      headers,
    });
    
    return result;
  },
};

// ==================== COMPANY ORDERS API ====================
// Company orders are public (no authentication required for creation)

export const companyOrderApi = {
  // POST /company-orders - Create company order
  // Public endpoint - No authentication required
  // Backend validates stock but does NOT reduce it until admin confirms
  createOrder: async (data: CreateCompanyOrderRequest): Promise<CompanyOrderResponse> => {
    const order = await fetchApi<CompanyOrderResponse>('/company-orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    return order;
  },

  // GET /company-orders/:id - Get single order by ID
  // Public endpoint - No authentication required
  getOrderById: async (id: string): Promise<CompanyOrder> => {
    const order = await fetchApi<CompanyOrder>(`/company-orders/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    return order;
  },
};

// Export for backward compatibility
export type { Company, CreateCompanyRequest, CompanyOrder, CreateCompanyOrderRequest };

export default {
  companyApi,
  companyOrderApi,
};
