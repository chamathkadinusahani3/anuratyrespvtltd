import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart, ChevronLeft, Plus, Minus, Trash2, ArrowRight,
  CheckCircle, Truck, Store, Package, CreditCard, Banknote, Building2, Loader2,
} from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import type { ProductImage } from '../types/inventoryPublic';
import { Navbar } from '../components/layout/Navbar';

const API_URL = (import.meta as { env: { VITE_API_URL?: string } }).env.VITE_API_URL
  || 'https://anuratyres-backend-emm1774.vercel.app/api';

type FulfilmentType = 'visit' | 'mobile' | 'delivery' | null;
type PaymentType    = 'cod' | 'branch' | 'bank' | null;
type Step           = 'cart' | 'fulfilment' | 'payment' | 'done';

const STEPS: { key: Step; label: string }[] = [
  { key: 'cart',       label: 'Cart'     },
  { key: 'fulfilment', label: 'Delivery' },
  { key: 'payment',    label: 'Payment'  },
];

const FULFILMENT_OPTIONS = [
  { key: 'visit'    as FulfilmentType, label: 'Visit Branch',   desc: 'Collect & fit at your nearest branch',    icon: Store,    fee: null,         freeLabel: 'FREE' },
  { key: 'mobile'   as FulfilmentType, label: 'Mobile Fitting', desc: 'We come to you — anywhere on the island', icon: Truck,    fee: 'From Rs. 500', freeLabel: null },
  { key: 'delivery' as FulfilmentType, label: 'Delivery Only',  desc: 'Tyres delivered to your door',            icon: Package,  fee: 'From Rs. 350', freeLabel: null },
];

const PAYMENT_OPTIONS = [
  { key: 'cod'    as PaymentType, label: 'Cash on Delivery', desc: 'Pay when your order arrives',   icon: Banknote  },
  { key: 'branch' as PaymentType, label: 'Pay at Branch',    desc: 'Settle when you visit us',      icon: Building2 },
  { key: 'bank'   as PaymentType, label: 'Bank Transfer',    desc: 'Transfer before delivery',      icon: CreditCard },
];

