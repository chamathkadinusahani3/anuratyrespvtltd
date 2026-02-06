import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { BRANCHES } from '../../types';
export function BranchPreview() {
  return (
    <section className="py-20 bg-brand-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Our Network
            </h2>
            <p className="text-brand-gray max-w-xl">
              Conveniently located branches serving you with premium tyre and
              vehicle care services.
            </p>
          </div>
          <Link
            to="/branches"
            className="hidden md:flex items-center text-brand-yellow font-medium hover:underline">

            View all branches <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {BRANCHES.map((branch, index) =>
          <Card
            key={branch.id}
            hoverEffect
            className="group cursor-pointer relative">

              <div className="p-6 h-full flex flex-col">
                <div className="mb-4">
                  <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center mb-4 group-hover:bg-brand-yellow group-hover:text-brand-black transition-colors">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {branch.name}
                  </h3>
                  <p className="text-sm text-brand-gray mb-4">
                    {branch.address}
                  </p>
                </div>

                <div className="mt-auto">
                  {branch.hasFullService ?
                <Badge
                  variant="warning"
                  className="w-full justify-center py-1.5">

                      Full Service Center
                    </Badge> :

                <Badge
                  variant="neutral"
                  className="w-full justify-center py-1.5">

                      Tyre Services Only
                    </Badge>
                }
                </div>
              </div>
            </Card>
          )}
        </div>

        <div className="mt-8 md:hidden text-center">
          <Link
            to="/branches"
            className="inline-flex items-center text-brand-yellow font-medium">

            View all branches <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>);

}