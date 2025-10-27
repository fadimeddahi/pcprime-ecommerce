# Order Error Handling - Complete Guide

## 🎯 Overview

Enhanced error handling for the checkout/order system with detailed error messages, comprehensive logging, and user-friendly error display.

---

## ✅ Changes Made

### 1. **Enhanced Error Extraction** (`src/app/checkout/page.tsx`)

#### Detailed Error Parsing:
```typescript
catch (err: any) {
  // 1. Log full error details
  console.error("❌ Order submission error:", err);
  console.error("❌ Error details:", {
    message: err.message,
    status: err.status,
    data: err.data,
    stack: err.stack
  });
  
  // 2. Extract error message from various sources
  let errorMessage = "Une erreur s'est produite lors de la commande.";
  
  if (err.data) {
    // Priority order:
    // 1. err.data.message
    // 2. err.data.error
    // 3. err.data.details
    // 4. Stringify entire err.data object
  }
  
  // 3. Add HTTP status code
  if (err.status) {
    errorMessage = `[Erreur ${err.status}] ${errorMessage}`;
  }
  
  // 4. Display to user
  setError(errorMessage);
}
```

---

## 🔍 Error Detection Hierarchy

### Level 1: Backend Structured Errors
```json
{
  "status": 400,
  "data": {
    "message": "Invalid phone number format",
    "error": "Validation failed",
    "details": "Phone number must include country code"
  }
}
```
**Result:** `[Erreur 400] Invalid phone number format`

---

### Level 2: Backend Error Field
```json
{
  "status": 500,
  "data": {
    "error": "Database connection failed"
  }
}
```
**Result:** `[Erreur 500] Database connection failed`

---

### Level 3: Backend Details Field
```json
{
  "status": 422,
  "data": {
    "details": {
      "cart_items": "must not be empty",
      "email": "invalid format"
    }
  }
}
```
**Result:** `[Erreur 422] {"cart_items":"must not be empty","email":"invalid format"}`

---

### Level 4: Network/Client Errors
```typescript
{
  message: "Network error occurred",
  status: undefined,
  data: undefined
}
```
**Result:** `Network error occurred`

---

## 🎨 UI Error Display

### Location 1: Above Form (Main Display)
```tsx
{error && (
  <div className="mb-6 p-5 rounded-2xl border-2 border-red-500/50 backdrop-blur-xl animate-pulse">
    <div className="flex items-start gap-4">
      <span className="text-3xl">⚠️</span>
      <div className="flex-1">
        <h3 className="text-red-600 font-extrabold text-lg mb-2 uppercase">
          Erreur de commande
        </h3>
        <p className="text-sm leading-relaxed break-words">
          {error}
        </p>
        <button onClick={() => setError("")} className="mt-3 text-xs font-bold underline">
          Fermer
        </button>
      </div>
    </div>
  </div>
)}
```

**Features:**
- ✅ Large warning icon
- ✅ Bold title
- ✅ Detailed error message
- ✅ Close button
- ✅ Animated pulse effect
- ✅ Responsive design
- ✅ Dark/light theme support

---

### Location 2: In Order Summary (Secondary Display)
```tsx
{error && (
  <div className="mt-4 p-4 bg-red-500/10 border-2 border-red-500/50 rounded-xl animate-pulse">
    <div className="flex items-start gap-3">
      <span className="text-red-500 text-xl">⚠️</span>
      <div className="flex-1">
        <p className="text-red-500 font-bold text-sm mb-1">Erreur de commande</p>
        <p className="text-red-400 text-xs break-words">{error}</p>
      </div>
    </div>
  </div>
)}
```

**Features:**
- ✅ Compact design
- ✅ Fits in order summary card
- ✅ Synchronized with main error display
- ✅ Pulse animation

---

## 📊 Console Logging

### Submission Start:
```typescript
console.log("📤 Submitting order:", orderData);
```

**Output:**
```json
📤 Submitting order: {
  "phone_number": "0555123456",
  "email": "customer@example.com",
  "willaya": "Alger",
  "commune": "Bab Ezzouar",
  "full_name": "John Doe",
  "notes": "",
  "cart_items": [
    { "product_id": 1, "quantity": 2 }
  ]
}
```

---

### Success Response:
```typescript
console.log("✅ Order created successfully:", response);
```

