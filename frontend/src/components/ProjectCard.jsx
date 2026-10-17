import React from 'react';
import StatusBadge, { STATUS_CONFIG } from './StatusBadge';
import { ExternalLink, Calendar, Edit3, Trash2, ArrowRight } from 'lucide-react';
import { GithubIcon } from './Icons';

const PRIORITY_BADGES = {
  low: 'text-slate-400 bg-slate-800/80 border-slate-700',
  medium: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  high: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  urgent: 'text-rose-400 bg-rose-500/10 border-rose-500/20 animate-pulse',
};

const ProjectCard = ({
  project,
  isAdmin = false,
  onEdit,
  onDelete,
  onStatusChange,
  onSelect,
}) => {
  const {
    _id,
    title,
    tagline,
    description,
    status,
    category,
    techStack = [],
    progress = 0,
    priority = 'medium',
    targetDate,
    startDate,
    githubUrl,
    liveUrl,
    imageUrl,
  } = project;

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    } catch {
      return null;
    }
  };

  const statusConf = STATUS_CONFIG[status] || STATUS_CONFIG.ongoing;

  return (
    <div className="group relative bg-slate-900/70 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-cyan-500/5 flex flex-col justify-between">
      {/* Top Banner / Image */}
      <div className="relative h-44 bg-gradient-to-tr from-slate-950 via-slate-900 to-slate-800 overflow-hidden border-b border-slate-800/60">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover opacity-60 group-hover:opacity-85 group-hover:scale-105 transition-all duration-500"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/30 via-slate-950 to-slate-950">
            <span className="text-3xl font-extrabold text-slate-700 select-none tracking-wider group-hover:text-slate-600 transition-colors">
              {title.slice(0, 3).toUpperCase()}
            </span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />

        {/* Status Badge in corner */}
        <div className="absolute top-3 left-3">
          <StatusBadge status={status} />
        </div>

        {/* Priority Badge */}
        {priority && (
          <div className="absolute top-3 right-3">
            <span
              className={`text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border backdrop-blur-md ${PRIORITY_BADGES[priority] || PRIORITY_BADGES.medium}`}
            >
              {priority}
            </span>
          </div>
        )}

        {/* Category chip at bottom corner */}
        <div className="absolute bottom-3 left-3">
          <span className="text-xs font-medium text-slate-300 bg-slate-950/80 backdrop-blur-sm px-2.5 py-1 rounded-md border border-slate-700/60">
            {category || 'Full Stack'}
          </span>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3
            onClick={() => onSelect && onSelect(project)}
            className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors cursor-pointer line-clamp-1"
          >
            {title}
          </h3>

          {tagline && (
            <p className="text-xs text-cyan-300/80 font-medium mt-1 line-clamp-1">
              {tagline}
            </p>
          )}

          <p className="text-xs text-slate-400 mt-2.5 line-clamp-2 leading-relaxed">
            {description}
          </p>

          {/* Tech Stack tags */}
          {techStack.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {techStack.slice(0, 4).map((tech, idx) => (
                <span
                  key={idx}
                  className="text-[11px] font-mono text-slate-300 bg-slate-800/80 hover:bg-slate-800 px-2 py-0.5 rounded border border-slate-700/60"
                >
                  {tech}
                </span>
              ))}
              {techStack.length > 4 && (
                <span className="text-[11px] font-mono text-slate-400 bg-slate-800/50 px-1.5 py-0.5 rounded border border-slate-800">
                  +{techStack.length - 4}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Progress Bar & Timeline Section */}
        <div className="mt-5 pt-4 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-400">Development Progress:</span>
            <span className="font-semibold text-slate-200">{progress}%</span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-500 ${statusConf.barBg}`}
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>

          {/* Timeline details */}
          <div className="flex items-center justify-between mt-3 text-xs text-slate-400">
            <div className="flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>
                {formatDate(targetDate)
                  ? `Target: ${formatDate(targetDate)}`
                  : formatDate(startDate)
                  ? `Started: ${formatDate(startDate)}`
                  : 'In Roadmap'}
              </span>
            </div>

            {/* Links */}
            <div className="flex items-center space-x-2">
              {githubUrl && (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  title="View Source on GitHub"
                  className="p-1 text-slate-400 hover:text-white transition-colors"
                >
                  <GithubIcon className="w-4 h-4" />
                </a>
              )}
              {liveUrl && (
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  title="View Live Demo"
                  className="p-1 text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
              <button
                onClick={() => onSelect && onSelect(project)}
                className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center space-x-0.5 ml-1 font-medium"
              >
                <span>Details</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Specific Action Toolbar */}
      {isAdmin && (
        <div className="p-3 bg-slate-950/90 border-t border-slate-800/80 flex items-center justify-between gap-2">
          {/* Quick status dropdown */}
          <div className="flex items-center space-x-1.5 flex-1">
            <span className="text-[11px] text-slate-400">Status:</span>
            <select
              value={status}
              onChange={(e) => onStatusChange && onStatusChange(_id, e.target.value)}
              className="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded px-2 py-1 focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              <option value="ongoing">⚡ Ongoing</option>
              <option value="upcoming">🚀 Upcoming</option>
              <option value="future">🔮 Future Project</option>
              <option value="pending">⏳ Pending / Paused</option>
              <option value="completed">✅ Completed</option>
            </select>
          </div>

          {/* Edit / Delete buttons */}
          <div className="flex items-center space-x-1">
            <button
              onClick={() => onEdit && onEdit(project)}
              title="Edit Project"
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-400 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete && onDelete(_id, title)}
              title="Delete Project"
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectCard;
