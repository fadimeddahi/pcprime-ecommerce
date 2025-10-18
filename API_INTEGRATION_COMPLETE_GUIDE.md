# Product API Integration Guide

This guide shows how to use the React Query hooks to integrate with the product API.

## Base URL
```
http://localhost:8080
```

## Available Endpoints

### 1. Get Single Product
**GET** `/products/:id`

### 2. Get All Products
**GET** `/products/all`

### 3. Search Products
**GET** `/products/search?q=query&limit=10&offset=0`

---

## React Query Hooks

### 1. `useProduct` - Get Single Product by ID

```typescript
import { useProduct } from '@/app/hooks/useProducts';

function ProductDetail({ productId }: { productId: string }) {
  const { data: product, isLoading, isError, error } = useProduct(productId);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.price} DZD</p>
      <img src={product.image} alt={product.name} />
    </div>
  );
}
```

### 2. `useAllProducts` - Get All Products

```typescript
import { useAllProducts } from '@/app/hooks/useProducts';

function ProductList() {
  const { data: products, isLoading, isError, error } = useAllProducts();

  if (isLoading) return <div>Loading products...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>All Products ({products?.length || 0})</h1>
      <div className="grid grid-cols-4 gap-4">
        {products?.map((product) => (
          <div key={product.id}>
            <h3>{product.name}</h3>
            <p>{product.price} DZD</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### 3. `useSearchProducts` - Search Products with Pagination

```typescript
import { useState } from 'react';
import { useSearchProducts } from '@/app/hooks/useProducts';

function ProductSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;
  const offset = currentPage * pageSize;

  const { data, isLoading, isError, error } = useSearchProducts(
    searchQuery,
    pageSize,
    offset
  );

  const totalPages = data?.total ? Math.ceil(data.total / pageSize) : 0;

  if (isLoading) return <div>Searching...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div>
      {/* Search Input */}
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          setCurrentPage(0); // Reset to page 0 on new search
        }}
        placeholder="Search products..."
      />

      {/* Results */}
      <div>
        <p>Found {data?.total || 0} results</p>
        {data?.products.map((product) => (
          <div key={product.id}>
            <h3>{product.name}</h3>
            <p>{product.price} DZD</p>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div>
        <button
          onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
          disabled={currentPage === 0}
        >
          Previous
        </button>
        
        <span>Page {currentPage + 1} of {totalPages}</span>
        
        <button
          onClick={() => setCurrentPage(p => p + 1)}
          disabled={currentPage >= totalPages - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
}
```

---

## Complete Example with All States

```typescript
import { useSearchProducts } from '@/app/hooks/useProducts';
import { useState } from 'react';

function AdvancedProductSearch() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(0);
  const limit = 12;

  const {
    data,
    isLoading,
    isError,
    error,
    isFetching,
  } = useSearchProducts(query, limit, page * limit);

  return (
    <div>
      {/* Search Bar */}
      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setPage(0);
        }}
        placeholder="Search..."
      />

      {/* Loading State */}
      {isLoading && <div>Loading...</div>}

      {/* Error State */}
      {isError && (
        <div className="error">
          Error: {error.message}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && query && data?.products.length === 0 && (
        <div>No products found for "{query}"</div>
      )}

      {/* Results */}
      {data && data.products.length > 0 && (
        <>
          <div>
            <p>Found {data.total} results</p>
            {isFetching && <span>Updating...</span>}
          </div>

          <div className="grid">
            {data.products.map((product) => (
              <div key={product.id}>
                <img src={product.image} alt={product.name} />
                <h3>{product.name}</h3>
                <p>{product.price.toLocaleString()} DZD</p>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div>
            <button
              onClick={() => setPage(p => p - 1)}
              disabled={page === 0}
            >
              Previous
            </button>

            <span>
              Page {page + 1} of {Math.ceil(data.total / limit)}
            </span>

            <button
              onClick={() => setPage(p => p + 1)}
              disabled={(page + 1) * limit >= data.total}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
```

---

## API Response Types

```typescript
// Single Product
interface Product {
  id: string | number;
  name: string;
  price: number;
  image: string;
  // ... other fields
}

// Search Response
interface SearchProductsResponse {
  products: Product[];
  total: number;
  limit: number;
  offset: number;
}
```

---

## Error Handling

All hooks return error states that can be used for error handling:

```typescript
const { data, isError, error } = useAllProducts();

if (isError) {
  // error.message - Error message
  // error.status - HTTP status code (if available)
  // error.data - Additional error data
  console.error('API Error:', error);
}
```

---

## Configuration

Update the base URL in `/src/app/services/api.ts`:

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
```

Or set it in your `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:8080
```

---

## Query Options

All hooks accept additional React Query options:

```typescript
const { data } = useAllProducts({
  staleTime: 10 * 60 * 1000, // 10 minutes
  retry: 3,
  refetchOnWindowFocus: false,
});
```

---

## Best Practices

1. **Use proper keys** - Each query has unique keys for caching
2. **Handle loading states** - Always show loading indicators
3. **Handle errors** - Display user-friendly error messages
4. **Pagination** - Reset page to 0 when search query changes
5. **Empty states** - Show helpful messages when no results found

---

## Testing the API

You can test the endpoints directly:

```bash
# Get all products
curl http://localhost:8080/products/all

# Get single product
curl http://localhost:8080/products/123

# Search products
curl "http://localhost:8080/products/search?q=laptop&limit=10&offset=0"
```
