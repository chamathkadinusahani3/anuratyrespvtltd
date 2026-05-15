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
  Car, Calendar, Package, Plus, Edit2, Trash2,
  Clock, CheckCircle, AlertCircle, Download, User,
  Shield, X, Loader2, Truck, Bus, Bike,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── SL Plate helpers ─────────────────────────────────────────────────────────
const SL_PLATE_PATTERNS: RegExp[] = [
  /^[A-Z]{2,3}\s[A-Z]{3}-\d{4}$/,
  /^[A-Z]{2,3}\s[A-Z]{2}-\d{4}$/,
  /^\d{2}-\d{4}$/,
  /^\d{1,2}\sශ්\u200dරී\s\d{4}$/,
];

export const validateSLPlate = (value: string): boolean => {
  if (!value.trim()) return true;
  return SL_PLATE_PATTERNS.some(p => p.test(value.trim()));
};

export const formatPlate = (raw: string): { formatted: string; maxLength: number } => {
  if (/ශ/.test(raw)) return { formatted: raw, maxLength: 9 };
  const up = raw.toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (/^\d/.test(up)) {
    const digits = up.replace(/\D/g, '');
    const formatted = digits.length > 2 ? `${digits.slice(0, 2)}-${digits.slice(2, 6)}` : digits;
    return { formatted, maxLength: 7 };
  }
  const letters = up.replace(/\d/g, '');
  const digits  = up.replace(/\D/g, '');
  if (letters.length <= 2) {
    const province = letters.slice(0, 2);
    if (up.length <= 2) return { formatted: province, maxLength: 10 };
    if (digits.length === 0) return { formatted: province, maxLength: 10 };
    return { formatted: `${province} ${letters.slice(2)}-${digits.slice(0,4)}`.replace(/\s$/, ''), maxLength: 10 };
  }
  const province = letters.slice(0, 2);
  const series   = letters.slice(2, 5);
  const is3Letter = letters.length >= 5 || (letters.length === 4 && digits.length > 0);
  if (series.length === 0) return { formatted: province, maxLength: 11 };
  const formatted = digits.length > 0 ? `${province} ${series}-${digits.slice(0, 4)}` : `${province} ${series}`;
  return { formatted, maxLength: is3Letter ? 11 : 10 };
};

const PLATE_FORMATS = [
  { label: 'Modern 3-Letter', example: 'WP CBA-1234' },
  { label: 'Modern 2-Letter', example: 'WP GA-1234'  },
  { label: 'Historical',      example: '19-1234'      },
  { label: 'Sri Series',      example: '15 ශ්\u200dරී 1234' },
];

// ─── Vehicle Types ────────────────────────────────────────────────────────────
type TyreFormat = 'standard' | 'commercial';

interface VehicleType {
  value: string;
  label: string;
  emoji: string;
  format: TyreFormat;
}

const VEHICLE_TYPES: VehicleType[] = [
  { value: 'car',        label: 'Car',        emoji: '🚗', format: 'standard'   },
  { value: 'suv',        label: 'SUV',        emoji: '🚙', format: 'standard'   },
  { value: 'van',        label: 'Van',        emoji: '🚐', format: 'commercial' },
  { value: 'pickup',     label: 'Pickup',     emoji: '🛻', format: 'standard' },
  { value: 'bus',        label: 'Bus',        emoji: '🚌', format: 'standard' },
  { value: 'lorry',      label: 'Lorry',      emoji: '🚚', format: 'standard' },
  { value: 'motorcycle', label: 'Motorcycle', emoji: '🏍️', format: 'standard'   },
  { value: 'three_wheel',label: 'Three Wheel',emoji: '🛺', format: 'standard'   },
];

// ─── Tyre Data ────────────────────────────────────────────────────────────────
const TYRE_WIDTHS    = ['125','135','145','155','165','175','185','195','205','215','225','235','245','255','265','275','285','295','305'];
const TYRE_PROFILES  = ['30','35','40','45','50','55','60','65','70','75','80'];
const TYRE_DIAMETERS = ['12','13','14','15','16','17','18','19','20','21','22'];

