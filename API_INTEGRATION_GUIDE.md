# Product API Integration with React Query

## 📚 Overview

This integration provides a complete solution for fetching and managing products from your backend API using React Query (TanStack Query).

## 🔧 Setup

### 1. Installation

The necessary packages have been installed:
```bash
npm install @tanstack/react-query
```

### 2. Environment Variables

Create a `.env.local` file in your project root:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### 3. Wrap Your App with React Query Provider

Update your `layout.tsx` to include the React Query provider:

```tsx
import ReactQueryProvider from './providers/ReactQueryProvider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <ReactQueryProvider>
          {/* Your other providers */}
          {children}
        </ReactQueryProvider>
      </body>
    </html>
  );
}
```

## 📁 File Structure

```
src/app/
├── services/
│   └── api.ts                 # API service functions
├── hooks/
│   └── useProducts.ts         # React Query hooks
├── types/
│   └── product.ts             # TypeScript interfaces
├── providers/
│   └── ReactQueryProvider.tsx # Query client provider
└── components/
    └── product-search.tsx     # Example component using the API
```

## 🎯 Available API Endpoints

### 1. Get Single Product
```typescript
GET /products/:id
```

### 2. Get All Products
```typescript
GET /products/all
```

### 3. Search Products
```typescript
GET /products/search?q=laptop&limit=10&offset=0
```

## 🪝 React Query Hooks

### `useProduct(id)`
Fetch a single product by ID.

```tsx
import { useProduct } from '@/app/hooks/useProducts';

function ProductDetail({ productId }: { productId: string }) {
  const { data: product, isLoading, isError, error } = useProduct(productId);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      <h1>{product?.name}</h1>
      <p>{product?.price} DZD</p>
    </div>
  );
}
```

### `useAllProducts()`
Fetch all products.

```tsx
import { useAllProducts } from '@/app/hooks/useProducts';

function ProductsList() {
  const { data, isLoading, isError } = useAllProducts();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading products</div>;
  
  return (
    <div>
      {data?.products.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
}
```

### `useSearchProducts(params)`
Search products with pagination.

```tsx
import { useSearchProducts } from '@/app/hooks/useProducts';
import { useState } from 'react';

function ProductSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const LIMIT = 10;

  const { data, isLoading, isError } = useSearchProducts({
    q: searchQuery,
    limit: LIMIT,
    offset: page * LIMIT,
  });

  return (
    <div>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search products..."
      />
      
      {isLoading && <div>Searching...</div>}
      {isError && <div>Error occurred</div>}
      
      {data?.products.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
      
      {/* Pagination */}
      <button onClick={() => setPage(p => p - 1)} disabled={page === 0}>
        Previous
      </button>
      <button onClick={() => setPage(p => p + 1)} disabled={!data?.hasMore}>
        Next
      </button>
    </div>
  );
}
```

## 🔑 Key Features

### ✅ Automatic Caching
React Query automatically caches your API responses. Default stale time:
- Product details: 5 minutes
- All products: 5 minutes
- Search results: 2 minutes

### ✅ Error Handling
Built-in error handling with custom `ApiError` class:

```tsx
const { data, isError, error } = useProduct(id);

if (isError) {
  console.log(error.message);    // User-friendly message
  console.log(error.status);     // HTTP status code
  console.log(error.data);       // Server error data
}
```

### ✅ Loading States
Easy loading state management:

```tsx
const { isLoading, isFetching } = useProduct(id);

// isLoading: true on initial load
// isFetching: true on background refetch
```

### ✅ Pagination Support
Built-in pagination for search:

```tsx
const { data } = useSearchProducts({
  q: 'laptop',
  limit: 10,
  offset: 0
});

// Response includes:
// - products: Product[]
// - total: number
// - hasMore: boolean
```

## 📝 TypeScript Types

### Product Interface
```typescript
interface Product {
  id: number | string;
  name: string;
  category: string;
  image: string;
  price: number;
  oldPrice?: number;
  condition?: string;
  isTopSeller?: boolean;
  isPromo?: boolean;
  discount?: number;
  warrantyMonths?: number;
  originalPrice?: number;
  description?: string;
  inStock?: boolean;
  rating?: number;
  reviews?: number;
}
```

### Search Response
```typescript
interface SearchProductsResponse {
  products: Product[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}
```

## 🎨 Example Component

A complete example component is available at:
```
src/app/components/product-search.tsx
```

This includes:
- Search with debouncing
- Loading states
- Error handling
- Empty states
- Pagination controls
- Theme support

## 🚀 Usage in Your App

1. Import the hook you need
2. Call it in your component
3. Handle loading/error states
4. Display the data

```tsx
import { useSearchProducts } from '@/app/hooks/useProducts';

export default function MyComponent() {
  const { data, isLoading, isError, error } = useSearchProducts({
    q: 'gaming pc',
    limit: 20,
    offset: 0
  });

  // Your component logic
}
```

## 🔄 Refetching Data

React Query provides several ways to refetch:

```tsx
const { refetch } = useProduct(id);

// Manual refetch
<button onClick={() => refetch()}>Refresh</button>
```

## ⚙️ Customization

### Change API URL
Update `.env.local`:
```env
NEXT_PUBLIC_API_URL=https://your-api.com
```

### Adjust Cache Time
Modify in `src/app/hooks/useProducts.ts`:
```tsx
staleTime: 10 * 60 * 1000  // 10 minutes
```

### Add Request Headers
Update `src/app/services/api.ts`:
```tsx
headers: {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`,
  ...options.headers,
}
```

## 🐛 Debugging

Enable React Query DevTools (optional):
```tsx
// Add to your layout or main component
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

<ReactQueryProvider>
  {children}
  <ReactQueryDevtools initialIsOpen={false} />
</ReactQueryProvider>
```

Install dev tools:
```bash
npm install @tanstack/react-query-devtools
```

## 📚 Additional Resources

- [React Query Docs](https://tanstack.com/query/latest/docs/react/overview)
- [Error Handling](https://tanstack.com/query/latest/docs/react/guides/query-functions#handling-and-throwing-errors)
- [Pagination](https://tanstack.com/query/latest/docs/react/guides/paginated-queries)
