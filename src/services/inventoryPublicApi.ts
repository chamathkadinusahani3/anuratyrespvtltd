/// <reference types="vite/client" />
import type {
  ProductListResponse,
  ProductDetailResponse,
  ProductMetaResponse,
  ProductFilters,
} from '../types/inventoryPublic';

const API_URL = (import.meta as { env: { VITE_API_URL?: string } }).env.VITE_API_URL || 'https://anuratyres-backend-emm1774.vercel.app/api';

function buildQuery(params: Record<string, string | number | undefined>): string {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== '' && v !== null) q.set(k, String(v));
  }
  const str = q.toString();
  return str ? `?${str}` : '';
}

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { message?: string };
    throw new Error(err.message || `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const productsAPI = {
  list(filters: Partial<ProductFilters> & { page?: number; limit?: number }) {
    const query = buildQuery({
      search: filters.search,
      category: filters.category,
      brand: filters.brand,
      stockStatus: filters.stockStatus,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      tyreSize: filters.tyreSize,
      sort: filters.sort,
      page: filters.page,
      limit: filters.limit,
    });
    return getJson<ProductListResponse>(`/products${query}`);
  },

  featured() {
    return getJson<{ success: boolean; products: ProductListResponse['products'] }>('/products/featured');
  },

  meta() {
    return getJson<ProductMetaResponse>('/products/meta');
  },

  getById(id: string) {
    return getJson<ProductDetailResponse>(`/products/${id}`);
  },
};