// ─── Types ────────────────────────────────────────────────────────────────────
interface Vehicle {
  id: string;
  plate: string;
  vehicleType: string;
  make: string;
  model: string;
  year: string;
  tyreSize: string;
  insuranceExpiry: string;
  revenueExpiry: string;
  importedFromRegistration?: boolean;
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

// ─── Form Errors ──────────────────────────────────────────────────────────────
interface FormErrors {
  plate?: string;
  vehicleType?: string;
  make?: string;
  model?: string;
  year?: string;
  tyreSize?: string;
  insuranceExpiry?: string;
  revenueExpiry?: string;
  general?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function daysUntil(d: string) {
  if (!d) return 999;
  return Math.ceil((new Date(d).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

function ExpiryBadge({ date, label }: { date: string; label: string }) {
  const days = daysUntil(date);
  const color = days < 0 ? 'red' : days < 30 ? 'yellow' : 'green';
  const colorMap = {
    red:    'text-red-400 bg-red-500/10 border-red-500/20',
    yellow: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
    green:  'text-green-400 bg-green-500/10 border-green-500/20',
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

// ─── Field Error Message ──────────────────────────────────────────────────────
function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
      <AlertCircle className="w-3 h-3 flex-shrink-0" />
      {message}
    </p>
  );
}

// ─── Vehicles Tab ─────────────────────────────────────────────────────────────
function VehiclesTab({ uid }: { uid: string }) {
  const [vehicles, setVehicles]   = useState<Vehicle[]>([]);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [showForm, setShowForm]   = useState(false);
  const [editId, setEditId]       = useState<string | null>(null);
  const [form, setForm]           = useState<Partial<Vehicle>>({});
  const [errors, setErrors]       = useState<FormErrors>({});
  const [saveSuccess, setSaveSuccess] = useState(false);

  const importAttempted = React.useRef(false);

  const [tyreParts, setTyreParts] = useState({ width: '', profile: '', diameter: '' });

  // Derived: is the selected vehicle type commercial?
  const selectedVehicleType = VEHICLE_TYPES.find(v => v.value === form.vehicleType);
  const isCommercial = selectedVehicleType?.format === 'commercial';

  useEffect(() => {
    const col = collection(db, 'users', uid, 'vehicles');
    const q   = query(col);
    const unsub = onSnapshot(q,
      async snap => {
        const docs = snap.docs.map(d => ({ id: d.id, ...d.data() } as Vehicle));
        setVehicles(docs);
        setLoading(false);

        if (docs.length === 0 && !importAttempted.current) {
          importAttempted.current = true;
          try {
            const raw = localStorage.getItem(`at_profile_${uid}`);
            if (raw) {
              const profile = JSON.parse(raw) as { vehiclePlate?: string };
              const plate = (profile.vehiclePlate ?? '').trim().toUpperCase();
              if (plate) {
                await addDoc(col, {
                  plate,
                  vehicleType: '',
                  make: '', model: '', year: '',
                  tyreSize: '', insuranceExpiry: '', revenueExpiry: '',
                  importedFromRegistration: true,
                  createdAt: serverTimestamp(),
                });
                profile.vehiclePlate = '';
                localStorage.setItem(`at_profile_${uid}`, JSON.stringify(profile));
              }
            }
          } catch (err) {
            console.warn('Vehicle auto-import failed:', err);
          }
        }
      },
      (error) => {
        console.error('Firestore vehicles snapshot error:', error.code, error.message);
        setLoading(false);
        setErrors({ general: 'Failed to load vehicles. Please refresh the page.' });
      }
    );
    return () => unsub();
  }, [uid]);

  // Reset tyre parts when vehicle type changes (standard ↔ commercial)
  useEffect(() => {
    setTyreParts({ width: '', profile: '', diameter: '' });
    setForm(f => ({ ...f, tyreSize: '' }));
  }, [form.vehicleType]);

  const parseTyreSize = (size: string, commercial: boolean) => {
    if (commercial) {
      const match = (size ?? '').match(/^(\d{3})R(\d{2})$/);
      return match
        ? { width: match[1], profile: '', diameter: match[2] }
        : { width: '', profile: '', diameter: '' };
    }
    const match = (size ?? '').match(/^(\d{3})\/(\d{2,3})R(\d{2})$/);
    return match
      ? { width: match[1], profile: match[2], diameter: match[3] }
      : { width: '', profile: '', diameter: '' };
  };

  const openAdd = () => {
    setForm({});
    setEditId(null);
    setTyreParts({ width: '', profile: '', diameter: '' });
    setErrors({});
    setSaveSuccess(false);
    setShowForm(true);
  };

  const openEdit = (v: Vehicle) => {
    const vType  = VEHICLE_TYPES.find(t => t.value === v.vehicleType);
    const isComm = vType?.format === 'commercial';
    setForm(v);
    setEditId(v.id);
    setTyreParts(parseTyreSize(v.tyreSize ?? '', isComm));
    setErrors({});
    setSaveSuccess(false);
    setShowForm(true);
  };

  const deleteVehicle = async (id: string) => {
    if (!confirm('Delete this vehicle?')) return;
    try {
      await deleteDoc(doc(db, 'users', uid, 'vehicles', id));
    } catch {
      setErrors({ general: 'Failed to delete vehicle. Please try again.' });
    }
  };

  // ── Validation ───────────────────────────────────────────────────────────────
  // ─── Validation — all fields required ────────────────────────────────────────
const validate = (): FormErrors => {
  const e: FormErrors = {};

  // Plate
  if (!form.plate?.trim()) {
    e.plate = 'Vehicle plate is required.';
  } else if (!validateSLPlate(form.plate)) {
    e.plate = 'Invalid Sri Lankan plate format. E.g. WP CBA-1234 or 19-1234';
  }

  // Vehicle type
  if (!form.vehicleType) {
    e.vehicleType = 'Please select a vehicle type.';
  }

  // Make
  if (!form.make?.trim()) {
    e.make = 'Make is required. E.g. TOYOTA';
  }

  // Model
  if (!form.model?.trim()) {
    e.model = 'Model is required. E.g. AQUA';
  }

  // Year
  if (!form.year?.trim()) {
    e.year = 'Year is required.';
  } else {
    const y = parseInt(form.year, 10);
    const currentYear = new Date().getFullYear();
    if (isNaN(y) || y < 1950 || y > currentYear + 1) {
      e.year = `Year must be between 1950 and ${currentYear + 1}.`;
    }
  }

  // Insurance expiry
  if (!form.insuranceExpiry) {
    e.insuranceExpiry = 'Insurance expiry date is required.';
  }

  // Revenue expiry
  if (!form.revenueExpiry) {
    e.revenueExpiry = 'Revenue expiry date is required.';
  }

  // Tyre size — required, and must be fully selected
  if (!form.tyreSize) {
    e.tyreSize = isCommercial
      ? 'Tyre size is required. Select Width and Rim diameter.'
      : 'Tyre size is required. Select Width, Profile, and Rim diameter.';
  }

  return e;
};


  const saveVehicle = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSaving(true);
    setErrors({});

    const normalized = {
      ...form,
      plate:       (form.plate       ?? '').trim().toUpperCase(),
      vehicleType: (form.vehicleType ?? '').trim(),
      make:        (form.make        ?? '').trim().toUpperCase(),
      model:       (form.model       ?? '').trim().toUpperCase(),
      tyreSize:    (form.tyreSize    ?? '').trim().toUpperCase(),
      year:        (form.year        ?? '').trim(),
    };

    try {
      if (editId) {
        const { id, ...data } = normalized as Vehicle;
        await updateDoc(doc(db, 'users', uid, 'vehicles', editId), {
          ...data,
          importedFromRegistration: false,
        });
      } else {
        await addDoc(collection(db, 'users', uid, 'vehicles'), {
          ...normalized,
          importedFromRegistration: false,
          createdAt: serverTimestamp(),
        });
      }
      setSaveSuccess(true);
      setTimeout(() => {
        setShowForm(false);
        setSaveSuccess(false);
      }, 800);
    } catch (err: any) {
      setErrors({ general: err?.message ?? 'Failed to save vehicle. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handleTyreChange = (part: 'width' | 'profile' | 'diameter', value: string) => {
    setTyreParts(prev => {
      const next = { ...prev, [part]: value };
      const built = isCommercial
        ? (next.width && next.diameter ? `${next.width}R${next.diameter}` : '')
        : (next.width && next.profile && next.diameter ? `${next.width}/${next.profile}R${next.diameter}` : '');
      setForm(f => ({ ...f, tyreSize: built }));
      // Clear tyre error once user starts selecting
      if (value) setErrors(e => ({ ...e, tyreSize: undefined }));
      return next;
    });
  };

  const handlePlateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (/ශ/.test(raw)) { setForm(prev => ({ ...prev, plate: raw })); return; }
    const { formatted } = formatPlate(raw);
    setForm(prev => ({ ...prev, plate: formatted }));
    setErrors(prev => ({ ...prev, plate: undefined }));
  };

  const selectCls = (hasError?: boolean) =>
    `w-full bg-neutral-900 border rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-brand-yellow transition-all appearance-none cursor-pointer ${
      hasError ? 'border-red-500/60' : 'border-white/10'
    }`;

 // ─── Field labels — add * to all ─────────────────────────────────────────────
const SIMPLE_FIELDS: { key: keyof Vehicle; label: string; placeholder: string; type?: string }[] = [
  { key: 'make',            label: 'Make *',             placeholder: 'TOYOTA' },
  { key: 'model',           label: 'Model *',            placeholder: 'AQUA' },
  { key: 'year',            label: 'Year *',             placeholder: '2020' },
  { key: 'insuranceExpiry', label: 'Insurance Expiry *', placeholder: '', type: 'date' },
  { key: 'revenueExpiry',   label: 'Revenue Expiry *',   placeholder: '', type: 'date' },
];

  if (loading) return <LoadingSpinner />;

  return (
    
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-1">
  <h4 className="font-bold text-white">{editId ? 'Edit Vehicle' : 'Add New Vehicle'}</h4>
  <button onClick={() => setShowForm(false)} className="text-neutral-400 hover:text-white">
    <X className="w-4 h-4" />
  </button>
</div>
<p className="text-[11px] text-neutral-600 mb-4">
  All fields marked <span className="text-red-400">*</span> are required.
</p>
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-white">My Vehicles</h3>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 bg-brand-yellow text-black font-bold rounded-lg hover:bg-yellow-300 transition-all text-sm"
        >
          <Plus className="w-4 h-4" /> Add Vehicle
        </button>
      </div>

      {/* Global error banner */}
      {errors.general && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm"
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errors.general}</span>
          <button onClick={() => setErrors(e => ({ ...e, general: undefined }))} className="ml-auto">
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      {/* Add / Edit form */}
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

              {/* ── Vehicle Plate ── */}
              <div className="sm:col-span-2">
                <label className="block text-xs text-neutral-400 mb-1.5 font-medium uppercase tracking-wider">
                  Vehicle Plate <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Car className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
                  <input
                    type="text"
                    inputMode={/^\d/.test(form.plate ?? '') && !/ශ/.test(form.plate ?? '') ? 'numeric' : 'text'}
                    value={form.plate ?? ''}
                    onChange={handlePlateChange}
                    placeholder="e.g. WP CBA-1234"
                    maxLength={formatPlate(form.plate ?? '').maxLength}
                    autoComplete="off"
                    className={`w-full bg-neutral-900 border rounded-lg pl-10 pr-10 py-2.5 text-white text-sm font-mono placeholder-neutral-700 focus:outline-none transition-all
                      ${errors.plate
                        ? 'border-red-500/60 focus:border-red-400'
                        : form.plate
                          ? validateSLPlate(form.plate)
                            ? 'border-green-500/50 focus:border-green-400'
                            : 'border-red-500/50 focus:border-red-400'
                          : 'border-white/10 focus:border-brand-yellow'
                      }`}
                    style={{ textTransform: /ශ/.test(form.plate ?? '') ? 'none' : 'uppercase' }}
                  />
                  {form.plate && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {validateSLPlate(form.plate)
                        ? <CheckCircle className="w-4 h-4 text-green-400" />
                        : <AlertCircle className="w-4 h-4 text-red-400" />
                      }
                    </div>
                  )}
                </div>
                {/* Format quick-pick */}
                <div className="mt-2.5 grid grid-cols-2 gap-1">
                  {PLATE_FORMATS.map(fmt => (
                    <div
                      key={fmt.example}
                      className="text-left px-2.5 py-1.5 rounded-lg border border-white/8 bg-white/[0.02]"
                    >
                      <span className="block text-[9px] text-neutral-600 uppercase tracking-wider mb-0.5">{fmt.label}</span>
                      <span className="block text-[11px] font-mono text-neutral-500">{fmt.example}</span>
                    </div>
                  ))}
                </div>
                <FieldError message={errors.plate} />
              </div>

              {/* ── Vehicle Type ── */}
              <div className="sm:col-span-2">
                <label className="block text-xs text-neutral-400 mb-1.5 font-medium uppercase tracking-wider">
                  Vehicle Type <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {VEHICLE_TYPES.map(v => (
                    <button
                      key={v.value}
                      type="button"
                      onClick={() => {
                        setForm(f => ({ ...f, vehicleType: v.value, tyreSize: '' }));
                        setErrors(e => ({ ...e, vehicleType: undefined, tyreSize: undefined }));
                      }}
                      className={`flex flex-col items-center gap-1 px-2 py-2.5 rounded-xl border text-xs font-medium transition-all
                        ${form.vehicleType === v.value
                          ? 'bg-brand-yellow/10 border-brand-yellow text-brand-yellow'
                          : errors.vehicleType
                            ? 'bg-neutral-900 border-red-500/40 text-neutral-500 hover:border-neutral-600'
                            : 'bg-neutral-900 border-white/8 text-neutral-500 hover:border-neutral-600 hover:text-neutral-300'
                        }`}
                    >
                      <span className="text-lg leading-none">{v.emoji}</span>
                      <span className="text-[10px]">{v.label}</span>
                    </button>
                  ))}
                </div>
                <FieldError message={errors.vehicleType} />
              </div>

              {/* ── Tyre Size — appears only after vehicle type is selected ── */}
              <AnimatePresence>
                {form.vehicleType && (
                  <motion.div
                    className="sm:col-span-2"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <label className="block text-xs text-neutral-400 mb-1.5 font-medium uppercase tracking-wider">
                      Tyre Size <span className="text-red-400">*</span>   {/* ← add this */}
                      {form.tyreSize && (
                        <span className="ml-2 font-mono text-brand-yellow normal-case tracking-normal">
                          {form.tyreSize}
                        </span>
                      )}
                      {selectedVehicleType && (
                        <span className="ml-2 text-neutral-600 normal-case tracking-normal font-normal">
                          ({isCommercial ? 'Commercial format' : 'Standard format'})
                        </span>
                      )}
                    </label>

                    <div className={`grid gap-2 ${isCommercial ? 'grid-cols-2' : 'grid-cols-3'}`}>
                      {/* Width */}
                      <div className="relative">
                        <select
                          value={tyreParts.width}
                          onChange={e => handleTyreChange('width', e.target.value)}
                          className={selectCls(!!errors.tyreSize && !tyreParts.width)}
                        >
                          <option value="">Width</option>
                          {TYRE_WIDTHS.map(w => <option key={w} value={w}>{w}</option>)}
                        </select>
                        <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2">
                          <svg className="w-3.5 h-3.5 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>

                      {/* Profile — standard only */}
                      {!isCommercial && (
                        <div className="relative">
                          <select
                            value={tyreParts.profile}
                            onChange={e => handleTyreChange('profile', e.target.value)}
                            className={selectCls(!!errors.tyreSize && !tyreParts.profile)}
                          >
                            <option value="">Profile</option>
                            {TYRE_PROFILES.map(p => <option key={p} value={p}>{p}</option>)}
                          </select>
                          <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2">
                            <svg className="w-3.5 h-3.5 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      )}

                      {/* Diameter */}
                      <div className="relative">
                        <select
                          value={tyreParts.diameter}
                          onChange={e => handleTyreChange('diameter', e.target.value)}
                          className={selectCls(!!errors.tyreSize && !tyreParts.diameter)}
                        >
                          <option value="">Rim (R)</option>
                          {TYRE_DIAMETERS.map(d => <option key={d} value={d}>R{d}</option>)}
                        </select>
                        <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2">
                          <svg className="w-3.5 h-3.5 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Format hint */}
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <span className="text-[10px] text-neutral-600">Format:</span>
                      <span className="text-[10px] font-mono text-neutral-500">
                        {isCommercial ? 'WIDTH R DIAMETER' : 'WIDTH / PROFILE R DIAMETER'}
                      </span>
                      <span className="text-[10px] text-neutral-700 ml-auto">
                        {isCommercial ? 'e.g. 195R14' : 'e.g. 185/65R15'}
                      </span>
                    </div>
                    <FieldError message={errors.tyreSize} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── Standard text / date fields ── */}
              {SIMPLE_FIELDS.map(f => (
                <div key={f.key}>
                  <label className="block text-xs text-neutral-400 mb-1.5 font-medium uppercase tracking-wider">
                    {f.label}
                  </label>
                  <input
                    type={f.type || 'text'}
                    value={(form as any)[f.key] || ''}
                    onChange={e => {
                      setForm({
                        ...form,
                        [f.key]: f.type === 'date' ? e.target.value : e.target.value.toUpperCase(),
                      });
                      setErrors(prev => ({ ...prev, [f.key]: undefined }));
                    }}
                    placeholder={f.placeholder}
                    style={f.type !== 'date' ? { textTransform: 'uppercase' } : undefined}
                    className={`w-full bg-neutral-900 border rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-brand-yellow transition-all ${
                      (errors as any)[f.key] ? 'border-red-500/60' : 'border-white/10'
                    }`}
                  />
                  <FieldError message={(errors as any)[f.key]} />
                </div>
              ))}
            </div>

            {/* Save / Cancel */}
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
                className={`flex-1 py-2.5 font-bold rounded-lg text-sm flex items-center justify-center gap-2 transition-all ${
                  saveSuccess
                    ? 'bg-green-500 text-white'
                    : 'bg-brand-yellow text-black hover:bg-yellow-300 disabled:opacity-60'
                }`}
              >
                {saving      ? <Loader2     className="w-4 h-4 animate-spin" /> : null}
                {saveSuccess ? <CheckCircle className="w-4 h-4" />             : null}
                {saving ? 'Saving…' : saveSuccess ? 'Saved!' : 'Save Vehicle'}
              </button>
            </div>

            {/* Inline form-level error */}
            {errors.general && (
              <p className="mt-3 text-xs text-red-400 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.general}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty state */}
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
          {vehicles.map(v => {
            const vType = VEHICLE_TYPES.find(t => t.value === v.vehicleType);
            return (
              <motion.div
                key={v.id}
                layout
                className="bg-neutral-800/60 border border-white/5 rounded-xl p-5 hover:border-white/10 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-brand-yellow/10 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl">
                      {vType ? vType.emoji : <Car className="w-6 h-6 text-brand-yellow" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-black text-white text-lg">{v.plate}</h4>
                        {vType && (
                          <span className="text-[10px] text-neutral-500 bg-white/5 border border-white/10 px-2 py-0.5 rounded">
                            {vType.label}
                          </span>
                        )}
                        {v.tyreSize && (
                          <span className="text-xs font-mono bg-white/5 border border-white/10 px-2 py-0.5 rounded text-neutral-400">
                            {v.tyreSize}
                          </span>
                        )}
                        {v.importedFromRegistration && !v.make && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-yellow/10 border border-brand-yellow/20 text-brand-yellow font-medium">
                            Add details ✏️
                          </span>
                        )}
                      </div>
                      {v.make || v.model || v.year ? (
                        <p className="text-neutral-400 text-sm">{[v.year, v.make, v.model].filter(Boolean).join(' ')}</p>
                      ) : (
                        <p className="text-neutral-600 text-sm italic">No details yet — click edit to fill in</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEdit(v)}
                      className="p-2 rounded-lg hover:bg-white/10 text-neutral-500 hover:text-white transition-all"
                      title="Edit vehicle"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteVehicle(v.id)}
                      className="p-2 rounded-lg hover:bg-red-500/10 text-neutral-500 hover:text-red-400 transition-all"
                      title="Delete vehicle"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {(v.insuranceExpiry || v.revenueExpiry) && (
                  <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-white/5">
                    {v.insuranceExpiry && <ExpiryBadge date={v.insuranceExpiry} label="Insurance" />}
                    {v.revenueExpiry   && <ExpiryBadge date={v.revenueExpiry}   label="Revenue"   />}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Appointments Tab ─────────────────────────────────────────────────────────
function AppointmentsTab({ uid }: { uid: string }) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState<'all' | 'upcoming' | 'completed'>('all');
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    const col = collection(db, 'users', uid, 'appointments');
    const q   = query(col, orderBy('date', 'desc'));
    const unsub = onSnapshot(q,
      snap => {
        setAppointments(snap.docs.map(d => ({ id: d.id, ...d.data() } as Appointment)));
        setLoading(false);
      },
      err => {
        setError('Failed to load appointments. Please refresh.');
        setLoading(false);
      }
    );
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
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                filter === f ? 'bg-brand-yellow text-black' : 'bg-white/5 text-neutral-400 hover:bg-white/10'
              }`}
            >{f}</button>
          ))}
        </div>
      </div>
      {error && (
        <div className="flex items-center gap-3 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}
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
            const cfg  = statusConfig[appt.status];
            const Icon = cfg.icon;
            return (
              <div key={appt.id} className="bg-neutral-800/60 border border-white/5 rounded-xl p-5 hover:border-white/10 transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white/5 rounded-xl flex flex-col items-center justify-center flex-shrink-0 border border-white/10">
                      <span className="text-brand-yellow font-black text-sm">{new Date(appt.date).getDate()}</span>
                      <span className="text-neutral-500 text-[10px]">{new Date(appt.date).toLocaleString('en', { month: 'short' })}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-white">{appt.branch}</h4>
                        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium flex items-center gap-1 ${cfg.color}`}>
                          <Icon className="w-3 h-3" /> {cfg.label}
                        </span>
                      </div>
                      <p className="text-neutral-400 text-sm mb-2">{appt.time} • {appt.services?.join(', ')}</p>
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
  const [orders, setOrders]   = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    const col = collection(db, 'users', uid, 'orders');
    const q   = query(col, orderBy('date', 'desc'));
    const unsub = onSnapshot(q,
      snap => {
        setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() } as Order)));
        setLoading(false);
      },
      err => {
        setError('Failed to load orders. Please refresh.');
        setLoading(false);
      }
    );
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
      {error && (
        <div className="flex items-center gap-3 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}
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
              <div key={order.id} className="bg-neutral-800/60 border border-white/5 rounded-xl p-5 hover:border-white/10 transition-all">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-white text-sm font-mono">#{order.id.toUpperCase()}</h4>
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${cfg.color}`}>{cfg.label}</span>
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
                        {item.name} <span className="font-mono text-brand-yellow/70">{item.size}</span> ×{item.qty}
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
            <button onClick={() => navigate('/login')} className="px-8 py-4 bg-brand-yellow text-black font-black rounded-xl hover:bg-yellow-300 transition-all">
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
      <div className="bg-black border-b border-white/5 pt-10 pb-0 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            {user.photoURL ? (
              <img src={user.photoURL} alt="avatar" className="w-14 h-14 rounded-full object-cover ring-2 ring-brand-yellow/30" />
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
                  <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-yellow" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

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