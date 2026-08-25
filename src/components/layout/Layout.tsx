import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

const SITE_URL = 'https://www.anuratyres.com';
const DEFAULT_TITLE = 'Anura Tyres (Pvt) Ltd | Tyres, Wheel Alignment & Vehicle Care in Sri Lanka';
const DEFAULT_DESCRIPTION = 'Anura Tyres (Pvt) Ltd offers premium tyres, wheel alignment, balancing, and expert vehicle care across Sri Lanka. Trusted since 1983. Book your service online today.';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  noindex?: boolean;
}

export function Layout({ children, title, description, noindex }: LayoutProps) {
  const location = useLocation();
  const pageTitle = title ? `${title} | Anura Tyres` : DEFAULT_TITLE;
  const pageDescription = description || DEFAULT_DESCRIPTION;
  const canonicalUrl = `${SITE_URL}${location.pathname}`;

  return (
    <div className="min-h-screen bg-brand-black flex flex-col">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow'} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
      </Helmet>
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>);

}