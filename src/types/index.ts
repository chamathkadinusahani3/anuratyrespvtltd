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
  phone: ' 0777 32 95 32',
  hasFullService: false,
  mapEmbed:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.8896422768644!2d80.39657541141518!3d6.535619122993324!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae3c3a5f53d61f9%3A0xca811a4f30a39678!2sAnura%20Tyres%20Pvt%20Ltd%20Kalawana!5e0!3m2!1sen!2slk!4v1770375191594!5m2!1sen!2slk'
},
{
  id: 'NIVITHIGALA',
  name: 'Anura Tyre Service Nivithigala',
  location: 'Mathugama',
  address: 'Tiruwanaketiya-Agalawatte Rd, Nivithigala',
  phone: '045 227 9396 ',
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
  // ===============================
  // ANURA TYRES
  // ===============================
  {
    id: 'tyre-sales',
    name: 'Tyre Sales',
    category: 'Anura Tyres',
    description:
      'Wide range of premium tyres for cars, SUVs, and 4x4 vehicles. We help you choose the perfect tyre for safety, durability, and performance.'
  },
  {
    id: 'alignment',
    name: 'Wheel Alignment',
    category: 'Anura Tyres',
    description:
      'Computerized wheel alignment to correct steering angles, prevent uneven tyre wear, and improve driving stability.'
  },
  {
    id: 'balancing',
    name: 'Wheel Balancing',
    category: 'Anura Tyres',
    description:
      'Precision wheel balancing to eliminate vibration and ensure smooth, comfortable driving at all speeds.'
  },
  {
    id: 'batteries',
    name: 'Batteries',
    category: 'Anura Tyres',
    description:
      'High-performance automotive batteries with professional installation and reliable starting power.'
  },
  {
    id: 'alloy-wheels',
    name: 'Alloy Wheels',
    category: 'Anura Tyres',
    description:
      'Stylish and durable alloy wheels that enhance both the look and performance of your vehicle.'
  },
  {
    id: 'puncture',
    name: 'Puncture Repair',
    category: 'Anura Tyres',
    description:
      'Quick and safe puncture repair service to get you back on the road with confidence.'
  },

  // ===============================
  // MECHANIX
  // ===============================
  {
    id: 'brakes',
    name: 'Brakes Service',
    category: 'Mechanix',
    description:
      'Complete brake inspection, pad replacement, and fluid checks to ensure maximum stopping power.'
  },
  {
    id: 'suspension',
    name: 'Suspension',
    category: 'Mechanix',
    description:
      'Professional suspension repairs and replacements for improved stability and ride comfort.'
  },
  {
    id: 'oil-change',
    name: 'Oil Change',
    category: 'Mechanix',
    description:
      'Premium engine oil and filter replacement to keep your engine clean and efficient.'
  },
  {
    id: 'tune-up',
    name: 'Engine Tune-Up',
    category: 'Mechanix',
    description:
      'Comprehensive engine tune-up to restore performance, power, and fuel efficiency.'
  },
  {
    id: 'full-service',
    name: 'Full Service',
    category: 'Mechanix',
    description:
      'Complete vehicle service including inspection, fluids, filters, and safety checks.'
  },
  {
    id: 'diagnostics',
    name: 'Diagnostics',
    category: 'Mechanix',
    description:
      'Advanced computerized diagnostics to quickly detect and resolve vehicle issues.'
  },

  // ===============================
  // TRUCK & BUS
  // ===============================
  {
    id: 'heavy-tyres',
    name: 'Heavy Tyres',
    category: 'Truck & Bus',
    description:
      'Durable heavy-duty tyres designed for trucks and buses with maximum load capacity and long mileage.'
  },
  {
    id: 'heavy-alignment',
    name: 'Heavy Alignment',
    category: 'Truck & Bus',
    description:
      'Precision alignment service for commercial vehicles to reduce tyre wear and improve stability.'
  },
  {
    id: 'heavy-balancing',
    name: 'Heavy Balancing',
    category: 'Truck & Bus',
    description:
      'Specialized balancing for large commercial wheels to ensure smooth long-distance travel.'
  },
  {
    id: 'heavy-brakes',
    name: 'Heavy Brakes',
    category: 'Truck & Bus',
    description:
      'Complete brake servicing for heavy vehicles to ensure safe stopping under maximum load.'
  },
  {
    id: 'heavy-suspension',
    name: 'Heavy Suspension',
    category: 'Truck & Bus',
    description:
      'Heavy-duty suspension repairs and reinforcement for commercial fleet durability.'
  }
];