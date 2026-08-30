import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  User,
  Building2,
  Phone,
  MapPin,
  Heart,
  Navigation,
  ShieldCheck,
  Loader2,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const RegisterPage = () => {
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [role, setRole] = useState('donor'); // 'donor' | 'hospital'
  const [loading, setLoading] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);

  const [donorForm, setDonorForm] = useState({
    fullName: '',
    mobileNumber: '+1',
    bloodGroup: 'O+',
    isAvailable: true,
    address: 'Downtown Medical District',
    lat: 37.7749,
    lng: -122.4194
  });

  const [hospitalForm, setHospitalForm] = useState({
    hospitalName: '',
    contactPerson: '',
    mobileNumber: '+1',
    address: 'Metropolitan Hospital Wing',
    licenseNumber: `HOSP-${Math.floor(10000 + Math.random() * 90000)}`,
    lat: 37.7558,
    lng: -122.4048
  });

  // Browser Geolocation auto-detection
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      toast.warning('Geolocation is not supported by your browser.');
      return;
    }

    setDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        if (role === 'donor') {
          setDonorForm((prev) => ({ ...prev, lat: latitude, lng: longitude }));
        } else {
          setHospitalForm((prev) => ({ ...prev, lat: latitude, lng: longitude }));
        }
        toast.success(`📍 GPS Location detected: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        setDetectingLocation(false);
      },
      (err) => {
        toast.warning('Unable to retrieve location. Using default coordinates.');
        setDetectingLocation(false);
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (role === 'donor') {
        await register({
          role: 'donor',
          fullName: donorForm.fullName,
          mobileNumber: donorForm.mobileNumber,
          bloodGroup: donorForm.bloodGroup,
          isAvailable: donorForm.isAvailable,
          address: donorForm.address,
          location: {
            lat: Number(donorForm.lat),
            lng: Number(donorForm.lng),
            city: 'San Francisco'
          }
        });
        navigate('/donor/dashboard');
      } else {
        await register({
          role: 'hospital',
          hospitalName: hospitalForm.hospitalName,
          contactPerson: hospitalForm.contactPerson,
          mobileNumber: hospitalForm.mobileNumber,
          address: hospitalForm.address,
          licenseNumber: hospitalForm.licenseNumber,
          location: {
            lat: Number(hospitalForm.lat),
            lng: Number(hospitalForm.lng),
            city: 'San Francisco'
          }
        });
        navigate('/hospital/dashboard');
      }
    } catch (err) {
      // toast shown by auth context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl space-y-6">
        
        {/* Title */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-display font-bold text-white">Join BloodBridge</h1>
          <p className="text-sm text-slate-400">
            Register to respond to emergency requests or dispatch alerts
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 gap-3 p-1.5 rounded-2xl bg-slate-900 border border-slate-800">
          <button
            type="button"
            onClick={() => setRole('donor')}
            className={`py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
              role === 'donor'
                ? 'bg-gradient-to-r from-crimson-600 to-rose-600 text-white shadow-lg shadow-crimson-950/50'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <User className="w-4 h-4" />
            Volunteer Donor
          </button>
          <button
            type="button"
            onClick={() => setRole('hospital')}
            className={`py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
              role === 'hospital'
                ? 'bg-gradient-to-r from-indigo-600 to-rose-600 text-white shadow-lg shadow-indigo-950/50'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Building2 className="w-4 h-4" />
            Hospital / Clinic
          </button>
        </div>

        {/* Registration Form */}
        <div className="glass-panel p-8 rounded-3xl border border-slate-800 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {role === 'donor' ? (
              <>
                {/* Donor Name & Mobile */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={donorForm.fullName}
                      onChange={(e) => setDonorForm({ ...donorForm, fullName: e.target.value })}
                      placeholder="e.g. Rajesh Kumar"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-rose-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Mobile Number *
                    </label>
                    <input
                      type="text"
                      value={donorForm.mobileNumber}
                      onChange={(e) => setDonorForm({ ...donorForm, mobileNumber: e.target.value })}
                      placeholder="+919876543210"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-sm focus:outline-none focus:border-rose-500"
                      required
                    />
                  </div>
                </div>

                {/* Blood Group & Availability */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Blood Group *
                    </label>
                    <select
                      value={donorForm.bloodGroup}
                      onChange={(e) => setDonorForm({ ...donorForm, bloodGroup: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono font-bold text-sm focus:outline-none focus:border-rose-500"
                    >
                      {BLOOD_GROUPS.map((bg) => (
                        <option key={bg} value={bg}>
                          {bg} {bg === 'O-' ? '(Universal Red Cell Donor)' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Initial Availability
                    </label>
                    <button
                      type="button"
                      onClick={() => setDonorForm({ ...donorForm, isAvailable: !donorForm.isAvailable })}
                      className={`w-full py-2.5 rounded-xl border text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                        donorForm.isAvailable
                          ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
                          : 'bg-slate-900 border-slate-700 text-slate-400'
                      }`}
                    >
                      <span className={`w-2.5 h-2.5 rounded-full ${donorForm.isAvailable ? 'bg-emerald-400' : 'bg-slate-500'}`}></span>
                      {donorForm.isAvailable ? 'Ready for Emergency Calls' : 'Currently Unavailable'}
                    </button>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Neighborhood / Address *
                  </label>
                  <input
                    type="text"
                    value={donorForm.address}
                    onChange={(e) => setDonorForm({ ...donorForm, address: e.target.value })}
                    placeholder="e.g. 452 Pine St, Downtown"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-rose-500"
                    required
                  />
                </div>
              </>
            ) : (
              <>
                {/* Hospital Name & License */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Hospital / Trauma Center Name *
                    </label>
                    <input
                      type="text"
                      value={hospitalForm.hospitalName}
                      onChange={(e) => setHospitalForm({ ...hospitalForm, hospitalName: e.target.value })}
                      placeholder="e.g. St. Jude General Hospital"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Contact Person / Title *
                    </label>
                    <input
                      type="text"
                      value={hospitalForm.contactPerson}
                      onChange={(e) => setHospitalForm({ ...hospitalForm, contactPerson: e.target.value })}
                      placeholder="e.g. Dr. Arthur Vance (Chief of ER)"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500"
                      required
                    />
                  </div>
                </div>

                {/* Mobile & License */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Emergency Dispatch Mobile *
                    </label>
                    <input
                      type="text"
                      value={hospitalForm.mobileNumber}
                      onChange={(e) => setHospitalForm({ ...hospitalForm, mobileNumber: e.target.value })}
                      placeholder="+911234567890"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-sm focus:outline-none focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Medical License Number
                    </label>
                    <input
                      type="text"
                      value={hospitalForm.licenseNumber}
                      onChange={(e) => setHospitalForm({ ...hospitalForm, licenseNumber: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Hospital Campus Address *
                  </label>
                  <input
                    type="text"
                    value={hospitalForm.address}
                    onChange={(e) => setHospitalForm({ ...hospitalForm, address: e.target.value })}
                    placeholder="e.g. 1001 Potrero Ave, SF General Campus"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
              </>
            )}

            {/* GPS Coordinates & Auto-detect */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-rose-400" />
                  Geospatial Radar Coordinates
                </span>
                <button
                  type="button"
                  onClick={handleDetectLocation}
                  disabled={detectingLocation}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-rose-400 text-xs font-semibold border border-slate-700 flex items-center gap-1 transition-all"
                >
                  <Navigation className="w-3 h-3" />
                  {detectingLocation ? 'Detecting...' : 'Auto-Detect GPS'}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-slate-400">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    value={role === 'donor' ? donorForm.lat : hospitalForm.lat}
                    onChange={(e) => {
                      if (role === 'donor') setDonorForm({ ...donorForm, lat: e.target.value });
                      else setHospitalForm({ ...hospitalForm, lat: e.target.value });
                    }}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-xs font-mono mt-1"
                  />
                </div>
                <div>
                  <label className="text-slate-400">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    value={role === 'donor' ? donorForm.lng : hospitalForm.lng}
                    onChange={(e) => {
                      if (role === 'donor') setDonorForm({ ...donorForm, lng: e.target.value });
                      else setHospitalForm({ ...hospitalForm, lng: e.target.value });
                    }}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-xs font-mono mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-crimson-600 to-rose-600 hover:from-crimson-500 hover:to-rose-500 text-white font-bold text-sm shadow-xl shadow-crimson-900/50 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Registering Account...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  Complete Registration <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-800 text-center">
            <p className="text-xs text-slate-400">
              Already registered?{' '}
              <Link to="/login" className="text-rose-400 font-bold hover:underline">
                Sign In with Mobile OTP
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
