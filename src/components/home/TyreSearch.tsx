import React, { useState } from 'react';
import {
  Search,
  ShoppingCart,
  X,
  Plus,
  Minus,
  ChevronRight,
  CheckCircle,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Truck,
  BadgeCheck,
  ChevronDown,
  Info,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import tyreSizeGuide from "../../assets/tyresearch.png";

const TYRE_INVENTORY = [
  {
    id: 1,
    brand: 'FORZA 001',
    size: '225/45R17',
    category: 'Passenger Car',
    price: 18500,
    stock: 12,
    image:
      'https://image.makewebeasy.net/makeweb/m_1920x0/JCbWKd3P2/PassengerCar/banner_product_FORZA_001_img_2x.png?v=202405291424',
    desc: 'Deliver a thrilling ride with maximum precision.',
  },
  {
    id: 2,
    brand: 'FORZA 001',
    size: '205/55R16',
    category: 'Passenger Car',
    price: 15900,
    stock: 8,
    image:
      'https://image.makewebeasy.net/makeweb/m_1920x0/JCbWKd3P2/PassengerCar/banner_product_FORZA_001_img_2x.png?v=202405291424',
    desc: 'Deliver a thrilling ride with maximum precision.',
  },
  {
    id: 3,
    brand: 'FALCO S88',
    size: '195/65R15',
    category: 'Passenger Car',
    price: 12800,
    stock: 20,
    image:
      'https://image.makewebeasy.net/makeweb/m_1920x0/JCbWKd3P2/PassengerCar/banner_product_FALCO_S88_img_2x.png?v=202405291424',
    desc: 'Perfect balance of dynamic appearance and sport-oriented performance.',
  },
  {
    id: 4,
    brand: 'FALCO S88',
    size: '185/65R15',
    category: 'Passenger Car',
    price: 11500,
    stock: 15,
    image:
      'https://image.makewebeasy.net/makeweb/m_1920x0/JCbWKd3P2/PassengerCar/banner_product_FALCO_S88_img_2x.png?v=202405291424',
    desc: 'Perfect balance of dynamic appearance and sport-oriented performance.',
  },
  {
    id: 5,
    brand: 'V-36',
    size: '215/60R16',
    category: 'Passenger Car',
    price: 14200,
    stock: 6,
    image:
      'https://image.makewebeasy.net/makeweb/m_1920x0/JCbWKd3P2/PassengerCar/banner_product_V-36_img_2x.png?v=202405291424',
    desc: 'Feel the greater stability and control.',
  },
  {
    id: 6,
    brand: 'X-68+',
    size: '225/40R18',
    category: 'Passenger Car',
    price: 22500,
    stock: 4,
    image:
      'https://image.makewebeasy.net/makeweb/m_1920x0/JCbWKd3P2/PassengerCar/banner_product_X-68__img_2x.png?v=202405291424',
    desc: 'Enjoy the ultimate handling and grip.',
  },
];

// ── W / P / R option lists ────────────────────────────────────
const WIDTHS    = ['155','165','175','185','195','205','215','225','235','245','255','265','275','285','295','305'];
const PROFILES  = ['30','35','40','45','50','55','60','65','70','75','80'];
const DIAMETERS = ['13','14','15','16','17','18','19','20','21','22'];

type CartItem = {
  tyre: (typeof TYRE_INVENTORY)[0];
  qty: number;
};

type CheckoutStep = null | 'fulfilment' | 'confirm';
type Fulfilment = 'visit' | 'delivery' | 'mobile' | null;

const fmt = (n: number) => `Rs. ${n.toLocaleString()}`;

// ── Styled native select wrapper ──────────────────────────────
function SizeSelect({
  label,
  badge,
  value,
  options,
  onChange,
}: {
  label: string;
  badge: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="w-full md:flex-1 md:min-w-0">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-6 h-6 rounded-full bg-brand-yellow flex items-center justify-center text-black text-[10px] font-black flex-shrink-0">
          {badge}
        </div>
        <label className="text-xs uppercase tracking-[0.2em] font-black text-gray-500">
          {label}
        </label>
      </div>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full h-14 rounded-2xl border bg-black/40 backdrop-blur-md px-5 pr-10 font-mono text-sm appearance-none cursor-pointer outline-none transition-all duration-300 ${
            value
              ? 'border-brand-yellow/40 text-brand-yellow'
              : 'border-white/10 text-gray-500 hover:border-white/20'
          }`}
        >
          <option value="">Any</option>
          {options.map((o) => (
            <option key={o} value={o} className="bg-[#111] text-white">
              {o}
            </option>
          ))}
        </select>
        <ChevronDown
          className={`absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none transition-colors duration-300 ${
            value ? 'text-brand-yellow' : 'text-gray-600'
          }`}
        />
      </div>
    </div>
  );
}

// ── Tyre Size Guide ───────────────────────────────────────────
function TyreSizeGuide() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mt-8 rounded-[28px] border border-white/10 bg-white/[0.02] backdrop-blur-xl overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 sm:px-6 pt-5 pb-4 border-b border-white/5">
        <div className="w-9 h-9 rounded-xl bg-brand-yellow/10 border border-brand-yellow/20 flex items-center justify-center flex-shrink-0">
          <Info className="w-4 h-4 text-brand-yellow" />
        </div>
        <div>
          <h3 className="text-sm sm:text-base font-black text-white">How to Read Your Tyre Size</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Find the three numbers on the sidewall of your tyre
          </p>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        {/* Image — constrained on desktop, full width on mobile */}
        <div className="flex justify-center mb-5">
          <div className="w-full md:max-w-md lg:max-w-lg relative rounded-2xl overflow-hidden border border-white/5 bg-white/5">
            <img
              src={tyreSizeGuide}
              alt="Tyre size guide showing Width, Profile and Rim diameter markings"
              className="w-full h-auto object-contain"
            />
          </div>
        </div>

        {/* Three info cards — 1 col mobile, 3 col sm+ */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { badge: 'W', label: 'Width', color: 'yellow', desc: 'Tyre width in mm, measured across the tread face.' },
            { badge: 'P', label: 'Profile', color: 'yellow', desc: 'Aspect ratio — sidewall height as % of width.' },
            { badge: 'R', label: 'Rim', color: 'red', desc: 'Diameter of the wheel rim in inches.' },
          ].map(({ badge, label, color, desc }) => (
            <div
              key={badge}
              className={`rounded-2xl border bg-black/20 p-4 flex sm:flex-col items-center sm:items-start gap-3 sm:gap-0 ${
                color === 'red' ? 'border-red-500/20' : 'border-brand-yellow/10'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0 sm:mb-3 ${
                  color === 'red' ? 'bg-red-500 text-white' : 'bg-brand-yellow text-black'
                }`}
              >
                {badge}
              </div>
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
  const [width,    setWidth]    = useState('');
  const [profile,  setProfile]  = useState('');
  const [diameter, setDiameter] = useState('');
  const [results,  setResults]  = useState<typeof TYRE_INVENTORY>([]);
  const [searched, setSearched] = useState(false);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  const [step, setStep] = useState<CheckoutStep>(null);
  const [fulfilment, setFulfilment] = useState<Fulfilment>(null);

  const [orderDone, setOrderDone] = useState(false);

  const builtSize = width && profile && diameter ? `${width}/${profile}R${diameter}` : '';

  const handleSearch = () => {
    setResults(
      TYRE_INVENTORY.filter((t) => {
        const [w, rest] = t.size.split('/');
        const [p, d] = rest.split('R');
        const matchW = width    ? w === width    : true;
        const matchP = profile  ? p === profile  : true;
        const matchD = diameter ? d === diameter : true;
        return matchW && matchP && matchD;
      })
    );
    setSearched(true);
  };

  const handleReset = () => {
    setWidth('');
    setProfile('');
    setDiameter('');
    setResults([]);
    setSearched(false);
  };

  const addToCart = (tyre: (typeof TYRE_INVENTORY)[0]) => {
    setCart((prev) => {
      const ex = prev.find((i) => i.tyre.id === tyre.id);
      return ex
        ? prev.map((i) =>
            i.tyre.id === tyre.id ? { ...i, qty: i.qty + 1 } : i
          )
        : [...prev, { tyre, qty: 1 }];
    });
  };

  const updateQty = (id: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) =>
          i.tyre.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i
        )
        .filter((i) => i.qty > 0)
    );
  };

  const cartTotal = cart.reduce((s, i) => s + i.tyre.price * i.qty, 0);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  const placeOrder = () => {
    setOrderDone(true);
    setCart([]);
    setStep(null);
    setFulfilment(null);
    setCartOpen(false);
    setTimeout(() => setOrderDone(false), 5000);
  };

  const closeCart = () => {
    setCartOpen(false);
    setStep(null);
  };

  return (
    <section
      id="tyre-search"
      className="relative overflow-hidden bg-[#050505] py-14 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8"
    >
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
            <span className="text-[11px] uppercase tracking-[0.25em] font-black text-gray-300">
              Live Inventory Search
            </span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
            <div>
              <h2 className="text-4xl sm:text-5xl md:text-7xl font-black leading-[0.95] tracking-tight text-white">
                FIND YOUR
                <br />
                <span className="bg-gradient-to-r from-brand-yellow via-yellow-200 to-brand-red bg-clip-text text-transparent">
                  PERFECT TYRE
                </span>
              </h2>
              <p className="mt-5 max-w-2xl text-base lg:text-lg leading-relaxed text-gray-400">
                Search premium tyre sizes, brands and availability instantly
                with real-time stock visibility and seamless ordering.
              </p>
            </div>

            {/* Cart */}
            <button
              onClick={() => setCartOpen(true)}
              className="group relative w-fit flex items-center gap-4 px-5 py-3 lg:px-6 lg:py-4 rounded-2xl border border-white/10 bg-white/[0.05] backdrop-blur-xl hover:border-brand-yellow/40 hover:bg-brand-yellow transition-all duration-300"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5 text-white group-hover:text-black transition-colors duration-300" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-brand-yellow text-black text-[10px] font-black flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
              <div className="text-left">
                <p className="text-sm font-black text-white group-hover:text-black transition-colors duration-300">
                  Shopping Cart
                </p>
                <p className="text-xs text-gray-500 group-hover:text-black/70 transition-colors duration-300">
                  {cartCount} item{cartCount !== 1 ? 's' : ''}
                </p>
              </div>
              <ArrowUpRight className="w-4 h-4 text-white group-hover:text-black transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative rounded-[32px] border border-white/10 bg-white/[0.03] backdrop-blur-2xl p-5 md:p-7 mb-6 overflow-visible">
          <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-brand-yellow/[0.03] via-transparent to-brand-red/[0.03]" />

          {/* Label row */}
          <div className="relative mb-5">
            <p className="text-xs uppercase tracking-[0.25em] font-black text-gray-500">
              Select Tyre Size
            </p>
            {builtSize && (
              <p className="text-brand-yellow font-mono font-black text-lg mt-1">
                {builtSize}
              </p>
            )}
          </div>

          {/* W / P / R selects + Search button */}
          <div className="relative flex flex-col md:flex-row gap-3 md:items-end">
            <SizeSelect
              label="Width (mm)"
              badge="W"
              value={width}
              options={WIDTHS}
              onChange={setWidth}
            />

            {/* Separator */}
            <div className="hidden md:flex items-center text-2xl font-black text-white/20 self-end mb-[14px]">
              /
            </div>

            <SizeSelect
              label="Profile (%)"
              badge="P"
              value={profile}
              options={PROFILES}
              onChange={setProfile}
            />

            {/* Separator */}
            <div className="hidden md:flex items-center text-xl font-black text-white/20 self-end mb-[14px]">
              R
            </div>

            <SizeSelect
              label="Rim (in)"
              badge="R"
              value={diameter}
              options={DIAMETERS}
              onChange={setDiameter}
            />

            {/* Buttons row — full width on mobile, auto on md+ */}
            <div className="flex gap-3 w-full md:w-auto md:flex-shrink-0">
              <button
                onClick={handleSearch}
                className="group flex-1 md:flex-none h-14 px-6 md:px-8 rounded-2xl bg-brand-yellow text-black font-black text-sm hover:bg-white transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_20px_50px_rgba(255,204,0,0.2)]"
              >
                <Search className="w-4 h-4" />
                Search Tyres
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </button>

              {(width || profile || diameter || searched) && (
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

          {/* Tyre Size Guide */}
          <TyreSizeGuide />
        </div>

        {/* Order Success */}
        <AnimatePresence>
          {orderDone && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8 rounded-3xl border border-green-500/20 bg-green-500/10 backdrop-blur-xl p-5 flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-green-500/15 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-white font-black">Order placed successfully</p>
                <p className="text-sm text-green-300/80 mt-1">
                  Our team will contact you within 24 hours.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {searched && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {results.length === 0 ? (
                <div className="rounded-[32px] border border-white/10 bg-white/[0.03] backdrop-blur-xl py-20 px-6 text-center">
                  <Search className="w-10 h-10 text-white/10 mx-auto mb-5" />
                  <h3 className="text-2xl font-black text-white mb-2">
                    No tyres found
                  </h3>
                  <p className="text-gray-500">
                    Try searching another size or contact our team for special
                    orders.
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-7">
                    <p className="text-sm text-gray-500">
                      <span className="text-white font-black">
                        {results.length}
                      </span>{' '}
                      tyre{results.length > 1 ? 's' : ''} found
                      {builtSize && (
                        <span className="ml-2 text-brand-yellow font-mono">
                          · {builtSize}
                        </span>
                      )}
                    </p>
                    <div className="hidden md:flex items-center gap-6 text-xs text-gray-500">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-brand-yellow" />
                        Genuine Products
                      </div>
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-brand-yellow" />
                        Islandwide Delivery
                      </div>
                      <div className="flex items-center gap-2">
                        <BadgeCheck className="w-4 h-4 text-brand-yellow" />
                        Warranty Included
                      </div>
                    </div>
                  </div>

                  {/* Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-7">
                    {results.map((tyre, index) => {
                      const inCart = cart.find((i) => i.tyre.id === tyre.id);

                      return (
                        <motion.div
                          key={tyre.id}
                          initial={{ opacity: 0, y: 40 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="group relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] backdrop-blur-xl hover:border-brand-yellow/30 hover:-translate-y-2 transition-all duration-500"
                        >
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-brand-yellow/[0.08] via-transparent to-transparent" />

                          <div className="relative h-[280px] overflow-hidden flex items-center justify-center border-b border-white/10">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,204,0,0.12),transparent_70%)]" />
                            <div className="absolute text-[120px] font-black text-white/[0.03] select-none">
                              0{index + 1}
                            </div>
                            <img
                              src={tyre.image}
                              alt={tyre.brand}
                              className="relative z-10 h-[75%] object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.5)] transition-all duration-700 group-hover:scale-105"
                            />
                            <div className="absolute top-5 left-5 px-3 py-1.5 rounded-full border border-brand-yellow/20 bg-brand-yellow/10 backdrop-blur-md">
                              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-yellow">
                                {tyre.category}
                              </span>
                            </div>
                          </div>

                          <div className="relative p-7">
                            <div className="flex items-center justify-between mb-3">
                              <span className="px-3 py-1 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono text-gray-300">
                                {tyre.size}
                              </span>
                              <span className="text-xs font-bold text-green-400">
                                {tyre.stock} In Stock
                              </span>
                            </div>

                            <h3 className="text-2xl font-black text-white mb-3">
                              {tyre.brand}
                            </h3>
                            <p className="text-sm leading-relaxed text-gray-400 mb-6">
                              {tyre.desc}
                            </p>

                            <div className="flex items-end justify-between mb-7">
                              <div>
                                <p className="text-3xl font-black text-brand-yellow">
                                  {fmt(tyre.price)}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  Per tyre including VAT
                                </p>
                              </div>
                            </div>

                            {inCart ? (
                              <div className="flex items-center justify-between rounded-2xl border border-brand-yellow/20 bg-brand-yellow/10 px-5 py-4">
                                <button
                                  onClick={() => updateQty(tyre.id, -1)}
                                  className="w-9 h-9 rounded-xl bg-black/20 flex items-center justify-center text-brand-yellow hover:bg-black/40 transition-colors"
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                                <div className="text-center">
                                  <p className="text-white font-black">
                                    {inCart.qty}
                                  </p>
                                  <p className="text-[10px] uppercase tracking-[0.2em] text-brand-yellow">
                                    In Cart
                                  </p>
                                </div>
                                <button
                                  onClick={() => updateQty(tyre.id, 1)}
                                  className="w-9 h-9 rounded-xl bg-black/20 flex items-center justify-center text-brand-yellow hover:bg-black/40 transition-colors"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => addToCart(tyre)}
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
                    })}
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Cart Drawer */}
      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeCart}
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-md"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 240, damping: 28 }}
              className="fixed top-0 right-0 z-50 h-full w-full max-w-md bg-[#080808] border-l border-white/10 backdrop-blur-2xl flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] font-black text-brand-yellow mb-2">
                    Checkout
                  </p>
                  <h3 className="text-2xl font-black text-white">Your Cart</h3>
                </div>
                <button
                  onClick={closeCart}
                  className="w-11 h-11 rounded-2xl border border-white/10 bg-white/[0.03] flex items-center justify-center text-gray-400 hover:text-white hover:border-white/20 transition-all duration-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <ShoppingCart className="w-12 h-12 text-white/10 mb-5" />
                    <h3 className="text-xl font-black text-white mb-2">
                      Cart is Empty
                    </h3>
                    <p className="text-gray-500 text-sm max-w-xs">
                      Add tyres to your cart and continue to checkout.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div
                        key={item.tyre.id}
                        className="rounded-3xl border border-white/10 bg-white/[0.03] p-4"
                      >
                        <div className="flex gap-4">
                          <div className="w-20 h-20 rounded-2xl bg-black/30 border border-white/10 flex items-center justify-center">
                            <img
                              src={item.tyre.image}
                              alt={item.tyre.brand}
                              className="w-[80%] h-[80%] object-contain"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-white font-black">
                              {item.tyre.brand}
                            </h4>
                            <p className="text-brand-yellow text-xs font-mono mt-1">
                              {item.tyre.size}
                            </p>
                            <p className="text-gray-500 text-sm mt-2">
                              {fmt(item.tyre.price)}
                            </p>
                            <div className="flex items-center gap-2 mt-4">
                              <button
                                onClick={() => updateQty(item.tyre.id, -1)}
                                className="w-8 h-8 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-white"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="w-10 text-center text-white font-black">
                                {item.qty}
                              </span>
                              <button
                                onClick={() => updateQty(item.tyre.id, 1)}
                                className="w-8 h-8 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-white"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-white font-black">
                              {fmt(item.tyre.price * item.qty)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="border-t border-white/10 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-sm text-gray-500">Total</p>
                      <h3 className="text-3xl font-black text-brand-yellow">
                        {fmt(cartTotal)}
                      </h3>
                    </div>
                    <div className="text-right">
                      <p className="text-xs uppercase tracking-[0.2em] text-gray-600 font-black">
                        Items
                      </p>
                      <p className="text-white font-black mt-1">{cartCount}</p>
                    </div>
                  </div>

                  {step === null && (
                    <button
                      onClick={() => setStep('fulfilment')}
                      className="w-full h-14 rounded-2xl bg-brand-yellow text-black font-black hover:bg-white transition-all duration-300 flex items-center justify-center gap-3"
                    >
                      Continue Checkout
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}

                  {step === 'fulfilment' && (
                    <div className="space-y-4">
                      <div className="grid gap-3">
                        {[
                          { key: 'visit', label: 'Visit Branch', icon: '🏪' },
                          { key: 'delivery', label: 'Delivery', icon: '📦' },
                          { key: 'mobile', label: 'Mobile Fitting', icon: '🚐' },
                        ].map((opt) => (
                          <button
                            key={opt.key}
                            onClick={() =>
                              setFulfilment(opt.key as Fulfilment)
                            }
                            className={`p-4 rounded-2xl border text-left transition-all duration-300 ${
                              fulfilment === opt.key
                                ? 'border-brand-yellow bg-brand-yellow/10'
                                : 'border-white/10 bg-white/[0.03]'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <span className="text-xl">{opt.icon}</span>
                                <span className="text-white font-bold">
                                  {opt.label}
                                </span>
                              </div>
                              {fulfilment === opt.key && (
                                <CheckCircle className="w-5 h-5 text-brand-yellow" />
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                      <button
                        disabled={!fulfilment}
                        onClick={() => setStep('confirm')}
                        className="w-full h-14 rounded-2xl bg-brand-yellow text-black font-black disabled:opacity-40"
                      >
                        Confirm Selection
                      </button>
                    </div>
                  )}

                  {step === 'confirm' && (
                    <button
                      onClick={placeOrder}
                      className="w-full h-14 rounded-2xl bg-brand-yellow text-black font-black hover:bg-white transition-all duration-300"
                    >
                      Place Order
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}