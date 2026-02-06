import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Truck, Wrench, ArrowRight } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
export function ServicesPreview() {
  const services = [
  {
    title: 'Anura Tyres',
    description:
    'Premium tyres, wheel alignment, balancing, and alloy wheels for all vehicle types.',
    icon: Car,
    color: 'text-brand-yellow',
    link: '/services#tyres'
  },
  {
    title: 'Mechanix',
    description:
    'Expert mechanical repairs, engine tune-ups, diagnostics, and full vehicle servicing.',
    icon: Wrench,
    color: 'text-brand-red',
    link: '/services#mechanix'
  },
  {
    title: 'Truck & Bus',
    description:
    'Specialized heavy vehicle care including tyres, alignment, and suspension services.',
    icon: Truck,
    color: 'text-blue-400',
    link: '/services#heavy'
  }];

  return (
    <section className="py-24 bg-brand-black relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-brand-dark to-transparent opacity-50" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Comprehensive Vehicle Care
          </h2>
          <p className="text-brand-gray text-lg">
            From routine maintenance to complex repairs, our specialized
            divisions ensure your vehicle performs at its best.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) =>
          <Card key={service.title} hoverEffect className="flex flex-col">
              <div className="p-8 flex-1 flex flex-col items-center text-center">
                <div
                className={`w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6 ${service.color}`}>

                  <service.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  {service.title}
                </h3>
                <p className="text-brand-gray mb-8 flex-1 leading-relaxed">
                  {service.description}
                </p>
                <Link to={service.link} className="w-full">
                  <Button variant="outline" fullWidth className="group">
                    Learn More
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </Card>
          )}
        </div>
      </div>
    </section>);

}