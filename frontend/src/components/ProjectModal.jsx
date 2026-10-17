import React from 'react';
import StatusBadge, { STATUS_CONFIG } from './StatusBadge';
import { X, ExternalLink, Calendar, Layers, Activity, FileText } from 'lucide-react';
import { GithubIcon } from './Icons';

const ProjectModal = ({ project, onClose }) => {
  if (!project) return null;

  const {
    title,
    tagline,
    description,
    status,
    category,
    techStack = [],
    progress = 0,
    priority,
    startDate,
    targetDate,
    githubUrl,
    liveUrl,
    imageUrl,
    adminNotes,
  } = project;

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Not specified';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return 'Invalid date';
    }
  };

  const statusConf = STATUS_CONFIG[status] || STATUS_CONFIG.ongoing;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header / Image */}
        {imageUrl ? (
          <div className="relative h-48 sm:h-56 w-full bg-slate-950 overflow-hidden">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover opacity-70"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-950/70 hover:bg-slate-900 text-slate-400 hover:text-white border border-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="absolute bottom-4 left-6">
              <StatusBadge status={status} size="md" />
            </div>
          </div>
        ) : (
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <StatusBadge status={status} size="md" />
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Scrollable Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider">
              <Layers className="w-4 h-4" />
              <span>{category || 'Full Stack'}</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400 font-normal capitalize">Priority: {priority}</span>
            </div>
            <h2 className="text-2xl font-bold text-white mt-1.5">{title}</h2>
            {tagline && <p className="text-sm text-cyan-300/90 mt-1 font-medium">{tagline}</p>}
          </div>

          {/* Progress */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <div className="flex items-center space-x-2 text-slate-300 font-medium">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span>Development Completion Status</span>
              </div>
              <span className="font-bold text-white">{progress}%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${statusConf.barBg}`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Project Overview & Architecture
            </h4>
            <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
              {description}
            </p>
          </div>

          {/* Tech Stack */}
          {techStack.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Technologies Used
              </h4>
              <div className="flex flex-wrap gap-2">
                {techStack.map((tech, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-mono text-cyan-300 bg-cyan-950/40 border border-cyan-800/50 px-2.5 py-1 rounded-md"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Dates & Timeline */}
          <div className="grid grid-cols-2 gap-4 text-xs bg-slate-950/40 p-4 rounded-xl border border-slate-800/60">
            <div>
              <span className="text-slate-500 block mb-0.5">Start Date</span>
              <span className="font-semibold text-slate-200">{formatDate(startDate)}</span>
            </div>
            <div>
              <span className="text-slate-500 block mb-0.5">Target Delivery Date</span>
              <span className="font-semibold text-slate-200">{formatDate(targetDate)}</span>
            </div>
          </div>

          {/* Admin Notes */}
          {adminNotes && (
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center space-x-2 text-xs font-semibold text-amber-400 mb-1">
                <FileText className="w-4 h-4" />
                <span>Status & Milestones Note</span>
              </div>
              <p className="text-xs text-slate-300">{adminNotes}</p>
            </div>
          )}
        </div>

        {/* Modal Footer Links */}
        <div className="p-4 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
              >
                <GithubIcon className="w-4 h-4" />
                <span>GitHub Repository</span>
              </a>
            )}
            {liveUrl && (
              <a
                href={liveUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-semibold shadow-md shadow-cyan-500/20 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Live Demo</span>
              </a>
            )}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
