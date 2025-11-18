# Espace Entreprise - Backend API Specification

## Overview
**Espace Entreprise** is a B2B (Business-to-Business) portal that allows companies to register and manage bulk orders. This document outlines the API requirements for the backend implementation.

## Current Frontend Implementation
- **URL**: `/espace-society` (exists for backward compatibility)
- **Component**: `CompanyRegistrationModal` - Full form for company registration
- **Form**: Complete company information collection with validation

## API Endpoints Required

### 1. Company Registration
**Endpoint**: `POST /companies/register`

**Purpose**: Register a new company in the Espace Entreprise system

**Request Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "name": "string (required)",
  "email": "string (required, valid email)",
  "phone": "string (required, format: +213XXXXXXXXX)",
  "address": "string (optional)",
  "city": "string (optional)",
  "postalCode": "string (optional)",
  "country": "string (optional, default: 'Algeria')",
  "website": "string (optional, valid URL)",
  "taxId": "string (required, NIF - Numéro d'Identification Fiscale)",
  "registrationNumber": "string (optional)",
  "contactPerson": "string (required, full name of contact person)",
  "contactTitle": "string (optional, e.g., 'Directeur Général', 'Manager')",
  "industry": "string (optional, e.g., 'Informatique', 'Distribution')",
  "employeeCount": "string (optional, values: '1-10', '11-50', '51-200', '200+')",
  "annualRevenue": "string (optional, values: '<1M', '1-5M', '5-10M', '10M+')"
}
```

**Response (Success - 200)**:
```json
{
  "success": true,
  "message": "Entreprise créée avec succès",
  "company": {
    "id": "uuid",
    "name": "string",
    "email": "string",
    "phone": "string",
    "address": "string",
    "city": "string",
    "postalCode": "string",
    "country": "string",
    "website": "string",
    "taxId": "string",
    "registrationNumber": "string",
    "contactPerson": "string",
    "contactTitle": "string",
    "industry": "string",
    "employeeCount": "string",
    "annualRevenue": "string",
    "status": "pending",
    "createdAt": "ISO8601 timestamp"
  }
}
```

**Response (Error - 400/409)**:
```json
{
  "success": false,
  "message": "Error message describing what went wrong",
  "error": "ERROR_CODE"
}
```

**Possible Errors**:
- `INVALID_EMAIL` - Email format is invalid
- `INVALID_PHONE` - Phone number format is invalid
- `DUPLICATE_EMAIL` - Email already registered
- `DUPLICATE_TAX_ID` - Tax ID (NIF) already exists
- `MISSING_REQUIRED_FIELDS` - Required fields are missing
- `INVALID_TAX_ID_FORMAT` - Tax ID format is incorrect (should be 15 digits for Algeria)

---

### 2. Company Login/Profile
**Endpoint**: `POST /companies/login`

**Purpose**: Allow company representatives to log in and access their dashboard

**Request Body**:
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Response (Success - 200)**:
```json
{
  "success": true,
  "token": "JWT token",
  "company": {
    "id": "uuid",
    "name": "string",
    "email": "string",
    "status": "pending|approved|rejected"
  }
}
```

---

### 3. Get Company Profile
**Endpoint**: `GET /companies/me`

**Purpose**: Get the authenticated company's profile information

**Headers**:
```
Authorization: Bearer {token}
```

**Response (Success - 200)**:
```json
{
  "id": "uuid",
  "name": "string",
  "email": "string",
  "phone": "string",
  "address": "string",
  "city": "string",
  "postalCode": "string",
  "country": "string",
  "website": "string",
  "taxId": "string",
  "registrationNumber": "string",
  "contactPerson": "string",
  "contactTitle": "string",
  "industry": "string",
  "employeeCount": "string",
  "annualRevenue": "string",
  "status": "pending|approved|rejected",
  "createdAt": "ISO8601 timestamp",
  "approvedAt": "ISO8601 timestamp or null"
}
```

---

### 4. Update Company Profile
**Endpoint**: `PUT /companies/{companyId}`

**Purpose**: Update company information

**Headers**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body**:
```json
{
  "phone": "string (optional)",
  "address": "string (optional)",
  "city": "string (optional)",
  "postalCode": "string (optional)",
  "website": "string (optional)",
  "contactPerson": "string (optional)",
  "contactTitle": "string (optional)",
  "industry": "string (optional)"
}
```

**Note**: taxId and registrationNumber should NOT be editable after creation

---

### 5. Bulk Order Management
**Endpoint**: `POST /companies/{companyId}/bulk-orders`

**Purpose**: Create a bulk order for the company

**Headers**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body**:
```json
{
  "items": [
    {
      "product_id": "string or uuid",
      "quantity": "integer (required)",
      "unit_price": "number (optional, use product price if not provided)",
      "notes": "string (optional)"
    }
  ],
  "delivery_address": "string (optional, use company address if not provided)",
  "delivery_date": "ISO8601 date (optional, requested delivery date)",
  "notes": "string (optional, special instructions)"
}
```

**Response (Success - 200)**:
```json
{
  "success": true,
  "order": {
    "id": "uuid",
    "company_id": "uuid",
    "order_number": "string (format: ORD-{timestamp}-{random})",
    "items": [...],
    "total": "number",
    "status": "pending",
    "created_at": "ISO8601 timestamp"
  }
}
```

---

### 6. Get Company Orders
**Endpoint**: `GET /companies/{companyId}/bulk-orders`

**Purpose**: List all bulk orders for a company

**Headers**:
```
Authorization: Bearer {token}
```

**Query Parameters**:
- `status` (optional): 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'
- `limit` (optional, default: 10)
- `offset` (optional, default: 0)

**Response (Success - 200)**:
```json
{
  "success": true,
  "orders": [
    {
      "id": "uuid",
      "order_number": "string",
      "total": "number",
      "status": "string",
      "items_count": "integer",
      "created_at": "ISO8601 timestamp",
      "updated_at": "ISO8601 timestamp"
    }
  ],
  "total": "integer",
  "limit": "integer",
  "offset": "integer"
}
```

---

### 7. Get Single Order Details
**Endpoint**: `GET /companies/{companyId}/bulk-orders/{orderId}`

**Purpose**: Get detailed information about a specific order

**Headers**:
```
Authorization: Bearer {token}
```

**Response (Success - 200)**:
```json
{
  "success": true,
  "order": {
    "id": "uuid",
    "company_id": "uuid",
    "order_number": "string",
    "items": [
      {
        "product_id": "uuid or string",
        "product_name": "string",
        "quantity": "integer",
        "unit_price": "number",
        "subtotal": "number"
      }
    ],
    "delivery_address": "string",
    "delivery_date": "ISO8601 date",
    "notes": "string",
    "total": "number",
    "status": "pending|confirmed|shipped|delivered|cancelled",
    "created_at": "ISO8601 timestamp",
    "updated_at": "ISO8601 timestamp"
  }
}
```

---

### 8. Cancel Order
**Endpoint**: `POST /companies/{companyId}/bulk-orders/{orderId}/cancel`

**Purpose**: Cancel a pending bulk order

**Headers**:
```
Authorization: Bearer {token}
```

**Request Body**:
```json
{
  "reason": "string (optional)"
}
```

**Response (Success - 200)**:
```json
{
  "success": true,
  "message": "Commande annulée avec succès",
  "order_id": "uuid"
}
```

---

## Database Schema Requirements

### Companies Table
```sql
CREATE TABLE companies (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20) NOT NULL,
  address VARCHAR(255),
  city VARCHAR(100),
  postal_code VARCHAR(10),
  country VARCHAR(100),
  website VARCHAR(255),
  tax_id VARCHAR(15) NOT NULL UNIQUE,
  registration_number VARCHAR(50),
  contact_person VARCHAR(255),
  contact_title VARCHAR(100),
  industry VARCHAR(100),
  employee_count VARCHAR(50),
  annual_revenue VARCHAR(50),
  password_hash VARCHAR(255),
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  approved_at TIMESTAMP NULL
);