**Output:**
```json
✅ Order created successfully: {
  "id": 123,
  "user_id": 45,
  "total_price": 125000,
  "shipping_cost": 0,
  "status": "pending",
  ...
}
```

---

### Error Response:
```typescript
console.error("❌ Order submission error:", err);
console.error("❌ Error details:", {
  message: err.message,
  status: err.status,
  data: err.data,
  stack: err.stack
});
console.log("📋 Backend error data:", err.data);
console.log("📢 Displaying error to user:", errorMessage);
```

**Output:**
```
❌ Order submission error: ApiError { ... }
❌ Error details: {
  message: "HTTP Error: 400",
  status: 400,
  data: {
    message: "Invalid phone number format",
    error: "Validation failed"
  },
  stack: "ApiError: HTTP Error: 400\n    at fetchApi..."
}
📋 Backend error data: {
  message: "Invalid phone number format",
  error: "Validation failed"
}
📢 Displaying error to user: [Erreur 400] Invalid phone number format
```

---

## 🔧 Common Error Scenarios

### Scenario 1: Validation Error
**Backend Response:**
```json
{
  "status": 400,
  "data": {
    "message": "Validation failed",
    "details": {
      "email": "must be a valid email address",
      "phone_number": "must include country code"
    }
  }
}
```

**User Sees:**
```
⚠️ Erreur de commande
[Erreur 400] Validation failed
```

**Console Output:**
```
❌ Order submission error: ...
📋 Backend error data: { message: "Validation failed", details: {...} }
📢 Displaying error to user: [Erreur 400] Validation failed
```

---

### Scenario 2: Empty Cart
**Backend Response:**
```json
{
  "status": 422,
  "data": {
    "error": "cart_items cannot be empty"
  }
}
```

**User Sees:**
```
⚠️ Erreur de commande
[Erreur 422] cart_items cannot be empty
```

---

### Scenario 3: Product Not Found
**Backend Response:**
```json
{
  "status": 404,
  "data": {
    "message": "Product with ID 999 not found"
  }
}
```

**User Sees:**
```
⚠️ Erreur de commande
[Erreur 404] Product with ID 999 not found
```

---

### Scenario 4: Network Error
**Error:**
```javascript
Error: Failed to fetch
```

**User Sees:**
```
⚠️ Erreur de commande
Failed to fetch
```

**Console Output:**
```
❌ Order submission error: Error: Failed to fetch
❌ Error details: {
  message: "Failed to fetch",
  status: undefined,
  data: undefined,
  stack: "Error: Failed to fetch..."
}
📢 Displaying error to user: Failed to fetch
```

---

### Scenario 5: Server Error (500)
**Backend Response:**
```json
{
  "status": 500,
  "data": {
    "error": "Internal server error",
    "message": "Database connection timeout"
  }
}
```

**User Sees:**
```
⚠️ Erreur de commande
[Erreur 500] Database connection timeout
```

---

### Scenario 6: Unauthorized (401)
**Backend Response:**
```json
{
  "status": 401,
  "data": {
    "message": "Invalid or expired token"
  }
}
```

**User Sees:**
```
⚠️ Erreur de commande
[Erreur 401] Invalid or expired token
```

---

### Scenario 7: Rate Limit (429)
**Backend Response:**
```json
{
  "status": 429,
  "data": {
    "message": "Too many requests. Please try again later."
  }
}
```

**User Sees:**
```
⚠️ Erreur de commande
[Erreur 429] Too many requests. Please try again later.
```

---

## 🧪 Testing Error Handling

### Test 1: Invalid Email
```typescript
// Form data
{
  email: "invalid-email",  // Missing @ symbol
  ...
}

// Expected backend response: 400
// Expected user message: [Erreur 400] Invalid email format
```

---

### Test 2: Empty Cart Items
```typescript
// Cart items
cart_items: []

// Expected backend response: 422
// Expected user message: [Erreur 422] cart_items cannot be empty
```

---

### Test 3: Missing Required Fields
```typescript
// Form data (missing phone)
{
  email: "test@example.com",
  phone_number: "",  // Empty
  ...
}

// Expected backend response: 400
// Expected user message: [Erreur 400] phone_number is required
```

---

### Test 4: Network Offline
```typescript
// Disable internet connection
// Submit order

// Expected user message: Failed to fetch
// Console shows: Network error occurred
```

---

