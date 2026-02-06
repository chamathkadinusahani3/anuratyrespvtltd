export type Branch = {
  id: string;
  name: string;
  location: string;
  address: string;
  phone: string;
  hasFullService: boolean; // True for Pannipitiya
  coordinates?: {lat: number;lng: number;};
};

export type ServiceCategory = 'Anura Tyres' | 'Mechanix' | 'Truck & Bus';

export type ServiceItem = {
  id: string;
  name: string;
  category: ServiceCategory;
  description?: string;
  icon?: string;
};

export type BookingStep =
'branch' |
'category' |
'service' |
'date' |
'time' |
'details' |
'confirmation';

export type BookingState = {
  branch: Branch | null;
  category: ServiceCategory | null;
  services: ServiceItem[];
  date: Date | null;
  timeSlot: string | null;
  customer: {
    name: string;
    email: string;
    phone: string;
    vehicleNo?: string;
  };
};

export const BRANCHES: Branch[] = [
{
  id: 'pannipitiya',
  name: 'Anura Tyres (Pvt) Ltd Pannipitiya',
  location: 'Pannipitiya',
  address: '278/2 High Level Rd, Pannipitiya ',
  phone: '077 578 5785',
  hasFullService: true
},
{
  id: 'RATNAPURA ',
  name: 'Anura Tyres (Pvt) Ltd Ratnapura',
  location: 'RATNAPURA ',
  address: '151 Colombo Rd, Ratnapura ',
  phone: ' 076 688 5885',
  hasFullService: false
},
{
  id: 'KALAWANA ',
  name: 'Anura Tyres Pvt Ltd Kalawana',
  location: 'Nivitigala',
  address: ' Rathnapura road, Kalawana',
  phone: '076 688 5885',
  hasFullService: false
},
{
  id: 'NIVITHIGALA',
  name: 'Anura Tyre Service Nivithigala',
  location: 'Mathugama',
  address: 'Tiruwanaketiya-Agalawatte Rd, Nivithigala',
  phone: '076 688 5885',
  hasFullService: false
}];


export const SERVICE_CATEGORIES: {
  id: ServiceCategory;
  label: string;
  description: string;
}[] = [
{
  id: 'Anura Tyres',
  label: 'Anura Tyres',
  description: 'Premium tyres, alignment, and wheel services.'
},
{
  id: 'Mechanix',
  label: 'Mechanix',
  description: 'Expert mechanical repairs and diagnostics.'
},
{
  id: 'Truck & Bus',
  label: 'Truck & Bus',
  description: 'Heavy vehicle tyres and maintenance.'
}];


export const SERVICES: ServiceItem[] = [
// Anura Tyres
{ id: 'tyre-sales', name: 'Tyre Sales', category: 'Anura Tyres' },
{ id: 'alignment', name: 'Wheel Alignment', category: 'Anura Tyres' },
{ id: 'balancing', name: 'Wheel Balancing', category: 'Anura Tyres' },
{ id: 'batteries', name: 'Batteries', category: 'Anura Tyres' },
{ id: 'alloy-wheels', name: 'Alloy Wheels', category: 'Anura Tyres' },
{ id: 'puncture', name: 'Puncture Repair', category: 'Anura Tyres' },

// Mechanix
{ id: 'brakes', name: 'Brakes Service', category: 'Mechanix' },
{ id: 'suspension', name: 'Suspension', category: 'Mechanix' },
{ id: 'oil-change', name: 'Oil Change', category: 'Mechanix' },
{ id: 'tune-up', name: 'Engine Tune-Up', category: 'Mechanix' },
{ id: 'full-service', name: 'Full Service', category: 'Mechanix' },
{ id: 'diagnostics', name: 'Diagnostics', category: 'Mechanix' },

// Truck & Bus
{ id: 'heavy-tyres', name: 'Heavy Tyres', category: 'Truck & Bus' },
{ id: 'heavy-alignment', name: 'Heavy Alignment', category: 'Truck & Bus' },
{ id: 'heavy-balancing', name: 'Heavy Balancing', category: 'Truck & Bus' },
{ id: 'heavy-brakes', name: 'Heavy Brakes', category: 'Truck & Bus' },
{ id: 'heavy-suspension', name: 'Heavy Suspension', category: 'Truck & Bus' }];