import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AdminNav from '../../components/AdminNav';
import AdminScheduleModal from '../../components/AdminScheduleModal';
import ProjectCard from '../../components/ProjectCard';
import ProjectModal from '../../components/ProjectModal';
import ProjectFormModal from './ProjectFormModal';
import {
  getProjectsApi,
  getProjectStatsApi,
  createProjectApi,
  updateProjectApi,
  updateProjectStatusApi,
  deleteProjectApi,
  getAllBookingsApi,
  getBookingStatsApi,
  confirmBookingApi,
} from '../../services/api';
import {
  Plus,
  Search,
  Activity,
  Clock,
  Compass,
  AlertCircle,
  CheckCircle2,
  Layers,
  BarChart3,
  FolderPlus,
  RefreshCw,
  LogOut,
  ExternalLink,
  Shield,
  Calendar,
  Phone,
  User,
  Zap,
} from 'lucide-react';

const AdminDashboard = () => {
  const { isAuthenticated, admin, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({ total: 0, ongoing: 0, upcoming: 0, future: 0, pending: 0, completed: 0 });
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);

  // Booking states
  const [pendingBookings, setPendingBookings] = useState([]);
  const [bookingStats, setBookingStats] = useState({ total: 0, pending: 0, confirmed: 0, completed: 0 });
  const [schedulingBooking, setSchedulingBooking] = useState(null);
  const [scheduleLoading, setScheduleLoading] = useState(false);

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [notification, setNotification] = useState(null);

  // Protected route check
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
      const [statsRes, projectsRes, pendingRes, bStatsRes] = await Promise.all([
        getProjectStatsApi(),
        getProjectsApi({
          status: activeTab !== 'all' ? activeTab : undefined,
          search: searchQuery.trim() || undefined,
        }),
        getAllBookingsApi({ status: 'pending' }),
        getBookingStatsApi(),
      ]);

      if (statsRes.data.success) {
        setStats(statsRes.data.stats);
      }
      if (projectsRes.data.success) {
        setProjects(projectsRes.data.data);
      }
      if (pendingRes.data.success) {
        setPendingBookings(pendingRes.data.data);
      }
      if (bStatsRes.data.success) {
        setBookingStats(bStatsRes.data.stats);
      }
    } catch (err) {
      console.error('Error loading admin data:', err);
      showNotification('Failed to load data from server', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [activeTab, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      const timeout = setTimeout(() => {
        loadData();
      }, 250);
      return () => clearTimeout(timeout);
    }
  }, [searchQuery, isAuthenticated]);

  // Handle Form Submit (Create or Update)
  const handleFormSubmit = async (formData) => {
    setFormLoading(true);
    try {
      if (editingProject) {
        const res = await updateProjectApi(editingProject._id, formData);
        if (res.data.success) {
          showNotification(`Project "${res.data.data.title}" updated successfully!`);
        }
      } else {
        const res = await createProjectApi(formData);
        if (res.data.success) {
          showNotification(`Project "${res.data.data.title}" created successfully!`);
        }
      }
      setIsFormOpen(false);
      setEditingProject(null);
      loadData();
    } catch (err) {
      showNotification(err.response?.data?.message || 'Error saving project', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  // Handle Quick Status Change
  const handleQuickStatusChange = async (id, newStatus) => {
    try {
      const res = await updateProjectStatusApi(id, newStatus);
      if (res.data.success) {
        showNotification(`Project status updated to "${newStatus}"`);
        loadData();
      }
    } catch (err) {
      showNotification('Failed to update status', 'error');
    }
  };

  // Handle Delete
  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete project "${title}"?`)) {
      try {
        await deleteProjectApi(id);
        showNotification(`Project "${title}" deleted`);
        loadData();
      } catch (err) {
        showNotification('Failed to delete project', 'error');
      }
    }
  };

  // Handle Schedule Confirm
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

  const openCreateModal = () => {
    setEditingProject(null);
    setIsFormOpen(true);
  };

  const openEditModal = (proj) => {
    setEditingProject(proj);
    setIsFormOpen(true);
  };

  if (authLoading) {
    return (
      <div className="py-20 flex justify-center items-center">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <AdminNav />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Toast Notification */}
        {notification && (
          <div
            className={`fixed top-20 right-6 z-50 px-4 py-3 rounded-2xl shadow-2xl text-xs sm:text-sm font-medium border flex items-center space-x-2 animate-in slide-in-from-top-4 ${
              notification.type === 'error'
                ? 'bg-rose-950/90 border-rose-500 text-rose-200'
                : 'bg-emerald-950/90 border-emerald-500 text-emerald-200'
            }`}
          >
            {notification.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
            <span>{notification.msg}</span>
          </div>
        )}

        {/* Top Banner */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-2">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Admin Operations Dashboard</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Shop Management & Project Portfolio
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Respond to customer appointment requests, set visit date/time, and update project milestones.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/admin/createcategory"
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors flex items-center space-x-1.5"
            >
              <FolderPlus className="w-4 h-4 text-cyan-400" />
              <span>Manage Categories</span>
            </Link>
            <button
              onClick={openCreateModal}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-600/30 transition-all hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Project</span>
            </button>
          </div>
        </div>

        {/* SECTION 1: Customer Booking Requests (Pending Appointments) */}
        <div className="bg-slate-900 border border-amber-500/30 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-800 pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>Customer Appointment Requests</span>
                  {pendingBookings.length > 0 && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-amber-500 text-slate-950 animate-pulse">
                      {pendingBookings.length} Action Needed
                    </span>
                  )}
                </h2>
                <p className="text-xs text-slate-400">
                  Select visit date & time and send to user so they can come at that scheduled time.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Link
                to="/admin/history"
                className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                View Full Booking History ({bookingStats.total}) →
              </Link>
            </div>
          </div>

          {pendingBookings.length === 0 ? (
            <div className="py-6 text-center bg-slate-950/40 rounded-2xl border border-slate-800 p-4">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-1.5" />
              <p className="text-xs font-semibold text-white">No Pending Booking Requests</p>
              <p className="text-[11px] text-slate-400">
                All booking requests have been assigned date & time. You can view past appointments in History.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingBookings.map((b) => (
                <div
                  key={b._id}
                  className="bg-slate-950/70 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-4 transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1.5 font-bold text-white text-sm">
                        <User className="w-4 h-4 text-indigo-400" />
                        <span>{b.name}</span>
                      </div>
                      <span className="font-mono text-xs text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20 flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {b.mobile}
                      </span>
                    </div>

                    <div className="text-xs text-amber-300 font-medium">
                      Service: {b.service}
                    </div>

                    {b.notes && (
                      <p className="text-xs text-slate-400 italic bg-slate-900/60 p-2 rounded-xl border border-slate-800/80">
                        "{b.notes}"
                      </p>
                    )}

                    {b.preferredDate && (
                      <div className="text-[11px] text-slate-400">
                        Preferred Date: <strong className="text-slate-200">{b.preferredDate}</strong>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-[10px] text-slate-500">
                      Requested {new Date(b.createdAt).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => setSchedulingBooking(b)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center space-x-1.5"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>Select Date & Time & Send</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SECTION 2: Project Management Stats Counter */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div
            onClick={() => setActiveTab('all')}
            className={`cursor-pointer p-4 rounded-2xl border transition-all ${
              activeTab === 'all'
                ? 'bg-slate-800 border-indigo-500 shadow-md shadow-indigo-500/20'
                : 'bg-slate-900/80 border-slate-800 hover:bg-slate-850'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>All Projects</span>
              <Layers className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl font-bold text-white mt-1">{stats.total || 0}</div>
          </div>

          <div
            onClick={() => setActiveTab('ongoing')}
            className={`cursor-pointer p-4 rounded-2xl border transition-all ${
              activeTab === 'ongoing'
                ? 'bg-slate-800 border-emerald-500 shadow-md shadow-emerald-500/20'
                : 'bg-slate-900/80 border-slate-800 hover:bg-slate-850'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Ongoing</span>
              <Activity className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-emerald-400 mt-1">{stats.ongoing || 0}</div>
          </div>

          <div
            onClick={() => setActiveTab('upcoming')}
            className={`cursor-pointer p-4 rounded-2xl border transition-all ${
              activeTab === 'upcoming'
                ? 'bg-slate-800 border-cyan-500 shadow-md shadow-cyan-500/20'
                : 'bg-slate-900/80 border-slate-800 hover:bg-slate-850'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Upcoming</span>
              <Clock className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-bold text-cyan-400 mt-1">{stats.upcoming || 0}</div>
          </div>

          <div
            onClick={() => setActiveTab('future')}
            className={`cursor-pointer p-4 rounded-2xl border transition-all ${
              activeTab === 'future'
                ? 'bg-slate-800 border-purple-500 shadow-md shadow-purple-500/20'
                : 'bg-slate-900/80 border-slate-800 hover:bg-slate-850'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Future</span>
              <Compass className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-purple-400 mt-1">{stats.future || 0}</div>
          </div>

          <div
            onClick={() => setActiveTab('pending')}
            className={`cursor-pointer p-4 rounded-2xl border transition-all ${
              activeTab === 'pending'
                ? 'bg-slate-800 border-amber-500 shadow-md shadow-amber-500/20'
                : 'bg-slate-900/80 border-slate-800 hover:bg-slate-850'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Pending</span>
              <AlertCircle className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-amber-400 mt-1">{stats.pending || 0}</div>
          </div>

          <div
            onClick={() => setActiveTab('completed')}
            className={`cursor-pointer p-4 rounded-2xl border transition-all ${
              activeTab === 'completed'
                ? 'bg-slate-800 border-blue-500 shadow-md shadow-blue-500/20'
                : 'bg-slate-900/80 border-slate-800 hover:bg-slate-850'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Completed</span>
              <CheckCircle2 className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-blue-400 mt-1">{stats.completed || 0}</div>
          </div>
        </div>

        {/* SECTION 3: Projects List */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects to edit or update..."
                className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <button
              onClick={loadData}
              title="Refresh projects"
              className="p-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors self-end sm:self-auto"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-3">
              <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-slate-400">Loading projects...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="py-20 text-center bg-slate-900/40 rounded-2xl border border-dashed border-slate-800 p-8">
              <div className="w-12 h-12 mx-auto rounded-full bg-slate-800 flex items-center justify-center text-slate-400 mb-3">
                <FolderPlus className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-white">No projects found in this view</h3>
              <p className="text-xs text-slate-400 mt-1 mb-4">
                Get started by adding your first project to the portfolio!
              </p>
              <button
                onClick={openCreateModal}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30"
              >
                Create New Project
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard
                  key={project._id}
                  project={project}
                  isAdmin={true}
                  onEdit={openEditModal}
                  onDelete={handleDelete}
                  onStatusChange={handleQuickStatusChange}
                  onSelect={setSelectedProject}
                />
              ))}
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

      {/* Project Form Modal (Create / Edit) */}
      <ProjectFormModal
        isOpen={isFormOpen}
        initialData={editingProject}
        onClose={() => {
          setIsFormOpen(false);
          setEditingProject(null);
        }}
        onSubmit={handleFormSubmit}
        loading={formLoading}
      />

      {/* Project Details Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
