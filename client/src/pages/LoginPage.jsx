import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Phone, KeyRound, ArrowRight, ShieldCheck, HeartHandshake, Loader2, Sparkles, Building2, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const LoginPage = () => {
  const { sendOtp, verifyOtp, quickLogin } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: Enter Mobile, 2: Enter OTP
  const [mobileNumber, setMobileNumber] = useState('+919876543210');
  const [otp, setOtp] = useState('');
  const [testOtpNotice, setTestOtpNotice] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!mobileNumber.trim()) {
      toast.warning('Please enter a valid mobile number.');
      return;
    }

    setLoading(true);
    try {
      const res = await sendOtp(mobileNumber);
      if (res.testOtp) {
        setTestOtpNotice(`Demo OTP Code: ${res.testOtp} (or master 123456)`);
        setOtp(res.testOtp);
      }
      setStep(2);
    } catch (err) {
      // toast shown by auth context
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp.trim()) {
      toast.warning('Please enter the OTP code received.');
      return;
    }

    setLoading(true);
    try {
      const res = await verifyOtp(mobileNumber, otp);
      if (res.success) {
        if (res.user?.role === 'hospital') {
          navigate('/hospital/dashboard');
        } else {
          navigate('/donor/dashboard');
        }
      }
    } catch (err) {
      // toast shown by context
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (role) => {
    setLoading(true);
    try {
      await quickLogin(role);
      if (role === 'hospital') {
        navigate('/hospital/dashboard');
      } else {
        navigate('/donor/dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-crimson-600 to-rose-600 p-0.5 shadow-xl shadow-crimson-900/40 mx-auto">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <HeartHandshake className="w-6 h-6 text-crimson-500" />
            </div>
          </div>
          <h1 className="text-2xl font-display font-bold text-white">Sign In to BloodBridge</h1>
          <p className="text-xs text-slate-400">Secure OTP-based mobile authentication</p>
        </div>

        {/* Quick Demo Switcher Card */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
            <span className="flex items-center gap-1.5 text-amber-400">
              <Sparkles className="w-4 h-4" /> 1-Click Reviewer Access:
            </span>
            <span className="text-[11px] text-slate-400">Pre-seeded accounts</span>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => handleQuickDemo('donor')}
              disabled={loading}
              className="px-3 py-2.5 rounded-xl bg-slate-900 hover:bg-rose-950 border border-slate-800 hover:border-rose-500/50 text-rose-300 text-xs font-bold transition-all flex items-center justify-center gap-2"
            >
              <User className="w-4 h-4" />
              Donor Account
            </button>
            <button
              onClick={() => handleQuickDemo('hospital')}
              disabled={loading}
              className="px-3 py-2.5 rounded-xl bg-slate-900 hover:bg-indigo-950 border border-slate-800 hover:border-indigo-500/50 text-indigo-300 text-xs font-bold transition-all flex items-center justify-center gap-2"
            >
              <Building2 className="w-4 h-4" />
              Hospital Account
            </button>
          </div>
        </div>

        {/* OTP Login Form */}
        <div className="glass-panel p-8 rounded-3xl border border-slate-800 shadow-2xl">
          {step === 1 ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Mobile Number (with Country Code)
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="+919876543210"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-sm focus:outline-none focus:border-rose-500"
                    required
                  />
                </div>

              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-crimson-600 to-rose-600 hover:from-crimson-500 hover:to-rose-500 text-white font-bold text-sm shadow-lg shadow-crimson-900/50 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  <>
                    Send Verification OTP <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Enter 6-Digit OTP Code
                  </label>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs text-rose-400 hover:underline"
                  >
                    Change Number
                  </button>
                </div>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    maxLength="6"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="123456"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-center text-lg tracking-widest focus:outline-none focus:border-rose-500"
                    required
                  />
                </div>
                {testOtpNotice && (
                  <p className="text-xs text-emerald-400 mt-2 font-mono bg-emerald-950/40 p-2 rounded-lg border border-emerald-800/40 text-center">
                    {testOtpNotice}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-crimson-600 to-rose-600 hover:from-crimson-500 hover:to-rose-500 text-white font-bold text-sm shadow-lg shadow-crimson-900/50 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    Verify & Sign In
                  </>
                )}
              </button>
            </form>
          )}

          <div className="mt-6 pt-6 border-t border-slate-800 text-center">
            <p className="text-xs text-slate-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-rose-400 font-bold hover:underline">
                Register as Donor or Hospital
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
