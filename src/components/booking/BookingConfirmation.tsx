import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Calendar, Clock, MapPin, Hash, Download, Loader2, Mail } from 'lucide-react';
import { Button } from '../ui/Button';
import { BookingState } from '../../types';
import logo from '../../assets/logo.png';
import jsPDF from 'jspdf';
import { db } from '../../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import emailjs from '@emailjs/browser';

const EMAILJS_SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

interface BookingConfirmationProps {
  booking: BookingState;
}

export function BookingConfirmation({ booking }: BookingConfirmationProps) {
  const [generating, setGenerating]   = useState(false);
  const [savedToDashboard, setSaved]  = useState(false);
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [backendSynced, setBackendSynced] = useState(false);
  const [bookingId, setBookingId] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // ── Guard: prevent double-POST from React Strict Mode double-invoke ──────────
  const hasRun = useRef(false);

  const discountInfo = (booking.customer as any).discountInfo;
  const discountCode = (booking.customer as any).discountCode;

  useEffect(() => {
    // If this effect already fired once (React Strict Mode), bail out immediately
    if (hasRun.current) return;
    hasRun.current = true;

    const run = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      const apiUrl = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

      // ── 1. POST to backend ────────────────────────────────────────
      try {
        const res = await fetch(`${apiUrl}/bookings`, {
          method:  'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-User-Role': 'Super Admin',
            'X-User-Branch': 'All Branches',
          },
          body: JSON.stringify({
            // NO bookingId - backend generates it
            branch: {
              id:      booking.branch?.id      ?? '',
              name:    booking.branch?.name    ?? '',
              address: booking.branch?.address ?? '',
              phone:   booking.branch?.phone   ?? '',
            },
            services: booking.services.map(s => ({ id: s.id, name: s.name })),
            date:     booking.date?.toISOString() ?? new Date().toISOString(),
            timeSlot: booking.timeSlot ?? '',
            customer: {
              name:      booking.customer.name,
              email:     booking.customer.email,
              phone:     booking.customer.phone,
              vehicleNo: booking.customer.vehicleNo ?? '',
            },
            ...(discountInfo ? { discountInfo, discountCode } : {}),
            firebaseUid: user?.uid ?? null,
            source: 'website',
          }),
        });

        const data = await res.json();

        if (res.ok && data.booking?.bookingId) {
          const generatedBookingId = data.booking.bookingId;
          setBookingId(generatedBookingId);
          setBackendSynced(true);

          // ── 2. Save to Firestore ───────────────────────────────────
          if (user) {
            try {
              await setDoc(doc(db, 'users', user.uid, 'appointments', generatedBookingId), {
                bookingId: generatedBookingId,
                date:          booking.date?.toISOString().split('T')[0] ?? '',
                time:          booking.timeSlot ?? '',
                branch:        booking.branch?.name ?? '',
                branchAddress: booking.branch?.address ?? '',
                branchPhone:   booking.branch?.phone ?? '',
                services:      booking.services.map(s => s.name),
                status:        'upcoming',
                customerName:  booking.customer.name,
                customerEmail: booking.customer.email,
                customerPhone: booking.customer.phone,
                vehicleNo:     booking.customer.vehicleNo ?? '',
                ...(discountInfo ? { discountInfo, discountCode } : {}),
                createdAt: new Date().toISOString(),
              });
              setSaved(true);
            } catch (err) {
              console.error('Failed to save to Firestore:', err);
            }
          }

          // ── 3. Send confirmation email ──────────────────────────────
          if (booking.customer.email) {
            setEmailStatus('sending');
            try {
              const formattedDate = booking.date?.toLocaleDateString('en-US', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
              }) ?? '';
              await emailjs.send(
                EMAILJS_SERVICE_ID,
                EMAILJS_TEMPLATE_ID,
                {
                  to_email:       booking.customer.email,
                  to_name:        booking.customer.name,
                  customer_phone: booking.customer.phone,
                  vehicle_no:     booking.customer.vehicleNo || 'N/A',
                  booking_id:     generatedBookingId,
                  branch_name:    booking.branch?.name ?? '',
                  branch_address: booking.branch?.address ?? '',
                  branch_phone:   booking.branch?.phone ?? '',
                  booking_date:   formattedDate,
                  booking_time:   booking.timeSlot ?? '',
                  services_list:  booking.services.map(s => `• ${s.name}`).join('\n'),
                  discount_block: discountInfo
                    ? `${discountInfo.discount}% ${discountInfo.type === 'corporate' ? 'Corporate' : 'Employee'} Discount${discountInfo.companyName ? ` — ${discountInfo.companyName}` : ''}`
                    : '',
                },
                EMAILJS_PUBLIC_KEY,
              );
              setEmailStatus('sent');
            } catch (err) {
              console.error('EmailJS send failed:', err);
              setEmailStatus('error');
            }
          }
        } else {
          console.warn('Backend POST returned', res.status, data);
        }
      } catch (err) {
        console.error('Failed to POST booking to backend:', err);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  const generatePDF = async () => {
    setGenerating(true);
    try {
      const loadLogo = (): Promise<string> => new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            resolve(canvas.toDataURL('image/png'));
          } else {
            reject('no ctx');
          }
        };
        img.onerror = () => reject('logo failed');
        img.src = logo;
      });

      let logoData: string | null = null;
      try {
        logoData = await loadLogo();
      } catch {}

      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageWidth  = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      let y = 20;

      pdf.setFillColor(255, 215, 0);
      pdf.rect(0, 0, pageWidth, 40, 'F');
      if (logoData) {
        try {
          pdf.addImage(logoData, 'PNG', 15, 8, 25, 25);
        } catch {}
      }

      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(28);
      pdf.setFont('helvetica', 'bold');
      pdf.text('ANURA TYRES', pageWidth / 2, 18, { align: 'center' });
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text('(Pvt) Ltd', pageWidth / 2, 24, { align: 'center' });
      pdf.setFontSize(9);
      pdf.setTextColor(51, 51, 51);
      pdf.text('278/2 High Level Rd, Pannipitiya | Tel: 077 578 5785', pageWidth / 2, 32, { align: 'center' });
      pdf.setDrawColor(0, 0, 0);
      pdf.setLineWidth(0.5);
      pdf.line(margin, 42, pageWidth - margin, 42);

      y = 55;
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(255, 215, 0);
      pdf.text('BOOKING CONFIRMED', pageWidth / 2, y, { align: 'center' });
      y += 10;

      pdf.setFontSize(12);
      pdf.setFont('courier', 'bold');
      pdf.setTextColor(0, 0, 0);
      pdf.text(`Booking ID: ${bookingId}`, pageWidth / 2, y, { align: 'center' });
      y += 10;

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(0, 0, 0);
      const thankYou = `Dear ${booking.customer.name}, thank you for choosing Anura Tyres. Your appointment has been successfully scheduled. A confirmation email has been sent to ${booking.customer.email}.`;
      const split = pdf.splitTextToSize(thankYou, pageWidth - 2 * margin);
      pdf.text(split, margin, y);
      y += split.length * 5 + 10;

      const sectionHeader = (title: string) => {
        pdf.setFillColor(255, 250, 205);
        pdf.rect(margin, y, pageWidth - 2 * margin, 8, 'F');
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(0, 0, 0);
        pdf.text(title, margin + 3, y + 5);
        y += 12;
      };

      const infoRows = (rows: { label: string; value: string }[]) => {
        pdf.setFontSize(9);
        rows.forEach((row, i) => {
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(102, 102, 102);
          pdf.text(row.label, margin + 5, y);
          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(0, 0, 0);
          const lines = pdf.splitTextToSize(row.value, pageWidth - margin - 55);
          pdf.text(lines, margin + 35, y);
          y += Math.max(5, lines.length * 5);
          if (i < rows.length - 1) {
            pdf.setDrawColor(238, 238, 238);
            pdf.setLineWidth(0.1);
            pdf.line(margin + 5, y - 1, pageWidth - margin - 5, y - 1);
          }
        });
        y += 10;
      };

      sectionHeader('BOOKING DETAILS');
      infoRows([
        { label: 'Branch:', value: booking.branch?.name || 'N/A' },
        { label: 'Address:', value: booking.branch?.address || 'N/A' },
        { label: 'Phone:', value: booking.branch?.phone || 'N/A' },
        { label: 'Date:', value: booking.date?.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) || 'N/A' },
        { label: 'Time:', value: booking.timeSlot || 'N/A' },
      ]);

      sectionHeader('CUSTOMER INFORMATION');
      infoRows([
        { label: 'Name:', value: booking.customer.name },
        { label: 'Email:', value: booking.customer.email },
        { label: 'Phone:', value: booking.customer.phone },
        { label: 'Vehicle:', value: booking.customer.vehicleNo || 'N/A' },
      ]);

      sectionHeader('SERVICES BOOKED');
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      booking.services.forEach(s => {
        pdf.text(`• ${s.name}`, margin + 5, y);
        y += 6;
      });
      y += 8;

      if (discountInfo) {
        pdf.setFillColor(255, 215, 0);
        pdf.rect(margin, y, pageWidth - 2 * margin, 8, 'F');
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(0, 0, 0);
        pdf.text('DISCOUNT APPLIED', margin + 3, y + 5);
        y += 12;

        pdf.setFillColor(255, 250, 205);
        pdf.setDrawColor(255, 215, 0);
        pdf.setLineWidth(1);
        pdf.roundedRect(margin, y, pageWidth - 2 * margin, 35, 2, 2, 'FD');
        y += 8;

        pdf.setFillColor(255, 215, 0);
        pdf.circle(margin + 20, y + 8, 10, 'F');
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(0, 0, 0);
        pdf.text(`${discountInfo.discount}%`, margin + 20, y + 7, { align: 'center' });
        pdf.setFontSize(7);
        pdf.text('OFF', margin + 20, y + 12, { align: 'center' });

        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        pdf.text(discountInfo.type === 'corporate' ? 'Corporate Discount' : 'Employee Discount', margin + 35, y + 6);

        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(51, 51, 51);
        if (discountInfo.type === 'corporate') {
          pdf.text(`Company: ${discountInfo.companyName}`, margin + 35, y + 12);
          pdf.text(`Corporate Code: ${discountCode}`, margin + 35, y + 17);
        } else {
          pdf.text(`Employee: ${discountInfo.employeeName}`, margin + 35, y + 12);
          pdf.text(`Company: ${discountInfo.companyName}`, margin + 35, y + 17);
          pdf.text(`Employee ID: ${discountCode}`, margin + 35, y + 22);
        }

        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(0, 100, 0);
        pdf.text(`${discountInfo.discount}% discount will be applied at the branch`, pageWidth / 2, y + 28, { align: 'center' });
        y += 45;
      }

      pdf.setDrawColor(255, 215, 0);
      pdf.setLineWidth(0.3);
      pdf.setFillColor(255, 255, 240);
      pdf.roundedRect(margin, y, pageWidth - 2 * margin, 30, 2, 2, 'FD');
      y += 7;

      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(102, 102, 102);
      pdf.text('Important Notes:', margin + 5, y);
      y += 6;

      pdf.setFont('helvetica', 'normal');
      ['• Please arrive 10 minutes before your scheduled time.',
       '• Bring this confirmation along with a valid ID.',
       '• For changes or cancellations, contact us at least 24 hours in advance.'].forEach(n => {
        pdf.text(n, margin + 5, y);
        y += 5;
      });

      y += 10;
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(0, 0, 0);
      pdf.text('We look forward to serving you!', pageWidth / 2, y, { align: 'center' });
      y += 6;

      pdf.setFont('helvetica', 'bold');
      pdf.text('ANURA TYRES (Pvt) Ltd', pageWidth / 2, y, { align: 'center' });

      const footerY = pageHeight - 15;
      pdf.setDrawColor(255, 215, 0);
      pdf.setLineWidth(0.3);
      pdf.line(margin, footerY, pageWidth - margin, footerY);

      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(102, 102, 102);
      pdf.text('Your Trusted Tyre Specialists | www.anuratyres.lk | info@anuratyres.lk', pageWidth / 2, footerY + 5, { align: 'center' });

      pdf.save(`Anura_Tyres_Booking_${bookingId}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto text-center py-8">
        <Loader2 className="w-8 h-8 animate-spin text-brand-yellow mx-auto mb-4" />
        <p className="text-neutral-400">Processing your booking...</p>
      </div>
    );
  }

  if (!bookingId) {
    return (
      <div className="max-w-2xl mx-auto text-center py-8">
        <h2 className="text-2xl font-bold text-white mb-4">Error</h2>
        <p className="text-neutral-400 mb-6">Failed to create booking. Please try again.</p>
        <Link to="/"><Button>Back to Home</Button></Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto text-center animate-fade-in py-8">
      <div className="mb-8 flex justify-center">
        <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center">
          <CheckCircle className="w-12 h-12 text-green-500" />
        </div>
      </div>

      <h2 className="text-3xl font-bold text-white mb-4">Booking Confirmed!</h2>

      <div className="mb-4 inline-flex items-center gap-2 px-4 py-2 bg-brand-yellow/10 border border-brand-yellow/20 rounded-lg">
        <Hash className="w-4 h-4 text-brand-yellow" />
        <span className="text-brand-yellow font-mono font-bold">{bookingId}</span>
      </div>

      <div className="flex justify-center mb-4 flex-col items-center gap-2">
        {emailStatus === 'sending' && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-lg text-xs text-blue-400">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            Sending confirmation email…
          </div>
        )}
        {emailStatus === 'sent' && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-lg text-xs text-green-400">
            <Mail className="w-3.5 h-3.5" />
            Confirmation email sent to <strong className="ml-1 font-mono">{booking.customer.email}</strong>
          </div>
        )}
        {emailStatus === 'error' && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-400">
            <Mail className="w-3.5 h-3.5" />
            Email could not be sent — please contact us directly.
          </div>
        )}
        {backendSynced && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-lg text-xs text-green-400">
            <CheckCircle className="w-3.5 h-3.5" />
            Booking saved to admin system
          </div>
        )}
      </div>

      {savedToDashboard && (
        <div className="mb-6 inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-lg text-xs text-blue-400">
          <CheckCircle className="w-3.5 h-3.5" />
          Saved to your dashboard appointments
        </div>
      )}

      <p className="text-brand-gray text-lg mb-8">
        Thank you {booking.customer.name}. Your appointment has been scheduled
        successfully. We have sent a confirmation to {booking.customer.email}.
      </p>

      <div className="bg-brand-card rounded-xl border border-white/10 p-6 mb-6 text-left">
        <h3 className="text-lg font-bold text-white mb-4 border-b border-white/10 pb-2">Booking Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-brand-yellow mt-0.5" />
            <div>
              <p className="text-sm text-brand-gray">Branch</p>
              <p className="font-medium text-white">{booking.branch?.name}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-brand-yellow mt-0.5" />
            <div>
              <p className="text-sm text-brand-gray">Date</p>
              <p className="font-medium text-white">
                {booking.date?.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-brand-yellow mt-0.5" />
            <div>
              <p className="text-sm text-brand-gray">Time</p>
              <p className="font-medium text-white">{booking.timeSlot}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full border-2 border-brand-yellow flex items-center justify-center text-[10px] font-bold text-brand-yellow mt-0.5">
              {booking.services.length}
            </div>
            <div>
              <p className="text-sm text-brand-gray">Services</p>
              <ul className="list-disc list-inside text-white text-sm">
                {booking.services.map(s => <li key={s.id}>{s.name}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {discountInfo && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-6 text-left flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-brand-yellow flex items-center justify-center flex-shrink-0">
            <div className="text-center">
              <p className="text-black font-bold text-sm leading-none">{discountInfo.discount}%</p>
              <p className="text-black text-[10px] font-bold">OFF</p>
            </div>
          </div>
          <div>
            <p className="text-green-400 font-bold text-sm flex items-center gap-1">
              <CheckCircle className="w-4 h-4" />
              {discountInfo.type === 'corporate' ? 'Corporate Discount Applied' : 'Employee Discount Applied'}
            </p>
            <p className="text-white text-sm font-mono font-bold mt-0.5">{discountCode}</p>
            {discountInfo.companyName && <p className="text-brand-gray text-xs mt-0.5">Company: {discountInfo.companyName}</p>}
            {discountInfo.employeeName && <p className="text-brand-gray text-xs">Employee: {discountInfo.employeeName}</p>}
            <p className="text-xs text-green-400 mt-1">{discountInfo.discount}% discount will be applied at the branch</p>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Link to="/"><Button variant="outline" className="w-full sm:w-auto">Back to Home</Button></Link>
        {savedToDashboard && (
          <Link to="/dashboard"><Button variant="outline" className="w-full sm:w-auto">View in Dashboard</Button></Link>
        )}
        <Button onClick={generatePDF} disabled={generating} className="w-full sm:w-auto flex items-center justify-center gap-2">
          {generating
            ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating PDF...</>
            : <><Download className="w-4 h-4" /> Download PDF</>}
        </Button>
      </div>
    </div>
  );
}