// src/services/api.ts

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface BookingPayload {
  branch: {
    id: string;
    name: string;
    address: string;
    phone: string;
  } | null;
  category: string | null;
  services: Array<{
    id: string;
    name: string;
    category: string;
  }>;
  date: Date | null;
  timeSlot: string | null;
  customer: {
    name: string;
    email: string;
    phone: string;
    vehicleNo?: string;
  };
}

export interface BookingResponse {
  success: boolean;
  message: string;
  booking?: {
    bookingId: string;
    customer: {
      name: string;
      email: string;
      phone: string;
    };
    date: Date;
    timeSlot: string;
    branch: {
      name: string;
    };
  };
  error?: string;
}

export const bookingAPI = {
  // Create a new booking
  async createBooking(bookingData: BookingPayload): Promise<BookingResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create booking');
      }

      return data;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  },

  // Health check
  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      const data = await response.json();
      return data.status === 'OK';
    } catch (error) {
      console.error('API health check failed:', error);
      return false;
    }
  }
};