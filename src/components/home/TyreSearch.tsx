import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, ShoppingCart, X, Plus, Minus, ChevronRight, ArrowUpRight,
  Sparkles, ShieldCheck, Truck, BadgeCheck, ChevronDown, Info, Loader2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import tyreSizeGuide from '../../assets/tyresearch.png';
import { productsAPI } from '../../services/inventoryPublicApi';
import type { Product, ProductImage } from '../../types/inventoryPublic';
import { useCart } from '../../context/CartContext';
import type { CartItem } from '../../context/CartContext';

// ── Helpers ───────────────────────────────────────────────────
const fmt = (n: number) => `Rs. ${n.toLocaleString()}`;

function cdnUrl(img: ProductImage, w: number, h: number) {
  if (!img.publicId) return img.url;
  const cloud = img.url.match(/res\.cloudinary\.com\/([^/]+)\//)?.[1];
  if (!cloud) return img.url;
  return `https://res.cloudinary.com/${cloud}/image/upload/w_${w},h_${h},c_fit,f_auto,q_auto/${img.publicId}`;
}

function featuredImg(product: Product): ProductImage | null {
  if (!product.images?.length) return null;
  return product.images.find((i) => i.featured) ?? product.images[0];
}

/** Parse "185/65R15", "P185/65R15", "185/65 R15" → { width, profile, diameter } or null */
function parseTyreSize(s: string) {
  const m = s.trim().match(/^[A-Za-z]*(\d{2,3})[\/](\d{2,3})\s*[Rr]\s*(\d{2})\b/);
  if (!m) return null;
  return { width: m[1], profile: m[2], diameter: m[3] };
}

// Standard tyre dimension ranges — always available as fallback
const STD_WIDTHS    = ['145','155','165','175','185','195','205','215','225','235','245','255','265','275','285','295','305','315','325','335'];
const STD_PROFILES  = ['25','30','35','40','45','50','55','60','65','70','75','80'];
const STD_DIAMETERS = ['13','14','15','16','17','18','19','20','21','22'];

// ── Types ─────────────────────────────────────────────────────

// ── TyreResultCard ────────────────────────────────────────────
function TyreResultCard({
  product, index, inCart, onAdd, onUpdateQty,
}: {
  product: Product;
  index: number;
  inCart: CartItem | undefined;
  onAdd: (p: Product) => void;
  onUpdateQty: (id: string, delta: number) => void;
}) {
  const [imgError, setImgError] = useState(false);
  const img        = featuredImg(product);
  const isOutOfStock = product.stockStatus === 'Out of Stock';
  const stock      = product.quantity ?? 0;
  const atLimit    = !!inCart && inCart.qty >= stock;
  const specLine = [
    product.tyre?.loadIndex && `${product.tyre.loadIndex}${product.tyre.speedRating || ''}`,
    product.tyre?.season,
    product.tyre?.pattern,
  ].filter(Boolean).join(' · ');

  return (
    <motion.div
      key={product.id}
      initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`group relative overflow-hidden rounded-[32px] border bg-white/[0.04] backdrop-blur-xl transition-all duration-500
        ${isOutOfStock ? 'border-white/5 opacity-60' : 'border-white/10 hover:border-brand-yellow/30 hover:-translate-y-2'}`}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-brand-yellow/[0.08] via-transparent to-transparent" />

      {/* Image / Visual */}
      <div className="relative h-[240px] overflow-hidden flex items-center justify-center border-b border-white/10 bg-[#0a0a0a]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,204,0,0.08),transparent_70%)]" />
        <div className="absolute text-[120px] font-black text-white/[0.03] select-none">0{index + 1}</div>
        {img && !imgError ? (
          <img
            src={cdnUrl(img, 600, 400)}
            alt={img.alt || product.name}
            onError={() => setImgError(true)}
            className="relative z-10 h-[80%] w-full object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)] transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="relative z-10 w-full h-full flex items-center justify-center">
            <TyreCardVisual product={product} />
          </div>
        )}
        <div className="absolute top-5 left-5 px-3 py-1.5 rounded-full border border-brand-yellow/20 bg-brand-yellow/10 backdrop-blur-md">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-yellow">{product.category}</span>
        </div>
        <div className={`absolute top-5 right-5 px-3 py-1.5 rounded-full border backdrop-blur-md
          ${product.stockStatus === 'In Stock' ? 'border-green-500/20 bg-green-500/10' :
            product.stockStatus === 'Low Stock' ? 'border-amber-500/20 bg-amber-500/10' :
            'border-red-500/20 bg-red-500/10'}`}>
          <span className={`text-[10px] font-black uppercase tracking-[0.15em]
            ${product.stockStatus === 'In Stock' ? 'text-green-400' :
              product.stockStatus === 'Low Stock' ? 'text-amber-400' : 'text-red-400'}`}>
            {product.stockStatus === 'In Stock' ? `${product.quantity} In Stock` : product.stockStatus}
          </span>
        </div>
      </div>

      <div className="relative p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="px-3 py-1 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono text-gray-300">
            {product.tyre?.size || product.sku}
          </span>
        </div>
        <h3 className="text-xl font-black text-white mb-1 truncate">{product.name}</h3>
        <p className="text-brand-yellow text-sm font-bold mb-2">{product.brand}</p>
        {specLine && <p className="text-sm leading-relaxed text-gray-400 mb-4">{specLine}</p>}
        <div className="flex items-end justify-between mb-6">
          <div>
            {product.price > 0 ? (
              <>
                <p className="text-3xl font-black text-brand-yellow">{fmt(product.price)}</p>
                <p className="text-xs text-gray-500 mt-1">Per tyre</p>
              </>
            ) : (
              <p className="text-white/40 italic text-sm">Price on request</p>
            )}
          </div>
        </div>

        {isOutOfStock ? (
          <div className="w-full h-14 rounded-2xl border border-white/10 bg-white/[0.03] flex items-center justify-center text-gray-500 font-bold text-sm">
            Out of Stock
          </div>
        ) : inCart ? (
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between rounded-2xl border border-brand-yellow/20 bg-brand-yellow/10 px-5 py-4">
              <button onClick={() => onUpdateQty(product.id, -1)} className="w-9 h-9 rounded-xl bg-black/20 flex items-center justify-center text-brand-yellow hover:bg-black/40 transition-colors">
                <Minus className="w-4 h-4" />
              </button>
              <div className="text-center">
                <p className="text-white font-black">{inCart.qty}</p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-brand-yellow">In Cart</p>
              </div>
              <button
                onClick={() => { if (!atLimit) onUpdateQty(product.id, 1); }}
                disabled={atLimit}
                className="w-9 h-9 rounded-xl bg-black/20 flex items-center justify-center text-brand-yellow hover:bg-black/40 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {atLimit && (
              <p className="text-[11px] text-amber-400 text-center">Max stock ({stock}) reached</p>
            )}
          </div>
        ) : (
          <button
            onClick={() => onAdd(product)}
            className="group/btn w-full h-14 rounded-2xl bg-brand-yellow text-black font-black hover:bg-white transition-all duration-300 flex items-center justify-center gap-3 shadow-[0_20px_50px_rgba(255,204,0,0.2)]"
          >
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
            <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
          </button>
        )}
      </div>
    </motion.div>
  );
}

