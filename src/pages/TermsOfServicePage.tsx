// src/pages/TermsOfServicePage.tsx

import React from 'react';
import { Layout } from '../components/layout/Layout';
import {
  ShieldCheck,
  Scale,
  FileText,
  AlertTriangle,
  Truck,
  CreditCard,
  RefreshCcw,
  Gavel,
} from 'lucide-react';

const TERMS_SECTIONS = [
  {
    title: 'About Us',
    icon: ShieldCheck,
    content: `
ANURA TYRES PVT LTD is a Sri Lankan automotive tyre and vehicle service company operating multiple branches across the country.

Company Name: ANURA TYRES PVT LTD
Website: www.anuratyres.com
Email: info@anuratyres.com
Phone: +94 77 578 5785

Main Branch:
278/2 High Level Rd,
Pannipitiya,
Sri Lanka
    `,
  },
  {
    title: 'Our Services',
    icon: FileText,
    content: `
Anura Tyres provides the following products and services through physical branches and online platforms:

• Sale of new tyres and replacement tyres
• Wheel alignment and balancing
• Puncture repairs
• Alloy wheels
• Automotive batteries
• Brake services
• Suspension repairs
• Diagnostics and vehicle servicing
• Heavy vehicle tyre and fleet support
• Online inquiries and service bookings
    `,
  },
  {
    title: 'Orders & Payments',
    icon: CreditCard,
    content: `
Orders placed online are subject to product availability and service confirmation.

Prices displayed on our website are in Sri Lankan Rupees (LKR) and may change without prior notice.

Accepted payment methods include:
• Cash payments
• Bank transfers
• Debit/Credit cards

We reserve the right to refuse or cancel orders where fraud, pricing errors, or unavailable products are identified.
    `,
  },
  {
    title: 'Delivery & Installation',
    icon: Truck,
    content: `
Delivery timelines are estimates only and may vary depending on location, stock availability, and third-party logistics.

Tyre fitting and installation services should be performed by qualified technicians for safety compliance.

Anura Tyres shall not be responsible for delays caused by:
• Weather conditions
• Transport disruptions
• Supplier delays
• Events beyond our control
    `,
  },
  {
    title: 'Returns & Warranty',
    icon: RefreshCcw,
    content: `
Products may be returned within 7 days of purchase if:
• The product is unused
• Original packaging is intact
• Valid proof of purchase is provided

Tyres that have been mounted, damaged, or used are not eligible for return unless a manufacturing defect exists.

Manufacturer warranties apply where applicable.
    `,
  },
  {
    title: 'Pricing & Promotions',
    icon: Scale,
    content: `
We reserve the right to:
• Modify product pricing
• Update promotions
• Change service fees
• Cancel promotional campaigns

Promotional offers cannot be applied retrospectively after expiration.
    `,
  },
  {
    title: 'Limitation of Liability',
    icon: AlertTriangle,
    content: `
To the maximum extent permitted under Sri Lankan law, ANURA TYRES PVT LTD shall not be liable for:

• Indirect or consequential damages
• Vehicle issues caused by pre-existing defects
• Delays outside reasonable control
• Business interruptions or loss of profits

Total liability shall not exceed the amount paid for the relevant service or product.
    `,
  },
  {
    title: 'Governing Law',
    icon: Gavel,
    content: `
These Terms of Service are governed by the laws of the Democratic Socialist Republic of Sri Lanka.

Any disputes arising from the use of our services shall fall under the jurisdiction of Sri Lankan courts.
    `,
  },
];

export function TermsOfServicePage() {
  return (
    <Layout
      title="Terms of Service"
      description="Read the terms of service governing the use of Anura Tyres (Pvt) Ltd's products, services, and website."
    >

      {/* HERO */}
      <section className="relative overflow-hidden bg-black py-28 px-4 sm:px-6 lg:px-8 border-b border-white/5">

        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/80 to-black" />

          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-brand-yellow/10 blur-[140px] rounded-full" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-brand-red/10 blur-[140px] rounded-full" />
        </div>

        <div className="relative max-w-6xl mx-auto text-center">

          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-brand-yellow/10 border border-brand-yellow/20 text-brand-yellow text-xs font-bold tracking-[0.25em] uppercase mb-8">
            Legal Information
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.95] mb-8">
            <span className="text-white">TERMS OF</span>{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-yellow via-white to-brand-red">
              SERVICE
            </span>
          </h1>

          <p className="max-w-4xl mx-auto text-lg md:text-xl text-gray-400 leading-relaxed">
            Effective Date: May 27, 2026 | Last Updated: May 27, 2026
          </p>

        </div>
      </section>

      {/* CONTENT */}
      <section className="bg-gradient-to-b from-black via-neutral-950 to-black py-24 px-4 sm:px-6 lg:px-8">

        <div className="max-w-6xl mx-auto space-y-8">

          {TERMS_SECTIONS.map((section, index) => {
            const Icon = section.icon;

            return (
              <div
                key={index}
                className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl"
              >

                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,204,0,0.08),transparent_60%)]" />

                <div className="relative p-8 md:p-10">

                  <div className="flex items-start gap-5">

                    <div className="w-16 h-16 rounded-2xl bg-brand-yellow/10 border border-brand-yellow/20 flex items-center justify-center shrink-0">
                      <Icon className="w-8 h-8 text-brand-yellow" />
                    </div>

                    <div className="flex-1">

                      <h2 className="text-3xl font-black text-white mb-6">
                        {index + 1}. {section.title}
                      </h2>

                      <div className="text-gray-400 leading-relaxed whitespace-pre-line text-base md:text-lg">
                        {section.content}
                      </div>

                    </div>

                  </div>

                </div>

              </div>
            );
          })}

          {/* CONTACT */}
          <div className="mt-16 rounded-3xl border border-white/10 bg-gradient-to-r from-brand-yellow/10 to-brand-red/10 p-10 text-center">

            <h2 className="text-4xl font-black text-white mb-5">
              Contact Us
            </h2>

            <p className="text-gray-300 text-lg mb-6">
              For questions regarding these Terms of Service, contact:
            </p>

            <div className="space-y-2 text-white">
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