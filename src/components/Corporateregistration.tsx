import React, { useState } from 'react';
import { Building2, User, CheckCircle, AlertCircle, Briefcase, Tag, Download, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import jsPDF from 'jspdf';

interface CorporateRegistrationForm {
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  businessType: string;
  taxId: string;
  address: string;
  employees: string;
}

export function CorporateRegistration() {
  const [form, setForm] = useState<CorporateRegistrationForm>({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    businessType: '',
    taxId: '',
    address: '',
    employees: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [corporateCode, setCorporateCode] = useState('');
  const [generatingPDF, setGeneratingPDF] = useState(false);

  const businessTypes = [
    'IT/Technology',
    'Manufacturing',
    'Retail',
    'Construction',
    'Transportation/Logistics',
    'Healthcare',
    'Financial Services',
    'Education',
    'Hospitality',
    'Other'
  ];

  const generateDiscountCardPDF = async () => {
    setGeneratingPDF(true);

    try {
      const loadLogo = (): Promise<string> => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(img, 0, 0);
              resolve(canvas.toDataURL('image/png'));
            } else {
              reject('Canvas context not available');
            }
          };
          img.onerror = () => reject('Logo failed to load');
          img.src = logo;
        });
      };

      let logoData: string | null = null;
      try {
        logoData = await loadLogo();
      } catch {
        console.log('Logo not loaded, continuing without it');
      }

      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;

      // ── YELLOW HEADER ────────────────────────────────────────────────
      doc.setFillColor(255, 215, 0);
      doc.rect(0, 0, pageWidth, 40, 'F');

      if (logoData) {
        try { doc.addImage(logoData, 'PNG', 15, 8, 25, 25); } catch {}
      }

      doc.setTextColor(0, 0, 0);
      doc.setFontSize(28);
      doc.setFont('helvetica', 'bold');
      doc.text('ANURA TYRES', pageWidth / 2, 18, { align: 'center' });

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('(Pvt) Ltd', pageWidth / 2, 24, { align: 'center' });

      doc.setFontSize(9);
      doc.setTextColor(51, 51, 51);
      doc.text('278/2 High Level Rd, Pannipitiya | Tel: 077 578 5785', pageWidth / 2, 32, { align: 'center' });

      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.5);
      doc.line(margin, 42, pageWidth - margin, 42);

      // ── TITLE ────────────────────────────────────────────────────────
      let yPos = 60;

      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 215, 0);
      doc.text('CORPORATE DISCOUNT CARD', pageWidth / 2, yPos, { align: 'center' });

      yPos += 10;
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      doc.text('10% Discount on All Services', pageWidth / 2, yPos, { align: 'center' });

      // ── CARD BOX ─────────────────────────────────────────────────────
      yPos += 15;
      const cardX = 30;
      const cardWidth = pageWidth - 60;
      const cardHeight = 95;

      doc.setFillColor(255, 250, 205);
      doc.roundedRect(cardX, yPos, cardWidth, cardHeight, 3, 3, 'F');
      doc.setDrawColor(255, 215, 0);
      doc.setLineWidth(2);
      doc.roundedRect(cardX, yPos, cardWidth, cardHeight, 3, 3, 'S');

      // Corporate Code
      const cardStartY = yPos;
      yPos += 15;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(102, 102, 102);
      doc.text('Corporate Code', pageWidth / 2, yPos, { align: 'center' });

      yPos += 10;
      doc.setFontSize(28);
      doc.setFont('courier', 'bold');
      doc.setTextColor(255, 215, 0);
      doc.text(corporateCode, pageWidth / 2, yPos, { align: 'center' });

      // Company Details
      yPos += 15;
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text(form.companyName, pageWidth / 2, yPos, { align: 'center' });

      yPos += 7;
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(102, 102, 102);
      if (form.contactPerson) {
        doc.text(form.contactPerson, pageWidth / 2, yPos, { align: 'center' });
        yPos += 6;
      }
      doc.text(form.phone, pageWidth / 2, yPos, { align: 'center' });
      yPos += 6;
      doc.text(form.email, pageWidth / 2, yPos, { align: 'center' });
      if (form.businessType) {
        yPos += 6;
        doc.text(`Business Type: ${form.businessType}`, pageWidth / 2, yPos, { align: 'center' });
      }

      // 10% Badge circle
      const badgeY = cardStartY + 30;
      doc.setFillColor(255, 215, 0);
      doc.circle(pageWidth - 50, badgeY, 15, 'F');
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text('10%', pageWidth - 50, badgeY - 2, { align: 'center' });
      doc.setFontSize(8);
      doc.text('OFF', pageWidth - 50, badgeY + 4, { align: 'center' });

      // ── HOW TO USE ───────────────────────────────────────────────────
      yPos += 20;
      doc.setFillColor(255, 250, 205);
      doc.rect(margin, yPos, pageWidth - 40, 40, 'F');
      doc.setDrawColor(255, 215, 0);
      doc.setLineWidth(0.5);
      doc.rect(margin, yPos, pageWidth - 40, 40, 'S');

      yPos += 8;
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text('HOW TO USE YOUR CORPORATE DISCOUNT:', 25, yPos);

      yPos += 7;
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 51, 51);

      [
        '1. Visit any Anura Tyres branch',
        '2. Provide your Corporate Code or registered company name',
        '3. Phone verification may be required',
        '4. Enjoy 10% discount on all services!'
      ].forEach(line => {
        doc.text(line, 25, yPos);
        yPos += 5;
      });

      // ── BRANCHES ─────────────────────────────────────────────────────
      yPos += 10;
      doc.setFillColor(240, 240, 240);
      doc.rect(margin, yPos, pageWidth - 40, 32, 'F');

      yPos += 8;
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text('VALID AT ALL ANURA TYRES BRANCHES:', 25, yPos);

      yPos += 6;
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 51, 51);

      [
        'Pannipitiya: 278/2 High Level Rd, Pannipitiya',
        'Ratnapura: 151 Colombo Rd, Ratnapura',
        'Kalawana: Rathnapura Road, Kalawana',
        'Nivithigala: Tiruwanaketiya-Agalawatte Rd, Nivithigala'
      ].forEach(branch => {
        doc.text(`• ${branch}`, 25, yPos);
        yPos += 4.5;
      });

      // ── TERMS ────────────────────────────────────────────────────────
      yPos += 8;
      doc.setFontSize(7);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(102, 102, 102);

      [
        'Terms & Conditions: This discount is valid for registered corporate partners only.',
        'Discount cannot be combined with other offers. Valid corporate code required for all transactions.',
        'Anura Tyres reserves the right to modify or withdraw this offer at any time.'
      ].forEach(term => {
        const lines = doc.splitTextToSize(term, pageWidth - 50);
        doc.text(lines, 25, yPos);
        yPos += lines.length * 3;
      });

      // ── FOOTER ───────────────────────────────────────────────────────
      const footerY = pageHeight - 20;
      doc.setDrawColor(255, 215, 0);
      doc.setLineWidth(0.3);
      doc.line(margin, footerY, pageWidth - margin, footerY);

      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(102, 102, 102);
      doc.text('ANURA TYRES (Pvt) Ltd | Your Trusted Tyre Specialists', pageWidth / 2, footerY + 5, { align: 'center' });
      doc.text('www.anuratyres.lk | info@anuratyres.lk | 077 578 5785', pageWidth / 2, footerY + 9, { align: 'center' });
      doc.setFontSize(7);
      doc.text(
        `Generated on: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`,
        pageWidth / 2, footerY + 13, { align: 'center' }
      );

      doc.save(`Anura_Tyres_Corporate_Discount_Card_${corporateCode}.pdf`);

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate discount card. Please try again.');
    } finally {
      setGeneratingPDF(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!form.companyName.trim()) {
      setError('Company name is required');
      setLoading(false);
      return;
    }
    if (!form.email.includes('@')) {
      setError('Valid email is required');
      setLoading(false);
      return;
    }
    if (!form.phone.trim()) {
      setError('Phone number is required');
      setLoading(false);
      return;
    }

    try {
      const code = `CORP-${Date.now().toString(36).toUpperCase()}`;

      const corporateData = {
        ...form,
        corporateCode: code,
        discount: 10,
        status: 'active',
        registeredDate: new Date().toISOString(),
        bookingCount: 0
      };

      const existingCorporates = JSON.parse(localStorage.getItem('at_corporate_customers') || '[]');
      existingCorporates.push(corporateData);
      localStorage.setItem('at_corporate_customers', JSON.stringify(existingCorporates));

      await new Promise(resolve => setTimeout(resolve, 1000));

      setCorporateCode(code);
      setSuccess(true);

      console.log('Corporate customer registered:', corporateData);

    } catch (err) {
      setError('Registration failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-8 text-center">
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>

            <h2 className="text-3xl font-bold text-white mb-4">
              Registration Successful!
            </h2>

            <p className="text-neutral-400 mb-6">
              Welcome to Anura Tyres Corporate Program, {form.companyName}!
            </p>

            {/* Corporate Code */}
            <div className="bg-[#FFD700]/10 border-2 border-[#FFD700] rounded-xl p-6 mb-6">
              <p className="text-sm text-neutral-400 mb-2">Your Corporate Code</p>
              <p className="text-3xl font-bold text-[#FFD700] font-mono tracking-wider">
                {corporateCode}
              </p>
              <p className="text-xs text-neutral-500 mt-2">
                Save this code — you'll need it for bookings
              </p>
            </div>

            {/* Benefits */}
            <div className="bg-neutral-800 rounded-lg p-6 mb-6 text-left">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-[#FFD700]" />
                Your Corporate Benefits
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#FFD700]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[#FFD700] text-sm font-bold">10%</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">10% Discount on All Services</p>
                    <p className="text-xs text-neutral-500">Automatically applied with your corporate code</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-400 text-sm">✓</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">Priority Booking</p>
                    <p className="text-xs text-neutral-500">Get preferred time slots</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-400 text-sm">📧</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">Monthly Reports</p>
                    <p className="text-xs text-neutral-500">Detailed service history and expenses</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-purple-400 text-sm">💳</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">Flexible Payment Terms</p>
                    <p className="text-xs text-neutral-500">Monthly invoicing available</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Next Steps */}
            <div className="bg-neutral-800/50 border border-neutral-700 rounded-lg p-4 mb-6">
              <p className="text-sm text-neutral-400 mb-3">
                <strong className="text-white">Next Steps:</strong>
              </p>
              <ol className="text-left text-sm text-neutral-400 space-y-2 list-decimal list-inside">
                <li>Check your email for confirmation and details</li>
                <li>Use your corporate code when booking services</li>
                <li>Share the code with your employees for their bookings</li>
              </ol>
            </div>

            {/* Important Note */}
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 mb-6">
              <p className="text-xs text-yellow-400">
                <strong>Important:</strong> Save a screenshot of this page or download your discount card.
                You'll need the corporate code for all future bookings.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/" className="flex-1 sm:flex-initial">
                <button className="w-full px-6 py-3 bg-[#FFD700] text-black font-bold rounded-lg hover:bg-[#FFD700]/90 transition-colors">
                  Book a Service
                </button>
              </Link>
              <button
                onClick={generateDiscountCardPDF}
                disabled={generatingPDF}
                className="flex-1 sm:flex-initial px-6 py-3 border border-neutral-700 text-white font-medium rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {generatingPDF ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Download Discount Card
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src={logo} alt="Anura Tyres" className="h-12 w-12 object-contain" />
            <div className="text-left">
              <h1 className="text-2xl font-bold text-white">
                ANURA<span className="text-[#FFD700]">TYRES</span>
              </h1>
              <p className="text-xs text-neutral-500">(Pvt) Ltd</p>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            Corporate Registration
          </h2>
          <p className="text-neutral-400 mb-4">
            Join our corporate program and enjoy 10% discount on all services
          </p>
          <div className="inline-flex items-center gap-2 bg-[#FFD700]/10 border border-[#FFD700]/30 rounded-full px-4 py-2">
            <Tag className="w-4 h-4 text-[#FFD700]" />
            <span className="text-[#FFD700] text-sm font-bold">Get 10% OFF on All Services</span>
          </div>
        </div>

        {/* Registration Form */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Company Information */}
            <div>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#FFD700]" />
                Company Information
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    value={form.companyName}
                    onChange={e => setForm({ ...form, companyName: e.target.value })}
                    placeholder="ABC Pvt Ltd"
                    className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder:text-neutral-600 focus:outline-none focus:border-[#FFD700] transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Business Type
                    </label>
                    <select
                      value={form.businessType}
                      onChange={e => setForm({ ...form, businessType: e.target.value })}
                      className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-[#FFD700] transition-colors"
                    >
                      <option value="">Select type...</option>
                      {businessTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Tax ID / Registration No
                    </label>
                    <input
                      type="text"
                      value={form.taxId}
                      onChange={e => setForm({ ...form, taxId: e.target.value })}
                      placeholder="Optional"
                      className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder:text-neutral-600 focus:outline-none focus:border-[#FFD700] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Number of Employees
                  </label>
                  <select
                    value={form.employees}
                    onChange={e => setForm({ ...form, employees: e.target.value })}
                    className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-[#FFD700] transition-colors"
                  >
                    <option value="">Select range...</option>
                    <option value="1-10">1-10</option>
                    <option value="11-50">11-50</option>
                    <option value="51-200">51-200</option>
                    <option value="201-500">201-500</option>
                    <option value="500+">500+</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-[#FFD700]" />
                Contact Information
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Contact Person *
                  </label>
                  <input
                    type="text"
                    value={form.contactPerson}
                    onChange={e => setForm({ ...form, contactPerson: e.target.value })}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder:text-neutral-600 focus:outline-none focus:border-[#FFD700] transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      placeholder="contact@company.com"
                      className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder:text-neutral-600 focus:outline-none focus:border-[#FFD700] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={e => setForm({ ...form, phone: e.target.value })}
                      placeholder="077-1234567"
                      className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder:text-neutral-600 focus:outline-none focus:border-[#FFD700] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Business Address
                  </label>
                  <textarea
                    value={form.address}
                    onChange={e => setForm({ ...form, address: e.target.value })}
                    placeholder="Full business address"
                    rows={3}
                    className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder:text-neutral-600 focus:outline-none focus:border-[#FFD700] transition-colors resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* Benefits Preview */}
            <div className="bg-[#FFD700]/5 border border-[#FFD700]/20 rounded-lg p-4">
              <p className="text-sm text-neutral-400 mb-2">
                <strong className="text-white">Corporate Benefits:</strong>
              </p>
              <ul className="text-sm text-neutral-400 space-y-1">
                <li className="flex items-center gap-2">
                  <span className="text-[#FFD700]">✓</span> 10% discount on all services
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#FFD700]">✓</span> Priority booking access
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#FFD700]">✓</span> Monthly service reports
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#FFD700]">✓</span> Dedicated account manager
                </li>
              </ul>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#FFD700] text-black font-bold rounded-lg hover:bg-[#FFD700]/90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Building2 className="w-5 h-5" />
                  Register Company
                </>
              )}
            </button>
          </form>
        </div>

        {/* Our Branches */}
        <div className="mt-8 bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Our Branches</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {[
              { num: 1, name: 'Pannipitiya', addr: '278/2 High Level Rd, Pannipitiya' },
              { num: 2, name: 'Ratnapura', addr: '151 Colombo Rd, Ratnapura' },
              { num: 3, name: 'Kalawana', addr: 'Rathnapura Road, Kalawana' },
              { num: 4, name: 'Nivithigala', addr: 'Tiruwanaketiya-Agalawatte Rd, Nivithigala' },
            ].map(b => (
              <div key={b.num} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#FFD700]/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-[#FFD700] text-xs font-bold">{b.num}</span>
                </div>
                <div>
                  <p className="text-white font-medium">{b.name}</p>
                  <p className="text-neutral-500 text-xs">{b.addr}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Help & Back */}
        <div className="text-center mt-6">
          <p className="text-neutral-500 text-sm mb-2">
            Need help? Contact us at{' '}
            <a href="tel:0775785785" className="text-[#FFD700] hover:underline">077 578 5785</a>
          </p>
          <Link to="/" className="text-neutral-400 hover:text-[#FFD700] text-sm transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}