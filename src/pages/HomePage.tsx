import React, { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { HeroSection } from '../components/home/HeroSection';
import { BranchPreview } from '../components/home/BranchPreview';
import { ServicesPreview } from '../components/home/ServicesPreview';
import { TyreSearch } from '../components/home/TyreSearch';
import { Button } from '../components/ui/Button';
import { Link, useNavigate } from 'react-router-dom';
import { useActivityTracker } from '../hooks/useActivityTracker';
import { ExcellenceSection } from '../components/home/ExcellenceSection';

import { Search, Star, ExternalLink, ChevronRight, Mail, CheckCircle } from 'lucide-react';

// ─── Featured products (first 8 tyre products with images) ───────────────────
const FEATURED_PRODUCTS = [
  { id: 1, brand: 'FORZA 001', desc: 'Deliver a thrilling ride with maximum precision.', category: 'PASSENGER CAR', image: 'https://image.makewebeasy.net/makeweb/m_1920x0/JCbWKd3P2/PassengerCar/banner_product_FORZA_001_img_2x.png?v=202405291424', link: 'https://kinto-tyres.lk/product/forza-001/' },
  { id: 2, brand: 'FALCO S88', desc: 'Perfect balance of dynamic appearance and sport-oriented performance.', category: 'PASSENGER CAR', image: 'https://image.makewebeasy.net/makeweb/m_1920x0/JCbWKd3P2/PassengerCar/banner_product_FALCO_S88_img_2x.png?v=202405291424', link: 'https://kinto-tyres.lk/product/falco-s88/' },
  { id: 3, brand: 'V-36', desc: 'Feel the greater stability and control.', category: 'PASSENGER CAR', image: 'https://image.makewebeasy.net/makeweb/m_1920x0/JCbWKd3P2/PassengerCar/banner_product_V-36_img_2x.png?v=202405291424', link: 'https://kinto-tyres.lk/product/v-36/' },
  { id: 4, brand: 'X-68+', desc: 'Enjoy the ultimate handling and grip.', category: 'PASSENGER CAR', image: 'https://image.makewebeasy.net/makeweb/m_1920x0/JCbWKd3P2/PassengerCar/banner_product_X-68__img_2x.png?v=202405291424', link: 'https://kinto-tyres.lk/product/x-68-plus/' },
  { id: 5, brand: 'SC-900', desc: 'Quieter, Safer and Smoother Journey.', category: 'PASSENGER CAR', image: 'https://image.makewebeasy.net/makeweb/m_1920x0/JCbWKd3P2/PassengerCar/banner_product_SC-900_img_2x.png?v=202405291424', link: 'https://kinto-tyres.lk/product/sc-900/' },
  { id: 10, brand: 'KAIJU-2', desc: 'Meet your daily adventures on and off the road.', category: 'LIGHT TRUCK', image: 'https://image.makewebeasy.net/makeweb/m_1920x0/JCbWKd3P2/LightTruck/banner_product_KAIJU-2_img_2x.png?v=202405291424', link: 'https://kinto-tyres.lk/product/kaiju-2/' },
  { id: 12, brand: 'PRESA M/T', desc: 'Experience go-anywhere performance with amazing traction.', category: 'LIGHT TRUCK', image: 'https://image.makewebeasy.net/makeweb/m_1920x0/JCbWKd3P2/LightTruck/banner_product_PRESA_M_T_img_2x.png?v=202405291424', link: 'https://kinto-tyres.lk/product/presa-m-t/' },
  { id: 13, brand: 'FUERTE K99', desc: 'Address the multi-purpose needs of modern commercial vehicles.', category: 'LIGHT TRUCK', image: 'https://image.makewebeasy.net/makeweb/m_1920x0/JCbWKd3P2/LightTruck/banner_product_FUERTE_K99_img_2x.png?v=202405291424', link: 'https://kinto-tyres.lk/product/fuerte-k99/' },
];

// ─── Google Reviews ───────────────────────────────────────────────────────────
const REVIEWS = [
  { name: 'Kavindu Perera', rating: 5, date: '2 weeks ago', text: 'Excellent service! The team at Pannipitiya branch was very professional. Got my wheel alignment done quickly and the difference is noticeable. Highly recommend Anura Tyres.', avatar: 'K' },
  { name: 'Dilshan Fernando', rating: 5, date: '1 month ago', text: 'Best tyre shop in Colombo. They have a great range of tyres for all budgets. The staff explained everything clearly and helped me pick the right tyres for my car. Will definitely come back.', avatar: 'D' },
  { name: 'Nirmala Silva', rating: 5, date: '3 weeks ago', text: 'Very impressed with the service. Booked online, arrived on time, and the job was done perfectly. The waiting area is clean and comfortable. Five stars without a doubt!', avatar: 'N' },
  { name: 'Rajith Bandara', rating: 4, date: '1 month ago', text: 'Good quality tyres at competitive prices. The balancing service was done well. Slight wait time but the quality of work makes it worth it. Friendly staff overall.', avatar: 'R' },
  { name: 'Priya Jayawardena', rating: 5, date: '2 months ago', text: 'Trusted Anura Tyres for over 5 years now. Always consistent quality. They never oversell you — they tell you exactly what your vehicle needs. That honesty keeps me coming back.', avatar: 'P' },
  { name: 'Chamara Wijesinghe', rating: 5, date: '3 months ago', text: 'Fantastic experience from start to finish. The online booking system is very convenient. Staff were courteous and the tyre replacement was quick. Great value for money.', avatar: 'C' },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} className={`w-4 h-4 ${i <= rating ? 'text-[#FBBC04] fill-[#FBBC04]' : 'text-gray-600'}`} />
      ))}
    </div>
  );
}

