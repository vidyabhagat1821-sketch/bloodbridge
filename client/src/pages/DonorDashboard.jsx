import React, { useState, useEffect } from 'react';
import {
  Activity,
  Heart,
  Award,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  AlertOctagon,
  Bot,
  Loader2,
  Navigation,
  Sparkles,
  Phone
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { requestApi, notificationApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { BloodGroupBadge, UrgencyBadge } from '../components/common/CompatibilityBadge';
import { SkeletonLoader } from '../components/common/SkeletonLoader';
import { EmptyState } from '../components/common/EmptyState';
import { Link } from 'react-router-dom';

export const DonorDashboard = () => {
  const { profile, updateAvailability } = useAuth();
  const toast = useToast();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [respondingId, setRespondingId] = useState(null);
  const [etaInput, setEtaInput] = useState(25);

  const fetchEmergencyRequests = async () => {
    try {
      setLoading(true);
      const res = await requestApi.getAll({ status: 'ACTIVE' });
      if (res.success) {
        setRequests(res.requests || []);
      }
    } catch (err) {
      toast.error('Failed to load active emergency requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmergencyRequests();
  }, []);

  const handleRespond = async (requestId, status) => {
    setRespondingId(requestId);
    try {
      const res = await requestApi.respond(requestId, {
        donorId: profile?.id,
        status,
        etaMinutes: Number(etaInput)
      });
      if (res.success) {
        if (status === 'ACCEPTED') {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
          toast.success(`🎉 Thank you for saving a life! Hospital notified of your ${etaInput} min ETA.`);
        } else {
          toast.info('Response recorded.');
        }
        fetchEmergencyRequests();
      }
    } catch (err) {
      toast.error(err.message || 'Error recording response.');
    } finally {
      setRespondingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Donor Header & Availability Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-crimson-600 to-rose-600 p-0.5 shadow-xl shadow-crimson-900/50">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center font-display font-extrabold text-2xl text-rose-400">
              {profile?.bloodGroup || 'O+'}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white">{profile?.fullName || 'Volunteer Donor'}</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold">
                {profile?.badge || 'Lifesaver'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              {profile?.address || 'San Francisco, CA'} • Registered Blood Donor
            </p>
          </div>
        </div>

        {/* Live Availability Toggle */}
        <div className="flex items-center gap-3 bg-slate-900/90 p-3 rounded-2xl border border-slate-800 w-full md:w-auto justify-between">
          <div className="space-y-0.5">
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span className={`w-2.5 h-2.5 rounded-full ${profile?.isAvailable ? 'bg-emerald-500 animate-pulse' : 'bg-slate-500'}`}></span>
              {profile?.isAvailable ? 'AVAILABLE FOR EMERGENCIES' : 'CURRENTLY UNAVAILABLE'}
            </div>
            <p className="text-[11px] text-slate-400">
              {profile?.isAvailable ? 'Trauma centers can alert you' : 'Toggle on when ready to donate'}
            </p>
          </div>

          <button
            onClick={() => updateAvailability(!profile?.isAvailable)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              profile?.isAvailable
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/50'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            {profile?.isAvailable ? 'Set Busy' : 'Set Ready'}
          </button>
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Blood Group</span>
            <BloodGroupBadge group={profile?.bloodGroup || 'O-'} size="sm" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">{profile?.bloodGroup || 'O-'}</div>
          <div className="text-[11px] text-rose-400">Compatible with all red cell types</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Donations</span>
            <Heart className="w-4 h-4 text-crimson-400" />
          </div>
          <div className="text-2xl font-bold text-white">{profile?.totalDonations || 4} Times</div>
          <div className="text-[11px] text-emerald-400">Estimated ~12 lives impacted</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Eligibility Status</span>
            <Calendar className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl font-bold text-emerald-400">Eligible Now</div>
          <div className="text-[11px] text-slate-400">&gt; 56 days since last donation</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Donor Tier</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-bold text-amber-300">{profile?.badge || 'Gold Hero'}</div>
          <div className="text-[11px] text-amber-400">Top 5% Rapid Responder</div>
        </div>
      </div>

      {/* Active Emergency Blood Requests Feed */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <AlertOctagon className="w-5 h-5 text-crimson-500 animate-pulse" />
              Incoming Emergency Blood Requests
            </h2>
            <p className="text-xs text-slate-400">
              Live alerts matched with your blood group ({profile?.bloodGroup || 'O-'})
            </p>
          </div>
          <button
            onClick={fetchEmergencyRequests}
            className="text-xs font-semibold text-rose-400 hover:text-rose-300"
          >
            Refresh Alerts
          </button>
        </div>

        {loading ? (
          <SkeletonLoader count={2} />
        ) : requests.length === 0 ? (
          <EmptyState
            title="No Pending Emergency Requests"
            description="There are currently no active emergency requests matching your region and blood group."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {requests.map((req) => {
              const myResponse = req.responses?.find((r) => r.donorId === profile?.id);

              return (
                <div
                  key={req.id}
                  className={`glass-panel p-6 rounded-3xl border transition-all space-y-4 relative ${
                    req.urgency === 'CRITICAL'
                      ? 'border-crimson-500/40 shadow-xl shadow-crimson-950/20'
                      : 'border-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider block">
                        Emergency Blood Alert
                      </span>
                      <h3 className="text-lg font-bold text-white">{req.hospitalName}</h3>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-rose-400" />
                        {req.hospitalLocation?.address || 'San Francisco Trauma Center'}
                      </p>
                    </div>
                    <UrgencyBadge urgency={req.urgency} />
                  </div>

                  <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-slate-900/90 border border-slate-800">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold uppercase">Requested Group</span>
                      <BloodGroupBadge group={req.bloodGroup} size="sm" />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold uppercase">Quantity Needed</span>
                      <span className="text-sm font-bold text-white font-mono">{req.unitsRequired} Unit(s)</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 italic">
                    "{req.patientCondition}"
                  </p>

                  {/* Donor Action Area */}
                  <div className="pt-2 border-t border-slate-800/80">
                    {myResponse ? (
                      <div className={`p-3 rounded-xl flex items-center justify-between text-xs font-bold ${
                        myResponse.status === 'ACCEPTED'
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                          : 'bg-slate-900 text-slate-400 border border-slate-800'
                      }`}>
                        <span className="flex items-center gap-1.5">
                          {myResponse.status === 'ACCEPTED' ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <XCircle className="w-4 h-4 text-slate-400" />
                          )}
                          You {myResponse.status.toLowerCase()} this request (ETA: {myResponse.etaMinutes} mins)
                        </span>
                        <button
                          onClick={() => handleRespond(req.id, myResponse.status === 'ACCEPTED' ? 'DECLINED' : 'ACCEPTED')}
                          className="text-[11px] underline text-slate-300"
                        >
                          Change
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-xs text-slate-300">
                          <Clock className="w-4 h-4 text-amber-400" />
                          <span>Estimated Arrival Time (ETA):</span>
                          <select
                            value={etaInput}
                            onChange={(e) => setEtaInput(e.target.value)}
                            className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono text-xs"
                          >
                            <option value={15}>15 Minutes</option>
                            <option value={25}>25 Minutes</option>
                            <option value={40}>40 Minutes</option>
                            <option value={60}>1 Hour</option>
                          </select>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <button
                            onClick={() => handleRespond(req.id, 'ACCEPTED')}
                            disabled={respondingId === req.id}
                            className="py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
                          >
                            {respondingId === req.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <CheckCircle2 className="w-4 h-4" />
                            )}
                            Accept & Donate
                          </button>

                          <button
                            onClick={() => handleRespond(req.id, 'DECLINED')}
                            disabled={respondingId === req.id}
                            className="py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                          >
                            <XCircle className="w-4 h-4" />
                            Decline
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* RAG Assistant Shortcut Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-indigo-500/20 bg-gradient-to-r from-indigo-950/40 via-slate-900 to-rose-950/30 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm">Have clinical donation or health questions?</h4>
            <p className="text-xs text-slate-400">Ask BloodBridge AI for instant WHO/AABB health screening guidelines.</p>
          </div>
        </div>
        <Link
          to="/assistant"
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors"
        >
          Open AI Assistant
        </Link>
      </div>
    </div>
  );
};
