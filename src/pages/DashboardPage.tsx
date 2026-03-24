import React, { useState, useEffect } from 'react';
import { Layout } from '../components/layout/Layout';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import {
  collection, doc, addDoc, updateDoc, deleteDoc,
  onSnapshot, query, orderBy, serverTimestamp,
} from 'firebase/firestore';
import {
  Car, Calendar, Package, Bell, Plus, Edit2, Trash2,
  Clock, CheckCircle, AlertCircle, Download, User,
  Shield, X, Loader2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Types ─────────────────────────────────────────────────────────
interface Vehicle {
  id: string;
  plate: string;
  make: string;
  model: string;
  year: string;
  tyreSize: string;
  insuranceExpiry: string;
  revenueExpiry: string;
}

interface Appointment {
  id: string;
  date: string;
  time: string;
  branch: string;
  services: string[];
  status: 'upcoming' | 'completed' | 'cancelled';
  bookingId: string;
}

interface Order {
  id: string;
  date: string;
  items: { name: string; size: string; qty: number; price: number }[];
  total: number;
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
  fulfilment: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function daysUntil(d: string) {
  if (!d) return 999;
  const diff = new Date(d).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function ExpiryBadge({ date, label }: { date: string; label: string }) {
  const days = daysUntil(date);
  const color = days < 0 ? 'red' : days < 30 ? 'yellow' : 'green';
  const colorMap = {
    red: 'text-red-400 bg-red-500/10 border-red-500/20',
    yellow: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
    green: 'text-green-400 bg-green-500/10 border-green-500/20',
  };
  return (
    <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border text-xs font-medium ${colorMap[color]}`}>
      <Shield className="w-3 h-3" />
      <span>
        {label}: {days < 0 ? `Expired ${Math.abs(days)}d ago` : days < 30 ? `${days}d left` : formatDate(date)}
      </span>
    </div>
  );
}

// ─── Vehicles Tab ─────────────────────────────────────────────────────────────
function VehiclesTab({ uid }: { uid: string }) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Vehicle>>({});

  // Real-time listener for this user's vehicles
  useEffect(() => {
    const col = collection(db, 'users', uid, 'vehicles');
    const q = query(col, orderBy('createdAt', 'asc'));
    const unsub = onSnapshot(q, snap => {
      setVehicles(snap.docs.map(d => ({ id: d.id, ...d.data() } as Vehicle)));
      setLoading(false);
    });
    return () => unsub();
  }, [uid]);

  const openAdd = () => { setForm({}); setEditId(null); setShowForm(true); };
  const openEdit = (v: Vehicle) => { setForm(v); setEditId(v.id); setShowForm(true); };

  const deleteVehicle = async (id: string) => {
    if (!confirm('Delete this vehicle?')) return;
    await deleteDoc(doc(db, 'users', uid, 'vehicles', id));
  };

  const saveVehicle = async () => {
    if (!form.plate || !form.make || !form.model) return;
    setSaving(true);
    try {
      if (editId) {
        const { id, ...data } = form as Vehicle;
        await updateDoc(doc(db, 'users', uid, 'vehicles', editId), data);
      } else {
        await addDoc(collection(db, 'users', uid, 'vehicles'), {
          ...form,
          createdAt: serverTimestamp(),
        });
      }
      setShowForm(false);
    } finally {
      setSaving(false);
    }
  };

  const FIELDS = [
    { key: 'plate',           label: 'Plate Number',    placeholder: 'CAB-1234' },
    { key: 'make',            label: 'Make',            placeholder: 'Toyota' },
    { key: 'model',           label: 'Model',           placeholder: 'Aqua' },
    { key: 'year',            label: 'Year',            placeholder: '2020' },
    { key: 'tyreSize',        label: 'Tyre Size',       placeholder: '185/65R15' },
    { key: 'insuranceExpiry', label: 'Insurance Expiry',placeholder: '',          type: 'date' },
    { key: 'revenueExpiry',   label: 'Revenue Expiry',  placeholder: '',          type: 'date' },
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-white">My Vehicles</h3>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 bg-brand-yellow text-black font-bold rounded-lg hover:bg-yellow-300 transition-all text-sm"
        >
          <Plus className="w-4 h-4" /> Add Vehicle
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-neutral-800 border border-white/10 rounded-xl p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-bold text-white">{editId ? 'Edit Vehicle' : 'Add New Vehicle'}</h4>
              <button onClick={() => setShowForm(false)} className="text-neutral-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {FIELDS.map(f => (
                <div key={f.key}>
                  <label className="block text-xs text-neutral-400 mb-1.5 font-medium">{f.label}</label>
                  <input
                    type={f.type || 'text'}
                    value={(form as any)[f.key] || ''}
                    onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                    placeholder={f.placeholder}
                    className="w-full bg-neutral-900 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-brand-yellow transition-all"
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 py-2.5 border border-white/20 text-white font-bold rounded-lg hover:bg-white/5 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={saveVehicle}
                disabled={saving}
                className="flex-1 py-2.5 bg-brand-yellow text-black font-bold rounded-lg hover:bg-yellow-300 text-sm disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {saving ? 'Saving…' : 'Save Vehicle'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {vehicles.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-white/10 rounded-xl">
          <Car className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
          <p className="text-neutral-500">No vehicles added yet</p>
          <button onClick={openAdd} className="mt-4 text-brand-yellow text-sm hover:underline">
            + Add your first vehicle
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {vehicles.map(v => (
            <motion.div
              key={v.id}
              layout
              className="bg-neutral-800/60 border border-white/5 rounded-xl p-5 hover:border-white/10 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-brand-yellow/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Car className="w-6 h-6 text-brand-yellow" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-black text-white text-lg">{v.plate}</h4>
                      {v.tyreSize && (
                        <span className="text-xs font-mono bg-white/5 border border-white/10 px-2 py-0.5 rounded text-neutral-400">
                          {v.tyreSize}
                        </span>
                      )}
                    </div>
                    <p className="text-neutral-400 text-sm">
                      {v.year} {v.make} {v.model}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEdit(v)}
                    className="p-2 rounded-lg hover:bg-white/10 text-neutral-500 hover:text-white transition-all"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteVehicle(v.id)}
                    className="p-2 rounded-lg hover:bg-red-500/10 text-neutral-500 hover:text-red-400 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {(v.insuranceExpiry || v.revenueExpiry) && (
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-white/5">
                  {v.insuranceExpiry && <ExpiryBadge date={v.insuranceExpiry} label="Insurance" />}
                  {v.revenueExpiry && <ExpiryBadge date={v.revenueExpiry} label="Revenue" />}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Appointments Tab ─────────────────────────────────────────────────────────
function AppointmentsTab({ uid }: { uid: string }) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed'>('all');

  useEffect(() => {
    const col = collection(db, 'users', uid, 'appointments');
    const q = query(col, orderBy('date', 'desc'));
    const unsub = onSnapshot(q, snap => {
      setAppointments(snap.docs.map(d => ({ id: d.id, ...d.data() } as Appointment)));
      setLoading(false);
    });
    return () => unsub();
  }, [uid]);

  const filtered = appointments.filter(a => filter === 'all' || a.status === filter);

  const statusConfig = {
    upcoming:  { label: 'Upcoming',  color: 'text-brand-yellow bg-brand-yellow/10 border-brand-yellow/20', icon: Clock },
    completed: { label: 'Completed', color: 'text-green-400 bg-green-500/10 border-green-500/20',          icon: CheckCircle },
    cancelled: { label: 'Cancelled', color: 'text-red-400 bg-red-500/10 border-red-500/20',                icon: AlertCircle },
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h3 className="text-xl font-bold text-white">Appointments</h3>
        <div className="flex gap-2">
          {(['all', 'upcoming', 'completed'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                filter === f ? 'bg-brand-yellow text-black' : 'bg-white/5 text-neutral-400 hover:bg-white/10'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-white/10 rounded-xl">
          <Calendar className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
          <p className="text-neutral-500">
            {appointments.length === 0 ? 'No appointments yet' : 'No appointments match this filter'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(appt => {
            const cfg = statusConfig[appt.status];
            const Icon = cfg.icon;
            return (
              <div
                key={appt.id}
                className="bg-neutral-800/60 border border-white/5 rounded-xl p-5 hover:border-white/10 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white/5 rounded-xl flex flex-col items-center justify-center flex-shrink-0 border border-white/10">
                      <span className="text-brand-yellow font-black text-sm">{new Date(appt.date).getDate()}</span>
                      <span className="text-neutral-500 text-[10px]">
                        {new Date(appt.date).toLocaleString('en', { month: 'short' })}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-white">{appt.branch}</h4>
                        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium flex items-center gap-1 ${cfg.color}`}>
                          <Icon className="w-3 h-3" /> {cfg.label}
                        </span>
                      </div>
                      <p className="text-neutral-400 text-sm mb-2">
                        {appt.time} • {appt.services?.join(', ')}
                      </p>
                      <p className="text-xs font-mono text-neutral-600">Booking #{appt.bookingId}</p>
                    </div>
                  </div>
                  {appt.status === 'completed' && (
                    <button className="flex items-center gap-1.5 text-xs text-brand-yellow hover:text-yellow-300 transition-colors">
                      <Download className="w-3.5 h-3.5" /> Invoice
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Orders Tab ───────────────────────────────────────────────────────────────
function OrdersTab({ uid }: { uid: string }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const col = collection(db, 'users', uid, 'orders');
    const q = query(col, orderBy('date', 'desc'));
    const unsub = onSnapshot(q, snap => {
      setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() } as Order)));
      setLoading(false);
    });
    return () => unsub();
  }, [uid]);

  const statusConfig = {
    pending:   { label: 'Pending',   color: 'text-gray-400 bg-gray-500/10 border-gray-500/20' },
    confirmed: { label: 'Confirmed', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
    delivered: { label: 'Delivered', color: 'text-green-400 bg-green-500/10 border-green-500/20' },
    cancelled: { label: 'Cancelled', color: 'text-red-400 bg-red-500/10 border-red-500/20' },
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-white">Order History</h3>
      {orders.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-white/10 rounded-xl">
          <Package className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
          <p className="text-neutral-500">No orders yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map(order => {
            const cfg = statusConfig[order.status];
            return (
              <div
                key={order.id}
                className="bg-neutral-800/60 border border-white/5 rounded-xl p-5 hover:border-white/10 transition-all"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-white text-sm font-mono">#{order.id.toUpperCase()}</h4>
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${cfg.color}`}>
                        {cfg.label}
                      </span>
                    </div>
                    <p className="text-neutral-500 text-xs">{formatDate(order.date)} • {order.fulfilment}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-brand-yellow text-lg">Rs. {order.total.toLocaleString()}</p>
                    <button className="text-xs text-neutral-500 hover:text-white flex items-center gap-1 ml-auto mt-1">
                      <Download className="w-3 h-3" /> Invoice
                    </button>
                  </div>
                </div>
                <div className="space-y-2 border-t border-white/5 pt-4">
                  {order.items?.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-neutral-400">
                        {item.name}{' '}
                        <span className="font-mono text-brand-yellow/70">{item.size}</span> ×{item.qty}
                      </span>
                      <span className="text-white">Rs. {(item.price * item.qty).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Loading Spinner ──────────────────────────────────────────────────────────
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="w-8 h-8 text-brand-yellow animate-spin" />
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'vehicles' | 'appointments' | 'orders'>('vehicles');

  // Not logged in
  if (!user) {
    return (
      <Layout>
        <div className="min-h-screen bg-black flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 bg-brand-yellow/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <User className="w-10 h-10 text-brand-yellow" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Sign In Required</h2>
            <p className="text-neutral-500 mb-8">Please sign in to access your personal dashboard</p>
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-4 bg-brand-yellow text-black font-black rounded-xl hover:bg-yellow-300 transition-all"
            >
              Sign In
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const tabs = [
    { id: 'vehicles',     label: 'Vehicles',     icon: Car },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'orders',       label: 'Orders',       icon: Package },
  ] as const;

  return (
    <Layout>
      {/* Header */}
      <div className="bg-black border-b border-white/5 pt-10 pb-0 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">

          {/* Welcome row */}
          <div className="flex items-center gap-4 mb-8">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt="avatar"
                className="w-14 h-14 rounded-full object-cover ring-2 ring-brand-yellow/30"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-brand-yellow/20 flex items-center justify-center ring-2 ring-brand-yellow/30">
                <User className="w-7 h-7 text-brand-yellow" />
              </div>
            )}
            <div>
              <p className="text-neutral-500 text-sm">Welcome back,</p>
              <h1 className="text-2xl font-black text-white">{user.displayName || user.email}</h1>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 border-b border-white/5">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-5 py-3 text-sm font-bold transition-all ${
                  activeTab === tab.id ? 'text-white' : 'text-neutral-500 hover:text-white'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-yellow"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-black min-h-screen px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'vehicles'     && <VehiclesTab     uid={user.uid} />}
              {activeTab === 'appointments' && <AppointmentsTab uid={user.uid} />}
              {activeTab === 'orders'       && <OrdersTab       uid={user.uid} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </Layout>
  );
}