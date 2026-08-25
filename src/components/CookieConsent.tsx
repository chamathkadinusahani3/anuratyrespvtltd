import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Cookie } from 'lucide-react';

const STORAGE_KEY = 'cookie-consent';

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) setVisible(true);
  }, []);

  const respond = (choice: 'accepted' | 'declined') => {
    localStorage.setItem(STORAGE_KEY, choice);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto rounded-2xl border border-white/10 bg-neutral-950/95 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">

        <div className="w-11 h-11 rounded-xl bg-brand-yellow/10 border border-brand-yellow/20 flex items-center justify-center shrink-0">
          <Cookie className="w-5 h-5 text-brand-yellow" />
        </div>

        <p className="text-sm text-brand-gray leading-relaxed flex-1">
          We use essential cookies to keep the site running smoothly, such as signing you in and remembering your booking progress. Read our{' '}
          <Link to="/cookie-policy" className="text-brand-yellow hover:underline">
            Cookie Policy
          </Link>{' '}
          to learn more.
        </p>

        <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
          <button
            onClick={() => respond('declined')}
            className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl border border-white/15 text-sm font-bold text-brand-gray hover:text-white hover:bg-white/5 transition-colors"
          >
            Decline
          </button>
          <button
            onClick={() => respond('accepted')}
            className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-brand-yellow text-black text-sm font-bold hover:bg-white transition-colors"
          >
            Accept
          </button>
        </div>

      </div>
    </div>
  );
}
