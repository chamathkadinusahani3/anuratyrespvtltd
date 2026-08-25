import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { Search, Package, ChevronLeft, ChevronRight, X, SlidersHorizontal, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import type { Product, ProductFilters, ProductMetaResponse } from '../types/inventoryPublic';
import { DEFAULT_FILTERS } from '../types/inventoryPublic';
import { productsAPI } from '../services/inventoryPublicApi';
import { ProductCard } from '../components/shop/ProductCard';
import { ShopFilters, MobileFilterBar } from '../components/shop/ShopFilters';
import { ProductGridSkeleton, FiltersSkeleton } from '../components/shop/ProductSkeleton';
import { ProductDetailModal } from '../components/shop/ProductDetailModal';
import products from '../assets/products.png';

const PAGE_SIZE = 24;

function Pagination({ page, pages, onPage }: { page: number; pages: number; onPage: (p: number) => void }) {
  if (pages <= 1) return null;
  const range: (number | '...')[] = [];
  for (let i = 1; i <= pages; i++) {
    if (i === 1 || i === pages || (i >= page - 1 && i <= page + 1)) range.push(i);
    else if (i === page - 2 || i === page + 2) range.push('...');
  }
  const deduped = range.filter((v, i, a) => v !== '...' || a[i - 1] !== '...');
  return (
    <div className="flex items-center justify-center gap-2 mt-10">
      <button onClick={() => onPage(page - 1)} disabled={page <= 1}
        className="p-2 bg-brand-card border border-white/10 rounded-lg text-white/60 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
        <ChevronLeft className="w-4 h-4" />
      </button>
      {deduped.map((v, i) =>
        v === '...' ? (
          <span key={`e${i}`} className="text-white/30 px-1">…</span>
        ) : (
          <button key={v} onClick={() => onPage(v as number)}
            className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${page === v ? 'bg-brand-yellow text-black font-bold' : 'bg-brand-card border border-white/10 text-white/60 hover:text-white'}`}>
            {v}
          </button>
        )
      )}
      <button onClick={() => onPage(page + 1)} disabled={page >= pages}
        className="p-2 bg-brand-card border border-white/10 rounded-lg text-white/60 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

function EmptyState({ filters, onClear }: { filters: ProductFilters; onClear: () => void }) {
  const hasFilters = Object.entries(filters).some(([k, v]) => k !== 'sort' && v !== '');
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <Package className="w-16 h-16 text-white/10 mb-4" />
      <h3 className="text-white font-bold text-xl mb-2">No products found</h3>
      <p className="text-white/40 text-sm max-w-sm mb-6">
        {hasFilters
          ? 'No items match your current filters. Try adjusting your search or clearing filters.'
          : 'No inventory items are available at the moment. Check back soon!'}
      </p>
      {hasFilters && (
        <button onClick={onClear}
          className="flex items-center gap-2 px-5 py-2.5 bg-brand-yellow text-black font-bold text-sm rounded-xl hover:bg-brand-yellow/90 transition-colors">
          <X className="w-4 h-4" />
          Clear Filters
        </button>
      )}
    </div>
  );
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-brand-yellow/10 text-brand-yellow border border-brand-yellow/20 rounded-full px-3 py-1 text-xs font-medium">
      {label}
      <button onClick={onRemove} className="hover:text-white transition-colors">
        <X className="w-3 h-3" />
      </button>
    </span>
  );
}

export function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<ProductFilters>(() => ({
    ...DEFAULT_FILTERS,
    search: searchParams.get('search') || '',
  }));
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingMeta, setLoadingMeta] = useState(true);
  const [meta, setMeta] = useState<ProductMetaResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [online, setOnline] = useState(true);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);

  useEffect(() => {
    productsAPI.meta().then(setMeta).catch(() => {}).finally(() => setLoadingMeta(false));
  }, []);

  const fetchProducts = useCallback((f: ProductFilters, p: number) => {
    setLoadingProducts(true);
    setError(null);
    productsAPI.list({ ...f, page: p, limit: PAGE_SIZE })
      .then((r) => {
        setItems(r.products);
        setTotalPages(r.pagination.pages);
        setTotalItems(r.pagination.total);
      })
      .catch((e: Error) => setError(e.message || 'Failed to load products'))
      .finally(() => setLoadingProducts(false));
  }, []);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    const delay = (filters.search || filters.tyreSize) ? 400 : 0;
    debounceRef.current = setTimeout(() => fetchProducts(filters, page), delay);
    return () => clearTimeout(debounceRef.current);
  }, [filters, page, fetchProducts]);

  useEffect(() => {
    if (page > 1) topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [page]);

  function handleFilterChange(partial: Partial<ProductFilters>) {
    setFilters((f) => ({ ...f, ...partial }));
    setPage(1);
  }

  function handleClearFilters() {
    setFilters(DEFAULT_FILTERS);
    setPage(1);
    setSearchParams({});
  }

  const hasActiveFilters = Object.entries(filters).some(([k, v]) => k !== 'sort' && v !== '');

  return (
    <Layout
      title="Products"
      description="Browse tyres and automotive products available at Anura Tyres (Pvt) Ltd. Quality brands at competitive prices across Sri Lanka."
    >
      {/* Hero */}
      <div ref={topRef} className="relative bg-black py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: `url(${products})` }} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black" />
        <div className="relative max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-400 text-sm font-semibold">Live Inventory</span>
            {online
              ? <Wifi className="w-4 h-4 text-green-400/60" />
              : <WifiOff className="w-4 h-4 text-red-400/60" />
            }
          </div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[#FFCC00] via-white to-[#FFCC00]">
            Product Catalogue
          </h1>
          <p className="text-white/50 text-lg mt-3 max-w-2xl">
            Real-time stock from our inventory. Prices and availability update automatically after every sale, import, or adjustment.
          </p>
          <div className="mt-6 max-w-xl">
            <div className="relative flex items-center bg-white/5 border border-white/10 rounded-2xl overflow-hidden focus-within:border-brand-yellow/40 transition-colors">
              <Search className="w-5 h-5 text-white/30 ml-4 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search by name, SKU, tyre size (e.g. 185/65R15)…"
                value={filters.search}
                onChange={(e) => handleFilterChange({ search: e.target.value })}
                className="flex-1 bg-transparent text-white placeholder-white/30 px-4 py-3.5 text-sm outline-none"
                style={{ textTransform: 'none' }}
              />
              {filters.search && (
                <button onClick={() => handleFilterChange({ search: '' })} className="mr-3">
                  <X className="w-4 h-4 text-white/40 hover:text-white" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-brand-black min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* Active filter chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mb-6">
              {filters.search && <Chip label={`"${filters.search}"`} onRemove={() => handleFilterChange({ search: '' })} />}
              {filters.category && <Chip label={filters.category} onRemove={() => handleFilterChange({ category: '' })} />}
              {filters.brand && <Chip label={filters.brand} onRemove={() => handleFilterChange({ brand: '' })} />}
              {filters.stockStatus && <Chip label={filters.stockStatus} onRemove={() => handleFilterChange({ stockStatus: '' })} />}
              {filters.tyreSize && <Chip label={`Size: ${filters.tyreSize}`} onRemove={() => handleFilterChange({ tyreSize: '' })} />}
              {(filters.minPrice || filters.maxPrice) && (
                <Chip label={`Rs ${filters.minPrice || '0'} – ${filters.maxPrice || '∞'}`} onRemove={() => handleFilterChange({ minPrice: '', maxPrice: '' })} />
              )}
              <button onClick={handleClearFilters} className="text-brand-yellow text-xs hover:underline ml-1">Clear all</button>
            </div>
          )}

          <div className="flex gap-7">
            {/* Sidebar — desktop */}
            <aside className="hidden lg:block w-64 flex-shrink-0 sticky top-24 self-start">
              {loadingMeta ? <FiltersSkeleton /> : (
                <ShopFilters
                  filters={filters}
                  meta={meta}
                  onChange={handleFilterChange}
                  onClear={handleClearFilters}
                  totalProducts={totalItems}
                  isLoading={loadingProducts}
                />
              )}
            </aside>

            {/* Main */}
            <div className="flex-1 min-w-0">
              {/* Mobile filter bar */}
              <div className="lg:hidden mb-4">
                <MobileFilterBar
                  filters={filters}
                  onOpen={() => setShowMobileFilters(true)}
                  onSortChange={(sort) => handleFilterChange({ sort })}
                  totalProducts={totalItems}
                />
              </div>

              {/* Desktop: count + sort */}
              <div className="hidden lg:flex items-center justify-between mb-5">
                <p className="text-white/40 text-sm">
                  {loadingProducts ? 'Loading…' : `${totalItems} product${totalItems !== 1 ? 's' : ''} found`}
                </p>
                <select
                  value={filters.sort}
                  onChange={(e) => handleFilterChange({ sort: e.target.value })}
                  className="bg-brand-card border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-yellow/40 cursor-pointer"
                >
                  <option value="-createdAt">New Arrivals</option>
                  <option value="sellPrice">Price: Low to High</option>
                  <option value="-sellPrice">Price: High to Low</option>
                  <option value="name">Name: A–Z</option>
                  <option value="-name">Name: Z–A</option>
                </select>
              </div>

              {/* Error */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6 flex items-center gap-3">
                  <span className="text-red-400 text-sm flex-1">{error}</span>
                  <button onClick={() => fetchProducts(filters, page)}
                    className="flex items-center gap-1.5 text-brand-yellow text-xs font-medium">
                    <RefreshCw className="w-3.5 h-3.5" />Retry
                  </button>
                </div>
              )}

              {/* Grid */}
              {loadingProducts ? (
                <ProductGridSkeleton count={12} />
              ) : items.length === 0 ? (
                <EmptyState filters={filters} onClear={handleClearFilters} />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {items.map((product, i) => (
                    <ProductCard key={product.id} product={product} onView={setSelectedProduct} index={i} />
                  ))}
                </div>
              )}

              {!loadingProducts && totalPages > 1 && (
                <Pagination page={page} pages={totalPages} onPage={setPage} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/70" onClick={() => setShowMobileFilters(false)} />
          <div className="relative ml-auto w-80 max-w-full h-full bg-[#111] overflow-y-auto">
            <div className="flex items-center justify-between px-4 py-4 border-b border-white/5">
              <span className="text-white font-semibold flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-brand-yellow" />Filters
              </span>
              <button onClick={() => setShowMobileFilters(false)}><X className="w-5 h-5 text-white/60 hover:text-white" /></button>
            </div>
            <div className="p-4">
              {loadingMeta ? <FiltersSkeleton /> : (
                <ShopFilters
                  filters={filters}
                  meta={meta}
                  onChange={(f) => { handleFilterChange(f); }}
                  onClear={() => { handleClearFilters(); setShowMobileFilters(false); }}
                  totalProducts={totalItems}
                  isLoading={loadingProducts}
                />
              )}
            </div>
            <div className="sticky bottom-0 p-4 bg-[#111] border-t border-white/5">
              <button onClick={() => setShowMobileFilters(false)}
                className="w-full py-3 bg-brand-yellow text-black font-bold rounded-xl text-sm">
                Show {totalItems} Results
              </button>
            </div>
          </div>
        </div>
      )}

      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onViewProduct={(p) => setSelectedProduct(p)}
      />
    </Layout>
  );
}
