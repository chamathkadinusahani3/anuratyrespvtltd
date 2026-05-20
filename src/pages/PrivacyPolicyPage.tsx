import React from 'react';
import { Layout } from '../components/layout/Layout';
import {
  Shield,
  Database,
  Lock,
  Eye,
  Cookie,
  Mail,
  ChevronRight,
} from 'lucide-react';

const PRIVACY_SECTIONS = [
  {
    title: 'Information We Collect',
    icon: Database,
    description:
      'We may collect personal information such as names, email addresses, phone numbers, addresses, vehicle details, and payment information.',
  },
  {
    title: 'How We Use Data',
    icon: Eye,
    description:
      'Customer data is used to process bookings, provide services, improve website performance, and deliver better customer experiences.',
  },
  {
    title: 'Cookies & Tracking',
    icon: Cookie,
    description:
      'Our website uses cookies, Google Analytics, Facebook Pixel, and Google Ads tracking to improve website functionality and advertising performance.',
  },
  {
    title: 'Data Security',
    icon: Lock,
    description:
      'We implement reasonable security measures to protect customer data from unauthorized access, misuse, or loss.',
  },
  {
    title: 'Marketing Communications',
    icon: Mail,
    description:
      'We may send promotional emails and service updates. Customers may unsubscribe from marketing communications at any time.',
  },
  {
    title: 'Privacy Protection',
    icon: Shield,
    description:
      'We are committed to protecting your privacy and handling customer information responsibly and transparently.',
  },
];

export function PrivacyPolicyPage() {
  return (
    <Layout>

      {/* HERO */}
      <section className="relative overflow-hidden bg-black py-28 px-4 sm:px-6 lg:px-8 border-b border-white/5">

        <div className="absolute inset-0">

          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/80 to-black" />

          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-brand-yellow/10 blur-[140px] rounded-full" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-brand-red/10 blur-[140px] rounded-full" />

        </div>

        <div className="relative max-w-6xl mx-auto text-center">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-brand-yellow/10 border border-brand-yellow/20 text-brand-yellow text-xs font-bold tracking-[0.25em] uppercase mb-8">
            Data Protection
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.95] mb-8">
            <span className="text-white">PRIVACY</span>{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-yellow via-white to-brand-red">
              POLICY
            </span>
          </h1>

          {/* Description */}
          <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-400 leading-relaxed">
            Learn how ANURA TYRES PVT LTD collects, uses, and protects your
            personal information.
          </p>

        </div>
      </section>

      {/* CONTENT */}
      <section className="bg-gradient-to-b from-black via-neutral-950 to-black py-24 px-4 sm:px-6 lg:px-8">

        <div className="max-w-6xl mx-auto">

          {/* Intro */}
          <div className="mb-16 bg-white/[0.03] border border-white/10 rounded-3xl p-8 backdrop-blur-xl">

            <h2 className="text-3xl font-black text-white mb-6">
              Your Privacy Matters
            </h2>

            <p className="text-gray-400 leading-relaxed text-lg">
              ANURA TYRES PVT LTD is committed to safeguarding customer
              information and maintaining transparency about how data is collected,
              stored, and used.
            </p>

          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {PRIVACY_SECTIONS.map((section, index) => {
              const Icon = section.icon;

              return (
                <div
                  key={index}
                  className="group relative overflow-hidden border border-white/10 bg-neutral-900/70 backdrop-blur-xl rounded-3xl hover:border-white/20 transition-all duration-500 hover:-translate-y-1"
                >

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
              Contact Us
            </h3>

            <p className="text-gray-400 leading-relaxed mb-6">
              If you have any questions regarding this Privacy Policy or your data,
              please contact us.
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