const GoogleLogo = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

// ─── Search Bar ───────────────────────────────────────────────────────────────
function HomeSearchBar() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/products?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <section className="bg-neutral-950 border-b border-white/5 py-5 px-4">
      <div className="max-w-3xl mx-auto">
        <form onSubmit={handleSearch} className="relative group">
          <div className="absolute inset-0 bg-brand-yellow/10 blur-xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none" />
          <div className="relative flex items-center bg-neutral-900 border border-white/10 group-focus-within:border-brand-yellow/50 rounded-2xl overflow-hidden transition-all duration-300 shadow-lg">
            <Search className="w-5 h-5 text-gray-500 ml-5 flex-shrink-0 group-focus-within:text-brand-yellow transition-colors duration-300" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search tyres by brand, size or pattern (e.g. 185/65R15, FORZA 001)..."
              className="flex-1 bg-transparent text-white placeholder-gray-500 px-4 py-4 text-sm outline-none"
            />
            <button
              type="submit"
              className="m-2 px-6 py-2.5 bg-brand-yellow text-black text-sm font-bold rounded-xl hover:bg-white transition-colors duration-200 flex-shrink-0"
            >
              Search
            </button>
          </div>
        </form>
        <p className="text-center text-xs text-gray-600 mt-3">
          Search across 33+ tyre models · Passenger Car · Light Truck · Off Road
        </p>
      </div>
    </section>
  );
}

