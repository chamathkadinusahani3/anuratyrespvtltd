import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../../components/ui/Button';
import {
  CheckCircle,
  Gauge,
  Settings,
  Shield,
  TrendingUp,
  ArrowRight,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

const benefits = [
  {
    icon: Gauge,
    title: 'Precision Accuracy',
    desc: 'Hunter system ensures exact wheel alignment calibration with ultra-precise measurements.',
  },
  {
    icon: Shield,
    title: 'Safer Driving',
    desc: 'Improved vehicle stability, smoother handling, and maximum road safety.',
  },
  {
    icon: TrendingUp,
    title: 'Fuel Efficiency',
    desc: 'Reduce rolling resistance and improve overall fuel economy.',
  },
  {
    icon: Settings,
    title: 'Advanced Technology',
    desc: 'State-of-the-art computerized 3D wheel alignment technology.',
  },
];

const features = [
  'Prevents uneven tyre wear',
  'Improves steering control',
  'Enhances driving safety',
  'Reduces fuel consumption',
  'Extends tyre lifespan',
];

export function WheelAlignmentPage() {
  return (
    <div className="bg-[#000000] text-white overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-120px] left-[-100px] w-[420px] h-[420px] rounded-full bg-brand-yellow/10 blur-[140px]" />
        <div className="absolute bottom-[-140px] right-[-100px] w-[420px] h-[420px] rounded-full bg-brand-red/10 blur-[160px]" />

        
      </div>

      {/* HERO */}
      <section className="relative py-28 px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8">
              <Sparkles className="w-4 h-4 text-brand-yellow" />
              <span className="text-[11px] uppercase tracking-[0.28em] font-bold text-gray-300">
                Hunter Engineering Technology
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-[0.95] tracking-tight">
              PREMIUM
              <br />
              <span className="bg-gradient-to-r from-brand-yellow via-yellow-200 to-brand-red bg-clip-text text-transparent">
                WHEEL ALIGNMENT
              </span>
            </h1>

            <p className="mt-8 text-lg text-gray-400 leading-relaxed max-w-2xl">
              Experience next-generation wheel alignment powered by the world
              renowned Hunter Engineering System — delivering unmatched
              precision, driving comfort, and road safety.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link to="/booking">
                <Button className="group bg-brand-yellow hover:bg-yellow-300 text-black font-bold px-8 h-14 rounded-2xl text-sm shadow-[0_15px_50px_rgba(255,204,0,0.25)]">
                  Book Appointment
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>

              <Link to="/contact">
                <Button
                  variant="outline"
                  className="border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 text-white px-8 h-14 rounded-2xl"
                >
                  Contact Us
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Right Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-[34px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-8 md:p-10 shadow-[0_20px_80px_rgba(0,0,0,0.45)]">
              {/* Glow */}
              <div className="absolute top-0 right-0 w-52 h-52 bg-brand-yellow/10 blur-[120px]" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-10">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-gray-500 font-bold">
                      Performance Benefits
                    </p>

                    <h3 className="text-2xl font-black mt-2">
                      Why Alignment Matters
                    </h3>
                  </div>

                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-yellow/20 to-brand-red/10 border border-white/10 flex items-center justify-center">
                    <Gauge className="w-8 h-8 text-brand-yellow" />
                  </div>
                </div>

                <div className="space-y-5">
                  {features.map((feature, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between gap-4 border border-white/5 bg-black/20 rounded-2xl px-5 py-4 hover:border-brand-yellow/20 transition-all duration-300"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-brand-yellow/10 flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-brand-yellow" />
                        </div>

                        <span className="text-sm font-medium text-gray-200">
                          {feature}
                        </span>
                      </div>

                      <ChevronRight className="w-4 h-4 text-gray-500" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14">
            <p className="text-brand-yellow text-xs tracking-[0.3em] uppercase font-bold mb-3">
              Premium Advantages
            </p>

            <h2 className="text-4xl md:text-5xl font-black tracking-tight">
              WORLD-CLASS
              <span className="block text-gray-500">
                ALIGNMENT EXPERIENCE
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
            {benefits.map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.08,
                  }}
                  className="group"
                >
                  <div className="relative h-full overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03] p-7 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-brand-yellow/30 hover:shadow-[0_20px_60px_rgba(255,204,0,0.12)]">
                    <div className="absolute top-0 right-0 w-28 h-28 bg-brand-yellow/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="relative z-10">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-yellow/15 to-brand-red/10 border border-white/10 flex items-center justify-center mb-6">
                        <Icon className="w-7 h-7 text-brand-yellow" />
                      </div>

                      <h3 className="text-xl font-black mb-3 group-hover:text-brand-yellow transition-colors duration-300">
                        {item.title}
                      </h3>

                      <p className="text-gray-400 text-sm leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* HUNTER SECTION */}
      <section className="relative py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="relative overflow-hidden rounded-[36px] border border-white/10 bg-white/[0.03] backdrop-blur-2xl p-10 md:p-16 text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-yellow/[0.05] via-transparent to-brand-red/[0.04]" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-black/20 mb-8">
                <Sparkles className="w-4 h-4 text-brand-yellow" />
                <span className="text-[11px] uppercase tracking-[0.25em] text-gray-300 font-bold">
                  Hunter Engineering System
                </span>
              </div>

              <h2 className="text-4xl md:text-5xl font-black leading-tight">
                ADVANCED 3D
                <span className="block bg-gradient-to-r from-brand-yellow to-brand-red bg-clip-text text-transparent">
                  ALIGNMENT TECHNOLOGY
                </span>
              </h2>

              <p className="mt-8 text-gray-400 leading-relaxed text-lg max-w-3xl mx-auto">
                Our Hunter Engineering wheel alignment system delivers
                industry-leading precision using advanced computerized 3D
                measurement technology — trusted globally for superior
                performance, accuracy, and reliability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-black leading-tight">
            READY FOR A
            <span className="block bg-gradient-to-r from-brand-yellow to-brand-red bg-clip-text text-transparent">
              SMOOTHER DRIVE?
            </span>
          </h2>

          <p className="text-gray-400 mt-6 text-lg max-w-2xl mx-auto leading-relaxed">
            Visit Anura Tyre Service and experience modern wheel alignment with
            world-class Hunter Engineering precision.
          </p>

          <div className="mt-10 flex justify-center">
            <Link to="/booking">
              <Button className="group bg-brand-yellow hover:bg-yellow-300 text-black font-black px-10 h-14 rounded-2xl shadow-[0_15px_50px_rgba(255,204,0,0.25)]">
                Book Appointment

                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}