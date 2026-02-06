import React from 'react';
import { MapPin } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Branch, BRANCHES } from '../../types';
interface BranchSelectorProps {
  selectedBranch: Branch | null;
  onSelect: (branch: Branch) => void;
}
export function BranchSelector({
  selectedBranch,
  onSelect
}: BranchSelectorProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Select a Branch</h2>
        <p className="text-brand-gray">
          Choose the location most convenient for you
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {BRANCHES.map((branch) =>
        <Card
          key={branch.id}
          variant={selectedBranch?.id === branch.id ? 'active' : 'default'}
          className={`cursor-pointer transition-all duration-200 ${selectedBranch?.id === branch.id ? 'bg-brand-yellow/5' : 'hover:bg-white/5'}`}
          onClick={() => onSelect(branch)}>

            <div className="p-6 flex items-start gap-4">
              <div
              className={`
                w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
                ${selectedBranch?.id === branch.id ? 'bg-brand-yellow text-brand-black' : 'bg-white/10 text-brand-gray'}
              `}>

                <MapPin className="w-5 h-5" />
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-white text-lg">
                    {branch.name}
                  </h3>
                  {branch.hasFullService &&
                <Badge variant="warning">Full Service</Badge>
                }
                </div>
                <p className="text-brand-gray text-sm mb-3">{branch.address}</p>
                <p className="text-brand-gray/60 text-xs">{branch.phone}</p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>);

}