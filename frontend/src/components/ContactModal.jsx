import React from 'react';
import { X, Clock, MapPin, Phone, MessageSquare, Calendar, Store, ExternalLink } from 'lucide-react';

const ContactModal = ({ isOpen, onClose, onBookVisit }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md p-4 sm:p-6">
      <div className="min-h-full flex items-center justify-center py-6 sm:py-8">
        <div 
          className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/40">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shadow-inner shrink-0">
                <Store className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-bold text-white tracking-tight">Contact Us & Studio Info</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Open Today
                  </span>
                </div>
                <p className="text-xs text-slate-400">Direct shop details, working hours & helpline (No login required)</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close Contact Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body: 3 Contact Modules */}
          <div className="p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Module 1: Shop Timings */}
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between space-y-3 hover:border-cyan-500/30 transition-all">
                <div>
                  <div className="flex items-center space-x-2 text-cyan-400 font-bold text-xs pb-1 border-b border-slate-850">
                    <Clock className="w-4 h-4" />
                    <span>SHOP TIMINGS</span>
                  </div>
                  <div className="space-y-2 text-xs pt-3">
                    <div className="flex justify-between items-center text-slate-300">
                      <span>Mon - Sat:</span>
                      <span className="text-white font-bold bg-slate-900 px-2 py-0.5 rounded-md border border-slate-800">
                        9:30 AM - 8:30 PM
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-slate-400">
                      <span>Sunday:</span>
                      <span className="text-slate-300 font-medium">10:00 AM - 4:00 PM</span>
                    </div>
                  </div>
                </div>
                <p className="text-[11px] text-emerald-400 font-medium pt-2 border-t border-slate-900">
                  ✓ Admin schedules instant customer slots during these hours
                </p>
              </div>

              {/* Module 2: Location & Address */}
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between space-y-3 hover:border-indigo-500/30 transition-all">
                <div>
                  <div className="flex items-center space-x-2 text-indigo-400 font-bold text-xs pb-1 border-b border-slate-850">
                    <MapPin className="w-4 h-4" />
                    <span>LOCATION & ADDRESS</span>
                  </div>
                  <div className="text-xs text-slate-200 leading-relaxed pt-3">
                    <strong className="text-white block font-semibold text-sm">Azhaghiri Tech Studio</strong>
                    <p className="text-slate-300 mt-1">
                      No. 45, Technology Park Avenue, Anna Salai,<br />
                      Chennai, Tamil Nadu – 600002
                    </p>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-900">
                  Landmark: <span className="text-slate-300">Opposite City IT Tower</span>
                </p>
              </div>

              {/* Module 3: Direct Contact & Helpline */}
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between space-y-3 hover:border-emerald-500/30 transition-all">
                <div>
                  <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs pb-1 border-b border-slate-850">
                    <Phone className="w-4 h-4" />
                    <span>DIRECT CONTACT & HELPLINE</span>
                  </div>
                  <div className="space-y-2.5 text-xs pt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Call Us:</span>
                      <a 
                        href="tel:+919876543210" 
                        className="text-cyan-400 font-mono font-bold hover:underline flex items-center gap-1"
                      >
                        +91 98765 43210
                      </a>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">WhatsApp:</span>
                      <a 
                        href="https://wa.me/919876543210" 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-emerald-400 font-mono font-bold hover:underline flex items-center gap-1"
                      >
                        +91 98765 43210
                      </a>
                    </div>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-900">
                  Direct walk-in or book online to avoid waiting.
                </p>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800">
              <span className="text-xs text-slate-400">
                Want to avoid queueing? Book an appointment slot directly online.
              </span>
              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onBookVisit) onBookVisit();
                  }}
                  className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 text-slate-950 text-xs font-bold shadow-md shadow-cyan-500/20 transition-all flex items-center justify-center space-x-1.5"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Book Appointment Now</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold border border-slate-800 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactModal;
