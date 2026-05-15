import React from 'react';
import {
  Trophy,
  ShieldCheck,
  Users,
  Award,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';
import { motion } from 'framer-motion';

export function ExcellenceSection() {
  const stats = [
    {
      icon: Trophy,
      value: '43+',
      label: 'Years Experience',
      desc: 'Decades of trusted automotive excellence serving drivers across Sri Lanka.',
    },
    {
      icon: ShieldCheck,
      value: '100%',
      label: 'Quality First',
      desc: 'Authorized dealer for globally recognized tyre and automotive brands.',
    },
    {
      icon: Users,
      value: '50+',
      label: 'Expert Team',
      desc: 'Certified technicians trained with modern automotive technologies.',
    },
    {
      icon: Award,
      value: 'Top',
      label: 'Award Winning',
      desc: 'Recognized for outstanding customer care and technical service quality.',
    },
  ];

  return (
    <section className="relative overflow-hidden bg-[#050505] py-28">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Huge Year Text */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[28vw] font-black text-white/[0.03] tracking-[-0.08em] leading-none select-none">
          1983
        </div>

        {/* Glow Effects */}
        <div className="absolute top-[-120px] left-[-120px] w-[420px] h-[420px] rounded-full bg-brand-yellow/10 blur-[140px]" />

        <div className="absolute bottom-[-140px] right-[-120px] w-[420px] h-[420px] rounded-full bg-brand-red/10 blur-[160px]" />

        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:70px_70px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-24">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8"
          >
            <Sparkles className="w-4 h-4 text-brand-yellow" />

            <span className="text-[11px] uppercase tracking-[0.28em] font-bold text-gray-300">
              Trusted Since 1983
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-5xl md:text-7xl font-black leading-[0.95] tracking-tight text-white"
          >
            DRIVEN BY
            <br />

            <span className="bg-gradient-to-r from-brand-yellow via-yellow-200 to-brand-red bg-clip-text text-transparent">
              EXCELLENCE
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.7 }}
            className="mt-8 text-lg leading-relaxed text-gray-400 max-w-3xl mx-auto"
          >
            Since 1983, Anura Tyres has delivered premium automotive care with
            expert craftsmanship, cutting-edge technology, and a relentless
            commitment to quality and customer satisfaction.
          </motion.p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-7">
          {stats.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.55,
                  delay: index * 0.08,
                }}
                className="group h-full"
              >
                <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.03] backdrop-blur-xl p-8 h-full transition-all duration-500 hover:-translate-y-2 hover:border-brand-yellow/30 hover:bg-white/[0.05] hover:shadow-[0_20px_60px_rgba(255,204,0,0.12)]">
                  {/* Glow */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-brand-yellow/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-yellow/[0.04] via-transparent to-brand-red/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative z-10">
                    {/* Icon */}
                    <div className="flex items-start justify-between mb-8">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-yellow/15 to-brand-red/10 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                        <Icon className="w-8 h-8 text-brand-yellow" />
                      </div>

                      <div className="w-10 h-10 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                        <ArrowUpRight className="w-4 h-4 text-brand-yellow" />
                      </div>
                    </div>

                    {/* Value */}
                    <h3 className="text-5xl font-black text-white mb-3 tracking-tight">
                      {stat.value}
                    </h3>

                    {/* Label */}
                    <h4 className="text-xl font-bold text-brand-yellow mb-4">
                      {stat.label}
                    </h4>

                    {/* Divider */}
                    <div className="w-14 h-[2px] bg-gradient-to-r from-brand-yellow to-transparent mb-5 rounded-full" />

                    {/* Description */}
                    <p className="text-sm leading-relaxed text-gray-400">
                      {stat.desc}
                    </p>
                  </div>

                  {/* Hover Border */}
                  <div className="absolute inset-0 rounded-[30px] border border-transparent group-hover:border-brand-yellow/20 transition-all duration-500 pointer-events-none" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}