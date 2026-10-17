import React, { useState, useEffect } from 'react';
import ProjectCard from '../../components/ProjectCard';
import ProjectModal from '../../components/ProjectModal';
import BookNowModal from '../../components/BookNowModal';
import BookingStatusModal from '../../components/BookingStatusModal';
import ContactModal from '../../components/ContactModal';
import ServicesModal from '../../components/ServicesModal';
import {
  getProjectsApi,
  getProjectStatsApi,
  getCategoriesApi,
  getMyBookingsApi,
} from '../../services/api';
import {
  Search,
  Sparkles,
  Activity,
  Clock,
  Compass,
  AlertCircle,
  CheckCircle2,
  Layers,
  RefreshCw,
  FolderGit2,
  Calendar,
  Phone,
  MapPin,
  Store,
  ChevronRight,
  ExternalLink,
  MessageSquare,
  ShieldCheck,
  Tag,
} from 'lucide-react';

const TAB_OPTIONS = [
  { id: 'all', label: 'All Projects', icon: Layers },
  { id: 'ongoing', label: 'Current / Ongoing', icon: Activity, countKey: 'ongoing' },
  { id: 'upcoming', label: 'Upcoming', icon: Clock, countKey: 'upcoming' },
  { id: 'future', label: 'Future Projects', icon: Compass, countKey: 'future' },
  { id: 'pending', label: 'Pending', icon: AlertCircle, countKey: 'pending' },
  { id: 'completed', label: 'Completed', icon: CheckCircle2, countKey: 'completed' },
];

const ROLES = [
  'Full Stack Developer',
  'Frontend Developer',
  'Backend Developer',
  'MERN Stack Specialist',
  'REST API & Cloud Architect',
  'Modern UI/UX Engineer',
];

