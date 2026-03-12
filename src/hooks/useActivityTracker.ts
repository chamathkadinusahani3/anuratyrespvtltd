// src/hooks/useActivityTracker.ts
import { useEffect, useRef } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';

export interface ActivityEvent {
  type:
    | 'page_view'
    | 'service_view'
    | 'tyre_search'
    | 'booking_started'
    | 'booking_completed'
    | 'product_view'
    | 'branch_view'
    | 'price_check'
    | 'offer_view'
    | 'contact_form'
    | 'inquiry';
  page?: string;
  item?: string;
  detail?: string;
  branch?: string;
}

// ─── Write one activity doc — never throws ────────────────────────────────────
async function writeActivity(uid: string, event: ActivityEvent) {
  try {
    if (!uid || !event?.type) return;
    await addDoc(collection(db, 'users', uid, 'activity'), {
      ...event,
      timestamp: serverTimestamp(),
    });
  } catch {
    // Silently ignore — tracking must never crash the page
  }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
// Usage:
//   const { track } = useActivityTracker({ type: 'page_view', page: '/services' });
//   track({ type: 'tyre_search', item: query });
export function useActivityTracker(event?: ActivityEvent) {
  const { user, loading } = useAuth();
  const tracked = useRef(false); // prevent double-fire in StrictMode

  useEffect(() => {
    // Wait until auth is resolved and user is logged in
    if (loading) return;
    if (!user?.uid) return;
    if (!event) return;
    if (tracked.current) return;

    tracked.current = true;
    writeActivity(user.uid, event);
  }, [loading, user?.uid]); // eslint-disable-line react-hooks/exhaustive-deps

  // Bound manual tracker — safe to call from anywhere
  const track = (e: ActivityEvent) => {
    if (!user?.uid) return; // not logged in — silently skip
    writeActivity(user.uid, e);
  };

  return { track };
}