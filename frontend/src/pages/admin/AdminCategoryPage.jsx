import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AdminNav from '../../components/AdminNav';
import {
  getCategoriesApi,
  createCategoryApi,
  updateCategoryApi,
  deleteCategoryApi,
} from '../../services/api';
import {
  FolderPlus,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  AlertCircle,
  Tag,
  Clock,
  IndianRupee,
  Sparkles,
  Layers,
} from 'lucide-react';

const AdminCategoryPage = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('₹4,999 onwards');
  const [duration, setDuration] = useState('2 - 4 days');
  const [badge, setBadge] = useState('Popular');
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, authLoading, navigate]);

  const showNotification = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const loadCategories = async () => {
    setLoading(true);
    try {
      const res = await getCategoriesApi();
      if (res.data.success) {
        setCategories(res.data.data);
      }
    } catch (err) {
      console.error('Error loading categories:', err);
      showNotification('Failed to load categories', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadCategories();
    }
  }, [isAuthenticated]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      showNotification('Please enter category name', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: name.trim(),
        description: description.trim(),
        price: price.trim(),
        duration: duration.trim(),
        badge: badge.trim(),
      };

      if (editingId) {
        const res = await updateCategoryApi(editingId, payload);
        if (res.data.success) {
          showNotification('Category updated successfully');
          setEditingId(null);
        }
      } else {
        const res = await createCategoryApi(payload);
        if (res.data.success) {
          showNotification('New category created successfully');
        }
      }

      // Reset form
      setName('');
      setDescription('');
      setPrice('₹4,999 onwards');
      setDuration('2 - 4 days');
      setBadge('Popular');
      loadCategories();
    } catch (err) {
      console.error('Category error:', err);
      showNotification(err.response?.data?.message || 'Error saving category', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (cat) => {
    setEditingId(cat._id);
    setName(cat.name);
    setDescription(cat.description || '');
    setPrice(cat.price || '');
    setDuration(cat.duration || '');
    setBadge(cat.badge || 'Popular');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setName('');
    setDescription('');
    setPrice('₹4,999 onwards');
    setDuration('2 - 4 days');
    setBadge('Popular');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category/service?')) return;

    try {
      const res = await deleteCategoryApi(id);
      if (res.data.success) {
        showNotification('Category deleted');
        setCategories((prev) => prev.filter((c) => c._id !== id));
      }
    } catch (err) {
      console.error('Delete error:', err);
      showNotification('Failed to delete category', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <AdminNav />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Notification Toast */}
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
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-2">
              <FolderPlus className="w-3.5 h-3.5" />
              <span>Services & Offerings Setup</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Manage Categories & Shop Services
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Add and organize services that visitors can see and book on the user side.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Create / Edit Form */}
          <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl h-fit sticky top-24">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
              <Tag className="w-5 h-5 text-indigo-400" />
              <span>{editingId ? 'Edit Category' : 'Create New Category'}</span>
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Category / Service Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. E-Commerce Website"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Estimated Price
                </label>
                <input
                  type="text"
                  placeholder="e.g. ₹9,999 onwards"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Delivery / Turnaround Duration
                </label>
                <input
                  type="text"
                  placeholder="e.g. 3 - 5 days"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Badge Label
                </label>
                <input
                  type="text"
                  placeholder="e.g. Popular, High Demand, Special Offer"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Details about what is included in this category..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                {editingId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="flex-1 py-2.5 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center space-x-1.5 disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                  <span>{submitting ? 'Saving...' : editingId ? 'Update Service' : 'Add Category'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* List of Existing Categories */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <Layers className="w-5 h-5 text-cyan-400" />
                <span>Active Service Categories ({categories.length})</span>
              </h2>
            </div>

            {loading ? (
              <div className="p-8 text-center text-slate-500 text-xs">Loading categories...</div>
            ) : categories.length === 0 ? (
              <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-3xl text-slate-400 text-xs">
                No categories added yet. Use the form on the left to add one!
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {categories.map((cat) => (
                  <div
                    key={cat._id}
                    className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 transition-all flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          {cat.badge || 'Active'}
                        </span>
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => handleEdit(cat)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-colors"
                            title="Edit"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(cat._id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <h3 className="font-bold text-white text-base">{cat.name}</h3>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-3">
                        {cat.description || 'No description provided'}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-300">
                      <span className="font-semibold text-cyan-400">{cat.price}</span>
                      <span className="text-slate-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        {cat.duration}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminCategoryPage;
