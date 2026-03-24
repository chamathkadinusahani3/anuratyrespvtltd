import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight } from 'lucide-react';

const SERVICES = [
  {
    title: 'Anura Tyres',
    tagline: 'Precision. Performance. Grip.',
    description: 'Premium tyres, wheel alignment, balancing and alloy wheels for all vehicle types — passenger cars to heavy vehicles.',
    image: 'anura.png',
    accentColor: 'brand-yellow',
    accentHex: '#FFCC00',
    tag: 'Tyres & Wheels',
  },
  {
    title: 'Mechanix',
    tagline: 'Engineered to Last.',
    description: 'Expert mechanical repairs, engine tune-ups, suspension work and full vehicle servicing by certified technicians.',
    image: 'machanix.png',
    accentColor: 'brand-red',
    accentHex: '#FF0000',
    tag: 'Mechanical Services',
  },
  {
    title: 'Truck & Bus',
    tagline: 'Built for the Long Haul.',
    description: 'Heavy vehicle tyre fitting, alignment, suspension overhaul and fleet maintenance — keeping commercial fleets moving.',
    image: 'truck.png',
    accentColor: 'blue-400',
    accentHex: '#60a5fa',
    tag: 'Heavy Vehicles',
  },
];

export function ServicesPreview() {
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const [visible, setVisible] = useState<boolean[]>(SERVICES.map(() => false));

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          const index = refs.current.indexOf(entry.target as HTMLDivElement);
          if (entry.isIntersecting && index !== -1) {
            setVisible(prev => { const n = [...prev]; n[index] = true; return n; });
          }
        });
      },
      { threshold: 0.25 }
    );
    refs.current.forEach(r => r && observer.observe(r));
    return () => refs.current.forEach(r => r && observer.unobserve(r));
  }, []);

  return (
    <section className="py-20 bg-black px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Section header */}
        <div className="mb-16">
          <p className="text-brand-yellow text-xs font-bold tracking-[0.3em] uppercase mb-3">What We Do</p>
          <div className="flex items-end justify-between">
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
              COMPREHENSIVE <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-yellow to-brand-red">VEHICLE CARE</span>
            </h2>
            <Link
              to="/services"
              className="hidden md:flex items-center gap-2 text-sm text-gray-400 hover:text-brand-yellow transition-colors duration-200 font-medium group"
            >
              All services
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </div>
        </div>

        {/* Service rows */}
        <div className="space-y-5">
          {SERVICES.map((service, index) => {
            const isEven = index % 2 === 0;
            return (
              <div
                key={service.title}
                ref={el => (refs.current[index] = el)}
                className={`group bg-neutral-900 border border-white/8 rounded-2xl overflow-hidden hover:border-white/15 transition-all duration-500 hover:shadow-[0_4px_40px_rgba(0,0,0,0.4)]
                  flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}
              >
                {/* Image panel */}
                <div
                  className={`relative w-full md:w-2/5 min-h-[260px] flex items-center justify-center overflow-hidden bg-neutral-800
                    transition-all duration-1000
                    ${visible[index] ? 'opacity-100 translate-x-0' : isEven ? 'opacity-0 -translate-x-8' : 'opacity-0 translate-x-8'}`}
                >
                  {/* Accent glow behind image */}
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{ background: `radial-gradient(circle at center, ${service.accentHex}40 0%, transparent 70%)` }}
                  />
                  <img
                    src={service.image}
                    alt={service.title}
                    className="relative z-10 max-h-52 w-auto object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Tag pill overlaid on image */}
                  <span
                    className="absolute bottom-4 left-4 text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full border"
                    style={{ color: service.accentHex, borderColor: `${service.accentHex}40`, backgroundColor: `${service.accentHex}12` }}
                  >
                    {service.tag}
                  </span>
                </div>

                {/* Text panel */}
                <div
                  className={`flex-1 p-8 md:p-12 flex flex-col justify-center
                    transition-all duration-1000 delay-100
                    ${visible[index] ? 'opacity-100 translate-x-0' : isEven ? 'opacity-0 translate-x-8' : 'opacity-0 -translate-x-8'}`}
                >
                  {/* Accent top bar */}
                  <div
                    className="w-10 h-[3px] rounded-full mb-5"
                    style={{ backgroundColor: service.accentHex }}
                  />

                  <p
                    className="text-xs font-bold tracking-[0.25em] uppercase mb-2"
                    style={{ color: service.accentHex }}
                  >
                    {service.tagline}
                  </p>

                  <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-4">
                    {service.title}
                  </h3>

                  <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-md">
                    {service.description}
                  </p>

                  <Link
                    to="/services"
                    className="inline-flex items-center gap-2 text-sm font-bold transition-colors duration-200 group/link w-fit"
                    style={{ color: service.accentHex }}
                  >
                    Learn more
                    <span
                      className="w-7 h-7 rounded-full border flex items-center justify-center group-hover/link:translate-x-1 transition-transform duration-200"
                      style={{ borderColor: `${service.accentHex}40` }}
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile CTA */}
        <div className="mt-8 md:hidden text-center">
          <Link to="/services" className="inline-flex items-center gap-2 text-sm text-brand-yellow font-semibold">
            All services <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}