CREATE TABLE bulk_orders (
  id UUID PRIMARY KEY,
  company_id UUID NOT NULL FOREIGN KEY REFERENCES companies(id),
  order_number VARCHAR(100) NOT NULL UNIQUE,
  delivery_address VARCHAR(255),
  delivery_date DATE,
  notes TEXT,
  total DECIMAL(10, 2),
  status ENUM('pending', 'confirmed', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE bulk_order_items (
  id UUID PRIMARY KEY,
  order_id UUID NOT NULL FOREIGN KEY REFERENCES bulk_orders(id),
  product_id UUID NOT NULL,
  quantity INT NOT NULL,
  unit_price DECIMAL(10, 2),
  notes TEXT
);
```

---

## Validation Rules

### Company Registration
1. **Email**: Must be valid email format and unique
2. **Phone**: Must be valid phone number (preferably +213XXXXXXXXX for Algeria)
3. **Tax ID (NIF)**: 
   - Must be 15 digits for Algeria
   - Must be unique
   - Should validate against Algerian tax authority if possible
4. **Contact Person**: Must be non-empty string
5. **Required Fields**: name, email, phone, taxId, contactPerson

### Bulk Orders
1. **Items**: At least one item required
2. **Quantity**: Must be positive integer
3. **Product ID**: Must exist in products table
4. **Delivery Date**: If provided, must be in future

---

## Authentication
- Use JWT tokens for authenticated endpoints
- Token should include: `company_id`, `email`, `status`
- Token expiration: 7 days (configurable)
- Refresh token mechanism (optional but recommended)

---

## Status Codes
- `200 OK`: Successful request
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid input
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `409 Conflict`: Duplicate resource (email, tax_id, etc.)
- `500 Internal Server Error`: Server error

---

## Rate Limiting
- Suggested: 100 requests per minute per company
- Registration endpoint: 5 requests per minute per IP

---

## Additional Features (Optional)
1. **Company Approval Workflow**: Admin dashboard to approve/reject companies
2. **Special Pricing**: Apply custom prices for bulk orders based on volume
3. **Discounts**: Automatic bulk discounts (e.g., 5% for 50+ items, 10% for 100+ items)
4. **Payment Terms**: Support for deferred payment (NET30, NET60, etc.)
5. **Invoice Generation**: Automatic invoice generation for approved orders
6. **Email Notifications**: Send confirmation emails for registration and orders
7. **Activity Logging**: Track all company actions for audit purposes

---

## Frontend Data Flow

### Registration Flow
1. User clicks "Espace Entreprise" in navbar
2. Company registration modal opens
3. User fills in all required fields
4. Frontend validates form locally
5. Frontend sends `POST /companies/register` request
6. Backend validates data and creates company
7. User receives success confirmation
8. Optional: Redirect to login page

### Order Flow
1. Authenticated company user accesses dashboard
2. User selects products and quantities
3. User submits bulk order
4. Frontend sends `POST /companies/{companyId}/bulk-orders`
5. Backend creates order and returns order number
6. User sees order confirmation with order number
7. User can track order status

---

## Testing Checklist

- [ ] Company registration with all fields
- [ ] Company registration with only required fields
- [ ] Validation for duplicate email/NIF
- [ ] Login with correct/incorrect credentials
- [ ] Create bulk order with valid items
- [ ] Create bulk order with invalid product IDs
- [ ] Retrieve company orders
- [ ] Retrieve single order details
- [ ] Cancel pending order
- [ ] Prevent cancellation of shipped/delivered orders
- [ ] Update company profile
- [ ] Prevent field updates (taxId, registrationNumber)
- [ ] Pagination for orders list
- [ ] Filter orders by status

---

## Implementation Priority

**Phase 1 (MVP)**:
- Company registration
- Company login
- Get company profile
- Create bulk order
- List company orders

**Phase 2**:
- Update company profile
- Get order details
- Cancel order
- Email notifications

**Phase 3**:
- Admin approval dashboard
- Special pricing
- Payment terms
- Invoice generation

---

**Last Updated**: November 18, 2025
**Frontend Version**: 1.0.0
**Status**: Ready for implementation
