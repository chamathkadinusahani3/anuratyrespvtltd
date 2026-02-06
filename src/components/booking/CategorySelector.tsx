import React from 'react';
import { Car, Wrench, Truck } from 'lucide-react';
import { Card } from '../ui/Card';
import { ServiceCategory, SERVICE_CATEGORIES, Branch } from '../../types';
interface CategorySelectorProps {
  selectedBranch: Branch;
  selectedCategory: ServiceCategory | null;
  onSelect: (category: ServiceCategory) => void;
}
export function CategorySelector({
  selectedBranch,
  selectedCategory,
  onSelect
}: CategorySelectorProps) {
  // Filter categories based on branch capabilities
  // Only Pannipitiya has all services. Others only have 'Anura Tyres'
  const availableCategories = selectedBranch.hasFullService ?
  SERVICE_CATEGORIES :
  SERVICE_CATEGORIES.filter((c) => c.id === 'Anura Tyres');
  const getIcon = (id: ServiceCategory) => {
    switch (id) {
      case 'Anura Tyres':
        return Car;
      case 'Mechanix':
        return Wrench;
      case 'Truck & Bus':
        return Truck;
    }
  };
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">
          Select Service Category
        </h2>
        <p className="text-brand-gray">What type of service do you need?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {availableCategories.map((category) => {
          const Icon = getIcon(category.id);
          const isSelected = selectedCategory === category.id;
          return (
            <Card
              key={category.id}
              variant={isSelected ? 'active' : 'default'}
              className={`cursor-pointer transition-all duration-200 ${isSelected ? 'bg-brand-yellow/5' : 'hover:bg-white/5'}`}
              onClick={() => onSelect(category.id)}>

              <div className="p-8 flex flex-col items-center text-center">
                <div
                  className={`
                  w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-colors
                  ${isSelected ? 'bg-brand-yellow text-brand-black' : 'bg-white/10 text-brand-gray'}
                `}>

                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {category.label}
                </h3>
                <p className="text-brand-gray text-sm">
                  {category.description}
                </p>
              </div>
            </Card>);

        })}
      </div>
    </div>);

}