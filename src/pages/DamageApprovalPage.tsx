// DamageApprovalPage.tsx — Customer-facing damage inspection approval page
// Route: /approve/:inspectionId
// Standalone page — no Navbar/Footer, mobile-first

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  CheckCircle, XCircle, Phone, AlertTriangle, Car, Wrench,
  DollarSign, ChevronDown, ChevronUp,
  Loader2, ThumbsUp, ThumbsDown, Info,
} from 'lucide-react';
import logo from '../assets/logo.png';

const API = 'https://anuratyres-backend-emm1774.vercel.app/api';

// ─── Types ─────────────────────────────────────────────────────────────────────
type Severity = 'Low' | 'Medium' | 'High' | 'Critical';
type Decision = 'approved' | 'rejected';

interface DamageReport {
  id: string; title: string; category: string;
  severity: Severity; description: string;
  recommendedRepair: string; additionalCost: number;
}
interface MediaFile {
  id: string; type: 'image' | 'video'; name: string;
  data?: string; url?: string;
}
interface JobSummary {
  jobNumber: string; customerName: string; vehicleReg: string;
  vehicleMake: string; vehicleModel: string; currentService: string;
  originalCost: number; technician: string; branch: string;
}
interface Inspection {
  id: string;
  jobSummary: JobSummary;
  damageReports: DamageReport[];
  mediaFiles: MediaFile[];
  techNotes: string;
  quotationItems: Array<{ id: string; item: string; qty: number; unitPrice: number; labourCost: number }>;
  approvalStatus: string;
  approvalTimestamps: Record<string, string>;
  auditTrail: Array<{ id: string; user: string; action: string; date: string; time: string }>;
  timeline: Array<{ id: string; label: string; user: string; timestamp: string; status: string; color: string }>;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmtCurrency(n: number) {
  return `Rs. ${(n || 0).toLocaleString()}`;
}

const SEV: Record<Severity, { label: string; bg: string; text: string; border: string; dot: string }> = {
  Low:      { label: 'Low',      bg: 'bg-green-950/60',  text: 'text-green-400',  border: 'border-green-800/50',  dot: 'bg-green-500' },
  Medium:   { label: 'Medium',   bg: 'bg-yellow-950/60', text: 'text-yellow-400', border: 'border-yellow-800/50', dot: 'bg-yellow-500' },
  High:     { label: 'High',     bg: 'bg-orange-950/60', text: 'text-orange-400', border: 'border-orange-800/50', dot: 'bg-orange-500' },
  Critical: { label: 'Critical', bg: 'bg-red-950/60',    text: 'text-red-400',    border: 'border-red-800/50',    dot: 'bg-red-500' },
};

function SeverityPill({ severity }: { severity: Severity }) {
  const s = SEV[severity] || SEV.Medium;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${s.bg} ${s.text} ${s.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export function DamageApprovalPage() {
  const { inspectionId } = useParams<{ inspectionId: string }>();

  const [inspection, setInspection] = useState<Inspection | null>(null);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [decision,   setDecision]   = useState<Decision | null>(null);
  const [showPhotos, setShowPhotos] = useState(false);
  const [showNotes,  setShowNotes]  = useState(false);
  const [lightbox,   setLightbox]   = useState<{ src: string; type: 'image' | 'video' } | null>(null);

  // Fetch inspection on mount
  useEffect(() => {
    if (!inspectionId) { setError('Invalid approval link.'); setLoading(false); return; }
    fetch(`${API}/crm?resource=inspections&id=${encodeURIComponent(inspectionId)}`)
      .then(r => r.json())
      .then(data => {
        if (!data || !data.id) { setError('Approval request not found or has expired.'); return; }
        setInspection(data);
        if (data.approvalStatus === 'approved' || data.approvalStatus === 'rejected') {
          setDecision(data.approvalStatus as Decision);
        }
      })
      .catch(() => setError('Unable to load the approval request. Please try again.'))
      .finally(() => setLoading(false));
  }, [inspectionId]);

  // Submit decision to backend
  const submitDecision = async (d: Decision) => {
    if (!inspection || submitting) return;
    setSubmitting(true);
    const ts = new Date().toISOString();
    const newTimestamps = { ...inspection.approvalTimestamps, [d]: ts };
    const newAudit = [
      { id: Math.random().toString(36).slice(2), user: inspection.jobSummary?.customerName || 'Customer',
        action: `Customer ${d} the additional repairs`, date: new Date().toLocaleDateString('en-GB'), time: new Date().toLocaleTimeString('en-GB') },
      ...inspection.auditTrail,
    ];
    const newTimeline = inspection.timeline.map(e => {
      if (e.status === 'pending' && e.label.toLowerCase().includes('customer decision'))
        return { ...e, status: 'done', user: 'Customer', timestamp: ts, color: d === 'approved' ? 'bg-green-500' : 'bg-red-500' };
      if (e.status === 'pending' && e.label.toLowerCase().includes('repair continued') && d === 'approved')
        return { ...e, status: 'done', user: 'System', timestamp: ts, color: 'bg-green-500' };
      return e;
    });

    try {
      await fetch(`${API}/crm?resource=inspections&id=${inspection.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          approvalStatus: d,
          approvalTimestamps: newTimestamps,
          auditTrail: newAudit,
          timeline: newTimeline,
        }),
      });
      setDecision(d);
      setInspection(prev => prev ? { ...prev, approvalStatus: d, approvalTimestamps: newTimestamps } : prev);
    } catch {
      alert('Failed to submit your decision. Please try again or call us directly.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Derived ─────────────────────────────────────────────────────────────────
  const job      = inspection?.jobSummary;
  const damages  = inspection?.damageReports || [];
  const media    = (inspection?.mediaFiles || []).filter(m => (m.type === 'image' || m.type === 'video') && (m.data || m.url));
  const notes    = inspection?.techNotes || '';
  const quoteItems = inspection?.quotationItems || [];
  const origCost = job?.originalCost || 0;
  const addlCost = quoteItems.reduce((s, i) => s + i.qty * i.unitPrice + i.labourCost, 0)
                || damages.reduce((s, d) => s + d.additionalCost, 0);
  const newTotal = origCost + addlCost;
  const hasMedia = media.length > 0;
  const hasNotes = notes.trim().length > 0;

  // ─────────────────────────────────────────────────────────────────────────────
  // LOADING
  // ─────────────────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-[#FFD700] animate-spin mx-auto mb-4" />
          <p className="text-[#888] text-sm">Loading your approval request…</p>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // ERROR
  // ─────────────────────────────────────────────────────────────────────────────
  if (error || !inspection) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
        <div className="bg-[#111] rounded-2xl border border-[#1e1e1e] p-8 max-w-sm w-full text-center">
          <div className="w-14 h-14 bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-7 h-7 text-red-400" />
          </div>
          <h2 className="text-white font-bold text-lg mb-2">Request Not Found</h2>
          <p className="text-[#888] text-sm mb-6">{error}</p>
          <a href="tel:+94112345678"
            className="flex items-center justify-center gap-2 w-full py-3 bg-[#FFD700] text-black font-bold rounded-xl text-sm hover:bg-yellow-400 transition-colors">
            <Phone className="w-4 h-4" /> Call Anura Tyres
          </a>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // DECISION CONFIRMED SCREEN
  // ─────────────────────────────────────────────────────────────────────────────
  if (decision) {
    const approved = decision === 'approved';
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-4">
        <div className="bg-[#111] rounded-2xl border border-[#1e1e1e] p-8 max-w-sm w-full text-center">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <img src={logo} alt="Anura Tyres" className="h-8 w-auto object-contain" />
          </div>

          {/* Icon */}
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 ${
            approved ? 'bg-green-900/40' : 'bg-red-900/40'}`}>
            {approved
              ? <ThumbsUp className="w-9 h-9 text-green-400" />
              : <ThumbsDown className="w-9 h-9 text-red-400" />
            }
          </div>

          <h2 className={`text-xl font-black mb-2 ${approved ? 'text-green-400' : 'text-red-400'}`}>
            {approved ? 'Repairs Approved!' : 'Repairs Rejected'}
          </h2>
          <p className="text-[#888] text-sm leading-relaxed mb-6">
            {approved
              ? 'Thank you! Our team has been notified and will proceed with the additional repairs. We will contact you once work is complete.'
              : 'Understood. We will not proceed with the additional repairs. Our team will contact you to arrange collection of your vehicle.'}
          </p>

          {/* Summary */}
          <div className="bg-[#1a1a1a] rounded-xl p-4 text-left mb-6">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#555] mb-2.5">Your Vehicle</p>
            <p className="text-white font-bold text-sm">{job?.vehicleReg || '—'}</p>
            <p className="text-[#888] text-xs mt-0.5">{job?.customerName} · {job?.branch}</p>
          </div>

          {approved && (
            <div className="bg-amber-900/20 border border-amber-700/30 rounded-xl p-3 text-xs text-amber-400 mb-6 text-left">
              <p className="font-semibold mb-0.5">New Total: {fmtCurrency(newTotal)}</p>
              <p>A detailed invoice will be provided on completion.</p>
            </div>
          )}

          <a href="tel:+94112345678"
            className="flex items-center justify-center gap-2 w-full py-3 bg-[#FFD700] text-black font-bold rounded-xl text-sm hover:bg-yellow-400 transition-colors">
            <Phone className="w-4 h-4" /> Contact Us
          </a>
        </div>

        <p className="text-[#555] text-[11px] mt-6">
          Responded {inspection.approvalTimestamps[decision]
            ? new Date(inspection.approvalTimestamps[decision]).toLocaleString('en-GB')
            : 'just now'}
        </p>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // MAIN APPROVAL PAGE
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0a0a0a]">

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="bg-[#0d0d0d] border-b border-[#1a1a1a] px-5 py-4">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Anura Tyres" className="h-8 w-auto object-contain" />
            <div>
              <p className="text-white font-black text-sm leading-tight">ANURA TYRES</p>
              <p className="text-[#555] text-[10px] tracking-wide">Service Approval</p>
            </div>
          </div>
          <a href="tel:+94112345678"
            className="flex items-center gap-1.5 bg-[#FFD700] text-black px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-yellow-400 transition-colors">
            <Phone className="w-3 h-3" /> Call Us
          </a>
        </div>
      </div>

      {/* ── Alert Banner ────────────────────────────────────────────────────── */}
      <div className="bg-amber-900/30 border-b border-amber-700/20 px-5 py-3">
        <div className="max-w-xl mx-auto flex items-center gap-2.5">
          <Info className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <p className="text-amber-300 text-xs font-semibold">
            Additional work was found during your vehicle's service. Your approval is required to proceed.
          </p>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 py-5 space-y-4">

        {/* ── Vehicle Summary ─────────────────────────────────────────────── */}
        <div className="bg-[#111] rounded-2xl border border-[#1e1e1e] overflow-hidden">
          <div className="bg-[#161616] border-b border-[#1e1e1e] px-5 py-3 flex items-center gap-2">
            <Car className="w-4 h-4 text-[#FFD700]" />
            <p className="text-white font-bold text-sm">Your Vehicle</p>
          </div>
          <div className="p-4 grid grid-cols-2 gap-3">
            {[
              { label: 'Registration', value: job?.vehicleReg || '—', mono: true },
              { label: 'Customer',     value: job?.customerName || '—' },
              { label: 'Service',      value: job?.currentService || '—', full: true },
              { label: 'Branch',       value: job?.branch || '—' },
            ].map(({ label, value, mono, full }) => (
              <div key={label} className={full ? 'col-span-2' : ''}>
                <p className="text-[10px] text-[#555] font-semibold uppercase tracking-wider">{label}</p>
                <p className={`text-white text-sm font-bold mt-0.5 ${mono ? 'font-mono' : ''}`}>{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Damage Findings ─────────────────────────────────────────────── */}
        {damages.length > 0 && (
          <div className="bg-[#111] rounded-2xl border border-[#1e1e1e] overflow-hidden">
            <div className="bg-[#161616] border-b border-[#1e1e1e] px-5 py-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#FFD700]" />
              <p className="text-white font-bold text-sm">Damage Findings ({damages.length})</p>
            </div>
            <div className="p-4 space-y-3">
              {damages.map(d => {
                const s = SEV[d.severity] || SEV.Medium;
                return (
                  <div key={d.id} className={`border rounded-xl p-3.5 ${s.border} ${s.bg}`}>
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <p className="text-white font-bold text-sm leading-tight">{d.title}</p>
                      <SeverityPill severity={d.severity} />
                    </div>
                    <p className="text-[11px] text-[#888] font-medium mb-1">{d.category}</p>
                    {d.description && (
                      <p className="text-xs text-[#aaa] mb-1.5 leading-relaxed">{d.description}</p>
                    )}
                    {d.recommendedRepair && (
                      <p className="text-xs text-[#ccc]">
                        <span className="font-semibold">Recommendation: </span>{d.recommendedRepair}
                      </p>
                    )}
                    {d.additionalCost > 0 && (
                      <p className="text-sm font-black text-white mt-2">{fmtCurrency(d.additionalCost)}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Evidence Photos & Videos ─────────────────────────────────────── */}
        {hasMedia && (
          <div className="bg-[#111] rounded-2xl border border-[#1e1e1e] overflow-hidden">
            <button
              className="w-full bg-[#161616] border-b border-[#1e1e1e] px-5 py-3 flex items-center justify-between"
              onClick={() => setShowPhotos(p => !p)}
            >
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[#FFD700]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                <p className="text-white font-bold text-sm">
                  Evidence Media ({media.length})
                </p>
              </div>
              {showPhotos
                ? <ChevronUp className="w-4 h-4 text-[#555]" />
                : <ChevronDown className="w-4 h-4 text-[#555]" />
              }
            </button>
            {showPhotos && (
              <div className="p-4">
                <div className="grid grid-cols-3 gap-2">
                  {media.map(m => {
                    const src = m.data || m.url || '';
                    const isVideo = m.type === 'video';
                    return (
                      <div
                        key={m.id}
                        className="aspect-square rounded-lg overflow-hidden bg-[#1a1a1a] cursor-pointer active:scale-95 transition-transform relative"
                        onClick={() => setLightbox({ src, type: m.type })}
                      >
                        {isVideo ? (
                          <>
                            <video
                              src={src}
                              className="w-full h-full object-cover"
                              muted
                              playsInline
                              preload="metadata"
                            />
                            {/* Play overlay */}
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                              <div className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-md">
                                <svg className="w-4 h-4 text-gray-900 ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M8 5v14l11-7z" />
                                </svg>
                              </div>
                            </div>
                          </>
                        ) : (
                          <img src={src} alt={m.name} className="w-full h-full object-cover" />
                        )}
                      </div>
                    );
                  })}
                </div>
                <p className="text-[11px] text-[#555] text-center mt-2">Tap to view full size</p>
              </div>
            )}
          </div>
        )}

        {/* ── Technician Notes ─────────────────────────────────────────────── */}
        {hasNotes && (
          <div className="bg-[#111] rounded-2xl border border-[#1e1e1e] overflow-hidden">
            <button
              className="w-full bg-[#161616] border-b border-[#1e1e1e] px-5 py-3 flex items-center justify-between"
              onClick={() => setShowNotes(p => !p)}
            >
              <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-[#FFD700]" />
                <p className="text-white font-bold text-sm">Technician Notes</p>
              </div>
              {showNotes
                ? <ChevronUp className="w-4 h-4 text-[#555]" />
                : <ChevronDown className="w-4 h-4 text-[#555]" />
              }
            </button>
            {showNotes && (
              <div className="p-4">
                <p className="text-sm text-[#ccc] leading-relaxed whitespace-pre-wrap">{notes}</p>
              </div>
            )}
          </div>
        )}

        {/* ── Cost Summary ─────────────────────────────────────────────────── */}
        <div className="bg-[#111] rounded-2xl border border-[#1e1e1e] overflow-hidden">
          <div className="bg-[#161616] border-b border-[#1e1e1e] px-5 py-3 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-[#FFD700]" />
            <p className="text-white font-bold text-sm">Cost Summary</p>
          </div>
          <div className="p-4 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-[#888]">Original Estimate</span>
              <span className="text-white font-semibold">{fmtCurrency(origCost)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-[#888]">Additional Repairs</span>
              <span className="text-orange-400 font-semibold">+ {fmtCurrency(addlCost)}</span>
            </div>
            {quoteItems.filter(i => i.item).length > 0 && (
              <div className="bg-[#1a1a1a] rounded-lg p-3 space-y-1.5">
                {quoteItems.filter(i => i.item).map(i => {
                  const total = i.qty * i.unitPrice + i.labourCost;
                  return (
                    <div key={i.id} className="flex justify-between items-center text-xs">
                      <span className="text-[#aaa]">{i.qty > 1 ? `${i.qty}× ` : ''}{i.item}</span>
                      <span className="text-[#ddd] font-medium">{fmtCurrency(total)}</span>
                    </div>
                  );
                })}
              </div>
            )}
            <div className="flex justify-between items-center pt-2 border-t border-[#1e1e1e]">
              <span className="text-white font-black text-sm">New Total</span>
              <span className="text-xl font-black text-[#FFD700]">{fmtCurrency(newTotal)}</span>
            </div>
          </div>
        </div>

        {/* ── What happens next? ───────────────────────────────────────────── */}
        <div className="bg-blue-900/15 border border-blue-700/25 rounded-2xl p-4">
          <p className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">What happens next?</p>
          <div className="space-y-1.5 text-xs text-blue-300/80">
            <p><span className="font-semibold text-blue-300">If you approve:</span> Our technician will immediately proceed with the additional repairs. Payment will be collected on completion.</p>
            <p><span className="font-semibold text-blue-300">If you reject:</span> We will complete only the original service and contact you to arrange vehicle collection.</p>
          </div>
        </div>

        {/* ── Decision Buttons ─────────────────────────────────────────────── */}
        <div className="bg-[#111] rounded-2xl border border-[#1e1e1e] p-4 space-y-3">
          <p className="text-xs font-bold text-[#555] uppercase tracking-wider text-center">Your Decision</p>

          <button
            onClick={() => submitDecision('approved')}
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 py-4 bg-green-600 text-white font-black text-base rounded-xl hover:bg-green-500 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-green-900/40"
          >
            {submitting
              ? <Loader2 className="w-5 h-5 animate-spin" />
              : <CheckCircle className="w-5 h-5" />
            }
            Approve Additional Repairs
          </button>

          <button
            onClick={() => submitDecision('rejected')}
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 py-3 border-2 border-red-800/50 text-red-400 font-bold text-sm rounded-xl hover:bg-red-900/20 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <XCircle className="w-4 h-4" />
            Reject — Don't Proceed
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#1e1e1e]" />
            </div>
            <div className="relative text-center">
              <span className="bg-[#111] px-2 text-[11px] text-[#555]">or</span>
            </div>
          </div>

          <a
            href="tel:+94112345678"
            className="w-full flex items-center justify-center gap-2 py-3 border border-[#2a2a2a] text-[#888] font-semibold text-sm rounded-xl hover:bg-[#1a1a1a] active:scale-[0.98] transition-all"
          >
            <Phone className="w-4 h-4" />
            Call to Discuss
          </a>
        </div>

        {/* ── Footer note ─────────────────────────────────────────────────── */}
        <p className="text-[11px] text-[#555] text-center pb-6">
          This approval is for job <span className="font-mono font-semibold text-[#888]">{job?.jobNumber}</span> at{' '}
          {job?.branch}. Anura Tyres Pvt Ltd.
        </p>

      </div>

      {/* ── Lightbox ─────────────────────────────────────────────────────────── */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          {lightbox.type === 'video' ? (
            <video
              src={lightbox.src}
              className="max-w-full max-h-[90vh] rounded-xl"
              controls
              onClick={e => e.stopPropagation()}
            />
          ) : (
            <img src={lightbox.src} alt="Evidence" className="max-w-full max-h-[90vh] rounded-xl object-contain" />
          )}
          <button
            className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 rounded-full p-2"
            onClick={() => setLightbox(null)}
          >
            <XCircle className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
}
