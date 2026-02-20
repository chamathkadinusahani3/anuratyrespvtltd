import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Tag, CheckCircle, AlertCircle, X } from 'lucide-react';

interface CustomerData {
  name: string;
  email: string;
  phone: string;
  vehicleNo?: string;
  discountCode?: string;
  discountInfo?: {
    type: 'corporate' | 'employee';
    companyName?: string;
    employeeName?: string;
    discount: number;
    id: string;
  } | null;
}

interface CustomerFormProps {
  data: CustomerData;
  onChange: (data: CustomerData) => void;
}

export function CustomerForm({ data, onChange }: CustomerFormProps) {
  const [discountInput, setDiscountInput] = useState('');
  const [discountError, setDiscountError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange({ ...data, [name]: value });
  };

  const validateDiscountCode = () => {
    setDiscountError('');
    const code = discountInput.trim().toUpperCase();

    if (!code) {
      setDiscountError('Please enter a discount code.');
      return;
    }

    // Check corporate codes
    const corporates = JSON.parse(localStorage.getItem('at_corporate_customers') || '[]');
    const corporate = corporates.find((c: any) => c.corporateCode === code);
    if (corporate) {
      onChange({
        ...data,
        discountCode: code,
        discountInfo: {
          type: 'corporate',
          companyName: corporate.companyName,
          discount: corporate.discount || 10,
          id: code
        }
      });
      setDiscountInput('');
      return;
    }

    // Check employee codes
    const employees = JSON.parse(localStorage.getItem('at_employee_discounts') || '[]');
    const employee = employees.find((e: any) => e.employeeDiscountId === code);
    if (employee) {
      onChange({
        ...data,
        discountCode: code,
        discountInfo: {
          type: 'employee',
          companyName: employee.companyName,
          employeeName: employee.employeeName,
          discount: employee.discount || 10,
          id: code
        }
      });
      setDiscountInput('');
      return;
    }

    setDiscountError('Invalid code. Please check your Corporate Code or Employee Discount ID.');
  };

  const removeDiscount = () => {
    onChange({ ...data, discountCode: undefined, discountInfo: null });
    setDiscountInput('');
    setDiscountError('');
  };

  return (
    <div className="max-w-md mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Your Details</h2>
        <p className="text-brand-gray">We'll use this to confirm your booking</p>
      </div>

      <div className="space-y-4">
        <Input
          label="Full Name"
          name="name"
          value={data.name}
          onChange={handleChange}
          placeholder="John Doe"
          required
        />

        <Input
          label="Phone Number"
          name="phone"
          type="tel"
          value={data.phone}
          onChange={handleChange}
          placeholder="077 123 4567"
          required
        />

        <Input
          label="Email Address"
          name="email"
          type="email"
          value={data.email}
          onChange={handleChange}
          placeholder="john@example.com"
          required
        />

        <Input
          label="Vehicle Number (Optional)"
          name="vehicleNo"
          value={data.vehicleNo}
          onChange={handleChange}
          placeholder="CAB-1234"
        />

        {/* ── DISCOUNT CODE SECTION ── */}
        <div className="pt-2">
          <div className="border border-neutral-700 rounded-xl p-4 bg-neutral-900/50">
            <div className="flex items-center gap-2 mb-1">
              <Tag className="w-4 h-4 text-brand-yellow" />
              <span className="text-white font-semibold text-sm">Have a Discount Code?</span>
              <span className="text-xs text-neutral-500 ml-auto">Optional</span>
            </div>
            <p className="text-xs text-neutral-500 mb-3">
              Enter your Corporate Code or Employee Discount ID
            </p>

            {data.discountInfo ? (
              /* Applied state */
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-yellow flex items-center justify-center flex-shrink-0">
                    <span className="text-black font-bold text-xs leading-tight text-center">
                      {data.discountInfo.discount}%<br />
                      <span className="text-[9px]">OFF</span>
                    </span>
                  </div>
                  <div>
                    <p className="text-green-400 font-semibold text-xs flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      {data.discountInfo.type === 'corporate'
                        ? 'Corporate Discount Applied'
                        : 'Employee Discount Applied'}
                    </p>
                    <p className="text-white text-sm font-mono font-bold mt-0.5">
                      {data.discountCode}
                    </p>
                    {data.discountInfo.companyName && (
                      <p className="text-neutral-400 text-xs mt-0.5">
                        Company: {data.discountInfo.companyName}
                      </p>
                    )}
                    {data.discountInfo.employeeName && (
                      <p className="text-neutral-400 text-xs">
                        Employee: {data.discountInfo.employeeName}
                      </p>
                    )}
                    <p className="text-green-400 text-xs mt-1">
                      {data.discountInfo.discount}% discount will be applied at the branch
                    </p>
                  </div>
                </div>
                <button
                  onClick={removeDiscount}
                  className="text-neutral-500 hover:text-red-400 transition-colors flex-shrink-0 mt-0.5"
                  title="Remove discount"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              /* Input state */
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={discountInput}
                    onChange={e => {
                      setDiscountInput(e.target.value.toUpperCase());
                      setDiscountError('');
                    }}
                    onKeyDown={e => e.key === 'Enter' && validateDiscountCode()}
                    placeholder="CORP-XXXXX or EMP-XXXXX"
                    className="flex-1 px-3 py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder:text-neutral-600 focus:outline-none focus:border-brand-yellow transition-colors font-mono text-sm"
                  />
                  <button
                    type="button"
                    onClick={validateDiscountCode}
                    className="px-4 py-2.5 bg-brand-yellow text-black font-bold rounded-lg hover:bg-brand-yellow/90 transition-colors text-sm flex-shrink-0"
                  >
                    Apply
                  </button>
                </div>
                {discountError && (
                  <div className="flex items-center gap-1.5 text-red-400 text-xs">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    {discountError}
                  </div>
                )}
                <p className="text-xs text-neutral-600">
                  Corporate codes start with{' '}
                  <span className="text-neutral-400 font-mono">CORP-</span> · Employee IDs start with{' '}
                  <span className="text-neutral-400 font-mono">EMP-</span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}