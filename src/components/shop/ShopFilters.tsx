import React, { useMemo, useState } from 'react';
import { Search, ChevronDown, ChevronUp, X, SlidersHorizontal, Filter } from 'lucide-react';
import type { ProductFilters, ProductMetaResponse } from '../../types/inventoryPublic';
import { SORT_OPTIONS } from '../../types/inventoryPublic';

interface ShopFiltersProps {
  filters: ProductFilters;
  meta: ProductMetaResponse | null;
  onChange: (filters: Partial<ProductFilters>) => void;
  onClear: () => void;
  totalProducts: number;
  isLoading: boolean;
}

function FilterSection({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-white/5 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-3 text-white/80 hover:text-white text-sm font-semibold transition-colors"
      >
        {title}
        {open ? <ChevronUp className="w-4 h-4 text-brand-yellow" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      {open && <div className="pb-3">{children}</div>}
    </div>
  );
}

function RadioList({ options, value, onChange }: { options: { value: string; label: string }[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(value === opt.value ? '' : opt.value)}
          className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors
            ${value === opt.value
              ? 'bg-brand-yellow/15 text-brand-yellow border border-brand-yellow/30'
              : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'}`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export function ShopFilters({ filters, meta, onChange, onClear, totalProducts, isLoading }: ShopFiltersProps) {
  const [tyreSizeSearch, setTyreSizeSearch] = useState('');

  const hasActiveFilters = Object.entries(filters).some(([k, v]) =>
    k !== 'sort' && v !== ''
  );

  const categoryOptions = (meta?.categories ?? []).map((c) => ({ value: c, label: c }));
  const brandOptions = (meta?.brands ?? []).map((b) => ({ value: b, label: b }));

  const tyreSizeOptions = useMemo(() => {
    const all = meta?.tyreSizes ?? [];
    if (!tyreSizeSearch.trim()) return all;
    const q = tyreSizeSearch.trim().toLowerCase();
    return all.filter((s) => s.toLowerCase().includes(q));
  }, [meta?.tyreSizes, tyreSizeSearch]);

  const stockOptions = [
    { value: 'In Stock', label: '✓ In Stock' },
    { value: 'Low Stock', label: '⚠ Low Stock' },
    { value: 'Out of Stock', label: '✕ Out of Stock' },
  ];

  return (
    <div className="bg-brand-card border border-white/5 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
        <div className="flex items-center gap-2 text-white font-semibold text-sm">
          <SlidersHorizontal className="w-4 h-4 text-brand-yellow" />
          Filters
          {!isLoading && (
            <span className="text-white/40 font-normal text-xs">({totalProducts} results)</span>
          )}
        </div>
        {hasActiveFilters && (
          <button
            onClick={onClear}
            className="flex items-center gap-1 text-xs text-brand-yellow hover:text-brand-yellow/80 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            Clear
          </button>
        )}
      </div>

      <div className="px-4 py-2 space-y-0">
        {/* Search */}
        <FilterSection title="Search">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
            <input
              type="text"
              placeholder="Name, SKU, tyre size…"
              value={filters.search}
              onChange={(e) => onChange({ search: e.target.value })}
              className="w-full bg-black/30 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-white text-xs
                placeholder-white/30 focus:outline-none focus:border-brand-yellow/40 transition-colors"
              style={{ textTransform: 'none' }}
            />
            {filters.search && (
              <button onClick={() => onChange({ search: '' })} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="w-3 h-3 text-white/40 hover:text-white" />
              </button>
            )}
          </div>
        </FilterSection>

        {/* Tyre size */}
        {(meta?.tyreSizes ?? []).length > 0 && (
          <FilterSection title="Tyre Size" defaultOpen={false}>
            {/* Search within list */}
            <div className="relative mb-2">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-white/30" />
              <input
                type="text"
                placeholder="Filter sizes…"
                value={tyreSizeSearch}
                onChange={(e) => setTyreSizeSearch(e.target.value)}
                className="w-full bg-black/30 border border-white/10 rounded-lg pl-7 pr-3 py-1.5 text-white text-xs
                  placeholder-white/30 focus:outline-none focus:border-brand-yellow/40 transition-colors"
              />
              {tyreSizeSearch && (
                <button onClick={() => setTyreSizeSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2">
                  <X className="w-3 h-3 text-white/40 hover:text-white" />
                </button>
              )}
            </div>
            {tyreSizeOptions.length > 0 ? (
              <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                {tyreSizeOptions.map((size) => (
                  <button
                    key={size}
                    onClick={() => onChange({ tyreSize: filters.tyreSize === size ? '' : size })}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors
                      ${filters.tyreSize === size
                        ? 'bg-brand-yellow/15 text-brand-yellow border border-brand-yellow/30'
                        : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-white/30 text-xs px-1 py-2">No sizes match "{tyreSizeSearch}"</p>
            )}
          </FilterSection>
        )}

        {/* Category */}
        {categoryOptions.length > 0 && (
          <FilterSection title="Category">
            <RadioList options={categoryOptions} value={filters.category} onChange={(v) => onChange({ category: v })} />
          </FilterSection>
        )}

        {/* Brand */}
        {brandOptions.length > 0 && (
          <FilterSection title="Brand" defaultOpen={false}>
            <div className="space-y-1 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
              <RadioList options={brandOptions} value={filters.brand} onChange={(v) => onChange({ brand: v })} />
            </div>
          </FilterSection>
        )}

        {/* Stock status */}
        <FilterSection title="Availability" defaultOpen={false}>
          <RadioList options={stockOptions} value={filters.stockStatus} onChange={(v) => onChange({ stockStatus: v })} />
          {meta && (
            <div className="mt-2 grid grid-cols-3 gap-1 text-center">
              <div className="bg-green-500/10 rounded-lg p-1.5">
                <p className="text-green-400 font-bold text-sm">{meta.stockCounts?.inStock ?? 0}</p>
                <p className="text-white/30 text-[9px]">In Stock</p>
              </div>
              <div className="bg-amber-500/10 rounded-lg p-1.5">
                <p className="text-amber-400 font-bold text-sm">{meta.stockCounts?.lowStock ?? 0}</p>
                <p className="text-white/30 text-[9px]">Low</p>
              </div>
              <div className="bg-red-500/10 rounded-lg p-1.5">
                <p className="text-red-400 font-bold text-sm">{meta.stockCounts?.outOfStock ?? 0}</p>
                <p className="text-white/30 text-[9px]">Out</p>
              </div>
            </div>
          )}
        </FilterSection>

        {/* Price range */}
        {(meta?.priceRange?.max ?? 0) > 0 && (
          <FilterSection title="Price Range (Rs)" defaultOpen={false}>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder={`Min`}
                value={filters.minPrice}
                onChange={(e) => onChange({ minPrice: e.target.value })}
                min={0}
                className="flex-1 bg-black/30 border border-white/10 rounded-lg px-2 py-2 text-white text-xs
                  placeholder-white/30 focus:outline-none focus:border-brand-yellow/40 transition-colors"
                style={{ textTransform: 'none' }}
              />
              <span className="text-white/30 self-center text-xs">–</span>
              <input
                type="number"
                placeholder={`Max`}
                value={filters.maxPrice}
                onChange={(e) => onChange({ maxPrice: e.target.value })}
                min={0}
                className="flex-1 bg-black/30 border border-white/10 rounded-lg px-2 py-2 text-white text-xs
                  placeholder-white/30 focus:outline-none focus:border-brand-yellow/40 transition-colors"
                style={{ textTransform: 'none' }}
              />
            </div>
            {meta?.priceRange && (
              <p className="text-white/30 text-[10px] mt-1.5">
                Range: Rs {meta.priceRange.min.toLocaleString()} – Rs {meta.priceRange.max.toLocaleString()}
              </p>
            )}
          </FilterSection>
        )}

        {/* Sort */}
        <FilterSection title="Sort By" defaultOpen={false}>
          <RadioList
            options={[...SORT_OPTIONS]}
            value={filters.sort}
            onChange={(v) => onChange({ sort: v || '-createdAt' })}
          />
        </FilterSection>
      </div>
    </div>
  );
}

// Mobile filter drawer trigger
export function MobileFilterBar({
  filters, onOpen, onSortChange, totalProducts,
}: {
  filters: ProductFilters;
  onOpen: () => void;
  onSortChange: (sort: string) => void;
  totalProducts: number;
}) {
  const hasFilters = Object.entries(filters).some(([k, v]) => k !== 'sort' && v !== '');

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={onOpen}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors
          ${hasFilters
            ? 'bg-brand-yellow/15 text-brand-yellow border-brand-yellow/30'
            : 'bg-brand-card text-white/70 border-white/10 hover:border-white/20'}`}
      >
        <Filter className="w-4 h-4" />
        Filters
        {hasFilters && <span className="bg-brand-yellow text-black text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">!</span>}
      </button>
      <select
        value={filters.sort}
        onChange={(e) => onSortChange(e.target.value)}
        className="flex-1 bg-brand-card border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm
          focus:outline-none focus:border-brand-yellow/40 appearance-none"
      >
        {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <span className="text-white/40 text-sm whitespace-nowrap">{totalProducts} items</span>
    </div>
  );
}
