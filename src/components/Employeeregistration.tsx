import React, { useState } from 'react';
import { User, Mail, Phone, Building2, CheckCircle, AlertCircle, Briefcase, Tag, Car, Download, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { validateCorporateCode } from '../utils/corporateUtils';
import logo from '../assets/logo.png';
import jsPDF from 'jspdf';

interface EmployeeRegistrationForm {
  employeeName: string;
  employeeEmail: string;
  employeePhone: string;
  corporateCode: string;
  vehicleNo: string;
  department: string;
  employeeId: string;
}

export function EmployeeRegistration() {
  const [form, setForm] = useState<EmployeeRegistrationForm>({
    employeeName: '',
    employeeEmail: '',
    employeePhone: '',
    corporateCode: '',
    vehicleNo: '',
    department: '',
    employeeId: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [codeValidated, setCodeValidated] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [employeeDiscountId, setEmployeeDiscountId] = useState('');
  const [generatingPDF, setGeneratingPDF] = useState(false);

  const generateDiscountCardPDF = async () => {
    setGeneratingPDF(true);

    try {
            // Load logo first
      const loadLogo = (): Promise<string> => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => {
            // Convert image to base64
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
          img.src = logo; // Your logo path
        });
      };

      let logoData: string | null = null;
      try {
        logoData = await loadLogo();
      } catch (error) {
        console.log('Logo not loaded, continuing without it');
      }

      // Create new PDF document
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      let yPosition = 20;

      // ═══════════════════════════════════════════════════════════════════
      // LETTERHEAD - Yellow Header Bar
      // ═══════════════════════════════════════════════════════════════════
      doc.setFillColor(255, 215, 0); // #FFD700 - Brand Yellow
      doc.rect(0, 0, pageWidth, 40, 'F');

      // Add Logo (left side of header)
      if (logoData) {
        try {
          doc.addImage(logoData, 'PNG', 15, 8, 25, 25); // x, y, width, height
        } catch (error) {
          console.log('Error adding logo to PDF:', error);
        }
      }

      // Company Name (centered)
      doc.setTextColor(0, 0, 0); // Black
      doc.setFontSize(28);
      doc.setFont('helvetica', 'bold');
      doc.text('ANURA TYRES', pageWidth / 2, 18, { align: 'center' });
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('(Pvt) Ltd', pageWidth / 2, 24, { align: 'center' });

      // Contact Information in Header
      doc.setFontSize(9);
      doc.setTextColor(51, 51, 51); // Dark gray
      doc.text('278/2 High Level Rd, Pannipitiya | Tel: 077 578 5785', pageWidth / 2, 32, { align: 'center' });

      // Black separator line
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.5);
      doc.line(margin, 42, pageWidth - margin, 42);

      yPosition = 55;


      // ═══════════════════════════════════════════════════════════════
      // DISCOUNT CARD TITLE
      // ═══════════════════════════════════════════════════════════════
      let yPos = 70;

      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 215, 0);
      doc.text('EMPLOYEE DISCOUNT CARD', pageWidth / 2, yPos, { align: 'center' });

      yPos += 10;
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      doc.text('10% Discount on All Tyre Purchases', pageWidth / 2, yPos, { align: 'center' });

      // ═══════════════════════════════════════════════════════════════
      // DISCOUNT CARD BOX
      // ═══════════════════════════════════════════════════════════════
      yPos += 15;
      const cardX = 30;
      const cardWidth = pageWidth - 60;
      const cardHeight = 90;

      // Card background
      doc.setFillColor(255, 250, 205);
      doc.roundedRect(cardX, yPos, cardWidth, cardHeight, 3, 3, 'F');

      // Card border
      doc.setDrawColor(255, 215, 0);
      doc.setLineWidth(2);
      doc.roundedRect(cardX, yPos, cardWidth, cardHeight, 3, 3, 'S');

      // Employee Discount ID (Large)
      yPos += 15;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(102, 102, 102);
      doc.text('Employee Discount ID', pageWidth / 2, yPos, { align: 'center' });

      yPos += 10;
      doc.setFontSize(28);
      doc.setFont('courier', 'bold');
      doc.setTextColor(255, 215, 0);
      doc.text(employeeDiscountId, pageWidth / 2, yPos, { align: 'center' });

      // Employee Details
      yPos += 15;
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text(form.employeeName, pageWidth / 2, yPos, { align: 'center' });

      yPos += 6;
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(102, 102, 102);
      doc.text(companyName, pageWidth / 2, yPos, { align: 'center' });

      yPos += 6;
      doc.text(form.employeePhone, pageWidth / 2, yPos, { align: 'center' });

      if (form.vehicleNo) {
        yPos += 6;
        doc.text(`Vehicle: ${form.vehicleNo}`, pageWidth / 2, yPos, { align: 'center' });
      }

      // Discount Badge
      const badgeY = yPos - 50;
      doc.setFillColor(255, 215, 0);
      doc.circle(pageWidth - 50, badgeY, 15, 'F');
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text('10%', pageWidth - 50, badgeY - 2, { align: 'center' });
      doc.setFontSize(8);
      doc.text('OFF', pageWidth - 50, badgeY + 4, { align: 'center' });

      // ═══════════════════════════════════════════════════════════════
      // HOW TO USE
      // ═══════════════════════════════════════════════════════════════
      yPos += 25;
      doc.setFillColor(255, 250, 205);
      doc.rect(20, yPos, pageWidth - 40, 40, 'F');
      doc.setDrawColor(255, 215, 0);
      doc.setLineWidth(0.5);
      doc.rect(20, yPos, pageWidth - 40, 40, 'S');

      yPos += 8;
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text('HOW TO USE YOUR DISCOUNT:', 25, yPos);

      yPos += 7;
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 51, 51);
      
      const instructions = [
        '1. Visit any Anura Tyres branch',
        '2. Show this discount card or provide your Employee Discount ID',
        '3. Provide your registered phone number for verification',
        '4. Enjoy 10% discount on your tyre purchase!'
      ];

      instructions.forEach(instruction => {
        doc.text(instruction, 25, yPos);
        yPos += 5;
      });

      // ═══════════════════════════════════════════════════════════════
      // BRANCHES
      // ═══════════════════════════════════════════════════════════════
      yPos += 10;
      doc.setFillColor(240, 240, 240);
      doc.rect(20, yPos, pageWidth - 40, 30, 'F');

      yPos += 8;
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text('VALID AT ALL ANURA TYRES BRANCHES:', 25, yPos);

      yPos += 6;
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 51, 51);

      const branches = [
        'Pannipitiya: 278/2 High Level Rd, Pannipitiya',
        'Ratnapura: 151 Colombo Rd, Ratnapura',
        'Kalawana: Rathnapura Road, Kalawana',
        'Nivithigala: Tiruwanaketiya-Agalawatte Rd, Nivithigala'
      ];


      
      branches.forEach(branch => {
        doc.text(`• ${branch}`, 25, yPos);
        yPos += 4.5;
      });

      // ═══════════════════════════════════════════════════════════════
      // TERMS & CONDITIONS
      // ═══════════════════════════════════════════════════════════════
      yPos += 8;
      doc.setFontSize(7);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(102, 102, 102);
      
      const terms = [
        'Terms & Conditions: This discount is valid for employees of registered corporate partners only.',
        'Discount cannot be combined with other offers. Valid ID and phone verification required.',
        'Discount applies to tyre purchases only. Anura Tyres reserves the right to modify terms.'
      ];

      terms.forEach(term => {
        const lines = doc.splitTextToSize(term, pageWidth - 50);
        doc.text(lines, 25, yPos);
        yPos += lines.length * 3;
      });

      // ═══════════════════════════════════════════════════════════════
      // FOOTER
      // ═══════════════════════════════════════════════════════════════
      const footerY = pageHeight - 20;
      doc.setDrawColor(255, 215, 0);
      doc.setLineWidth(0.3);
      doc.line(20, footerY, pageWidth - 20, footerY);

      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(102, 102, 102);
      doc.text('ANURA TYRES (Pvt) Ltd | Your Trusted Tyre Specialists', pageWidth / 2, footerY + 5, { align: 'center' });
      doc.text('www.anuratyres.lk | info@anuratyres.lk | 077 578 5785', pageWidth / 2, footerY + 9, { align: 'center' });

      doc.setFontSize(7);
      doc.text(`Generated on: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, pageWidth / 2, footerY + 13, { align: 'center' });

      // Save PDF
      doc.save(`Anura_Tyres_Employee_Discount_Card_${employeeDiscountId}.pdf`);

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate discount card. Please try again.');
    } finally {
      setGeneratingPDF(false);
    }
  };

  const handleCorporateCodeChange = (code: string) => {
    setForm({ ...form, corporateCode: code });
    
    if (code.length >= 8) {
      const validation = validateCorporateCode(code);
      if (validation.isValid && validation.corporate) {
        setCodeValidated(true);
        setCompanyName(validation.corporate.companyName);
        setError('');
      } else {
        setCodeValidated(false);
        setCompanyName('');
        setError('Invalid corporate code. Please check with your company.');
      }
    } else {
      setCodeValidated(false);
      setCompanyName('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!form.employeeName.trim()) {
      setError('Your name is required');
      setLoading(false);
      return;
    }
    if (!form.employeeEmail.includes('@')) {
      setError('Valid email is required');
      setLoading(false);
      return;
    }
    if (!form.employeePhone.trim()) {
      setError('Phone number is required');
      setLoading(false);
      return;
    }
    if (!form.corporateCode.trim()) {
      setError('Corporate code is required');
      setLoading(false);
      return;
    }

    // Validate corporate code
    const validation = validateCorporateCode(form.corporateCode);
    if (!validation.isValid) {
      setError('Invalid corporate code. Please check with your company HR department.');
      setLoading(false);
      return;
    }

    try {
      // Generate unique employee discount ID
      const discountId = `EMP-${Date.now().toString(36).toUpperCase()}`;

      // Prepare employee data
      const employeeData = {
        ...form,
        employeeDiscountId: discountId,
        companyName: validation.corporate?.companyName,
        discount: 10, // 10% discount
        status: 'active',
        registeredDate: new Date().toISOString(),
        usageCount: 0
      };

      // Save to localStorage (in production, save to backend)
      const existingEmployees = JSON.parse(localStorage.getItem('at_employee_discounts') || '[]');
      existingEmployees.push(employeeData);
      localStorage.setItem('at_employee_discounts', JSON.stringify(existingEmployees));

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setEmployeeDiscountId(discountId);
      setSuccess(true);

      // TODO: Send welcome email with employee discount ID
      console.log('Employee registered for discount:', employeeData);

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
          {/* Success Card */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-8 text-center">
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>

            <h2 className="text-3xl font-bold text-white mb-4">
              Registration Successful!
            </h2>

            <p className="text-neutral-400 mb-6">
              Welcome {form.employeeName}! You're now enrolled in the corporate discount program.
            </p>

            {/* Employee Discount ID */}
            <div className="bg-[#FFD700]/10 border-2 border-[#FFD700] rounded-xl p-6 mb-6">
              <p className="text-sm text-neutral-400 mb-2">Your Employee Discount ID</p>
              <p className="text-3xl font-bold text-[#FFD700] font-mono tracking-wider">
                {employeeDiscountId}
              </p>
              <p className="text-xs text-neutral-500 mt-2">
                Show this at any Anura Tyres branch to get your discount
              </p>
            </div>

            {/* Company Info */}
            <div className="bg-neutral-800 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center gap-2 text-neutral-400">
                <Building2 className="w-4 h-4 text-[#FFD700]" />
                <span className="text-sm">
                  Employee of <strong className="text-white">{companyName}</strong>
                </span>
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-neutral-800 rounded-lg p-6 mb-6 text-left">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Tag className="w-5 h-5 text-[#FFD700]" />
                Your Discount Benefits
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#FFD700]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[#FFD700] text-sm font-bold">10%</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">10% Discount on All Tyre Purchases</p>
                    <p className="text-xs text-neutral-500">Valid at all Anura Tyres branches</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-400 text-sm">✓</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">Easy In-Store Redemption</p>
                    <p className="text-xs text-neutral-500">Just show your Employee Discount ID</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-400 text-sm">📱</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">Online Booking Available</p>
                    <p className="text-xs text-neutral-500">Book appointments and use your discount code</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-purple-400 text-sm">🏪</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">All Branches Included</p>
                    <p className="text-xs text-neutral-500">Pannipitiya, Maharagama, Nugegoda, Piliyandala</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* How to Use */}
            <div className="bg-neutral-800/50 border border-neutral-700 rounded-lg p-4 mb-6">
              <p className="text-sm text-neutral-400 mb-3">
                <strong className="text-white">How to Use Your Discount:</strong>
              </p>
              <ol className="text-left text-sm text-neutral-400 space-y-2 list-decimal list-inside">
                <li>Visit any Anura Tyres branch</li>
                <li>Show your Employee Discount ID: <strong className="text-[#FFD700]">{employeeDiscountId}</strong></li>
                <li>Provide your registered phone number for verification</li>
                <li>Enjoy 10% off on your tyre purchase!</li>
              </ol>
            </div>

            {/* Important Note */}
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 mb-6">
              <p className="text-xs text-yellow-400">
                <strong>Important:</strong> Save a screenshot of this page or note down your Employee Discount ID. 
                You'll need it for all future purchases.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/booking" className="flex-1 sm:flex-initial">
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
            Employee Discount Registration
          </h2>
          <p className="text-neutral-400 mb-4">
            Employees of registered partner companies get 10% discount on all tyre purchases
          </p>
          
          {/* Benefits Banner */}
          <div className="inline-flex items-center gap-2 bg-[#FFD700]/10 border border-[#FFD700]/30 rounded-full px-4 py-2">
            <Tag className="w-4 h-4 text-[#FFD700]" />
            <span className="text-[#FFD700] text-sm font-bold">Get 10% OFF on All Services</span>
          </div>
        </div>

        {/* Registration Form */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Corporate Code Verification */}
            <div>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#FFD700]" />
                Company Verification
              </h3>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Corporate Code *
                  <span className="text-xs text-neutral-500 ml-2">(Get this from your company HR)</span>
                </label>
                <input
                  type="text"
                  value={form.corporateCode}
                  onChange={e => handleCorporateCodeChange(e.target.value)}
                  placeholder="CORP-XXXXX"
                  className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder:text-neutral-600 focus:outline-none focus:border-[#FFD700] transition-colors uppercase"
                />
                {codeValidated && (
                  <div className="mt-2 flex items-center gap-2 text-green-400 text-sm">
                    <CheckCircle className="w-4 h-4" />
                    <span>✓ Valid code for <strong>{companyName}</strong></span>
                  </div>
                )}
              </div>
            </div>

            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-[#FFD700]" />
                Your Information
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={form.employeeName}
                    onChange={e => setForm({ ...form, employeeName: e.target.value })}
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
                      value={form.employeeEmail}
                      onChange={e => setForm({ ...form, employeeEmail: e.target.value })}
                      placeholder="john@company.com"
                      className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder:text-neutral-600 focus:outline-none focus:border-[#FFD700] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={form.employeePhone}
                      onChange={e => setForm({ ...form, employeePhone: e.target.value })}
                      placeholder="077-1234567"
                      className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder:text-neutral-600 focus:outline-none focus:border-[#FFD700] transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Employee ID
                      <span className="text-xs text-neutral-500 ml-2">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={form.employeeId}
                      onChange={e => setForm({ ...form, employeeId: e.target.value })}
                      placeholder="EMP12345"
                      className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder:text-neutral-600 focus:outline-none focus:border-[#FFD700] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Department
                      <span className="text-xs text-neutral-500 ml-2">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={form.department}
                      onChange={e => setForm({ ...form, department: e.target.value })}
                      placeholder="Sales, IT, HR, etc."
                      className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder:text-neutral-600 focus:outline-none focus:border-[#FFD700] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Vehicle Registration Number
                    <span className="text-xs text-neutral-500 ml-2">(Optional but recommended)</span>
                  </label>
                  <input
                    type="text"
                    value={form.vehicleNo}
                    onChange={e => setForm({ ...form, vehicleNo: e.target.value })}
                    placeholder="CAB-1234 or ABC-5678"
                    className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder:text-neutral-600 focus:outline-none focus:border-[#FFD700] transition-colors uppercase"
                  />
                  <p className="text-xs text-neutral-500 mt-1">
                    This helps us serve you faster at our branches
                  </p>
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
                <strong className="text-white">What You'll Get:</strong>
              </p>
              <ul className="text-sm text-neutral-400 space-y-1">
                <li className="flex items-center gap-2">
                  <span className="text-[#FFD700]">✓</span> 10% discount on all tyre purchases
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#FFD700]">✓</span> Valid at all Anura Tyres branches
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#FFD700]">✓</span> Easy in-store and online redemption
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#FFD700]">✓</span> Instant activation after registration
                </li>
              </ul>
            </div>

            {/* Terms */}
            <div className="bg-neutral-800/50 border border-neutral-700 rounded-lg p-3">
              <p className="text-xs text-neutral-500">
                By registering, you confirm that you are an employee of a registered partner company 
                and agree to provide accurate information. The discount is for personal use only and 
                cannot be combined with other offers.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !codeValidated}
              className="w-full py-4 bg-[#FFD700] text-black font-bold rounded-lg hover:bg-[#FFD700]/90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Processing Registration...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Register for Employee Discount
                </>
              )}
            </button>

            {!codeValidated && form.corporateCode.length >= 8 && (
              <p className="text-sm text-center text-red-400">
                Please enter a valid corporate code to continue
              </p>
            )}
          </form>
        </div>

        {/* Our Branches */}
        <div className="mt-8 bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Our Branches</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#FFD700]/20 flex items-center justify-center flex-shrink-0">
                <span className="text-[#FFD700] text-xs font-bold">1</span>
              </div>
              <div>
                <p className="text-white font-medium">Pannipitiya</p>
                <p className="text-neutral-500 text-xs">278/2 High Level Rd, Pannipitiya</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#FFD700]/20 flex items-center justify-center flex-shrink-0">
                <span className="text-[#FFD700] text-xs font-bold">2</span>
              </div>
              <div>
                <p className="text-white font-medium">Ratnapura</p>
                <p className="text-neutral-500 text-xs">151 Colombo Rd, Ratnapura </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#FFD700]/20 flex items-center justify-center flex-shrink-0">
                <span className="text-[#FFD700] text-xs font-bold">3</span>
              </div>
              <div>
                <p className="text-white font-medium">Kalawana</p>
                <p className="text-neutral-500 text-xs">Rathnapura road, Kalawana</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#FFD700]/20 flex items-center justify-center flex-shrink-0">
                <span className="text-[#FFD700] text-xs font-bold">4</span>
              </div>
              <div>
                <p className="text-white font-medium">Nivithigala</p>
                <p className="text-neutral-500 text-xs">Tiruwanaketiya-Agalawatte Rd, Nivithigala</p>
              </div>
            </div>
          </div>
        </div>

        {/* Help */}
        <div className="text-center mt-6">
          <p className="text-neutral-500 text-sm mb-2">
            Need help? Contact us at <a href="tel:0775785785" className="text-[#FFD700] hover:underline">077 578 5785</a>
          </p>
          <Link to="/" className="text-neutral-400 hover:text-[#FFD700] text-sm transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}