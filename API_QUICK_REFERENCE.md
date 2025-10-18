# 🎯 Quick Reference: Category & Product API

## 📦 Import Statements

```typescript
// For Products
import { useAllProducts, useProduct, useSearchProducts } from '@/app/hooks/useProducts';

// For Categories
import { useAllCategories, useCategory } from '@/app/hooks/useProducts';
// OR
import { useAllCategories, useCategory } from '@/app/hooks/useCategories';

// Types
import { Product, Category, BackendCategory } from '@/app/types/product';
```

## 🔌 Available Hooks

### Products

| Hook | Endpoint | Returns | Use Case |
|------|----------|---------|----------|
| `useAllProducts()` | `GET /products/all` | `Product[]` | Product listing |
| `useProduct(id)` | `GET /products/:id` | `Product` | Product detail page |
| `useSearchProducts(q, limit, offset)` | `GET /products/search` | `SearchProductsResponse` | Search functionality |

### Categories

| Hook | Endpoint | Returns | Use Case |
|------|----------|---------|----------|
| `useAllCategories()` | `GET /categories/all` | `Category[]` | Filters, navigation |
| `useCategory(id)` | `GET /categories/:id` | `BackendCategory` | Category page with products |

## 📋 Type Definitions

### Product
```typescript
{
  id: number | string;
  name: string;
  category: string;        // Normalized to string
  image: string;           // From image_url
  price: number;
  oldPrice?: number;
  condition?: string;      // From etat
  isPromo?: boolean;       // From is_promo
  discount?: number;
  warrantyMonths?: number;
  description?: string;
  inStock?: boolean;       // From quantity
  rating?: number;
  reviews?: number;
  brand?: string;
}
```

### Category (Frontend)
```typescript
{
  id: number;
  name: string;
  description?: string;
}
```

### BackendCategory (with products)
```typescript
{
  id: number;
  name: string;
  description?: string;
  products?: Product[];    // Normalized products
  // + other backend fields
}
```

## 💡 Common Patterns

### Category Filter
```typescript
const { data: categories = [] } = useAllCategories();

<select>
  {categories.map(cat => (
    <option key={cat.id} value={cat.id}>{cat.name}</option>
  ))}
</select>
```

### Product List
```typescript
const { data: products = [], isLoading } = useAllProducts();

{products.map(product => (
  <ProductCard key={product.id} product={product} />
))}
```

### Category Page with Products
```typescript
const { data: category } = useCategory(categoryId);

<div>
  <h1>{category?.name}</h1>
  <div>
    {category?.products?.map(product => (
      <ProductCard key={product.id} product={product} />
    ))}
  </div>
</div>
```

### Search with Pagination
```typescript
const [query, setQuery] = useState('');
const [page, setPage] = useState(0);
const limit = 20;

const { data } = useSearchProducts(query, limit, page * limit);

// data.products, data.total, data.hasMore
```

## 🎨 Image Handling

```typescript
import Image from 'next/image';

// With fallback
<Image 
  src={product.image || '/placeholder.png'}
  alt={product.name}
  width={300}
  height={300}
/>

// Conditional rendering
{product.image ? (
  <Image src={product.image} ... />
) : (
  <div className="placeholder">No Image</div>
)}
```

## ⚡ Performance Tips

1. **Stale Times**:
   - Categories: 10 minutes (rarely change)
   - Products: 5 minutes
   - Search: 2 minutes (more dynamic)

2. **Enable/Disable Queries**:
   ```typescript
   useProduct(id, { enabled: !!id });
   useCategory(categoryId, { enabled: !!categoryId });
   ```

3. **Prefetch on Hover**:
   ```typescript
   const queryClient = useQueryClient();
   
   onMouseEnter={() => {
     queryClient.prefetchQuery({
       queryKey: ['products', 'detail', product.id],
       queryFn: () => productApi.getProductById(product.id)
     });
   }}
   ```

## 🔧 Config Required

### next.config.ts
```typescript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'res.cloudinary.com',
    },
  ],
}
```

## ✅ Status: READY FOR PRODUCTION

All endpoints integrated, normalized, typed, and error-free!
