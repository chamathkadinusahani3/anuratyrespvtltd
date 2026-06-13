import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Package, Tag, MessageSquare, Phone, Gauge, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import type { Product, ProductImage } from '../../types/inventoryPublic';
import { productsAPI } from '../../services/inventoryPublicApi';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onViewProduct: (p: Product) => void;
}

function cdnUrl(img: ProductImage, w: number, h: number) {
  if (!img.publicId) return img.url;
  const cloud = img.url.match(/res\.cloudinary\.com\/([^/]+)\//)?.[1];
  if (!cloud) return img.url;
  return `https://res.cloudinary.com/${cloud}/image/upload/w_${w},h_${h},c_fit,f_auto,q_auto/${img.publicId}`;
}

function cdnFull(img: ProductImage) {
  if (!img.publicId) return img.url;
  const cloud = img.url.match(/res\.cloudinary\.com\/([^/]+)\//)?.[1];
  if (!cloud) return img.url;
  return `https://res.cloudinary.com/${cloud}/image/upload/f_auto,q_auto/${img.publicId}`;
}

function SpecRow({ label, value }: { label: string; value?: string | number | null }) {
  if (!value && value !== 0) return null;
  return (
    <div className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
      <span className="text-white/50 text-sm">{label}</span>
      <span className="text-white font-medium text-sm">{value}</span>
    </div>
  );
}

function StockBadgeLarge({ status }: { status: Product['stockStatus'] }) {
  const cfg = {
    'In Stock':     { cls: 'bg-green-500/15 text-green-400 border-green-500/30', dot: 'bg-green-400', text: '● In Stock' },
    'Low Stock':    { cls: 'bg-amber-500/15 text-amber-400 border-amber-500/30', dot: 'bg-amber-400', text: '▲ Low Stock — Order Soon' },
    'Out of Stock': { cls: 'bg-red-500/15 text-red-400 border-red-500/30',       dot: 'bg-red-400',   text: '✕ Out of Stock' },
  }[status];
  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border font-semibold text-sm ${cfg.cls}`}>
      <span className={`w-2 h-2 rounded-full ${cfg.dot} animate-pulse`} />
      {cfg.text}
    </div>
  );
}

// ── TyreVisual hero (fallback when no images) ─────────────────────────────────
function TyreVisualHero({ product }: { product: Product }) {
  const tyreSize = product.tyre?.size || '';
  const width = product.tyre?.width;
  const profile = product.tyre?.profile;
  const rimSize = product.tyre?.rimSize;
  const fullSpec = [width, profile, rimSize].every(Boolean)
    ? `${width}/${profile}R${rimSize}`
    : tyreSize;

  return (
    <div className="relative h-52 bg-gradient-to-br from-neutral-800 to-neutral-950 flex items-center justify-center overflow-hidden">
      <div className="absolute w-56 h-56 rounded-full border-[14px] border-white/5" />
      <div className="absolute w-40 h-40 rounded-full border-[10px] border-white/5" />
      <div className="absolute w-24 h-24 rounded-full bg-black/30 border-4 border-white/5 flex items-center justify-center">
        <div className="w-10 h-10 rounded-full bg-white/5" />
      </div>
      <div className="relative z-10 text-center">
        <p className="text-brand-yellow font-black text-4xl tracking-tighter leading-none drop-shadow-lg">
          {fullSpec || tyreSize || '—'}
        </p>
        <p className="text-white/70 font-bold text-base mt-1 tracking-widest uppercase">{product.brand}</p>
        {product.tyre?.pattern && (
          <p className="text-white/40 text-sm mt-0.5">{product.tyre.pattern}</p>
        )}
      </div>
    </div>
  );
}

// ── Image gallery hero ────────────────────────────────────────────────────────
function ImageGallery({ images, onZoom }: { images: ProductImage[]; onZoom: (idx: number) => void }) {
  const [active, setActive] = useState(0);
  const [imgError, setImgError] = useState(false);

  const cur = images[active];

  function prev() { setActive((i) => (i - 1 + images.length) % images.length); setImgError(false); }
  function next() { setActive((i) => (i + 1) % images.length); setImgError(false); }

  return (
    <div className="relative select-none">
      {/* Main image */}
      <div className="relative h-64 bg-neutral-900 flex items-center justify-center overflow-hidden">
        {imgError ? (
          <div className="text-white/20 text-sm">Image unavailable</div>
        ) : (
          <img
            key={cur.id}
            src={cdnUrl(cur, 800, 500)}
            alt={cur.alt || 'product image'}
            onError={() => setImgError(true)}
            className="max-w-full max-h-full object-contain"
          />
        )}
        {/* Zoom */}
        <button
          onClick={() => onZoom(active)}
          className="absolute bottom-3 right-3 bg-black/60 hover:bg-black/80 text-white rounded-lg p-1.5 transition-colors"
          title="Zoom"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        {/* Prev / Next arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1.5 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1.5 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="flex gap-2 p-3 overflow-x-auto bg-black/20">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => { setActive(i); setImgError(false); }}
              className={`flex-shrink-0 w-14 h-10 rounded-lg overflow-hidden border-2 transition-all
                ${i === active ? 'border-brand-yellow' : 'border-white/10 opacity-50 hover:opacity-80'}`}
            >
              <img
                src={cdnUrl(img, 112, 80)}
                alt={img.alt || `image ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Fullscreen lightbox ───────────────────────────────────────────────────────
function Lightbox({ images, startIndex, onClose }: { images: ProductImage[]; startIndex: number; onClose: () => void }) {
  const [idx, setIdx] = useState(startIndex);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') setIdx((i) => (i - 1 + images.length) % images.length);
      if (e.key === 'ArrowRight') setIdx((i) => (i + 1) % images.length);
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [images.length, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 rounded-full p-2 text-white z-10"
      >
        <X className="w-5 h-5" />
      </button>
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); setIdx((i) => (i - 1 + images.length) % images.length); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 rounded-full p-3 text-white z-10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setIdx((i) => (i + 1) % images.length); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 rounded-full p-3 text-white z-10"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}
      <img
        src={cdnFull(images[idx])}
        alt={images[idx].alt || 'product image'}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
      />
      {images.length > 1 && (
        <p className="absolute bottom-4 text-white/40 text-sm">
          {idx + 1} / {images.length}
        </p>
      )}
    </motion.div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export function ProductDetailModal({ product, onClose, onViewProduct }: ProductDetailModalProps) {
  const [related, setRelated] = useState<Product[]>([]);
  const [loadingRelated, setLoadingRelated] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  useEffect(() => {
    if (!product) return;
    setRelated([]);
    setLoadingRelated(true);
    productsAPI.getById(product.id)
      .then((r) => setRelated(r.related))
      .catch(() => setRelated([]))
      .finally(() => setLoadingRelated(false));
  }, [product?.id]);

  useEffect(() => {
    if (product) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [product]);

  const sortedImages = [...(product?.images ?? [])].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <>
      <AnimatePresence>
        {product && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: 60, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 60, scale: 0.97 }}
              transition={{ type: 'spring', damping: 28, stiffness: 400 }}
              className="relative bg-[#111] border border-white/10 rounded-t-2xl sm:rounded-2xl
                w-full sm:max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl"
            >
              {/* Close */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 rounded-full p-1.5 transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>

              {/* Hero: gallery or tyre visual */}
              {sortedImages.length > 0 ? (
                <ImageGallery images={sortedImages} onZoom={(i) => setLightboxIdx(i)} />
              ) : (
                <TyreVisualHero product={product} />
              )}

              <div className="p-6 space-y-6">
                {/* Title + badges */}
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <span className="text-white/40 text-xs font-mono">SKU: {product.sku}</span>
                      <h2 className="text-white font-bold text-xl mt-0.5 leading-tight">{product.name}</h2>
                      <p className="text-brand-yellow font-semibold mt-0.5">{product.brand}</p>
                    </div>
                    {product.price > 0 && (
                      <div className="text-right flex-shrink-0">
                        <p className="text-white/40 text-xs">Price</p>
                        <p className="text-brand-yellow font-black text-2xl leading-none">
                          Rs {product.price.toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                  <StockBadgeLarge status={product.stockStatus} />
                  {product.stockStatus !== 'Out of Stock' && (
                    <p className="text-white/30 text-xs mt-2 flex items-center gap-1">
                      <Package className="w-3 h-3" />
                      {product.quantity} units in inventory
                    </p>
                  )}
                </div>

                {/* Tyre specs */}
                {product.tyre && (
                  <div>
                    <h3 className="text-white/70 text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-2">
                      <Gauge className="w-4 h-4 text-brand-yellow" />
                      Tyre Specifications
                    </h3>
                    <div className="bg-black/30 rounded-xl border border-white/5 px-4 py-2">
                      <SpecRow label="Tyre Size" value={product.tyre.size} />
                      <SpecRow label="Width" value={product.tyre.width ? `${product.tyre.width} mm` : undefined} />
                      <SpecRow label="Profile" value={product.tyre.profile ? `${product.tyre.profile}%` : undefined} />
                      <SpecRow label="Rim Size" value={product.tyre.rimSize ? `${product.tyre.rimSize}"` : undefined} />
                      <SpecRow label="Load Index" value={product.tyre.loadIndex} />
                      <SpecRow label="Speed Rating" value={product.tyre.speedRating} />
                      <SpecRow label="Season" value={product.tyre.season} />
                      <SpecRow label="Pattern" value={product.tyre.pattern} />
                    </div>
                  </div>
                )}

                {/* General info */}
                <div>
                  <h3 className="text-white/70 text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Tag className="w-4 h-4 text-brand-yellow" />
                    Product Details
                  </h3>
                  <div className="bg-black/30 rounded-xl border border-white/5 px-4 py-2">
                    <SpecRow label="Category" value={product.category} />
                    <SpecRow label="Barcode" value={product.barcode} />
                    <SpecRow label="Location" value={product.location} />
                  </div>
                </div>

                {/* CTA */}
                <div className="grid grid-cols-2 gap-3">
                  <a
                    href="tel:0775785785"
                    className="flex items-center justify-center gap-2 py-3 px-4 bg-white/5 hover:bg-white/10
                      border border-white/10 rounded-xl text-white font-medium text-sm transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    Call Us
                  </a>
                  <a
                    href={`https://wa.me/94775785785?text=${encodeURIComponent(`Hi, I'm interested in: ${product.name} (${product.sku})${product.tyre?.size ? ` - ${product.tyre.size}` : ''}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-3 px-4 bg-brand-yellow text-black
                      hover:bg-brand-yellow/90 rounded-xl font-bold text-sm transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    WhatsApp Enquiry
                  </a>
                </div>

                {/* Related products */}
                {(related.length > 0 || loadingRelated) && (
                  <div>
                    <h3 className="text-white/70 text-xs font-semibold uppercase tracking-wider mb-3">
                      Related Products
                    </h3>
                    {loadingRelated ? (
                      <div className="grid grid-cols-2 gap-3">
                        {[1,2,3,4].map(i => (
                          <div key={i} className="h-20 bg-white/5 rounded-xl animate-pulse" />
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-3">
                        {related.slice(0, 4).map((p) => (
                          <button
                            key={p.id}
                            onClick={() => onViewProduct(p)}
                            className="text-left bg-brand-card hover:bg-white/5 border border-white/5 hover:border-brand-yellow/20
                              rounded-xl p-3 transition-all group"
                          >
                            <p className="text-white/80 text-xs font-semibold group-hover:text-white truncate">{p.name}</p>
                            <p className="text-brand-yellow/70 text-[10px] mt-0.5">{p.brand}</p>
                            {p.tyre?.size && <p className="text-white/30 text-[10px]">{p.tyre.size}</p>}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Fullscreen lightbox — rendered outside the modal's z-stack */}
      <AnimatePresence>
        {product && lightboxIdx !== null && sortedImages.length > 0 && (
          <Lightbox
            images={sortedImages}
            startIndex={lightboxIdx}
            onClose={() => setLightboxIdx(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
