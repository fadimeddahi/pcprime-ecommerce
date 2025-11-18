# HOT SALES SYSTEM - BACKEND IMPLEMENTATION GUIDE

## Overview

The Hot Sales (Flash Sales) system is a time-limited promotional feature that showcases special discounts on selected products. The frontend displays countdown timers, multiple simultaneous sales, and categorized product listings with pagination.

## Database Schema

### New Tables Required

#### 1. `hot_sales` Table
Stores information about active flash sales.

```sql
CREATE TABLE hot_sales (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  discount_percentage INT NOT NULL,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  category_id INT REFERENCES categories(id),
  status ENUM('upcoming', 'active', 'ended') DEFAULT 'upcoming',
  image_url VARCHAR(255),
  emoji CHAR(2) DEFAULT '🔥',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_hot_sales_status ON hot_sales(status);
CREATE INDEX idx_hot_sales_end_time ON hot_sales(end_time);
```

#### 2. `hot_sale_products` Table
Junction table linking hot sales to products.

```sql
CREATE TABLE hot_sale_products (
  id SERIAL PRIMARY KEY,
  hot_sale_id INT NOT NULL REFERENCES hot_sales(id) ON DELETE CASCADE,
  product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  sale_price DECIMAL(10, 2) NOT NULL,
  original_price DECIMAL(10, 2) NOT NULL,
  discount_percentage INT,
  quantity_available INT,
  quantity_sold INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_sale_product (hot_sale_id, product_id)
);

CREATE INDEX idx_sale_products_hot_sale ON hot_sale_products(hot_sale_id);
CREATE INDEX idx_sale_products_product ON hot_sale_products(product_id);
```

#### 3. `hot_sale_analytics` Table (Optional)
Track sales analytics for each flash sale.

```sql
CREATE TABLE hot_sale_analytics (
  id SERIAL PRIMARY KEY,
  hot_sale_id INT NOT NULL REFERENCES hot_sales(id) ON DELETE CASCADE,
  views INT DEFAULT 0,
  clicks INT DEFAULT 0,
  conversions INT DEFAULT 0,
  revenue DECIMAL(15, 2) DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_analytics_hot_sale ON hot_sale_analytics(hot_sale_id);
```

## API Endpoints

### 1. GET `/api/hot-sales`

**Description**: Retrieve all active and upcoming hot sales with countdown information.

**Query Parameters**:
- `status`: `active` | `upcoming` | `ended` (default: `active`)
- `limit`: number (default: 10)
- `offset`: number (default: 0)

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Flash Sale - Processors",
      "description": "Limited time offer on high-performance CPUs",
      "discount_percentage": 40,
      "emoji": "🔥",
      "start_time": "2025-11-18T10:00:00Z",
      "end_time": "2025-11-18T14:00:00Z",
      "time_remaining_seconds": 7200,
      "status": "active",
      "product_count": 15,
      "category": {
        "id": 1,
        "name": "Processeurs"
      },
      "image_url": "https://...",
      "created_at": "2025-11-18T09:00:00Z"
    }
  ],
  "pagination": {
    "total": 4,
    "limit": 10,
    "offset": 0,
    "pages": 1
  }
}
```

**Error Response**:
```json
{
  "success": false,
  "error": "Failed to fetch hot sales",
  "message": "Internal server error"
}
```

---

### 2. GET `/api/hot-sales/:id`

**Description**: Get detailed information about a specific hot sale.

**Response**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Flash Sale - Processors",
    "description": "Limited time offer on high-performance CPUs",
    "discount_percentage": 40,
    "emoji": "🔥",
    "start_time": "2025-11-18T10:00:00Z",
    "end_time": "2025-11-18T14:00:00Z",
    "time_remaining_seconds": 7200,
    "status": "active",
    "category": {
      "id": 1,
      "name": "Processeurs"
    },
    "product_count": 15,
    "total_revenue": 45000,
    "analytics": {
      "views": 5000,
      "clicks": 1200,
      "conversions": 350,
      "revenue": 45000
    }
  }
}
```

---

### 3. GET `/api/hot-sales/:id/products`

**Description**: Get all products for a specific hot sale with pagination.

**Query Parameters**:
- `page`: number (default: 1)
- `limit`: number (default: 12)
- `sort`: `price_asc` | `price_desc` | `newest` | `popular` (default: `popular`)

