# Order Integration - Complete Guide

## 🎯 Overview

Successfully integrated the checkout/order system with the backend API at `https://pcprimedz.onrender.com`. The system supports both authenticated and anonymous orders with dynamic shipping costs.

---

## ✅ Changes Made

### 1. **Added Order API Service** (`src/app/services/api.ts`)

#### New Types:
```typescript
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
```

#### New API Method:
```typescript
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
```

---

### 2. **Updated Checkout Page** (`src/app/checkout/page.tsx`)

#### Removed Fields (Simplified):
- ❌ `address` - No longer needed
- ❌ `city` - Replaced with `commune`
- ❌ `postalCode` - Not required by backend

#### New Fields (Backend Required):
- ✅ `firstName` & `lastName` - Combined into `full_name`
- ✅ `email` - User email
- ✅ `phone` - Maps to `phone_number`
- ✅ `wilaya` - Maps to `willaya` (backend spelling)
- ✅ `commune` - User's commune

#### New State Variables:
```typescript
const [isSubmitting, setIsSubmitting] = useState(false);
const [error, setError] = useState("");
const [isAuthenticated, setIsAuthenticated] = useState(false);
```

#### Updated Form Data Structure:
```typescript
const [formData, setFormData] = useState({
  // Personal Info
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  
  // Shipping Address (Simplified)
  commune: "",
  wilaya: "",
  
  // Payment
  paymentMethod: "cash",
  notes: "",
});
```

#### New Submit Handler:
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");
  setIsSubmitting(true);

  try {
    // Format cart items for backend
    const cart_items = cartItems.map(item => ({
      product_id: Number(item.id),
      quantity: item.quantity
    }));

    // Prepare order data
    const orderData = {
      phone_number: formData.phone,
      email: formData.email,
      willaya: formData.wilaya,        // Note: backend uses 'willaya'
      commune: formData.commune,
      full_name: `${formData.firstName} ${formData.lastName}`.trim(),
      cart_items: cart_items
    };

    // Submit order to backend
    const response = await orderApi.createOrder(orderData);
    
    console.log("Order created successfully:", response);
    
    // Clear cart from localStorage
    clearCart();
    
    // Show success message
    setOrderPlaced(true);
    
    // Redirect after 5 seconds
    setTimeout(() => {
      router.push("/");
    }, 5000);
    
  } catch (err: any) {
    console.error("Order submission error:", err);
    setError(err.message || "Une erreur s'est produite lors de la commande. Veuillez réessayer.");
    setIsSubmitting(false);
  }
};
```

#### Dynamic Shipping Cost Display:
```typescript
// In order summary
<div className="flex justify-between items-center">
  <div className="flex items-center gap-2">
    <FaTruck className={`text-sm ${isAuthenticated ? 'text-green-400' : 'text-[#fe8002]'}`} />
    <span className="font-bold">Livraison:</span>
  </div>
  {isAuthenticated ? (
    <span className="text-green-400 font-bold">Gratuite (0 DZD)</span>
  ) : (
    <span className="text-[#fe8002] font-bold">500 DZD</span>
  )}
</div>

{!isAuthenticated && (
  <div className="text-xs p-2 rounded-lg">
    💡 Connectez-vous pour bénéficier de la livraison gratuite !
  </div>
)}

// Total calculation with shipping
<span className="text-2xl font-extrabold">
  {(getCartTotal() + (isAuthenticated ? 0 : 500)).toLocaleString('fr-DZ')} DZD
