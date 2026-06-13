import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Package, TrendingUp, AlertTriangle, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Product } from '../../types/inventoryPublic';
import { productsAPI } from '../../services/inventoryPublicApi';
import { ProductDetailModal } from '../shop/ProductDetailModal';
import { ProductCardCompact } from '../shop/ProductCard';

function StatPill({ icon: Icon, value, label, color }: { icon: React.ElementType; value: number | string; label: string; color: string }) {
  return (
    <div className={`flex items-center gap-3 bg-black/30 border ${color} rounded-xl px-4 py-3`}>
      <Icon className={`w-5 h-5 ${color.replace('border-', 'text-').replace('/30', '')}`} />
      <div>
        <p className="text-white font-bold text-lg leading-none">{value}</p>
        <p className="text-white/50 text-xs mt-0.5">{label}</p>
      </div>
    </div>
  );
}

export function LiveShopSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const inStock = products.filter((p) => p.stockStatus === 'In Stock').length;
  const lowStock = products.filter((p) => p.stockStatus === 'Low Stock').length;
  const total = products.length;

  function load() {
    setLoading(true);
    setError(false);
    productsAPI.featured()
      .then((r) => { setProducts(r.products); setLastUpdated(new Date()); })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  return (
    <section className="bg-neutral-950 py-16 px-4 sm:px-6 lg:px-8 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-green-400 text-xs font-semibold uppercase tracking-wider">Live Inventory</span>
            </div>
            <h2 className="text-white font-black text-3xl">
              Available{' '}
              <span className="text-brand-yellow">Stock</span>
            </h2>
            <p className="text-white/40 text-sm mt-1">
              Real-time stock from our inventory system
              {lastUpdated && (
                <span className="ml-2 text-white/20">
                  · Updated {lastUpdated.toLocaleTimeString()}
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={load}
              disabled={loading}
              className="p-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 text-white/60 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <Link
              to="/products"
              className="flex items-center gap-2 px-4 py-2 bg-brand-yellow text-black font-bold text-sm rounded-xl hover:bg-brand-yellow/90 transition-colors"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Stats row */}
        {!loading && !error && products.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-8">
            <StatPill icon={Package} value={total} label="Products Listed" color="border-white/10" />
            <StatPill icon={TrendingUp} value={inStock} label="In Stock" color="border-green-500/30" />
            {lowStock > 0 && (
              <StatPill icon={AlertTriangle} value={lowStock} label="Low Stock" color="border-amber-500/30" />
            )}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-24 bg-brand-card border border-white/5 rounded-xl animate-pulse" />
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="text-center py-12 bg-brand-card border border-white/5 rounded-xl">
            <Package className="w-10 h-10 text-white/20 mx-auto mb-3" />
            <p className="text-white/50 text-sm mb-4">Could not load live inventory</p>
            <button
              onClick={load}
              className="text-brand-yellow hover:text-brand-yellow/80 text-sm font-medium transition-colors"
            >
              Try again
            </button>
          </div>
        )}

        {/* No products */}
        {!loading && !error && products.length === 0 && (
          <div className="text-center py-12 bg-brand-card border border-white/5 rounded-xl">
            <Package className="w-10 h-10 text-white/20 mx-auto mb-3" />
            <p className="text-white/50 text-sm">No products in inventory yet.</p>
            <p className="text-white/30 text-xs mt-1">Check back soon as stock is added regularly.</p>
          </div>
        )}

        {/* Product list */}
        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {products.slice(0, 9).map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <ProductCardCompact product={p} onView={setSelectedProduct} />
              </motion.div>
            ))}
          </div>
        )}

        {/* Browse all CTA */}
        {!loading && !error && products.length > 0 && (
          <div className="text-center mt-8">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-brand-yellow hover:text-brand-yellow/80 font-semibold text-sm transition-colors group"
            >
              Browse full inventory & filter by size, brand, price
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        )}
      </div>

      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onViewProduct={(p) => setSelectedProduct(p)}
      />
    </section>
  );
}
