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
  branchName?: string | null;   // e.g. "Pannipitiya Branch"
  selectedDate?: Date | null;   // the date chosen in DatePicker step
}

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');

// Fallback static slots used when branch/date not yet provided
const ALL_TIME_SLOTS = [
  '08:30','09:00','09:30','10:00','10:30','11:00','11:30','12:00',
  '13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30',
  '17:00','17:30','18:00','18:30','19:00',
];

function formatTo12Hr(time: string): string {
  const [hStr, mStr] = time.split(':');
  let h = parseInt(hStr, 10);
  const m = mStr;
  const ampm = h >= 12 ? 'PM' : 'AM';
  if (h > 12) h -= 12;
  if (h === 0) h = 12;
  return `${h}:${m} ${ampm}`;
}

export function TimeSlotPicker({
  selectedTime,
  onSelect,
  branchName,
  selectedDate,
}: TimeSlotPickerProps) {
  const [slots, setSlots]       = useState<SlotInfo[]>([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState<string>('');

  // Convert Date → "YYYY-MM-DD" string
  const dateStr = selectedDate
    ? selectedDate.toISOString().split('T')[0]
    : null;

  const fetchKey = `${branchName}__${dateStr}`;

  useEffect(() => {
    // If branch or date missing, show all slots as available (static fallback)
    if (!branchName || !dateStr) {
      setSlots(ALL_TIME_SLOTS.map(time => ({
        time,
        booked: 0,
        capacity: 2,
        available: true,
      })));
      return;
    }

    // Avoid re-fetching for the same branch+date
    if (fetchKey === lastFetch) return;

    const fetchAvailability = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          branch: branchName,
          date:   dateStr,
        });
        const res  = await fetch(`${API_URL}/bookings/availability?${params}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || 'Failed to load availability');

        setSlots(data.slots || []);
        setLastFetch(fetchKey);

        // If currently selected time just became unavailable, clear it
        if (selectedTime) {
          const selected = (data.slots as SlotInfo[]).find(s => s.time === selectedTime);
          if (selected && !selected.available) {
            onSelect(''); // clear invalid selection
          }
        }
      } catch (err: any) {
        setError(err.message);
        // Fall back to all-available on error so user isn't blocked
        setSlots(ALL_TIME_SLOTS.map(time => ({
          time, booked: 0, capacity: 2, available: true,
        })));
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, [branchName, dateStr]);

  const refresh = () => {
    setLastFetch(''); // force re-fetch
  };

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
                <span className="text-red-400 ml-2">· {totalFull} fully booked</span>
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

      {/* Loading state */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <Loader2 className="w-8 h-8 text-brand-yellow animate-spin" />
          <p className="text-neutral-500 text-sm">Checking availability…</p>
        </div>
      )}

      {/* Error banner (non-blocking) */}
      {error && !loading && (
        <div className="mb-4 flex items-start gap-2 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>Could not load live availability. Showing all slots — please confirm at the branch.</span>
        </div>
      )}

      {/* Legend */}
      {!loading && slots.length > 0 && (
        <div className="flex items-center gap-4 mb-6 text-xs text-neutral-500">
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
        </div>
      )}

      {/* Slot grid by period */}
      {!loading && slots.length > 0 && (
        <div className="space-y-6">
          {periods.map(({ label, range }) => {
            const periodSlots = getSlotsForPeriod(range[0], range[1]);
            if (periodSlots.length === 0) return null;

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
                    const isSelected  = selectedTime === slot.time;
                    const isFull      = !slot.available;
                    const isAlmostFull = slot.available && slot.booked >= slot.capacity - 1 && slot.capacity > 1;

                    return (
                      <button
                        key={slot.time}
                        onClick={() => !isFull && onSelect(slot.time)}
                        disabled={isFull}
                        className={`
                          relative flex flex-col items-center justify-center
                          rounded-xl px-3 py-3 text-sm font-semibold
                          transition-all duration-200 border
                          ${isSelected
                            ? 'bg-brand-yellow text-black border-brand-yellow shadow-[0_0_20px_rgba(255,204,0,0.3)]'
                            : isFull
                              ? 'bg-neutral-900 text-neutral-700 border-neutral-800 cursor-not-allowed'
                              : isAlmostFull
                                ? 'bg-orange-500/10 text-orange-300 border-orange-500/30 hover:bg-orange-500/20'
                                : 'bg-brand-yellow/5 text-white border-brand-yellow/20 hover:bg-brand-yellow/10 hover:border-brand-yellow/50'
                          }
                        `}
                      >
                        <span className="text-[15px] font-bold">{formatTo12Hr(slot.time)}</span>

                        {/* Status label */}
                        {isFull ? (
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

                        {/* Full overlay slash line */}
                        {isFull && (
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
        </div>
      )}

      {/* No branch/date hint */}
      {!loading && !branchName && (
        <div className="flex flex-col items-center justify-center py-12 gap-2 text-neutral-600">
          <Clock className="w-10 h-10" />
          <p className="text-sm">Select a branch and date first to see availability</p>
        </div>
      )}
    </div>
  );
}