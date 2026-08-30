import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Building2,
  Users,
  Navigation,
  Filter,
  Phone,
  ShieldCheck,
  Radio,
  Search
} from 'lucide-react';
import { donorApi, hospitalApi } from '../services/api';
import { BloodMap } from '../components/map/BloodMap';
import { BloodGroupBadge } from '../components/common/CompatibilityBadge';
import { SkeletonLoader } from '../components/common/SkeletonLoader';

export const InteractiveMapPage = () => {
  const [donors, setDonors] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [radiusKm, setRadiusKm] = useState(25);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [filterBloodGroup, setFilterBloodGroup] = useState('ALL');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [donRes, hospRes] = await Promise.all([
          donorApi.getAll(),
          hospitalApi.getAll()
        ]);
        if (donRes.success) setDonors(donRes.donors || []);
        if (hospRes.success) {
          setHospitals(hospRes.hospitals || []);
          if (hospRes.hospitals?.length > 0) {
            setSelectedHospital(hospRes.hospitals[0]);
          }
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredDonors = donors.filter((d) => {
    if (filterBloodGroup !== 'ALL' && d.bloodGroup !== filterBloodGroup) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white flex items-center gap-2.5">
            <Radio className="w-8 h-8 text-rose-500 animate-pulse" />
            Live Geospatial Donor Radar
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time proximity mapping between trauma centers and registered blood donors
          </p>
        </div>

        {/* Radius Controls */}
        <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 text-xs">
          <span className="text-slate-400 font-semibold px-2">Radar Radius:</span>
          {[5, 15, 25, 50].map((r) => (
            <button
              key={r}
              onClick={() => setRadiusKm(r)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                radiusKm === r
                  ? 'bg-crimson-600 text-white shadow-md shadow-crimson-900/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {r} km
            </button>
          ))}
        </div>
      </div>

      {/* Grid: Map (8 cols) + Nearby Donors Sidebar (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Radar Map */}
        <div className="lg:col-span-8 space-y-4">
          <BloodMap
            activeHospital={selectedHospital}
            hospitals={hospitals}
            donors={filteredDonors}
            highlightRadiusKm={radiusKm}
            height="620px"
          />

          {/* Hospital Selector Pills */}
          <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center gap-3 overflow-x-auto text-xs">
            <span className="text-slate-400 font-semibold shrink-0 flex items-center gap-1">
              <Building2 className="w-4 h-4 text-rose-400" /> Focus Center:
            </span>
            {hospitals.map((hosp) => (
              <button
                key={hosp.id}
                onClick={() => setSelectedHospital(hosp)}
                className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all shrink-0 ${
                  selectedHospital?.id === hosp.id
                    ? 'bg-gradient-to-r from-crimson-600 to-rose-600 text-white shadow-lg shadow-crimson-950/40'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {hosp.hospitalName}
              </button>
            ))}
          </div>
        </div>

        {/* Sidebar: Donors in Sector */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-400" />
                Donors in Sector ({filteredDonors.length})
              </h3>
              <span className="text-xs text-emerald-400 font-semibold">
                ● Live GPS
              </span>
            </div>

            {/* Blood group filter */}
            <select
              value={filterBloodGroup}
              onChange={(e) => setFilterBloodGroup(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-slate-200"
            >
              <option value="ALL">All Blood Groups</option>
              <option value="O-">O- (Universal)</option>
              <option value="O+">O+</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </select>

            {/* Donor List */}
            {loading ? (
              <SkeletonLoader count={3} />
            ) : (
              <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
                {filteredDonors.map((donor) => (
                  <div
                    key={donor.id}
                    className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800/80 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-white">{donor.fullName}</div>
                      <BloodGroupBadge group={donor.bloodGroup} size="sm" />
                    </div>

                    <p className="text-slate-400 flex items-center gap-1 text-[11px]">
                      <MapPin className="w-3 h-3 text-rose-400" />
                      {donor.address || 'San Francisco, CA'}
                    </p>

                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        donor.isAvailable
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {donor.isAvailable ? '● Available' : '○ Busy'}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {donor.totalDonations || 3} donations
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
