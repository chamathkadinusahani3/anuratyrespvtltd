import React from 'react';
import { Layout } from '../components/layout/Layout';
import { Card } from '../components/ui/Card';
import { ShieldCheck, Users, Trophy, History, ArrowRight } from 'lucide-react';
import { useActivityTracker } from '../hooks/useActivityTracker';
import { Link } from 'react-router-dom';

export function AboutPage() {
  useActivityTracker({ type: 'page_view', page: '/about' });

  return (
    <Layout>
      {/* HERO */}
      <section className="relative bg-black py-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black to-black" />

        <div className="relative max-w-7xl mx-auto text-center">
          <p className="text-brand-yellow text-xs tracking-[0.35em] uppercase mb-4">
            About Anura Tyres
          </p>

          <h1 className="text-4xl md:text-7xl font-black mb-6 tracking-tight text-white">
            Driven by <span className="text-brand-yellow">Excellence</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Since 1983, Anura Tyres has been Sri Lanka's trusted partner for premium vehicle care,
            combining expert craftsmanship with world-class automotive technology.
          </p>
        </div>
      </section>

      {/* VALUES */}
      <section className="bg-black py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-brand-yellow text-xs tracking-[0.35em] uppercase mb-3">
              Why Choose Us
            </p>
            <h2 className="text-3xl md:text-5xl font-black text-white">
              Built on Trust & Performance
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: History,
                title: '43+ Years',
                desc: 'Decades of experience serving Sri Lankan motorists with integrity.',
                color: 'text-brand-yellow',
                bg: 'bg-brand-yellow/10'
              },
              {
                icon: ShieldCheck,
                title: 'Quality First',
                desc: 'Authorized dealer for world-renowned tyre and automotive brands.',
                color: 'text-brand-red',
                bg: 'bg-brand-red/10'
              },
              {
                icon: Users,
                title: 'Expert Team',
                desc: 'Highly trained technicians certified in modern automotive systems.',
                color: 'text-blue-400',
                bg: 'bg-blue-500/10'
              },
              {
                icon: Trophy,
                title: 'Award Winning',
                desc: 'Recognized for excellence in service and technical standards.',
                color: 'text-green-400',
                bg: 'bg-green-500/10'
              }
            ].map((item, i) => (
              <Card
                key={i}
                className="p-6 bg-neutral-900/60 border border-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${item.bg}`}>
                  <item.icon className={`w-7 h-7 ${item.color}`} />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* STORY */}
      <section className="bg-black py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

          <div>
            <p className="text-brand-yellow text-xs tracking-[0.35em] uppercase mb-3">
              Our Journey
            </p>

            <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
              From Small Workshop to National Brand
            </h2>

            <div className="space-y-5 text-gray-400 leading-relaxed">
              <p>
                Anura Tyres Pvt Ltd was founded in 1983 as an authorized dealer for tyres, tubes,
                flaps, and batteries. Over time, we built strong partnerships with leading importers
                and manufacturers across multiple brands.
              </p>

              <p>
                In 2017, we expanded with Tyre Station Private Limited, strengthening our service
                network and technical capabilities. Continuous innovation helped us grow beyond Sri Lanka.
              </p>

              <p>
                Today, our journey includes international expansion with NuTyre Private Limited in the UK,
                built on Vision, Integrity, Professionalism, and Service Excellence.
              </p>
            </div>

            <div className="mt-8 flex gap-4">
              <Link
                to="/services"
                className="inline-flex items-center gap-2 bg-brand-yellow text-black font-bold px-6 py-3 rounded-xl hover:bg-white transition"
              >
                Explore Services <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/branches"
                className="inline-flex items-center gap-2 border border-white/20 text-white px-6 py-3 rounded-xl hover:bg-white hover:text-black transition"
              >
                Find Branches
              </Link>
            </div>
          </div>

          {/* IMAGE */}
          <div className="relative">
            <div className="absolute -inset-3 bg-gradient-to-r from-brand-yellow/20 to-brand-red/20 blur-2xl rounded-3xl" />
            <img
              src="./hero-bg.png"
              alt="Workshop"
              className="relative rounded-2xl border border-white/10 shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-black py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center bg-neutral-900/40 border border-white/10 rounded-3xl p-10 md:p-16">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
            Experience True Automotive Care
          </h2>

          <p className="text-gray-400 max-w-2xl mx-auto mb-8">
            Book your service today and experience professional tyre and vehicle care trusted for decades.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/booking">
              <button className="bg-brand-yellow text-black font-bold px-8 py-4 rounded-xl hover:bg-white transition">
                Book Appointment
              </button>
            </Link>

            <Link to="/contact">
              <button className="border border-white/20 text-white px-8 py-4 rounded-xl hover:bg-white hover:text-black transition">
                Contact Us
              </button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}