// ── SizeSelect ────────────────────────────────────────────────
function SizeSelect({
  label, badge, value, options, onChange, disabled,
}: {
  label: string; badge: string; value: string;
  options: string[]; onChange: (v: string) => void; disabled?: boolean;
}) {
  return (
    <div className="w-full md:flex-1 md:min-w-0">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-6 h-6 rounded-full bg-brand-yellow flex items-center justify-center text-black text-[10px] font-black flex-shrink-0">
          {badge}
        </div>
        <label className="text-xs uppercase tracking-[0.2em] font-black text-gray-500">{label}</label>
      </div>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`w-full h-14 rounded-2xl border bg-black/40 backdrop-blur-md px-5 pr-10 font-mono text-sm appearance-none cursor-pointer outline-none transition-all duration-300
            ${disabled ? 'opacity-40 cursor-not-allowed' : ''}
            ${value ? 'border-brand-yellow/40 text-brand-yellow' : 'border-white/10 text-gray-500 hover:border-white/20'}`}
        >
          <option value="">Any</option>
          {options.map((o) => (
            <option key={o} value={o} className="bg-[#111] text-white">{o}</option>
          ))}
        </select>
        <ChevronDown className={`absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none transition-colors duration-300 ${value ? 'text-brand-yellow' : 'text-gray-600'}`} />
      </div>
    </div>
  );
}

