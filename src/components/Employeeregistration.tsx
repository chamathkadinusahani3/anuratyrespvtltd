import React, { useState, useEffect, useRef } from 'react';
import { User, Building2, CheckCircle, AlertCircle, Tag, Download, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import jsPDF from 'jspdf';

interface EmployeeRegistrationForm {
  employeeName: string; employeeEmail: string; employeePhone: string;
  corporateCode: string; vehicleNo: string; department: string; employeeId: string;
}

// ✅ FIX: use VITE_API_URL properly
const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');

export function EmployeeRegistration() {
  const [form, setForm] = useState<EmployeeRegistrationForm>({
    employeeName:'', employeeEmail:'', employeePhone:'',
    corporateCode:'', vehicleNo:'', department:'', employeeId:'',
  });
  const [loading, setLoading]                 = useState(false);
  const [success, setSuccess]                 = useState(false);
  const [error, setError]                     = useState('');
  const [codeValidating, setCodeValidating]   = useState(false);
  const [codeValidated, setCodeValidated]     = useState(false);
  const [codeError, setCodeError]             = useState('');
  const [companyName, setCompanyName]         = useState('');
  const [employeeDiscountId, setEmployeeDiscountId] = useState('');
  const [generatingPDF, setGeneratingPDF]     = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ✅ FIX: validate corporate code against MongoDB via backend
  const handleCorporateCodeChange = (code: string) => {
    setForm(f => ({ ...f, corporateCode: code.toUpperCase() }));
    setCodeValidated(false);
    setCompanyName('');
    setCodeError('');

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (code.length < 8) return;

    debounceRef.current = setTimeout(async () => {
      setCodeValidating(true);
      try {
        const res  = await fetch(`${API_URL}/corporate/validate?code=${encodeURIComponent(code.toUpperCase())}`);
        const data = await res.json();

        if (data.success && data.valid) {
          setCodeValidated(true);
          setCompanyName(data.companyName);
          setCodeError('');
        } else {
          setCodeValidated(false);
          setCodeError(data.message || 'Invalid corporate code. Please check with your HR department.');
        }
      } catch {
        setCodeError('Could not validate code. Please check your connection.');
      } finally {
        setCodeValidating(false);
      }
    }, 500);
  };

  // ✅ FIX: saves employee to MongoDB via backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.employeeName.trim())         return setError('Your name is required');
    if (!form.employeeEmail.includes('@')) return setError('Valid email is required');
    if (!form.employeePhone.trim())        return setError('Phone number is required');
    if (!form.corporateCode.trim())        return setError('Corporate code is required');
    if (!codeValidated)                    return setError('Please enter a valid corporate code first');

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/corporate/register-employee`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.status === 409) {
        // Already registered
        setEmployeeDiscountId(data.employeeDiscountId);
        setSuccess(true);
        return;
      }
      if (!res.ok || !data.success) throw new Error(data.message || 'Registration failed');

      setEmployeeDiscountId(data.employeeDiscountId);
      setCompanyName(data.companyName);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generateDiscountCardPDF = async () => {
    setGeneratingPDF(true);
    try {
      const loadLogo = (): Promise<string> => new Promise((resolve, reject) => {
        const img = new Image(); img.crossOrigin = 'anonymous';
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width; canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (ctx) { ctx.drawImage(img, 0, 0); resolve(canvas.toDataURL('image/png')); } else reject();
        };
        img.onerror = () => reject(); img.src = logo;
      });
      let logoData: string | null = null;
      try { logoData = await loadLogo(); } catch {}

      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;

      doc.setFillColor(255,215,0); doc.rect(0,0,pageWidth,40,'F');
      if (logoData) { try { doc.addImage(logoData, 'PNG', 15, 8, 25, 25); } catch {} }
      doc.setTextColor(0,0,0); doc.setFontSize(28); doc.setFont('helvetica','bold');
      doc.text('ANURA TYRES', pageWidth/2, 18, { align:'center' });
      doc.setFontSize(10); doc.setFont('helvetica','normal');
      doc.text('(Pvt) Ltd', pageWidth/2, 24, { align:'center' });
      doc.setFontSize(9); doc.setTextColor(51,51,51);
      doc.text('278/2 High Level Rd, Pannipitiya | Tel: 077 578 5785', pageWidth/2, 32, { align:'center' });
      doc.setDrawColor(0,0,0); doc.setLineWidth(0.5); doc.line(margin,42,pageWidth-margin,42);

      let yPos = 70;
      doc.setFontSize(22); doc.setFont('helvetica','bold'); doc.setTextColor(255,215,0);
      doc.text('EMPLOYEE DISCOUNT CARD', pageWidth/2, yPos, { align:'center' });
      yPos += 10; doc.setFontSize(11); doc.setFont('helvetica','normal'); doc.setTextColor(0,0,0);
      doc.text('10% Discount on All Services', pageWidth/2, yPos, { align:'center' });

      yPos += 15;
      const cardX = 30, cardWidth = pageWidth-60, cardHeight = 90;
      const cardStartY = yPos;
      doc.setFillColor(255,250,205); doc.roundedRect(cardX,yPos,cardWidth,cardHeight,3,3,'F');
      doc.setDrawColor(255,215,0); doc.setLineWidth(2); doc.roundedRect(cardX,yPos,cardWidth,cardHeight,3,3,'S');

      yPos += 15;
      doc.setFontSize(10); doc.setFont('helvetica','normal'); doc.setTextColor(102,102,102);
      doc.text('Employee Discount ID', pageWidth/2, yPos, { align:'center' });
      yPos += 10; doc.setFontSize(28); doc.setFont('courier','bold'); doc.setTextColor(255,215,0);
      doc.text(employeeDiscountId, pageWidth/2, yPos, { align:'center' });
      yPos += 15; doc.setFontSize(11); doc.setFont('helvetica','bold'); doc.setTextColor(0,0,0);
      doc.text(form.employeeName, pageWidth/2, yPos, { align:'center' });
      yPos += 6; doc.setFontSize(9); doc.setFont('helvetica','normal'); doc.setTextColor(102,102,102);
      doc.text(companyName, pageWidth/2, yPos, { align:'center' });
      yPos += 6; doc.text(form.employeePhone, pageWidth/2, yPos, { align:'center' });
      if (form.vehicleNo) { yPos += 6; doc.text(`Vehicle: ${form.vehicleNo}`, pageWidth/2, yPos, { align:'center' }); }

      const badgeY = cardStartY + 30;
      doc.setFillColor(255,215,0); doc.circle(pageWidth-50, badgeY, 15, 'F');
      doc.setFontSize(18); doc.setFont('helvetica','bold'); doc.setTextColor(0,0,0);
      doc.text('10%', pageWidth-50, badgeY-2, { align:'center' });
      doc.setFontSize(8); doc.text('OFF', pageWidth-50, badgeY+4, { align:'center' });

      yPos += 25;
      doc.setFillColor(255,250,205); doc.rect(margin,yPos,pageWidth-40,40,'F');
      doc.setDrawColor(255,215,0); doc.setLineWidth(0.5); doc.rect(margin,yPos,pageWidth-40,40,'S');
      yPos += 8; doc.setFontSize(11); doc.setFont('helvetica','bold'); doc.setTextColor(0,0,0);
      doc.text('HOW TO USE YOUR DISCOUNT:', 25, yPos);
      yPos += 7; doc.setFontSize(9); doc.setFont('helvetica','normal'); doc.setTextColor(51,51,51);
      ['1. Visit any Anura Tyres branch','2. Show your Employee Discount ID','3. Provide your registered phone number','4. Enjoy 10% discount!'].forEach(l => { doc.text(l, 25, yPos); yPos += 5; });

      yPos += 10; doc.setFillColor(240,240,240); doc.rect(margin,yPos,pageWidth-40,30,'F');
      yPos += 8; doc.setFontSize(11); doc.setFont('helvetica','bold'); doc.setTextColor(0,0,0);
      doc.text('VALID AT ALL ANURA TYRES BRANCHES:', 25, yPos);
      yPos += 6; doc.setFontSize(8); doc.setFont('helvetica','normal'); doc.setTextColor(51,51,51);
      ['Pannipitiya: 278/2 High Level Rd','Ratnapura: 151 Colombo Rd','Kalawana: Rathnapura Road','Nivithigala: Tiruwanaketiya-Agalawatte Rd'].forEach(b => { doc.text(`• ${b}`, 25, yPos); yPos += 4.5; });

      yPos += 8; doc.setFontSize(7); doc.setFont('helvetica','italic'); doc.setTextColor(102,102,102);
      const terms = ['Terms & Conditions: Valid for employees of registered corporate partners only.','Discount cannot be combined with other offers. ID and phone verification required.'];
      terms.forEach(t => { const lines = doc.splitTextToSize(t, pageWidth-50); doc.text(lines, 25, yPos); yPos += lines.length * 3; });

      const footerY = pageHeight-20;
      doc.setDrawColor(255,215,0); doc.setLineWidth(0.3); doc.line(margin,footerY,pageWidth-margin,footerY);
      doc.setFontSize(8); doc.setFont('helvetica','normal'); doc.setTextColor(102,102,102);
      doc.text('ANURA TYRES (Pvt) Ltd | Your Trusted Tyre Specialists', pageWidth/2, footerY+5, { align:'center' });
      doc.text('www.anuratyres.lk | info@anuratyres.lk | 077 578 5785', pageWidth/2, footerY+9, { align:'center' });
      doc.save(`Anura_Tyres_Employee_Discount_Card_${employeeDiscountId}.pdf`);
    } catch { alert('Failed to generate discount card.'); }
    finally { setGeneratingPDF(false); }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-8 text-center">
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Registration Successful!</h2>
            <p className="text-neutral-400 mb-6">Welcome {form.employeeName}! You're enrolled in the corporate discount program.</p>

            <div className="bg-[#FFD700]/10 border-2 border-[#FFD700] rounded-xl p-6 mb-6">
              <p className="text-sm text-neutral-400 mb-2">Your Employee Discount ID</p>
              <p className="text-3xl font-bold text-[#FFD700] font-mono tracking-wider">{employeeDiscountId}</p>
              <p className="text-xs text-neutral-500 mt-2">Show this at any Anura Tyres branch to get your discount</p>
            </div>

            <div className="bg-neutral-800 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center gap-2 text-neutral-400">
                <Building2 className="w-4 h-4 text-[#FFD700]" />
                <span className="text-sm">Employee of <strong className="text-white">{companyName}</strong></span>
              </div>
            </div>

            <div className="bg-neutral-800/50 border border-neutral-700 rounded-lg p-4 mb-6">
              <p className="text-sm text-neutral-400 mb-3"><strong className="text-white">How to use your discount:</strong></p>
              <ol className="text-left text-sm text-neutral-400 space-y-2 list-decimal list-inside">
                <li>Visit any Anura Tyres branch</li>
                <li>Show your ID: <strong className="text-[#FFD700]">{employeeDiscountId}</strong></li>
                <li>Provide your registered phone for verification</li>
                <li>Enjoy 10% off!</li>
              </ol>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/booking" className="flex-1 sm:flex-initial">
                <button className="w-full px-6 py-3 bg-[#FFD700] text-black font-bold rounded-lg hover:bg-[#FFD700]/90 transition-colors">
                  Book a Service
                </button>
              </Link>
              <button onClick={generateDiscountCardPDF} disabled={generatingPDF}
                className="flex-1 sm:flex-initial px-6 py-3 border border-neutral-700 text-white font-medium rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {generatingPDF ? <><Loader2 className="w-4 h-4 animate-spin" />Generating...</> : <><Download className="w-4 h-4" />Download Discount Card</>}
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
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src={logo} alt="Anura Tyres" className="h-12 w-12 object-contain" />
            <div className="text-left">
              <h1 className="text-2xl font-bold text-white">ANURA<span className="text-[#FFD700]">TYRES</span></h1>
              <p className="text-xs text-neutral-500">(Pvt) Ltd</p>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Employee Discount Registration</h2>
          <p className="text-neutral-400 mb-4">Employees of registered partner companies get 10% discount on all services</p>
          <div className="inline-flex items-center gap-2 bg-[#FFD700]/10 border border-[#FFD700]/30 rounded-full px-4 py-2">
            <Tag className="w-4 h-4 text-[#FFD700]" />
            <span className="text-[#FFD700] text-sm font-bold">Get 10% OFF on All Services</span>
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Corporate Code */}
            <div>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#FFD700]" /> Company Verification
              </h3>
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Corporate Code * <span className="text-xs text-neutral-500 ml-2">(Get this from your company HR)</span>
                </label>
                <div className="relative">
                  <input type="text" value={form.corporateCode}
                    onChange={e => handleCorporateCodeChange(e.target.value)}
                    placeholder="CORP-XXXXX"
                    className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder:text-neutral-600 focus:outline-none focus:border-[#FFD700] transition-colors uppercase pr-10" />
                  {codeValidating && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Loader2 className="w-4 h-4 text-neutral-400 animate-spin" />
                    </div>
                  )}
                </div>
                {codeValidated && (
                  <div className="mt-2 flex items-center gap-2 text-green-400 text-sm">
                    <CheckCircle className="w-4 h-4" />
                    <span>✓ Valid code for <strong>{companyName}</strong></span>
                  </div>
                )}
                {codeError && form.corporateCode.length >= 8 && (
                  <div className="mt-2 flex items-center gap-2 text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{codeError}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Personal Info */}
            <div>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-[#FFD700]" /> Your Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Full Name *</label>
                  <input type="text" value={form.employeeName} onChange={e => setForm({...form, employeeName: e.target.value})}
                    placeholder="John Doe" className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder:text-neutral-600 focus:outline-none focus:border-[#FFD700] transition-colors" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Email Address *</label>
                    <input type="email" value={form.employeeEmail} onChange={e => setForm({...form, employeeEmail: e.target.value})}
                      placeholder="john@company.com" className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder:text-neutral-600 focus:outline-none focus:border-[#FFD700] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Phone Number *</label>
                    <input type="tel" value={form.employeePhone} onChange={e => setForm({...form, employeePhone: e.target.value})}
                      placeholder="077-1234567" className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder:text-neutral-600 focus:outline-none focus:border-[#FFD700] transition-colors" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Employee ID <span className="text-xs text-neutral-500">(Optional)</span></label>
                    <input type="text" value={form.employeeId} onChange={e => setForm({...form, employeeId: e.target.value})}
                      placeholder="EMP12345" className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder:text-neutral-600 focus:outline-none focus:border-[#FFD700] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Department <span className="text-xs text-neutral-500">(Optional)</span></label>
                    <input type="text" value={form.department} onChange={e => setForm({...form, department: e.target.value})}
                      placeholder="Sales, IT, HR..." className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder:text-neutral-600 focus:outline-none focus:border-[#FFD700] transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Vehicle Registration <span className="text-xs text-neutral-500">(Optional)</span></label>
                  <input type="text" value={form.vehicleNo} onChange={e => setForm({...form, vehicleNo: e.target.value.toUpperCase()})}
                    placeholder="CAB-1234" className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder:text-neutral-600 focus:outline-none focus:border-[#FFD700] transition-colors uppercase" />
                </div>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <div className="bg-[#FFD700]/5 border border-[#FFD700]/20 rounded-lg p-4">
              <p className="text-sm text-neutral-400 mb-2"><strong className="text-white">What You'll Get:</strong></p>
              <ul className="text-sm text-neutral-400 space-y-1">
                {['10% discount on all services','Valid at all Anura Tyres branches','Easy in-store and online redemption','Instant activation after registration'].map(b => (
                  <li key={b} className="flex items-center gap-2"><span className="text-[#FFD700]">✓</span>{b}</li>
                ))}
              </ul>
            </div>

            <button type="submit" disabled={loading || !codeValidated}
              className="w-full py-4 bg-[#FFD700] text-black font-bold rounded-lg hover:bg-[#FFD700]/90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {loading
                ? <><div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />Processing Registration...</>
                : <><CheckCircle className="w-5 h-5" />Register for Employee Discount</>}
            </button>

            {!codeValidated && form.corporateCode.length >= 8 && !codeValidating && (
              <p className="text-sm text-center text-red-400">Please enter a valid corporate code to continue</p>
            )}
          </form>
        </div>

        <div className="mt-8 bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Our Branches</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {[{num:1,name:'Pannipitiya',addr:'278/2 High Level Rd, Pannipitiya'},{num:2,name:'Ratnapura',addr:'151 Colombo Rd, Ratnapura'},{num:3,name:'Kalawana',addr:'Rathnapura Road, Kalawana'},{num:4,name:'Nivithigala',addr:'Tiruwanaketiya-Agalawatte Rd, Nivithigala'}].map(b => (
              <div key={b.num} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#FFD700]/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-[#FFD700] text-xs font-bold">{b.num}</span>
                </div>
                <div><p className="text-white font-medium">{b.name}</p><p className="text-neutral-500 text-xs">{b.addr}</p></div>
              </div>
            ))}
          </div>
        </div>
        <div className="text-center mt-6">
          <p className="text-neutral-500 text-sm mb-2">Need help? Contact us at <a href="tel:0775785785" className="text-[#FFD700] hover:underline">077 578 5785</a></p>
          <Link to="/" className="text-neutral-400 hover:text-[#FFD700] text-sm transition-colors">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}