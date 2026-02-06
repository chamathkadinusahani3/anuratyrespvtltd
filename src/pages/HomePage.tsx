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
      <section className="py-24 bg-brand-yellow relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-multiply"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-3xl md:text-5xl font-black text-brand-black mb-6">
            READY TO SERVICE YOUR VEHICLE?
          </h2>
          <p className="text-xl text-brand-black/80 mb-10 max-w-2xl mx-auto font-medium">
            Book your appointment online in less than 2 minutes. Choose your
            preferred branch, service, and time.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/booking">
              <Button
                size="lg"
                className="bg-brand-black text-white hover:bg-brand-dark border-transparent w-full sm:w-auto">

                Book Appointment Now
              </Button>
            </Link>
            <Link to="/contact">
              <Button
                variant="outline"
                size="lg"
                className="border-brand-black text-brand-black hover:bg-brand-black hover:text-white w-full sm:w-auto">

                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>);

}