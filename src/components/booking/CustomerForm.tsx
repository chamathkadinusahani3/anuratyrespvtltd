import React, { useState, useEffect } from 'react';
import { Input } from '../ui/Input';
import { Tag, CheckCircle, AlertCircle, X, Car, Loader2 } from 'lucide-react';
import { db, auth } from "../../firebase";
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

// ─── Types ────────────────────────────────────────────────────────────────────

interface CustomerData {
  name: string;
  email: string;
  phone: string;
  vehicleNo?: string;
  discountCode?: string;
  discountInfo?: {
    type: 'corporate' | 'employee';
    companyName?: string;
    employeeName?: string;
    discount: number;
    id: string;
  } | null;
}

interface Vehicle {
  id: string;
  plate: string;
  make: string;
  model: string;
  year: string;
  tyreSize: string;
}

interface CustomerFormProps {
  data: CustomerData;
  onChange: (data: CustomerData) => void;
}

// ─── SL Plate helpers (mirrored from RegisterPage) ────────────────────────────

const SL_PLATE_PATTERNS: RegExp[] = [
  /^[A-Z]{2,3}\s[A-Z]{3}-\d{4}$/,
  /^[A-Z]{2,3}\s[A-Z]{2}-\d{4}$/,
  /^\d{2}-\d{4}$/,
  /^\d{1,2}\sශ්‍රී\s\d{4}$/,
];

const validateSLPlate = (value: string): boolean => {
  if (!value.trim()) return true;
  return SL_PLATE_PATTERNS.some(p => p.test(value.trim()));
};

const formatPlate = (raw: string): { formatted: string; maxLength: number } => {
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
    return { formatted: `${province} ${letters.slice(2)}-${digits.slice(0, 4)}`.replace(/\s$/, ''), maxLength: 10 };
  }
  const province  = letters.slice(0, 2);
  const series    = letters.slice(2, 5);
  const is3Letter = letters.length >= 5 || (letters.length === 4 && digits.length > 0);
  if (series.length === 0) return { formatted: province, maxLength: 11 };
  const formatted = digits.length > 0
    ? `${province} ${series}-${digits.slice(0, 4)}`
    : `${province} ${series}`;
  return { formatted, maxLength: is3Letter ? 11 : 10 };
};

const PLATE_FORMATS = [
  { label: 'Modern 3-Letter', example: 'WP CBA-1234' },
  { label: 'Modern 2-Letter', example: 'WP GA-1234'  },
  { label: 'Historical',      example: '19-1234'      },
  { label: 'Sri Series',      example: '15 ශ්‍රී 1234'  },
];

// ─── Isolated manual plate input ──────────────────────────────────────────────
// Has its own local display state so the SL formatter can work freely,
// while calling onConfirm(plate) to bubble the value up to the parent.

