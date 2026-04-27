// src/components/booking/TimeSlotPicker.tsx
import React, { useState, useEffect } from 'react';
import { Clock, Loader2, AlertCircle, RefreshCw } from 'lucide-react';

interface SlotInfo {
  time: string;
  booked: number;
  capacity: number;
  available: boolean;
}

interface TimeSlotPickerProps {
  selectedTime: string | null;
  onSelect: (time: string) => void;
  branchName?: string | null;
  selectedDate?: Date | null;
}

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');

// ─── Sri Lanka is UTC+5:30 ────────────────────────────────────────────────────
const SL_TZ = 'Asia/Colombo';

/**
 * Returns { hours, minutes } for the current time in Sri Lanka (UTC+5:30),
 * regardless of what timezone the user's device is set to.
 */
function getNowInSriLanka(): { h: number; m: number } {
  const now = new Date();
  // toLocaleString with timeZone converts to Sri Lanka local time
  const slString = now.toLocaleString('en-US', {
    timeZone: SL_TZ,
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  });
  // slString is like "14:05" or "9:30"
  const [hStr, mStr] = slString.split(':');
  return { h: parseInt(hStr, 10), m: parseInt(mStr, 10) };
}

/**
 * Returns today's date in Sri Lanka timezone as { year, month, date }.
 * This handles the edge case where it's after midnight UTC but still
 * the previous day in Sri Lanka (shouldn't happen since SL is UTC+5:30
 * and is always ahead, but it's correct practice).
 */
function getTodayInSriLanka(): { year: number; month: number; date: number } {
  const now = new Date();
  const slString = now.toLocaleString('en-US', {
    timeZone: SL_TZ,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });
  // slString is like "4/25/2026"
  const parts = slString.split('/');
  return {
    month: parseInt(parts[0], 10) - 1, // 0-indexed
    date:  parseInt(parts[1], 10),
    year:  parseInt(parts[2], 10),
  };
}

// ─── Branch-specific time slots ───────────────────────────────────────────────
//
// Pannipitiya (full service): opens 8:30 AM, closes 7:00 PM — full slot range
// Other branches (Anura Tyres only): typically shorter hours
//
const FULL_SERVICE_SLOTS = [
  '08:30','09:00','09:30','10:00','10:30','11:00','11:30','12:00',
  '13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30',
  '17:00','17:30','18:00','18:30','19:00',
];

const LIMITED_SERVICE_SLOTS = [
  '08:30','09:00','09:30','10:00','10:30','11:00','11:30','12:00',
  '13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30',
  '17:00','17:30','18:00','18:30','19:00',
];

/**
 * Returns the appropriate slot list for a given branch.
 * Pannipitiya has full-service hours; all other branches have limited hours.
 */
function getSlotsForBranch(branchName: string | null | undefined): string[] {
  if (!branchName) return FULL_SERVICE_SLOTS;
  const name = branchName.toLowerCase();
  if (name.includes('pannipitiya')) return FULL_SERVICE_SLOTS;
  return LIMITED_SERVICE_SLOTS;
}

// ─── 12-hour format (Sri Lanka convention: 12:00 PM = noon) ──────────────────
function formatTo12Hr(time: string): string {
  const [hStr, mStr] = time.split(':');
  let h = parseInt(hStr, 10);
  const m = mStr;
  const ampm = h >= 12 ? 'PM' : 'AM';
  if (h > 12) h -= 12;
  if (h === 0) h = 12;
  // 12:00 stays as 12:00 PM ✓  |  13:00 → 1:00 PM ✓  |  08:30 → 8:30 AM ✓
  return `${h}:${m} ${ampm}`;
}

// ─── Returns true if a slot is in the past for the selected date ──────────────
function isSlotInPast(slotTime: string, selectedDate: Date | null): boolean {
  if (!selectedDate) return false;

  // Compare selected date against today IN Sri Lanka timezone
  const sl = getTodayInSriLanka();
  const isToday =
    selectedDate.getFullYear() === sl.year &&
    selectedDate.getMonth()    === sl.month &&
    selectedDate.getDate()     === sl.date;

  if (!isToday) return false;

  // Get current Sri Lanka time
  const { h: nowH, m: nowM } = getNowInSriLanka();
  const [slotH, slotM] = slotTime.split(':').map(Number);

  // Block any slot whose time <= now (need at least 1 minute in the future)
  if (slotH < nowH) return true;
  if (slotH === nowH && slotM <= nowM) return true;
  return false;
}

