import React from 'react';
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'neutral';
  className?: string;
}
export function Badge({
  children,
  variant = 'neutral',
  className = ''
}: BadgeProps) {
  const variants = {
    success: 'bg-green-500/10 text-green-400 border-green-500/20',
    warning: 'bg-brand-yellow/10 text-brand-yellow border-brand-yellow/20',
    error: 'bg-brand-red/10 text-brand-red border-brand-red/20',
    neutral: 'bg-white/5 text-brand-gray border-white/10'
  };
  return (
    <span
      className={`
      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
      ${variants[variant]}
      ${className}
    `}>

      {children}
    </span>);

}