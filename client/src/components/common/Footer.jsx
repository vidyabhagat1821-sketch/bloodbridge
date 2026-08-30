import React from 'react';
import { HeartHandshake, ShieldCheck, Cpu, Zap, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/60 backdrop-blur-lg mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-crimson-600 flex items-center justify-center">
                <HeartHandshake className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-lg text-white">
                Blood<span className="text-crimson-500">Bridge</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Real-time emergency blood donor matching powered by geospatial proximity algorithms and RAG clinical intelligence.
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1 text-emerald-400">
                <ShieldCheck className="w-4 h-4" /> HIPAA & AABB Compliant
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Platform</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/requests" className="hover:text-rose-400 transition-colors">Emergency Blood Requests</Link></li>
              <li><Link to="/map" className="hover:text-rose-400 transition-colors">Geospatial Donor Radar</Link></li>
              <li><Link to="/assistant" className="hover:text-rose-400 transition-colors">AI Blood Clinical Assistant</Link></li>
              <li><Link to="/knowledge-admin" className="hover:text-rose-400 transition-colors">Knowledge Base Docs</Link></li>
            </ul>
          </div>

          {/* Portals */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Access Portals</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/login" className="hover:text-rose-400 transition-colors">Hospital Dispatch Login</Link></li>
              <li><Link to="/register" className="hover:text-rose-400 transition-colors">Volunteer Donor Registration</Link></li>
              <li><Link to="/donor/dashboard" className="hover:text-rose-400 transition-colors">Donor Availability Center</Link></li>
              <li><Link to="/hospital/dashboard" className="hover:text-rose-400 transition-colors">Trauma Center Dashboard</Link></li>
            </ul>
          </div>

          {/* Emergency Protocols */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Emergency Transfusion</h4>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-1.5">
              <div className="font-semibold text-rose-400 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" /> Universal O- Donor Protocol
              </div>
              <p className="text-slate-400">
                In acute exsanguination trauma resuscitations, uncrossmatched O- packed red blood cells can be transfused universally.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800/60 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} BloodBridge AI. Designed for Life-Saving Emergency Care.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Built with precision for emergency medicine</span>
            <Heart className="w-3.5 h-3.5 text-crimson-500 fill-crimson-500 mx-1" />
          </div>
        </div>
      </div>
    </footer>
  );
};
