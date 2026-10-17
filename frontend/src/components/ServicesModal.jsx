import React from 'react';
import { X, Tag, Clock, ChevronRight, Sparkles } from 'lucide-react';

const DEFAULT_SERVICES = [
  {
    _id: 'def-1',
    name: 'Custom Website (Advance with AI)',
    badge: 'Trending',
    price: '₹15,000 onwards',
    duration: '2 - 4 Weeks',
    description: 'Custom React & AI integrations, smart assistant bots, dynamic roadmap, and full admin control.'
  },
  {
    _id: 'def-2',
    name: 'Custom Website (Advance)',
    badge: 'Popular',
    price: '₹9,500 onwards',
    duration: '1 - 3 Weeks',
    description: 'High performance web application with dedicated backend, admin portal, and database.'
  },
  {
    _id: 'def-3',
    name: 'Custom Website (Basic)',
    badge: 'New',
    price: '₹3,500 onwards',
    duration: '1 - 3 Weeks',
    description: 'Clean responsive landing page with modern UI, mobile optimization, and contact form.'
  },
  {
    _id: 'def-4',
    name: 'Full Stack Web App',
    badge: 'Popular',
    price: '₹14,999 onwards',
    duration: '1 - 4 weeks',
    description: 'Custom React & Node.js scalable web applications tailored to your business needs.'
  },
  {
    _id: 'def-5',
    name: 'Frontend Design & UI/UX',
    badge: 'Trending',
    price: '₹7,500 onwards',
    duration: '1 - 2 Weeks',
    description: 'Modern, high-converting responsive interfaces built with Tailwind CSS & Framer Motion.'
  },
  {
    _id: 'def-6',
    name: 'Backend API & Cloud Database',
    badge: 'High Demand',
    price: '₹7,000 onwards',
    duration: '5 - 7 days',
    description: 'Robust Express / MongoDB REST APIs, secure authentication, and cloud architecture.'
  },
  {
    _id: 'def-7',
    name: 'Bug Fixes & Speed Optimization',
    badge: 'Quick',
    price: '₹1,500 onwards',
    duration: '24 - 48 Hours',
    description: 'Performance audits, debugging, SEO fixes, and code refactoring for existing apps.'
  },
  {
    _id: 'def-8',
    name: 'Personal Portfolio & Shop Site',
    badge: 'Recommended',
    price: '₹4,500 onwards',
    duration: '2 - 3 days',
    description: 'Clean showcase website with admin management and customer appointment booking.'
  }
];

const ServicesModal = ({ isOpen, onClose, categories = [], onSelectService }) => {
  if (!isOpen) return null;

  const displayServices = categories && categories.length > 0 ? categories : DEFAULT_SERVICES;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md p-4 sm:p-6">
      <div className="min-h-full flex items-center justify-center py-6 sm:py-8">
        <div 
          className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/40">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shadow-inner shrink-0">
                <Tag className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-bold text-white tracking-tight">Available Services & Packages</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                    {displayServices.length} Services
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Choose a service and click <strong className="text-cyan-300">Book This</strong> to reserve your appointment slot
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close Services Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body: Scrollable Services Grid */}
          <div className="p-6 max-h-[72vh] overflow-y-auto space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayServices.map((cat) => (
                <div
                  key={cat._id || cat.name}
                  className="bg-slate-950/80 border border-slate-800 hover:border-cyan-500/40 rounded-2xl p-5 transition-all flex flex-col justify-between space-y-4 group shadow-md hover:shadow-cyan-500/10"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                        {cat.badge || 'Service'}
                      </span>
                      <span className="text-xs font-bold text-cyan-400">{cat.price}</span>
                    </div>
                    <h4 className="font-bold text-white text-base group-hover:text-cyan-300 transition-colors">
                      {cat.name}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1.5 leading-relaxed line-clamp-3">
                      {cat.description || 'Full development and dedicated consulting support.'}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {cat.duration || 'Flexible'}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        if (onSelectService) {
                          onSelectService(cat.name);
                        }
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-gradient-to-r hover:from-cyan-400 hover:to-teal-400 hover:text-slate-950 text-cyan-300 text-xs font-bold transition-all flex items-center space-x-1 shadow-sm group-hover:bg-slate-750"
                    >
                      <span>Book This</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Bar */}
          <div className="px-6 py-3.5 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Need a customized package or custom quote? Mention your details in the booking form.</span>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold border border-slate-800 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesModal;
