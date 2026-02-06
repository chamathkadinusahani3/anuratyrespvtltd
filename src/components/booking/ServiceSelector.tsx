import React from 'react';
import { Check } from 'lucide-react';
import { Card } from '../ui/Card';
import { ServiceCategory, ServiceItem, SERVICES } from '../../types';
interface ServiceSelectorProps {
  category: ServiceCategory;
  selectedServices: ServiceItem[];
  onToggle: (service: ServiceItem) => void;
}
export function ServiceSelector({
  category,
  selectedServices,
  onToggle
}: ServiceSelectorProps) {
  const availableServices = SERVICES.filter((s) => s.category === category);
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Select Services</h2>
        <p className="text-brand-gray">
          Choose one or more services from {category}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {availableServices.map((service) => {
          const isSelected = selectedServices.some((s) => s.id === service.id);
          return (
            <Card
              key={service.id}
              variant={isSelected ? 'active' : 'default'}
              className={`cursor-pointer transition-all duration-200 ${isSelected ? 'bg-brand-yellow/5' : 'hover:bg-white/5'}`}
              onClick={() => onToggle(service)}>

              <div className="p-4 flex items-center justify-between">
                <span
                  className={`font-medium ${isSelected ? 'text-white' : 'text-brand-gray'}`}>

                  {service.name}
                </span>
                <div
                  className={`
                  w-6 h-6 rounded-full border flex items-center justify-center transition-colors
                  ${isSelected ? 'bg-brand-yellow border-brand-yellow text-brand-black' : 'border-white/20'}
                `}>

                  {isSelected && <Check className="w-4 h-4" />}
                </div>
              </div>
            </Card>);

        })}
      </div>
    </div>);

}