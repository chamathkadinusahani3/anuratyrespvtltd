import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
interface CardProps extends HTMLMotionProps<'div'> {
  hoverEffect?: boolean;
  variant?: 'default' | 'active';
}
export function Card({
  children,
  className = '',
  hoverEffect = false,
  variant = 'default',
  ...props
}: CardProps) {
  const baseStyles =
  'bg-brand-card rounded-xl border border-white/5 overflow-hidden';
  const activeStyles =
  variant === 'active' ?
  'ring-2 ring-brand-yellow border-brand-yellow/50' :
  '';
  const hoverStyles = hoverEffect ?
  'hover:border-brand-yellow/30 hover:shadow-lg hover:shadow-brand-yellow/5 transition-all duration-300' :
  '';
  return (
    <motion.div
      className={`${baseStyles} ${activeStyles} ${hoverStyles} ${className}`}
      initial={{
        opacity: 0,
        y: 20
      }}
      whileInView={{
        opacity: 1,
        y: 0
      }}
      viewport={{
        once: true,
        margin: '-50px'
      }}
      transition={{
        duration: 0.4,
        ease: 'easeOut'
      }}
      {...props}>

      {children}
    </motion.div>);

}