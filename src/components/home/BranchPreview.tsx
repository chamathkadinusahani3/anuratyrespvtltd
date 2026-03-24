import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight, Navigation } from 'lucide-react';
import { BRANCHES } from '../../types';
import { motion } from 'framer-motion';

export function BranchPreview() {
  return (
    <section className="py-20 bg-neutral-950 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-brand-red/6 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Header — same pattern as FeaturedProducts */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-brand-yellow text-xs font-bold tracking-[0.3em] uppercase mb-3">Our Presence</p>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
              LOCATE A <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-yellow to-brand-red">BRANCH</span>
            </h2>
          </div>
          <Link
            to="/branches"
            className="hidden md:flex items-center gap-2 text-sm text-gray-400 hover:text-brand-yellow transition-colors duration-200 font-medium group"
          >
            View all branches
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>

        {/* Branch Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {BRANCHES.map((branch, index) => (
            <motion.div
              key={branch.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: index * 0.08, ease: 'easeOut' }}
              className="group"
            >
              <div className="bg-neutral-900 border border-white/8 rounded-2xl p-6 h-full flex flex-col hover:border-brand-yellow/40 hover:-translate-y-1 transition-all duration-300 hover:shadow-[0_8px_32px_rgba(255,204,0,0.08)] relative overflow-hidden">
                {/* Top accent bar */}
                <div className="absolute top-0 left-0 h-[2px] w-0 bg-gradient-to-r from-brand-yellow to-brand-red group-hover:w-full transition-all duration-500 rounded-t-2xl" />

                {/* Icon */}
                <div className="w-11 h-11 rounded-xl bg-brand-yellow/10 flex items-center justify-center mb-5 group-hover:bg-brand-yellow/20 transition-colors duration-300">
                  <MapPin className="w-5 h-5 text-brand-yellow" />
                </div>

                {/* Content */}
                <h3 className="text-white font-black text-base uppercase tracking-tight mb-2 group-hover:text-brand-yellow transition-colors duration-200">
                  {branch.name}
                </h3>
                <p className="text-gray-500 text-xs leading-relaxed flex-1 line-clamp-2">
                  {branch.address}
                </p>

                {/* Footer badge */}
                <div className="mt-5 pt-4 border-t border-white/6 flex items-center justify-between">
                  {branch.hasFullService ? (
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-yellow animate-pulse" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-brand-yellow/80">Full Service</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600">Tyres Only</span>
                    </div>
                  )}
                  <Navigation className="w-3.5 h-3.5 text-gray-600 group-hover:text-brand-yellow transition-colors duration-200" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="mt-8 md:hidden text-center">
          <Link
            to="/branches"
            className="inline-flex items-center gap-2 text-sm text-brand-yellow font-semibold"
          >
            View all branches <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}