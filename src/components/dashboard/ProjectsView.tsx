import React from 'react';
import { FolderGit2, CheckCircle2, Clock, Users, ArrowRight, ShieldAlert } from 'lucide-react';
import { Project } from '../../types/index.js';

interface ProjectsViewProps {
  projects: Project[];
  selectedProject: Project | null;
  onSelectProject: (p: Project) => void;
  onNavigateTab: (tab: string) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  selectedProject,
  onSelectProject,
  onNavigateTab
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900 dark:text-white">
          Active Transition Projects
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Select or audit projects currently undergoing leadership handover or knowledge continuity capture.
        </p>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map(p => {
          const isSelected = selectedProject?.id === p.id;
          return (
            <div
              key={p.id}
              className={`p-6 bg-white dark:bg-[#0B1730] border rounded-2xl shadow-xs transition-all space-y-4 flex flex-col justify-between ${
                isSelected
                  ? 'border-teal-500 ring-1 ring-teal-500'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 font-mono">
                      {p.department}
                    </span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase font-mono ${
                    p.status === 'in_transition'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                      : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                  }`}>
                    {p.status.replace('_', ' ')}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {p.name}
                  </h3>
                  <p className="text-xs text-teal-700 dark:text-teal-400 font-medium mt-0.5">
                    {p.tagline}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                    {p.description}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 text-xs">
                {isSelected ? (
                  <span className="text-xs font-bold text-teal-600 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Currently Active Workspace</span>
                  </span>
                ) : (
                  <button
                    onClick={() => onSelectProject(p)}
                    className="px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    Select this Workspace
                  </button>
                )}

                <button
                  onClick={() => {
                    onSelectProject(p);
                    onNavigateTab('overview');
                  }}
                  className="px-3.5 py-1.5 bg-slate-900 text-white dark:bg-teal-600 dark:hover:bg-teal-500 rounded-lg font-semibold flex items-center gap-1 hover:bg-slate-800"
                >
                  <span>Open Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