// ─── Featured Products ────────────────────────────────────────────────────────
function FeaturedProducts() {
  return (
    <section className="bg-black py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-brand-yellow text-xs font-bold tracking-[0.3em] uppercase mb-3">Our Range</p>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
              FEATURED <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-yellow to-brand-red">PRODUCTS</span>
            </h2>
          </div>
          <Link to="/products" className="hidden sm:flex items-center gap-2 text-sm text-gray-400 hover:text-brand-yellow transition-colors duration-200 font-medium group">
            View all products
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>

        {/* Horizontally scrollable cards */}
        <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory" style={{ scrollbarWidth: 'none' }}>
          {FEATURED_PRODUCTS.map(product => (
            <div key={product.id} className="flex-shrink-0 w-56 snap-start group">
              <div className="bg-neutral-900 border border-white/8 rounded-2xl overflow-hidden hover:border-brand-yellow/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(255,204,0,0.12)]">
                <div className="bg-neutral-800 h-44 flex items-center justify-center p-4 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/3 to-transparent" />
                  <img
                    src={product.image}
                    alt={product.brand}
                    className="h-full object-contain relative z-10 group-hover:scale-105 transition-transform duration-500 drop-shadow-2xl"
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                </div>
                <div className="p-4">
                  <span className="text-[10px] font-bold tracking-widest text-brand-yellow/70 uppercase">{product.category}</span>
                  <h3 className="text-white font-bold text-sm mt-1 mb-1.5 leading-tight">{product.brand}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-4">{product.desc}</p>
                  <div className="flex gap-2">
                    <Link to="/products" className="flex-1 text-center text-xs font-semibold bg-brand-yellow/10 hover:bg-brand-yellow text-brand-yellow hover:text-black rounded-lg py-2 transition-all duration-200">
                      Inquire
                    </Link>
                    <a href={product.link} target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-lg transition-colors duration-200">
                      <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* View all card */}
          <div className="flex-shrink-0 w-56 snap-start">
            <Link to="/products" className="block h-full">
              <div className="h-full min-h-[300px] bg-neutral-900/50 border border-dashed border-white/15 rounded-2xl flex flex-col items-center justify-center gap-3 hover:border-brand-yellow/40 hover:bg-neutral-900 transition-all duration-300 p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-brand-yellow/10 flex items-center justify-center">
                  <ChevronRight className="w-6 h-6 text-brand-yellow" />
                </div>
                <p className="text-white font-bold text-sm">View All Products</p>
                <p className="text-gray-500 text-xs">33+ tyre models & tools</p>
              </div>
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center sm:hidden">
          <Link to="/products" className="inline-flex items-center gap-2 text-sm text-brand-yellow font-semibold">
            View all products <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── Google Reviews ───────────────────────────────────────────────────────────
function ReviewsSection() {
  return (
    <section className="bg-neutral-950 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-brand-yellow text-xs font-bold tracking-[0.3em] uppercase mb-3">Google Reviews</p>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">
            WHAT OUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-yellow to-brand-red">CUSTOMERS THINK</span>
          </h2>
          <div className="inline-flex items-center gap-3 bg-neutral-900 border border-white/10 rounded-2xl px-6 py-3">
            <GoogleLogo className="w-6 h-6" />
            <span className="text-white font-black text-xl">4.9</span>
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 text-[#FBBC04] fill-[#FBBC04]" />)}
            </div>
            <span className="text-gray-400 text-sm">· 120+ reviews</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {REVIEWS.map((review, i) => (
            <div key={i} className="bg-neutral-900 border border-white/8 rounded-2xl p-6 hover:border-white/20 transition-all duration-300 hover:-translate-y-0.5 flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-yellow to-brand-red flex items-center justify-center text-black font-black text-sm flex-shrink-0">
                  {review.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm truncate">{review.name}</p>
                  <p className="text-gray-500 text-xs">{review.date}</p>
                </div>
                <GoogleLogo className="w-5 h-5 flex-shrink-0" />
              </div>
              <StarRating rating={review.rating} />
              <p className="text-gray-300 text-sm leading-relaxed mt-3 flex-1">"{review.text}"</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <a
            href="https://www.google.com/search?q=Anura+Tyres+Pvt+Ltd+reviews"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors duration-200 border border-white/10 hover:border-white/25 rounded-xl px-6 py-3"
          >
            <GoogleLogo className="w-4 h-4" />
            See all reviews on Google
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── Newsletter ───────────────────────────────────────────────────────────────
function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) return;
    setStatus('loading');
    // TODO: wire to POST /api/newsletter
    await new Promise(r => setTimeout(r, 800));
    setStatus('success');
    setEmail('');
  };

  return (
    <section className="bg-black py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-64 bg-brand-yellow/8 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-red/8 blur-[80px] rounded-full pointer-events-none" />

      <div className="max-w-2xl mx-auto relative z-10 text-center">
        <div className="w-14 h-14 bg-brand-yellow/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-brand-yellow/20">
          <Mail className="w-7 h-7 text-brand-yellow" />
        </div>
        <p className="text-brand-yellow text-xs font-bold tracking-[0.3em] uppercase mb-3">Newsletter</p>
        <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2">Sign Up Now to Receive</h2>
        <p className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-yellow to-brand-red mb-4">
          Exclusive Offers &amp; Discounts
        </p>
        <p className="text-gray-400 text-sm mb-8 max-w-sm mx-auto leading-relaxed">
          Be the first to know about seasonal promotions, new tyre arrivals and service reminders.
        </p>

        {status === 'success' ? (
          <div className="flex items-center justify-center gap-3 bg-green-500/10 border border-green-500/30 rounded-2xl px-8 py-5">
            <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
            <div className="text-left">
              <p className="text-green-400 font-bold text-sm">You're subscribed!</p>
              <p className="text-gray-400 text-xs mt-0.5">Watch your inbox for exclusive offers from Anura Tyres.</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 bg-neutral-900 border border-white/10 focus:border-brand-yellow/50 text-white placeholder-gray-500 rounded-xl px-5 py-3.5 text-sm outline-none transition-colors duration-200"
            />
            <button
              type="submit"
              disabled={status === 'loading' || !email.includes('@')}
              className="bg-brand-yellow hover:bg-white text-black font-bold text-sm px-7 py-3.5 rounded-xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 whitespace-nowrap"
            >
              {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
        )}

        <p className="text-gray-600 text-xs mt-4 leading-relaxed">
          By signing up, you agree to our{' '}
          <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors duration-200 underline underline-offset-2">Privacy Notice</Link>
          {' '}and{' '}
          <Link to="/terms" className="text-gray-400 hover:text-white transition-colors duration-200 underline underline-offset-2">Terms &amp; Conditions</Link>.
          {' '}You can unsubscribe at any time.
        </p>
      </div>
    </section>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export function HomePage() {
  useActivityTracker({ type: 'page_view', page: '/' });

  return (
    <Layout>
      <HomeSearchBar />
      <HeroSection />
      <TyreSearch />
      <BranchPreview />
      <ExcellenceSection/>
      <ServicesPreview />
      <FeaturedProducts />
      <ReviewsSection />
      <NewsletterSection />

      {/* CTA */}
      <section className="py-24 bg-black relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-red/20 blur-[120px] rounded-full" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-brand-yellow/10 blur-[120px] rounded-full" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-neutral-900/50 border border-white/10 backdrop-blur-md rounded-3xl p-8 md:p-16 text-center">
            <div className="w-20 h-1.5 bg-brand-red mx-auto mb-8 rounded-full shadow-[0_0_15px_rgba(255,0,0,0.5)]" />
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
              READY TO <span className="text-brand-yellow">UPGRADE</span> YOUR RIDE?
            </h2>
            <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Book your appointment online in less than 2 minutes.
              Choose your preferred branch, service, and time.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
              <Link to="/booking" className="w-full sm:w-auto">
                <Button size="lg" className="group relative bg-brand-yellow text-black hover:bg-white transition-all duration-300 font-bold px-10 h-14 w-full sm:w-auto rounded-xl overflow-hidden shadow-[0_10px_20px_-10px_rgba(255,215,0,0.3)]">
                  <span className="relative z-10">Book Appointment Now</span>
                  <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </Button>
              </Link>
              <Link to="/contact" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white hover:text-black transition-all duration-300 font-bold px-10 h-14 w-full sm:w-auto rounded-xl">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}