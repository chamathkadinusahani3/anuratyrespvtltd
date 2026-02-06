import React, { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Search, ExternalLink, Send } from 'lucide-react';

// Product Data from The Tyre Station
const PRODUCTS = [
  // PASSENGER CAR
  {
    id: 1,
    brand: "FORZA 001",
    pattern: "FORZA 001",
    desc: "Deliver a thrilling ride with maximum precision.",
    category: "PASSENGER CAR",
    image: "https://image.makewebeasy.net/makeweb/m_1920x0/JCbWKd3P2/PassengerCar/banner_product_FORZA_001_img_2x.png?v=202405291424",
    link: "https://kinto-tyres.lk/product/forza-001/",
    stock: "In Stock"
  },
  {
    id: 2,
    brand: "FALCO S88",
    pattern: "FALCO S88",
    desc: "Perfect balance of dynamic appearance and sport-oriented performance.",
    category: "PASSENGER CAR",
    image: "https://image.makewebeasy.net/makeweb/m_1920x0/JCbWKd3P2/PassengerCar/banner_product_FALCO_S88_img_2x.png?v=202405291424",
    link: "https://kinto-tyres.lk/product/falco-s88/",
    stock: "In Stock"
  },
  {
    id: 3,
    brand: "V-36",
    pattern: "V-36",
    desc: "Feel the greater stability and control.",
    category: "PASSENGER CAR",
    image: "https://image.makewebeasy.net/makeweb/m_1920x0/JCbWKd3P2/PassengerCar/banner_product_V-36_img_2x.png?v=202405291424",
    link: "https://kinto-tyres.lk/product/v-36/",
    stock: "In Stock"
  },
  {
    id: 4,
    brand: "X-68+",
    pattern: "X-68+",
    desc: "Enjoy the ultimate handling and grip.",
    category: "PASSENGER CAR",
    image: "https://image.makewebeasy.net/makeweb/m_1920x0/JCbWKd3P2/PassengerCar/banner_product_X-68__img_2x.png?v=202405291424",
    link: "https://kinto-tyres.lk/product/x-68-plus/",
    stock: "In Stock"
  },
  {
    id: 5,
    brand: "SC-900",
    pattern: "SC-900",
    desc: "Quieter, Safer and Smoother Journey.",
    category: "PASSENGER CAR",
    image: "https://image.makewebeasy.net/makeweb/m_1920x0/JCbWKd3P2/PassengerCar/banner_product_SC-900_img_2x.png?v=202405291424",
    link: "https://kinto-tyres.lk/product/sc-900/",
    stock: "In Stock"
  },
  {
    id: 6,
    brand: "SC-901",
    pattern: "SC-901",
    desc: "Cost-effective with long endurance.",
    category: "PASSENGER CAR",
    image: "https://image.makewebeasy.net/makeweb/m_1920x0/JCbWKd3P2/PassengerCar/banner_product_SC-901_img_2x.png?v=202405291424",
    link: "https://kinto-tyres.lk/product/sc-901/",
    stock: "In Stock"
  },
  {
    id: 7,
    brand: "ST-51",
    pattern: "ST-51",
    desc: "Longevity and performance on the highway.",
    category: "PASSENGER CAR",
    image: "https://image.makewebeasy.net/makeweb/m_1920x0/JCbWKd3P2/PassengerCar/banner_product_ST-51_img_2x.png?v=202405291424",
    link: "https://kinto-tyres.lk/product/st-51/",
    stock: "In Stock"
  },
  {
    id: 8,
    brand: "ST-55",
    pattern: "ST-55",
    desc: "Pure street performance.",
    category: "PASSENGER CAR",
    image: "https://image.makewebeasy.net/makeweb/m_1920x0/JCbWKd3P2/PassengerCar/banner_product_ST-55_img_2x.png?v=202405291424",
    link: "https://kinto-tyres.lk/product/st-55/",
    stock: "In Stock"
  },
  {
    id: 9,
    brand: "SW-89",
    pattern: "SW-89",
    desc: "High-speed travel on snow and ice.",
    category: "PASSENGER CAR",
    image: "https://image.makewebeasy.net/makeweb/m_1920x0/JCbWKd3P2/PassengerCar/banner_product_SW-89_img_2x.png?v=202405291424",
    link: "https://kinto-tyres.lk/product/sw-89/",
    stock: "In Stock"
  },
  {
    id: 10,
    brand: "KAIJU-2",
    pattern: "KAIJU-2",
    desc: "Meet your daily adventures on and off the road.",
    category: "PASSENGER CAR",
    image: "https://image.makewebeasy.net/makeweb/m_1920x0/JCbWKd3P2/LightTruck/banner_product_KAIJU-2_img_2x.png?v=202405291424",
    link: "https://kinto-tyres.lk/product/kaiju-2/",
    stock: "In Stock"
  },
  {
    id: 11,
    brand: "SM-5",
    pattern: "SM-5",
    desc: "Balance performance over various terrains.",
    category: "PASSENGER CAR",
    image: "https://image.makewebeasy.net/makeweb/m_1920x0/JCbWKd3P2/LightTruck/banner_product_SM-5_img_2x.png?v=202405291424",
    link: "https://kinto-tyres.lk/product/sm-5/",
    stock: "In Stock"
  },

  // LIGHT TRUCK
  {
    id: 12,
    brand: "PRESA M/T",
    pattern: "PRESA M/T",
    desc: "Experience go-anywhere performance with amazing traction.",
    category: "LIGHT TRUCK",
    image: "https://image.makewebeasy.net/makeweb/m_1920x0/JCbWKd3P2/LightTruck/banner_product_PRESA_M_T_img_2x.png?v=202405291424",
    link: "https://kinto-tyres.lk/product/presa-m-t/",
    stock: "In Stock"
  },
  {
    id: 13,
    brand: "FUERTE K99",
    pattern: "FUERTE K99",
    desc: "Address the multi-purpose needs of modern commercial vehicles.",
    category: "LIGHT TRUCK",
    image: "https://image.makewebeasy.net/makeweb/m_1920x0/JCbWKd3P2/LightTruck/banner_product_FUERTE_K99_img_2x.png?v=202405291424",
    link: "https://kinto-tyres.lk/product/fuerte-k99/",
    stock: "In Stock"
  },
  {
    id: 14,
    brand: "SM-1",
    pattern: "SM-1",
    desc: "Gain more mileage through extended periods of wear.",
    category: "LIGHT TRUCK",
    image: "https://image.makewebeasy.net/makeweb/m_1920x0/JCbWKd3P2/LightTruck/banner_product_SM-1_img_2x.png?v=202405291424",
    link: "https://kinto-tyres.lk/product/sm-1/",
    stock: "In Stock"
  },

  // TRUCK & BUS
  {
    id: 15,
    brand: "KMX707",
    pattern: "KMX707",
    desc: "",
    category: "TRUCK & BUS",
    image: "https://image.makewebeasy.net/makeweb/m_1920x0/JCbWKd3P2/TruckBus/banner_product_KMX707_img_2x_1.webp?v=202405291424",
    link: "https://kinto-tyres.lk/product/kmx707/",
    stock: "In Stock"
  },
  {
    id: 16,
    brand: "SLH101",
    pattern: "SLH101",
    desc: "",
    category: "TRUCK & BUS",
    image: "https://image.makewebeasy.net/makeweb/m_1920x0/JCbWKd3P2/TruckBus/banner_product_SLH101_img_2x.webp?v=202405291424",
    link: "https://kinto-tyres.lk/product/slh101/",
    stock: "In Stock"
  },
  {
    id: 17,
    brand: "SLH100",
    pattern: "SLH100",
    desc: "",
    category: "TRUCK & BUS",
    image: "https://image.makewebeasy.net/makeweb/m_1920x0/JCbWKd3P2/TruckBus/banner_product_SLH100_img_2x.webp?v=202405291424",
    link: "https://kinto-tyres.lk/product/slh100/",
    stock: "In Stock"
  },
  {
    id: 18,
    brand: "KMX700",
    pattern: "KMX700",
    desc: "",
    category: "TRUCK & BUS",
    image: "https://image.makewebeasy.net/makeweb/m_1920x0/JCbWKd3P2/TruckBus/banner_product_KMX700_img_2x-1.webp?v=202405291424",
    link: "https://kinto-tyres.lk/product/kmx700/",
    stock: "In Stock"
  },
  {
    id: 19,
    brand: "KMX703",
    pattern: "KMX703",
    desc: "",
    category: "TRUCK & BUS",
    image: "https://image.makewebeasy.net/makeweb/m_1920x0/JCbWKd3P2/TruckBus/banner_product_KMX703_img_2x_1.webp?v=202405291424",
    link: "https://kinto-tyres.lk/product/kmx703/",
    stock: "In Stock"
  },
  {
    id: 20,
    brand: "KMN606",
    pattern: "KMN606",
    desc: "",
    category: "TRUCK & BUS",
    image: "https://image.makewebeasy.net/makeweb/m_1920x0/JCbWKd3P2/TruckBus/banner_product_KMN606_img_2x_1.webp?v=202405291424",
    link: "https://kinto-tyres.lk/product/kmn606/",
    stock: "In Stock"
  },

  // OFF THE ROAD
  {
    id: 21,
    brand: "E3L3/E3L3+/E3L3B/E3L3B+/E3L3C",
    pattern: "E3L3 SERIES",
    desc: "",
    category: "OFF THE ROAD",
    image: "https://image.makewebeasy.net/makeweb/crop/JCbWKd3P2/OffTheRoad/E3L3C_1.png?v=202405291424&x=47&y=0&w=266&h=421",
    link: "https://kinto-tyres.lk/product/e3l3-e3l3-plus-e3l3b-e3l3b-plus-e3l3c/#sec67672682a72e5e33f0c9368adzv",
    stock: "In Stock"
  },
  {
    id: 22,
    brand: "G2L2",
    pattern: "G2L2",
    desc: "",
    category: "OFF THE ROAD",
    image: "https://image.makewebeasy.net/makeweb/crop/JCbWKd3P2/OffTheRoad/G2L2_1.png?v=202405291424&x=47&y=0&w=266&h=421",
    link: "https://kinto-tyres.lk/product/g2l2/",
    stock: "In Stock"
  },
  {
    id: 23,
    brand: "C-1/L5-S",
    pattern: "C-1/L5-S",
    desc: "",
    category: "OFF THE ROAD",
    image: "https://image.makewebeasy.net/makeweb/crop/JCbWKd3P2/OffTheRoad/C-1_1.png?v=202405291424&x=47&y=0&w=266&h=421",
    link: "https://kinto-tyres.lk/product/c-1-l5-s/",
    stock: "In Stock"
  },
  {
    id: 24,
    brand: "R3",
    pattern: "R3",
    desc: "",
    category: "OFF THE ROAD",
    image: "https://image.makewebeasy.net/makeweb/crop/JCbWKd3P2/OffTheRoad/R3.png?v=202405291424&x=47&y=0&w=266&h=421",
    link: "https://kinto-tyres.lk/product/r3/",
    stock: "In Stock"
  },
  {
    id: 25,
    brand: "R4",
    pattern: "R4",
    desc: "",
    category: "OFF THE ROAD",
    image: "https://image.makewebeasy.net/makeweb/crop/JCbWKd3P2/OffTheRoad/R4_1.png?v=202405291424&x=47&y=0&w=266&h=421",
    link: "https://kinto-tyres.lk/product/r4/",
    stock: "In Stock"
  },
  {
    id: 26,
    brand: "XF336",
    pattern: "XF336",
    desc: "",
    category: "OFF THE ROAD",
    image: "https://image.makewebeasy.net/makeweb/crop/JCbWKd3P2/OffTheRoad/XF336_1.png?v=202405291424&x=47&y=0&w=266&h=421",
    link: "https://kinto-tyres.lk/product/xf336/",
    stock: "In Stock"
  },
  {
    id: 27,
    brand: "SKS-1/SKS-3",
    pattern: "SKS SERIES",
    desc: "",
    category: "OFF THE ROAD",
    image: "https://image.makewebeasy.net/makeweb/crop/JCbWKd3P2/OffTheRoad/SKS-1_1.png?v=202405291424&x=47&y=0&w=266&h=421",
    link: "https://kinto-tyres.lk/product/sks-1-sks-3/",
    stock: "In Stock"
  },
  {
    id: 28,
    brand: "R1-W",
    pattern: "R1-W",
    desc: "",
    category: "OFF THE ROAD",
    image: "https://image.makewebeasy.net/makeweb/crop/JCbWKd3P2/OffTheRoad/R1-W_1.png?v=202405291424&x=47&y=0&w=266&h=421",
    link: "https://kinto-tyres.lk/product/r1-w/",
    stock: "In Stock"
  },
  {
    id: 29,
    brand: "XF007/XF007A",
    pattern: "XF007 SERIES",
    desc: "",
    category: "OFF THE ROAD",
    image: "https://image.makewebeasy.net/makeweb/crop/JCbWKd3P2/OffTheRoad/XF007_1.png?v=202405291424&x=47&y=0&w=266&h=421",
    link: "https://kinto-tyres.lk/product/xf007-xf007a/",
    stock: "In Stock"
  },
  {
    id: 30,
    brand: "XF208",
    pattern: "XF208",
    desc: "",
    category: "OFF THE ROAD",
    image: "https://image.makewebeasy.net/makeweb/crop/JCbWKd3P2/OffTheRoad/XF208_1.png?v=202405291424&x=47&y=0&w=266&h=421",
    link: "https://kinto-tyres.lk/product/xf208/",
    stock: "In Stock"
  },
  {
    id: 31,
    brand: "KA-6",
    pattern: "KA-6",
    desc: "",
    category: "OFF THE ROAD",
    image: "https://image.makewebeasy.net/makeweb/crop/JCbWKd3P2/OffTheRoad/KA-6_1.png?v=202405291424&x=47&y=0&w=266&h=421",
    link: "https://kinto-tyres.lk/product/ka-6/",
    stock: "In Stock"
  },
  {
    id: 32,
    brand: "R1/R1+/R1-1/R1-2/R1-3/R1-4/R1-5",
    pattern: "R1 SERIES",
    desc: "",
    category: "OFF THE ROAD",
    image: "https://image.makewebeasy.net/makeweb/crop/JCbWKd3P2/OffTheRoad/R1-2_1.png?v=202405291424&x=47&y=0&w=266&h=421",
    link: "https://kinto-tyres.lk/product/r1r1r1-1r1-2r1-3r1-4r1-5/",
    stock: "In Stock"
  },
  {
    id: 33,
    brand: "PR-1",
    pattern: "PR-1",
    desc: "",
    category: "OFF THE ROAD",
    image: "https://image.makewebeasy.net/makeweb/crop/JCbWKd3P2/OffTheRoad/PR-1_1.png?v=202405291424&x=46&y=15&w=266&h=388",
    link: "https://kinto-tyres.lk/product/pr-1/",
    stock: "In Stock"
  },

  // TOOLS
  { id: 201, brand: "TYRE VULCANIZER(240V)", pattern: "", category: "TOOLS", stock: "In Stock" },
  { id: 202, brand: "Cross Beam Adaptor", pattern: "", category: "TOOLS", stock: "In Stock" },
  { id: 203, brand: "Wheel Nut 1.25 19-12xMM 1.25", pattern: "1006S-L27 HEX", category: "TOOLS", stock: "In Stock" },
  { id: 204, brand: "Wheel Nut 1.5 19-12xMM 1.5", pattern: "1007S-L27 HEX", category: "TOOLS", stock: "In Stock" },
  { id: 205, brand: "ADHESIVE WHEEL WEIGHT 6KG", pattern: "5G 10G*4 FE", category: "TOOLS", stock: "In Stock" },
  { id: 206, brand: "Air hose reel", pattern: "AHC-34-3", category: "TOOLS", stock: "In Stock" },
  { id: 207, brand: "Tiltback Tyre Changers (automatic)", pattern: "C233GB NAAR", category: "TOOLS", stock: "In Stock" },
  { id: 208, brand: "3T Low Profile Garage Jack", pattern: "E1525C", category: "TOOLS", stock: "In Stock" },
  { id: 209, brand: "2T Rachet Jack Stand with Safety Pin", pattern: "E1902", category: "TOOLS", stock: "In Stock" },
  { id: 210, brand: "3T Rachet Jack Stands with Safety Pin", pattern: "E1903", category: "TOOLS", stock: "In Stock" },
  { id: 211, brand: "Baseless 2 Post Lift 4T", pattern: "E2-4.0", category: "TOOLS", stock: "In Stock" },
  { id: 212, brand: "10 Ton Welded hydraulic Bottle Jack", pattern: "E3110", category: "TOOLS", stock: "In Stock" },
  { id: 213, brand: "20 Ton Welded Hydraulic Bottle Jack", pattern: "E3120", category: "TOOLS", stock: "In Stock" },
  { id: 214, brand: "30 Ton Welded Hydraulic Bottle Jack", pattern: "E3130", category: "TOOLS", stock: "In Stock" },
  { id: 215, brand: "50 Ton Hydraulic Bottle Jack", pattern: "E3150", category: "TOOLS", stock: "In Stock" },
  { id: 216, brand: "10000PSI Aluminum Air Hydraulic Pump", pattern: "E51020", category: "TOOLS", stock: "In Stock" },
  { id: 217, brand: "Air Chuck", pattern: "EAC512", category: "TOOLS", stock: "In Stock" },
  { id: 218, brand: "Tyre Pressure Gauge-Normal", pattern: "ECG-008A", category: "TOOLS", stock: "In Stock" },
  { id: 219, brand: "Tyre Pressure Gauge-Digital", pattern: "ECG-008B", category: "TOOLS", stock: "In Stock" },
  { id: 220, brand: "Labour Saving Wrench", pattern: "EW-78A", category: "TOOLS", stock: "In Stock" },
  { id: 221, brand: "ECCENTRIC CAMBER BOLT", pattern: "M10", category: "TOOLS", stock: "In Stock" },
  { id: 222, brand: "ECCENTRIC CAMBER BOLT", pattern: "M12", category: "TOOLS", stock: "In Stock" },
  { id: 223, brand: "ECCENTRIC CAMBER BOLT", pattern: "M13", category: "TOOLS", stock: "In Stock" },
  { id: 224, brand: "ECCENTRIC CAMBER BOLT", pattern: "M14", category: "TOOLS", stock: "In Stock" },
  { id: 225, brand: "ECCENTRIC CAMBER BOLT", pattern: "M15", category: "TOOLS", stock: "In Stock" },
  { id: 226, brand: "ECCENTRIC CAMBER BOLT", pattern: "M16", category: "TOOLS", stock: "In Stock" },
  { id: 227, brand: "ECCENTRIC CAMBER BOLT", pattern: "M17", category: "TOOLS", stock: "In Stock" },
  { id: 228, brand: "Tyre Mounting Paste 1kg", pattern: "PRO-3001", category: "TOOLS", stock: "In Stock" },
  { id: 229, brand: "Tyre Mounting Paste 3kg", pattern: "PRO-3003", category: "TOOLS", stock: "In Stock" },
  { id: 230, brand: "Tyre Mounting Paste 5kg", pattern: "PRO-3005", category: "TOOLS", stock: "In Stock" },
  { id: 231, brand: "Ten Socket Kits", pattern: "SOCKET-10", category: "TOOLS", stock: "In Stock" },
  { id: 232, brand: "Three Sockets Kits", pattern: "SOCKETS-3", category: "TOOLS", stock: "In Stock" },
  { id: 233, brand: "1TON Spring Compressor", pattern: "TL-10005", category: "TOOLS", stock: "In Stock" },
  { id: 234, brand: "1000LBS Motorcycle Jack", pattern: "TL-31001", category: "TOOLS", stock: "In Stock" },
  { id: 235, brand: "20 Ton Hydraulic Shop Press", pattern: "TL-5920", category: "TOOLS", stock: "In Stock" },
  { id: 236, brand: "Tubless Repair Kit", pattern: "TRK-006", category: "TOOLS", stock: "In Stock" },
  { id: 237, brand: "Tyre Valve Key", pattern: "VT-011", category: "TOOLS", stock: "In Stock" },
  { id: 238, brand: "Tyre Valve Puller (Blue)", pattern: "VT-026A", category: "TOOLS", stock: "In Stock" },
  { id: 239, brand: "Tyre Valve Puller (Green)", pattern: "VT-026B", category: "TOOLS", stock: "In Stock" },
];

