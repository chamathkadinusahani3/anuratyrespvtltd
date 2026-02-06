import React from 'react';
import { Link } from 'react-router-dom';
import logo from "../../assets/logo.png";
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from 'lucide-react';
export function Footer() {
  return (
    <footer className="bg-brand-dark border-t border-white/5 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Info */}
          <div>
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
            <p className="text-brand-gray text-sm leading-relaxed mb-6">
              Premium tyre solutions, expert mechanical repairs, and heavy
              vehicle services across Sri Lanka. Trusted since 1995.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-brand-gray hover:text-brand-yellow transition-colors">

                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-brand-gray hover:text-brand-yellow transition-colors">

                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-brand-gray hover:text-brand-yellow transition-colors">

                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-brand-white font-bold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/booking"
                  className="text-brand-gray hover:text-brand-yellow text-sm">

                  Book a Service
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  className="text-brand-gray hover:text-brand-yellow text-sm">

                  Check Stock
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="text-brand-gray hover:text-brand-yellow text-sm">

                  Our Services
                </Link>
              </li>
              <li>
                <Link
                  to="/branches"
                  className="text-brand-gray hover:text-brand-yellow text-sm">

                  Find a Branch
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-brand-gray hover:text-brand-yellow text-sm">

                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-brand-white font-bold mb-6">Services</h3>
            <ul className="space-y-3">
              <li className="text-brand-gray text-sm">Tyre Replacement</li>
              <li className="text-brand-gray text-sm">Wheel Alignment</li>
              <li className="text-brand-gray text-sm">Engine Tune-up</li>
              <li className="text-brand-gray text-sm">Hybrid Services</li>
              <li className="text-brand-gray text-sm">Truck & Bus Care</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-brand-white font-bold mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-brand-yellow flex-shrink-0" />
                <span className="text-brand-gray text-sm">
                  123 High Level Road, Pannipitiya, Sri Lanka
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-brand-yellow flex-shrink-0" />
                <span className="text-brand-gray text-sm">+94 11 234 5678</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-brand-yellow flex-shrink-0" />
                <span className="text-brand-gray text-sm">
                  info@anuratyres.com
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-brand-gray text-xs">
            © {new Date().getFullYear()} Anura Tyres (Pvt) Ltd. All rights
            reserved.
          </p>
          <div className="flex gap-6">
            <a
              href="#"
              className="text-brand-gray hover:text-brand-white text-xs">

              Privacy Policy
            </a>
            <a
              href="#"
              className="text-brand-gray hover:text-brand-white text-xs">

              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>);

}