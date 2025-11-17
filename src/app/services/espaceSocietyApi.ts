// Espace Society API Service - B2B Company Portal

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://pcprimedz.onrender.com';

// ==================== TYPES ====================

export interface Company {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  taxId: string;
  businessType: string;
  numberOfEmployees: number;
  website?: string;
  logo?: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface CompanyRegistrationRequest {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  taxId: string;
  businessType: string;
  numberOfEmployees: number;
  website?: string;
}

export interface CompanyResponse {
  success: boolean;
  message: string;
  company?: Company;
}

export interface TeamMember {
  id: string;
  userId: string;
  companyId: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'buyer' | 'viewer';
  permissions: string[];
  status: 'active' | 'inactive';
  joinedAt: string;
}

export interface TeamMemberInvite {
  email: string;
  role: 'admin' | 'manager' | 'buyer' | 'viewer';
}

export interface BulkOrder {
  id: string;
  companyId: string;
  orderNumber: string;
  items: BulkOrderItem[];
  totalAmount: number;
  status: 'draft' | 'submitted' | 'processing' | 'shipped' | 'delivered';
  createdAt: string;
  updatedAt: string;
  deliveryDate?: string;
}

export interface BulkOrderItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  discount?: number;
  subtotal: number;
}

export interface BulkOrderRequest {
  items: BulkOrderItem[];
  deliveryAddress?: string;
  notes?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  companyId: string;
  orderId: string;
  issueDate: string;
  dueDate: string;
  amount: number;
  tax: number;
  total: number;
  status: 'draft' | 'issued' | 'paid' | 'overdue';
  items: InvoiceItem[];
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface CompanyDashboard {
  totalOrders: number;
  totalSpent: number;
  pendingInvoices: number;
  teamMembers: number;
  recentOrders: BulkOrder[];
}

// ==================== COMPANY SERVICE ====================

export const companyApi = {
  // Register new company
  registerCompany: async (data: CompanyRegistrationRequest): Promise<CompanyResponse> => {
    const response = await fetch(`${API_BASE_URL}/companies/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to register company');
    }

    return response.json();
  },

  // Get company profile
  getCompanyProfile: async (companyId: string): Promise<Company> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/companies/${companyId}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error('Failed to fetch company profile');
    }

    return response.json();
  },

  // Update company profile
  updateCompanyProfile: async (companyId: string, data: Partial<Company>): Promise<Company> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/companies/${companyId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update company profile');
    }

    return response.json();
  },

  // Get company dashboard
  getDashboard: async (companyId: string): Promise<CompanyDashboard> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/companies/${companyId}/dashboard`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error('Failed to fetch dashboard');
    }

    return response.json();
  },
};

// ==================== TEAM SERVICE ====================

export const teamApi = {
  // Get team members
  getTeamMembers: async (companyId: string): Promise<TeamMember[]> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/companies/${companyId}/team`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error('Failed to fetch team members');
    }

    return response.json();
  },

  // Invite team member
  inviteTeamMember: async (companyId: string, invite: TeamMemberInvite): Promise<{ success: boolean }> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/companies/${companyId}/team/invite`, {
      method: 'POST',
      headers,
      body: JSON.stringify(invite),
    });

    if (!response.ok) {
      throw new Error('Failed to invite team member');
    }

    return response.json();
  },

  // Update team member role
  updateTeamMember: async (companyId: string, memberId: string, role: string): Promise<TeamMember> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/companies/${companyId}/team/${memberId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ role }),
    });

    if (!response.ok) {
      throw new Error('Failed to update team member');
    }

    return response.json();
  },

  // Remove team member
  removeTeamMember: async (companyId: string, memberId: string): Promise<{ success: boolean }> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/companies/${companyId}/team/${memberId}`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      throw new Error('Failed to remove team member');
    }

    return response.json();
  },
};

// ==================== BULK ORDER SERVICE ====================

export const bulkOrderApi = {
  // Create bulk order
  createOrder: async (companyId: string, data: BulkOrderRequest): Promise<BulkOrder> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/companies/${companyId}/orders`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create order');
    }

    return response.json();
  },

  // Get orders
  getOrders: async (companyId: string): Promise<BulkOrder[]> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/companies/${companyId}/orders`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error('Failed to fetch orders');
    }

    return response.json();
  },

  // Get single order
  getOrder: async (companyId: string, orderId: string): Promise<BulkOrder> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/companies/${companyId}/orders/${orderId}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error('Failed to fetch order');
    }

    return response.json();
  },

  // Update order
  updateOrder: async (companyId: string, orderId: string, data: Partial<BulkOrder>): Promise<BulkOrder> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/companies/${companyId}/orders/${orderId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update order');
    }

    return response.json();
  },

  // Submit order
  submitOrder: async (companyId: string, orderId: string): Promise<BulkOrder> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/companies/${companyId}/orders/${orderId}/submit`, {
      method: 'POST',
      headers,
    });

    if (!response.ok) {
      throw new Error('Failed to submit order');
    }

    return response.json();
  },
};

// ==================== INVOICE SERVICE ====================

export const invoiceApi = {
  // Get invoices
  getInvoices: async (companyId: string): Promise<Invoice[]> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/companies/${companyId}/invoices`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error('Failed to fetch invoices');
    }

    return response.json();
  },

  // Get single invoice
  getInvoice: async (companyId: string, invoiceId: string): Promise<Invoice> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/companies/${companyId}/invoices/${invoiceId}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error('Failed to fetch invoice');
    }

    return response.json();
  },

  // Download invoice PDF
  downloadInvoice: async (companyId: string, invoiceId: string): Promise<Blob> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/companies/${companyId}/invoices/${invoiceId}/download`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error('Failed to download invoice');
    }

    return response.blob();
  },

  // Pay invoice
  payInvoice: async (companyId: string, invoiceId: string, paymentMethod: string): Promise<Invoice> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/companies/${companyId}/invoices/${invoiceId}/pay`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ paymentMethod }),
    });

    if (!response.ok) {
      throw new Error('Failed to process payment');
    }

    return response.json();
  },
};

export default {
  companyApi,
  teamApi,
  bulkOrderApi,
  invoiceApi,
};
