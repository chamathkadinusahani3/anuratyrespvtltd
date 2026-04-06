import React, { useState } from 'react';
import { Eye, EyeOff, ArrowLeft, Mail, Lock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
  sendEmailVerification,
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import logo from '../assets/logo.png';

const TYRE_TAGLINES = [
  'Your trusted tyre partner since 1983.',
  'Premium tyres. Expert hands. Zero compromise.',
  "Built for Sri Lanka's roads. Built to last.",
  "From Pannipitiya to Ratnapura — we've got you covered."
];

// ── Reusable inline field-error ───────────────────────────────────────────────
function FieldError({ message }: { message?: string }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.p
          initial={{ opacity: 0, y: -4, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          exit={{ opacity: 0, y: -4, height: 0 }}
          transition={{ duration: 0.18 }}
          className="flex items-center gap-1.5 text-xs text-red-400 mt-1.5 overflow-hidden"
        >
          <AlertCircle className="w-3 h-3 flex-shrink-0" />
          {message}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

// ── Forgot Password Modal ─────────────────────────────────────────────────────
function ForgotPasswordModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [emailError, setEmailError] = useState('');

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { setEmailError('Please enter your email address.'); return; }
    setLoading(true);
    setEmailError('');
    try {
      await sendPasswordResetEmail(auth, email, {
        url: window.location.origin + '/login',
        handleCodeInApp: false,
      });
      setSent(true);
    } catch (err: any) {
      const map: Record<string, string> = {
        'auth/user-not-found':         'No account found with this email.',
        'auth/invalid-email':           'Please enter a valid email address.',
        'auth/too-many-requests':       'Too many attempts. Please wait before trying again.',
        'auth/network-request-failed':  'Network error. Please check your connection.',
      };
      setEmailError(map[err.code] || 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 20 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        className="bg-neutral-900 border border-white/10 rounded-2xl p-8 w-full max-w-[400px] shadow-2xl"
      >
        {!sent ? (
          <>
            <div className="mb-6">
              <div className="w-10 h-10 rounded-full bg-brand-yellow/10 border border-brand-yellow/20 flex items-center justify-center mb-4">
                <Mail className="w-5 h-5 text-brand-yellow" />
              </div>
              <h3 className="text-xl font-black text-white">Reset your password</h3>
              <p className="text-neutral-500 text-sm mt-1">
                Enter the email linked to your account. We'll send you a secure reset link.
              </p>
            </div>

            <form onSubmit={handleReset} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1.5 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => { setEmailError(''); setEmail(e.target.value); }}
                    placeholder="you@example.com"
                    autoFocus
                    className={`w-full bg-neutral-800 border rounded-xl pl-11 pr-4 py-3.5 text-white text-sm placeholder-neutral-700 focus:outline-none focus:ring-1 transition-all
                      ${emailError ? 'border-red-500/60 focus:border-red-400 focus:ring-red-400/20' : 'border-white/10 focus:border-brand-yellow focus:ring-brand-yellow/30'}`}
                  />
                </div>
                <FieldError message={emailError} />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-yellow text-black font-black py-3.5 rounded-xl hover:bg-yellow-300 active:scale-[0.98] transition-all flex items-center justify-center disabled:opacity-60"
              >
                {loading ? <span className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" /> : 'Send Reset Link'}
              </button>

              <button type="button" onClick={onClose} className="w-full py-2.5 text-sm text-neutral-500 hover:text-neutral-300 transition-colors">
                Cancel
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="w-14 h-14 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 className="w-7 h-7 text-green-400" />
            </div>
            <h3 className="text-xl font-black text-white mb-2">Check your inbox</h3>
            <p className="text-neutral-500 text-sm mb-1">We've sent a password reset link to:</p>
            <p className="text-brand-yellow font-semibold text-sm mb-6">{email}</p>
            <p className="text-neutral-600 text-xs mb-6">Didn't receive it? Check your spam folder or wait a minute and try again.</p>
            <button onClick={onClose} className="w-full bg-white/5 border border-white/10 text-white font-semibold py-3 rounded-xl hover:bg-white/10 transition-all text-sm">
              Back to Sign In
            </button>
            <button onClick={() => { setSent(false); setEmail(''); }} className="w-full py-2.5 text-xs text-neutral-600 hover:text-neutral-400 transition-colors mt-1">
              Use a different email
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

// ── Login Page ────────────────────────────────────────────────────────────────
type LoginFieldErrors = { email?: string; password?: string; form?: string };

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<LoginFieldErrors>({});
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [taglineIdx] = useState(() => Math.floor(Math.random() * TYRE_TAGLINES.length));
  const [resendingVerification, setResendingVerification] = useState(false);
  const [verificationResent, setVerificationResent] = useState(false);

  const clearErr = (key: keyof LoginFieldErrors) =>
    setFieldErrors(prev => ({ ...prev, [key]: undefined }));

  const parseFirebaseError = (code: string): LoginFieldErrors => {
    const map: Record<string, LoginFieldErrors> = {
      'auth/user-not-found':         { email:    'No account found with this email. Did you mean to register?' },
      'auth/wrong-password':         { password: 'Incorrect password. Please try again.' },
      'auth/invalid-email':          { email:    'Please enter a valid email address.' },
      'auth/invalid-credential':     { email:    'Invalid email or password. Please check your details.' },
      'auth/too-many-requests':      { form:     'Too many attempts. Please try again in a few minutes.' },
      'auth/popup-closed-by-user':   { form:     'Google sign-in was cancelled.' },
      'auth/network-request-failed': { form:     'Network error. Please check your connection.' },
    };
    return map[code] ?? { form: 'Something went wrong. Please try again.' };
  };

  const validate = (): LoginFieldErrors => {
    const errs: LoginFieldErrors = {};
    if (!email)    errs.email    = 'Email address is required.';
    else if (!email.includes('@')) errs.email = 'Please enter a valid email address.';
    if (!password) errs.password = 'Password is required.';
    return errs;
  };

  // Re-signs in briefly just to get the user object, sends verification, then signs out
  const handleResendVerification = async () => {
    setResendingVerification(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(cred.user, {
        url: `${window.location.origin}/dashboard`,
        handleCodeInApp: false,
      });
      await auth.signOut();
      setVerificationResent(true);
    } catch {
      // silently fail — user can try again
    } finally {
      setResendingVerification(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setFieldErrors(errs); return; }

    setIsLoading(true);
    setFieldErrors({});
    setVerificationResent(false);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);

      // ── GATE: block unverified email/password accounts ────────────────────
      if (!cred.user.emailVerified) {
        await auth.signOut(); // sign them back out immediately
        setFieldErrors({ form: 'EMAIL_NOT_VERIFIED' }); // special sentinel
        return;
      }

      navigate('/dashboard');
    } catch (err: any) {
      setFieldErrors(parseFirebaseError(err.code));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setFieldErrors({});
    try {
      // Google accounts are always pre-verified — safe to go straight to dashboard
      await signInWithPopup(auth, googleProvider);
      navigate('/dashboard');
    } catch (err: any) {
      setFieldErrors(parseFirebaseError(err.code));
    } finally {
      setGoogleLoading(false);
    }
  };

  const isVerificationError = fieldErrors.form === 'EMAIL_NOT_VERIFIED';

  return (
    <>
      <AnimatePresence>
        {showForgotModal && <ForgotPasswordModal onClose={() => setShowForgotModal(false)} />}
      </AnimatePresence>

      <div className="min-h-screen flex bg-neutral-950 text-white overflow-hidden">

        {/* ── Left Panel ── */}
        <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden flex-col items-center justify-center p-16 bg-black">
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `repeating-linear-gradient(45deg, #FFD700 0px, #FFD700 1px, transparent 0px, transparent 50%)`, backgroundSize: '20px 20px' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-brand-yellow/5 blur-[100px]" />
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-brand-red to-transparent" />
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: 'easeOut' }} className="relative z-10 text-center max-w-sm">
            <Link to="/" className="flex-shrink-0 flex items-center gap-3 mb-2">
              <img src={logo} alt="Anura Tyres Logo" className="h-12 w-auto object-contain" />
              <div className="flex flex-col leading-none">
                <span className="text-brand-white font-bold text-lg">ANURA TYRES</span>
              </div>
            </Link>
            <p className="text-neutral-500 text-xs uppercase tracking-[0.3em] mb-10">(Pvt) Ltd · Est. 1983</p>
            <p className="text-neutral-300 text-lg leading-relaxed font-light italic">"{TYRE_TAGLINES[taglineIdx]}"</p>
            <div className="flex flex-wrap justify-center gap-2 mt-10">
              {['Pannipitiya', 'Ratnapura', 'Kalawana', 'Nivithigala'].map(b => (
                <span key={b} className="px-3 py-1 rounded-full text-xs border border-white/10 text-neutral-500 bg-white/5">{b}</span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Right Panel ── */}
        <div className="w-full lg:w-[55%] flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-12 relative">
          <Link to="/" className="absolute top-6 left-6 flex items-center gap-2 text-sm text-neutral-500 hover:text-brand-yellow transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-[400px] mx-auto"
          >
            <div className="mb-8">
              <div className="w-8 h-1 bg-brand-yellow rounded mb-4" />
              <h2 className="text-3xl font-black text-white tracking-tight">Welcome back</h2>
              <p className="text-neutral-500 mt-1 text-sm">Sign in to manage your vehicles & bookings</p>
            </div>

            {/* ── Email not verified banner ─────────────────────────────────── */}
            <AnimatePresence>
              {isVerificationError && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-5 overflow-hidden"
                >
                  <div className="px-4 py-4 rounded-xl bg-amber-500/10 border border-amber-500/25 text-sm">
                    <div className="flex items-start gap-3 mb-3">
                      <Mail className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-amber-300 font-semibold">Email not verified</p>
                        <p className="text-amber-400/70 text-xs mt-0.5">
                          Please click the verification link sent to{' '}
                          <span className="text-amber-300">{email}</span> before signing in.
                        </p>
                      </div>
                    </div>
                    {verificationResent ? (
                      <div className="flex items-center gap-2 text-xs text-green-400 bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2">
                        <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                        Verification email resent — check your inbox.
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendVerification}
                        disabled={resendingVerification}
                        className="w-full text-xs text-amber-400 hover:text-amber-300 border border-amber-500/20 hover:border-amber-500/40 rounded-lg px-3 py-2 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {resendingVerification
                          ? <><span className="w-3 h-3 border border-amber-400/40 border-t-amber-400 rounded-full animate-spin" /> Sending...</>
                          : 'Resend verification email'
                        }
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Top-level errors (network, cancelled popup, etc.) */}
            <AnimatePresence>
              {fieldErrors.form && !isVerificationError && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-5 flex items-start gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-sm overflow-hidden"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{fieldErrors.form}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Google */}
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading || googleLoading}
              className="w-full flex items-center justify-center gap-3 bg-white text-neutral-900 font-bold py-3.5 rounded-xl hover:bg-neutral-100 active:scale-[0.98] transition-all mb-6 disabled:opacity-60 shadow-sm"
            >
              {googleLoading ? (
                <span className="w-5 h-5 border-2 border-neutral-300 border-t-neutral-700 rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              )}
              <span>Continue with Google</span>
            </button>

            <div className="relative flex items-center mb-6">
              <div className="flex-1 h-px bg-white/10" />
              <span className="mx-4 text-xs text-neutral-600 uppercase tracking-widest">or email</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <form onSubmit={handleLogin} className="space-y-4" autoComplete="off">

              {/* ── Email ── */}
              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1.5 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => { clearErr('email'); setEmail(e.target.value); }}
                    placeholder="you@example.com"
                    autoComplete="off"
                    className={`w-full bg-neutral-900 border rounded-xl pl-11 pr-4 py-3.5 text-white text-sm placeholder-neutral-700 focus:outline-none focus:ring-1 transition-all
                      ${fieldErrors.email ? 'border-red-500/60 focus:border-red-400 focus:ring-red-400/20' : 'border-white/10 focus:border-brand-yellow focus:ring-brand-yellow/30'}`}
                  />
                </div>
                <FieldError message={fieldErrors.email} />
              </div>

              {/* ── Password ── */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Password</label>
                  <button type="button" onClick={() => setShowForgotModal(true)} className="text-xs text-brand-yellow hover:text-yellow-300 transition-colors">
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => { clearErr('password'); setPassword(e.target.value); }}
                    placeholder="••••••••"
                    style={{ textTransform: 'none' }}
                    autoComplete="new-password"
                    className={`w-full bg-neutral-900 border rounded-xl pl-11 pr-12 py-3.5 text-white text-sm placeholder-neutral-700 focus:outline-none focus:ring-1 transition-all
                      ${fieldErrors.password ? 'border-red-500/60 focus:border-red-400 focus:ring-red-400/20' : 'border-white/10 focus:border-brand-yellow focus:ring-brand-yellow/30'}`}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-white transition-colors">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <FieldError message={fieldErrors.password} />
              </div>

              <button
                type="submit"
                disabled={isLoading || googleLoading}
                className="w-full bg-brand-yellow text-black font-black py-4 rounded-xl hover:bg-yellow-300 active:scale-[0.98] transition-all shadow-[0_8px_30px_rgba(255,215,0,0.2)] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center mt-2"
              >
                {isLoading ? <span className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" /> : 'Sign In'}
              </button>
            </form>

            <p className="text-center text-sm text-neutral-600 mt-8">
              Don't have an account?{' '}
              <Link to="/register" className="font-bold text-brand-yellow hover:text-yellow-300 transition-colors">Create one free →</Link>
            </p>

            <div className="mt-6 pt-6 border-t border-white/5 flex flex-col sm:flex-row gap-2 text-xs text-center">
              <Link to="/corporate/register" className="flex-1 py-2.5 rounded-lg border border-white/10 text-neutral-500 hover:border-brand-yellow/30 hover:text-brand-yellow transition-all">
                🏢 Corporate Registration
              </Link>
              <Link to="/employee/register" className="flex-1 py-2.5 rounded-lg border border-white/10 text-neutral-500 hover:border-brand-yellow/30 hover:text-brand-yellow transition-all">
                👤 Employee Discount
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}