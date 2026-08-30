import React, { useState, useEffect } from 'react';
import {
  Building2,
  PlusCircle,
  Activity,
  MapPin,
  Users,
  Clock,
  CheckCircle2,
  AlertOctagon,
  Sparkles,
  Phone,
  Radio,
  Navigation,
  Trash2,
  Check
} from 'lucide-react';
import { requestApi, donorApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { BloodGroupBadge, UrgencyBadge } from '../components/common/CompatibilityBadge';
import { CreateRequestModal } from '../components/requests/CreateRequestModal';
import { BloodMap } from '../components/map/BloodMap';
import { SkeletonLoader } from '../components/common/SkeletonLoader';
import { EmptyState } from '../components/common/EmptyState';

export const HospitalDashboard = () => {
  const { profile } = useAuth();
  const toast = useToast();

  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [reqRes, donorRes] = await Promise.all([
        requestApi.getAll({ hospitalId: profile?.id }),
        donorApi.getAll({ isAvailable: true })
      ]);

      if (reqRes.success) {
        setRequests(reqRes.requests || []);
        if (reqRes.requests?.length > 0 && !selectedRequest) {
          setSelectedRequest(reqRes.requests[0]);
        }
      }
      if (donorRes.success) {
        setDonors(donorRes.donors || []);
      }
    } catch (err) {
      toast.error('Failed to load hospital dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [profile]);

  const handleCompleteRequest = async (id) => {
    try {
      const res = await requestApi.complete(id);
      if (res.success) {
        toast.success('Emergency blood request marked as FULFILLED!');
        fetchDashboardData();
      }
    } catch (err) {
      toast.error(err.message || 'Error updating request.');
    }
  };

  const handleDeleteRequest = async (id) => {
    if (!window.confirm('Are you sure you want to remove this emergency request?')) return;
    try {
      const res = await requestApi.delete(id);
      if (res.success) {
        toast.info('Request removed.');
        fetchDashboardData();
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Hospital Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 via-rose-600 to-amber-500 p-0.5 shadow-xl shadow-indigo-950/50">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Building2 className="w-8 h-8 text-rose-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white">
                {profile?.hospitalName || 'Metropolitan Trauma Center'}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-bold">
                Hospital Command
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              {profile?.address || 'San Francisco, CA'} • {profile?.licenseNumber || 'Verified Facility'}
            </p>
          </div>
        </div>

        {/* Create Request Action Button */}
        <button
          onClick={() => setModalOpen(true)}
          className="w-full md:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-crimson-600 to-rose-600 hover:from-crimson-500 hover:to-rose-500 text-white font-bold text-sm shadow-xl shadow-crimson-900/50 flex items-center justify-center gap-2 transition-all hover:scale-105"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          Create Emergency Request (AI)
        </button>
      </div>

      {/* Main Grid: Active Requests + Live Radar Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Active Requests List (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-crimson-500" />
              Hospital Active Requests ({requests.length})
            </h2>
            <button
              onClick={fetchDashboardData}
              className="text-xs text-rose-400 font-semibold hover:underline"
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <SkeletonLoader count={3} />
          ) : requests.length === 0 ? (
            <EmptyState
              title="No Active Requests"
              description="Your hospital currently has no active emergency blood requests."
              actionLabel="Create Blood Request"
              onAction={() => setModalOpen(true)}
            />
          ) : (
            <div className="space-y-3">
              {requests.map((req) => {
                const isSelected = selectedRequest?.id === req.id;
                const acceptedResponses = req.responses?.filter((r) => r.status === 'ACCEPTED') || [];

                return (
                  <div
                    key={req.id}
                    onClick={() => setSelectedRequest(req)}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-slate-900/90 border-rose-500/50 shadow-xl shadow-rose-950/20'
                        : 'glass-panel border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <BloodGroupBadge group={req.bloodGroup} size="sm" />
                        <span className="font-bold text-white text-sm">
                          {req.unitsRequired} Unit(s) Needed
                        </span>
                      </div>
                      <UrgencyBadge urgency={req.urgency} />
                    </div>

                    <p className="text-xs text-slate-300 mt-2 line-clamp-1 italic">
                      "{req.patientCondition}"
                    </p>

                    <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                      <span className="flex items-center gap-1 text-emerald-400 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {acceptedResponses.length} Donor(s) Accepted
                      </span>

                      <div className="flex items-center gap-2">
                        {req.status !== 'FULFILLED' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCompleteRequest(req.id);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-emerald-950 border border-emerald-800 text-emerald-300 hover:bg-emerald-900 text-[11px] font-bold"
                          >
                            Mark Fulfilled
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteRequest(req.id);
                          }}
                          className="p-1 rounded-lg text-slate-500 hover:text-rose-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Selected Request Live Radar & Matching Donors (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {selectedRequest ? (
            <>
              {/* Selected Request Detail Panel */}
              <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400">
                      Selected Request Proximity Radar
                    </span>
                    <h3 className="text-xl font-bold text-white">
                      {selectedRequest.unitsRequired} Unit(s) {selectedRequest.bloodGroup} ({selectedRequest.urgency})
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {selectedRequest.hospitalLocation?.address || profile?.address}
                    </p>
                  </div>
                  <BloodGroupBadge group={selectedRequest.bloodGroup} size="md" />
                </div>

                {/* Interactive Proximity Map */}
                <div className="rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
                  <BloodMap
                    activeHospital={profile}
                    hospitals={[profile]}
                    donors={donors}
                    highlightRadiusKm={15}
                    height="340px"
                  />
                </div>

                {/* Donor Responses Tracker */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-emerald-400" />
                    Donor Response Tracker
                  </h4>

                  {selectedRequest.responses && selectedRequest.responses.length > 0 ? (
                    <div className="space-y-2">
                      {selectedRequest.responses.map((resp, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <BloodGroupBadge group={resp.bloodGroup} size="sm" />
                            <div>
                              <div className="font-bold text-white">{resp.donorName}</div>
                              <div className="text-[11px] text-slate-400 flex items-center gap-1">
                                <Phone className="w-3 h-3 text-slate-500" />
                                {resp.donorMobile || '+919876543210'}
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                              resp.status === 'ACCEPTED'
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                : 'bg-slate-800 text-slate-400'
                            }`}>
                              {resp.status} (ETA: {resp.etaMinutes || 20}m)
                            </span>
                            <div className="text-[10px] text-slate-500 mt-0.5">
                              {new Date(resp.respondedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 text-center text-xs text-slate-400">
                      📡 Alerts sent to nearby matching donors. Awaiting incoming donor acceptances...
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="glass-panel p-12 rounded-3xl text-center border border-slate-800 text-slate-400">
              Select or create a blood request on the left to view geospatial radar and response status.
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <CreateRequestModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => {
          fetchDashboardData();
        }}
      />
    </div>
  );
};