// ── TyreVisual (fallback when no image) ───────────────────────
function TyreCardVisual({ product }: { product: Product }) {
  const size = product.tyre?.size || '';
  const brand = (product.brand || '').toUpperCase();
  return (
    <div className="relative h-[75%] flex items-center justify-center">
      <div className="absolute w-36 h-36 rounded-full border-[14px] border-white/10" />
      <div className="absolute w-24 h-24 rounded-full border-[10px] border-white/10" />
      <div className="absolute w-14 h-14 rounded-full bg-black/40 border-4 border-white/10 flex items-center justify-center">
        <div className="w-6 h-6 rounded-full bg-white/5" />
      </div>
      <div className="relative z-10 text-center">
        <p className="text-brand-yellow font-black text-xl tracking-tighter">{size || '—'}</p>
        <p className="text-white/60 font-bold text-xs mt-1">{brand}</p>
      </div>
    </div>
  );
}

// ── TyreSizeGuide ─────────────────────────────────────────────
function TyreSizeGuide() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
      className="mt-8 rounded-[28px] border border-white/10 bg-white/[0.02] backdrop-blur-xl overflow-hidden"
    >
      <div className="flex items-center gap-3 px-4 sm:px-6 pt-5 pb-4 border-b border-white/5">
        <div className="w-9 h-9 rounded-xl bg-brand-yellow/10 border border-brand-yellow/20 flex items-center justify-center flex-shrink-0">
          <Info className="w-4 h-4 text-brand-yellow" />
        </div>
        <div>
          <h3 className="text-sm sm:text-base font-black text-white">How to Read Your Tyre Size</h3>
          <p className="text-xs text-gray-500 mt-0.5">Find the three numbers on the sidewall of your tyre</p>
        </div>
      </div>
      <div className="p-4 sm:p-6">
        <div className="flex justify-center mb-5">
          <div className="w-full md:max-w-md lg:max-w-lg relative rounded-2xl overflow-hidden border border-white/5 bg-white/5">
            <img src={tyreSizeGuide} alt="Tyre size guide" className="w-full h-auto object-contain" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { badge: 'W', label: 'Width',   color: 'yellow', desc: 'Tyre width in mm, measured across the tread face.' },
            { badge: 'P', label: 'Profile', color: 'yellow', desc: 'Aspect ratio — sidewall height as % of width.' },
            { badge: 'R', label: 'Rim',     color: 'red',    desc: 'Diameter of the wheel rim in inches.' },
          ].map(({ badge, label, color, desc }) => (
            <div key={badge} className={`rounded-2xl border bg-black/20 p-4 flex sm:flex-col items-center sm:items-start gap-3 sm:gap-0 ${color === 'red' ? 'border-red-500/20' : 'border-brand-yellow/10'}`}>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0 sm:mb-3 ${color === 'red' ? 'bg-red-500 text-white' : 'bg-brand-yellow text-black'}`}>{badge}</div>
              <div>
                <p className="text-white font-black text-sm mb-0.5">{label}</p>
                <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ── Main Component ────────────────────────────────────────────
export function TyreSearch() {
  const [tyreSizes, setTyreSizes] = useState<string[]>([]);
  const [metaLoaded, setMetaLoaded] = useState(false);

  const [directSize, setDirectSize] = useState('');
  const [width,    setWidth]    = useState('');
  const [profile,  setProfile]  = useState('');
  const [diameter, setDiameter] = useState('');

  const [results,   setResults]   = useState<Product[]>([]);
  const [searched,  setSearched]  = useState(false);
  const [searching, setSearching] = useState(false);
  const [searchErr, setSearchErr] = useState('');

  const navigate = useNavigate();
  // Global cart from context
  const { cart, addToCart, updateQty, cartCount } = useCart();

  // Load meta to get real tyre sizes
  useEffect(() => {
    productsAPI.meta()
      .then((m) => { setTyreSizes(m.tyreSizes ?? []); })
      .catch(() => {})
      .finally(() => setMetaLoaded(true));
  }, []);

  const widthOptions    = STD_WIDTHS;
  const profileOptions  = STD_PROFILES;
  const diameterOptions = STD_DIAMETERS;

  // Reset downstream selects when parent changes; clear direct-size pick
  function handleWidthChange(v: string) {
    setDirectSize(''); setWidth(v); setProfile(''); setDiameter('');
  }
  function handleProfileChange(v: string) {
    setDirectSize(''); setProfile(v); setDiameter('');
  }
  function handleDiameterChange(v: string) {
    setDirectSize(''); setDiameter(v);
  }

  const builtSize = width && profile && diameter ? `${width}/${profile}R${diameter}` : '';
  const partialSize = width && profile ? `${width}/${profile}` : width ? width : '';

  const handleSearch = async (forceSize?: string) => {
    const query = forceSize ?? builtSize ?? partialSize;
    if (!query) return;
    setSearching(true);
    setSearchErr('');
    setSearched(true);
    try {
      const r = await productsAPI.list({ tyreSize: query, limit: 24, sort: '-createdAt' });
      setResults(r.products);
    } catch (e: any) {
      setSearchErr(e?.message || 'Search failed');
      setResults([]);
    } finally {
      setSearching(false);
    }
  };

  // When user picks a full size from the direct dropdown — auto-fill W/P/R and search
  const handleDirectSizeChange = (size: string) => {
    setDirectSize(size);
    if (!size) { setWidth(''); setProfile(''); setDiameter(''); return; }
    const p = parseTyreSize(size);
    if (p) { setWidth(p.width); setProfile(p.profile); setDiameter(p.diameter); }
    handleSearch(size);
  };

  const handleReset = () => {
    setDirectSize(''); setWidth(''); setProfile(''); setDiameter('');
    setResults([]); setSearched(false); setSearchErr('');
  };


  return (
    <>
    <section id="tyre-search" className="relative overflow-hidden bg-[#050505] py-14 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-120px] left-[-120px] w-[400px] h-[400px] rounded-full bg-brand-yellow/10 blur-[140px]" />
        <div className="absolute bottom-[-150px] right-[-100px] w-[420px] h-[420px] rounded-full bg-brand-red/10 blur-[150px]" />
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:70px_70px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10 lg:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-5">
            <Sparkles className="w-4 h-4 text-brand-yellow" />
            <span className="text-[11px] uppercase tracking-[0.25em] font-black text-gray-300">Live Inventory Search</span>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
            <div>
              <h2 className="text-4xl sm:text-5xl md:text-7xl font-black leading-[0.95] tracking-tight text-white">
                FIND YOUR<br />
                <span className="bg-gradient-to-r from-brand-yellow via-yellow-200 to-brand-red bg-clip-text text-transparent">
                  PERFECT TYRE
                </span>
              </h2>
              <p className="mt-5 max-w-2xl text-base lg:text-lg leading-relaxed text-gray-400">
                Search by tyre size — dropdowns show only sizes we actually stock. Real-time availability and pricing.
              </p>
            </div>
            {/* Cart button */}
            <button
              onClick={() => navigate('/cart')}
              className="group relative w-fit flex items-center gap-4 px-5 py-3 lg:px-6 lg:py-4 rounded-2xl border border-white/10 bg-white/[0.05] backdrop-blur-xl hover:border-brand-yellow/40 hover:bg-brand-yellow transition-all duration-300"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5 text-white group-hover:text-black transition-colors duration-300" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-brand-yellow text-black text-[10px] font-black flex items-center justify-center">{cartCount}</span>
                )}
              </div>
              <div className="text-left">
                <p className="text-sm font-black text-white group-hover:text-black transition-colors duration-300">Shopping Cart</p>
                <p className="text-xs text-gray-500 group-hover:text-black/70 transition-colors duration-300">{cartCount} item{cartCount !== 1 ? 's' : ''}</p>
              </div>
              <ArrowUpRight className="w-4 h-4 text-white group-hover:text-black transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative rounded-[32px] border border-white/10 bg-white/[0.03] backdrop-blur-2xl p-5 md:p-7 mb-6 overflow-visible">
          <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-brand-yellow/[0.03] via-transparent to-brand-red/[0.03]" />

          {/* ── Direct size picker ─────────────────────────── */}
          <div className="relative mb-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-brand-yellow flex items-center justify-center text-black text-[10px] font-black flex-shrink-0">
                ✓
              </div>
              <label className="text-xs uppercase tracking-[0.2em] font-black text-gray-500">Select Tyre Size</label>
              {metaLoaded && (
                <span className="ml-auto text-[10px] text-gray-600 font-mono">
                  {tyreSizes.length > 0 ? `${tyreSizes.length} sizes in stock` : 'all standard sizes'}
                </span>
              )}
            </div>
            <div className="relative">
              <select
                value={directSize}
                onChange={(e) => handleDirectSizeChange(e.target.value)}
                disabled={!metaLoaded || tyreSizes.length === 0}
                className={`w-full h-14 rounded-2xl border bg-black/40 backdrop-blur-md px-5 pr-10 font-mono text-sm appearance-none cursor-pointer outline-none transition-all duration-300
                  ${!metaLoaded || tyreSizes.length === 0 ? 'opacity-40 cursor-not-allowed' : ''}
                  ${directSize ? 'border-brand-yellow/60 text-brand-yellow' : 'border-white/10 text-gray-500 hover:border-white/20'}`}
              >
                <option value="">— Choose a size (e.g. 185/65R15) —</option>
                {tyreSizes.map((s) => (
                  <option key={s} value={s} className="bg-[#111] text-white">{s}</option>
                ))}
              </select>
              <ChevronDown className={`absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none transition-colors duration-300 ${directSize ? 'text-brand-yellow' : 'text-gray-600'}`} />
            </div>
            {metaLoaded && tyreSizes.length === 0 && (
              <p className="text-white/30 text-xs mt-2">No exact sizes loaded from inventory — use the dimension selectors below.</p>
            )}
          </div>

          {/* ── OR divider ─────────────────────────────────── */}
          <div className="relative flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-white/[0.06]" />
            <span className="text-[11px] uppercase tracking-[0.3em] text-gray-600 font-black flex-shrink-0">Or select by dimensions</span>
            <div className="flex-1 h-px bg-white/[0.06]" />
          </div>

          {/* ── Dimension display ──────────────────────────── */}
          {(builtSize || partialSize) && !directSize && (
            <div className="mb-4">
              {builtSize
                ? <p className="text-brand-yellow font-mono font-black text-lg">{builtSize}</p>
                : <p className="text-white/40 font-mono text-base">{partialSize}…</p>
              }
            </div>
          )}

          <div className="relative flex flex-col md:flex-row gap-3 md:items-end">
            <SizeSelect
              label="Width (mm)" badge="W"
              value={width} options={widthOptions}
              onChange={handleWidthChange}
              disabled={!metaLoaded}
            />
            <div className="hidden md:flex items-center text-2xl font-black text-white/20 self-end mb-[14px]">/</div>
            <SizeSelect
              label="Profile (%)" badge="P"
              value={profile} options={profileOptions}
              onChange={handleProfileChange}
              disabled={!metaLoaded}
            />
            <div className="hidden md:flex items-center text-xl font-black text-white/20 self-end mb-[14px]">R</div>
            <SizeSelect
              label="Rim (in)" badge="R"
              value={diameter} options={diameterOptions}
              onChange={handleDiameterChange}
              disabled={!metaLoaded}
            />

            <div className="flex gap-3 w-full md:w-auto md:flex-shrink-0">
              <button
                onClick={() => handleSearch()}
                disabled={searching || (!directSize && !width && !profile && !diameter)}
                className="group flex-1 md:flex-none h-14 px-6 md:px-8 rounded-2xl bg-brand-yellow text-black font-black text-sm hover:bg-white transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_20px_50px_rgba(255,204,0,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                Search Tyres
                {!searching && <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />}
              </button>
              {(directSize || width || profile || diameter || searched) && (
                <button
                  onClick={handleReset}
                  className="h-14 px-4 rounded-2xl border border-white/10 bg-white/[0.03] text-gray-400 hover:text-white hover:border-white/20 transition-all duration-300 flex items-center gap-2 flex-shrink-0 text-sm font-bold"
                >
                  <X className="w-4 h-4" />
                  <span className="hidden sm:inline">Reset</span>
                </button>
              )}
            </div>
          </div>

          <TyreSizeGuide />
        </div>

      </div>
    </section>

    {/* ── Results popup ── */}
    <AnimatePresence>
        {searched && (
          <motion.div
            key="results-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSearched(false)}
            className="fixed inset-0 z-[55] bg-black/80 backdrop-blur-sm flex items-end md:items-center justify-center md:p-6"
          >
            <motion.div
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 80 }}
              transition={{ type: 'spring', stiffness: 300, damping: 32 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full md:max-w-5xl h-[92vh] md:h-[88vh] flex flex-col rounded-t-[32px] md:rounded-[32px] border border-white/10 bg-[#0a0a0a] overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 md:px-8 py-5 border-b border-white/[0.06] flex-shrink-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-5 min-w-0">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.3em] font-black text-gray-500 mb-1">Search Results</p>
                    {searching ? (
                      <p className="text-white font-black text-lg flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-brand-yellow" /> Searching…
                      </p>
                    ) : (
                      <p className="text-white font-black text-lg">
                        {results.length > 0
                          ? <><span className="text-brand-yellow">{results.length}</span> tyre{results.length !== 1 ? 's' : ''} found</>
                          : 'No tyres found'}
                      </p>
                    )}
                  </div>
                  {(directSize || builtSize || partialSize) && (
                    <span className="inline-flex items-center px-3 py-1.5 rounded-xl bg-brand-yellow/10 border border-brand-yellow/20 text-brand-yellow font-mono font-black text-sm flex-shrink-0">
                      {directSize || builtSize || partialSize}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                  {/* Cart shortcut */}
                  <button
                    onClick={() => navigate('/cart')}
                    className="relative flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-white/10 bg-white/[0.04] text-white text-sm font-bold hover:border-brand-yellow/30 transition-all duration-300"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span className="hidden sm:inline">Cart</span>
                    {cartCount > 0 && (
                      <span className="w-5 h-5 rounded-full bg-brand-yellow text-black text-[10px] font-black flex items-center justify-center">{cartCount}</span>
                    )}
                  </button>
                  {/* Close */}
                  <button
                    onClick={() => setSearched(false)}
                    className="w-11 h-11 rounded-2xl border border-white/10 bg-white/[0.04] flex items-center justify-center text-gray-400 hover:text-white hover:border-white/20 transition-all duration-300"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Trust bar */}
              {!searching && results.length > 0 && (
                <div className="flex items-center gap-6 px-5 md:px-8 py-3 border-b border-white/[0.04] bg-white/[0.01] flex-shrink-0">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500"><ShieldCheck className="w-3.5 h-3.5 text-brand-yellow" />Genuine Products</div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500"><Truck className="w-3.5 h-3.5 text-brand-yellow" />Islandwide Delivery</div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500"><BadgeCheck className="w-3.5 h-3.5 text-brand-yellow" />Warranty Included</div>
                </div>
              )}

              {/* Scrollable content */}
              <div className="flex-1 overflow-y-auto overscroll-contain p-5 md:p-8">
                {searching ? (
                  <div className="h-full flex flex-col items-center justify-center gap-4 py-20">
                    <Loader2 className="w-12 h-12 text-brand-yellow animate-spin" />
                    <p className="text-gray-500">Searching inventory…</p>
                  </div>
                ) : searchErr ? (
                  <div className="h-full flex flex-col items-center justify-center py-20 text-center">
                    <p className="text-red-400 font-bold mb-2">Search failed</p>
                    <p className="text-gray-500 text-sm">{searchErr}</p>
                  </div>
                ) : results.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center py-20 text-center">
                    <Search className="w-12 h-12 text-white/10 mx-auto mb-5" />
                    <h3 className="text-2xl font-black text-white mb-3">No tyres found</h3>
                    <p className="text-gray-500 max-w-sm">
                      Try a different size combination, or{' '}
                      <a href="tel:0775785785" className="text-brand-yellow underline">call our team</a>{' '}
                      for special orders.
                    </p>
                    <button
                      onClick={() => setSearched(false)}
                      className="mt-6 px-6 py-3 rounded-2xl bg-brand-yellow text-black font-black text-sm"
                    >
                      Try Different Size
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    {results.map((product, index) => (
                      <TyreResultCard
                        key={product.id}
                        product={product}
                        index={index}
                        inCart={cart.find((i) => i.product.id === product.id)}
                        onAdd={addToCart}
                        onUpdateQty={updateQty}
                      />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

  </>
  );
}
