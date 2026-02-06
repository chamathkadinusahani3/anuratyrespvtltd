import React from 'react';
import { Input } from '../ui/Input';
interface CustomerData {
  name: string;
  email: string;
  phone: string;
  vehicleNo?: string;
}
interface CustomerFormProps {
  data: CustomerData;
  onChange: (data: CustomerData) => void;
}
export function CustomerForm({ data, onChange }: CustomerFormProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange({
      ...data,
      [name]: value
    });
  };
  return (
    <div className="max-w-md mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Your Details</h2>
        <p className="text-brand-gray">
          We'll use this to confirm your booking
        </p>
      </div>

      <div className="space-y-4">
        <Input
          label="Full Name"
          name="name"
          value={data.name}
          onChange={handleChange}
          placeholder="John Doe"
          required />


        <Input
          label="Phone Number"
          name="phone"
          type="tel"
          value={data.phone}
          onChange={handleChange}
          placeholder="077 123 4567"
          required />


        <Input
          label="Email Address"
          name="email"
          type="email"
          value={data.email}
          onChange={handleChange}
          placeholder="john@example.com"
          required />


        <Input
          label="Vehicle Number (Optional)"
          name="vehicleNo"
          value={data.vehicleNo}
          onChange={handleChange}
          placeholder="CAB-1234" />

      </div>
    </div>);

}