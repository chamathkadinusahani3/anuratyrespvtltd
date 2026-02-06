import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { ArrowRight, ShieldCheck, Clock, PenTool } from 'lucide-react';
export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-brand-black">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-yellow/20 via-transparent to-transparent" />
        <div className="absolute inset-0">
  <img
    src="/hero-bg.png"
    alt="Background"
    className="h-full w-full object-cover mix-blend-overlay"
  />
</div>
      </div>

      

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <motion.div
          initial={{
            opacity: 0,
            y: 30
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            duration: 0.8,
            ease: 'easeOut'
          }}
          className="max-w-3xl">

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-yellow/10 border border-brand-yellow/20 text-brand-yellow text-sm font-medium mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-yellow opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-yellow"></span>
            </span>
            Now open in Pannipitiya with full services
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-6">
            RELIABLE TYRE & <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-yellow to-yellow-200">
              VEHICLE CARE
            </span>
          </h1>

          <p className="text-xl text-brand-gray mb-10 max-w-2xl leading-relaxed">
            Premium tyre solutions, expert mechanical repairs, and heavy vehicle
            services across Sri Lanka. Book online, check stock, or request a
            quotation in minutes.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/booking">
              <Button size="lg" className="w-full sm:w-auto group">
                Book a Service
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/products">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Request Quotation
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 border-t border-white/10 pt-8">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-brand-yellow" />
              <div>
                <p className="font-bold text-white">Trusted Service</p>
                <p className="text-sm text-brand-gray">Since 1983</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <PenTool className="w-8 h-8 text-brand-yellow" />
              <div>
                <p className="font-bold text-white">Expert Techs</p>
                <p className="text-sm text-brand-gray">Certified Team</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-brand-yellow" />
              <div>
                <p className="font-bold text-white">Quick Booking</p>
                <p className="text-sm text-brand-gray">Online System</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>);

}