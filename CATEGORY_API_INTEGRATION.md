# Category API Integration Guide

## Overview
This document describes the category API integration for the Next.js e-commerce application. The integration follows the same normalization pattern as the product API, exposing only the fields actually used in the frontend.

## Backend API Contract

### Category Object (Backend Response)
```json
{
  "id": 1,
  "name": "PC Bureau",
  "description": "Desktop computers and workstations",
  "image_url": "https://example.com/category.jpg",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z",
  "products": [...]  // Optional: array of product objects
}
```

### Available Endpoints

#### 1. Get All Categories
- **Endpoint**: `GET /categories` or `GET /categories/all`
- **Response**: Array of category objects
```json
[
  {
    "id": 1,
    "name": "PC Bureau",
    "description": "Desktop computers",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  ...
]
```

#### 2. Get Category by ID
- **Endpoint**: `GET /categories/:id`
- **Response**: Single category object
```json
{
  "id": 1,
  "name": "PC Bureau",
  "description": "Desktop computers and workstations",
  "image_url": "https://example.com/category.jpg",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

#### 3. Get Products by Category
- **Endpoint**: `GET /categories/:id/products`
- **Response**: Array of product objects
```json
[
  {
    "id": 1,
    "name": "Gaming PC Pro",
    "category": {
      "id": 1,
      "name": "PC Bureau"
    },
    "price": 1299.99,
    ...
  },
  ...
]
```

## Frontend Implementation

### Type Definitions (`/src/app/types/product.ts`)

```typescript
// Backend category type (raw from API)
export interface BackendCategory {
  id: number;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
  image_url?: string;
  products?: any[];
}

// Frontend category type (minimal fields used in UI)
export interface Category {
  id: number;
  name: string;
  description?: string;
}

// Response type
export interface CategoriesResponse {
  categories: Category[];
  total: number;
}
```

### API Services (`/src/app/services/api.ts`)

```typescript
// Normalize backend category data to frontend format
function normalizeCategory(category: BackendCategory | any): Category {
  return {
    id: category.id,
    name: category.name,
    description: category.description,
  };
}

export const categoryApi = {
  // Get all categories
  getAllCategories: async (): Promise<Category[]> => {
    const data = await fetchApi<BackendCategory[]>('/categories');
    return data.map(normalizeCategory);
  },

  // Get single category by ID
  getCategoryById: async (id: string | number): Promise<Category> => {
    const data = await fetchApi<BackendCategory>(`/categories/${id}`);
    return normalizeCategory(data);
  },

  // Get products by category ID
  getProductsByCategoryId: async (id: string | number): Promise<Product[]> => {
    const data = await fetchApi<BackendProduct[]>(`/categories/${id}/products`);
    return data.map(normalizeProduct);
  },
};
```

### React Query Hooks (`/src/app/hooks/useProducts.ts`)

```typescript
// Query keys for categories
export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  details: () => [...categoryKeys.all, 'detail'] as const,
  detail: (id: string | number) => [...categoryKeys.details(), id] as const,
  products: (id: string | number) => [...categoryKeys.detail(id), 'products'] as const,
};

