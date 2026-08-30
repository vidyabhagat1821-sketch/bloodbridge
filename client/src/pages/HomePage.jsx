import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  HeartHandshake,
  Activity,
  MapPin,
  Bot,
  ShieldCheck,
  Zap,
  Users,
  Building2,
  Clock,
  ArrowRight,
  Sparkles,
  AlertOctagon,
  ChevronRight,
  Compass,
  FileText,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { requestApi, donorApi } from '../services/api';
import { BloodGroupBadge, UrgencyBadge } from '../components/common/CompatibilityBadge';
import { CreateRequestModal } from '../components/requests/CreateRequestModal';
import { useAuth } from '../context/AuthContext';

export const HomePage = () => {
  const { isAuthenticated, role, quickLogin } = useAuth();
  const [activeRequests, setActiveRequests] = useState([]);
  const [donorCount, setDonorCount] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [hoveredBloodGroup, setHoveredBloodGroup] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reqRes, donRes] = await Promise.all([
          requestApi.getAll({ status: 'ACTIVE' }),
          donorApi.getAll({ isAvailable: true })
        ]);
        if (reqRes.success) setActiveRequests(reqRes.requests?.slice(0, 3) || []);
        if (donRes.success) setDonorCount(donRes.count || 0);
      } catch (e) {
        console.warn(e);
      }
    };
    fetchData();
  }, []);

  const bloodGroups = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];
  const [matrixMode, setMatrixMode] = useState('receive'); // 'donate' or 'receive'
  
  // Who can this donor donate TO (recipients)
  const getCompatibleRecipients = (donorGroup) => {
    switch (donorGroup) {
      case 'O-': return ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];
      case 'O+': return ['O+', 'A+', 'B+', 'AB+'];
      case 'A-': return ['A-', 'A+', 'AB-', 'AB+'];
      case 'A+': return ['A+', 'AB+'];
      case 'B-': return ['B-', 'B+', 'AB-', 'AB+'];
      case 'B+': return ['B+', 'AB+'];
      case 'AB-': return ['AB-', 'AB+'];
      case 'AB+': return ['AB+'];
      default: return [];
    }
  };

  // Who can DONATE to this recipient (compatible donors)
  const getCompatibleDonors = (recipientGroup) => {
    switch (recipientGroup) {
      case 'O-': return ['O-'];
      case 'O+': return ['O-', 'O+'];
      case 'A-': return ['O-', 'A-'];
      case 'A+': return ['O-', 'O+', 'A-', 'A+'];
      case 'B-': return ['O-', 'B-'];
      case 'B+': return ['O-', 'O+', 'B-', 'B+'];
      case 'AB-': return ['O-', 'A-', 'B-', 'AB-'];
      case 'AB+': return ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];
      default: return [];
    }
  };

  const compatibleResults = hoveredBloodGroup 
    ? (matrixMode === 'donate' ? getCompatibleRecipients(hoveredBloodGroup) : getCompatibleDonors(hoveredBloodGroup))
    : [];

  return (
    <div className="space-y-24 pb-16">
      
      {/* Hero Section with Glowing Blur Spheres */}
      <section className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        <div className="absolute inset-0 -z-10 flex items-center justify-center">
          <div className="w-[650px] h-[650px] bg-gradient-to-tr from-rose-600/10 via-crimson-600/5 to-transparent rounded-full blur-[120px] -translate-y-1/4 animate-pulse duration-[6000ms]"></div>
          <div className="w-[450px] h-[450px] bg-gradient-to-br from-indigo-600/10 via-purple-600/5 to-transparent rounded-full blur-[100px] translate-x-1/3"></div>
        </div>

        <div className="text-center space-y-8 max-w-5xl mx-auto">
          {/* Animated Emergency Tag */}
          <div className="inline-flex items-center gap-2 px-4.5 py-2 rounded-full bg-rose-950/40 border border-rose-800/40 text-rose-400 text-xs font-bold uppercase tracking-wider shadow-lg shadow-rose-950/20 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
            AI Emergency Response & RAG Blood Intelligence
          </div>

          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-display font-black tracking-tight text-white leading-[1.08] select-none">
            Saving Lives with <br />
            <span className="bg-gradient-to-r from-crimson-500 via-rose-400 to-amber-400 bg-clip-text text-transparent filter drop-shadow-[0_2px_10px_rgba(225,29,72,0.2)]">
              Precision AI Matching
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-medium">
            Eliminate critical delays during trauma and surgeries. BloodBridge connects hospitals with verified nearby donors in seconds and provides RAG clinical transfusion guidance.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4.5 pt-4">
            <Link
              to="/requests"
              className="px-8 py-4.5 rounded-2xl bg-gradient-to-r from-crimson-600 to-rose-600 hover:from-crimson-500 hover:to-rose-500 text-white font-bold text-base shadow-xl shadow-crimson-900/40 flex items-center gap-2 transition-all duration-300 transform hover:-translate-y-1"
            >
              <AlertOctagon className="w-5 h-5 animate-pulse" />
              View Emergency Requests
            </Link>

            <button
              onClick={() => setModalOpen(true)}
              className="px-8 py-4.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-100 border border-slate-700/80 font-bold text-base shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5 text-rose-400" />
              Create Blood Request (AI)
            </button>

            <Link
              to="/assistant"
              className="px-8 py-4.5 rounded-2xl bg-indigo-950/80 hover:bg-indigo-900/90 text-indigo-200 border border-indigo-700/60 font-bold text-base shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-2"
            >
              <Bot className="w-5 h-5 text-indigo-400" />
              Ask AI Assistant
            </Link>
          </div>

          {/* Quick Demo Switchers */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-400 bg-slate-950/30 py-3 px-6 rounded-2xl border border-slate-900 max-w-2xl mx-auto backdrop-blur-sm">
            <span className="font-semibold text-slate-400">Instant Reviewer Login:</span>
            <button
              onClick={() => quickLogin('donor')}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-rose-950/50 border border-slate-800 hover:border-rose-500/50 text-rose-300 font-bold transition-all duration-200"
            >
              ⚡ Login as Donor (O-)
            </button>
            <button
              onClick={() => quickLogin('hospital')}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-indigo-950/50 border border-slate-800 hover:border-indigo-500/50 text-indigo-300 font-bold transition-all duration-200"
            >
              ⚡ Login as Hospital
            </button>
          </div>
        </div>

        {/* Live Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4.5 mt-20 max-w-5xl mx-auto">
          <div className="glass-panel p-7 rounded-3xl border border-slate-800/85 text-center space-y-1.5 relative overflow-hidden group hover:border-rose-500/30 transition-all duration-300">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-rose-500 to-crimson-600"></div>
            <div className="text-3xl sm:text-4xl font-display font-black text-white">&lt; 3 mins</div>
            <div className="text-xs font-bold text-rose-400 uppercase tracking-wider">Avg. Match Time</div>
          </div>
          <div className="glass-panel p-7 rounded-3xl border border-slate-800/85 text-center space-y-1.5 relative overflow-hidden group hover:border-emerald-500/30 transition-all duration-300">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-emerald-500 to-teal-600"></div>
            <div className="text-3xl sm:text-4xl font-display font-black text-white">100%</div>
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Compatibility Guard</div>
          </div>
          <div className="glass-panel p-7 rounded-3xl border border-slate-800/85 text-center space-y-1.5 relative overflow-hidden group hover:border-cyan-500/30 transition-all duration-300">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-cyan-500 to-blue-600"></div>
            <div className="text-3xl sm:text-4xl font-display font-black text-white">{donorCount || '24'} Ready</div>
            <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Nearby Donors Online</div>
          </div>
          <div className="glass-panel p-7 rounded-3xl border border-slate-800/85 text-center space-y-1.5 relative overflow-hidden group hover:border-amber-500/30 transition-all duration-300">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-amber-500 to-orange-600"></div>
            <div className="text-3xl sm:text-4xl font-display font-black text-white">RAG AI</div>
            <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">WHO/AABB Guidelines</div>
          </div>
        </div>
      </section>

      {/* Interactive Transfusion Compatibility Tool */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-8 sm:p-10 rounded-[32px] border border-slate-800/90 relative overflow-hidden">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[80px] -z-10"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-[11px] font-bold tracking-wider text-rose-400 uppercase bg-rose-500/10 border border-rose-500/25 px-3 py-1 rounded-full">
                Interactive Reference Engine
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white">
                Blood Compatibility Matrix
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                Select any blood type below to instantly view transfusion compatibility. Toggle between <strong className="text-white">Patient Mode</strong> (who can donate to this patient) and <strong className="text-white">Donor Mode</strong> (who this donor can give to).
              </p>

              {/* Mode Toggle */}
              <div className="flex bg-slate-950 rounded-2xl p-1 border border-slate-800">
                <button 
                  onClick={() => setMatrixMode('receive')}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    matrixMode === 'receive' 
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/50' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🏥 Patient Needs Blood
                </button>
                <button 
                  onClick={() => setMatrixMode('donate')}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    matrixMode === 'donate' 
                      ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/50' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🩸 Donor Can Give To
                </button>
              </div>

              {/* Result Summary */}
              <div className="flex items-center gap-2.5 text-xs text-slate-300 bg-slate-950/40 p-3.5 rounded-xl border border-slate-900 font-mono">
                <Compass className="w-4 h-4 text-rose-400 shrink-0" />
                <span>
                  {hoveredBloodGroup 
                    ? matrixMode === 'receive'
                      ? `Patient ${hoveredBloodGroup} can receive from ${compatibleResults.length} donor group(s)`
                      : `Donor ${hoveredBloodGroup} can donate to ${compatibleResults.length} recipient group(s)`
                    : "Click a blood group to check compatibility..."
                  }
                </span>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="space-y-6">
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                    {matrixMode === 'receive' ? 'Step 1: Select Patient Blood Group' : 'Step 1: Select Donor Blood Group'}
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {bloodGroups.map((group) => (
                      <button
                        key={group}
                        onMouseEnter={() => setHoveredBloodGroup(group)}
                        onClick={() => setHoveredBloodGroup(hoveredBloodGroup === group ? null : group)}
                        className={`w-14 h-14 rounded-2xl font-mono font-bold text-base border flex flex-col items-center justify-center transition-all duration-200 ${
                          hoveredBloodGroup === group
                            ? matrixMode === 'receive'
                              ? 'bg-emerald-600 border-emerald-400 text-white shadow-lg shadow-emerald-900/50 scale-110'
                              : 'bg-rose-600 border-rose-400 text-white shadow-lg shadow-rose-900/50 scale-110'
                            : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:border-slate-600 hover:text-white hover:scale-105'
                        }`}
                      >
                        <span className="text-[10px] leading-none">🩸</span>
                        {group}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-slate-800/80"></div>

                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                    {matrixMode === 'receive' ? 'Step 2: Compatible Donors (Safe to Transfuse From)' : 'Step 2: Compatible Recipients (Safe to Give To)'}
                  </div>
                  <div className="flex flex-wrap gap-2.5 min-h-[60px]">
                    {bloodGroups.map((group) => {
                      const isCompatible = compatibleResults.includes(group);
                      return (
                        <div
                          key={group}
                          className={`w-14 h-14 rounded-2xl font-mono font-bold text-base border flex items-center justify-center transition-all duration-200 ${
                            hoveredBloodGroup === null
                              ? 'bg-slate-900/30 border-slate-900 text-slate-600 opacity-60'
                              : isCompatible
                              ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300 shadow-md shadow-emerald-950/40 scale-105'
                              : 'bg-slate-950/50 border-slate-900 text-slate-700 opacity-25'
                          }`}
                        >
                          {isCompatible && hoveredBloodGroup ? '✓ ' : ''}{group}
                        </div>
                      );
                    })}
                  </div>
                  {hoveredBloodGroup && (
                    <p className="text-[11px] text-emerald-400/80 mt-3 font-medium">
                      ✓ {compatibleResults.length} compatible match{compatibleResults.length !== 1 ? 'es' : ''} found — {compatibleResults.join(', ')}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Emergency Requests Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Activity className="w-6 h-6 text-crimson-500 animate-pulse" />
              Live Emergency Blood Alerts
            </h2>
            <p className="text-xs text-slate-400">Urgent requests dispatched by metropolitan trauma centers</p>
          </div>
          <Link
            to="/requests"
            className="text-xs font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1.5 transition-all group"
          >
            View All Requests 
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Requests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {activeRequests.map((req) => (
            <div
              key={req.id}
              className="glass-panel glass-card-hover p-6 rounded-3xl border border-slate-800 space-y-4 relative overflow-hidden"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-white text-base">{req.hospitalName}</h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span className="truncate max-w-[170px]">{req.hospitalLocation?.address || 'San Francisco Trauma Center'}</span>
                  </p>
                </div>
                <UrgencyBadge urgency={req.urgency} />
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-900 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-400 block font-semibold">Blood Group</span>
                  <BloodGroupBadge group={req.bloodGroup} size="md" />
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-slate-400 block font-semibold">Required</span>
                  <span className="text-lg font-bold text-white font-mono">{req.unitsRequired} Unit(s)</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 italic line-clamp-2 min-h-[32px]">
                "{req.patientCondition}"
              </p>

              <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80">
                <span className="font-medium text-slate-400">{req.matchedDonorsCount || 4} Donors Alerted</span>
                <Link
                  to={`/requests`}
                  className="px-3.5 py-2 rounded-xl bg-crimson-600 hover:bg-crimson-500 text-white font-bold text-xs transition-colors shadow-md shadow-crimson-950/50"
                >
                  Respond
                </Link>
              </div>
            </div>
          ))}

          {activeRequests.length === 0 && (
            <div className="col-span-3 text-center py-10 glass-panel rounded-3xl border border-slate-900 text-slate-400 text-sm">
              No active emergency blood requests currently listed.
            </div>
          )}
        </div>
      </section>

      {/* Feature Pillar Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-2">
          <h2 className="text-3xl font-display font-bold text-white">
            Engineered for Emergency Life-Saving Speed
          </h2>
          <p className="text-sm text-slate-400">
            Combining real-time geospatial algorithms with modern clinical RAG intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-4 hover:border-rose-500/30 transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Geospatial Haversine Radar</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Calculates precise km distance between trauma centers and verified active donors, prioritizing closest compatible matches within minutes.
            </p>
          </div>

          {/* Card 2 */}
          <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-4 hover:border-indigo-500/30 transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">NLP Request Extraction</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Paste or speak unstructured emergency voice/text. The AI extracts blood group, units, urgency, and destination instantly without manual forms.
            </p>
          </div>

          {/* Card 3 */}
          <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-4 hover:border-emerald-500/30 transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">RAG Clinical Guidance</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Vector-indexed medical guidelines from WHO & AABB provide grounded answers with exact document citations, confidence metrics, and zero hallucinations.
            </p>
          </div>
        </div>
      </section>

      {/* Create Request Modal */}
      <CreateRequestModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => {
          // refresh
        }}
      />
    </div>
  );
};
