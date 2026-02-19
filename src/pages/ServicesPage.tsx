import React from 'react';
import { Layout } from '../components/layout/Layout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';
import { Car, Wrench, Truck, CheckCircle } from 'lucide-react';
import { SERVICES, SERVICE_CATEGORIES } from '../types';
import services from '../assets/services.png';
export function ServicesPage() {
  return (
    <Layout>

{/* Hero */}
<div className="relative bg-black py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
  {/* Background Image */}
  <div
    className="absolute inset-0 bg-cover bg-center opacity-10"
    style={{ backgroundImage: `url(${services})` }}
  />
  {/* Gradient Overlay */}
  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black" />

  {/* Content */}
  <div className="relative max-w-7xl mx-auto text-center">
    <h1 className="text-4xl md:text-7xl font-black mb-6 uppercase tracking-tighter
    text-transparent bg-clip-text bg-gradient-to-r 
    from-[#FFCC00] from-10% 
    via-[#FFFFFF] via-50% 
    to-[#FF0000] to-90%
    animate-gradient-move">
    Our Services
  </h1>
  
    <p className="text-xl text-brand-gray max-w-3xl mx-auto leading-relaxed">
      Comprehensive automotive care delivered by certified experts using
              state-of-the-art equipment.
    </p>
  </div>
</div>
      <div className="bg-black py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          

          <div className="space-y-24">
            {/* Anura Tyres Section */}
            <section id="tyres" className="scroll-mt-24">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-brand-yellow rounded-xl flex items-center justify-center text-brand-black">
                  <Car className="w-6 h-6" />
                </div>
                <h2 className="text-3xl font-bold text-white">Anura Tyres</h2><br />
               
              </div>
              <div className="flex items-center gap-4 mb-8">
                   <Link to="/booking">
                          <Button
                          variant="outline"
                          size="sm"
                          className="w-full border-brand-red text-brand-red hover:bg-brand-red hover:text-white">

                            Book Service
                          </Button>
                        </Link>
                        <Link to="/contact">
                          <Button
                          variant="outline"
                          size="sm"
                          className="w-full border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white">

                            Contact for Quote
                          </Button>
                        </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {SERVICES.filter((s) => s.category === 'Anura Tyres').map(
                  (service) =>
                  <Card key={service.id} hoverEffect className="h-full">
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-white mb-3">
                          {service.name}
                        </h3>
                        <p className="text-brand-gray mb-4">
                          {service.description}
                        </p>
                      </div>
                    </Card>

                )}
              </div>
            </section>

            {/* Mechanix Section */}
            <section id="mechanix" className="scroll-mt-24">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-brand-red rounded-xl flex items-center justify-center text-white">
                  <Wrench className="w-6 h-6" />
                </div>
                <h2 className="text-3xl font-bold text-white">Mechanix</h2>
                <span className="text-sm text-brand-red border border-brand-red px-3 py-1 rounded-full">
                  Pannipitiya Only
                </span>
               
              </div>
              <div className="flex items-center gap-4 mb-8">
                   <Link to="/booking">
                          <Button
                          variant="outline"
                          size="sm"
                          className="w-full border-brand-red text-brand-red hover:bg-brand-red hover:text-white">

                            Book Service
                          </Button>
                        </Link>
                        <Link to="/contact">
                          <Button
                          variant="outline"
                          size="sm"
                          className="w-full border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white">

                            Contact for Quote
                          </Button>
                        </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {SERVICES.filter((s) => s.category === 'Mechanix').map(
                  (service) =>
                  <Card
                    key={service.id}
                    hoverEffect
                    className="h-full border-brand-red/10">

                      <div className="p-6">
                        <h3 className="text-xl font-bold text-white mb-3">
                          {service.name}
                        </h3>
                        <p className="text-brand-gray mb-4">
                          {service.description}
                        </p>
                                                
                        
                      </div>
                    </Card>

                )}
              </div>
            </section>

            {/* Truck & Bus Section */}
            <section id="heavy" className="scroll-mt-24">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white">
                  <Truck className="w-6 h-6" />
                </div>
                <h2 className="text-3xl font-bold text-white">Truck & Bus</h2>
                <span className="text-sm text-blue-400 border border-blue-500 px-3 py-1 rounded-full">
                  Pannipitiya Only
                </span>
        
              </div>
                  <div className="flex items-center gap-4 mb-8">
                   <Link to="/booking">
                          <Button
                          variant="outline"
                          size="sm"
                          className="w-full border-brand-red text-brand-red hover:bg-brand-red hover:text-white">

                            Book Service
                          </Button>
                        </Link>
                        <Link to="/contact">
                          <Button
                          variant="outline"
                          size="sm"
                          className="w-full border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white">

                            Contact for Quote
                          </Button>
                        </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {SERVICES.filter((s) => s.category === 'Truck & Bus').map(
                  (service) =>
                  <Card
                    key={service.id}
                    hoverEffect
                    className="h-full border-blue-500/10">

                      <div className="p-6">
                        <h3 className="text-xl font-bold text-white mb-3">
                          {service.name}
                        </h3>
                        <p className="text-brand-gray mb-4">
                          {service.description}
                        </p>
                      </div>
                    </Card>

                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </Layout>);

}