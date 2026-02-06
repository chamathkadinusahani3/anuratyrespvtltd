import React from 'react';
import { Check } from 'lucide-react';
import { BookingStep } from '../../types';
interface StepIndicatorProps {
  currentStep: BookingStep;
}
export function StepIndicator({ currentStep }: StepIndicatorProps) {
  const steps: {
    id: BookingStep;
    label: string;
  }[] = [
  {
    id: 'branch',
    label: 'Branch'
  },
  {
    id: 'category',
    label: 'Category'
  },
  {
    id: 'service',
    label: 'Service'
  },
  {
    id: 'date',
    label: 'Date'
  },
  {
    id: 'time',
    label: 'Time'
  },
  {
    id: 'details',
    label: 'Details'
  }];

  const stepOrder = [
  'branch',
  'category',
  'service',
  'date',
  'time',
  'details',
  'confirmation'];

  const currentIndex = stepOrder.indexOf(currentStep);
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between relative">
        {/* Progress Bar Background */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-white/10 rounded-full -z-10" />

        {/* Active Progress Bar */}
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-brand-yellow rounded-full -z-10 transition-all duration-500 ease-out"
          style={{
            width: `${currentIndex / (steps.length - 1) * 100}%`
          }} />


        {steps.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          return (
            <div key={step.id} className="flex flex-col items-center gap-2">
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300
                  ${isCompleted ? 'bg-brand-yellow text-brand-black scale-110' : ''}
                  ${isCurrent ? 'bg-brand-black border-2 border-brand-yellow text-brand-yellow scale-125 shadow-[0_0_15px_rgba(254,241,4,0.3)]' : ''}
                  ${!isCompleted && !isCurrent ? 'bg-brand-card border border-white/20 text-brand-gray' : ''}
                `}>

                {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
              </div>
              <span
                className={`
                text-xs font-medium hidden sm:block transition-colors duration-300
                ${isCurrent ? 'text-brand-yellow' : 'text-brand-gray'}
              `}>

                {step.label}
              </span>
            </div>);

        })}
      </div>
    </div>);

}