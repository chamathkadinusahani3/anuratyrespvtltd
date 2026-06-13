import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Eye, Tag, Zap, Plus, Minus, Check } from 'lucide-react';
import type { Product, ProductImage } from '../../types/inventoryPublic';
import { useCart } from '../../context/CartContext';

interface ProductCardProps {
  product: Product;
  onView: (product: Product) => void;
  index?: number;
}

// Returns a Cloudinary resize URL; falls back to the original URL if publicId is missing.
function cdnUrl(img: ProductImage, w: number, h: number) {
  if (!img.publicId) return img.url;
  const cloud = img.url.match(/res\.cloudinary\.com\/([^/]+)\//)?.[1];
  if (!cloud) return img.url;
  return `https://res.cloudinary.com/${cloud}/image/upload/w_${w},h_${h},c_fit,f_auto,q_auto/${img.publicId}`;
}

function featuredImage(product: Product): ProductImage | null {
  if (!product.images?.length) return null;
  return product.images.find((i) => i.featured) ?? product.images[0];
}

function StockBadge({ status }: { status: Product['stockStatus'] }) {
  const cfg = {
    'In Stock':     { cls: 'bg-green-500/15 text-green-400 border-green-500/30', dot: 'bg-green-400' },
    'Low Stock':    { cls: 'bg-amber-500/15 text-amber-400 border-amber-500/30', dot: 'bg-amber-400' },
    'Out of Stock': { cls: 'bg-red-500/15 text-red-400 border-red-500/30',       dot: 'bg-red-400' },
  }[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {status}
    </span>
  );
}

// Fallback visual when no image is uploaded yet.
function TyreVisual({ product }: { product: Product }) {
  const size = product.tyre?.size || '';
  const brand = (product.brand || product.name || '').slice(0, 18).toUpperCase();
  const pattern = product.tyre?.pattern || '';
  const season = product.tyre?.season || '';

  const seasonColor = season.toLowerCase().includes('summer')
    ? 'from-amber-900/40 to-amber-950/60'
    : season.toLowerCase().includes('winter') || season.toLowerCase().includes('snow')
    ? 'from-sky-900/40 to-sky-950/60'
    : 'from-neutral-800/60 to-neutral-900/80';

  return (
    <div className={`relative h-52 bg-gradient-to-br ${seasonColor} flex flex-col items-center justify-center overflow-hidden`}>
      <div className="absolute w-44 h-44 rounded-full border-[12px] border-white/5" />
      <div className="absolute w-32 h-32 rounded-full border-[8px] border-white/5" />
      <div className="absolute w-20 h-20 rounded-full bg-black/30 border-4 border-white/5 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full bg-white/5" />
      </div>
      <div className="relative z-10 text-center px-4">
        <p className="text-brand-yellow font-black text-2xl tracking-tighter leading-none drop-shadow-lg">
          {size || '—'}
        </p>
        <p className="text-white/80 font-bold text-sm mt-1 tracking-widest">{brand}</p>
        {pattern && <p className="text-white/40 text-xs mt-0.5">{pattern}</p>}
      </div>
      <div className="absolute top-3 left-3">
        <span className="bg-black/60 backdrop-blur-sm text-white/70 text-[10px] font-medium px-2 py-1 rounded-md border border-white/10">
          {product.category}
        </span>
      </div>
    </div>
  );
}

// Hero section: real photo if available, TyreVisual otherwise.
function ProductHero({ product }: { product: Product }) {
  const img = featuredImage(product);
  const [imgError, setImgError] = useState(false);

  if (!img || imgError) return <TyreVisual product={product} />;

  return (
    <div className="relative h-52 bg-neutral-900 overflow-hidden flex items-center justify-center">
      <img
        src={cdnUrl(img, 500, 350)}
        alt={img.alt || product.name}
        onError={() => setImgError(true)}
        className="w-full h-full object-contain"
        loading="lazy"
      />
      {/* Category badge */}
      <div className="absolute top-3 left-3">
        <span className="bg-black/60 backdrop-blur-sm text-white/70 text-[10px] font-medium px-2 py-1 rounded-md border border-white/10">
          {product.category}
        </span>
      </div>
      {/* Image count badge */}
      {product.images.length > 1 && (
        <div className="absolute bottom-3 right-3">
          <span className="bg-black/60 backdrop-blur-sm text-white/60 text-[10px] font-medium px-2 py-0.5 rounded-md border border-white/10">
            +{product.images.length - 1} more
          </span>
        </div>
      )}
    </div>
  );
}

export function ProductCard({ product, onView, index = 0 }: ProductCardProps) {
  const isOutOfStock = product.stockStatus === 'Out of Stock';
  const isLowStock   = product.stockStatus === 'Low Stock';
  const { cart, addToCart, updateQty } = useCart();
  const navigate = useNavigate();
  const inCart   = cart.find(i => i.product.id === product.id);
  const stock    = product.quantity ?? 0;
  const atLimit  = !!inCart && inCart.qty >= stock;
  const [added, setAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (atLimit) return;
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04, ease: 'easeOut' }}
      className={`group bg-brand-card border rounded-xl overflow-hidden transition-all duration-300
        hover:shadow-xl hover:shadow-black/50 hover:-translate-y-0.5
        ${isOutOfStock ? 'border-white/5 opacity-75' : 'border-white/5 hover:border-brand-yellow/25'}`}
    >
      {/* Hero */}
      <div className="relative overflow-hidden">
        <ProductHero product={product} />
        {isLowStock && (
          <div className="absolute top-3 right-3">
            <span className="bg-amber-500/90 text-black text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
              <Zap className="w-2.5 h-2.5" />
              Low Stock
            </span>
          </div>
        )}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-red-500/90 text-white font-bold text-sm px-4 py-1 rounded-full">
              Out of Stock
            </span>
          </div>
        )}
        {/* Quick view overlay */}
        <button
          onClick={() => onView(product)}
          className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300
            flex items-center justify-center opacity-0 group-hover:opacity-100"
        >
          <span className="bg-brand-yellow text-black font-bold text-sm px-4 py-2 rounded-full
            translate-y-2 group-hover:translate-y-0 transition-transform duration-300 flex items-center gap-1.5">
            <Eye className="w-4 h-4" />
            Quick View
          </span>
        </button>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="min-w-0">
            <h3 className="text-white font-bold text-sm leading-tight truncate">{product.name}</h3>
            <p className="text-brand-yellow text-xs font-medium mt-0.5">{product.brand}</p>
          </div>
          <StockBadge status={product.stockStatus} />
        </div>

        {/* Tyre specs row */}
        {product.tyre && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {product.tyre.size && (
              <span className="bg-white/5 text-white/60 text-[10px] px-2 py-0.5 rounded border border-white/10">
                {product.tyre.size}
              </span>
            )}
            {product.tyre.loadIndex && (
              <span className="bg-white/5 text-white/60 text-[10px] px-2 py-0.5 rounded border border-white/10">
                {product.tyre.loadIndex}{product.tyre.speedRating || ''}
              </span>
            )}
            {product.tyre.season && (
              <span className="bg-white/5 text-white/60 text-[10px] px-2 py-0.5 rounded border border-white/10">
                {product.tyre.season}
              </span>
            )}
          </div>
        )}

        {/* SKU + price row */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-white/30 text-[10px] font-mono">SKU: {product.sku}</span>
          {product.price > 0 ? (
            <span className="text-brand-yellow font-black text-lg leading-none">
              Rs {product.price.toLocaleString()}
            </span>
          ) : (
            <span className="text-white/40 text-xs italic">Price on request</span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-3 border-t border-white/5">
          <button
            onClick={() => onView(product)}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg
              bg-white/5 hover:bg-white/10 text-white text-xs font-medium transition-colors border border-white/10 flex-shrink-0"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>

          {isOutOfStock ? (
            <div className="flex-1 flex items-center justify-center py-2 px-3 rounded-lg bg-white/5 text-white/30 text-xs font-bold cursor-not-allowed border border-white/5">
              Out of Stock
            </div>
          ) : inCart ? (
            <div className="flex-1 flex flex-col gap-1">
              <div className="flex items-center justify-between rounded-lg border border-brand-yellow/30 bg-brand-yellow/8 px-2 py-1.5">
                <button
                  onClick={e => { e.stopPropagation(); updateQty(product.id, -1); }}
                  className="w-6 h-6 rounded-md bg-black/20 flex items-center justify-center text-brand-yellow hover:bg-black/40 transition-colors"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <button
                  onClick={e => { e.stopPropagation(); navigate('/cart'); }}
                  className="flex items-center gap-1 text-brand-yellow text-xs font-black"
                >
                  <ShoppingCart className="w-3 h-3" />
                  {inCart.qty}
                </button>
                <button
                  onClick={e => { e.stopPropagation(); if (!atLimit) updateQty(product.id, 1); }}
                  disabled={atLimit}
                  className="w-6 h-6 rounded-md bg-black/20 flex items-center justify-center text-brand-yellow hover:bg-black/40 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
              {atLimit && (
                <p className="text-[10px] text-amber-400 text-center">Max stock ({stock}) reached</p>
              )}
            </div>
          ) : (
            <button
              onClick={handleAdd}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold transition-all active:scale-95
                ${added
                  ? 'bg-green-500 text-white'
                  : 'bg-brand-yellow text-brand-black hover:bg-brand-yellow/90'
                }`}
            >
              {added
                ? <><Check className="w-3.5 h-3.5" /> Added</>
                : <><ShoppingCart className="w-3.5 h-3.5" /> Add to Cart</>
              }
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// Compact card for featured / homepage sections
export function ProductCardCompact({ product, onView }: { product: Product; onView: (p: Product) => void }) {
  const img = featuredImage(product);
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      onClick={() => onView(product)}
      className="cursor-pointer bg-brand-card border border-white/5 hover:border-brand-yellow/20
        rounded-xl p-4 flex items-center gap-4 transition-all duration-200 hover:shadow-lg"
    >
      <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-neutral-800 to-neutral-900 flex-shrink-0 border border-white/10 overflow-hidden flex items-center justify-center">
        {img && !imgError ? (
          <img
            src={cdnUrl(img, 112, 112)}
            alt={img.alt || product.name}
            onError={() => setImgError(true)}
            className="w-full h-full object-contain"
            loading="lazy"
          />
        ) : (
          <Tag className="w-6 h-6 text-brand-yellow/60" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-semibold truncate">{product.name}</p>
        <p className="text-brand-yellow text-xs">{product.brand}</p>
        {product.tyre?.size && <p className="text-white/40 text-xs mt-0.5">{product.tyre.size}</p>}
      </div>
      <div className="text-right flex-shrink-0">
        {product.price > 0 && (
          <p className="text-brand-yellow font-bold text-sm">Rs {product.price.toLocaleString()}</p>
        )}
        <span className={`text-[10px] font-medium ${
          product.stockStatus === 'In Stock' ? 'text-green-400' :
          product.stockStatus === 'Low Stock' ? 'text-amber-400' : 'text-red-400'
        }`}>
          {product.stockStatus}
        </span>
      </div>
    </motion.div>
  );
}
