import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { HomePage } from './pages/HomePage';
import { BookingPage } from './pages/BookingPage';
import { ServicesPage } from './pages/ServicesPage';
import { BranchesPage } from './pages/BranchesPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { ProductsPage } from './pages/ProductsPage';
import { CorporateRegistration } from './components/Corporateregistration';
import { EmployeeRegistration } from './components/Employeeregistration';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <ScrollToTop />
          <Routes>
            <Route path="/"                   element={<HomePage />} />
            <Route path="/booking"            element={<BookingPage />} />
            <Route path="/services"           element={<ServicesPage />} />
            <Route path="/branches"           element={<BranchesPage />} />
            <Route path="/about"              element={<AboutPage />} />
            <Route path="/contact"            element={<ContactPage />} />
            <Route path="/products"           element={<ProductsPage />} />
            <Route path="/corporate/register" element={<CorporateRegistration />} />
            <Route path="/employee/register"  element={<EmployeeRegistration />} />
            <Route path="/login"              element={<LoginPage />} />
            <Route path="/register"           element={<RegisterPage />} />
            <Route path="/dashboard"          element={<DashboardPage />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}