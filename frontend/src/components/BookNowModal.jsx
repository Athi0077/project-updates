import React, { useState, useEffect } from 'react';
import { X, Calendar, User, Phone, CheckCircle2, AlertCircle, Sparkles, Send, Clock, MapPin } from 'lucide-react';
import { createBookingApi, getCategoriesApi } from '../services/api';

const BookNowModal = ({ isOpen, onClose, onBookingSuccess, defaultService = '' }) => {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [service, setService] = useState(defaultService || '');
  const [preferredDate, setPreferredDate] = useState('');
  const [notes, setNotes] = useState('');

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successData, setSuccessData] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setError('');
      setSuccessData(null);
      // Fetch available services/categories
      getCategoriesApi()
        .then((res) => {
          if (res.data.success && res.data.data.length > 0) {
            setCategories(res.data.data);
            if (!service && !defaultService) {
              setService(res.data.data[0].name);
            }
          }
        })
        .catch((err) => console.error('Error fetching categories:', err));

      if (defaultService) {
        setService(defaultService);
      }

      // Pre-fill previous mobile and name if available in localStorage
      const savedMobile = localStorage.getItem('user_last_mobile');
      const savedName = localStorage.getItem('user_last_name');
      if (savedMobile) setMobile(savedMobile);
      if (savedName) setName(savedName);
    }
  }, [isOpen, defaultService]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    const cleanMobile = mobile.trim();
    if (!cleanMobile || cleanMobile.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: name.trim(),
        mobile: cleanMobile,
        service: service || 'General Service Consultation',
        preferredDate: preferredDate || '',
        notes: notes.trim(),
      };

      const res = await createBookingApi(payload);
      if (res.data.success) {
        setSuccessData(res.data.data);
        localStorage.setItem('user_last_mobile', cleanMobile);
        localStorage.setItem('user_last_name', name.trim());
        localStorage.setItem('user_last_booking_id', res.data.data._id);
        if (onBookingSuccess) {
          onBookingSuccess(res.data.data);
        }
      } else {
        setError(res.data.message || 'Failed to submit booking');
      }
    } catch (err) {
      console.error('Booking submission error:', err);
      setError(err.response?.data?.message || 'Server connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md p-4 sm:p-6">
      <div className="min-h-full flex items-center justify-center py-6 sm:py-8">
        <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/40">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shadow-inner shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight leading-snug">Book an Appointment</h3>
                <p className="text-xs text-slate-400">Direct booking & shop visit slot</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          {successData ? (
            <div className="p-6 sm:p-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-xl font-extrabold text-white">Booking Request Sent!</h4>
                <p className="text-xs text-emerald-400 font-medium mt-1">
                  Booking request has been sent to Admin successfully
                </p>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Thank you <strong className="text-white">{successData.name}</strong>. Admin will
                  assign your appointment date and time shortly. You can check your status anytime using
                  your mobile number: <span className="font-mono text-cyan-400">{successData.mobile}</span>.
                </p>
              </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Requested Service:</span>
                <span className="font-semibold text-white">{successData.service}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status:</span>
                <span className="font-semibold text-amber-400 capitalize px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/20">
                  {successData.status} (Admin Assigning Time)
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                <span>Shop Location:</span>
                <span className="text-slate-300">Azhaghiri Tech Studio, Chennai</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/25 transition-all"
            >
              Done & View My Appointment
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Shop Details Quick Info */}
            <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-indigo-200 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Shop Timings: <strong>9:30 AM - 8:30 PM</strong></span>
              </div>
              <span className="text-[11px] text-slate-400">Mon - Sat</span>
            </div>

            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Your Full Name <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Mobile Number <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="tel"
                  required
                  maxLength={13}
                  placeholder="e.g. 9876543210"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Admin will assign time and you can check status using this mobile number.
              </p>
            </div>

            {/* Service Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Select Service / Category
              </label>
              <select
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
              >
                {categories.length > 0 ? (
                  categories.map((cat) => (
                    <option key={cat._id} value={cat.name}>
                      {cat.name} ({cat.price || 'Contact for price'})
                    </option>
                  ))
                ) : (
                  <>
                    <option value="Full Stack Web App">Full Stack Web App</option>
                    <option value="Frontend Design & UI/UX">Frontend Design & UI/UX</option>
                    <option value="Backend API & Cloud Database">Backend API & Cloud Database</option>
                    <option value="Bug Fixes & Speed Optimization">Bug Fixes & Speed Optimization</option>
                    <option value="Personal Portfolio & Shop Site">Personal Portfolio & Shop Site</option>
                  </>
                )}
              </select>
            </div>

            {/* Preferred Date (Optional) */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Preferred Date <span className="text-slate-500">(Optional)</span>
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="date"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* User Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Project Details / Requirements <span className="text-slate-500">(Optional)</span>
              </label>
              <textarea
                rows={2}
                placeholder="Briefly describe what you need..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{loading ? 'Sending Request...' : 'Send Booking Request to Admin'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
      </div>
    </div>
  );
};

export default BookNowModal;
