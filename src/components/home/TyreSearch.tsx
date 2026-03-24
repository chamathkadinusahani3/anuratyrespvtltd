import React, { useState } from 'react';
import { Search, ShoppingCart, X, Plus, Minus, ChevronRight, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TYRE_INVENTORY = [
  { id: 1, brand: 'FORZA 001', size: '225/45R17', category: 'Passenger Car', price: 18500, stock: 12, image: 'https://image.makewebeasy.net/makeweb/m_1920x0/JCbWKd3P2/PassengerCar/banner_product_FORZA_001_img_2x.png?v=202405291424', desc: 'Deliver a thrilling ride with maximum precision.' },
  { id: 2, brand: 'FORZA 001', size: '205/55R16', category: 'Passenger Car', price: 15900, stock: 8, image: 'https://image.makewebeasy.net/makeweb/m_1920x0/JCbWKd3P2/PassengerCar/banner_product_FORZA_001_img_2x.png?v=202405291424', desc: 'Deliver a thrilling ride with maximum precision.' },
  { id: 3, brand: 'FALCO S88', size: '195/65R15', category: 'Passenger Car', price: 12800, stock: 20, image: 'https://image.makewebeasy.net/makeweb/m_1920x0/JCbWKd3P2/PassengerCar/banner_product_FALCO_S88_img_2x.png?v=202405291424', desc: 'Perfect balance of dynamic appearance and sport-oriented performance.' },
  { id: 4, brand: 'FALCO S88', size: '185/65R15', category: 'Passenger Car', price: 11500, stock: 15, image: 'https://image.makewebeasy.net/makeweb/m_1920x0/JCbWKd3P2/PassengerCar/banner_product_FALCO_S88_img_2x.png?v=202405291424', desc: 'Perfect balance of dynamic appearance and sport-oriented performance.' },
  { id: 5, brand: 'V-36', size: '215/60R16', category: 'Passenger Car', price: 14200, stock: 6, image: 'https://image.makewebeasy.net/makeweb/m_1920x0/JCbWKd3P2/PassengerCar/banner_product_V-36_img_2x.png?v=202405291424', desc: 'Feel the greater stability and control.' },
  { id: 6, brand: 'X-68+', size: '225/40R18', category: 'Passenger Car', price: 22500, stock: 4, image: 'https://image.makewebeasy.net/makeweb/m_1920x0/JCbWKd3P2/PassengerCar/banner_product_X-68__img_2x.png?v=202405291424', desc: 'Enjoy the ultimate handling and grip.' },
  { id: 7, brand: 'SC-900', size: '205/60R15', category: 'Passenger Car', price: 13600, stock: 18, image: 'https://image.makewebeasy.net/makeweb/m_1920x0/JCbWKd3P2/PassengerCar/banner_product_SC-900_img_2x.png?v=202405291424', desc: 'Quieter, Safer and Smoother Journey.' },
  { id: 8, brand: 'PRESA M/T', size: '265/70R17', category: 'Light Truck', price: 28900, stock: 9, image: 'https://image.makewebeasy.net/makeweb/m_1920x0/JCbWKd3P2/LightTruck/banner_product_PRESA_M_T_img_2x.png?v=202405291424', desc: 'Experience go-anywhere performance.' },
  { id: 9, brand: 'FUERTE K99', size: '215/70R15', category: 'Light Truck', price: 17800, stock: 11, image: 'https://image.makewebeasy.net/makeweb/m_1920x0/JCbWKd3P2/LightTruck/banner_product_FUERTE_K99_img_2x.png?v=202405291424', desc: 'Multi-purpose needs of modern commercial vehicles.' },
  { id: 10, brand: 'ST-51', size: '175/65R14', category: 'Passenger Car', price: 9800, stock: 25, image: 'https://image.makewebeasy.net/makeweb/m_1920x0/JCbWKd3P2/PassengerCar/banner_product_ST-51_img_2x.png?v=202405291424', desc: 'Longevity and performance on the highway.' },
];

const QUICK_SIZES = ['175/65R14', '185/65R15', '205/55R16', '225/45R17', '265/70R17'];

type CartItem = { tyre: typeof TYRE_INVENTORY[0]; qty: number };
type CheckoutStep = null | 'fulfilment' | 'confirm';
type Fulfilment = 'visit' | 'delivery' | 'mobile' | null;

const fmt = (n: number) => `Rs. ${n.toLocaleString()}`;

export function TyreSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<typeof TYRE_INVENTORY>([]);
  const [searched, setSearched] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [step, setStep] = useState<CheckoutStep>(null);
  const [fulfilment, setFulfilment] = useState<Fulfilment>(null);
  const [orderDone, setOrderDone] = useState(false);

  const handleSearch = () => {
    const q = query.trim().toLowerCase();
    if (!q) return;
    setResults(TYRE_INVENTORY.filter(t =>
      t.size.toLowerCase().includes(q) ||
      t.brand.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q)
    ));
    setSearched(true);
  };

  const addToCart = (tyre: typeof TYRE_INVENTORY[0]) => {
    setCart(prev => {
      const ex = prev.find(i => i.tyre.id === tyre.id);
      return ex ? prev.map(i => i.tyre.id === tyre.id ? { ...i, qty: i.qty + 1 } : i) : [...prev, { tyre, qty: 1 }];
    });
  };

  const updateQty = (id: number, delta: number) =>
    setCart(prev => prev.map(i => i.tyre.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i).filter(i => i.qty > 0));

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

  const closeCart = () => { setCartOpen(false); setStep(null); };

  return (
    <section id="tyre-search" className="bg-neutral-950 py-20 px-4 sm:px-6 lg:px-8 border-t border-white/5">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <p className="text-brand-yellow text-xs font-bold tracking-[0.3em] uppercase mb-3">Instant Availability</p>
          <div className="flex items-end justify-between">
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
              TYRE <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-yellow to-brand-red">SEARCH</span>
            </h2>
            {cartCount > 0 && (
              <button
                onClick={() => setCartOpen(true)}
                className="flex items-center gap-2 bg-brand-yellow text-black text-sm font-bold px-4 py-2.5 rounded-xl hover:bg-white transition-colors duration-200"
              >
                <ShoppingCart className="w-4 h-4" />
                Cart ({cartCount})
              </button>
            )}
          </div>
          <p className="text-gray-500 text-sm mt-2 max-w-lg">
            Search by tyre size, brand, or category to check live stock and pricing.
          </p>
        </div>

        {/* Search input */}
        <div className="max-w-2xl mb-6">
          <div className="relative group flex gap-3">
            <div className="absolute inset-0 bg-brand-yellow/8 blur-xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <div className="relative flex-1 flex items-center bg-neutral-900 border border-white/10 group-focus-within:border-brand-yellow/50 rounded-2xl transition-all duration-300 overflow-hidden">
              <Search className="w-5 h-5 text-gray-500 ml-5 flex-shrink-0 group-focus-within:text-brand-yellow transition-colors duration-300" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                placeholder="e.g. 225/45R17, FALCO, Light Truck..."
                className="flex-1 bg-transparent text-white placeholder-gray-500 px-4 py-4 text-sm outline-none"
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-7 py-4 bg-brand-yellow text-black text-sm font-bold rounded-2xl hover:bg-white transition-colors duration-200 flex-shrink-0"
            >
              Search
            </button>
            {/* Cart button (always visible, compact) */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative w-14 flex items-center justify-center bg-neutral-900 border border-white/10 hover:border-brand-yellow/40 rounded-2xl transition-all duration-200 flex-shrink-0"
            >
              <ShoppingCart className="w-5 h-5 text-white" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-brand-yellow text-black text-[10px] font-black rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          {/* Quick sizes */}
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="text-xs text-gray-600 self-center">Quick:</span>
            {QUICK_SIZES.map(size => (
              <button
                key={size}
                onClick={() => setQuery(size)}
                className="text-xs px-3 py-1.5 rounded-lg border border-white/8 text-gray-400 hover:border-brand-yellow/40 hover:text-brand-yellow transition-all duration-200 font-mono"
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Order success */}
        <AnimatePresence>
          {orderDone && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="mb-6 flex items-center gap-3 bg-green-500/10 border border-green-500/25 rounded-2xl px-5 py-4"
            >
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
              <p className="text-green-400 font-bold text-sm">Order placed! We'll contact you within 24 hours to confirm.</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {searched && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {results.length === 0 ? (
                <div className="text-center py-16 bg-neutral-900/50 border border-white/6 rounded-2xl">
                  <p className="text-white font-bold mb-1">No results for "{query}"</p>
                  <p className="text-gray-500 text-sm">Try a different size, brand, or contact us for special orders.</p>
                </div>
              ) : (
                <>
                  <p className="text-gray-500 text-xs mb-5">
                    <span className="text-white font-bold">{results.length}</span> tyre{results.length > 1 ? 's' : ''} found for "{query}"
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {results.map(tyre => {
                      const inCart = cart.find(i => i.tyre.id === tyre.id);
                      const stockColor = tyre.stock > 10 ? 'text-green-400' : tyre.stock > 0 ? 'text-yellow-400' : 'text-red-400';
                      return (
                        <motion.div
                          key={tyre.id}
                          layout
                          className="group bg-neutral-900 border border-white/8 rounded-2xl overflow-hidden hover:border-brand-yellow/40 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(255,204,0,0.08)] flex flex-col"
                        >
                          {/* Image */}
                          <div className="h-40 bg-neutral-800 flex items-center justify-center p-4 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/3 to-transparent" />
                            <img
                              src={tyre.image}
                              alt={tyre.brand}
                              className="h-full object-contain relative z-10 group-hover:scale-105 transition-transform duration-500 drop-shadow-xl"
                            />
                          </div>

                          <div className="p-5 flex flex-col flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[11px] font-mono font-bold text-brand-yellow border border-brand-yellow/25 px-2 py-0.5 rounded-lg">
                                {tyre.size}
                              </span>
                              <span className={`text-[10px] font-bold ${stockColor}`}>
                                {tyre.stock > 0 ? `${tyre.stock} in stock` : 'Out of stock'}
                              </span>
                            </div>

                            <h3 className="text-white font-black text-base mb-1">{tyre.brand}</h3>
                            <p className="text-gray-500 text-xs leading-relaxed mb-3 flex-1 line-clamp-2">{tyre.desc}</p>

                            <p className="text-xl font-black text-brand-yellow mb-4">
                              {fmt(tyre.price)}
                              <span className="text-xs text-gray-500 font-normal ml-1">/ tyre</span>
                            </p>

                            {inCart ? (
                              <div className="flex items-center justify-between bg-brand-yellow/8 border border-brand-yellow/25 rounded-xl px-4 py-2.5">
                                <button onClick={() => updateQty(tyre.id, -1)} className="text-brand-yellow hover:text-white transition-colors">
                                  <Minus className="w-3.5 h-3.5" />
                                </button>
                                <span className="text-white font-bold text-sm">{inCart.qty} in cart</span>
                                <button onClick={() => updateQty(tyre.id, 1)} className="text-brand-yellow hover:text-white transition-colors">
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <button
                                disabled={tyre.stock === 0}
                                onClick={() => addToCart(tyre)}
                                className="w-full py-2.5 bg-brand-yellow/10 hover:bg-brand-yellow text-brand-yellow hover:text-black font-bold rounded-xl transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2"
                              >
                                <ShoppingCart className="w-3.5 h-3.5" />
                                Add to Cart
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

      {/* ── Cart Drawer ─────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeCart}
            />
            <motion.div
              className="fixed right-0 top-0 h-full w-full max-w-md bg-neutral-950 border-l border-white/8 z-50 flex flex-col"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-white/8">
                <div className="flex items-center gap-3">
                  <ShoppingCart className="w-5 h-5 text-brand-yellow" />
                  <h3 className="text-white font-black text-lg">Your Cart</h3>
                  {cartCount > 0 && (
                    <span className="bg-brand-yellow text-black text-xs font-black px-2 py-0.5 rounded-full">{cartCount}</span>
                  )}
                </div>
                <button onClick={closeCart} className="text-gray-500 hover:text-white transition-colors p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer body */}
              <div className="flex-1 overflow-y-auto p-6">
                {cart.length === 0 ? (
                  <div className="text-center py-20">
                    <ShoppingCart className="w-10 h-10 text-white/10 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">Your cart is empty</p>
                    <p className="text-gray-600 text-xs mt-1">Search for tyres to add them here</p>
                  </div>
                ) : step === null ? (
                  <div className="space-y-3">
                    {cart.map(item => (
                      <div key={item.tyre.id} className="flex gap-4 bg-neutral-900 border border-white/6 rounded-2xl p-4">
                        <img src={item.tyre.image} alt={item.tyre.brand} className="w-14 h-14 object-contain bg-neutral-800 rounded-xl p-1 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-bold text-sm">{item.tyre.brand}</p>
                          <p className="text-brand-yellow text-xs font-mono">{item.tyre.size}</p>
                          <p className="text-gray-500 text-xs mt-0.5">{fmt(item.tyre.price)} × {item.qty}</p>
                        </div>
                        <div className="flex flex-col items-end justify-between">
                          <p className="text-white font-bold text-sm">{fmt(item.tyre.price * item.qty)}</p>
                          <div className="flex items-center gap-1.5 mt-2">
                            <button onClick={() => updateQty(item.tyre.id, -1)} className="w-6 h-6 rounded-lg bg-white/8 flex items-center justify-center hover:bg-white/15 text-white transition-colors">
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-white text-xs font-bold w-4 text-center">{item.qty}</span>
                            <button onClick={() => updateQty(item.tyre.id, 1)} className="w-6 h-6 rounded-lg bg-white/8 flex items-center justify-center hover:bg-white/15 text-white transition-colors">
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : step === 'fulfilment' ? (
                  <div>
                    <p className="text-brand-yellow text-xs font-bold tracking-[0.2em] uppercase mb-5">Choose Fulfilment</p>
                    <div className="space-y-3">
                      {[
                        { key: 'visit', label: 'Visit Branch', desc: 'Come to your nearest Anura Tyres branch', emoji: '🏪' },
                        { key: 'mobile', label: 'Mobile Fitting', desc: "We'll come to your location to fit the tyres", emoji: '🚐' },
                        { key: 'delivery', label: 'Delivery', desc: 'Tyres delivered to your address', emoji: '📦' },
                      ].map(opt => (
                        <button
                          key={opt.key}
                          onClick={() => setFulfilment(opt.key as Fulfilment)}
                          className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 ${
                            fulfilment === opt.key
                              ? 'border-brand-yellow bg-brand-yellow/8'
                              : 'border-white/8 bg-neutral-900 hover:border-white/15'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{opt.emoji}</span>
                            <div className="flex-1">
                              <p className="text-white font-bold text-sm">{opt.label}</p>
                              <p className="text-gray-500 text-xs mt-0.5">{opt.desc}</p>
                            </div>
                            {fulfilment === opt.key && <CheckCircle className="w-4 h-4 text-brand-yellow flex-shrink-0" />}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-brand-yellow text-xs font-bold tracking-[0.2em] uppercase mb-5">Confirm Order</p>
                    <div className="bg-neutral-900 border border-white/6 rounded-2xl p-4 space-y-2.5">
                      {cart.map(item => (
                        <div key={item.tyre.id} className="flex justify-between text-sm">
                          <span className="text-gray-400">{item.tyre.brand} {item.tyre.size} ×{item.qty}</span>
                          <span className="text-white font-bold">{fmt(item.tyre.price * item.qty)}</span>
                        </div>
                      ))}
                      <div className="border-t border-white/8 pt-3 flex justify-between">
                        <span className="text-white font-bold">Total</span>
                        <span className="text-brand-yellow font-black text-lg">{fmt(cartTotal)}</span>
                      </div>
                    </div>
                    <div className="bg-brand-yellow/6 border border-brand-yellow/20 rounded-2xl p-4">
                      <p className="text-sm text-white font-bold">
                        {fulfilment === 'visit' ? '🏪 Visit Branch' : fulfilment === 'mobile' ? '🚐 Mobile Fitting' : '📦 Delivery'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Our team will contact you within 24 hours to confirm details</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-bold uppercase tracking-wider mb-3">Payment Method</p>
                      <div className="space-y-2">
                        {['Cash on Delivery', 'Pay at Branch', 'Bank Transfer', 'Visa / Mastercard'].map(pm => (
                          <div key={pm} className="flex items-center gap-3 p-3 rounded-xl bg-neutral-900 border border-white/6 text-sm text-gray-400 hover:border-white/15 cursor-pointer transition-colors">
                            <div className="w-3 h-3 rounded-full border border-gray-600 flex-shrink-0" />
                            {pm}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Drawer footer */}
              {cart.length > 0 && (
                <div className="border-t border-white/8 p-6 space-y-3">
                  {step === null && (
                    <>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-white font-black">Total</span>
                        <span className="text-brand-yellow font-black text-xl">{fmt(cartTotal)}</span>
                      </div>
                      <button
                        onClick={() => setStep('fulfilment')}
                        className="w-full py-4 bg-brand-yellow text-black font-black rounded-2xl hover:bg-white transition-colors duration-200 flex items-center justify-center gap-2"
                      >
                        Proceed to Checkout <ChevronRight className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  {step === 'fulfilment' && (
                    <div className="flex gap-3">
                      <button onClick={() => setStep(null)} className="flex-1 py-3.5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/5 transition-colors text-sm">Back</button>
                      <button disabled={!fulfilment} onClick={() => setStep('confirm')} className="flex-1 py-3.5 bg-brand-yellow text-black font-black rounded-2xl hover:bg-white transition-colors disabled:opacity-40 text-sm">Continue</button>
                    </div>
                  )}
                  {step === 'confirm' && (
                    <div className="flex gap-3">
                      <button onClick={() => setStep('fulfilment')} className="flex-1 py-3.5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/5 transition-colors text-sm">Back</button>
                      <button onClick={placeOrder} className="flex-1 py-3.5 bg-brand-yellow text-black font-black rounded-2xl hover:bg-white transition-colors text-sm">Place Order</button>
                    </div>
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