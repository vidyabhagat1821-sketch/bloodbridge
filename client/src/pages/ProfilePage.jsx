import React, { useState } from 'react';
import {
  User,
  Building2,
  Phone,
  MapPin,
  Heart,
  Save,
  ShieldCheck,
  Award,
  Navigation,
  Loader2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { BloodGroupBadge } from '../components/common/CompatibilityBadge';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const ProfilePage = () => {
  const { user, profile, role, updateProfile, updateAvailability } = useAuth();
  const toast = useToast();

  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    fullName: profile?.fullName || '',
    hospitalName: profile?.hospitalName || '',
    contactPerson: profile?.contactPerson || '',
    bloodGroup: profile?.bloodGroup || 'O+',
    address: profile?.address || 'San Francisco, CA',
    lat: profile?.location?.lat || 37.7749,
    lng: profile?.location?.lng || -122.4194
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...formData,
        location: {
          lat: Number(formData.lat),
          lng: Number(formData.lng),
          city: 'San Francisco'
        }
      };
      await updateProfile(payload);
    } catch (err) {
      // toast shown by auth context
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-crimson-600 to-rose-600 p-0.5 shadow-xl shadow-crimson-900/50">
          <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center font-display font-extrabold text-2xl text-rose-400">
            {role === 'donor' ? profile?.bloodGroup || 'O+' : '🏥'}
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white">
              {profile?.fullName || profile?.hospitalName || 'User Profile'}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold uppercase">
              {role}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Registered Mobile: <span className="font-mono text-slate-200">{user?.mobileNumber}</span>
          </p>
        </div>
      </div>

      {/* Profile Form */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {role === 'donor' ? (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-rose-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Blood Group
                </label>
                <select
                  value={formData.bloodGroup}
                  onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono font-bold text-sm focus:outline-none focus:border-rose-500"
                >
                  {BLOOD_GROUPS.map((bg) => (
                    <option key={bg} value={bg}>
                      {bg} {bg === 'O-' ? '(Universal Donor)' : ''}
                    </option>
                  ))}
                </select>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Hospital / Trauma Center Name
                </label>
                <input
                  type="text"
                  value={formData.hospitalName}
                  onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Contact Person / Dispatcher Title
                </label>
                <input
                  type="text"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Address / Campus Location
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-rose-500"
              required
            />
          </div>

          {/* Coordinates */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-slate-400">GPS Latitude</label>
              <input
                type="number"
                step="any"
                value={formData.lat}
                onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs font-mono mt-1"
              />
            </div>
            <div>
              <label className="text-slate-400">GPS Longitude</label>
              <input
                type="number"
                step="any"
                value={formData.lng}
                onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs font-mono mt-1"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-crimson-600 to-rose-600 hover:from-crimson-500 hover:to-rose-500 text-white font-bold text-sm shadow-xl shadow-crimson-900/50 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving Changes...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Profile Updates
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
