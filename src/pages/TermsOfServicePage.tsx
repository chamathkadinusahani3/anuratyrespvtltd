import React from 'react';
import { Layout } from '../components/layout/Layout';
import {
  ShieldCheck,
  FileText,
  AlertTriangle,
  Scale,
  Lock,
  RefreshCcw,
  ChevronRight,
} from 'lucide-react';

const TERMS_SECTIONS = [
  {
    title: 'Website Usage',
    icon: ShieldCheck,
    description:
      'By using our website, you agree not to misuse the platform, attempt unauthorized access, submit fraudulent inquiries, upload harmful material, or copy protected content.',
  },
  {
    title: 'Bookings & Appointments',
    icon: FileText,
    description:
      'Online bookings and service requests are subject to availability. We reserve the right to reschedule or cancel appointments when necessary.',
  },
  {
    title: 'Payments & Pricing',
    icon: Scale,
    description:
      'We accept cash payments, card payments, and bank transfers. Prices may change without prior notice depending on product availability and market conditions.',
  },
  {
    title: 'Warranty & Returns',
    icon: RefreshCcw,
    description:
      'Warranty coverage depends on manufacturer policies and service categories. Returns may be refused for damaged or misused products.',
  },
  {
    title: 'Limitation of Liability',
    icon: AlertTriangle,
    description:
      'ANURA TYRES PVT LTD shall not be responsible for indirect damages, delays beyond our control, or issues caused by pre-existing vehicle defects.',
  },
  {
    title: 'Privacy & Security',
    icon: Lock,
    description:
      'We implement reasonable measures to protect customer information and maintain secure business operations.',
  },
];

export function TermsOfServicePage() {
  return (
    <Layout>

      {/* HERO */}
      <section className="relative overflow-hidden bg-black py-28 px-4 sm:px-6 lg:px-8 border-b border-white/5">

        {/* Background */}
        <div className="absolute inset-0">

          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/80 to-black" />

          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-brand-yellow/10 blur-[140px] rounded-full" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-brand-red/10 blur-[140px] rounded-full" />

        </div>

        <div className="relative max-w-6xl mx-auto text-center">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-brand-yellow/10 border border-brand-yellow/20 text-brand-yellow text-xs font-bold tracking-[0.25em] uppercase mb-8">
            Legal Information
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.95] mb-8">
            <span className="text-white">TERMS OF</span>{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-yellow via-white to-brand-red">
              SERVICE
            </span>
          </h1>

          {/* Description */}
          <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-400 leading-relaxed">
            Please read these Terms of Service carefully before using the
            ANURA TYRES PVT LTD website, products, or services.
          </p>

        </div>
      </section>

      {/* CONTENT */}
      <section className="bg-gradient-to-b from-black via-neutral-950 to-black py-24 px-4 sm:px-6 lg:px-8">

        <div className="max-w-6xl mx-auto">

          {/* Intro Card */}
          <div className="mb-16 bg-white/[0.03] border border-white/10 rounded-3xl p-8 backdrop-blur-xl">

            <h2 className="text-3xl font-black text-white mb-6">
              Agreement Overview
            </h2>

            <p className="text-gray-400 leading-relaxed text-lg">
              By accessing or using our website and services, you agree to comply
              with these Terms of Service. These terms govern all bookings,
              purchases, inquiries, and interactions with ANURA TYRES PVT LTD.
            </p>

          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {TERMS_SECTIONS.map((section, index) => {
              const Icon = section.icon;

              return (
                <div
                  key={index}
                  className="group relative overflow-hidden border border-white/10 bg-neutral-900/70 backdrop-blur-xl rounded-3xl hover:border-white/20 transition-all duration-500 hover:-translate-y-1"
                >

                  {/* Glow */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-[radial-gradient(circle_at_top_right,rgba(255,204,0,0.12),transparent_60%)]" />

                  <div className="relative p-8">

                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-brand-yellow/10 border border-brand-yellow/20 mb-6">
                      <Icon className="w-7 h-7 text-brand-yellow" />
                    </div>

                    <h3 className="text-2xl font-black text-white mb-4">
                      {section.title}
                    </h3>

                    <p className="text-gray-400 leading-relaxed">
                      {section.description}
                    </p>


                  </div>
                </div>
              );
            })}

          </div>

          {/* Footer */}
          <div className="mt-20 bg-white/[0.03] border border-white/10 rounded-3xl p-8 text-center">

            <h3 className="text-3xl font-black text-white mb-4">
              Contact Information
            </h3>

            <p className="text-gray-400 leading-relaxed mb-6">
              If you have questions regarding our Terms of Service, please contact us.
            </p>

            <div className="space-y-2 text-gray-300">
              <p>ANURA TYRES PVT LTD</p>
              <p>info@anuratyres.com</p>
              <p>+94 77 578 5785</p>
              <p>www.anuratyres.com</p>
            </div>

          </div>

        </div>

      </section>

    </Layout>
  );
}