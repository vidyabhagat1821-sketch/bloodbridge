import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  HeartHandshake,
  Activity,
  MapPin,
  Bot,
  Bell,
  User,
  LogOut,
  LogIn,
  PlusCircle,
  Menu,
  X,
  Sparkles,
  BookOpen,
  Building2,
  Users
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';

export const Navbar = () => {
  const { user, profile, role, isAuthenticated, logout, quickLogin } = useAuth();
  const { unreadCount } = useNotifications();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-crimson-600 via-rose-600 to-amber-500 p-0.5 shadow-lg shadow-crimson-900/30 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <HeartHandshake className="w-5 h-5 text-crimson-500 group-hover:text-crimson-400 transition-colors" />
              </div>
            </div>
            <div>
              <span className="font-display font-bold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-rose-400 bg-clip-text text-transparent">
                Blood<span className="text-crimson-500">Bridge</span>
              </span>
              <span className="block text-[10px] font-semibold uppercase tracking-wider text-rose-400/80 -mt-1">
                AI Emergency Matching
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                isActive('/')
                  ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              Home
            </Link>

            {isAuthenticated && role === 'donor' && (
              <Link
                to="/donor/dashboard"
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                  isActive('/donor/dashboard')
                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Activity className="w-4 h-4 text-crimson-400" />
                Donor Dashboard
              </Link>
            )}

            {isAuthenticated && role === 'hospital' && (
              <Link
                to="/hospital/dashboard"
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                  isActive('/hospital/dashboard')
                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Building2 className="w-4 h-4 text-rose-400" />
                Hospital Dashboard
              </Link>
            )}

            <Link
              to="/requests"
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                isActive('/requests')
                  ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Activity className="w-4 h-4 text-rose-500" />
              Emergency Requests
            </Link>

            <Link
              to="/map"
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                isActive('/map')
                  ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <MapPin className="w-4 h-4 text-emerald-400" />
              Live Radar Map
            </Link>

            <Link
              to="/assistant"
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                isActive('/assistant')
                  ? 'bg-gradient-to-r from-rose-600/20 to-indigo-600/20 text-rose-300 border border-rose-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Bot className="w-4 h-4 text-indigo-400" />
              RAG AI Assistant
            </Link>

            <Link
              to="/knowledge-admin"
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                isActive('/knowledge-admin')
                  ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              Knowledge Base
            </Link>
          </nav>

          {/* Right Action Menu & Auth */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {/* Notifications Bell */}
                <Link
                  to="/notifications"
                  className="relative p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-crimson-600 text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </Link>

                {/* Profile Pill */}
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-sm transition-all"
                >
                  <div className="w-6 h-6 rounded-full bg-crimson-900/60 text-rose-400 flex items-center justify-center font-bold text-xs">
                    {profile?.fullName ? profile.fullName.charAt(0) : (profile?.hospitalName ? 'H' : 'U')}
                  </div>
                  <span className="font-medium text-slate-200 max-w-[120px] truncate">
                    {profile?.fullName || profile?.hospitalName || user?.mobileNumber}
                  </span>
                  <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    {role}
                  </span>
                </Link>

                <button
                  onClick={logout}
                  className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800/60 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                {/* Fast Demo Switchers */}
                <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-slate-800 text-xs">
                  <span className="text-[11px] text-slate-400 px-1 font-semibold flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" /> Demo:
                  </span>
                  <button
                    onClick={() => quickLogin('donor')}
                    className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-300 hover:text-rose-300 font-medium transition-all text-xs"
                  >
                    Donor
                  </button>
                  <button
                    onClick={() => quickLogin('hospital')}
                    className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-indigo-950 text-slate-300 hover:text-indigo-300 font-medium transition-all text-xs"
                  >
                    Hospital
                  </button>
                </div>

                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-200 hover:text-white hover:bg-slate-900 border border-slate-800 transition-all flex items-center gap-1.5"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-crimson-600 to-rose-600 hover:from-crimson-500 hover:to-rose-500 text-white shadow-lg shadow-crimson-900/40 transition-all"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            {isAuthenticated && (
              <Link to="/notifications" className="relative p-2 text-slate-300">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-crimson-600 text-[9px] font-bold text-white flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950/95 px-4 pt-2 pb-6 space-y-2">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
          >
            Home
          </Link>
          {isAuthenticated && role === 'donor' && (
            <Link
              to="/donor/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
            >
              Donor Dashboard
            </Link>
          )}
          {isAuthenticated && role === 'hospital' && (
            <Link
              to="/hospital/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
            >
              Hospital Dashboard
            </Link>
          )}
          <Link
            to="/requests"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
          >
            Emergency Requests
          </Link>
          <Link
            to="/map"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
          >
            Live Radar Map
          </Link>
          <Link
            to="/assistant"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
          >
            RAG AI Assistant
          </Link>
          <Link
            to="/knowledge-admin"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
          >
            Knowledge Base
          </Link>

          {isAuthenticated ? (
            <div className="pt-4 border-t border-slate-800 space-y-2">
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-slate-200"
              >
                <User className="w-5 h-5 text-rose-400" />
                Profile ({role})
              </Link>
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-rose-400 font-medium flex items-center gap-2"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          ) : (
            <div className="pt-4 border-t border-slate-800 space-y-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 font-semibold"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center py-2.5 rounded-xl bg-crimson-600 text-white font-semibold"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