function cdnThumb(img: ProductImage) {
  if (!img.publicId) return img.url;
  const cloud = img.url.match(/res\.cloudinary\.com\/([^/]+)\//)?.[1];
  if (!cloud) return img.url;
  return `https://res.cloudinary.com/${cloud}/image/upload/w_160,h_160,c_fit,f_auto,q_auto/${img.publicId}`;
}

const fmt = (n: number) => `Rs. ${n.toLocaleString()}`;

const stepIndex = (s: Step) => STEPS.findIndex(x => x.key === s);

export function CartPage() {
  const navigate                          = useNavigate();
  const { cart, updateQty, removeFromCart, clearCart, cartCount, cartTotal } = useCart();
  const { user }                          = useAuth();
  const [step,       setStep]       = useState<Step>('cart');
  const [fulfilment, setFulfilment] = useState<FulfilmentType>(null);
  const [payment,    setPayment]    = useState<PaymentType>(null);
  const [placing,    setPlacing]    = useState(false);
  const [orderRef]                  = useState(() => `AT-${Date.now().toString(36).toUpperCase()}`);

  const placeOrder = async () => {
    setPlacing(true);
    try {
      // 1. Deduct inventory in backend
      await fetch(`${API_URL}/products/order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ref: orderRef,
          items: cart.map(i => ({ productId: i.product.id, qty: i.qty })),
          total: cartTotal,
          fulfilment,
          payment,
          userId: user?.uid ?? null,
        }),
      });

      // 2. Save to Firestore orders collection (visible in dashboard)
      if (user) {
        const orderDoc = {
          date:       new Date().toISOString(),
          ref:        orderRef,
          status:     'pending',
          fulfilment: fulfilment ?? '',
          payment:    payment ?? '',
          total:      cartTotal,
          items:      cart.map(i => ({
            name:  i.product.name,
            size:  i.product.tyre?.size || i.product.sku || '',
            qty:   i.qty,
            price: i.product.price,
          })),
        };
        await addDoc(collection(db, 'users', user.uid, 'orders'), orderDoc);
      }
    } catch (e) {
      console.error('Order error:', e);
    } finally {
      clearCart();
      setPlacing(false);
      setStep('done');
    }
  };

  const currentIdx = step === 'done' ? 3 : stepIndex(step);

  return (
    <div className="min-h-screen bg-[#050505]">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">

        {/* ── Back button ─────────────────────────────────────────── */}
        {step !== 'done' && (
          <button
            onClick={() => step === 'cart' ? navigate(-1) : setStep(step === 'payment' ? 'fulfilment' : 'cart')}
            className="flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors mb-8 group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            {step === 'cart' ? 'Continue Shopping' : 'Back'}
          </button>
        )}

        {/* ── Page title ──────────────────────────────────────────── */}
        {step !== 'done' && (
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              {step === 'cart'       && <><span className="text-brand-yellow">Your</span> Cart</>}
              {step === 'fulfilment' && <>Delivery <span className="text-brand-yellow">Method</span></>}
              {step === 'payment'    && <>Payment <span className="text-brand-yellow">Details</span></>}
            </h1>

            {/* Step indicator */}
            <div className="flex items-center gap-2 mt-5">
              {STEPS.map((s, i) => (
                <div key={s.key} className="flex items-center gap-2">
                  <div className={`flex items-center gap-2 transition-all ${
                    currentIdx === i ? 'text-brand-yellow' :
                    currentIdx > i  ? 'text-green-400'    : 'text-neutral-600'
                  }`}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black border transition-all ${
                      currentIdx === i ? 'border-brand-yellow bg-brand-yellow/10 text-brand-yellow' :
                      currentIdx > i  ? 'border-green-500 bg-green-500/10 text-green-400' :
                                        'border-neutral-800 text-neutral-600'
                    }`}>
                      {currentIdx > i ? '✓' : i + 1}
                    </div>
                    <span className={`text-sm font-bold hidden sm:block ${
                      currentIdx === i ? 'text-white' :
                      currentIdx > i  ? 'text-green-400' : 'text-neutral-600'
                    }`}>{s.label}</span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`w-10 sm:w-16 h-[2px] rounded transition-all ${currentIdx > i ? 'bg-green-500' : 'bg-neutral-800'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP: CART ──────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          {step === 'cart' && (
            <motion.div key="cart" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.2 }}>
              {cart.length === 0 ? (
                <div className="text-center py-24 rounded-3xl border border-neutral-800 bg-neutral-900/50">
                  <ShoppingCart className="w-16 h-16 text-neutral-700 mx-auto mb-5" />
                  <h2 className="text-xl font-black text-white mb-2">Your cart is empty</h2>
                  <p className="text-neutral-500 text-sm mb-6">Search for tyres and add them here</p>
                  <button
                    onClick={() => navigate('/')}
                    className="px-6 py-3 bg-brand-yellow text-black font-black rounded-xl hover:bg-yellow-300 transition-all text-sm"
                  >
                    Browse Tyres
                  </button>
                </div>
              ) : (
                <div className="grid lg:grid-cols-3 gap-6">
                  {/* Items */}
                  <div className="lg:col-span-2 space-y-3">
                    <AnimatePresence>
                      {cart.map((item) => {
                        const featImg = item.product.images?.find(i => i.featured) ?? item.product.images?.[0];
                        return (
                          <motion.div
                            key={item.product.id}
                            layout
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}
                            className="flex gap-4 p-4 rounded-2xl border border-neutral-800 bg-neutral-900/60 hover:border-neutral-700 transition-colors"
                          >
                            <div className="w-20 h-20 rounded-xl bg-black/40 border border-neutral-800 flex-shrink-0 overflow-hidden flex items-center justify-center">
                              {featImg
                                ? <img src={cdnThumb(featImg)} alt={item.product.name} className="w-full h-full object-contain" />
                                : <p className="text-brand-yellow font-mono font-black text-[10px] text-center px-1 leading-tight">{item.product.tyre?.size || item.product.sku}</p>
                              }
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-black text-white truncate">{item.product.name}</p>
                              <p className="text-brand-yellow font-mono text-sm font-bold">{item.product.tyre?.size || item.product.sku}</p>
                              <p className="text-neutral-500 text-xs mt-0.5">{item.product.brand}</p>
                              <div className="flex items-center gap-2 mt-3">
                                <button onClick={() => updateQty(item.product.id, -1)} className="w-7 h-7 rounded-lg bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-white transition-colors">
                                  <Minus className="w-3.5 h-3.5" />
                                </button>
                                <span className="text-white font-black w-6 text-center">{item.qty}</span>
                                <button
                                  onClick={() => updateQty(item.product.id, 1)}
                                  disabled={item.qty >= (item.product.quantity ?? 0)}
                                  className="w-7 h-7 rounded-lg bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              {item.qty >= (item.product.quantity ?? 0) && (
                                <p className="text-[10px] text-amber-400 mt-1">Max stock</p>
                              )}
                            </div>
                            <div className="flex flex-col items-end justify-between flex-shrink-0">
                              <button onClick={() => removeFromCart(item.product.id)} className="text-neutral-600 hover:text-red-400 transition-colors p-1">
                                <Trash2 className="w-4 h-4" />
                              </button>
                              <p className="font-black text-white text-base">
                                {item.product.price > 0 ? fmt(item.product.price * item.qty) : '—'}
                              </p>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>

                  {/* Summary */}
                  <div className="lg:col-span-1">
                    <div className="sticky top-24 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6">
                      <h3 className="font-black text-white text-lg mb-4">Order Summary</h3>
                      <div className="space-y-2 mb-4">
                        {cart.map(item => (
                          <div key={item.product.id} className="flex justify-between text-sm">
                            <span className="text-neutral-400 truncate mr-3">{item.product.name} ×{item.qty}</span>
                            <span className="text-white flex-shrink-0">{item.product.price > 0 ? fmt(item.product.price * item.qty) : 'TBD'}</span>
                          </div>
                        ))}
                      </div>
                      <div className="border-t border-neutral-800 pt-4 mb-5">
                        <div className="flex justify-between items-center">
                          <span className="text-neutral-400 text-sm">{cartCount} item{cartCount !== 1 ? 's' : ''}</span>
                          <span className="text-2xl font-black text-brand-yellow">
                            {cartTotal > 0 ? fmt(cartTotal) : 'TBD'}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-600 mt-1">Delivery fee calculated at next step</p>
                      </div>
                      <button
                        onClick={() => setStep('fulfilment')}
                        className="w-full py-4 bg-brand-yellow text-black font-black rounded-xl hover:bg-yellow-300 transition-all flex items-center justify-center gap-2 text-sm"
                      >
                        Checkout <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* ── STEP: FULFILMENT ──────────────────────────────────── */}
          {step === 'fulfilment' && (
            <motion.div key="fulfilment" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.2 }}>
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-3">
                  <p className="text-neutral-400 text-sm mb-5">How would you like to receive your tyres?</p>
                  {FULFILMENT_OPTIONS.map(({ key, label, desc, icon: Icon, fee, freeLabel }) => (
                    <button
                      key={key}
                      onClick={() => setFulfilment(key)}
                      className={`w-full text-left p-5 rounded-2xl border-2 transition-all ${
                        fulfilment === key
                          ? 'border-brand-yellow bg-brand-yellow/8'
                          : 'border-neutral-800 bg-neutral-900/50 hover:border-neutral-700'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                          fulfilment === key ? 'bg-brand-yellow/20' : 'bg-neutral-800'
                        }`}>
                          <Icon className={`w-5 h-5 ${fulfilment === key ? 'text-brand-yellow' : 'text-neutral-400'}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-black text-white">{label}</p>
                            {freeLabel && <span className="text-[10px] bg-green-500/20 text-green-400 border border-green-500/20 px-1.5 py-0.5 rounded font-bold">{freeLabel}</span>}
                            {fee && <span className="text-xs text-brand-yellow font-bold">{fee}</span>}
                          </div>
                          <p className="text-neutral-500 text-sm mt-0.5">{desc}</p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                          fulfilment === key ? 'border-brand-yellow bg-brand-yellow' : 'border-neutral-700'
                        }`}>
                          {fulfilment === key && <div className="w-2 h-2 rounded-full bg-black" />}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="lg:col-span-1">
                  <div className="sticky top-24 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6">
                    <h3 className="font-black text-white text-base mb-3">Order Total</h3>
                    <p className="text-3xl font-black text-brand-yellow mb-4">{cartTotal > 0 ? fmt(cartTotal) : 'TBD'}</p>
                    <p className="text-xs text-neutral-600 mb-5">{cartCount} item{cartCount !== 1 ? 's' : ''} · Delivery fee added at checkout</p>
                    <button
                      onClick={() => setStep('payment')}
                      disabled={!fulfilment}
                      className="w-full py-4 bg-brand-yellow text-black font-black rounded-xl hover:bg-yellow-300 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Continue <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── STEP: PAYMENT ─────────────────────────────────────── */}
          {step === 'payment' && (
            <motion.div key="payment" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.2 }}>
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-3">
                  <p className="text-neutral-400 text-sm mb-5">Choose how you'd like to pay</p>
                  {PAYMENT_OPTIONS.map(({ key, label, desc, icon: Icon }) => (
                    <button
                      key={key}
                      onClick={() => setPayment(key)}
                      className={`w-full text-left p-5 rounded-2xl border-2 transition-all ${
                        payment === key
                          ? 'border-brand-yellow bg-brand-yellow/8'
                          : 'border-neutral-800 bg-neutral-900/50 hover:border-neutral-700'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                          payment === key ? 'bg-brand-yellow/20' : 'bg-neutral-800'
                        }`}>
                          <Icon className={`w-5 h-5 ${payment === key ? 'text-brand-yellow' : 'text-neutral-400'}`} />
                        </div>
                        <div className="flex-1">
                          <p className="font-black text-white">{label}</p>
                          <p className="text-neutral-500 text-sm mt-0.5">{desc}</p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                          payment === key ? 'border-brand-yellow bg-brand-yellow' : 'border-neutral-700'
                        }`}>
                          {payment === key && <div className="w-2 h-2 rounded-full bg-black" />}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="lg:col-span-1">
                  <div className="sticky top-24 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6">
                    <h3 className="font-black text-white text-base mb-3">Order Summary</h3>
                    <div className="space-y-1.5 mb-3">
                      {cart.map(item => (
                        <div key={item.product.id} className="flex justify-between text-xs">
                          <span className="text-neutral-500 truncate mr-2">{item.product.name} ×{item.qty}</span>
                          <span className="text-neutral-300 flex-shrink-0">{item.product.price > 0 ? fmt(item.product.price * item.qty) : 'TBD'}</span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-neutral-800 pt-3 mb-5">
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-400 text-sm">Total</span>
                        <span className="text-xl font-black text-brand-yellow">{cartTotal > 0 ? fmt(cartTotal) : 'TBD'}</span>
                      </div>
                    </div>
                    <button
                      onClick={placeOrder}
                      disabled={!payment || placing}
                      className="w-full py-4 bg-brand-yellow text-black font-black rounded-xl hover:bg-yellow-300 transition-all text-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {placing ? <><Loader2 className="w-4 h-4 animate-spin" /> Placing…</> : 'Place Order'}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── STEP: DONE ────────────────────────────────────────── */}
          {step === 'done' && (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="text-center py-16 sm:py-24"
            >
              <motion.div
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 12, delay: 0.1 }}
                className="w-24 h-24 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto mb-7"
              >
                <CheckCircle className="w-12 h-12 text-green-400" />
              </motion.div>
              <h1 className="text-4xl sm:text-5xl font-black text-white mb-3">Order Placed!</h1>
              <p className="text-neutral-400 text-lg mb-8">Our team will contact you shortly to confirm.</p>
              <div className="inline-flex flex-col items-center bg-brand-yellow/10 border border-brand-yellow/30 rounded-2xl px-8 py-5 mb-8">
                <p className="text-xs text-neutral-500 mb-1">Order Reference</p>
                <p className="font-black text-brand-yellow font-mono text-2xl">{orderRef}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => navigate('/')}
                  className="px-8 py-4 bg-brand-yellow text-black font-black rounded-xl hover:bg-yellow-300 transition-all flex items-center justify-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" /> Back to Home
                </button>
                <a
                  href="tel:0775785785"
                  className="px-8 py-4 border border-neutral-700 text-white font-bold rounded-xl hover:border-neutral-500 transition-all text-sm"
                >
                  Call Us — 077 578 5785
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
