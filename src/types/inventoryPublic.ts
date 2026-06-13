// Public-facing inventory product types — no buy-price or admin fields exposed.

export interface TyreSpec {
  size: string;
  width: number | null;
  profile: number | null;
  rimSize: number | null;
  loadIndex: string;
  speedRating: string;
  season: string;
  pattern: string;
}

export interface ProductImage {
  id: string;
  url: string;
  publicId: string;
  featured: boolean;
  sortOrder: number;
  alt: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  quantity: number;
  minimumStock: number;
  stockStatus: 'In Stock' | 'Low Stock' | 'Out of Stock';
  tyre?: Partial<TyreSpec>;
  barcode?: string;
  location?: string;
  images: ProductImage[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductListResponse {
  success: boolean;
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ProductDetailResponse {
  success: boolean;
  product: Product;
  related: Product[];
}

export interface ProductMetaResponse {
  success: boolean;
  brands: string[];
  categories: string[];
  tyreSizes: string[];
  priceRange: {
    min: number;
    max: number;
  };
  stockCounts: {
    total: number;
    inStock: number;
    lowStock: number;
    outOfStock: number;
  };
}

export interface ProductFilters {
  search: string;
  category: string;
  brand: string;
  stockStatus: string;
  minPrice: string;
  maxPrice: string;
  tyreSize: string;
  sort: string;
}

export const DEFAULT_FILTERS: ProductFilters = {
  search: '',
  category: '',
  brand: '',
  stockStatus: '',
  minPrice: '',
  maxPrice: '',
  tyreSize: '',
  sort: '-createdAt',
};

export const SORT_OPTIONS = [
  { value: '-createdAt', label: 'New Arrivals' },
  { value: 'sellPrice', label: 'Price: Low to High' },
  { value: '-sellPrice', label: 'Price: High to Low' },
  { value: 'name', label: 'Name: A–Z' },
  { value: '-name', label: 'Name: Z–A' },
] as const;