</span>
```

#### Error Display:
```typescript
{error && (
  <div className="mt-4 p-4 bg-red-500/10 border-2 border-red-500/40 rounded-xl">
    <p className="text-red-500 text-sm font-bold text-center">{error}</p>
  </div>
)}
```

#### Submit Button with Loading State:
```typescript
<button
  type="submit"
  onClick={handleSubmit}
  disabled={isSubmitting}
  className={`w-full mt-6 bg-gradient-to-r from-[#fe8002] via-[#ff4500] to-[#fe8002] 
    ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
>
  <span className="relative">
    {isSubmitting ? 'Traitement...' : 'Confirmer la commande'}
  </span>
</button>
```

---

## 🔄 Order Flow

### User Journey:

1. **Add Products to Cart**
   - User browses products
   - Clicks "Add to Cart" on desired products
   - Cart stored in localStorage

2. **Navigate to Checkout**
   - User clicks cart icon → "Passer commande"
   - Redirects to `/checkout`

3. **Fill Order Form**
   - Personal Info: First name, last name, email, phone
   - Shipping Address: Wilaya, commune
   - Payment Method: Cash on delivery / Card

4. **Submit Order**
   - Form validates required fields
   - Cart items formatted: `[{ product_id: 1, quantity: 2 }, ...]`
   - Order data sent to backend

5. **Backend Processing**
   ```
   POST https://pcprimedz.onrender.com/orders/direct
   Headers:
   - Content-Type: application/json
   - Authorization: Bearer {token}  (if logged in)
   
   Body:
   {
     "phone_number": "0555123456",
     "email": "user@example.com",
     "willaya": "Alger",
     "commune": "Bab Ezzouar",
     "full_name": "Ahmed Benali",
     "cart_items": [
       { "product_id": 1, "quantity": 2 },
       { "product_id": 5, "quantity": 1 }
     ]
   }
   ```

6. **Backend Response**
   ```json
   {
     "id": 123,
     "user_id": 45,
     "phone_number": "0555123456",
     "email": "user@example.com",
     "willaya": "Alger",
     "commune": "Bab Ezzouar",
     "full_name": "Ahmed Benali",
     "total_price": 125000,
     "shipping_cost": 0,
     "status": "pending",
     "created_at": "2025-10-19T10:30:00Z",
     "updated_at": "2025-10-19T10:30:00Z"
   }
   ```

7. **Success Handling**
   - Clear cart from localStorage
   - Show success message with order confirmation
   - Redirect to homepage after 5 seconds

8. **Error Handling**
   - Display error message if API fails
   - Keep form data intact
   - Allow user to retry

---

## 💰 Shipping Logic

### Free Shipping (0 DZD)
**Condition:** User is logged in with valid JWT token

```typescript
if (authApi.isAuthenticated()) {
  shippingCost = 0;
  // Backend receives Authorization header
  // Backend sets shipping_cost = 0 in response
}
```

**Benefits:**
- ✅ Free delivery
- ✅ Order linked to user account
- ✅ Track order history in profile
- ✅ Easier customer support

### Paid Shipping (500 DZD)
**Condition:** Anonymous user (no token)

```typescript
if (!authApi.isAuthenticated()) {
  shippingCost = 500;
  // No Authorization header sent
  // Backend sets shipping_cost = 500 in response
}
```

**Notice:** Frontend displays message encouraging login for free shipping

---

## 🛒 Cart Format

### Frontend Cart (localStorage):
```typescript
interface CartItem {
  id: number | string;
  name: string;
  price: number;
  image: string;
  category: string;
  quantity: number;
}
```

### Backend Cart Format (API):
```typescript
interface OrderItem {
  product_id: number;
  quantity: number;
}
```

### Transformation:
```typescript
const cart_items = cartItems.map(item => ({
  product_id: Number(item.id),  // Ensure number type
  quantity: item.quantity
}));
```

---

## 🌐 API Endpoint Details

### Endpoint:
```
POST /orders/direct
```

### Full URL:
```
https://pcprimedz.onrender.com/orders/direct
```

### Headers:

#### Required:
```
Content-Type: application/json
```

#### Optional (for free shipping):
```
Authorization: Bearer {jwt_token}
```

### Request Body:
```json
{
  "phone_number": "string (required)",
  "email": "string (required, valid email)",
  "willaya": "string (required)",
  "commune": "string (required)",
  "full_name": "string (required)",
  "cart_items": [
    {
      "product_id": number (required),
      "quantity": number (required, > 0)
    }
  ]
}
```

### Response (Success - 200/201):
```json
{
  "id": number,
  "user_id": number | null,
  "phone_number": "string",
  "email": "string",
  "willaya": "string",
  "commune": "string",
  "full_name": "string",
  "total_price": number,
  "shipping_cost": number,
  "status": "string",
  "created_at": "ISO8601 datetime",
  "updated_at": "ISO8601 datetime"
}
```

### Response (Error - 4xx/5xx):
```json
{
  "message": "Error description",
  "error": "Error details (optional)"
}
```

---

## 🎨 UI Features

### Order Summary Card:
- ✅ Product list with images
- ✅ Quantities and individual prices
- ✅ Subtotal calculation
- ✅ Dynamic shipping cost
- ✅ Authentication status indicator
- ✅ Free shipping promotion message
- ✅ Grand total with shipping
- ✅ Error message display
- ✅ Loading state on submit button

### Form Features:
- ✅ Required field validation
- ✅ Email format validation
- ✅ Phone number input
- ✅ Wilaya dropdown selector
- ✅ Commune text input
- ✅ Payment method selection
- ✅ Optional notes field
- ✅ Responsive design
- ✅ Dark/light theme support

### Success Page:
- ✅ Animated checkmark icon
- ✅ Success message
- ✅ Auto-redirect countdown
- ✅ Manual "Return to shop" button
- ✅ Clean cart state

---

## 🧪 Testing Guide

### Test Case 1: Anonymous Order (With Shipping)
```
1. Do NOT log in
2. Add products to cart
3. Go to checkout
4. Fill form:
   - First name: "John"
   - Last name: "Doe"
   - Email: "john@test.com"
   - Phone: "0555123456"
   - Wilaya: "Alger"
   - Commune: "Bab Ezzouar"
5. Verify shipping cost shows: 500 DZD
6. Verify total = subtotal + 500 DZD
7. Submit order
8. Check network tab: No Authorization header
9. Verify order created with shipping_cost: 500
```

### Test Case 2: Authenticated Order (Free Shipping)
```
1. Log in with valid credentials
2. Add products to cart
3. Go to checkout
4. Fill form with valid data
5. Verify shipping shows: "Gratuite (0 DZD)"
6. Verify total = subtotal (no shipping added)
7. Verify promotion message displayed
8. Submit order
9. Check network tab: Authorization header present
10. Verify order created with shipping_cost: 0
```

### Test Case 3: Validation Errors
```
1. Go to checkout with items in cart
2. Try submitting without filling required fields
3. Verify HTML5 validation triggers
4. Fill invalid email format
5. Verify email validation error
```

### Test Case 4: API Error Handling
```
1. Turn off internet / block backend URL
2. Fill form and submit
3. Verify error message displays
4. Verify cart is NOT cleared
5. Verify form data is preserved
6. Restore connection
7. Retry submission
8. Verify success
```

### Test Case 5: Empty Cart
```
1. Clear cart
2. Navigate to /checkout
3. Verify "Cart is empty" message
4. Verify "Return to shop" button
5. Click button → redirects to homepage
```

---

## 📊 Backend Expectations

### What Backend Should Do:

1. **Receive Order Request**
   - Validate all required fields
   - Check if Authorization header present

2. **Check Authentication**
   ```
   if Authorization header:
     - Verify JWT token
     - Extract user_id from token
     - Set shipping_cost = 0
     - Link order to user account
   else:
     - user_id = null
     - Set shipping_cost = 500
   ```

3. **Calculate Total Price**
   ```
   total_price = sum(product.price * item.quantity for each cart_item) + shipping_cost
   ```

4. **Create Order Record**
   ```
   - Save order in database
   - Create order_items for each cart_item
   - Set status = "pending"
   - Generate order ID
   ```

5. **Return Response**
   ```json
   {
     "id": generated_order_id,
     "user_id": user_id_or_null,
     "total_price": calculated_total,
     "shipping_cost": 0_or_500,
     "status": "pending",
     ...
   }
   ```

---

## 🔐 Security Notes

### Token Storage:
- JWT token stored in localStorage as `auth_token`
- Retrieved via `authApi.getToken()`
- Sent in Authorization header: `Bearer {token}`

### Validation:
- Frontend validates required fields
- Backend should validate:
  - Email format
  - Phone number format
  - Product IDs exist
  - Quantities are positive
  - Token validity (if present)

### Error Handling:
- API errors caught and displayed
- Network errors handled gracefully
- User data preserved on error

---

## 📝 Frontend Code Summary

### Key Files Changed:

1. **`src/app/services/api.ts`**
   - Added `OrderItem`, `CreateOrderRequest`, `OrderResponse` types
   - Added `orderApi.createOrder()` method
   - Handles Authorization header conditionally

2. **`src/app/checkout/page.tsx`**
   - Simplified form fields (removed address, city, postalCode)
   - Added authentication check
   - Added order submission logic
   - Added dynamic shipping cost display
   - Added error handling and loading states
   - Added success page

---

## ✨ Features Implemented

✅ Order submission to backend API  
✅ Cart items formatted correctly  
✅ Authentication detection  
✅ Dynamic shipping costs (0 DZD / 500 DZD)  
✅ Authorization header for logged-in users  
✅ Error handling with user feedback  
✅ Loading states during submission  
✅ Cart clearing after success  
✅ Success page with auto-redirect  
✅ Form validation  
✅ Responsive design  
✅ Dark/light theme support  
✅ Promotion message for free shipping  

---

## 🚀 Next Steps

### Recommended Enhancements:

1. **Order Tracking**
   - Create order history page
   - Display user's past orders
   - Show order status updates

2. **Email Confirmation**
   - Backend sends confirmation email
   - Include order details and tracking

3. **Payment Integration**
   - Integrate CIB payment gateway
   - Handle card payment flow

4. **Order Management**
   - Admin panel for order management
   - Status updates (pending → confirmed → shipped → delivered)

5. **Inventory Validation**
   - Check product stock before order
   - Prevent out-of-stock orders

---

## 🎉 Status

**Order integration is complete and ready to use!**

Users can now:
- ✅ Add products to cart
- ✅ Complete checkout form
- ✅ Submit orders to backend
- ✅ Get free shipping when logged in
- ✅ Receive order confirmation

**Test the checkout flow by adding products to cart and visiting `/checkout`**
