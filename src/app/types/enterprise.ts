// Enterprise Space (Espace Entreprise) Type Definitions
// Based on Backend API Documentation

// ==================== COMPANY TYPES ====================

export interface Company {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  postal_code?: string;
  country: string;
  website?: string;
  tax_id: string;
  registration_number?: string;
  contact_person: string;
  contact_title?: string;
  industry?: string;
  nif?: string;
  rc?: string;
  art?: string;
  nic?: string;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateCompanyRequest {
  name: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  website?: string;
  tax_id: string;
  registration_number?: string;
  contact_person: string;
  contact_title?: string;
  industry?: string;
  nif?: string;
  rc?: string;
  art?: string;
  nic?: string;
}

export interface UpdateCompanyRequest extends Partial<CreateCompanyRequest> {}

// ==================== COMPANY ORDER TYPES ====================

export interface OrderItem {
  id?: string;
  product_id: string;
  quantity: number;
  company_order_id?: string;
}

export interface CompanyOrderData {
  company_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  tax_id: string;
  contact_person: string;
  notes?: string;
}

export interface CreateCompanyOrderRequest {
  company_data: CompanyOrderData;
  cart_items: OrderItem[];
}

export interface CompanyOrder {
  id: string;
  company_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  tax_id: string;
  contact_person: string;
  confirmed: boolean;
  total: number;
  notes?: string;
  order_items?: OrderItem[];
  created_at: string;
  updated_at: string;
}

export interface CompanyOrderResponse extends CompanyOrder {}
