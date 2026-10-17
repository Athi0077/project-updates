import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AdminNav from '../../components/AdminNav';
import AdminScheduleModal from '../../components/AdminScheduleModal';
import {
  getAllBookingsApi,
  getBookingStatsApi,
  confirmBookingApi,
  updateBookingStatusApi,
  getProjectStatsApi,
  getCategoriesApi,
} from '../../services/api';
import {
  Zap,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  FolderPlus,
  Plus,
  History,
  ExternalLink,
  ShieldCheck,
  Server,
  Layers,
  Phone,
  User,
} from 'lucide-react';

const AdminShortcutPage = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [pendingBookings, setPendingBookings] = useState([]);
  const [bookingStats, setBookingStats] = useState({ total: 0, pending: 0, confirmed: 0, completed: 0 });
  const [projectStats, setProjectStats] = useState({ total: 0 });
  const [categoriesCount, setCategoriesCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  // Scheduling modal state
  const [schedulingBooking, setSchedulingBooking] = useState(null);
  const [scheduleLoading, setScheduleLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, authLoading, navigate]);

  const showNotification = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [bookingsRes, bStatsRes, pStatsRes, catRes] = await Promise.all([
        getAllBookingsApi({ status: 'pending' }),
        getBookingStatsApi(),
        getProjectStatsApi(),
        getCategoriesApi(),
      ]);

      if (bookingsRes.data.success) {
        setPendingBookings(bookingsRes.data.data);
      }
      if (bStatsRes.data.success) {
        setBookingStats(bStatsRes.data.stats);
      }
      if (pStatsRes.data.success) {
        setProjectStats(pStatsRes.data.stats);
      }
      if (catRes.data.success) {
        setCategoriesCount(catRes.data.count || catRes.data.data.length);
      }
    } catch (err) {
      console.error('Shortcut page load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const handleConfirmSchedule = async (id, scheduleData) => {
    setScheduleLoading(true);
    try {
      const res = await confirmBookingApi(id, scheduleData);
      if (res.data.success) {
        showNotification('Appointment scheduled & time sent to user successfully!');
        setSchedulingBooking(null);
        loadData();
      }
    } catch (err) {
      console.error('Schedule error:', err);
      showNotification(err.response?.data?.message || 'Error scheduling booking', 'error');
    } finally {
      setScheduleLoading(false);
    }
  };

  // Quick 1-click slot assign (e.g. today at 4:00 PM or tomorrow at 11:00 AM)
  const handleQuickSlotAssign = async (booking, slotTime, dayOffset = 1) => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + dayOffset);
    const dateStr = targetDate.toISOString().split('T')[0];

    try {
      const res = await confirmBookingApi(booking._id, {
        appointmentDate: dateStr,
        appointmentTime: slotTime,
        adminNotes: `Assigned via Quick Shortcut (${slotTime}). Please visit our shop on time.`,
      });
      if (res.data.success) {
        showNotification(`Scheduled for ${booking.name} on ${dateStr} at ${slotTime}!`);
        loadData();
      }
    } catch (err) {
      showNotification('Failed to assign quick slot', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <AdminNav />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Toast */}
        {notification && (
          <div
            className={`fixed top-20 right-4 z-50 p-4 rounded-2xl shadow-2xl flex items-center space-x-2 text-sm border animate-in slide-in-from-top-4 ${
              notification.type === 'error'
                ? 'bg-rose-950/90 border-rose-500/40 text-rose-200'
                : 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200'
            }`}
          >
            {notification.type === 'error' ? (
              <AlertCircle className="w-5 h-5 shrink-0" />
            ) : (
              <CheckCircle2 className="w-5 h-5 shrink-0" />
            )}
            <span>{notification.msg}</span>
          </div>
        )}

        {/* Header */}
        <div className="border-b border-slate-800 pb-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-2">
            <Zap className="w-3.5 h-3.5" />
            <span>Admin Control Shortcuts</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Quick Actions & Fast Scheduling
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Execute rapid actions, instant appointment time slots, and view live system status.
          </p>
        </div>

        {/* 1-Click Fast Navigation Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link
            to="/admin/createcategory"
            className="p-5 bg-gradient-to-br from-slate-900 to-indigo-950/50 border border-indigo-500/30 hover:border-indigo-400 rounded-2xl transition-all group flex flex-col justify-between"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FolderPlus className="w-5 h-5" />
            </div>
            <div className="mt-4">
              <h3 className="font-bold text-white text-sm">Add Category</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">New shop service or package</p>
            </div>
          </Link>

          <Link
            to="/admin/history"
            className="p-5 bg-gradient-to-br from-slate-900 to-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl transition-all group flex flex-col justify-between"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <History className="w-5 h-5" />
            </div>
            <div className="mt-4">
              <h3 className="font-bold text-white text-sm">Booking History</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">{bookingStats.total} total bookings logged</p>
            </div>
          </Link>

          <Link
            to="/admin/dashboard"
            className="p-5 bg-gradient-to-br from-slate-900 to-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl transition-all group flex flex-col justify-between"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
            <div className="mt-4">
              <h3 className="font-bold text-white text-sm">Manage Projects</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">{projectStats.total || 0} projects on roadmap</p>
            </div>
          </Link>

          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-5 bg-gradient-to-br from-slate-900 to-emerald-950/40 border border-emerald-500/30 hover:border-emerald-400 rounded-2xl transition-all group flex flex-col justify-between"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ExternalLink className="w-5 h-5" />
            </div>
            <div className="mt-4">
              <h3 className="font-bold text-white text-sm">Public User Site</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">http://localhost:5173/</p>
            </div>
          </Link>
        </div>

        {/* Fast Action Center: Urgent Pending Bookings needing Date & Time */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <Clock className="w-5 h-5 text-amber-400" />
                <span>Instant Appointment Scheduler ({pendingBookings.length} Pending)</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Assign date & time with 1 click so the user can immediately see when to visit.
              </p>
            </div>
            <button
              onClick={loadData}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold self-start sm:self-auto"
            >
              Refresh List
            </button>
          </div>

          {loading ? (
            <div className="py-8 text-center text-slate-500 text-xs">Checking pending requests...</div>
          ) : pendingBookings.length === 0 ? (
            <div className="py-8 text-center bg-slate-950/40 rounded-2xl border border-slate-800/80 p-6">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-white">All Bookings Scheduled!</p>
              <p className="text-xs text-slate-400 mt-1">
                There are no pending appointments waiting for date & time assignment.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingBookings.map((b) => (
                <div
                  key={b._id}
                  className="bg-slate-950/60 border border-slate-800 hover:border-indigo-500/40 rounded-2xl p-4 sm:p-5 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-white text-sm sm:text-base">{b.name}</span>
                      <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                        {b.mobile}
                      </span>
                    </div>
                    <div className="text-xs text-amber-300 font-medium">
                      Service: {b.service}
                    </div>
                    {b.notes && (
                      <p className="text-xs text-slate-400 italic">"{b.notes}"</p>
                    )}
                    {b.preferredDate && (
                      <p className="text-[11px] text-slate-400">
                        Customer preferred date: <strong className="text-slate-200">{b.preferredDate}</strong>
                      </p>
                    )}
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => handleQuickSlotAssign(b, '11:00 AM', 1)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
                      title="Schedule for Tomorrow 11:00 AM"
                    >
                      ⚡ Tomorrow 11:00 AM
                    </button>
                    <button
                      onClick={() => handleQuickSlotAssign(b, '04:00 PM', 1)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
                      title="Schedule for Tomorrow 04:00 PM"
                    >
                      ⚡ Tomorrow 04:00 PM
                    </button>
                    <button
                      onClick={() => setSchedulingBooking(b)}
                      className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center space-x-1"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Custom Date & Time</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* System & Health Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold mb-2">
              <Server className="w-4 h-4" />
              <span>SYSTEM ENVIRONMENT</span>
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Backend Port:</span>
                <span className="font-mono text-white">5001</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Frontend Port:</span>
                <span className="font-mono text-white">5173</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Database:</span>
                <span className="text-emerald-400 font-semibold">MongoDB Connected</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold mb-2">
              <Calendar className="w-4 h-4" />
              <span>APPOINTMENTS COUNTER</span>
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Pending Confirmation:</span>
                <span className="font-bold text-amber-400">{bookingStats.pending}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Confirmed & Sent:</span>
                <span className="font-bold text-emerald-400">{bookingStats.confirmed}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Completed Visits:</span>
                <span className="font-bold text-blue-400">{bookingStats.completed}</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span>SHOP STATUS</span>
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Active Services:</span>
                <span className="font-bold text-white">{categoriesCount} Categories</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Working Timings:</span>
                <span className="font-medium text-slate-300">9:30 AM - 8:30 PM</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>User Access:</span>
                <span className="text-emerald-400 font-medium">Public (No login required)</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Schedule Modal */}
      {schedulingBooking && (
        <AdminScheduleModal
          isOpen={true}
          booking={schedulingBooking}
          loading={scheduleLoading}
          onClose={() => setSchedulingBooking(null)}
          onConfirm={handleConfirmSchedule}
        />
      )}
    </div>
  );
};

export default AdminShortcutPage;