export function TimeSlotPicker({
  selectedTime,
  onSelect,
  branchName,
  selectedDate,
}: TimeSlotPickerProps) {
  const [slots, setSlots]         = useState<SlotInfo[]>([]);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState<string>('');

  // Use Sri Lanka date string (not UTC) so the date passed to the API
  // matches what the user actually sees on the calendar.
  const dateStr = selectedDate
    ? (() => {
        const sl = getTodayInSriLanka();
        const isToday =
          selectedDate.getFullYear() === sl.year &&
          selectedDate.getMonth()    === sl.month &&
          selectedDate.getDate()     === sl.date;
        // For non-today dates the local date parts are fine since
        // the user picked them from the calendar.
        const y = selectedDate.getFullYear();
        const mo = String(selectedDate.getMonth() + 1).padStart(2, '0');
        const d  = String(selectedDate.getDate()).padStart(2, '0');
        return `${y}-${mo}-${d}`;
      })()
    : null;

  const fetchKey = `${branchName}__${dateStr}`;

  // Branch-specific fallback slots
  const branchSlots = getSlotsForBranch(branchName);

  // ── Apply past-slot blocking on top of availability data ─────────────────
  const applyPastFilter = (rawSlots: SlotInfo[]): SlotInfo[] =>
    rawSlots.map(slot => ({
      ...slot,
      available: slot.available && !isSlotInPast(slot.time, selectedDate ?? null),
      isPast:    isSlotInPast(slot.time, selectedDate ?? null),
    })) as SlotInfo[];

  useEffect(() => {
    if (!branchName || !dateStr) {
      const raw = branchSlots.map(time => ({
        time, booked: 0, capacity: 2, available: true,
      }));
      setSlots(applyPastFilter(raw));
      return;
    }

    if (fetchKey === lastFetch) {
      setSlots(prev => applyPastFilter(prev));
      return;
    }

    const fetchAvailability = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({ branch: branchName, date: dateStr });
        const res  = await fetch(`${API_URL}/bookings/availability?${params}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to load availability');

        const filtered = applyPastFilter(data.slots || []);
        setSlots(filtered);
        setLastFetch(fetchKey);

        if (selectedTime) {
          const sel = filtered.find(s => s.time === selectedTime);
          if (sel && !sel.available) onSelect('');
        }
      } catch (err: any) {
        setError(err.message);
        const fallback = branchSlots.map(time => ({
          time, booked: 0, capacity: 2, available: true,
        }));
        setSlots(applyPastFilter(fallback));
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, [branchName, dateStr]);

  // ── Re-run past filter every minute so slots grey out in real time ────────
  useEffect(() => {
    const interval = setInterval(() => {
      setSlots(prev => applyPastFilter(prev));
      if (selectedTime && isSlotInPast(selectedTime, selectedDate ?? null)) {
        onSelect('');
      }
    }, 60_000);
    return () => clearInterval(interval);
  }, [selectedDate, selectedTime]);

  // ── Reset slots when branch changes so stale slots don't flash ───────────
  useEffect(() => {
    setSlots([]);
    setLastFetch('');
  }, [branchName]);

  const refresh = () => setLastFetch('');

  const periods = [
    { label: 'Morning',   range: ['08:30', '12:00'] },
    { label: 'Afternoon', range: ['13:00', '16:30'] },
    { label: 'Evening',   range: ['17:00', '19:00'] },
  ];

  const getSlotsForPeriod = (start: string, end: string) =>
    slots.filter(s => s.time >= start && s.time <= end);

  const totalAvailable = slots.filter(s => s.available).length;
  const totalFull      = slots.filter(s => !s.available).length;

  return (
    <div className="w-full max-w-2xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-white font-bold text-lg">Select a Time Slot</h3>
          {branchName && dateStr && !loading && (
            <p className="text-neutral-500 text-sm mt-0.5">
              {totalAvailable} of {slots.length} slots available
              {totalFull > 0 && (
                <span className="text-red-400 ml-2">· {totalFull} unavailable</span>
              )}
            </p>
          )}
        </div>
        {branchName && dateStr && (
          <button
            onClick={refresh}
            disabled={loading}
            className="p-2 text-neutral-500 hover:text-brand-yellow transition-colors"
            title="Refresh availability"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <Loader2 className="w-8 h-8 text-brand-yellow animate-spin" />
          <p className="text-neutral-500 text-sm">Checking availability…</p>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="mb-4 flex items-start gap-2 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>Could not load live availability. Showing all slots — please confirm at the branch.</span>
        </div>
      )}

      {/* Legend */}
      {!loading && slots.length > 0 && (
        <div className="flex items-center gap-4 mb-6 text-xs text-neutral-500 flex-wrap">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-brand-yellow/20 border border-brand-yellow/40 inline-block" />
            Available
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-green-500/20 border border-green-500/40 inline-block" />
            Selected
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-neutral-800 border border-neutral-700 inline-block" />
            Fully Booked
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-neutral-800/50 border border-neutral-700/50 inline-block" />
            Past / Unavailable
          </span>
        </div>
      )}

      {/* Slot grid */}
      {!loading && slots.length > 0 && (
        <div className="space-y-6">
          {periods.map(({ label, range }) => {
            const periodSlots = getSlotsForPeriod(range[0], range[1]);
            if (periodSlots.length === 0) return null;

            const allPast = periodSlots.every(s => (s as any).isPast);
            if (allPast) return null;

            return (
              <div key={label}>
                <div className="flex items-center gap-3 mb-3">
                  <Clock className="w-4 h-4 text-brand-yellow" />
                  <h4 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider">
                    {label}
                  </h4>
                  <div className="flex-1 h-px bg-white/5" />
                  <span className="text-xs text-neutral-600">
                    {periodSlots.filter(s => s.available).length} available
                  </span>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                  {periodSlots.map(slot => {
                    const isPast       = (slot as any).isPast;
                    const isSelected   = selectedTime === slot.time;
                    const isFull       = !slot.available && !isPast;
                    const isAlmostFull = slot.available && slot.booked >= slot.capacity - 1 && slot.capacity > 1;

                    return (
                      <button
                        key={slot.time}
                        onClick={() => slot.available && onSelect(slot.time)}
                        disabled={!slot.available}
                        className={`
                          relative flex flex-col items-center justify-center
                          rounded-xl px-3 py-3 text-sm font-semibold
                          transition-all duration-200 border
                          ${isSelected
                            ? 'bg-brand-yellow text-black border-brand-yellow shadow-[0_0_20px_rgba(255,204,0,0.3)]'
                            : isPast
                              ? 'bg-neutral-900/40 text-neutral-700 border-neutral-800/40 cursor-not-allowed opacity-40'
                              : isFull
                                ? 'bg-neutral-900 text-neutral-700 border-neutral-800 cursor-not-allowed'
                                : isAlmostFull
                                  ? 'bg-orange-500/10 text-orange-300 border-orange-500/30 hover:bg-orange-500/20'
                                  : 'bg-brand-yellow/5 text-white border-brand-yellow/20 hover:bg-brand-yellow/10 hover:border-brand-yellow/50'
                          }
                        `}
                      >
                        <span className="text-[15px] font-bold">{formatTo12Hr(slot.time)}</span>

                        {isPast ? (
                          <span className="text-[10px] font-medium text-neutral-600 mt-0.5">
                            Unavailable
                          </span>
                        ) : isFull ? (
                          <span className="text-[10px] font-medium text-neutral-600 mt-0.5">
                            Fully Booked
                          </span>
                        ) : isAlmostFull ? (
                          <span className="text-[10px] font-medium text-orange-400 mt-0.5">
                            {slot.capacity - slot.booked} slot{slot.capacity - slot.booked !== 1 ? 's' : ''} left
                          </span>
                        ) : isSelected ? (
                          <span className="text-[10px] font-bold text-black/70 mt-0.5">
                            Selected ✓
                          </span>
                        ) : (
                          <span className="text-[10px] font-medium text-neutral-500 mt-0.5">
                            Available
                          </span>
                        )}

                        {(isFull || isPast) && (
                          <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
                            <div className="absolute inset-0 opacity-20"
                              style={{
                                backgroundImage: 'repeating-linear-gradient(-45deg, #666 0px, #666 1px, transparent 0px, transparent 6px)',
                              }}
                            />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {slots.every(s => !s.available) && (
            <div className="flex flex-col items-center justify-center py-12 gap-2 text-neutral-600">
              <Clock className="w-10 h-10" />
              <p className="text-sm text-center">No available slots for today.<br/>Please select a future date.</p>
            </div>
          )}
        </div>
      )}

      {!loading && !branchName && (
        <div className="flex flex-col items-center justify-center py-12 gap-2 text-neutral-600">
          <Clock className="w-10 h-10" />
          <p className="text-sm">Select a branch and date first to see availability</p>
        </div>
      )}
    </div>
  );
}