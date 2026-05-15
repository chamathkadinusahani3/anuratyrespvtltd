import React from 'react';
import { Layout } from '../components/layout/Layout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';
import {
  Car,
  Wrench,
  Truck,
  ChevronRight,
  ShieldCheck,
  Clock3,
  BadgeCheck,
} from 'lucide-react';
import { SERVICES } from '../types';
import services from '../assets/services.png';
import { useActivityTracker } from '../hooks/useActivityTracker';

const SERVICE_SECTIONS = [
  {
    id: 'tyres',
    title: 'Anura Tyres',
    category: 'Anura Tyres',
    icon: Car,
    color: 'brand-yellow',
    accent: '#FFCC00',
    description:
      'Premium tyres, wheel alignment, balancing, alloy wheels and professional tyre services for all vehicle categories.',
    badge: 'Islandwide Service',
  },
  {
    id: 'mechanix',
    title: 'Mechanix',
    category: 'Mechanix',
    icon: Wrench,
    color: 'brand-red',
    accent: '#FF0000',
    description:
      'Expert vehicle repairs, engine diagnostics, suspension work and full servicing by certified technicians.',
    badge: 'Pannipitiya Only',
  },
  {
    id: 'heavy',
    title: 'Truck & Bus',
    category: 'Truck & Bus',
    icon: Truck,
    color: '#60A5FA',
    accent: '#60A5FA',
    description:
      'Heavy vehicle tyre fitting, fleet maintenance, suspension overhaul and commercial vehicle services.',
    badge: 'Commercial Fleet Support',
  },
];

export function ServicesPage() {
  useActivityTracker({ type: 'page_view', page: '/services' });

  return (
    <Layout>

      {/* HERO */}
      <section className="relative overflow-hidden bg-black py-28 px-4 sm:px-6 lg:px-8 border-b border-white/5">

        {/* Background */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-[0.08]"
            style={{ backgroundImage: `url(${services})` }}
          />

          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/80 to-black" />

          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-brand-yellow/10 blur-[140px] rounded-full" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-brand-red/10 blur-[140px] rounded-full" />
        </div>

        <div className="relative max-w-7xl mx-auto text-center">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-brand-yellow/10 border border-brand-yellow/20 text-brand-yellow text-xs font-bold tracking-[0.25em] uppercase mb-8">
            Professional Vehicle Care
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.95] mb-8">
            <span className="text-white">OUR</span>{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-yellow via-white to-brand-red">
              SERVICES
            </span>
          </h1>

          {/* Description */}
          <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-400 leading-relaxed mb-14">
            Comprehensive automotive care delivered by experienced professionals
            using advanced equipment, premium products and trusted service standards.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-4xl mx-auto">

            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
              <ShieldCheck className="w-8 h-8 text-brand-yellow mx-auto mb-4" />
              <h3 className="text-white font-black text-2xl mb-1">40+</h3>
              <p className="text-gray-400 text-sm">Years Experience</p>
            </div>

            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
              <BadgeCheck className="w-8 h-8 text-brand-yellow mx-auto mb-4" />
              <h3 className="text-white font-black text-2xl mb-1">Certified</h3>
              <p className="text-gray-400 text-sm">Expert Technicians</p>
            </div>

            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
              <Clock3 className="w-8 h-8 text-brand-yellow mx-auto mb-4" />
              <h3 className="text-white font-black text-2xl mb-1">Fast</h3>
              <p className="text-gray-400 text-sm">Quick Turnaround</p>
            </div>

          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="bg-gradient-to-b from-black via-neutral-950 to-black py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-32">

          {SERVICE_SECTIONS.map((section, index) => {
            const Icon = section.icon;
            const servicesList = SERVICES.filter(
              s => s.category === section.category
            );

            return (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-24"
              >

                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-14">

                  <div className="max-w-2xl">

                    <div className="flex items-center gap-5 mb-6">

                      <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl"
                        style={{
                          backgroundColor: `${section.accent}15`,
                          border: `1px solid ${section.accent}30`,
                        }}
                      >
                        <Icon
                          className="w-8 h-8"
                          style={{ color: section.accent }}
                        />
                      </div>

                      <div>
                        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                          {section.title}
                        </h2>

                        <div
                          className="inline-flex items-center mt-3 px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase"
                          style={{
                            backgroundColor: `${section.accent}10`,
                            border: `1px solid ${section.accent}25`,
                            color: section.accent,
                          }}
                        >
                          {section.badge}
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-400 text-lg leading-relaxed">
                      {section.description}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-4">

                    <Link to="/booking">
                      <Button
                        size="lg"
                        className="group bg-brand-yellow text-black hover:bg-white font-bold rounded-2xl px-8 h-14 transition-all duration-300"
                      >
                        Book Service
                        <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                      </Button>
                    </Link>

                    <Link to="/contact">
                      <Button
                        variant="outline"
                        size="lg"
                        className="border-white/15 bg-white/[0.03] hover:bg-white hover:text-black text-white rounded-2xl px-8 h-14 transition-all duration-300"
                      >
                        Request Quote
                      </Button>
                    </Link>

                  </div>
                </div>

                {/* Service Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                  {servicesList.map(service => (
                    <Card
                      key={service.id}
                      hoverEffect
                      className="group relative overflow-hidden border border-white/8 bg-neutral-900/70 backdrop-blur-xl rounded-3xl hover:border-white/15 transition-all duration-500 hover:-translate-y-1"
                    >

                      {/* Glow */}
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                        style={{
                          background: `radial-gradient(circle at top right, ${section.accent}15, transparent 60%)`,
                        }}
                      />

                      <div className="relative p-7 h-full flex flex-col">

                        {/* Accent line */}
                        <div
                          className="w-12 h-1 rounded-full mb-6"
                          style={{ backgroundColor: section.accent }}
                        />

                        <h3 className="text-2xl font-black text-white mb-4 tracking-tight">
                          {service.name}
                        </h3>

                        <p className="text-gray-400 leading-relaxed flex-1 text-sm">
                          {service.description}
                        </p>

                        {/* Footer */}
                        <div className="mt-8 flex items-center justify-between">

                          <span
                            className="text-xs font-bold uppercase tracking-wider"
                            style={{ color: section.accent }}
                          >
                            Premium Service
                          </span>

                          <ChevronRight
                            className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                            style={{ color: section.accent }}
                          />

                        </div>
                      </div>
                    </Card>
                  ))}

                </div>
              </section>
            );
          })}

        </div>
      </section>

    </Layout>
  );
}