import React from 'react';
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}
export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="w-full">
      {label &&
      <label className="block text-sm font-medium text-brand-gray mb-1.5">
          {label}
        </label>
      }
      <input
        className={`
          w-full bg-brand-dark border border-white/10 rounded-lg px-4 py-3
          text-brand-white placeholder-brand-gray/50
          focus:outline-none focus:ring-2 focus:ring-brand-yellow/50 focus:border-brand-yellow
          transition-all duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? 'border-brand-red focus:ring-brand-red/50 focus:border-brand-red' : ''}
          ${className}
        `}
        {...props} />

      {error && <p className="mt-1 text-sm text-brand-red">{error}</p>}
    </div>);

}