import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone } from 'lucide-react';
import { Button } from '../ui/Button';
import logo from "../../assets/logo.png";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navLinks = [
  {
    name: 'Home',
    path: '/'
  },
  {
    name: 'Services',
    path: '/services'
  },
  {
    name: 'Branches',
    path: '/branches'
  },
  {
    name: 'Products',
    path: '/products'
  },
  {
    name: 'About',
    path: '/about'
  },
  {
    name: 'Contact',
    path: '/contact'
  }];

  const isActive = (path: string) => location.pathname === path;
  return (
    <nav className="sticky top-0 z-50 w-full bg-brand-black/95 backdrop-blur-sm border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
         {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-3">
            {/* Image Logo */}
            <img
              src={logo}
              alt="Anura Tyres Logo"
              className="h-12 w-auto object-contain"
            />

            {/* Text Logo */}
            <div className="flex flex-col leading-none">
              <span className="text-brand-white font-bold text-lg">
                ANURA TYRES
              </span>
              <span className="text-brand-gray text-xs tracking-wider">
                (Pvt) Ltd
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) =>
            <Link
              key={link.name}
              to={link.path}
              className={`text-sm font-medium transition-colors hover:text-brand-yellow ${isActive(link.path) ? 'text-brand-yellow' : 'text-brand-gray'}`}>

                {link.name}
              </Link>
            )}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="tel:0112345678"
              className="text-brand-white hover:text-brand-yellow transition-colors">

              <Phone className="w-5 h-5" />
            </a>
            <Link to="/booking">
              <Button size="sm">Book Now</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-brand-gray hover:text-brand-white p-2">

              {isOpen ?
              <X className="w-6 h-6" /> :

              <Menu className="w-6 h-6" />
              }
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen &&
      <div className="md:hidden bg-brand-dark border-t border-white/5">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) =>
          <Link
            key={link.name}
            to={link.path}
            onClick={() => setIsOpen(false)}
            className={`block px-3 py-2 rounded-md text-base font-medium ${isActive(link.path) ? 'bg-brand-yellow/10 text-brand-yellow' : 'text-brand-gray hover:text-brand-white hover:bg-white/5'}`}>

                {link.name}
              </Link>
          )}
            <div className="pt-4 mt-4 border-t border-white/5">
              <Link to="/booking" onClick={() => setIsOpen(false)}>
                <Button fullWidth>Book a Service</Button>
              </Link>
            </div>
          </div>
        </div>
      }
    </nav>);

}