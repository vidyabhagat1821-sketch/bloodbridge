import React, { useState } from 'react';
import {
  X,
  Sparkles,
  AlertOctagon,
  Building2,
  MapPin,
  FileText,
  Loader2,
  CheckCircle2,
  Wand2
} from 'lucide-react';
import { aiApi, requestApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const CreateRequestModal = ({ isOpen, onClose, onSuccess }) => {
  const { profile } = useAuth();
  const toast = useToast();

  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiParsing, setIsAiParsing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    bloodGroup: 'O-',
    unitsRequired: 2,
    urgency: 'CRITICAL',
    hospitalName: profile?.hospitalName || 'St. Jude Trauma Center',
    address: profile?.address || '1001 Potrero Ave, SF General Campus',
    lat: profile?.location?.lat || 37.7558,
    lng: profile?.location?.lng || -122.4048,
    patientCondition: 'Acute Hemorrhage / Emergency Trauma',
    description: ''
  });

  if (!isOpen) return null;

  const handleAiParse = async () => {
    if (!aiPrompt.trim()) {
      toast.warning('Please enter a natural language request text first.');
      return;
    }

    setIsAiParsing(true);
    try {
      const res = await aiApi.parseBloodRequest(aiPrompt);
      if (res.success && res.extracted) {
        const ext = res.extracted;
        setFormData((prev) => ({
          ...prev,
          bloodGroup: ext.bloodGroup || prev.bloodGroup,
          unitsRequired: ext.unitsRequired || prev.unitsRequired,
          urgency: ext.urgency || prev.urgency,
          hospitalName: ext.hospitalName || prev.hospitalName,
          patientCondition: ext.patientCondition || prev.patientCondition,
          description: ext.extractedSummary || prev.description
        }));
        toast.success(`✨ AI parsed request: ${ext.unitsRequired} units of ${ext.bloodGroup} (${ext.urgency})`);
      }
    } catch (err) {
      toast.error(err.message || 'AI parsing error');
    } finally {
      setIsAiParsing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        hospitalId: profile?.id || 'hosp_default',
        hospitalName: formData.hospitalName,
        hospitalLocation: {
          lat: Number(formData.lat),
          lng: Number(formData.lng),
          address: formData.address
        },
        bloodGroup: formData.bloodGroup,
        unitsRequired: Number(formData.unitsRequired),
        urgency: formData.urgency,
        patientCondition: formData.patientCondition,
        description: formData.description
      };

      const res = await requestApi.create(payload);
      if (res.success) {
        toast.success(`🚨 Emergency Request published! ${res.request?.matchedDonorsCount || 0} nearby donors alerted.`);
        if (onSuccess) onSuccess(res.request);
        onClose();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to publish emergency blood request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 animate-fade-in my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-crimson-600/20 border border-crimson-500/30 flex items-center justify-center text-crimson-400">
              <AlertOctagon className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Create Emergency Blood Request</h2>
              <p className="text-xs text-slate-400">Instantly match and broadcast alerts to verified nearby donors</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* AI Natural Language Input Helper Box */}
        <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-rose-950/40 via-indigo-950/40 to-slate-900 border border-rose-500/20">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-rose-300 flex items-center gap-1.5 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-rose-400" />
              AI Natural-Language Request Assistant
            </label>
            <span className="text-[11px] text-slate-400">Type or paste emergency details</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="e.g. 'Urgently need 3 units of O- blood at General Hospital for trauma surgery'"
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500"
            />
            <button
              type="button"
              onClick={handleAiParse}
              disabled={isAiParsing}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-crimson-600 to-indigo-600 hover:from-crimson-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shrink-0 disabled:opacity-50"
            >
              {isAiParsing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Parsing...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  Extract with AI
                </>
              )}
            </button>
          </div>
        </div>

        {/* Structured Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Blood Group & Units */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Required Blood Group *
              </label>
              <select
                value={formData.bloodGroup}
                onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono font-bold text-sm focus:outline-none focus:border-crimson-500"
              >
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg}>
                    {bg} {bg === 'O-' ? '(Universal Donor)' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Units Required (Bags/Pints) *
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={formData.unitsRequired}
                onChange={(e) => setFormData({ ...formData, unitsRequired: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-crimson-500"
                required
              />
            </div>
          </div>

          {/* Urgency & Patient Condition */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Urgency Level *
              </label>
              <select
                value={formData.urgency}
                onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border text-sm font-bold focus:outline-none ${
                  formData.urgency === 'CRITICAL'
                    ? 'border-crimson-500 text-rose-400'
                    : formData.urgency === 'URGENT'
                    ? 'border-amber-500 text-amber-400'
                    : 'border-emerald-500 text-emerald-400'
                }`}
              >
                <option value="CRITICAL">CRITICAL STAT (Immediate / Trauma)</option>
                <option value="URGENT">URGENT (&lt; 2-4 Hours)</option>
                <option value="NORMAL">STANDARD / Scheduled Surgery</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Clinical Condition / Procedure *
              </label>
              <input
                type="text"
                value={formData.patientCondition}
                onChange={(e) => setFormData({ ...formData, patientCondition: e.target.value })}
                placeholder="e.g. ICU Trauma, Cardiac Surgery"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-crimson-500"
                required
              />
            </div>
          </div>

          {/* Hospital Name & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Hospital / Facility Name *
              </label>
              <input
                type="text"
                value={formData.hospitalName}
                onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-crimson-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Hospital Address / Wing *
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-crimson-500"
                required
              />
            </div>
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
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs mt-1"
              />
            </div>
            <div>
              <label className="text-slate-400">GPS Longitude</label>
              <input
                type="number"
                step="any"
                value={formData.lng}
                onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs mt-1"
              />
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Additional Dispatch Instructions (Optional)
            </label>
            <textarea
              rows="2"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="e.g. Please report directly to Blood Bank Counter, 2nd Floor"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-crimson-500"
            ></textarea>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-crimson-600 to-rose-600 hover:from-crimson-500 hover:to-rose-500 text-white text-sm font-bold shadow-lg shadow-crimson-900/50 flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Broadcasting Emergency Alert...
                </>
              ) : (
                <>
                  <AlertOctagon className="w-4 h-4" />
                  Dispatch Emergency Request
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
