import React, { useState } from 'react';
import { Search, ShoppingCart, Eye, Package, ChevronDown, X, Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Sample tyre inventory data
const TYRE_INVENTORY = [
  { id: 1, brand: 'FORZA 001', size: '225/45R17', pattern: 'FORZA 001', category: 'Passenger Car', price: 18500, stock: 12, image: 'https://image.makewebeasy.net/makeweb/m_1920x0/JCbWKd3P2/PassengerCar/banner_product_FORZA_001_img_2x.png?v=202405291424', desc: 'Deliver a thrilling ride with maximum precision.' },
  { id: 2, brand: 'FORZA 001', size: '205/55R16', pattern: 'FORZA 001', category: 'Passenger Car', price: 15900, stock: 8, image: 'https://image.makewebeasy.net/makeweb/m_1920x0/JCbWKd3P2/PassengerCar/banner_product_FORZA_001_img_2x.png?v=202405291424', desc: 'Deliver a thrilling ride with maximum precision.' },
  { id: 3, brand: 'FALCO S88', size: '195/65R15', pattern: 'FALCO S88', category: 'Passenger Car', price: 12800, stock: 20, image: 'https://image.makewebeasy.net/makeweb/m_1920x0/JCbWKd3P2/PassengerCar/banner_product_FALCO_S88_img_2x.png?v=202405291424', desc: 'Perfect balance of dynamic appearance and sport-oriented performance.' },
  { id: 4, brand: 'FALCO S88', size: '185/65R15', pattern: 'FALCO S88', category: 'Passenger Car', price: 11500, stock: 15, image: 'https://image.makewebeasy.net/makeweb/m_1920x0/JCbWKd3P2/PassengerCar/banner_product_FALCO_S88_img_2x.png?v=202405291424', desc: 'Perfect balance of dynamic appearance and sport-oriented performance.' },
  { id: 5, brand: 'V-36', size: '215/60R16', pattern: 'V-36', category: 'Passenger Car', price: 14200, stock: 6, image: 'https://image.makewebeasy.net/makeweb/m_1920x0/JCbWKd3P2/PassengerCar/banner_product_V-36_img_2x.png?v=202405291424', desc: 'Feel the greater stability and control.' },
  { id: 6, brand: 'X-68+', size: '225/40R18', pattern: 'X-68+', category: 'Passenger Car', price: 22500, stock: 4, image: 'https://image.makewebeasy.net/makeweb/m_1920x0/JCbWKd3P2/PassengerCar/banner_product_X-68__img_2x.png?v=202405291424', desc: 'Enjoy the ultimate handling and grip.' },
  { id: 7, brand: 'SC-900', size: '205/60R15', pattern: 'SC-900', category: 'Passenger Car', price: 13600, stock: 18, image: 'https://image.makewebeasy.net/makeweb/m_1920x0/JCbWKd3P2/PassengerCar/banner_product_SC-900_img_2x.png?v=202405291424', desc: 'Quieter, Safer and Smoother Journey.' },
  { id: 8, brand: 'PRESA M/T', size: '265/70R17', pattern: 'PRESA M/T', category: 'Light Truck', price: 28900, stock: 9, image: 'https://image.makewebeasy.net/makeweb/m_1920x0/JCbWKd3P2/LightTruck/banner_product_PRESA_M_T_img_2x.png?v=202405291424', desc: 'Experience go-anywhere performance.' },
  { id: 9, brand: 'FUERTE K99', size: '215/70R15', pattern: 'FUERTE K99', category: 'Light Truck', price: 17800, stock: 11, image: 'https://image.makewebeasy.net/makeweb/m_1920x0/JCbWKd3P2/LightTruck/banner_product_FUERTE_K99_img_2x.png?v=202405291424', desc: 'Multi-purpose needs of modern commercial vehicles.' },
  { id: 10, brand: 'ST-51', size: '175/65R14', pattern: 'ST-51', category: 'Passenger Car', price: 9800, stock: 25, image: 'https://image.makewebeasy.net/makeweb/m_1920x0/JCbWKd3P2/PassengerCar/banner_product_ST-51_img_2x.png?v=202405291424', desc: 'Longevity and performance on the highway.' },
];

interface CartItem {
  tyre: typeof TYRE_INVENTORY[0];
  qty: number;
}

function formatCurrency(n: number) {
  return `Rs. ${n.toLocaleString()}`;
}

export function TyreSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<typeof TYRE_INVENTORY>([]);
  const [searched, setSearched] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<null | 'fulfilment' | 'confirm'>( null);
  const [fulfilment, setFulfilment] = useState<'visit' | 'delivery' | 'mobile' | null>(null);
  const [orderDone, setOrderDone] = useState(false);

  const handleSearch = () => {
    const q = query.trim().toLowerCase();
    if (!q) return;
    const filtered = TYRE_INVENTORY.filter(t =>
      t.size.toLowerCase().includes(q) ||
      t.brand.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q)
    );
    setResults(filtered);
    setSearched(true);
  };

  const addToCart = (tyre: typeof TYRE_INVENTORY[0]) => {
    setCart(prev => {
      const existing = prev.find(i => i.tyre.id === tyre.id);
      if (existing) return prev.map(i => i.tyre.id === tyre.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { tyre, qty: 1 }];
    });
  };

  const updateQty = (id: number, delta: number) => {
    setCart(prev => prev
      .map(i => i.tyre.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i)
      .filter(i => i.qty > 0)
    );
  };

  const cartTotal = cart.reduce((sum, i) => sum + i.tyre.price * i.qty, 0);
  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);

  const placeOrder = () => {
    setOrderDone(true);
    setCart([]);
    setCheckoutStep(null);
    setFulfilment(null);
    setTimeout(() => setOrderDone(false), 5000);
    setCartOpen(false);
  };

  return (
    <section className="bg-black py-16 px-4 sm:px-6 lg:px-8 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="w-8 h-[2px] bg-brand-yellow"></span>
            <span className="text-brand-yellow font-black uppercase tracking-[0.2em] text-xs">Find Your Tyres</span>
            <span className="w-8 h-[2px] bg-brand-yellow"></span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter uppercase mb-3">
            Tyre <span className="text-brand-yellow">Search</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Search by tyre size (e.g. 225/45R17), brand, or category to check availability and pricing
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-10">
          <div className="relative flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-gray" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                placeholder="e.g. 225/45R17 or FALCO or Light Truck..."
                className="w-full bg-neutral-900 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white placeholder-brand-gray focus:outline-none focus:ring-2 focus:ring-brand-yellow/50 focus:border-brand-yellow transition-all text-sm"
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-8 py-4 bg-brand-yellow text-black font-black rounded-xl hover:bg-yellow-300 transition-all uppercase tracking-wider text-sm"
            >
              Search
            </button>

            {/* Cart Icon */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative px-4 py-4 bg-white/5 border border-white/10 rounded-xl hover:border-brand-yellow/50 transition-all"
            >
              <ShoppingCart className="w-5 h-5 text-white" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-brand-yellow text-black text-xs font-black rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          {/* Quick Size Hints */}
          <div className="flex flex-wrap gap-2 mt-3 justify-center">
            {['175/65R14', '185/65R15', '205/55R16', '225/45R17', '265/70R17'].map(size => (
              <button
                key={size}
                onClick={() => { setQuery(size); }}
                className="text-xs px-3 py-1 rounded-full border border-white/10 text-brand-gray hover:border-brand-yellow/50 hover:text-brand-yellow transition-all font-mono"
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Order Success Banner */}
        <AnimatePresence>
          {orderDone && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-center"
            >
              <p className="text-green-400 font-bold">✓ Order placed successfully! We'll contact you shortly to confirm.</p>
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
                <div className="text-center py-12">
                  <p className="text-brand-gray text-lg mb-2">No tyres found for "{query}"</p>
                  <p className="text-brand-gray/60 text-sm">Try a different size, brand, or contact us for special orders</p>
                </div>
              ) : (
                <>
                  <p className="text-brand-gray text-sm mb-4 text-center">
                    Found <span className="text-white font-bold">{results.length}</span> tyre{results.length > 1 ? 's' : ''} matching "{query}"
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {results.map(tyre => {
                      const inCart = cart.find(i => i.tyre.id === tyre.id);
                      return (
                        <motion.div
                          key={tyre.id}
                          layout
                          className="bg-neutral-900 border border-white/5 rounded-2xl overflow-hidden hover:border-brand-yellow/30 transition-all group"
                        >
                          {/* Image */}
                          <div className="h-44 bg-white/5 flex items-center justify-center p-4">
                            <img src={tyre.image} alt={tyre.brand} className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-300" />
                          </div>

                          <div className="p-5">
                            {/* Stock badge */}
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-mono text-brand-yellow border border-brand-yellow/30 px-2 py-0.5 rounded-full">
                                {tyre.size}
                              </span>
                              <span className={`text-xs font-bold ${tyre.stock > 10 ? 'text-green-400' : tyre.stock > 0 ? 'text-yellow-400' : 'text-red-400'}`}>
                                {tyre.stock > 0 ? `${tyre.stock} in stock` : 'Out of stock'}
                              </span>
                            </div>

                            <h3 className="font-black text-white text-lg mb-1">{tyre.brand}</h3>
                            <p className="text-xs text-brand-gray mb-3 line-clamp-2">{tyre.desc}</p>

                            <p className="text-2xl font-black text-brand-yellow mb-4">
                              {formatCurrency(tyre.price)}
                              <span className="text-xs text-brand-gray font-normal ml-1">/ tyre</span>
                            </p>

                            {inCart ? (
                              <div className="flex items-center justify-between bg-brand-yellow/10 border border-brand-yellow/30 rounded-lg px-3 py-2">
                                <button onClick={() => updateQty(tyre.id, -1)} className="text-brand-yellow hover:text-white">
                                  <Minus className="w-4 h-4" />
                                </button>
                                <span className="text-white font-bold text-sm">{inCart.qty} in cart</span>
                                <button onClick={() => updateQty(tyre.id, 1)} className="text-brand-yellow hover:text-white">
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <button
                                disabled={tyre.stock === 0}
                                onClick={() => addToCart(tyre)}
                                className="w-full py-2.5 bg-brand-yellow text-black font-bold rounded-lg hover:bg-yellow-300 transition-all disabled:opacity-40 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2"
                              >
                                <ShoppingCart className="w-4 h-4" />
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

      {/* Cart Drawer */}
      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/70 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setCartOpen(false); setCheckoutStep(null); }}
            />
            <motion.div
              className="fixed right-0 top-0 h-full w-full max-w-md bg-neutral-950 border-l border-white/10 z-50 flex flex-col"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              {/* Cart Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <ShoppingCart className="w-5 h-5 text-brand-yellow" />
                  <h3 className="text-xl font-black text-white">Your Cart</h3>
                  {cartCount > 0 && (
                    <span className="bg-brand-yellow text-black text-xs font-black px-2 py-0.5 rounded-full">{cartCount}</span>
                  )}
                </div>
                <button onClick={() => { setCartOpen(false); setCheckoutStep(null); }} className="text-brand-gray hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {cart.length === 0 ? (
                  <div className="text-center py-16">
                    <ShoppingCart className="w-12 h-12 text-brand-gray/30 mx-auto mb-4" />
                    <p className="text-brand-gray">Your cart is empty</p>
                    <p className="text-brand-gray/60 text-sm mt-1">Search for tyres to add them here</p>
                  </div>
                ) : checkoutStep === null ? (
                  // Cart Items
                  <div className="space-y-4">
                    {cart.map(item => (
                      <div key={item.tyre.id} className="flex gap-4 bg-white/5 rounded-xl p-4">
                        <img src={item.tyre.image} alt={item.tyre.brand} className="w-16 h-16 object-contain bg-white/5 rounded-lg p-1 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-white text-sm">{item.tyre.brand}</p>
                          <p className="text-xs text-brand-yellow font-mono">{item.tyre.size}</p>
                          <p className="text-xs text-brand-gray mt-0.5">{formatCurrency(item.tyre.price)} × {item.qty}</p>
                        </div>
                        <div className="flex flex-col items-end justify-between">
                          <p className="font-bold text-white text-sm">{formatCurrency(item.tyre.price * item.qty)}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <button onClick={() => updateQty(item.tyre.id, -1)} className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 text-white">
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-white text-sm font-bold">{item.qty}</span>
                            <button onClick={() => updateQty(item.tyre.id, 1)} className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 text-white">
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : checkoutStep === 'fulfilment' ? (
                  // Fulfilment Selection
                  <div className="space-y-4">
                    <h4 className="text-white font-bold text-lg mb-6">Choose Fulfilment Method</h4>
                    {[
                      { key: 'visit', label: 'Visit Branch', desc: 'Come to your nearest Anura Tyres branch', icon: '🏪' },
                      { key: 'mobile', label: 'Mobile Fitting', desc: "We'll come to your location to fit the tyres", icon: '🚐' },
                      { key: 'delivery', label: 'Delivery', desc: 'Tyres delivered to your address', icon: '📦' },
                    ].map(opt => (
                      <button
                        key={opt.key}
                        onClick={() => setFulfilment(opt.key as any)}
                        className={`w-full text-left p-4 rounded-xl border transition-all ${
                          fulfilment === opt.key
                            ? 'border-brand-yellow bg-brand-yellow/10'
                            : 'border-white/10 bg-white/5 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{opt.icon}</span>
                          <div>
                            <p className="font-bold text-white">{opt.label}</p>
                            <p className="text-xs text-brand-gray mt-0.5">{opt.desc}</p>
                          </div>
                          {fulfilment === opt.key && (
                            <span className="ml-auto text-brand-yellow font-bold">✓</span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                ) : checkoutStep === 'confirm' ? (
                  // Confirmation
                  <div className="space-y-4">
                    <h4 className="text-white font-bold text-lg mb-4">Confirm Order</h4>
                    <div className="bg-white/5 rounded-xl p-4 space-y-3">
                      {cart.map(item => (
                        <div key={item.tyre.id} className="flex justify-between text-sm">
                          <span className="text-brand-gray">{item.tyre.brand} {item.tyre.size} ×{item.qty}</span>
                          <span className="text-white font-bold">{formatCurrency(item.tyre.price * item.qty)}</span>
                        </div>
                      ))}
                      <div className="border-t border-white/10 pt-3 flex justify-between font-bold">
                        <span className="text-white">Total</span>
                        <span className="text-brand-yellow text-lg">{formatCurrency(cartTotal)}</span>
                      </div>
                    </div>
                    <div className="bg-brand-yellow/10 border border-brand-yellow/30 rounded-xl p-4">
                      <p className="text-sm text-white font-bold mb-1">Fulfilment: {fulfilment === 'visit' ? '🏪 Visit Branch' : fulfilment === 'mobile' ? '🚐 Mobile Fitting' : '📦 Delivery'}</p>
                      <p className="text-xs text-brand-gray">Our team will contact you within 24 hours to confirm details</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs text-brand-gray font-bold uppercase tracking-wider">Payment Method</p>
                      {['Cash on Delivery', 'Pay at Branch', 'Bank Transfer', 'Visa / Mastercard'].map(pm => (
                        <div key={pm} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10 text-sm text-brand-gray hover:border-white/20 cursor-pointer">
                          <div className="w-3 h-3 rounded-full border border-brand-gray/50 flex-shrink-0" />
                          {pm}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Cart Footer */}
              {cart.length > 0 && (
                <div className="border-t border-white/10 p-6 space-y-3">
                  {checkoutStep === null && (
                    <>
                      <div className="flex justify-between text-lg font-black">
                        <span className="text-white">Total</span>
                        <span className="text-brand-yellow">{formatCurrency(cartTotal)}</span>
                      </div>
                      <button
                        onClick={() => setCheckoutStep('fulfilment')}
                        className="w-full py-4 bg-brand-yellow text-black font-black rounded-xl hover:bg-yellow-300 transition-all"
                      >
                        Proceed to Checkout
                      </button>
                    </>
                  )}
                  {checkoutStep === 'fulfilment' && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => setCheckoutStep(null)}
                        className="flex-1 py-4 border border-white/20 text-white font-bold rounded-xl hover:bg-white/5 transition-all"
                      >
                        Back
                      </button>
                      <button
                        disabled={!fulfilment}
                        onClick={() => setCheckoutStep('confirm')}
                        className="flex-1 py-4 bg-brand-yellow text-black font-black rounded-xl hover:bg-yellow-300 transition-all disabled:opacity-40"
                      >
                        Continue
                      </button>
                    </div>
                  )}
                  {checkoutStep === 'confirm' && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => setCheckoutStep('fulfilment')}
                        className="flex-1 py-4 border border-white/20 text-white font-bold rounded-xl hover:bg-white/5 transition-all"
                      >
                        Back
                      </button>
                      <button
                        onClick={placeOrder}
                        className="flex-1 py-4 bg-brand-yellow text-black font-black rounded-xl hover:bg-yellow-300 transition-all"
                      >
                        Place Order
                      </button>
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