### Test 5: Product Out of Stock
```typescript
// Cart items
cart_items: [
  { product_id: 1, quantity: 100 }  // Exceeds stock
]

// Expected backend response: 422
// Expected user message: [Erreur 422] Product quantity exceeds available stock
```

---

## 📝 Error Message Translations

### HTTP Status Codes:
- `400` - Bad Request (Invalid input)
- `401` - Unauthorized (Login required)
- `403` - Forbidden (Access denied)
- `404` - Not Found (Resource doesn't exist)
- `422` - Unprocessable Entity (Validation failed)
- `429` - Too Many Requests (Rate limited)
- `500` - Internal Server Error (Backend issue)
- `502` - Bad Gateway (Server unreachable)
- `503` - Service Unavailable (Server down)

---

## 🎯 Error Handling Best Practices

### ✅ DO:
1. **Log detailed error information** for debugging
2. **Display user-friendly messages** in French
3. **Include status codes** for technical context
4. **Preserve form data** on error (don't reset)
5. **Allow error dismissal** with close button
6. **Show errors prominently** above form
7. **Use animations** to draw attention
8. **Format long errors** with line breaks

### ❌ DON'T:
1. Show raw stack traces to users
2. Display undefined or null as error message
3. Clear cart on error
4. Reset form fields on error
5. Hide errors in console
6. Use technical jargon in user messages
7. Ignore error status codes
8. Make error messages too generic

---

## 🔧 Debugging Checklist

### When Order Fails:

1. **Check Console Logs:**
   ```
   📤 Submitting order: {...}  ← Verify payload format
   ❌ Order submission error   ← Error occurred
   📋 Backend error data       ← Backend response
   📢 Displaying error to user ← Final message
   ```

2. **Verify Network Tab:**
   - Request URL: `POST /orders/direct`
   - Request headers: `Content-Type`, `Authorization`
   - Request payload: JSON format
   - Response status: 200/400/500
   - Response body: Error details

3. **Check Form Data:**
   - All required fields filled
   - Valid email format
   - Valid phone number
   - Cart has items
   - Items have valid product_id and quantity

4. **Verify Backend:**
   - Server is running
   - Database is accessible
   - Products exist in database
   - Quantities are available

---

## 🚀 Features Implemented

✅ **Detailed Error Extraction**
- Checks `err.data.message` first
- Falls back to `err.data.error`
- Tries `err.data.details`
- Uses `err.message` as last resort
- Stringifies complex objects

✅ **HTTP Status Codes**
- Prefixes error with `[Erreur XXX]`
- Helps identify error category

✅ **Comprehensive Logging**
- Submission payload logged
- Full error details logged
- Backend response logged
- User message logged

✅ **Dual Error Display**
- Large banner above form
- Compact display in order summary
- Both synchronized

✅ **User-Friendly Features**
- Warning emoji (⚠️)
- Bold title
- Clear error message
- Close button
- Pulse animation
- Dark/light theme support

✅ **Form Preservation**
- Form data NOT cleared on error
- User can fix and resubmit
- Cart items remain intact

---

## 📊 Error Flow Diagram

```
User Submits Order
       ↓
[Submit Button Clicked]
       ↓
setIsSubmitting(true)
       ↓
📤 Log: "Submitting order"
       ↓
[API Call: orderApi.createOrder()]
       ↓
   ┌────────┴────────┐
   ↓                 ↓
SUCCESS          ERROR
   ↓                 ↓
✅ Log          ❌ Log Error Details
   ↓                 ↓
Clear Cart      Extract Error Message
   ↓                 ↓
Show Success    Add Status Code
   ↓                 ↓
Redirect        📢 Log Final Message
                     ↓
                setError(errorMessage)
                     ↓
                setIsSubmitting(false)
                     ↓
                [Show Error Banner]
                     ↓
                [User Sees Error]
                     ↓
                [User Can Retry]
```

---

## ✨ Status

**Error handling is now production-ready! 🎉**

Users will see:
- ✅ Detailed error messages from backend
- ✅ HTTP status codes for context
- ✅ User-friendly error display
- ✅ Ability to dismiss errors
- ✅ Preserved form data to retry

Developers will see:
- ✅ Complete error logging in console
- ✅ Backend response details
- ✅ Stack traces for debugging
- ✅ Clear error flow tracking

**Test the error handling by:**
1. Submitting with invalid data
2. Turning off backend server
3. Using invalid product IDs
4. Checking console for detailed logs
