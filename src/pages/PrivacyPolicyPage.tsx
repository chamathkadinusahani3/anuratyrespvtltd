// src/pages/PrivacyPolicyPage.tsx

import React from 'react';
import { Layout } from '../components/layout/Layout';
import {
  Shield,
  Database,
  Eye,
  Cookie,
  Lock,
  Mail,
  Scale,
  Server,
  UserCheck,
} from 'lucide-react';

const PRIVACY_SECTIONS = [
  {
    title: 'Who We Are',
    icon: Shield,
    content: `
Data Controller: ANURA TYRES PVT LTD

Website: www.anuratyres.com
Email: info@anuratyres.com
Phone: +94 77 578 5785

Registered Address:
278/2 High Level Rd,
Pannipitiya,
Sri Lanka
    `,
  },
  {
    title: 'Information We Collect',
    icon: Database,
    content: `
We may collect the following personal information:

• Full name
• Phone number
• Email address
• Delivery and billing address
• Vehicle details
• Payment records
• IP address and browser information
• Messages submitted through forms
    `,
  },
  {
    title: 'How We Collect Data',
    icon: Eye,
    content: `
We collect data through:

• Website inquiry forms
• Online bookings
• Product purchases
• Cookies and analytics tools
• Third-party integrations
• Customer support interactions
    `,
  },
  {
    title: 'How We Use Your Data',
    icon: UserCheck,
    content: `
Your information may be used to:

• Process orders and bookings
• Provide customer support
• Improve our services
• Send invoices and confirmations
• Improve website functionality
• Deliver promotional offers
• Prevent fraud and misuse
    `,
  },
  {
    title: 'Cookies & Tracking',
    icon: Cookie,
    content: `
Our website uses:

• Cookies
• Google Analytics
• Facebook Pixel
• Google Ads Conversion Tracking

These technologies help improve user experience, monitor traffic, and measure advertising performance.
    `,
  },
  {
    title: 'Data Sharing',
    icon: Server,
    content: `
We do not sell personal data.

Your information may be shared with trusted third parties including:

• Payment processors
• Delivery providers
• Website hosting services
• Marketing providers
• Regulatory authorities when legally required
    `,
  },
  {
    title: 'Marketing Communications',
    icon: Mail,
    content: `
We may send promotional emails and service updates if you consent to receive marketing communications.

You may unsubscribe at any time using the unsubscribe link or by contacting us directly.
    `,
  },
  {
    title: 'Data Security',
    icon: Lock,
    content: `
We implement appropriate technical and organizational measures to protect customer data from unauthorized access, misuse, loss, or disclosure.

However, no internet transmission can be guaranteed to be completely secure.
    `,
  },
  {
    title: 'Your Rights',
    icon: Scale,
    content: `
Under the Personal Data Protection Act No. 9 of 2022 of Sri Lanka, you may request to:

• Access your personal data
• Correct inaccurate information
• Request deletion of your information
• Withdraw marketing consent
• Lodge complaints with relevant authorities
    `,
  },
];

export function PrivacyPolicyPage() {
  return (
    <Layout>

      {/* HERO */}
      <section className="relative overflow-hidden bg-black py-28 px-4 sm:px-6 lg:px-8 border-b border-white/5">

        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/80 to-black" />

          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-brand-yellow/10 blur-[140px] rounded-full" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-brand-red/10 blur-[140px] rounded-full" />
        </div>

        <div className="relative max-w-6xl mx-auto text-center">

          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-brand-yellow/10 border border-brand-yellow/20 text-brand-yellow text-xs font-bold tracking-[0.25em] uppercase mb-8">
            Privacy & Data Protection
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.95] mb-8">
            <span className="text-white">PRIVACY</span>{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-yellow via-white to-brand-red">
              POLICY
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

          {PRIVACY_SECTIONS.map((section, index) => {
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
              For privacy-related questions or requests, contact:
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