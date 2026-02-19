import React from 'react';
import { Layout } from '../components/layout/Layout';
import { HeroSection } from '../components/home/HeroSection';
import { BranchPreview } from '../components/home/BranchPreview';
import { ServicesPreview } from '../components/home/ServicesPreview';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';
export function HomePage() {
  return (
    <Layout>
      <HeroSection />
      <BranchPreview />
      <ServicesPreview />

      {/* CTA Section */}
<section className="py-24 bg-black relative overflow-hidden">
  {/* Decorative Background Elements */}
  <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
    <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-red/20 blur-[120px] rounded-full"></div>
    <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-brand-yellow/10 blur-[120px] rounded-full"></div>
  </div>

  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
    <div className="bg-neutral-900/50 border border-white/10 backdrop-blur-md rounded-3xl p-8 md:p-16 text-center">
      
      {/* Accent Red Line */}
      <div className="w-20 h-1.5 bg-brand-red mx-auto mb-8 rounded-full shadow-[0_0_15px_rgba(255,0,0,0.5)]"></div>

      <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
        READY TO <span className="text-brand-yellow">UPGRADE</span> YOUR RIDE?
      </h2>
      
      <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
        Book your appointment online in less than 2 minutes. 
        Choose your preferred branch, service, and time.
      </p>

      <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
        <Link to="/booking" className="w-full sm:w-auto">
          <Button
            size="lg"
            className="group relative bg-brand-yellow text-black hover:bg-white transition-all duration-300 font-bold px-10 h-14 w-full sm:w-auto rounded-xl overflow-hidden shadow-[0_10px_20px_-10px_rgba(255,215,0,0.3)]"
          >
            <span className="relative z-10">Book Appointment Now</span>
            <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          </Button>
        </Link>

        <Link to="/contact" className="w-full sm:w-auto">
          <Button
            variant="outline"
            size="lg"
            className="border-white/20 text-white hover:bg-white hover:text-black transition-all duration-300 font-bold px-10 h-14 w-full sm:w-auto rounded-xl"
          >
            Contact Us
          </Button>
        </Link>
      </div>
    </div>
  </div>
</section>
    </Layout>);

}