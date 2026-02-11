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
  hasFullService: true,
   mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3961.392279957761!2d79.95565651141608!3d6.843486919331867!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae2518be381b7c5%3A0x4a941c17725b20!2sANURA%20Tyres%20(Pvt)%20Ltd!5e0!3m2!1sen!2slk!4v1770375086419!5m2!1sen!2slk'
},
{
  id: 'RATNAPURA ',
  name: 'Anura Tyres (Pvt) Ltd Ratnapura',
  location: 'RATNAPURA ',
  address: '151 Colombo Rd, Ratnapura ',
  phone: ' 076 688 5885',
  hasFullService: false,
   mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3962.6795163251204!2d80.39342331141563!3d6.686562421217275!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae3bf0a218889a5%3A0x665426367de1b8cd!2sAnura%20Tyres%20(Pvt)%20Ltd!5e0!3m2!1sen!2slk!4v1770374907522!5m2!1sen!2slk'
},
{
  id: 'KALAWANA ',
  name: 'Anura Tyres Pvt Ltd Kalawana',
  location: 'Nivitigala',
  address: ' Rathnapura road, Kalawana',
  phone: '076 688 5885',
  hasFullService: false,
  mapEmbed:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.8896422768644!2d80.39657541141518!3d6.535619122993324!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae3c3a5f53d61f9%3A0xca811a4f30a39678!2sAnura%20Tyres%20Pvt%20Ltd%20Kalawana!5e0!3m2!1sen!2slk!4v1770375191594!5m2!1sen!2slk'
},
{
  id: 'NIVITHIGALA',
  name: 'Anura Tyre Service Nivithigala',
  location: 'Mathugama',
  address: 'Tiruwanaketiya-Agalawatte Rd, Nivithigala',
  phone: '076 688 5885',
  hasFullService: false,
  mapEmbed:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d253593.90970995533!2d80.04219100212914!3d6.720353881864329!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae3ea75a253b8bf%3A0x1b1cc7d9ad3d2f97!2sAnura%20Tyre%20Service!5e0!3m2!1sen!2slk!4v1770375701115!5m2!1sen!2slk'
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