export function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const categories = [
    "ALL",
    "PASSENGER CAR",
    "LIGHT TRUCK",
    "TRUCK & BUS",
    "OFF THE ROAD",
    "TOOLS",
  ];

  // Filter products based on category and search
  const filteredProducts = PRODUCTS.filter((product) => {
    const matchesCategory = selectedCategory === 'ALL' || product.category === selectedCategory;
    const matchesSearch =
      product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.pattern.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.desc && product.desc.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Separate tools from tyres for different display
  const isToolsView = selectedCategory === 'TOOLS';
  const displayProducts = isToolsView 
    ? filteredProducts 
    : filteredProducts.filter(p => p.category !== 'TOOLS');

  return (
    <Layout>
      <div className="bg-brand-black py-12 px-4 sm:px-6 lg:px-8 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
                Premium Tyres & Tools
              </h1>
              <p className="text-brand-gray">
                Discover our curated selection from world-leading manufacturers
              </p>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setSearchTerm('');
                }}
                className={`px-5 py-2 rounded-full text-sm font-semibold border transition-all ${
                  selectedCategory === cat
                    ? 'bg-brand-yellow text-brand-black border-brand-yellow'
                    : 'border-brand-yellow/50 text-brand-yellow hover:bg-brand-yellow/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-gray" />
              <input
                type="text"
                placeholder={`Search ${isToolsView ? 'tools' : 'tyres'} by name or pattern...`}
                className="w-full bg-brand-card border border-white/10 rounded-lg pl-12 pr-4 py-3 text-white placeholder-brand-gray focus:outline-none focus:ring-2 focus:ring-brand-yellow/50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Tools List View */}
          {isToolsView && (
            <div className="space-y-3">
              {displayProducts.length > 0 ? (
                displayProducts.map((tool) => (
                  <Card key={tool.id} className="p-5">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white">
                          {tool.brand}
                        </h3>
                        {tool.pattern && (
                          <p className="text-brand-yellow text-sm mt-1">
                            {tool.pattern}
                          </p>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Badge variant="success" className="text-xs">
                          {tool.stock}
                        </Badge>
                        <Button
                          size="sm"
                          className="bg-brand-yellow text-brand-black hover:bg-brand-yellow/90"
                        >
                          <Send className="w-4 h-4 mr-1" />
                          Request Quote
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="text-center py-20">
                  <p className="text-brand-gray text-lg">No tools found.</p>
                </div>
              )}
            </div>
          )}

          {/* Tyres Grid View */}
          {!isToolsView && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayProducts.map((product) => (
                <Card key={product.id} hoverEffect className="flex flex-col overflow-hidden">
                  {/* Product Image */}
                  <div className="h-60 bg-white/5 flex items-center justify-center p-4">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.brand}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="text-brand-gray text-sm">No Image Available</div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-3">
                      <Badge variant="neutral" className="text-xs">
                        {product.category}
                      </Badge>
                      <Badge variant="success" className="text-xs">
                        {product.stock}
                      </Badge>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-1">
                      {product.brand}
                    </h3>
                    <p className="text-brand-yellow font-medium mb-2">
                      {product.pattern}
                    </p>
                    {product.desc && (
                      <p className="text-brand-gray text-sm mb-4 flex-1">
                        {product.desc}
                      </p>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-auto pt-4 border-t border-white/5">
                      {product.link && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() => window.open(product.link, '_blank')}
                        >
                          <ExternalLink className="w-4 h-4 mr-1" />
                          View Details
                        </Button>
                      )}
                      <Button
                        size="sm"
                        className="flex-1 bg-brand-yellow text-brand-black hover:bg-brand-yellow/90"
                      >
                        <Send className="w-4 h-4 mr-1" />
                        Inquiry
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* No Results */}
          {displayProducts.length === 0 && (
            <div className="text-center py-20">
              <p className="text-brand-gray text-lg mb-4">
                No products found matching your search.
              </p>
              <Button
                variant="ghost"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('ALL');
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}