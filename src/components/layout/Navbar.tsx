import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Phone, LogIn, LogOut, User, LayoutDashboard, ShoppingCart } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { CartDrawer } from '../cart/CartDrawer';
import logo from "../../assets/logo.png";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { cartCount, setIsOpen: setCartOpen } = useCart();

  const navLinks = [
    { name: 'Home',     path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Branches', path: '/branches' },
    { name: 'Products', path: '/products' },
    { name: 'About',    path: '/about' },
    { name: 'Contact',  path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;
  const handleLogout = async () => { await logout(); navigate('/'); };

  return (
    <>
      <CartDrawer />
      <nav className="sticky top-0 z-40 w-full bg-brand-black/95 backdrop-blur-sm border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">

            {/* Logo */}
            <Link to="/" className="flex-shrink-0 flex items-center gap-3">
              <img src={logo} alt="Anura Tyres Logo" className="h-12 w-auto object-contain" />
              <div className="flex flex-col leading-none">
                <span className="text-brand-white font-bold text-lg">ANURA TYRES</span>
                <span className="text-brand-gray text-xs tracking-wider">(Pvt) Ltd</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-7">
              {navLinks.map((link) => (
                <Link key={link.name} to={link.path}
                  className={`text-sm font-medium transition-colors hover:text-brand-yellow ${isActive(link.path) ? 'text-brand-yellow' : 'text-brand-gray'}`}>
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Desktop Right */}
            <div className="hidden md:flex items-center gap-3">
              <a href="tel:0112345678" className="text-brand-white hover:text-brand-yellow transition-colors p-2">
                <Phone className="w-4 h-4" />
              </a>

              {/* Cart */}
              <button onClick={() => setCartOpen(true)} className="relative p-2 text-brand-gray hover:text-white transition-colors" aria-label="Cart">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-brand-yellow text-black text-[10px] font-black rounded-full flex items-center justify-center leading-none">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </button>

              {user ? (
                <div className="flex items-center gap-2">
                  <Link to="/dashboard" className="flex items-center gap-2 group">
                    {user.photoURL
                      ? <img src={user.photoURL} alt="avatar" className="w-8 h-8 rounded-full object-cover ring-2 ring-transparent group-hover:ring-brand-yellow/30 transition-all" />
                      : <div className="w-8 h-8 rounded-full bg-brand-yellow/20 flex items-center justify-center"><User className="w-4 h-4 text-brand-yellow" /></div>
                    }
                    <span className={`text-sm font-medium truncate max-w-[90px] ${isActive('/dashboard') ? 'text-brand-yellow' : 'text-brand-white group-hover:text-brand-yellow transition-colors'}`}>
                      {user.displayName?.split(' ')[0] || 'Account'}
                    </span>
                  </Link>
                  <button onClick={handleLogout} className="p-2 text-brand-gray hover:text-red-400 transition-colors" title="Sign out">
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/login" className={`text-sm font-medium flex items-center gap-1.5 transition-colors hover:text-brand-yellow ${isActive('/login') ? 'text-brand-yellow' : 'text-brand-gray'}`}>
                    <LogIn className="w-4 h-4" /> Login
                  </Link>
                  <Link to="/register">
                    <span className="text-xs font-bold px-3 py-1.5 rounded-lg border border-brand-yellow/40 text-brand-yellow hover:bg-brand-yellow/10 transition-all cursor-pointer">
                      Register
                    </span>
                  </Link>
                </div>
              )}

              <Link to="/booking"><Button size="sm">Book Now</Button></Link>
            </div>

            {/* Mobile: cart + burger */}
            <div className="md:hidden flex items-center gap-2">
              <button onClick={() => setCartOpen(true)} className="relative p-2 text-brand-gray hover:text-white">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-brand-yellow text-black text-[10px] font-black rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
              <button onClick={() => setIsOpen(!isOpen)} className="text-brand-gray hover:text-brand-white p-2">
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-neutral-950 border-t border-white/5">
            <div className="px-4 pt-2 pb-4 space-y-1">
              {navLinks.map((link) => (
                <Link key={link.name} to={link.path} onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive(link.path) ? 'bg-brand-yellow/10 text-brand-yellow' : 'text-brand-gray hover:text-brand-white hover:bg-white/5'}`}>
                  {link.name}
                </Link>
              ))}
              <div className="pt-3 mt-3 border-t border-white/5 space-y-2">
                {user ? (
                  <>
                    <Link to="/dashboard" onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-brand-gray hover:text-white hover:bg-white/5 transition-all">
                      {user.photoURL
                        ? <img src={user.photoURL} alt="" className="w-7 h-7 rounded-full object-cover" />
                        : <div className="w-7 h-7 rounded-full bg-brand-yellow/20 flex items-center justify-center"><User className="w-3.5 h-3.5 text-brand-yellow" /></div>
                      }
                      <span className="truncate flex-1">{user.displayName || user.email}</span>
                      <LayoutDashboard className="w-4 h-4 opacity-40" />
                    </Link>
                    <button onClick={() => { handleLogout(); setIsOpen(false); }}
                      className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all">
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Link to="/login" onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-white/10 text-sm font-bold text-brand-gray hover:text-white transition-all">
                      <LogIn className="w-4 h-4" /> Login
                    </Link>
                    <Link to="/register" onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center px-3 py-2.5 rounded-xl border border-brand-yellow/30 text-sm font-bold text-brand-yellow hover:bg-brand-yellow/10 transition-all">
                      Register
                    </Link>
                  </div>
                )}
                <Link to="/booking" onClick={() => setIsOpen(false)}><Button fullWidth>Book a Service</Button></Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}