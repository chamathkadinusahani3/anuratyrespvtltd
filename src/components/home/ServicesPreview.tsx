import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ChevronRight,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';
import { motion } from 'framer-motion';

const SERVICES = [
  {
    title: 'Anura Tyres',
    tagline: 'Precision. Performance. Grip.',
    description:
      'Premium tyres, wheel alignment, balancing and alloy wheels for all vehicle types — from passenger cars to heavy commercial vehicles.',
    image: 'anura.png',
    accentColor: '#FFCC00',
    tag: 'Tyres & Wheels',
  },
  {
    title: 'Mechanix',
    tagline: 'Engineered to Last.',
    description:
      'Professional mechanical repairs, suspension tuning, diagnostics and complete vehicle servicing by certified technicians.',
    image: 'machanix.png',
    accentColor: '#FF3B30',
    tag: 'Mechanical Services',
  },
  {
    title: 'Truck & Bus',
    tagline: 'Built for the Long Haul.',
    description:
      'Heavy vehicle tyre fitting, suspension overhaul, fleet servicing and alignment solutions for commercial transport.',
    image: 'truck.png',
    accentColor: '#60A5FA',
    tag: 'Heavy Vehicles',
  },
];

export function ServicesPreview() {
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  const [visible, setVisible] = useState<boolean[]>(
    SERVICES.map(() => false)
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = refs.current.indexOf(
            entry.target as HTMLDivElement
          );

          if (entry.isIntersecting && index !== -1) {
            setVisible((prev) => {
              const updated = [...prev];
              updated[index] = true;
              return updated;
            });
          }
        });
      },
      {
        threshold: 0.2,
      }
    );

    refs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      refs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#050505] py-28 px-4 sm:px-6 lg:px-8">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Glow */}
        <div className="absolute top-[-120px] left-[-120px] w-[420px] h-[420px] rounded-full bg-brand-yellow/10 blur-[140px]" />

        <div className="absolute bottom-[-120px] right-[-120px] w-[420px] h-[420px] rounded-full bg-brand-red/10 blur-[150px]" />

        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:72px_72px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-7">
              <Sparkles className="w-4 h-4 text-brand-yellow" />

              <span className="text-[11px] uppercase tracking-[0.28em] font-bold text-gray-300">
                Premium Automotive Solutions
              </span>
            </div>

            <h2 className="text-5xl md:text-7xl font-black leading-[0.95] tracking-tight text-white">
              COMPLETE
              <br />

              <span className="bg-gradient-to-r from-brand-yellow via-yellow-200 to-brand-red bg-clip-text text-transparent">
                VEHICLE CARE
              </span>
            </h2>

            <p className="mt-8 text-lg text-gray-400 leading-relaxed max-w-2xl">
              From premium tyre solutions to mechanical servicing and heavy
              vehicle maintenance — experience next-generation automotive care
              with modern technology and expert craftsmanship.
            </p>
          </div>

          {/* Desktop CTA */}
          <Link
            to="/services"
            className="group hidden lg:inline-flex items-center gap-3 px-6 py-3 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md hover:bg-brand-yellow hover:border-brand-yellow transition-all duration-300"
          >
            <span className="text-sm font-bold text-white group-hover:text-black transition-colors duration-300">
              Explore Services
            </span>

            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-black/10 transition-all duration-300">
              <ArrowRight className="w-4 h-4 text-white group-hover:text-black group-hover:translate-x-1 transition-all duration-300" />
            </div>
          </Link>
        </div>

        {/* Services */}
        <div className="space-y-8">
          {SERVICES.map((service, index) => {
            const isEven = index % 2 === 0;

            return (
              <motion.div
                key={service.title}
                ref={(el) => (refs.current[index] = el)}
                initial={{
                  opacity: 0,
                  y: 50,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 0.7,
                  delay: index * 0.1,
                }}
                className={`group relative overflow-hidden rounded-[34px] border border-white/10 bg-white/[0.03] backdrop-blur-xl transition-all duration-500 hover:border-white/20 hover:-translate-y-2 hover:shadow-[0_25px_80px_rgba(0,0,0,0.45)]
                
                flex flex-col ${
                  isEven ? 'xl:flex-row' : 'xl:flex-row-reverse'
                }`}
              >
                {/* Hover Glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                  style={{
                    background: `linear-gradient(135deg, ${service.accentColor}08 0%, transparent 50%)`,
                  }}
                />

                {/* IMAGE SIDE */}
                <div
                  className={`relative w-full xl:w-[42%] min-h-[340px] flex items-center justify-center overflow-hidden border-b xl:border-b-0 ${
                    isEven
                      ? 'xl:border-r border-white/10'
                      : 'xl:border-l border-white/10'
                  }`}
                >
                  {/* Gradient Glow */}
                  <div
                    className="absolute inset-0 opacity-40"
                    style={{
                      background: `radial-gradient(circle at center, ${service.accentColor}30 0%, transparent 72%)`,
                    }}
                  />

                  {/* Large Background Text */}
                  <div className="absolute text-[120px] md:text-[160px] font-black text-white/[0.03] tracking-[-0.08em] select-none">
                    0{index + 1}
                  </div>

                  {/* Image */}
                  <img
                    src={service.image}
                    alt={service.title}
                    className={`relative z-10 w-[78%] max-w-md object-contain drop-shadow-[0_25px_80px_rgba(0,0,0,0.55)] transition-all duration-700 group-hover:scale-105 ${
                      visible[index]
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-10'
                    }`}
                  />

                  {/* Floating Tag */}
                  <div
                    className="absolute top-6 left-6 px-4 py-2 rounded-full border backdrop-blur-md"
                    style={{
                      borderColor: `${service.accentColor}40`,
                      backgroundColor: `${service.accentColor}15`,
                    }}
                  >
                    <span
                      className="text-[10px] uppercase tracking-[0.25em] font-black"
                      style={{
                        color: service.accentColor,
                      }}
                    >
                      {service.tag}
                    </span>
                  </div>
                </div>

                {/* CONTENT SIDE */}
                <div className="relative flex-1 p-8 md:p-12 xl:p-16 flex flex-col justify-center">
                  {/* Accent Line */}
                  <div
                    className="w-16 h-[3px] rounded-full mb-8"
                    style={{
                      background: service.accentColor,
                    }}
                  />

                  {/* Tagline */}
                  <p
                    className="text-xs uppercase tracking-[0.3em] font-black mb-4"
                    style={{
                      color: service.accentColor,
                    }}
                  >
                    {service.tagline}
                  </p>

                  {/* Title */}
                  <h3 className="text-4xl md:text-5xl font-black leading-tight tracking-tight text-white mb-6">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="text-lg leading-relaxed text-gray-400 max-w-xl mb-10">
                    {service.description}
                  </p>

                  {/* CTA */}
                  <Link
                    to="/services"
                    className="group/link inline-flex items-center gap-4 w-fit"
                  >
                    <span
                      className="text-sm font-black uppercase tracking-[0.2em]"
                      style={{
                        color: service.accentColor,
                      }}
                    >
                      Learn More
                    </span>

                    <div
                      className="w-12 h-12 rounded-2xl border flex items-center justify-center transition-all duration-300 group-hover/link:translate-x-1"
                      style={{
                        borderColor: `${service.accentColor}30`,
                        backgroundColor: `${service.accentColor}10`,
                      }}
                    >
                      <ChevronRight
                        className="w-5 h-5"
                        style={{
                          color: service.accentColor,
                        }}
                      />
                    </div>
                  </Link>

                  {/* Bottom Right Icon */}
                  <div className="absolute bottom-8 right-8 hidden xl:flex w-12 h-12 rounded-2xl border border-white/10 bg-white/5 items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <ArrowUpRight
                      className="w-5 h-5"
                      style={{
                        color: service.accentColor,
                      }}
                    />
                  </div>
                </div>

                {/* Border Glow */}
                <div className="absolute inset-0 rounded-[34px] border border-transparent group-hover:border-white/10 transition-all duration-500 pointer-events-none" />
              </motion.div>
            );
          })}
        </div>

        {/* Mobile CTA */}
        <div className="mt-12 flex justify-center lg:hidden">
          <Link
            to="/services"
            className="group inline-flex items-center gap-3 px-7 py-4 rounded-2xl bg-brand-yellow text-black font-black text-sm shadow-[0_15px_50px_rgba(255,204,0,0.25)]"
          >
            Explore All Services

            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </section>
  );
}