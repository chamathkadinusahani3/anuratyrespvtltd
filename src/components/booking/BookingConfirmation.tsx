import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Calendar, Clock, MapPin, Hash, Download, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { BookingState } from '../../types';
import logo from '../../assets/logo.png';
import jsPDF from 'jspdf';

interface BookingConfirmationProps {
  booking: BookingState;
  bookingId?: string | null;
}

export function BookingConfirmation({ booking, bookingId }: BookingConfirmationProps) {
  const [generating, setGenerating] = useState(false);

  const discountInfo = (booking.customer as any).discountInfo;
  const discountCode = (booking.customer as any).discountCode;

  const generatePDF = async () => {
    setGenerating(true);

    try {
      const loadLogo = (): Promise<string> => {
        return new Promise((resolve, reject) => {
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
              reject('Canvas context not available');
            }
          };
          img.onerror = () => reject('Logo failed to load');
          img.src = logo;
        });
      };

      let logoData: string | null = null;
      try {
        logoData = await loadLogo();
      } catch {
        console.log('Logo not loaded, continuing without it');
      }

      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      let yPosition = 20;

      // ── YELLOW HEADER ────────────────────────────────────────────────
      doc.setFillColor(255, 215, 0);
      doc.rect(0, 0, pageWidth, 40, 'F');

      if (logoData) {
        try { doc.addImage(logoData, 'PNG', 15, 8, 25, 25); } catch {}
      }

      doc.setTextColor(0, 0, 0);
      doc.setFontSize(28);
      doc.setFont('helvetica', 'bold');
      doc.text('ANURA TYRES', pageWidth / 2, 18, { align: 'center' });

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('(Pvt) Ltd', pageWidth / 2, 24, { align: 'center' });

      doc.setFontSize(9);
      doc.setTextColor(51, 51, 51);
      doc.text('278/2 High Level Rd, Pannipitiya | Tel: 077 578 5785', pageWidth / 2, 32, { align: 'center' });

      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.5);
      doc.line(margin, 42, pageWidth - margin, 42);

      yPosition = 55;

      // ── TITLE ────────────────────────────────────────────────────────
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 215, 0);
      doc.text('BOOKING CONFIRMED', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 10;

      if (bookingId) {
        doc.setFontSize(12);
        doc.setFont('courier', 'bold');
        doc.setTextColor(255, 215, 0);
        doc.text(`Booking ID: ${bookingId}`, pageWidth / 2, yPosition, { align: 'center' });
        yPosition += 10;
      }

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      const thankYouText = `Dear ${booking.customer.name}, thank you for choosing Anura Tyres. Your appointment has been successfully scheduled. A confirmation email has been sent to ${booking.customer.email}.`;
      const splitThankYou = doc.splitTextToSize(thankYouText, pageWidth - 2 * margin);
      doc.text(splitThankYou, margin, yPosition);
      yPosition += splitThankYou.length * 5 + 10;

      // ── BOOKING DETAILS ───────────────────────────────────────────────
      doc.setFillColor(255, 250, 205);
      doc.rect(margin, yPosition, pageWidth - 2 * margin, 8, 'F');
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text('BOOKING DETAILS', margin + 3, yPosition + 5);
      yPosition += 12;

      const details = [
        { label: 'Branch:', value: booking.branch?.name || 'N/A' },
        { label: 'Address:', value: booking.branch?.address || 'N/A' },
        { label: 'Phone:', value: booking.branch?.phone || 'N/A' },
        {
          label: 'Date:',
          value: booking.date?.toLocaleDateString('en-US', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
          }) || 'N/A'
        },
        { label: 'Time:', value: booking.timeSlot || 'N/A' }
      ];

      doc.setFontSize(9);
      details.forEach((detail, index) => {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(102, 102, 102);
        doc.text(detail.label, margin + 5, yPosition);

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
        const valueLines = doc.splitTextToSize(detail.value, pageWidth - margin - 55);
        doc.text(valueLines, margin + 35, yPosition);
        yPosition += Math.max(5, valueLines.length * 5);

        if (index < details.length - 1) {
          doc.setDrawColor(238, 238, 238);
          doc.setLineWidth(0.1);
          doc.line(margin + 5, yPosition - 1, pageWidth - margin - 5, yPosition - 1);
        }
      });

      yPosition += 10;

      // ── CUSTOMER INFORMATION ──────────────────────────────────────────
      doc.setFillColor(255, 250, 205);
      doc.rect(margin, yPosition, pageWidth - 2 * margin, 8, 'F');
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text('CUSTOMER INFORMATION', margin + 3, yPosition + 5);
      yPosition += 12;

      const customerInfo = [
        { label: 'Name:', value: booking.customer.name },
        { label: 'Email:', value: booking.customer.email },
        { label: 'Phone:', value: booking.customer.phone },
        { label: 'Vehicle:', value: booking.customer.vehicleNo || 'N/A' }
      ];

      doc.setFontSize(9);
      customerInfo.forEach((info, index) => {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(102, 102, 102);
        doc.text(info.label, margin + 5, yPosition);

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
        const lines = doc.splitTextToSize(info.value, pageWidth - margin - 55);
        doc.text(lines, margin + 35, yPosition);
        yPosition += Math.max(5, lines.length * 5);

        if (index < customerInfo.length - 1) {
          doc.setDrawColor(238, 238, 238);
          doc.setLineWidth(0.1);
          doc.line(margin + 5, yPosition - 1, pageWidth - margin - 5, yPosition - 1);
        }
      });

      yPosition += 10;

      // ── SERVICES ─────────────────────────────────────────────────────
      doc.setFillColor(255, 250, 205);
      doc.rect(margin, yPosition, pageWidth - 2 * margin, 8, 'F');
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text('SERVICES BOOKED', margin + 3, yPosition + 5);
      yPosition += 12;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      booking.services.forEach((service) => {
        doc.text(`• ${service.name}`, margin + 5, yPosition);
        yPosition += 6;
      });

      yPosition += 8;

      // ── DISCOUNT CODE SECTION (only if applied) ───────────────────────
      if (discountInfo) {
        doc.setFillColor(255, 215, 0);
        doc.rect(margin, yPosition, pageWidth - 2 * margin, 8, 'F');
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text('DISCOUNT APPLIED', margin + 3, yPosition + 5);
        yPosition += 12;

        // Discount box
        doc.setFillColor(255, 250, 205);
        doc.setDrawColor(255, 215, 0);
        doc.setLineWidth(1);
        doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 35, 2, 2, 'FD');

        yPosition += 8;

        // Discount badge circle
        doc.setFillColor(255, 215, 0);
        doc.circle(margin + 20, yPosition + 8, 10, 'F');
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text(`${discountInfo.discount}%`, margin + 20, yPosition + 7, { align: 'center' });
        doc.setFontSize(7);
        doc.text('OFF', margin + 20, yPosition + 12, { align: 'center' });

        // Discount details
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text(
          discountInfo.type === 'corporate' ? 'Corporate Discount' : 'Employee Discount',
          margin + 35, yPosition + 6
        );

        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(51, 51, 51);

        if (discountInfo.type === 'corporate') {
          doc.text(`Company: ${discountInfo.companyName}`, margin + 35, yPosition + 12);
          doc.text(`Corporate Code: ${discountCode}`, margin + 35, yPosition + 17);
        } else {
          doc.text(`Employee: ${discountInfo.employeeName}`, margin + 35, yPosition + 12);
          doc.text(`Company: ${discountInfo.companyName}`, margin + 35, yPosition + 17);
          doc.text(`Employee ID: ${discountCode}`, margin + 35, yPosition + 22);
        }

        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 100, 0);
        doc.text(
          `${discountInfo.discount}% discount will be applied at the branch`,
          pageWidth / 2, yPosition + 28, { align: 'center' }
        );

        yPosition += 45;
      }

      // ── IMPORTANT NOTES ───────────────────────────────────────────────
      doc.setDrawColor(255, 215, 0);
      doc.setLineWidth(0.3);
      doc.setFillColor(255, 255, 240);
      doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 30, 2, 2, 'FD');
      yPosition += 7;

      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(102, 102, 102);
      doc.text('Important Notes:', margin + 5, yPosition);
      yPosition += 6;

      doc.setFont('helvetica', 'normal');
      [
        '• Please arrive 10 minutes before your scheduled time.',
        '• Bring this confirmation along with a valid ID.',
        '• For any changes or cancellations, please contact us at least 24 hours in advance.'
      ].forEach(note => {
        doc.text(note, margin + 5, yPosition);
        yPosition += 5;
      });

      yPosition += 10;

      // ── CLOSING ──────────────────────────────────────────────────────
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      doc.text('We look forward to serving you!', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 6;
      doc.setFont('helvetica', 'bold');
      doc.text('ANURA TYRES (Pvt) Ltd', pageWidth / 2, yPosition, { align: 'center' });

      // ── FOOTER ───────────────────────────────────────────────────────
      const footerY = pageHeight - 15;
      doc.setDrawColor(255, 215, 0);
      doc.setLineWidth(0.3);
      doc.line(margin, footerY, pageWidth - margin, footerY);

      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(102, 102, 102);
      doc.text(
        'Your Trusted Tyre Specialists | www.anuratyres.lk | info@anuratyres.lk',
        pageWidth / 2, footerY + 5, { align: 'center' }
      );

      doc.save(`Anura_Tyres_Booking_${bookingId || 'Confirmation'}.pdf`);

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto text-center animate-fade-in py-8">
      <div className="mb-8 flex justify-center">
        <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center">
          <CheckCircle className="w-12 h-12 text-green-500" />
        </div>
      </div>

      <h2 className="text-3xl font-bold text-white mb-4">Booking Confirmed!</h2>

      {bookingId && (
        <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-brand-yellow/10 border border-brand-yellow/20 rounded-lg">
          <Hash className="w-4 h-4 text-brand-yellow" />
          <span className="text-brand-yellow font-mono font-bold">{bookingId}</span>
        </div>
      )}

      <p className="text-brand-gray text-lg mb-8">
        Thank you {booking.customer.name}. Your appointment has been scheduled
        successfully. We have sent a confirmation to {booking.customer.email}.
      </p>

      {/* Booking Details Card */}
      <div className="bg-brand-card rounded-xl border border-white/10 p-6 mb-6 text-left">
        <h3 className="text-lg font-bold text-white mb-4 border-b border-white/10 pb-2">
          Booking Details
        </h3>
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
                {booking.date?.toLocaleDateString('en-US', {
                  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                })}
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
                {booking.services.map((s) => (
                  <li key={s.id}>{s.name}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Discount badge — read-only, set from CustomerForm */}
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
            {discountInfo.companyName && (
              <p className="text-brand-gray text-xs mt-0.5">Company: {discountInfo.companyName}</p>
            )}
            {discountInfo.employeeName && (
              <p className="text-brand-gray text-xs">Employee: {discountInfo.employeeName}</p>
            )}
            <p className="text-xs text-green-400 mt-1">
              {discountInfo.discount}% discount will be applied at the branch
            </p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Link to="/">
          <Button variant="outline" className="w-full sm:w-auto">Back to Home</Button>
        </Link>
        <Button
          onClick={generatePDF}
          disabled={generating}
          className="w-full sm:w-auto flex items-center justify-center gap-2"
        >
          {generating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating PDF...
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              Download PDF
            </>
          )}
        </Button>
      </div>
    </div>
  );
}