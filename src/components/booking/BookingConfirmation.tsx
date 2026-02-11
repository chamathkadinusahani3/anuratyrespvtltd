import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Calendar, Clock, MapPin, Hash } from 'lucide-react';
import { Button } from '../ui/Button';
import { BookingState } from '../../types';

interface BookingConfirmationProps {
  booking: BookingState;
  bookingId?: string | null;
}

export function BookingConfirmation({ booking, bookingId }: BookingConfirmationProps) {
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

      <div className="bg-brand-card rounded-xl border border-white/10 p-6 mb-8 text-left">
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
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
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

      <div className="flex justify-center gap-4">
        <Link to="/">
          <Button variant="outline">Back to Home</Button>
        </Link>
        <Button onClick={() => window.print()}>Print Confirmation</Button>
      </div>
    </div>
  );
}