import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export function ServicesPreview() {
  const services = [
    {
      title: 'Anura Tyres',
      description: 'Premium tyres, wheel alignment, and alloy wheels for all vehicle types.',
      image: 'anura.png',
      accent: 'text-yellow-400',
      blobColor: 'fill-yellow-500/10',
      border: 'border-yellow-500/20',
      animation: 'slide-right'
    },
    {
      title: 'Mechanix',
      description: 'Expert mechanical repairs, engine tune-ups, and full vehicle servicing.',
      image: 'machanix.png',
      accent: 'text-red-600',
      blobColor: 'fill-red-600/10',
      border: 'border-red-600/20',
      animation: 'slide-left'
    },
    {
      title: 'Truck & Bus',
      description: 'Heavy vehicles, tire alignment, suspension and more.',
      image: 'truck.png',
      accent: 'text-blue-500',
      blobColor: 'fill-blue-500/10',
      border: 'border-blue-500/20',
      animation: 'slide-right'
    }
  ];

  // Refs for each service element
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const [visible, setVisible] = useState<boolean[]>(services.map(() => false));

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const index = refs.current.indexOf(entry.target as HTMLDivElement);
            if (index !== -1) {
              setVisible(prev => {
                const newVis = [...prev];
                newVis[index] = true;
                return newVis;
              });
            }
          }
        });
      },
      { threshold: 0.3 } // triggers when 30% visible
    );

    refs.current.forEach(ref => ref && observer.observe(ref));

    return () => {
      refs.current.forEach(ref => ref && observer.unobserve(ref));
    };
  }, []);

  return (
    <section className="py-24 bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 space-y-16">

        {/* SECTION HEADING */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Comprehensive Vehicle Care
          </h2>
          <p className="text-zinc-400 text-xl md:text-2xl italic leading-relaxed">
            From routine maintenance to complex repairs, our specialized divisions ensure your vehicle performs at its best.
          </p>
        </div>

        {/* SERVICE CARDS */}
        {services.map((service, index) => (
          <div
            key={service.title}
            ref={el => (refs.current[index] = el)}
            className={`relative flex flex-col md:flex-row items-center min-h-[500px] w-full ${
              index % 2 !== 0 ? 'md:flex-row-reverse' : ''
            }`}
          >
            {/* MAIN CONTAINER */}
            <div className={`absolute inset-0 bg-zinc-900/40 border ${service.border} rounded-[60px] md:rounded-[100px] -z-10`} />

            {/* DECORATIVE BLOB */}
            <div className={`absolute inset-0 opacity-40 -z-10 overflow-hidden rounded-[60px] md:rounded-[100px]`}>
              <svg viewBox="0 0 500 500" className={`absolute -right-20 -bottom-20 w-[120%] h-[120%] ${service.blobColor}`}>
                <path d="M414,332.5Q372,415,283.5,431Q195,447,133,382Q71,317,89,232.5Q107,148,188,111Q269,74,362.5,112Q456,150,435,241.25Q414,332.5Z" />
              </svg>
            </div>

            {/* IMAGE / CLIPART */}
            <div
              className={`w-full md:w-1/2 flex justify-center p-8 md:p-12 relative transition-all duration-1000 ${
                visible[index]
                  ? 'translate-x-0 opacity-100'
                  : service.animation === 'slide-left'
                  ? '-translate-x-20 opacity-0'
                  : 'translate-x-20 opacity-0'
              }`}
            >
              <img
                src={service.image}
                alt={service.title}
                className="max-h-[350px] w-auto drop-shadow-2xl z-20 transform hover:scale-105 transition-transform duration-500"
              />
              <div className={`absolute top-1/4 left-1/4 w-12 h-12 rounded-full blur-2xl ${service.accent.replace('text', 'bg')} opacity-30 animate-pulse`} />
            </div>

            {/* TEXT */}
            <div
              className={`w-full md:w-1/2 p-10 md:p-20 z-20 transition-all duration-1000 ${
                visible[index]
                  ? 'translate-x-0 opacity-100'
                  : service.animation === 'slide-left'
                  ? '-translate-x-20 opacity-0'
                  : 'translate-x-20 opacity-0'
              }`}
            >
              <h3 className={`text-5xl md:text-6xl font-bold mb-6 tracking-tight ${service.accent}`}>
                {service.title}
              </h3>
              <p className="text-zinc-400 text-xl italic leading-relaxed mb-10 max-w-md">
                {service.description}
              </p>
              <Link
                to="/services"
                className={`group flex items-center text-xl font-bold uppercase tracking-widest ${service.accent}`}
              >
                Learn more
                <div className={`ml-4 p-2 rounded-full border ${service.border} group-hover:translate-x-3 transition-all duration-300`}>
                  <ArrowRight className="w-6 h-6" />
                </div>
              </Link>
            </div>

          </div>
        ))}
      </div>
    </section>
  );
}