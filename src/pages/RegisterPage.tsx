import React, { useState } from 'react';
import { Eye, EyeOff, ArrowLeft, Mail, Lock, User, Phone, Car, AlertCircle, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import logo from "../assets/logo.png";

interface RegisterForm {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  vehiclePlate: string;
}

const passwordStrength = (pwd: string) => {
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  return score; //  0-4
};

const strengthLabel = ['Too short', 'Weak', 'Fair', 'Good', 'Strong'];
const strengthColor = ['bg-neutral-700', 'bg-red-500', 'bg-orange-400', 'bg-yellow-400', 'bg-green-500'];

export function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<RegisterForm>({
    name: '', email: '', phone: '', password: '', confirmPassword: '', vehiclePlate: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [agreed, setAgreed] = useState(false);

  const pwdScore = passwordStrength(form.password);

  const getFriendlyError = (code: string) => {
    const map: Record<string, string> = {
      'auth/email-already-in-use':  'An account already exists with this email.',
      'auth/invalid-email':          'Please enter a valid email address.',
      'auth/weak-password':          'Password should be at least 6 characters.',
      'auth/popup-closed-by-user':   'Google sign-up was cancelled.',
      'auth/network-request-failed': 'Network error. Please check your connection.',
    };
    return map[code] || 'Registration failed. Please try again.';
  };

  const validate = () => {
    if (!form.name.trim())          return 'Full name is required.';
    if (!form.email.includes('@'))  return 'Please enter a valid email.';
    if (!form.phone.trim())         return 'Phone number is required.';
    if (form.password.length < 6)   return 'Password must be at least 6 characters.';
    if (form.password !== form.confirmPassword) return 'Passwords do not match.';
    if (!agreed)                    return 'Please agree to the terms to continue.';
    return null;
  };

  const saveUserProfile = (uid: string) => {
    // Save extended profile to localStorage (replace with Firestore in production)
    const profile = {
      uid,
      name: form.name,
      email: form.email,
      phone: form.phone,
      vehiclePlate: form.vehiclePlate,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem(`at_profile_${uid}`, JSON.stringify(profile));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    setIsLoading(true);
    setError('');
    try {
      const cred = await createUserWithEmailAndPassword(auth, form.email, form.password);
      await updateProfile(cred.user, { displayName: form.name });
      saveUserProfile(cred.user.uid);
      navigate('/dashboard');
    } catch (err: any) {
      setError(getFriendlyError(err.code));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setGoogleLoading(true);
    setError('');
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      // Save basic profile from Google
      const profile = {
        uid: cred.user.uid,
        name: cred.user.displayName || '',
        email: cred.user.email || '',
        phone: '',
        vehiclePlate: '',
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem(`at_profile_${cred.user.uid}`, JSON.stringify(profile));
      navigate('/dashboard');
    } catch (err: any) {
      setError(getFriendlyError(err.code));
    } finally {
      setGoogleLoading(false);
    }
  };

  const field = (key: keyof RegisterForm, label: string, placeholder: string, type = 'text', icon: React.ReactNode, optional = false) => (
    <div>
      <label className="block text-xs font-semibold text-neutral-400 mb-1.5 uppercase tracking-wider">
        {label} {optional && <span className="text-neutral-600 normal-case tracking-normal font-normal">(optional)</span>}
      </label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600">{icon}</div>
        <input
          type={type}
          value={form[key]}
          onChange={e => setForm({ ...form, [key]: e.target.value })}
          placeholder={placeholder}
          autoComplete="off"
          className="w-full bg-neutral-900 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white text-sm placeholder-neutral-700 focus:outline-none focus:border-brand-yellow focus:ring-1 focus:ring-brand-yellow/30 transition-all"
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-neutral-950 text-white overflow-hidden">

      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden flex-col items-center justify-center p-16 bg-black">
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `repeating-linear-gradient(-45deg, #FFD700 0px, #FFD700 1px, transparent 0px, transparent 40%)`,
            backgroundSize: '24px 24px',
          }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-brand-red/5 blur-[120px]" />
        <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-brand-yellow to-transparent" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center max-w-sm"
        >
          {/* Logo */}
            <Link to="/" className="flex-shrink-0 flex items-center gap-3">
              <img src={logo} alt="Anura Tyres Logo" className="h-12 w-auto object-contain" />
              <div className="flex flex-col leading-none">
                <span className="text-brand-white font-bold text-lg">ANURA TYRES</span>
                <span className="text-brand-gray text-xs tracking-wider">(Pvt) Ltd</span>
              </div>
            </Link>
          {/* Benefits */}
          <div className="space-y-3 text-left">
            {[
              { icon: '📅', text: 'Book services online 24/7' },
              { icon: '🚗', text: 'Track all your vehicles in one place' },
              { icon: '🏷️', text: 'Access exclusive discounts & offers' },
              { icon: '📋', text: 'View service history & invoices' },
              { icon: '🔔', text: 'Insurance & revenue expiry reminders' },
            ].map(b => (
              <div key={b.text} className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3 border border-white/5">
                <span className="text-lg">{b.icon}</span>
                <span className="text-sm text-neutral-300">{b.text}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right form panel */}
      <div className="w-full lg:w-[55%] flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-12 overflow-y-auto relative">
        <Link to="/login" className="absolute top-6 left-6 flex items-center gap-2 text-sm text-neutral-500 hover:text-brand-yellow transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Login
        </Link>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[400px] mx-auto"
        >
          <div className="mb-7">
            <div className="w-8 h-1 bg-brand-yellow rounded mb-4" />
            <h2 className="text-3xl font-black text-white tracking-tight">Create account</h2>
            <p className="text-neutral-500 mt-1 text-sm">Free forever. No credit card required.</p>
          </div>

          {/* Error banner */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-5 flex items-start gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-sm overflow-hidden"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Google */}
          <button
            onClick={handleGoogleRegister}
            disabled={isLoading || googleLoading}
            className="w-full flex items-center justify-center gap-3 bg-white text-neutral-900 font-bold py-3.5 rounded-xl hover:bg-neutral-100 active:scale-[0.98] transition-all mb-5 disabled:opacity-60 shadow-sm"
          >
            {googleLoading ? (
              <span className="w-5 h-5 border-2 border-neutral-300 border-t-neutral-700 rounded-full animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            )}
            Sign up with Google
          </button>

          {/* Divider */}
          <div className="relative flex items-center mb-5">
            <div className="flex-1 h-px bg-white/10" />
            <span className="mx-4 text-xs text-neutral-600 uppercase tracking-widest">or fill in details</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-4" autoComplete="off">
            {field('name',   'Full Name',    'John Doe',         'text',  <User  className="w-4 h-4" />)}
            {field('email',  'Email',        'you@example.com',  'email', <Mail  className="w-4 h-4" />)}
            {field('phone',  'Phone Number', '077 123 4567',     'tel',   <Phone className="w-4 h-4" />)}

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-neutral-400 mb-1.5 uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="Min. 6 characters"
                  autoComplete="new-password"
                  className="w-full bg-neutral-900 border border-white/10 rounded-xl pl-11 pr-12 py-3.5 text-white text-sm placeholder-neutral-700 focus:outline-none focus:border-brand-yellow focus:ring-1 focus:ring-brand-yellow/30 transition-all"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-white transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {/* Strength bar */}
              {form.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1,2,3,4].map(i => (
                      <div key={i} className={`flex-1 h-1 rounded-full transition-all ${i <= pwdScore ? strengthColor[pwdScore] : 'bg-white/10'}`} />
                    ))}
                  </div>
                  <p className={`text-xs ${pwdScore <= 1 ? 'text-red-400' : pwdScore <= 2 ? 'text-orange-400' : pwdScore <= 3 ? 'text-yellow-400' : 'text-green-400'}`}>
                    {strengthLabel[pwdScore]}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold text-neutral-400 mb-1.5 uppercase tracking-wider">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
                <input
                  type="password"
                  value={form.confirmPassword}
                  onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                  placeholder="Repeat your password"
                  autoComplete="new-password"
                  className="w-full bg-neutral-900 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white text-sm placeholder-neutral-700 focus:outline-none focus:border-brand-yellow focus:ring-1 focus:ring-brand-yellow/30 transition-all"
                />
                {form.confirmPassword && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    {form.password === form.confirmPassword
                      ? <CheckCircle className="w-4 h-4 text-green-400" />
                      : <AlertCircle className="w-4 h-4 text-red-400" />
                    }
                  </div>
                )}
              </div>
            </div>

            {/* Optional vehicle plate */}
            {field('vehiclePlate', 'Vehicle Plate', 'CAB-1234', 'text', <Car className="w-4 h-4" />, true)}

            {/* Terms */}
            <label className="flex items-start gap-3 cursor-pointer group">
              <div
                onClick={() => setAgreed(!agreed)}
                className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all cursor-pointer ${agreed ? 'bg-brand-yellow border-brand-yellow' : 'border-white/20 group-hover:border-white/40'}`}
              >
                {agreed && <span className="text-black text-xs font-black">✓</span>}
              </div>
              <span className="text-xs text-neutral-500 leading-relaxed">
                I agree to the{' '}
                <a href="#" className="text-brand-yellow hover:underline">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-brand-yellow hover:underline">Privacy Policy</a>
              </span>
            </label>

            <button
              type="submit"
              disabled={isLoading || googleLoading}
              className="w-full bg-brand-yellow text-black font-black py-4 rounded-xl hover:bg-yellow-300 active:scale-[0.98] transition-all shadow-[0_8px_30px_rgba(255,215,0,0.2)] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center mt-1"
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <p className="text-center text-sm text-neutral-600 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-brand-yellow hover:text-yellow-300 transition-colors">
              Sign in →
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}