const UserView = () => {
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({ total: 0, ongoing: 0, upcoming: 0, future: 0, pending: 0, completed: 0 });
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);

  // Booking & Appointment Modals state
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isServicesModalOpen, setIsServicesModalOpen] = useState(false);
  const [selectedServiceToBook, setSelectedServiceToBook] = useState('');
  const [recentBooking, setRecentBooking] = useState(null);

  // Bottom to top text rotator effect
  useEffect(() => {
    const roleTimer = setInterval(() => {
      setCurrentRoleIndex((prev) => (prev + 1) % ROLES.length);
    }, 2600);
    return () => clearInterval(roleTimer);
  }, []);

  // Listen to Navbar global events
  useEffect(() => {
    const handleOpenBook = () => {
      setSelectedServiceToBook('');
      setIsBookModalOpen(true);
    };
    const handleOpenStatus = () => {
      setIsStatusModalOpen(true);
    };

    window.addEventListener('open-book-modal', handleOpenBook);
    window.addEventListener('open-status-modal', handleOpenStatus);

    return () => {
      window.removeEventListener('open-book-modal', handleOpenBook);
      window.removeEventListener('open-status-modal', handleOpenStatus);
    };
  }, []);

  // Check for saved user booking status
  const checkLatestUserBooking = async () => {
    const savedMobile = localStorage.getItem('user_last_mobile');
    if (!savedMobile) return;

    try {
      const res = await getMyBookingsApi(savedMobile);
      if (res.data.success && res.data.data.length > 0) {
        setRecentBooking(res.data.data[0]);
      }
    } catch (err) {
      console.error('Error fetching recent booking:', err);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await getProjectStatsApi();
      if (res.data.success) {
        setStats(res.data.stats);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await getCategoriesApi();
      if (res.data.success) {
        setCategories(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const params = {};
      if (activeTab !== 'all') params.status = activeTab;
      if (searchQuery.trim()) params.search = searchQuery.trim();
      if (selectedCategory !== 'all') params.category = selectedCategory;

      const res = await getProjectsApi(params);
      if (res.data.success) {
        setProjects(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchCategories();
    checkLatestUserBooking();
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchProjects();
    }, 250);
    return () => clearTimeout(delayDebounce);
  }, [activeTab, searchQuery, selectedCategory]);

  const handleBookService = (serviceName) => {
    setSelectedServiceToBook(serviceName);
    setIsBookModalOpen(true);
  };

  const handleBookingSuccess = (newBooking) => {
    setRecentBooking(newBooking);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Real-Time Active Booking Status Alert Banner (if user recently booked) */}
      {recentBooking && (
        <div
          className={`rounded-2xl p-4 sm:p-5 border transition-all ${
            recentBooking.status === 'confirmed'
              ? 'bg-gradient-to-r from-emerald-950/60 via-slate-900 to-emerald-950/40 border-emerald-500/50 shadow-xl shadow-emerald-500/10'
              : 'bg-gradient-to-r from-amber-950/40 via-slate-900 to-amber-950/20 border-amber-500/40'
          }`}
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                {recentBooking.status === 'confirmed' ? (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500 text-slate-950 flex items-center gap-1 animate-pulse">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Appointment Confirmed!
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    Booking Request Sent to Admin
                  </span>
                )}
                <span className="text-xs text-slate-400 font-mono">
                  Token: {recentBooking._id.slice(-6).toUpperCase()}
                </span>
              </div>

              {recentBooking.status === 'confirmed' ? (
                <div className="pt-1">
                  <p className="text-sm sm:text-base font-extrabold text-white">
                    👉 Admin has scheduled your appointment on{' '}
                    <span className="text-emerald-400 underline decoration-emerald-500">{recentBooking.appointmentDate}</span> at{' '}
                    <span className="text-cyan-300 underline decoration-cyan-400">{recentBooking.appointmentTime}</span>
                  </p>
                  <p className="text-xs text-emerald-300 font-medium mt-0.5">
                    User antha time la varalam! Please visit our studio at this scheduled time.
                  </p>
                </div>
              ) : (
                <p className="text-xs text-slate-300 pt-1">
                  Admin will review your request and set your visit date and time shortly. Click View
                  Status to refresh.
                </p>
              )}
            </div>

            <div className="flex items-center space-x-2 self-end md:self-auto">
              <button
                onClick={() => setIsStatusModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold border border-slate-700 transition-colors"
              >
                View Appointment Card
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 p-8 sm:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Azhaghiri Tech & Creative Studio</span>
          </div>

          {/* Bold Name on Top */}
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-2">
            Azhaghiri V
          </h1>

          {/* Bottom-to-Top Scrolling Role Animation */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 py-1">
            <span className="text-sm sm:text-xl font-bold text-[#06afcc] tracking-wide">
              Passionate
            </span>
            <div className="h-9 sm:h-11 overflow-hidden relative inline-flex items-center">
              <div
                key={currentRoleIndex}
                className="animate-scroll-up inline-flex items-center px-3.5 py-1 rounded-xl bg-[#06afcc]/10 border border-[#06afcc]/35 text-base sm:text-2xl font-extrabold text-[#06afcc] shadow-md shadow-[#06afcc]/15"
              >
                {ROLES[currentRoleIndex]}
              </div>
            </div>
          </div>

          <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            Welcome to our studio & development roadmap. Explore our shop services, live project builds,
            and book your appointment directly without login. Admin confirms your date and time!
          </p>

          {/* Direct Action Buttons: Book Now, Check Status, Contact Us & Service Details */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                setSelectedServiceToBook('');
                setIsBookModalOpen(true);
              }}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 text-slate-950 font-black text-sm shadow-xl shadow-cyan-500/25 transition-all hover:scale-105 flex items-center space-x-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment</span>
            </button>

            <button
              onClick={() => setIsStatusModalOpen(true)}
              className="px-5 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white font-bold text-xs sm:text-sm border border-slate-700 transition-all flex items-center space-x-2"
            >
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>Check Appointment Status</span>
            </button>

            <button
              onClick={() => setIsContactModalOpen(true)}
              className="px-5 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white font-bold text-xs sm:text-sm border border-slate-700 hover:border-emerald-500/50 transition-all flex items-center space-x-2 shadow-lg hover:scale-105"
            >
              <Phone className="w-4 h-4 text-emerald-400" />
              <span>Contact Us</span>
            </button>

            <button
              onClick={() => setIsServicesModalOpen(true)}
              className="px-5 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white font-bold text-xs sm:text-sm border border-slate-700 hover:border-cyan-500/50 transition-all flex items-center space-x-2 shadow-lg hover:scale-105"
            >
              <Tag className="w-4 h-4 text-cyan-400" />
              <span>Service Details</span>
            </button>
          </div>
        </div>

        {/* Quick Stat Counters */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-6 border-t border-slate-800/80">
          <div 
            onClick={() => setActiveTab('ongoing')}
            className="cursor-pointer bg-slate-950/40 hover:bg-slate-900/80 border border-emerald-500/20 rounded-xl p-3.5 transition-all"
          >
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Ongoing</span>
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-emerald-400 mt-1">{stats.ongoing || 0}</div>
          </div>

          <div 
            onClick={() => setActiveTab('upcoming')}
            className="cursor-pointer bg-slate-950/40 hover:bg-slate-900/80 border border-cyan-500/20 rounded-xl p-3.5 transition-all"
          >
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Upcoming</span>
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="text-2xl font-bold text-cyan-400 mt-1">{stats.upcoming || 0}</div>
          </div>

          <div 
            onClick={() => setActiveTab('future')}
            className="cursor-pointer bg-slate-950/40 hover:bg-slate-900/80 border border-purple-500/20 rounded-xl p-3.5 transition-all"
          >
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Future</span>
              <Compass className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-purple-400 mt-1">{stats.future || 0}</div>
          </div>

          <div 
            onClick={() => setActiveTab('pending')}
            className="cursor-pointer bg-slate-950/40 hover:bg-slate-900/80 border border-amber-500/20 rounded-xl p-3.5 transition-all"
          >
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Pending</span>
              <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-amber-400 mt-1">{stats.pending || 0}</div>
          </div>

          <div 
            onClick={() => setActiveTab('completed')}
            className="cursor-pointer bg-slate-950/40 hover:bg-slate-900/80 border border-blue-500/20 rounded-xl p-3.5 transition-all col-span-2 sm:col-span-1"
          >
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Completed</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-blue-400 mt-1">{stats.completed || 0}</div>
          </div>
        </div>
      </div>

      {/* PORTFOLIO PROJECTS SECTION */}
      <section className="space-y-6 pt-4">
        <div className="border-b border-slate-800 pb-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-2">
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>Work Showcase & Roadmap</span>
          </div>
          <h2 className="text-2xl font-black text-white">Live Development Projects</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Explore active ongoing builds, upcoming architecture releases, and completed projects.
          </p>
        </div>

        {/* Filter Tabs & Search Bar */}
        <div className="space-y-4">
          {/* Status Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-4">
            {TAB_OPTIONS.map((tab) => {
              const Icon = tab.icon;
              const count = tab.id === 'all' ? stats.total : stats[tab.countKey];
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/25 font-bold'
                      : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  {count !== undefined && (
                    <span className={`ml-1 text-[11px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-slate-950 text-cyan-400 font-bold' : 'bg-slate-800 text-slate-400'}`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Search & Secondary Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by project name, tech stack (React, Node, MongoDB, etc.)..."
                className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-slate-900 border border-slate-800 text-xs sm:text-sm text-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-cyan-500 cursor-pointer"
              >
                <option value="all">All Categories</option>
                <option value="Full Stack">Full Stack</option>
                <option value="Frontend Web">Frontend Web</option>
                <option value="Backend / API">Backend / API</option>
                <option value="Mobile App">Mobile App</option>
                <option value="AI / Machine Learning">AI / ML</option>
                <option value="DevOps / Cloud">DevOps / Cloud</option>
                <option value="E-Commerce">E-Commerce</option>
              </select>

              <button
                onClick={() => {
                  fetchProjects();
                  fetchStats();
                }}
                title="Refresh projects"
                className="p-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-slate-400">Loading projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="py-20 text-center bg-slate-900/40 rounded-2xl border border-dashed border-slate-800 p-8">
            <div className="w-12 h-12 mx-auto rounded-full bg-slate-800 flex items-center justify-center text-slate-400 mb-3">
              <FolderGit2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-white">No projects found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              {activeTab !== 'all'
                ? `There are currently no projects categorized under "${activeTab}".`
                : 'No projects currently published. Please check back soon!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                isAdmin={false}
                onSelect={setSelectedProject}
              />
            ))}
          </div>
        )}
      </section>

      {/* Floating Bottom Action for Quick Booking on Mobile/Desktop */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => {
            setSelectedServiceToBook('');
            setIsBookModalOpen(true);
          }}
          className="px-5 py-3 rounded-full bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 text-slate-950 font-black text-sm shadow-2xl shadow-cyan-500/40 hover:scale-105 transition-all flex items-center space-x-2 border-2 border-cyan-300/40"
        >
          <Calendar className="w-4 h-4" />
          <span>Book Now</span>
        </button>
      </div>

      {/* Book Now Modal */}
      <BookNowModal
        isOpen={isBookModalOpen}
        defaultService={selectedServiceToBook}
        onClose={() => setIsBookModalOpen(false)}
        onBookingSuccess={handleBookingSuccess}
      />

      {/* Check Appointment Status Modal */}
      <BookingStatusModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
      />

      {/* Contact Us Modal (Shop timings, location & direct helpline) */}
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        onBookVisit={() => {
          setSelectedServiceToBook('');
          setIsBookModalOpen(true);
        }}
      />

      {/* Service Details Modal (All category packages & pricing) */}
      <ServicesModal
        isOpen={isServicesModalOpen}
        onClose={() => setIsServicesModalOpen(false)}
        categories={categories}
        onSelectService={(serviceName) => {
          setSelectedServiceToBook(serviceName);
          setIsBookModalOpen(true);
        }}
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

export default UserView;
