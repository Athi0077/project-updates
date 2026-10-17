import React, { useState, useEffect, useRef } from 'react';
import { X, Plus, Sparkles, AlertCircle, UploadCloud, Image as ImageIcon, Loader2, Trash2, CheckCircle2 } from 'lucide-react';
import { uploadImageApi } from '../../services/api';

const INITIAL_STATE = {
  title: '',
  tagline: '',
  description: '',
  status: 'ongoing',
  category: 'Full Stack',
  techStack: '',
  progress: 50,
  priority: 'medium',
  startDate: '',
  targetDate: '',
  githubUrl: '',
  liveUrl: '',
  imageUrl: '',
  adminNotes: '',
  featured: false,
};

const CATEGORIES = [
  'Full Stack',
  'Frontend Web',
  'Backend / API',
  'Mobile App',
  'AI / Machine Learning',
  'DevOps / Cloud',
  'Web3 / Blockchain',
  'E-Commerce',
];

const ProjectFormModal = ({ isOpen, onClose, onSubmit, initialData = null, loading = false }) => {
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [error, setError] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        tagline: initialData.tagline || '',
        description: initialData.description || '',
        status: initialData.status || 'ongoing',
        category: initialData.category || 'Full Stack',
        techStack: Array.isArray(initialData.techStack) ? initialData.techStack.join(', ') : '',
        progress: initialData.progress !== undefined ? initialData.progress : 50,
        priority: initialData.priority || 'medium',
        startDate: initialData.startDate ? initialData.startDate.slice(0, 10) : '',
        targetDate: initialData.targetDate ? initialData.targetDate.slice(0, 10) : '',
        githubUrl: initialData.githubUrl || '',
        liveUrl: initialData.liveUrl || '',
        imageUrl: initialData.imageUrl || '',
        adminNotes: initialData.adminNotes || '',
        featured: Boolean(initialData.featured),
      });
    } else {
      setFormData(INITIAL_STATE);
    }
    setError('');
    setUploadSuccess('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Cloudinary image file upload handler
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (PNG, JPG, WEBP, GIF)');
      return;
    }

    setUploadingImage(true);
    setError('');
    setUploadSuccess('');

    try {
      const res = await uploadImageApi(file);
      if (res.data.success && res.data.url) {
        setFormData((prev) => ({
          ...prev,
          imageUrl: res.data.url,
        }));
        setUploadSuccess(
          res.data.provider === 'cloudinary'
            ? 'Uploaded to Cloudinary successfully!'
            : 'Image uploaded successfully!'
        );
        setTimeout(() => setUploadSuccess(''), 4000);
      } else {
        setError(res.data.message || 'Image upload failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error uploading image to Cloudinary');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, imageUrl: '' }));
    setUploadSuccess('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Project title is required');
      return;
    }
    if (!formData.description.trim()) {
      setError('Project description is required');
      return;
    }

    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {initialData ? 'Edit Project' : 'Add New Project'}
              </h2>
              <p className="text-xs text-slate-400">
                Configure project status, progress, Cloudinary image, and links
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {uploadSuccess && (
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{uploadSuccess}</span>
            </div>
          )}

          {/* Title & Tagline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Project Title <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. AI Portfolio & Roadmap Tracker"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Tagline (Short Summary)
              </label>
              <input
                type="text"
                name="tagline"
                value={formData.tagline}
                onChange={handleChange}
                placeholder="e.g. Dynamic roadmap with live progress"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Status & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Project Status <span className="text-rose-400">*</span>
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="ongoing">⚡ Current / Ongoing</option>
                <option value="upcoming">🚀 Upcoming</option>
                <option value="future">🔮 Future Project</option>
                <option value="pending">⏳ Pending / Paused</option>
                <option value="completed">✅ Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Description <span className="text-rose-400">*</span>
            </label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder="What does this project do? What features are built or planned?"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          {/* Tech Stack */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Tech Stack (Comma-separated)
            </label>
            <input
              type="text"
              name="techStack"
              value={formData.techStack}
              onChange={handleChange}
              placeholder="React, Node.js, Express, MongoDB, Tailwind CSS"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Cloudinary Image Upload Section */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ImageIcon className="w-4 h-4 text-cyan-400" />
                <label className="text-xs font-semibold text-slate-200">
                  Project Cover Image
                </label>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  Cloudinary Support
                </span>
              </div>

              {formData.imageUrl && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="text-xs text-rose-400 hover:text-rose-300 flex items-center space-x-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove Image</span>
                </button>
              )}
            </div>

            {/* Upload Button & Preview */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* Preview Thumbnail */}
              {formData.imageUrl ? (
                <div className="relative w-full sm:w-40 h-24 rounded-lg overflow-hidden border border-slate-700 bg-slate-900 shrink-0 group">
                  <img
                    src={formData.imageUrl}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-[11px] text-white bg-slate-900/80 px-2 py-0.5 rounded">Preview</span>
                  </div>
                </div>
              ) : (
                <div className="w-full sm:w-40 h-24 rounded-lg border-2 border-dashed border-slate-700 bg-slate-900/40 flex flex-col items-center justify-center text-slate-500 shrink-0">
                  <UploadCloud className="w-6 h-6 mb-1 text-slate-600" />
                  <span className="text-[11px]">No image selected</span>
                </div>
              )}

              {/* Upload Action */}
              <div className="flex-1 w-full space-y-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="cloudinary-upload-input"
                  disabled={uploadingImage}
                />

                <div className="flex flex-wrap items-center gap-2">
                  <label
                    htmlFor="cloudinary-upload-input"
                    className={`cursor-pointer inline-flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white shadow-md transition-all ${
                      uploadingImage ? 'opacity-60 cursor-not-allowed' : ''
                    }`}
                  >
                    {uploadingImage ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Uploading to Cloudinary...</span>
                      </>
                    ) : (
                      <>
                        <UploadCloud className="w-4 h-4" />
                        <span>Upload Image File</span>
                      </>
                    )}
                  </label>

                  <span className="text-xs text-slate-500">or paste URL below</span>
                </div>

                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="https://res.cloudinary.com/... or https://..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Progress Slider & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950/50 p-3 rounded-xl border border-slate-800">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-medium text-slate-300">
                  Development Progress
                </label>
                <span className="text-xs font-bold text-cyan-400">{formData.progress}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                name="progress"
                value={formData.progress}
                onChange={handleChange}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Priority Level
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          {/* Start Date & Target Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Target Delivery Date
              </label>
              <input
                type="date"
                name="targetDate"
                value={formData.targetDate}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* GitHub & Live URLs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                GitHub Repo URL
              </label>
              <input
                type="url"
                name="githubUrl"
                value={formData.githubUrl}
                onChange={handleChange}
                placeholder="https://github.com/..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Live Demo URL
              </label>
              <input
                type="url"
                name="liveUrl"
                value={formData.liveUrl}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Admin Internal Notes */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Internal Admin Notes / Pending Reasons
            </label>
            <input
              type="text"
              name="adminNotes"
              value={formData.adminNotes}
              onChange={handleChange}
              placeholder="e.g. Waiting for client approval or API key access"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Submit buttons */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading || uploadingImage}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || uploadingImage}
              className="flex items-center space-x-2 px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/30 transition-colors disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              <span>{loading ? 'Saving...' : initialData ? 'Save Changes' : 'Create Project'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectFormModal;
