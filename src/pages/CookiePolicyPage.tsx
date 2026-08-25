// src/pages/CookiePolicyPage.tsx

import React, { useEffect, useState } from 'react';
import { Layout } from '../components/layout/Layout';
import {
  Cookie,
  Settings,
  BarChart3,
  Megaphone,
  ToggleLeft,
  Clock,
  Check,
  X,
} from 'lucide-react';

const STORAGE_KEY = 'cookie-consent';
type Consent = 'accepted' | 'declined' | null;

const COOKIE_SECTIONS = [
  {
    title: 'What Are Cookies',
    icon: Cookie,
    content: `
Cookies are small text files placed on your device when you visit our website. They help our site function properly, remember your preferences, and give us insight into how visitors use our services.
    `,
  },
  {
    title: 'Types of Cookies We Use',
    icon: Settings,
    content: `
• Essential Cookies — required for core site functionality such as navigation, account login, and booking forms. The site cannot function properly without these.

• Preference Cookies — remember choices you make (such as branch selection) to give you a more personalized experience.

We do not currently use advertising or third-party analytics cookies.
    `,
  },
  {
    title: 'First-Party Account Activity',
    icon: BarChart3,
    content: `
When you are signed in, we log certain activity to your account — such as pages viewed, searches made, and bookings started or completed. This is stored securely against your account in our database and is used only to improve our services and support you.

This activity log is not a cookie, is never shared with advertising networks, and is not used to track you across other websites.
    `,
  },
  {
    title: 'Why We Use Cookies',
    icon: Megaphone,
    content: `
We use cookies to:

• Keep you signed in
• Remember your booking progress
• Remember your preferences (e.g. branch selection)
• Improve site speed, security, and functionality
    `,
  },
  {
    title: 'Managing Cookies',
    icon: ToggleLeft,
    content: `
Most web browsers allow you to control cookies through their settings. You can:

• Block all cookies
• Delete existing cookies
• Get notified before a cookie is stored

Please note that disabling essential cookies may affect the functionality of our website, including bookings and account access.
    `,
  },
  {
    title: 'Cookie Retention',
    icon: Clock,
    content: `
Session cookies are deleted automatically when you close your browser. Persistent cookies remain on your device for a set period, or until you delete them manually, depending on their purpose.
    `,
  },
];

function CookieSettingsPanel() {
  const [consent, setConsent] = useState<Consent>(null);

  useEffect(() => {
    try {
      setConsent(localStorage.getItem(STORAGE_KEY) as Consent);
    } catch {
      // localStorage unavailable — leave as null
    }
  }, []);

  const update = (choice: 'accepted' | 'declined') => {
    try {
      localStorage.setItem(STORAGE_KEY, choice);
    } catch {
      // ignore write failures
    }
    setConsent(choice);
  };

  const statusLabel =
    consent === 'accepted' ? 'Accepted' : consent === 'declined' ? 'Declined' : 'Not set yet';

  return (
    <div className="relative overflow-hidden rounded-3xl border border-brand-yellow/20 bg-white/[0.03] backdrop-blur-xl mb-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,204,0,0.1),transparent_60%)]" />

      <div className="relative p-8 md:p-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
          <div>
            <h2 className="text-3xl font-black text-white mb-2">Cookie Settings</h2>
            <p className="text-gray-400">
              Manage your cookie preference for this browser. Current status:{' '}
              <span className="text-brand-yellow font-bold">{statusLabel}</span>
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => update('declined')}
              className={`px-5 py-2.5 rounded-xl border text-sm font-bold transition-colors ${
                consent === 'declined'
                  ? 'border-white/30 bg-white/10 text-white'
                  : 'border-white/15 text-brand-gray hover:text-white hover:bg-white/5'
              }`}
            >
              Decline
            </button>
            <button
              onClick={() => update('accepted')}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                consent === 'accepted'
                  ? 'bg-brand-yellow text-black'
                  : 'bg-brand-yellow/20 text-brand-yellow hover:bg-brand-yellow/30'
              }`}
            >
              Accept
            </button>
          </div>
        </div>

        <div className="space-y-3 border-t border-white/10 pt-6">
          <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] px-5 py-4">
            <div>
              <p className="text-white font-bold text-sm">Essential Cookies</p>
              <p className="text-gray-500 text-xs mt-0.5">Required for login, bookings, and core site features.</p>
            </div>
            <span className="flex items-center gap-1.5 text-xs font-bold text-brand-yellow shrink-0 ml-4">
              <Check className="w-4 h-4" /> Always Active
            </span>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] px-5 py-4">
            <div>
              <p className="text-white font-bold text-sm">Optional / Preference Cookies</p>
              <p className="text-gray-500 text-xs mt-0.5">Remember choices such as your preferred branch.</p>
            </div>
            <span className="flex items-center gap-1.5 text-xs font-bold shrink-0 ml-4 text-brand-gray">
              {consent === 'accepted'
                ? <><Check className="w-4 h-4 text-brand-yellow" /> Enabled</>
                : <><X className="w-4 h-4" /> Disabled</>}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CookiePolicyPage() {
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
            Cookies & Tracking
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.95] mb-8">
            <span className="text-white">COOKIE</span>{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-yellow via-white to-brand-red">
              POLICY
            </span>
          </h1>

          <p className="max-w-4xl mx-auto text-lg md:text-xl text-gray-400 leading-relaxed">
            Effective Date: August 25, 2026 | Last Updated: August 25, 2026
          </p>

        </div>
      </section>

      {/* CONTENT */}
      <section className="bg-gradient-to-b from-black via-neutral-950 to-black py-24 px-4 sm:px-6 lg:px-8">

        <div className="max-w-6xl mx-auto space-y-8">

          <CookieSettingsPanel />

          {COOKIE_SECTIONS.map((section, index) => {
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
              For questions regarding our use of cookies, contact:
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
