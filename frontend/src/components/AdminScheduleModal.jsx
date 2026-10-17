import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, CheckCircle2, User, Phone, Sparkles, MessageSquare } from 'lucide-react';

const QUICK_TIME_SLOTS = [
  '10:00 AM',
  '11:30 AM',
  '02:00 PM',
  '03:30 PM',
  '05:00 PM',
  '06:30 PM',
];

const AdminScheduleModal = ({ isOpen, onClose, booking, onConfirm, loading }) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (booking) {
      // Default to preferredDate or tomorrow's date if not set
      if (booking.appointmentDate) {
        setDate(booking.appointmentDate);
      } else if (booking.preferredDate) {
        setDate(booking.preferredDate);
      } else {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        setDate(tomorrow.toISOString().split('T')[0]);
      }

      setTime(booking.appointmentTime || '11:00 AM');
      setAdminNotes(booking.adminNotes || 'Appointment confirmed! Please visit our office on time.');
      setError('');
    }
  }, [booking]);

  if (!isOpen || !booking) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!date.trim()) {
      setError('Please select an appointment date');
      return;
    }
    if (!time.trim()) {
      setError('Please specify an appointment time');
      return;
    }

    onConfirm(booking._id, {
      appointmentDate: date.trim(),
      appointmentTime: time.trim(),
      adminNotes: adminNotes.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Schedule Appointment</h3>
              <p className="text-xs text-slate-400">Set Date & Time for User</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Customer Information Preview */}
        <div className="px-6 py-3.5 bg-slate-950/40 border-b border-slate-800 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-slate-400 block">Customer Name:</span>
              <span className="font-semibold text-white flex items-center gap-1 mt-0.5">
                <User className="w-3.5 h-3.5 text-indigo-400" />
                {booking.name}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block">Mobile Number:</span>
              <span className="font-semibold text-cyan-400 flex items-center gap-1 mt-0.5">
                <Phone className="w-3.5 h-3.5" />
                {booking.mobile}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block">Service Requested:</span>
              <span className="font-medium text-amber-300 mt-0.5 block">{booking.service}</span>
            </div>
            {booking.notes && (
              <div>
                <span className="text-slate-400 block">User Notes:</span>
                <span className="text-slate-300 italic mt-0.5 block truncate">{booking.notes}</span>
              </div>
            )}
          </div>
        </div>

        {/* Schedule Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              {error}
            </div>
          )}

          {/* Date Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center space-x-1.5">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span>Select Appointment Date</span>
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Time Picker & Quick chips */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center space-x-1.5">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>Select Appointment Time</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 11:30 AM or 04:00 PM"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 mb-2"
            />

            {/* Quick time selection chips */}
            <div className="flex flex-wrap gap-1.5">
              {QUICK_TIME_SLOTS.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setTime(slot)}
                  className={`px-2.5 py-1 text-xs rounded-lg border transition-all ${
                    time === slot
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          {/* Admin Note / Instructions */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center space-x-1.5">
              <MessageSquare className="w-4 h-4 text-indigo-400" />
              <span>Message for Customer (Shown on User Side)</span>
            </label>
            <textarea
              rows={2}
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="e.g. Appointment scheduled. Please bring your project documents or visit shop directly."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="pt-2 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 text-xs font-bold rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-lg shadow-emerald-600/20 transition-all flex items-center space-x-1.5 disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{loading ? 'Sending to User...' : 'Confirm & Send to User'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminScheduleModal;