**Response**:
```json
{
  "success": true,
  "data": {
    "hot_sale": {
      "id": 1,
      "name": "Flash Sale - Processors",
      "discount_percentage": 40,
      "end_time": "2025-11-18T14:00:00Z"
    },
    "products": [
      {
        "id": 101,
        "name": "Intel Core i9-13900K",
        "original_price": 689.99,
        "sale_price": 413.99,
        "discount_percentage": 40,
        "savings": 276,
        "image": "https://...",
        "category": "Processeurs",
        "condition": "Neuf",
        "isPromo": true,
        "quantity_available": 25,
        "quantity_sold": 8,
        "uuid": "uuid-string",
        "rating": 4.8,
        "reviews_count": 245
      }
    ],
    "pagination": {
      "total": 15,
      "page": 1,
      "limit": 12,
      "pages": 2
    }
  }
}
```

---

### 4. POST `/api/hot-sales` (Admin Only)

**Description**: Create a new hot sale.

**Authentication**: JWT Token (Admin Role Required)

**Request Body**:
```json
{
  "name": "Flash Sale - Graphics Cards",
  "description": "Limited time offer on GPUs",
  "discount_percentage": 45,
  "start_time": "2025-11-18T15:00:00Z",
  "end_time": "2025-11-18T21:00:00Z",
  "category_id": 3,
  "emoji": "💎",
  "product_ids": [201, 202, 203, 204, 205],
  "image_url": "https://..."
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": 4,
    "name": "Flash Sale - Graphics Cards",
    "discount_percentage": 45,
    "emoji": "💎",
    "status": "upcoming",
    "product_count": 5,
    "created_at": "2025-11-18T12:00:00Z"
  }
}
```

---

### 5. PUT `/api/hot-sales/:id` (Admin Only)

**Description**: Update an existing hot sale.

**Authentication**: JWT Token (Admin Role Required)

**Request Body**:
```json
{
  "name": "Updated Flash Sale Name",
  "discount_percentage": 50,
  "end_time": "2025-11-18T22:00:00Z",
  "status": "active"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": 4,
    "name": "Updated Flash Sale Name",
    "discount_percentage": 50,
    "status": "active",
    "updated_at": "2025-11-18T12:30:00Z"
  }
}
```

---

### 6. DELETE `/api/hot-sales/:id` (Admin Only)

**Description**: Delete a hot sale.

**Authentication**: JWT Token (Admin Role Required)

**Response**:
```json
{
  "success": true,
  "message": "Hot sale deleted successfully"
}
```

---

### 7. POST `/api/hot-sales/:id/products` (Admin Only)

**Description**: Add products to a hot sale.

**Authentication**: JWT Token (Admin Role Required)

**Request Body**:
```json
{
  "product_ids": [101, 102, 103],
  "sale_prices": [413.99, 599.99, 849.99]
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "hot_sale_id": 1,
    "products_added": 3,
    "total_products": 18
  }
}
```

---

### 8. DELETE `/api/hot-sales/:id/products/:product_id` (Admin Only)

**Description**: Remove a product from a hot sale.

**Authentication**: JWT Token (Admin Role Required)

**Response**:
```json
{
  "success": true,
  "message": "Product removed from hot sale"
}
```

---

## Implementation Phases

### Phase 1: Core Data Layer (Priority: HIGH)

1. Create database tables (`hot_sales`, `hot_sale_products`)
2. Create migration scripts
3. Add database connection and queries

**Estimated Time**: 4-6 hours

### Phase 2: API Endpoints (Priority: HIGH)

1. Implement GET endpoints (retrieves active sales, products)
2. Add pagination logic
3. Add sorting and filtering
4. Add countdown time calculation
5. Implement error handling

**Estimated Time**: 8-10 hours

### Phase 3: Admin Operations (Priority: MEDIUM)

1. Implement POST/PUT/DELETE endpoints
2. Add admin authentication middleware
3. Add validation rules
4. Add audit logging

**Estimated Time**: 6-8 hours

### Phase 4: Analytics (Priority: LOW)

1. Create `hot_sale_analytics` table
2. Implement view/click tracking
3. Add revenue calculation
4. Create analytics endpoints

**Estimated Time**: 4-6 hours

---

## Business Logic Rules

### 1. Hot Sale Status Management

- **Upcoming**: Sale has not started yet (`current_time < start_time`)
- **Active**: Sale is currently running (`start_time <= current_time < end_time`)
- **Ended**: Sale has finished (`current_time >= end_time`)

### 2. Pricing Calculation

```
sale_price = original_price * (1 - discount_percentage / 100)
savings = original_price - sale_price
```

### 3. Product Availability

- Maximum quantity available per product per sale
- Track quantity sold in real-time
- Prevent selling beyond available quantity
- Update inventory when order is placed

### 4. Concurrent Sales

- Multiple hot sales can run simultaneously
- Each sale can target different categories
- Products can be part of multiple sales
- Use highest discount percentage for product display

