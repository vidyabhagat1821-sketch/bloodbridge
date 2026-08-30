import React, { useState, useEffect } from 'react';
import {
  Activity,
  Filter,
  PlusCircle,
  MapPin,
  Clock,
  CheckCircle2,
  Users,
  Search,
  AlertOctagon,
  Sparkles
} from 'lucide-react';
import { requestApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { BloodGroupBadge, UrgencyBadge } from '../components/common/CompatibilityBadge';
import { CreateRequestModal } from '../components/requests/CreateRequestModal';
import { SkeletonLoader } from '../components/common/SkeletonLoader';
import { EmptyState } from '../components/common/EmptyState';

const BLOOD_GROUPS = ['ALL', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const EmergencyRequestsPage = () => {
  const { user, profile, isAuthenticated } = useAuth();
  const toast = useToast();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('ALL');
  const [selectedUrgency, setSelectedUrgency] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedBloodGroup !== 'ALL') params.bloodGroup = selectedBloodGroup;
      const res = await requestApi.getAll(params);
      if (res.success) {
        setRequests(res.requests || []);
      }
    } catch (err) {
      toast.error('Failed to load blood requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [selectedBloodGroup]);

  const filteredRequests = requests.filter((req) => {
    if (selectedUrgency !== 'ALL' && req.urgency !== selectedUrgency) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        req.hospitalName?.toLowerCase().includes(q) ||
        req.patientCondition?.toLowerCase().includes(q) ||
        req.bloodGroup?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white flex items-center gap-2.5">
            <AlertOctagon className="w-8 h-8 text-crimson-500 animate-pulse" />
            Emergency Blood Requests
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Active real-time transfusion requirements from trauma centers & hospitals
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-crimson-600 to-rose-600 hover:from-crimson-500 hover:to-rose-500 text-white font-bold text-sm shadow-xl shadow-crimson-900/50 flex items-center justify-center gap-2 transition-all self-start md:self-auto"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          Create Emergency Request
        </button>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          
          {/* Search Box */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by hospital, condition, or notes..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500"
            />
          </div>

          {/* Urgency Filter */}
          <select
            value={selectedUrgency}
            onChange={(e) => setSelectedUrgency(e.target.value)}
            className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-slate-300 focus:outline-none focus:border-rose-500"
          >
            <option value="ALL">All Urgency Levels</option>
            <option value="CRITICAL">CRITICAL STAT</option>
            <option value="URGENT">URGENT</option>
            <option value="NORMAL">STANDARD</option>
          </select>
        </div>

        {/* Blood Group Quick Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-1 no-scrollbar text-xs">
          <span className="text-slate-400 font-semibold shrink-0">Blood Group:</span>
          {BLOOD_GROUPS.map((bg) => (
            <button
              key={bg}
              onClick={() => setSelectedBloodGroup(bg)}
              className={`px-3 py-1 rounded-lg font-mono font-bold transition-all shrink-0 ${
                selectedBloodGroup === bg
                  ? 'bg-crimson-600 text-white shadow-md shadow-crimson-900/50'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {bg}
            </button>
          ))}
        </div>
      </div>

      {/* Requests Grid */}
      {loading ? (
        <SkeletonLoader count={3} />
      ) : filteredRequests.length === 0 ? (
        <EmptyState
          title="No Matching Blood Requests"
          description="Try adjusting your blood group or urgency filter to see other active emergencies."
          actionLabel="Clear Filters"
          onAction={() => {
            setSelectedBloodGroup('ALL');
            setSelectedUrgency('ALL');
            setSearchQuery('');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRequests.map((req) => (
            <div
              key={req.id}
              className={`glass-panel glass-card-hover p-6 rounded-3xl border flex flex-col justify-between space-y-4 relative ${
                req.urgency === 'CRITICAL'
                  ? 'border-crimson-500/40 shadow-xl shadow-crimson-950/20'
                  : 'border-slate-800'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-white text-base leading-tight">
                      {req.hospitalName}
                    </h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <span className="truncate max-w-[200px]">{req.hospitalLocation?.address || 'San Francisco, CA'}</span>
                    </p>
                  </div>
                  <UrgencyBadge urgency={req.urgency} />
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase block">Required Blood</span>
                    <BloodGroupBadge group={req.bloodGroup} size="md" />
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase block">Units Needed</span>
                    <span className="text-lg font-bold text-white font-mono">{req.unitsRequired} Unit(s)</span>
                  </div>
                </div>

                <div className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 italic">
                  "{req.patientCondition}"
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1 text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  {new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className="text-emerald-400 font-bold">
                  {req.matchedDonorsCount || 4} Donors Matched
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <CreateRequestModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => fetchRequests()}
      />
    </div>
  );
};
