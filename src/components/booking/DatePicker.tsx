import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
interface DatePickerProps {
  selectedDate: Date | null;
  onSelect: (date: Date) => void;
}
export function DatePicker({ selectedDate, onSelect }: DatePickerProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();
  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();
  const days = Array.from(
    {
      length: daysInMonth
    },
    (_, i) => i + 1
  );
  const padding = Array.from(
    {
      length: firstDayOfMonth
    },
    (_, i) => i
  );
  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentMonth.getMonth() === today.getMonth() &&
      currentMonth.getFullYear() === today.getFullYear());

  };
  const isSelected = (day: number) => {
    return (
      selectedDate?.getDate() === day &&
      selectedDate?.getMonth() === currentMonth.getMonth() &&
      selectedDate?.getFullYear() === currentMonth.getFullYear());

  };
  const isPast = (day: number) => {
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };
  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };
  const prevMonth = () => {
    const today = new Date();
    const prev = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() - 1,
      1
    );
    if (
    prev.getMonth() >= today.getMonth() ||
    prev.getFullYear() > today.getFullYear())
    {
      setCurrentMonth(prev);
    }
  };
  return (
    <div className="w-full max-w-md mx-auto bg-brand-card rounded-xl border border-white/5 p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={prevMonth}
          className="p-2 hover:bg-white/5 rounded-lg text-brand-gray hover:text-white">

          <ChevronLeft className="w-5 h-5" />
        </button>
        <h3 className="text-lg font-bold text-white">
          {currentMonth.toLocaleString('default', {
            month: 'long',
            year: 'numeric'
          })}
        </h3>
        <button
          onClick={nextMonth}
          className="p-2 hover:bg-white/5 rounded-lg text-brand-gray hover:text-white">

          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) =>
        <div
          key={day}
          className="text-xs font-medium text-brand-gray uppercase">

            {day}
          </div>
        )}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {padding.map((i) =>
        <div key={`pad-${i}`} />
        )}
        {days.map((day) => {
          const disabled = isPast(day);
          const selected = isSelected(day);
          const today = isToday(day);
          return (
            <button
              key={day}
              disabled={disabled}
              onClick={() =>
              onSelect(
                new Date(
                  currentMonth.getFullYear(),
                  currentMonth.getMonth(),
                  day
                )
              )
              }
              className={`
                h-10 w-10 rounded-lg text-sm font-medium transition-all duration-200
                ${selected ? 'bg-brand-yellow text-brand-black font-bold shadow-lg shadow-brand-yellow/20' : ''}
                ${!selected && !disabled ? 'hover:bg-white/10 text-white' : ''}
                ${disabled ? 'text-brand-gray/20 cursor-not-allowed' : ''}
                ${today && !selected ? 'border border-brand-yellow text-brand-yellow' : ''}
              `}>

              {day}
            </button>);

        })}
      </div>
    </div>);

}