import React from 'react';

export function ProductCardSkeleton() {
  return (
    <div className="bg-brand-card border border-white/5 rounded-xl overflow-hidden animate-pulse">
      <div className="h-52 bg-white/5" />
      <div className="p-5 space-y-3">
        <div className="flex justify-between">
          <div className="h-5 bg-white/10 rounded-full w-20" />
          <div className="h-5 bg-white/10 rounded-full w-16" />
        </div>
        <div className="h-5 bg-white/10 rounded w-3/4" />
        <div className="h-4 bg-white/10 rounded w-1/2" />
        <div className="flex gap-3 pt-2">
          <div className="h-4 bg-white/10 rounded w-1/3" />
          <div className="h-4 bg-white/10 rounded w-1/3" />
        </div>
        <div className="pt-3 border-t border-white/5 flex gap-2">
          <div className="h-9 bg-white/10 rounded-lg flex-1" />
          <div className="h-9 bg-brand-yellow/20 rounded-lg flex-1" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function FiltersSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-brand-card border border-white/5 rounded-xl p-4 space-y-2">
          <div className="h-4 bg-white/10 rounded w-1/2" />
          <div className="space-y-2 pt-2">
            {[1, 2, 3].map((j) => (
              <div key={j} className="h-8 bg-white/10 rounded-lg" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
