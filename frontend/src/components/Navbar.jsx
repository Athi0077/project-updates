import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, Calendar, Search, Clock } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  // If on admin route, AdminNav is already shown on those pages
  if (isAdminRoute) return null;

  const handleOpenBookModal = () => {
    window.dispatchEvent(new CustomEvent('open-book-modal'));
  };

  const handleOpenStatusModal = () => {
    window.dispatchEvent(new CustomEvent('open-status-modal'));
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-teal-500 to-emerald-400 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-base sm:text-lg text-white tracking-tight">
                Azhaghiri Tech & Studio
              </span>
              <span className="text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Open Now
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Shop & Web Services • Direct Appointment Booking
            </p>
          </div>
        </Link>

        {/* User Navigation & Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Check Status Button */}
          <button
            onClick={handleOpenStatusModal}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-850 rounded-xl border border-slate-800 transition-colors"
            title="Check appointment status with mobile number"
          >
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">My Appointment Status</span>
            <span className="sm:hidden">Status</span>
          </button>

          {/* Book Now Button */}
          <button
            onClick={handleOpenBookModal}
            className="flex items-center space-x-1.5 px-4 py-1.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 rounded-xl shadow-md shadow-cyan-500/20 transition-all hover:scale-105"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Book Now</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
