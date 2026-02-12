import React, { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/ui/Button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { StepIndicator } from '../components/booking/StepIndicator';
import { BranchSelector } from '../components/booking/BranchSelector';
import { CategorySelector } from '../components/booking/CategorySelector';
import { ServiceSelector } from '../components/booking/ServiceSelector';
import { DatePicker } from '../components/booking/DatePicker';
import { TimeSlotPicker } from '../components/booking/TimeSlotPicker';
import { CustomerForm } from '../components/booking/CustomerForm';
import { BookingConfirmation } from '../components/booking/BookingConfirmation';
import { bookingAPI } from '../services/api';
import book from '../assets/book.png';
import {
  BookingState,
  BookingStep
} from '../types';

export function BookingPage() {
  const [currentStep, setCurrentStep] = useState<BookingStep>('branch');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);

  const [booking, setBooking] = useState<BookingState>({
    branch: null,
    category: null,
    services: [],
    date: null,
    timeSlot: null,
    customer: {
      name: '',
      email: '',
      phone: '',
      vehicleNo: ''
    }
  });

  const handleNext = async () => {
    setError(null);

    if (currentStep === 'details') {
      await handleSubmitBooking();
      return;
    }

    switch (currentStep) {
      case 'branch': setCurrentStep('category'); break;
      case 'category': setCurrentStep('service'); break;
      case 'service': setCurrentStep('date'); break;
      case 'date': setCurrentStep('time'); break;
      case 'time': setCurrentStep('details'); break;
    }
    window.scrollTo(0, 0);
  };

  const handleSubmitBooking = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await bookingAPI.createBooking(booking);

      if (response.success) {
        setBookingId(response.booking?.bookingId || null);
        setCurrentStep('confirmation');
        window.scrollTo(0, 0);
      } else {
        setError(response.message || 'Failed to create booking');
      }
    } catch (err: any) {
      console.error('Booking submission error:', err);
      setError(err.message || 'Failed to submit booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    setError(null);
    switch (currentStep) {
      case 'category': setCurrentStep('branch'); break;
      case 'service': setCurrentStep('category'); break;
      case 'date': setCurrentStep('service'); break;
      case 'time': setCurrentStep('date'); break;
      case 'details': setCurrentStep('time'); break;
    }
  };

  const isNextDisabled = () => {
    switch (currentStep) {
      case 'branch': return !booking.branch;
      case 'category': return !booking.category;
      case 'service': return booking.services.length === 0;
      case 'date': return !booking.date;
      case 'time': return !booking.timeSlot;
      case 'details': return (
        !booking.customer.name ||
        !booking.customer.email ||
        !booking.customer.phone
      );
      default: return false;
    }
  };

  return (
    <Layout>
      <div className="relative bg-brand-dark py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: `url(${book})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-brand-black" />
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6">Book Your Service</h1>
        </div>
      </div>

      <div className="min-h-screen bg-brand-black py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {currentStep !== 'confirmation' && (
            <div className="mb-12">
              <StepIndicator currentStep={currentStep} />
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-500 text-center">{error}</p>
            </div>
          )}

          <div className="bg-brand-black min-h-[400px]">
            {currentStep === 'branch' && (
              <BranchSelector
                selectedBranch={booking.branch}
                onSelect={(branch) => setBooking({ ...booking, branch, category: null, services: [] })}
              />
            )}

            {currentStep === 'category' && booking.branch && (
              <CategorySelector
                selectedBranch={booking.branch}
                selectedCategory={booking.category}
                onSelect={(category) => setBooking({ ...booking, category, services: [] })}
              />
            )}

            {currentStep === 'service' && booking.category && (
              <ServiceSelector
                category={booking.category}
                selectedServices={booking.services}
                onToggle={(service) => {
                  const exists = booking.services.find(s => s.id === service.id);
                  if (exists) {
                    setBooking({ ...booking, services: booking.services.filter(s => s.id !== service.id) });
                  } else {
                    setBooking({ ...booking, services: [...booking.services, service] });
                  }
                }}
              />
            )}

            {currentStep === 'date' && (
              <div className="flex justify-center">
                <DatePicker
                  selectedDate={booking.date}
                  onSelect={(date) => setBooking({ ...booking, date })}
                />
              </div>
            )}

            {currentStep === 'time' && (
              <TimeSlotPicker
                selectedTime={booking.timeSlot}
                onSelect={(timeSlot) => setBooking({ ...booking, timeSlot })}
              />
            )}

            {currentStep === 'details' && (
              <CustomerForm
                data={booking.customer}
                onChange={(customer) => setBooking({ ...booking, customer })}
              />
            )}

            {currentStep === 'confirmation' && (
              <BookingConfirmation
                booking={booking}
                bookingId={bookingId}
              />
            )}
          </div>

          {currentStep !== 'confirmation' && (
            <div className="mt-12 flex justify-between pt-8 border-t border-white/10">
              <Button
                variant="ghost"
                onClick={handleBack}
                disabled={currentStep === 'branch' || isSubmitting}
                className={currentStep === 'branch' ? 'invisible' : ''}
              >
                <ArrowLeft className="mr-2 w-4 h-4" /> Back
              </Button>

              <Button
                onClick={handleNext}
                disabled={isNextDisabled() || isSubmitting}
                className="w-32"
              >
                {isSubmitting ? 'Submitting...' : currentStep === 'details' ? 'Confirm' : <>Next <ArrowRight className="ml-2 w-4 h-4" /></>}
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}