function ManualPlateInput({ onConfirm }: { onConfirm: (plate: string) => void }) {
  const [raw, setRaw] = useState('');

  const { maxLength } = formatPlate(raw);
  const plateValid    = validateSLPlate(raw);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/ශ/.test(value)) {
      setRaw(value);
      onConfirm(value);
      return;
    }
    const { formatted } = formatPlate(value);
    setRaw(formatted);
    onConfirm(formatted);
  };

  const pickFormat = (example: string) => {
    setRaw(example);
    onConfirm(example);
  };

  return (
    <div className="mt-3 space-y-2">
      {/* Text input */}
      <div className="relative">
        <Car className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
        <input
          type="text"
          inputMode={/^\d/.test(raw) && !/ශ/.test(raw) ? 'numeric' : 'text'}
          value={raw}
          onChange={handleChange}
          placeholder="e.g. WP CBA-1234"
          maxLength={maxLength}
          autoFocus
          autoComplete="off"
          className={`w-full bg-neutral-800 border rounded-lg pl-10 pr-10 py-2.5 text-white text-sm font-mono
            placeholder:text-neutral-600 focus:outline-none transition-colors
            ${raw
              ? plateValid
                ? 'border-green-500/50 focus:border-green-400'
                : 'border-red-500/50 focus:border-red-400'
              : 'border-neutral-700 focus:border-brand-yellow'
            }`}
          style={{ textTransform: /ශ/.test(raw) ? 'none' : 'uppercase' }}
        />
        {raw && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {plateValid
              ? <CheckCircle className="w-4 h-4 text-green-400" />
              : <AlertCircle className="w-4 h-4 text-red-400" />
            }
          </div>
        )}
      </div>

      {/* Invalid hint */}
      {raw && !plateValid && (
        <p className="text-xs text-red-400 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" /> Invalid Sri Lankan plate format
        </p>
      )}

      {/* Format quick-pick buttons */}
      <div className="grid grid-cols-4 gap-1">
        {PLATE_FORMATS.map(fmt => (
          <button
            key={fmt.example}
            type="button"
            onClick={() => pickFormat(fmt.example)}
            className={`text-left px-2 py-1.5 rounded-lg border transition-all group
              ${raw === fmt.example
                ? 'border-brand-yellow/60 bg-brand-yellow/5'
                : 'border-white/[0.08] hover:border-white/20 bg-white/[0.02]'}`}
          >
            <span className="block text-[9px] text-neutral-600 group-hover:text-neutral-500 uppercase tracking-wider mb-0.5">
              {fmt.label}
            </span>
            <span className="block text-[10px] font-mono text-neutral-400 group-hover:text-neutral-300">
              {fmt.example}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Main CustomerForm ────────────────────────────────────────────────────────

export function CustomerForm({ data, onChange }: CustomerFormProps) {
  const [discountInput, setDiscountInput]     = useState('');
  const [discountError, setDiscountError]     = useState('');
  const [vehicles, setVehicles]               = useState<Vehicle[]>([]);
  const [vehiclesLoading, setVehiclesLoading] = useState(false);
  const [profileLoading, setProfileLoading]   = useState(false);

  // Separate flag so we don't pollute vehicleNo with '__other__' sentinel
  const [manualEntry, setManualEntry] = useState(false);

  // ── Autofill from Firebase Auth + localStorage ─────────────────────────────
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    setProfileLoading(true);
    const authName  = user.displayName ?? '';
    const authEmail = user.email ?? '';
    let   phone     = '';

    try {
      const raw = localStorage.getItem(`at_profile_${user.uid}`);
      if (raw) {
        const profile = JSON.parse(raw) as { phone?: string; name?: string };
        phone = profile.phone ?? '';
        if (profile.name) {
          onChange({ ...data, name: profile.name || authName, email: authEmail, phone });
          setProfileLoading(false);
          return;
        }
      }
    } catch { /* ignore malformed JSON */ }

    onChange({ ...data, name: authName, email: authEmail, phone });
    setProfileLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Fetch vehicles from Firestore ──────────────────────────────────────────
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    setVehiclesLoading(true);
    const col   = collection(db, 'users', user.uid, 'vehicles');
    const q     = query(col, orderBy('createdAt', 'asc'));
    const unsub = onSnapshot(q, snap => {
      setVehicles(snap.docs.map(d => ({ id: d.id, ...d.data() } as Vehicle)));
      setVehiclesLoading(false);
    });
    return () => unsub();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange({ ...data, [name]: value });
  };

  // ── Dropdown handler ───────────────────────────────────────────────────────
  const handleVehicleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === '__other__') {
      setManualEntry(true);
      onChange({ ...data, vehicleNo: '' }); // clear plate until user types
    } else {
      setManualEntry(false);
      onChange({ ...data, vehicleNo: value });
    }
  };

  // ── Discount helpers ───────────────────────────────────────────────────────
  const validateDiscountCode = () => {
    setDiscountError('');
    const code = discountInput.trim().toUpperCase();
    if (!code) { setDiscountError('Please enter a discount code.'); return; }

    const corporates = JSON.parse(localStorage.getItem('at_corporate_customers') || '[]');
    const corporate  = corporates.find((c: any) => c.corporateCode === code);
    if (corporate) {
      onChange({ ...data, discountCode: code, discountInfo: { type: 'corporate', companyName: corporate.companyName, discount: corporate.discount || 10, id: code } });
      setDiscountInput('');
      return;
    }

    const employees = JSON.parse(localStorage.getItem('at_employee_discounts') || '[]');
    const employee  = employees.find((e: any) => e.employeeDiscountId === code);
    if (employee) {
      onChange({ ...data, discountCode: code, discountInfo: { type: 'employee', companyName: employee.companyName, employeeName: employee.employeeName, discount: employee.discount || 10, id: code } });
      setDiscountInput('');
      return;
    }

    setDiscountError('Invalid code. Please check your Corporate Code or Employee Discount ID.');
  };

  const removeDiscount = () => {
    onChange({ ...data, discountCode: undefined, discountInfo: null });
    setDiscountInput('');
    setDiscountError('');
  };

  const vehicleLabel = (v: Vehicle) => {
    const detail = [v.year, v.make, v.model].filter(Boolean).join(' ');
    return detail ? `${v.plate}  —  ${detail}` : v.plate;
  };

  const chosenVehicle  = !manualEntry ? vehicles.find(v => v.plate === data.vehicleNo) : undefined;
  const dropdownValue  = manualEntry ? '__other__' : (data.vehicleNo ?? '');

  return (
    <div className="max-w-md mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Your Details</h2>
        <p className="text-brand-gray">We'll use this to confirm your booking</p>
      </div>

      <div className="space-y-4">

        {/* ── Name ── */}
        <div className="relative">
          <Input
            label="Full Name"
            name="name"
            value={data.name}
            onChange={handleChange}
            placeholder="John Doe"
            required
          />
          {profileLoading && (
            <Loader2 className="absolute right-3 top-9 w-4 h-4 text-brand-yellow animate-spin" />
          )}
        </div>

        {/* ── Phone ── */}
        <Input
          label="Phone Number"
          name="phone"
          type="tel"
          value={data.phone}
          onChange={handleChange}
          placeholder="077 123 4567"
          required
        />

        {/* ── Email ── */}
        <Input
          label="Email Address"
          name="email"
          type="email"
          value={data.email}
          onChange={handleChange}
          placeholder="john@example.com"
          required
        />

        {/* ── Vehicle ─────────────────────────────────────────────────────── */}
        <div>
          <label className="block text-xs font-semibold text-neutral-400 mb-1.5 uppercase tracking-wider">
            Vehicle
            <span className="ml-1 text-neutral-600 normal-case font-normal tracking-normal">(Optional)</span>
          </label>

          {vehiclesLoading ? (
            /* Loading skeleton */
            <div className="flex items-center gap-2 px-3 py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg">
              <Loader2 className="w-4 h-4 text-brand-yellow animate-spin flex-shrink-0" />
              <span className="text-neutral-500 text-sm">Loading your vehicles…</span>
            </div>

          ) : vehicles.length > 0 ? (
            <>
              {/* Saved-vehicle dropdown */}
              <div className="relative">
                <Car className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
                <select
                  value={dropdownValue}
                  onChange={handleVehicleSelect}
                  className="w-full appearance-none bg-neutral-800 border border-neutral-700 rounded-lg pl-10 pr-10 py-2.5 text-white text-sm focus:outline-none focus:border-brand-yellow transition-colors cursor-pointer"
                >
                  <option value="">— Select a vehicle —</option>
                  {vehicles.map(v => (
                    <option key={v.id} value={v.plate}>{vehicleLabel(v)}</option>
                  ))}
                  <option value="__other__">Other / Enter manually…</option>
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                  <svg className="w-4 h-4 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Manual entry with SL plate formatter — only when "Other" chosen */}
              {manualEntry && (
                <ManualPlateInput
                  onConfirm={plate => onChange({ ...data, vehicleNo: plate })}
                />
              )}

              {/* Tyre-size hint for a saved vehicle */}
              {chosenVehicle?.tyreSize && (
                <p className="text-xs text-neutral-500 mt-1.5 flex items-center gap-1.5">
                  <Car className="w-3 h-3" />
                  Tyre size on record:{' '}
                  <span className="font-mono text-brand-yellow">{chosenVehicle.tyreSize}</span>
                </p>
              )}
            </>

          ) : (
            /* No saved vehicles — show plate formatter directly */
            <>
              <p className="text-xs text-neutral-600 mb-1">
                No saved vehicles — enter your plate number below.
              </p>
              <ManualPlateInput
                onConfirm={plate => onChange({ ...data, vehicleNo: plate })}
              />
            </>
          )}
        </div>

        {/* ── Discount Code ─────────────────────────────────────────────────── */}
        <div className="pt-2">
          <div className="border border-neutral-700 rounded-xl p-4 bg-neutral-900/50">
            <div className="flex items-center gap-2 mb-1">
              <Tag className="w-4 h-4 text-brand-yellow" />
              <span className="text-white font-semibold text-sm">Have a Discount Code?</span>
              <span className="text-xs text-neutral-500 ml-auto">Optional</span>
            </div>
            <p className="text-xs text-neutral-500 mb-3">
              Enter your Corporate Code or Employee Discount ID
            </p>

            {data.discountInfo ? (
              /* Applied state */
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-yellow flex items-center justify-center flex-shrink-0">
                    <span className="text-black font-bold text-xs leading-tight text-center">
                      {data.discountInfo.discount}%<br />
                      <span className="text-[9px]">OFF</span>
                    </span>
                  </div>
                  <div>
                    <p className="text-green-400 font-semibold text-xs flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      {data.discountInfo.type === 'corporate'
                        ? 'Corporate Discount Applied'
                        : 'Employee Discount Applied'}
                    </p>
                    <p className="text-white text-sm font-mono font-bold mt-0.5">{data.discountCode}</p>
                    {data.discountInfo.companyName && (
                      <p className="text-neutral-400 text-xs mt-0.5">Company: {data.discountInfo.companyName}</p>
                    )}
                    {data.discountInfo.employeeName && (
                      <p className="text-neutral-400 text-xs">Employee: {data.discountInfo.employeeName}</p>
                    )}
                    <p className="text-green-400 text-xs mt-1">
                      {data.discountInfo.discount}% discount will be applied at the branch
                    </p>
                  </div>
                </div>
                <button
                  onClick={removeDiscount}
                  className="text-neutral-500 hover:text-red-400 transition-colors flex-shrink-0 mt-0.5"
                  title="Remove discount"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              /* Input state */
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={discountInput}
                    onChange={e => { setDiscountInput(e.target.value.toUpperCase()); setDiscountError(''); }}
                    onKeyDown={e => e.key === 'Enter' && validateDiscountCode()}
                    placeholder="CORP-XXXXX or EMP-XXXXX"
                    className="flex-1 px-3 py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder:text-neutral-600 focus:outline-none focus:border-brand-yellow transition-colors font-mono text-sm"
                  />
                  <button
                    type="button"
                    onClick={validateDiscountCode}
                    className="px-4 py-2.5 bg-brand-yellow text-black font-bold rounded-lg hover:bg-brand-yellow/90 transition-colors text-sm flex-shrink-0"
                  >
                    Apply
                  </button>
                </div>
                {discountError && (
                  <div className="flex items-center gap-1.5 text-red-400 text-xs">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    {discountError}
                  </div>
                )}
                <p className="text-xs text-neutral-600">
                  Corporate codes start with{' '}
                  <span className="text-neutral-400 font-mono">CORP-</span> · Employee IDs start with{' '}
                  <span className="text-neutral-400 font-mono">EMP-</span>
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}