import React from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  ArrowRight,
  Navigation,
  Sparkles,
  Phone,
} from 'lucide-react';
import { BRANCHES } from '../../types';
import { motion } from 'framer-motion';

export function BranchPreview() {
  return (
    <section className="relative overflow-hidden bg-[#050505] py-28 px-4 sm:px-6 lg:px-8">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-[-120px] left-[-120px] w-[420px] h-[420px] bg-brand-yellow/10 blur-[140px] rounded-full" />
        <div className="absolute bottom-[-140px] right-[-120px] w-[420px] h-[420px] bg-brand-red/10 blur-[150px] rounded-full" />

        {/* Grid texture */}
        <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:70px_70px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-6">
              <Sparkles className="w-4 h-4 text-brand-yellow" />
              <span className="text-[11px] tracking-[0.25em] uppercase font-bold text-gray-300">
                Premium Service Network
              </span>
            </div>

            <h2 className="text-4xl md:text-6xl font-black leading-none tracking-tight text-white">
              FIND OUR
              <br />
              <span className="bg-gradient-to-r from-brand-yellow via-yellow-200 to-brand-red bg-clip-text text-transparent">
                MODERN BRANCHES
              </span>
            </h2>

            <p className="mt-6 text-gray-400 text-sm md:text-base leading-relaxed max-w-xl">
              Experience premium tyre care, wheel alignment, balancing, and
              professional automotive services at our trusted branch locations.
            </p>
          </div>

          <Link
            to="/branches"
            className="group hidden md:inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-brand-yellow hover:border-brand-yellow transition-all duration-300"
          >
            <span className="text-sm font-semibold text-white group-hover:text-black transition-colors duration-300">
              Explore All Branches
            </span>

            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-black/10 transition-all duration-300">
              <ArrowRight className="w-4 h-4 text-white group-hover:text-black group-hover:translate-x-0.5 transition-all duration-300" />
            </div>
          </Link>
        </div>

        {/* Branch Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {BRANCHES.map((branch, index) => (
            <motion.div
              key={branch.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.55,
                delay: index * 0.08,
                ease: 'easeOut',
              }}
              className="group h-full"
            >
              <div className="relative h-full overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03] backdrop-blur-xl p-7 transition-all duration-500 hover:-translate-y-2 hover:border-brand-yellow/40 hover:bg-white/[0.05] hover:shadow-[0_20px_60px_rgba(255,204,0,0.12)]">
                {/* Glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-brand-yellow/[0.08] via-transparent to-brand-red/[0.05]" />
                </div>

                {/* Floating Gradient Orb */}
                <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full bg-brand-yellow/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Top */}
                <div className="relative z-10 flex items-start justify-between mb-8">
                  <div className="w-14 h-14 rounded-2xl border border-white/10 bg-gradient-to-br from-brand-yellow/15 to-brand-red/10 flex items-center justify-center backdrop-blur-md group-hover:scale-110 transition-transform duration-500">
                    <MapPin className="w-6 h-6 text-brand-yellow" />
                  </div>

                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/30 border border-white/10">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        branch.hasFullService
                          ? 'bg-brand-yellow animate-pulse'
                          : 'bg-gray-500'
                      }`}
                    />

                    <span
                      className={`text-[10px] uppercase tracking-[0.18em] font-bold ${
                        branch.hasFullService
                          ? 'text-brand-yellow'
                          : 'text-gray-400'
                      }`}
                    >
                      {branch.hasFullService
                        ? 'Full Service'
                        : 'Tyres Only'}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-xl font-black text-white mb-3 tracking-tight group-hover:text-brand-yellow transition-colors duration-300">
                    {branch.name}
                  </h3>

                  <p className="text-sm leading-relaxed text-gray-400 min-h-[70px]">
                    {branch.address}
                  </p>
                </div>

                {/* Divider */}
                <div className="relative z-10 my-7 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                {/* Footer */}
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Phone className="w-4 h-4" />
                    <span className="text-xs font-medium">
                      Available Today
                    </span>
                  </div>

                  <button className="group/btn flex items-center gap-2 text-sm font-semibold text-white hover:text-brand-yellow transition-colors duration-300">
                    Directions

                    <div className="w-8 h-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center group-hover/btn:border-brand-yellow/30 transition-all duration-300">
                      <Navigation className="w-4 h-4 group-hover/btn:rotate-12 transition-transform duration-300" />
                    </div>
                  </button>
                </div>

                {/* Hover Border Glow */}
                <div className="absolute inset-0 rounded-[28px] border border-transparent group-hover:border-brand-yellow/20 transition-all duration-500 pointer-events-none" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="mt-12 md:hidden flex justify-center">
          <Link
            to="/branches"
            className="group inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-brand-yellow text-black font-bold text-sm shadow-[0_10px_40px_rgba(255,204,0,0.25)]"
          >
            View All Branches

            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </section>
  );
}