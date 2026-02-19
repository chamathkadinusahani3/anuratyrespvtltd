import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { BRANCHES } from '../../types';
import { motion } from 'framer-motion';

export function BranchPreview() {
  // Animation variants for Framer Motion
  const cardVariants = {
    offscreen: { opacity: 0, y: 50 },
    onscreen: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', bounce: 0.2, duration: 0.6 },
    },
  };

  return (
    <section className="py-24 bg-black relative overflow-hidden">
  {/* Modern background glow */}
  <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-brand-red/5 blur-[120px] rounded-full pointer-events-none" />

  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="w-8 h-[2px] bg-brand-red"></span>
          <span className="text-brand-red font-black uppercase tracking-[0.2em] text-xs">Our Presence</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter  uppercase">
          LOCATE A <span className="text-brand-yellow">BRANCH</span>
        </h2>
        <p className="text-gray-400 max-w-xl text-lg font-light leading-relaxed">
          Conveniently located branches serving you with premium tyre and vehicle care services.
        </p>
      </div>

      <Link
        to="/branches"
        className="group hidden md:flex items-center gap-3 bg-white/5 hover:bg-brand-yellow px-6 py-3 rounded-sm text-white hover:text-black transition-all duration-300 font-bold border-l-4 border-brand-red"
      >
        VIEW FULL NETWORK <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {BRANCHES.map((branch, index) => (
        <motion.div
          key={branch.id}
          className="group"
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: true, amount: 0.2 }}
          variants={cardVariants}
        >
          <Card className="h-full bg-neutral-900/50 border-white/5 hover:border-brand-yellow/50 transition-all duration-500 overflow-hidden relative">
            {/* Top accent line that grows on hover */}
            <div className="absolute top-0 left-0 h-[3px] w-0 bg-brand-red group-hover:w-full transition-all duration-500" />
            
            <div className="p-8 h-full flex flex-col">
              <div className="mb-6">
                <div className="w-12 h-12 bg-black border border-white/10 flex items-center justify-center mb-6 group-hover:rotate-[360deg] transition-all duration-700 shadow-2xl">
                  <MapPin className="w-6 h-6 text-brand-yellow" />
                </div>
                <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tight group-hover:text-brand-yellow transition-colors">
                  {branch.name}
                </h3>
                <p className="text-sm text-gray-500 font-medium line-clamp-2">
                  {branch.address}
                </p>
              </div>

              <div className="mt-auto pt-6 border-t border-white/5">
                {branch.hasFullService ? (
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-brand-yellow">
                    <span className="w-2 h-2 rounded-full bg-brand-red animate-pulse" />
                    Full Service Center
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500">
                    <span className="w-2 h-2 rounded-full bg-white/20" />
                    Tyre Services Only
                  </div>
                )}
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>

    {/* Mobile CTA */}
    <div className="mt-10 md:hidden">
      <Link
        to="/branches"
        className="flex items-center justify-center gap-2 bg-brand-yellow text-black py-4 font-black uppercase tracking-widest italic"
      >
        View All Branches <ArrowRight className="w-5 h-5" />
      </Link>
    </div>
  </div>
</section>
  );
}