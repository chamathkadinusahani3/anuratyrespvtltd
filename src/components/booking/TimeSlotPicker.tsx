import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { Card } from '../ui/Card';
interface TimeSlotPickerProps {
  selectedTime: string | null;
  onSelect: (time: string) => void;
}
export function TimeSlotPicker({
  selectedTime,
  onSelect
}: TimeSlotPickerProps) {
  const morningSlots = [
  '08:30',
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '12:00'];

  const afternoonSlots = [
  '13:00',
  '13:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00',
  '17:30',
  '18:00',
  '18:30',
  '19:00'];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Select Time</h2>
        <p className="text-brand-gray">Choose a convenient time slot</p>
      </div>

      {/* Morning Section */}
      <div>
        <div className="flex items-center gap-2 mb-4 text-brand-yellow">
          <Sun className="w-5 h-5" />
          <h3 className="font-bold text-white">Morning</h3>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {morningSlots.map((time) =>
          <button
            key={time}
            onClick={() => onSelect(time)}
            className={`
                py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 border
                ${selectedTime === time ? 'bg-brand-yellow border-brand-yellow text-brand-black shadow-lg shadow-brand-yellow/20' : 'bg-brand-card border-white/10 text-brand-gray hover:border-brand-yellow/50 hover:text-white'}
              `}>

              {time}
            </button>
          )}
        </div>
      </div>

      {/* Afternoon Section */}
      <div>
        <div className="flex items-center gap-2 mb-4 text-brand-red">
          <Moon className="w-5 h-5" />
          <h3 className="font-bold text-white">Afternoon</h3>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {afternoonSlots.map((time) =>
          <button
            key={time}
            onClick={() => onSelect(time)}
            className={`
                py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 border
                ${selectedTime === time ? 'bg-brand-yellow border-brand-yellow text-brand-black shadow-lg shadow-brand-yellow/20' : 'bg-brand-card border-white/10 text-brand-gray hover:border-brand-yellow/50 hover:text-white'}
              `}>

              {time}
            </button>
          )}
        </div>
      </div>
    </div>);

}