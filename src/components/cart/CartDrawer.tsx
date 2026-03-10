import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Plus, Minus, Trash2, ArrowRight, CheckCircle } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';

type FulfilmentType = 'visit' | 'mobile' | 'delivery' | null;
type PaymentType = 'cod' | 'branch' | 'bank' | 'card' | null;
type Step = 'cart' | 'fulfilment' | 'payment' | 'done';

const fulfilmentOptions = [
  { key: 'visit',    label: 'Visit Branch',    desc: 'Collect & fit at your nearest branch',    icon: '🏪', free: true },
  { key: 'mobile',   label: 'Mobile Fitting',  desc: 'We come to you — anywhere on the island', icon: '🚐', fee: 'From Rs. 500' },
  { key: 'delivery', label: 'Delivery Only',   desc: 'Tyres delivered to your door',             icon: '📦', fee: 'From Rs. 350' },
];

const paymentOptions = [
  { key: 'cod',    label: 'Cash on Delivery',    icon: '💵' },
  { key: 'branch', label: 'Pay at Branch',        icon: '🏦' },
  { key: 'bank',   label: 'Bank Transfer',        icon: '🔁' },
  { key: 'card',   label: 'Visa / Mastercard',    icon: '💳' },
];

export function CartDrawer() {
  const { cart, updateQty, removeFromCart, clearCart, cartCount, cartTotal, isOpen, setIsOpen } = useCart();
  const [step, setStep] = useState<Step>('cart');
  const [fulfilment, setFulfilment] = useState<FulfilmentType>(null);
  const [payment, setPayment] = useState<PaymentType>(null);
  const [orderRef] = useState(() => `AT-ORD-${Date.now().toString(36).toUpperCase()}`);

  const closeDrawer = () => {
    setIsOpen(false);
    setTimeout(() => {
      setStep('cart');
      setFulfilment(null);
      setPayment(null);
    }, 400);
  };

  const placeOrder = () => {
    // In production: POST to /api/orders
    const order = {
      ref: orderRef,
      items: cart,
      total: cartTotal,
      fulfilment,
      payment,
      date: new Date().toISOString(),
    };
    // Save locally for now
    const existing = JSON.parse(localStorage.getItem('at_orders') || '[]');
    localStorage.setItem('at_orders', JSON.stringify([...existing, order]));
    clearCart();
    setStep('done');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
          />

          {/* Drawer */}
          <motion.div
            className="fixed right-0 top-0 h-full w-full max-w-[420px] bg-neutral-950 border-l border-white/10 z-50 flex flex-col shadow-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
          >
            {/* ── Header ── */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 flex-shrink-0">
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-5 h-5 text-brand-yellow" />
                <h2 className="text-lg font-black text-white tracking-tight">
                  {step === 'cart' && 'Your Cart'}
                  {step === 'fulfilment' && 'Delivery Method'}
                  {step === 'payment' && 'Payment'}
                  {step === 'done' && 'Order Placed!'}
                </h2>
                {step === 'cart' && cartCount > 0 && (
                  <span className="bg-brand-yellow text-black text-xs font-black px-2 py-0.5 rounded-full">
                    {cartCount}
                  </span>
                )}
              </div>
              <button onClick={closeDrawer} className="p-2 rounded-lg hover:bg-white/5 text-brand-gray hover:text-white transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* ── Step Dots ── */}
            {step !== 'done' && (
              <div className="flex items-center gap-2 px-6 pt-4 pb-2 flex-shrink-0">
                {(['cart', 'fulfilment', 'payment'] as Step[]).map((s, i) => (
                  <React.Fragment key={s}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                      step === s ? 'bg-brand-yellow text-black' :
                      ['fulfilment', 'payment'].indexOf(step) > i ? 'bg-green-500 text-white' :
                      'bg-white/10 text-brand-gray'
                    }`}>
                      {['cart', 'fulfilment', 'payment'].indexOf(step) > i ? '✓' : i + 1}
                    </div>
                    {i < 2 && <div className={`flex-1 h-[2px] rounded transition-all ${['fulfilment', 'payment'].indexOf(step) > i ? 'bg-green-500' : 'bg-white/10'}`} />}
                  </React.Fragment>
                ))}
              </div>
            )}

            {/* ── Scrollable Content ── */}
            <div className="flex-1 overflow-y-auto px-6 py-4">

              {/* STEP 1: Cart */}
              {step === 'cart' && (
                <>
                  {cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center py-20">
                      <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-5">
                        <ShoppingCart className="w-9 h-9 text-brand-gray/40" />
                      </div>
                      <p className="text-white font-bold mb-2">Your cart is empty</p>
                      <p className="text-brand-gray text-sm mb-6">Search for tyres to add them here</p>
                      <button onClick={closeDrawer} className="text-brand-yellow text-sm hover:underline">
                        Browse Tyres →
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {cart.map(item => (
                        <motion.div
                          key={item.tyre.id}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="flex gap-3 bg-white/5 rounded-xl p-3 border border-white/5"
                        >
                          <div className="w-16 h-16 bg-white rounded-lg flex-shrink-0 overflow-hidden">
                            <img src={item.tyre.image} alt={item.tyre.brand} className="w-full h-full object-contain p-1" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-white text-sm truncate">{item.tyre.brand}</p>
                            <p className="text-[11px] font-mono text-brand-yellow">{item.tyre.size}</p>
                            <p className="text-xs text-brand-gray">Rs. {item.tyre.price.toLocaleString()} / tyre</p>
                            <div className="flex items-center gap-2 mt-2">
                              <button onClick={() => updateQty(item.tyre.id, -1)}
                                className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center hover:bg-white/20 text-white transition-all">
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-white text-sm font-bold w-4 text-center">{item.qty}</span>
                              <button onClick={() => updateQty(item.tyre.id, 1)}
                                className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center hover:bg-white/20 text-white transition-all">
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                          <div className="flex flex-col items-end justify-between">
                            <button onClick={() => removeFromCart(item.tyre.id)}
                              className="text-brand-gray hover:text-red-400 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <p className="font-black text-white text-sm">
                              Rs. {(item.tyre.price * item.qty).toLocaleString()}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* STEP 2: Fulfilment */}
              {step === 'fulfilment' && (
                <div className="space-y-3 py-2">
                  <p className="text-brand-gray text-sm mb-4">How would you like to receive your tyres?</p>
                  {fulfilmentOptions.map(opt => (
                    <button
                      key={opt.key}
                      onClick={() => setFulfilment(opt.key as FulfilmentType)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                        fulfilment === opt.key
                          ? 'border-brand-yellow bg-brand-yellow/10'
                          : 'border-white/10 bg-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl flex-shrink-0 mt-0.5">{opt.icon}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-white">{opt.label}</p>
                            {(opt as any).free && (
                              <span className="text-[10px] bg-green-500/20 text-green-400 border border-green-500/20 px-1.5 py-0.5 rounded font-bold">FREE</span>
                            )}
                          </div>
                          <p className="text-xs text-brand-gray mt-0.5">{opt.desc}</p>
                          {(opt as any).fee && (
                            <p className="text-xs text-brand-yellow mt-1">{(opt as any).fee}</p>
                          )}
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                          fulfilment === opt.key ? 'border-brand-yellow bg-brand-yellow' : 'border-white/20'
                        }`}>
                          {fulfilment === opt.key && <div className="w-2 h-2 rounded-full bg-black" />}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* STEP 3: Payment */}
              {step === 'payment' && (
                <div className="space-y-3 py-2">
                  <p className="text-brand-gray text-sm mb-4">Choose how you'd like to pay</p>
                  {paymentOptions.map(opt => (
                    <button
                      key={opt.key}
                      onClick={() => setPayment(opt.key as PaymentType)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                        payment === opt.key
                          ? 'border-brand-yellow bg-brand-yellow/10'
                          : 'border-white/10 bg-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{opt.icon}</span>
                        <p className="font-bold text-white flex-1">{opt.label}</p>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                          payment === opt.key ? 'border-brand-yellow bg-brand-yellow' : 'border-white/20'
                        }`}>
                          {payment === opt.key && <div className="w-2 h-2 rounded-full bg-black" />}
                        </div>
                      </div>
                    </button>
                  ))}

                  {/* Order Summary */}
                  <div className="bg-white/5 rounded-xl p-4 mt-4 border border-white/5">
                    <p className="text-xs font-bold text-brand-gray uppercase tracking-wider mb-3">Order Summary</p>
                    {cart.map(item => (
                      <div key={item.tyre.id} className="flex justify-between text-sm py-1">
                        <span className="text-brand-gray">{item.tyre.brand} ×{item.qty}</span>
                        <span className="text-white">Rs. {(item.tyre.price * item.qty).toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="border-t border-white/10 mt-2 pt-2 flex justify-between font-black">
                      <span className="text-white">Total</span>
                      <span className="text-brand-yellow">Rs. {cartTotal.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* DONE */}
              {step === 'done' && (
                <div className="flex flex-col items-center justify-center h-full text-center py-10">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 12 }}
                    className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mb-6"
                  >
                    <CheckCircle className="w-12 h-12 text-green-400" />
                  </motion.div>
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <h3 className="text-2xl font-black text-white mb-2">Order Placed!</h3>
                    <p className="text-brand-gray text-sm mb-4">
                      Our team will contact you shortly to confirm your order.
                    </p>
                    <div className="bg-brand-yellow/10 border border-brand-yellow/30 rounded-xl p-4 mb-6">
                      <p className="text-xs text-brand-gray mb-1">Order Reference</p>
                      <p className="font-black text-brand-yellow font-mono text-lg">{orderRef}</p>
                    </div>
                    <div className="space-y-3">
                      <Link to="/dashboard" onClick={closeDrawer}>
                        <button className="w-full py-3 bg-brand-yellow text-black font-black rounded-xl hover:bg-yellow-300 transition-all">
                          Track in Dashboard
                        </button>
                      </Link>
                      <button onClick={closeDrawer} className="w-full py-3 border border-white/10 text-brand-gray font-bold rounded-xl hover:bg-white/5 transition-all text-sm">
                        Continue Shopping
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
            </div>

            {/* ── Footer Actions ── */}
            {step !== 'done' && cart.length > 0 && (
              <div className="border-t border-white/10 p-6 flex-shrink-0 space-y-3">
                {step === 'cart' && (
                  <>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-brand-gray text-sm">{cartCount} item{cartCount > 1 ? 's' : ''}</span>
                      <span className="text-xl font-black text-brand-yellow">Rs. {cartTotal.toLocaleString()}</span>
                    </div>
                    <button
                      onClick={() => setStep('fulfilment')}
                      className="w-full py-4 bg-brand-yellow text-black font-black rounded-xl hover:bg-yellow-300 transition-all flex items-center justify-center gap-2"
                    >
                      Checkout <ArrowRight className="w-5 h-5" />
                    </button>
                  </>
                )}
                {step === 'fulfilment' && (
                  <div className="flex gap-3">
                    <button onClick={() => setStep('cart')}
                      className="flex-1 py-4 border border-white/20 text-white font-bold rounded-xl hover:bg-white/5 transition-all">
                      Back
                    </button>
                    <button onClick={() => setStep('payment')} disabled={!fulfilment}
                      className="flex-1 py-4 bg-brand-yellow text-black font-black rounded-xl hover:bg-yellow-300 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                      Continue
                    </button>
                  </div>
                )}
                {step === 'payment' && (
                  <div className="flex gap-3">
                    <button onClick={() => setStep('fulfilment')}
                      className="flex-1 py-4 border border-white/20 text-white font-bold rounded-xl hover:bg-white/5 transition-all">
                      Back
                    </button>
                    <button onClick={placeOrder} disabled={!payment}
                      className="flex-1 py-4 bg-brand-yellow text-black font-black rounded-xl hover:bg-yellow-300 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
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
  );
}