### 5. Countdown Logic

- Calculate remaining time in real-time
- Update client every second
- Mark as "ENDED" when countdown reaches zero
- Disable purchasing when sale ends

---

## Validation Rules

### For Creating/Updating Hot Sales

1. **Name**: Required, max 255 characters
2. **Discount Percentage**: 1-99, required
3. **Start Time**: Must be in the future or current
4. **End Time**: Must be after start_time, max 30 days duration
5. **Category ID**: Optional but if provided must exist
6. **Emoji**: Optional, max 2 characters
7. **Product IDs**: At least 1 product required

### For Adding Products to Sales

1. **Product ID**: Must exist in products table
2. **Sale Price**: Must be less than original price
3. **Quantity**: Must be positive integer

---

## Error Handling

### Common Error Codes

```
400 - Bad Request (Invalid parameters)
401 - Unauthorized (Missing/Invalid token)
403 - Forbidden (Insufficient permissions)
404 - Not Found (Hot sale or product not found)
409 - Conflict (Product already in this sale)
500 - Internal Server Error
```

### Error Response Format

```json
{
  "success": false,
  "error": "Error code or type",
  "message": "Detailed error message",
  "details": {}
}
```

---

## Rate Limiting

- **Public Endpoints**: 100 requests per minute per IP
- **Admin Endpoints**: 50 requests per minute per user
- Use `X-RateLimit-*` headers in response

---

## Caching Strategy

1. **Cache hot sales list**: 5 minutes
2. **Cache hot sale details**: 5 minutes
3. **Cache products per sale**: 3 minutes
4. **Cache invalidation**: On every POST/PUT/DELETE operation
5. Use Redis or similar for caching layer

---

## Testing Checklist

### Unit Tests
- [ ] Time calculation logic
- [ ] Price calculation logic
- [ ] Pagination logic
- [ ] Status determination logic

### Integration Tests
- [ ] GET all hot sales
- [ ] GET specific hot sale with products
- [ ] GET products with pagination
- [ ] Create hot sale (admin)
- [ ] Update hot sale (admin)
- [ ] Delete hot sale (admin)
- [ ] Add products to sale (admin)
- [ ] Remove products from sale (admin)

### Edge Cases
- [ ] Sale with 0 products
- [ ] Sale ending in past
- [ ] Invalid discount percentage
- [ ] Concurrent requests handling
- [ ] Database transaction rollback on error

---

## Frontend-Backend Integration Points

### Data Flow

1. **Page Load**: Frontend calls `GET /api/hot-sales` to fetch active sales
2. **Sale Selection**: Frontend calls `GET /api/hot-sales/:id/products?page=1&limit=12`
3. **Real-time Updates**: Frontend uses countdown timer (client-side calculation)
4. **Admin Panel**: Admin uses POST/PUT/DELETE endpoints to manage sales

### Expected Response Times

- GET endpoints: < 200ms
- Admin POST/PUT endpoints: < 500ms
- Pagination: < 300ms

---

## Security Considerations

1. **Authentication**: Verify JWT token for all admin operations
2. **Authorization**: Check user role (admin) before allowing modifications
3. **Input Validation**: Sanitize all inputs on backend
4. **SQL Injection**: Use parameterized queries
5. **Rate Limiting**: Prevent abuse of endpoints
6. **CORS**: Configure properly for frontend domain

---

## Performance Optimization

1. **Database Indexes**: Create on `status`, `end_time`, `hot_sale_id`
2. **Query Optimization**: Use JOIN instead of N+1 queries
3. **Pagination**: Always paginate product lists
4. **Caching**: Cache frequently accessed data
5. **Connection Pooling**: Use for database connections

---

## Monitoring & Logging

1. **Log all admin operations**: Create, update, delete hot sales
2. **Track errors**: Database connection failures, API errors
3. **Monitor performance**: Response times, database query duration
4. **Analytics tracking**: Track views, clicks, conversions

---

## Future Enhancements

1. **Personalized Hot Sales**: Show different sales based on user preferences
2. **Notification System**: Notify users when a sale starts
3. **Mobile Push Notifications**: Alert app users
4. **AI-Powered Recommendations**: Suggest products based on browsing history
5. **A/B Testing**: Test different sale strategies
6. **Social Sharing**: Allow users to share deals
7. **Wishlist Integration**: Notify users if wishlisted items go on sale

---

## Support & Documentation

For questions or clarifications, contact the frontend team with specific API endpoint or business logic questions.

**Last Updated**: November 18, 2025
**Version**: 1.0
**Status**: Ready for Implementation
