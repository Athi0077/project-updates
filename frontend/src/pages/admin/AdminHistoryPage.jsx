import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AdminNav from '../../components/AdminNav';
import AdminScheduleModal from '../../components/AdminScheduleModal';
import {
  getAllBookingsApi,
  getBookingStatsApi,
  confirmBookingApi,
  updateBookingStatusApi,
  deleteBookingApi,
} from '../../services/api';
import {
  History,
  Search,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Phone,
  User,
  Trash2,
  Edit2,
  RefreshCw,
  Filter,
} from 'lucide-react';

const STATUS_TABS = [
  { id: 'all', label: 'All Records' },
  { id: 'pending', label: 'Pending Time' },
  { id: 'confirmed', label: 'Confirmed & Sent' },
  { id: 'completed', label: 'Completed' },
  { id: 'cancelled', label: 'Cancelled' },
];

const AdminHistoryPage = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, confirmed: 0, completed: 0, cancelled: 0 });
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  // Modal
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
      const [bookingsRes, statsRes] = await Promise.all([
        getAllBookingsApi({
          status: activeTab !== 'all' ? activeTab : undefined,
          search: searchQuery.trim() || undefined,
        }),
        getBookingStatsApi(),
      ]);

      if (bookingsRes.data.success) {
        setBookings(bookingsRes.data.data);
      }
      if (statsRes.data.success) {
        setStats(statsRes.data.stats);
      }
    } catch (err) {
      console.error('History load error:', err);
      showNotification('Failed to load booking history', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      const timer = setTimeout(() => {
        loadData();
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, activeTab, searchQuery]);

  const handleConfirmSchedule = async (id, scheduleData) => {
    setScheduleLoading(true);
    try {
      const res = await confirmBookingApi(id, scheduleData);
      if (res.data.success) {
        showNotification('Appointment date & time updated and sent to user!');
        setSchedulingBooking(null);
        loadData();
      }
    } catch (err) {
      console.error('Error confirming appointment:', err);
      showNotification(err.response?.data?.message || 'Failed to update schedule', 'error');
    } finally {
      setScheduleLoading(false);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const res = await updateBookingStatusApi(id, { status: newStatus });
      if (res.data.success) {
        showNotification(`Booking marked as ${newStatus}`);
        loadData();
      }
    } catch (err) {
      console.error('Status update error:', err);
      showNotification('Failed to update status', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this booking record?')) return;
    try {
      const res = await deleteBookingApi(id);
      if (res.data.success) {
        showNotification('Booking deleted');
        setBookings((prev) => prev.filter((b) => b._id !== id));
      }
    } catch (err) {
      console.error('Delete error:', err);
      showNotification('Failed to delete booking', 'error');
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-2">
              <History className="w-3.5 h-3.5" />
              <span>Complete Records Log</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Booking & Appointment History
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              View, reschedule, filter, and track customer visits and scheduled timings.
            </p>
          </div>

          <button
            onClick={loadData}
            className="self-start sm:self-auto px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl text-xs font-semibold text-slate-300 hover:text-white flex items-center space-x-1.5 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div
            onClick={() => setActiveTab('all')}
            className={`cursor-pointer rounded-2xl p-4 border transition-all ${
              activeTab === 'all'
                ? 'bg-slate-900 border-indigo-500 shadow-lg'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <span className="text-xs text-slate-400">Total Bookings</span>
            <div className="text-2xl font-bold text-white mt-1">{stats.total}</div>
          </div>

          <div
            onClick={() => setActiveTab('pending')}
            className={`cursor-pointer rounded-2xl p-4 border transition-all ${
              activeTab === 'pending'
                ? 'bg-slate-900 border-amber-500 shadow-lg'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <span className="text-xs text-slate-400">Pending Time</span>
            <div className="text-2xl font-bold text-amber-400 mt-1">{stats.pending}</div>
          </div>

          <div
            onClick={() => setActiveTab('confirmed')}
            className={`cursor-pointer rounded-2xl p-4 border transition-all ${
              activeTab === 'confirmed'
                ? 'bg-slate-900 border-emerald-500 shadow-lg'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <span className="text-xs text-slate-400">Confirmed</span>
            <div className="text-2xl font-bold text-emerald-400 mt-1">{stats.confirmed}</div>
          </div>

          <div
            onClick={() => setActiveTab('completed')}
            className={`cursor-pointer rounded-2xl p-4 border transition-all ${
              activeTab === 'completed'
                ? 'bg-slate-900 border-blue-500 shadow-lg'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <span className="text-xs text-slate-400">Completed</span>
            <div className="text-2xl font-bold text-blue-400 mt-1">{stats.completed}</div>
          </div>

          <div
            onClick={() => setActiveTab('cancelled')}
            className={`cursor-pointer rounded-2xl p-4 border transition-all col-span-2 sm:col-span-1 ${
              activeTab === 'cancelled'
                ? 'bg-slate-900 border-rose-500 shadow-lg'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <span className="text-xs text-slate-400">Cancelled</span>
            <div className="text-2xl font-bold text-rose-400 mt-1">{stats.cancelled}</div>
          </div>
        </div>

        {/* Filter Tabs & Search */}
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="flex flex-wrap gap-1.5 p-1 bg-slate-900 rounded-2xl border border-slate-800">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by name, phone, service..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* History Table / Records List */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          {loading ? (
            <div className="py-12 text-center text-slate-500 text-xs">Loading records...</div>
          ) : bookings.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No booking records found matching current criteria.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-3.5 px-4">Customer</th>
                    <th className="py-3.5 px-4">Contact</th>
                    <th className="py-3.5 px-4">Service</th>
                    <th className="py-3.5 px-4">Scheduled Date & Time</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {bookings.map((b) => (
                    <tr key={b._id} className="hover:bg-slate-950/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white">{b.name}</div>
                        {b.notes && (
                          <div className="text-[11px] text-slate-400 italic line-clamp-1">
                            "{b.notes}"
                          </div>
                        )}
                        <span className="text-[10px] text-slate-500">
                          Booked: {new Date(b.createdAt).toLocaleDateString()}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                          {b.mobile}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-medium text-slate-200">{b.service}</span>
                      </td>

                      <td className="py-3.5 px-4">
                        {b.status === 'confirmed' ? (
                          <div className="space-y-0.5">
                            <div className="flex items-center space-x-1 font-bold text-emerald-400">
                              <Calendar className="w-3.5 h-3.5" />
                              <span>{b.appointmentDate}</span>
                            </div>
                            <div className="flex items-center space-x-1 text-cyan-300 font-semibold">
                              <Clock className="w-3.5 h-3.5" />
                              <span>{b.appointmentTime}</span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-amber-400/90 italic">Not scheduled yet</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        {b.status === 'confirmed' && (
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                            Confirmed
                          </span>
                        )}
                        {b.status === 'pending' && (
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                            Pending Time
                          </span>
                        )}
                        {b.status === 'completed' && (
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-500/15 text-blue-300 border border-blue-500/30">
                            Completed
                          </span>
                        )}
                        {b.status === 'cancelled' && (
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/30">
                            Cancelled
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          {/* Schedule / Reschedule */}
                          <button
                            onClick={() => setSchedulingBooking(b)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 transition-colors font-medium text-[11px]"
                            title="Set or update Date & Time"
                          >
                            {b.status === 'confirmed' ? 'Reschedule' : 'Set Time'}
                          </button>

                          {/* Quick Complete */}
                          {b.status !== 'completed' && (
                            <button
                              onClick={() => handleUpdateStatus(b._id, 'completed')}
                              className="px-2 py-1 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/20 transition-colors text-[11px]"
                              title="Mark Visited / Completed"
                            >
                              Complete
                            </button>
                          )}

                          {/* Delete */}
                          <button
                            onClick={() => handleDelete(b._id)}
                            className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                            title="Delete Record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
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

export default AdminHistoryPage;