// Hook: Get all categories
export const useAllCategories = (options?) => {
  return useQuery<Category[], Error>({
    queryKey: categoryKeys.lists(),
    queryFn: () => categoryApi.getAllCategories(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

// Hook: Get single category by ID
export const useCategory = (id: string | number, options?) => {
  return useQuery<Category, Error>({
    queryKey: categoryKeys.detail(id),
    queryFn: () => categoryApi.getCategoryById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

// Hook: Get products by category ID
export const useProductsByCategory = (categoryId: string | number, options?) => {
  return useQuery<Product[], Error>({
    queryKey: categoryKeys.products(categoryId),
    queryFn: () => categoryApi.getProductsByCategoryId(categoryId),
    enabled: !!categoryId,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};
```

## Usage Examples

### Example 1: Dynamic Category Filter Dropdown

Replace hardcoded category options with dynamic data from the API:

```tsx
'use client';

import { useAllCategories } from '@/app/hooks/useProducts';

export default function ProductsPage() {
  const { data: categories = [], isLoading } = useAllCategories();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  return (
    <select
      value={selectedCategory}
      onChange={(e) => setSelectedCategory(e.target.value)}
    >
      <option value="all">TOUTES LES CATÉGORIES</option>
      {categories.map((category) => (
        <option key={category.id} value={category.name}>
          {category.name.toUpperCase()}
        </option>
      ))}
    </select>
  );
}
```

### Example 2: Category Detail Page

Create a dynamic category page:

```tsx
'use client';

import { useProductsByCategory } from '@/app/hooks/useProducts';

export default function CategoryPage({ params }: { params: { id: string } }) {
  const { data: products = [], isLoading } = useProductsByCategory(params.id);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Category Products</h1>
      <div className="grid grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
```

### Example 3: Category List Page

Display all categories:

```tsx
'use client';

import { useAllCategories } from '@/app/hooks/useProducts';
import Link from 'next/link';

export default function CategoriesPage() {
  const { data: categories = [], isLoading, error } = useAllCategories();

  if (isLoading) return <div>Loading categories...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="grid grid-cols-3 gap-6">
      {categories.map((category) => (
        <Link key={category.id} href={`/category/${category.id}`}>
          <div className="p-6 border rounded-lg hover:shadow-lg">
            <h2 className="text-xl font-bold">{category.name}</h2>
            {category.description && (
              <p className="text-gray-600">{category.description}</p>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
```

## Key Design Decisions

### 1. **Minimal Field Exposure**
Only expose fields that are actually used in the frontend:
- ✅ `id`: For API calls and routing
- ✅ `name`: For display in filters and UI
- ✅ `description`: For category detail pages
- ❌ `image_url`: Not currently used in UI
- ❌ `created_at`, `updated_at`: Not needed in frontend
- ❌ `products`: Too heavy, use separate endpoint

### 2. **Normalization Pattern**
- Backend sends full category objects with all fields
- `normalizeCategory()` extracts only needed fields
- Consistent with product normalization approach
- Type-safe conversion from `BackendCategory` to `Category`

### 3. **React Query Integration**
- Separate query keys for categories and products
- 5-minute stale time for category data (changes infrequently)
- Automatic caching and deduplication
- TypeScript type safety throughout

### 4. **Product Category Relationship**
Products still store category as a string in the normalized frontend format:
```typescript
interface Product {
  category: string; // "PC Bureau", not the full object
  category_id?: number; // Optional reference
}
```

This ensures backward compatibility with existing components while allowing optional category fetching when needed.

## Migration Path

### Current State (Hardcoded)
```tsx
<option value="PC Bureau">PC BUREAU</option>
<option value="PC Portable">PC PORTABLE</option>
<option value="Composants">COMPOSANTS</option>
```

### New State (Dynamic)
```tsx
{categories.map(cat => (
  <option key={cat.id} value={cat.name}>
    {cat.name.toUpperCase()}
  </option>
))}
```

### Benefits
- ✅ Categories managed in backend, not hardcoded in frontend
- ✅ Easy to add/remove categories without code changes
- ✅ Consistent category names across all pages
- ✅ Type-safe category handling
- ✅ Automatic caching and performance optimization

## Testing

### Test API Endpoints
```bash
# Get all categories
curl http://localhost:8080/categories

# Get single category
curl http://localhost:8080/categories/1

# Get products by category
curl http://localhost:8080/categories/1/products
```

### Test React Query Hooks
```tsx
// In your component or test file
const { data, isLoading, error } = useAllCategories();
console.log('Categories:', data);
```

## Error Handling

All category API calls include automatic error handling:
- Network errors are caught and wrapped in `ApiError`
- HTTP errors include status codes and error messages
- React Query provides `isLoading`, `isError`, `error` states
- Fallback to empty arrays prevents crashes

## Next Steps

1. **Update Filter Components**: Replace hardcoded category options with `useAllCategories()`
2. **Create Category Pages**: Add dynamic category detail pages using `useProductsByCategory()`
3. **Add Category Navigation**: Update footer/navbar category links to use dynamic data
4. **Implement Category Images**: If needed, extend `Category` type to include `image_url`
5. **Add Search by Category**: Combine product search with category filtering

## Related Files

- `/src/app/types/product.ts` - Type definitions
- `/src/app/services/api.ts` - API service functions
- `/src/app/hooks/useProducts.ts` - React Query hooks
- `/src/app/components/products.tsx` - Main products listing (update category filter)
- `/src/app/components/footer.tsx` - Footer category links (update to be dynamic)

## Summary

✅ Category API integration complete
✅ Only exposes fields used in frontend (id, name, description)
✅ Follows same normalization pattern as products
✅ Type-safe with full TypeScript support
✅ React Query hooks for efficient data fetching
✅ Backward compatible with existing components
✅ Ready for dynamic category management
