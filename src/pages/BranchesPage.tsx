import React from 'react';
import { Layout } from '../components/layout/Layout';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { MapPin, Phone, Clock, Navigation } from 'lucide-react';
import { BRANCHES } from '../types';
import branches from '../assets/branches.png';

export function BranchesPage() {
  return (
    <Layout>
      {/* Hero */}
<div className="relative bg-brand-dark py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
  {/* Background Image */}
  <div
    className="absolute inset-0 bg-cover bg-center opacity-10"
    style={{ backgroundImage: `url(${branches})` }}
  />
  {/* Gradient Overlay */}
  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-brand-black" />

  {/* Content */}
  <div className="relative max-w-7xl mx-auto text-center">
    <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
      Our Network
    </h1>
    <p className="text-xl text-brand-gray max-w-3xl mx-auto leading-relaxed">
      Visit one of our conveniently located service centers across Sri
      Lanka.
    </p>
  </div>
</div>
      <div className="bg-brand-black py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {BRANCHES.map((branch) =>
            <Card
              key={branch.id}
              className="overflow-hidden flex flex-col md:flex-row">

                {/* Map Placeholder */}
                <div className="relative h-64 md:h-auto md:w-1/3 rounded-2xl overflow-hidden border border-yellow-400/20">
  <iframe
    src={branch.mapEmbed}
    width="100%"
    height="100%"
    style={{ border: 0 }}
    allowFullScreen
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
  ></iframe>

  <div className="absolute bottom-4 left-4 right-4">
    <Button
      size="sm"
      variant="secondary"
      fullWidth
      className="text-xs flex items-center justify-center gap-1"
      onClick={() =>
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(branch.address)}`, "_blank")
      }
    >
      <Navigation className="w-3 h-3" />
      Get Directions
    </Button>
  </div>
</div>

                <div className="p-8 flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl font-bold text-white">
                      {branch.name}
                    </h2>
                    {branch.hasFullService ?
                  <Badge variant="warning">Full Service</Badge> :

                  <Badge variant="neutral">Tyres Only</Badge>
                  }
                  </div>

                  <div className="space-y-4 mb-8">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-brand-yellow flex-shrink-0 mt-1" />
                      <p className="text-brand-gray">{branch.address}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-brand-yellow flex-shrink-0" />
                      <p className="text-brand-gray">{branch.phone}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-brand-yellow flex-shrink-0" />
                      <p className="text-brand-gray">
                        Mon - Sat: 8:30 AM - 6:00 PM
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-6">
                    <h3 className="text-sm font-bold text-white mb-3 uppercase tracking-wider">
                      Available Services
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="neutral">Tyre Sales</Badge>
                      <Badge variant="neutral">Alignment</Badge>
                      <Badge variant="neutral">Balancing</Badge>
                      {branch.hasFullService &&
                    <>
                          <Badge variant="neutral">Mechanical Repairs</Badge>
                          <Badge variant="neutral">Hybrid Service</Badge>
                          <Badge variant="neutral">Truck & Bus</Badge>
                        </>
                    }
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>);

}