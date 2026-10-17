import React, { useState, useEffect } from 'react';
import {
  X,
  Search,
  Phone,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  MapPin,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { getMyBookingsApi } from '../services/api';

const BookingStatusModal = ({ isOpen, onClose }) => {
  const [mobile, setMobile] = useState('');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      const savedMobile = localStorage.getItem('user_last_mobile');
      if (savedMobile) {
        setMobile(savedMobile);
        fetchBookings(savedMobile);
      }
    }
  }, [isOpen]);

  const fetchBookings = async (searchMobile) => {
    const cleanMobile = (searchMobile || mobile).trim();
    if (!cleanMobile) {
      setError('Please enter your mobile number');
      return;
    }

    setLoading(true);
    setError('');
    setHasSearched(true);
    try {
      const res = await getMyBookingsApi(cleanMobile);
      if (res.data.success) {
        setBookings(res.data.data);
      } else {
        setBookings([]);
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError(err.response?.data?.message || 'Failed to fetch appointment status');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchBookings(mobile);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md p-4 sm:p-6">
      <div className="min-h-full flex items-center justify-center py-6 sm:py-8">
        <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Check Appointment Status</h3>
                <p className="text-xs text-slate-400">Check your appointment timing and status</p>
              </div>
            </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar by Mobile Number */}
        <div className="p-6 border-b border-slate-800/80 bg-slate-950/30">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="tel"
                required
                placeholder="Enter your 10-digit mobile number..."
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center space-x-1.5 disabled:opacity-50"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span>Search</span>
            </button>
          </form>

          {error && (
            <div className="mt-3 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Results Area */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
          {loading ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto text-cyan-400 mb-2" />
              Loading your appointment details...
            </div>
          ) : !hasSearched ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              Enter your mobile number above to view all appointments and confirmed shop visit timings.
            </div>
          ) : bookings.length === 0 ? (
            <div className="py-8 text-center bg-slate-950/40 rounded-2xl border border-slate-800 p-6">
              <AlertCircle className="w-8 h-8 text-slate-500 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-300">No Bookings Found</p>
              <p className="text-xs text-slate-500 mt-1">
                We couldn't find any booking requests with this mobile number: {mobile}
              </p>
            </div>
          ) : (
            bookings.map((b) => (
              <div
                key={b._id}
                className={`rounded-2xl border p-5 transition-all ${
                  b.status === 'confirmed'
                    ? 'bg-gradient-to-br from-emerald-950/30 via-slate-900 to-slate-900 border-emerald-500/40 shadow-lg shadow-emerald-500/5'
                    : b.status === 'completed'
                    ? 'bg-slate-900 border-slate-700'
                    : 'bg-slate-900 border-amber-500/30'
                }`}
              >
                {/* Top Status Banner */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-white text-sm">{b.service}</span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      (Token: {b._id.slice(-6).toUpperCase()})
                    </span>
                  </div>

                  <div>
                    {b.status === 'confirmed' && (
                      <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Confirmed by Admin</span>
                      </span>
                    )}
                    {b.status === 'pending' && (
                      <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Pending Admin Schedule</span>
                      </span>
                    )}
                    {b.status === 'completed' && (
                      <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Completed Visit</span>
                      </span>
                    )}
                    {b.status === 'cancelled' && (
                      <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        <X className="w-3.5 h-3.5" />
                        <span>Cancelled</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Main Body */}
                <div className="py-4 space-y-3">
                  {b.status === 'confirmed' ? (
                    <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 space-y-2">
                      <div className="flex items-center space-x-2 text-emerald-300 font-bold text-sm sm:text-base">
                        <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" />
                        <span>Admin has confirmed your appointment slot! (You can visit at this time)</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        <div className="flex items-center space-x-2 text-xs text-slate-200 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                          <Calendar className="w-4 h-4 text-emerald-400 shrink-0" />
                          <div>
                            <span className="text-slate-400 block text-[10px]">SCHEDULED DATE:</span>
                            <span className="font-bold text-white text-sm">{b.appointmentDate}</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 text-xs text-slate-200 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                          <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
                          <div>
                            <span className="text-slate-400 block text-[10px]">SCHEDULED TIME:</span>
                            <span className="font-bold text-cyan-300 text-sm">{b.appointmentTime}</span>
                          </div>
                        </div>
                      </div>

                      {b.adminNotes && (
                        <div className="text-xs text-slate-300 pt-1">
                          <span className="text-slate-400 font-semibold block">Admin Note:</span>
                          <p className="italic text-slate-200 mt-0.5">{b.adminNotes}</p>
                        </div>
                      )}

                      <div className="pt-2 border-t border-emerald-500/20 flex items-center space-x-2 text-xs text-emerald-200/90">
                        <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>
                          <strong>Shop Visit Address:</strong> Azhaghiri Tech Studio, Main Road, Chennai (Mon - Sat 9:30 AM - 8:30 PM)
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 space-y-1">
                      <p className="font-semibold text-amber-300 flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        Admin Reviewing Your Request
                      </p>
                      <p className="text-slate-300">
                        Admin will assign the visit date & time shortly. Once assigned, your scheduled
                        time will appear right here!
                      </p>
                    </div>
                  )}

                  <div className="text-[11px] text-slate-400 flex flex-wrap justify-between gap-2 pt-1">
                    <span>Customer Name: <strong className="text-slate-200">{b.name}</strong></span>
                    <span>Requested on: {new Date(b.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  </div>
);
};

export default BookingStatusModal;
