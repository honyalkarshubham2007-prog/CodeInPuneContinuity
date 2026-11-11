import React from 'react';
import {
  FileText,
  Clock,
  CheckSquare,
  ShieldAlert,
  ArrowRight,
  AlertTriangle,
  Upload,
  Cpu,
  GitPullRequest,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { Project, Source, Decision, Task, Risk, Handover, ActivityLog, User } from '../../types/index.js';
import { EvidenceData } from '../evidence/EvidenceDrawer.js';

interface OverviewViewProps {
  project: Project;
  sources: Source[];
  decisions: Decision[];
  tasks: Task[];
  risks: Risk[];
  handovers: Handover[];
  activityLogs: ActivityLog[];
  currentUser: User;
  onNavigateTab: (tab: string) => void;
  onOpenEvidence: (evidence: EvidenceData) => void;
  onTriggerReconstruction: () => void;
  isReconstructing: boolean;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  project,
  sources,
  decisions,
  tasks,
  risks,
  handovers,
  activityLogs,
  currentUser,
  onNavigateTab,
  onOpenEvidence,
  onTriggerReconstruction,
  isReconstructing
}) => {
  const criticalRisks = risks.filter(r => r.severity === 'critical' && r.status !== 'resolved');
  const unassignedTasks = tasks.filter(t => t.owner.toLowerCase().includes('unassigned'));
  const conflictingDecisions = decisions.filter(d => d.verificationStatus === 'conflicting');
  const activeHandover = handovers[0];

  return (
    <div className="space-y-6">
      {/* Top Banner: Scenario Context & Quick CTA */}
      <div className="bg-white dark:bg-[#0B1730] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-7 shadow-xs relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                Knowledge Continuity Dashboard
              </span>
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <span className="text-xs text-slate-500 font-mono">
                {project.department}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight">
              {project.name}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {project.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigateTab('drill')}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2 transition-colors"
            >
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>Simulate Absence Drill</span>
            </button>
            <button
              onClick={() => onNavigateTab('handovers')}
              className="px-4 py-2.5 rounded-xl bg-slate-900 text-white dark:bg-teal-600 dark:hover:bg-teal-500 hover:bg-slate-800 text-xs font-semibold shadow-xs flex items-center gap-2 transition-colors"
            >
              <GitPullRequest className="w-4 h-4" />
              <span>Review Handover Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Attention Items Strip */}
        <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-rose-900 dark:text-rose-200">
                {criticalRisks.length} Critical Continuity Risks
              </div>
              <p className="text-[11px] text-rose-700 dark:text-rose-300 mt-0.5 leading-snug">
                Single-person SSH key bottleneck on Alex Rivera personal machine.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-amber-900 dark:text-amber-200">
                {unassignedTasks.length} Unassigned Critical Task
              </div>
              <p className="text-[11px] text-amber-700 dark:text-amber-300 mt-0.5 leading-snug">
                Campus SSO Security Audit & Token Revocation has NO assigned owner.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-teal-50/70 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-900/40 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-teal-900 dark:text-teal-200">
                Handover Status: {activeHandover ? activeHandover.status.toUpperCase() : 'NONE'}
              </div>
              <p className="text-[11px] text-teal-700 dark:text-teal-300 mt-0.5 leading-snug">
                Lead Architect Handover targeted to successor Jordan Lee.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Uploaded Sources */}
        <div 
          onClick={() => onNavigateTab('sources')}
          className="p-5 rounded-2xl bg-white dark:bg-[#0B1730] border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer shadow-xs group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Ingested Sources</span>
            <FileText className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition-colors" />
          </div>
          <div className="mt-3 text-3xl font-display font-extrabold text-slate-900 dark:text-white tabular-nums">
            {sources.length}
          </div>
          <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
            <span>7 formats: PDF, MD, CSV</span>
            <span className="text-teal-600 group-hover:translate-x-0.5 transition-transform">View →</span>
          </div>
        </div>

        {/* Extracted Decisions */}
        <div 
          onClick={() => onNavigateTab('decisions')}
          className="p-5 rounded-2xl bg-white dark:bg-[#0B1730] border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer shadow-xs group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Documented Decisions</span>
            <Clock className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition-colors" />
          </div>
          <div className="mt-3 text-3xl font-display font-extrabold text-slate-900 dark:text-white tabular-nums">
            {decisions.length}
          </div>
          <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
            <span>1 conflicting spec flagged</span>
            <span className="text-teal-600 group-hover:translate-x-0.5 transition-transform">View →</span>
          </div>
        </div>

        {/* Pending Tasks */}
        <div 
          onClick={() => onNavigateTab('decisions')}
          className="p-5 rounded-2xl bg-white dark:bg-[#0B1730] border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer shadow-xs group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Tasks</span>
            <CheckSquare className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition-colors" />
          </div>
          <div className="mt-3 text-3xl font-display font-extrabold text-slate-900 dark:text-white tabular-nums">
            {tasks.length}
          </div>
          <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
            <span>1 missing owner</span>
            <span className="text-teal-600 group-hover:translate-x-0.5 transition-transform">View →</span>
          </div>
        </div>

        {/* Continuity Risks */}
        <div 
          onClick={() => onNavigateTab('risks')}
          className="p-5 rounded-2xl bg-white dark:bg-[#0B1730] border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer shadow-xs group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Continuity Risks</span>
            <ShieldAlert className="w-4 h-4 text-slate-400 group-hover:text-rose-600 transition-colors" />
          </div>
          <div className="mt-3 text-3xl font-display font-extrabold text-slate-900 dark:text-white tabular-nums">
            {risks.length}
          </div>
          <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
            <span className="text-rose-600 font-semibold">{criticalRisks.length} Critical Bottlenecks</span>
            <span className="text-teal-600 group-hover:translate-x-0.5 transition-transform">View →</span>
          </div>
        </div>
      </div>

      {/* Middle Row: Empirical Charts & Evidence Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Knowledge Verification Breakdown */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-[#0B1730] border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Knowledge Evidence Verification Coverage
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Distribution of reconstructed claims across verification certainty tiers.
              </p>
            </div>
            <button
              onClick={onTriggerReconstruction}
              disabled={isReconstructing}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-colors"
            >
              <Cpu className={`w-3.5 h-3.5 ${isReconstructing ? 'animate-spin text-teal-600' : ''}`} />
              <span>{isReconstructing ? 'Analyzing...' : 'Re-run Engine'}</span>
            </button>
          </div>

          {/* Verification Bar Visual */}
          <div className="space-y-3">
            <div className="h-4 rounded-full overflow-hidden flex bg-slate-100 dark:bg-slate-800">
              <div style={{ width: '60%' }} className="bg-emerald-600" title="Verified (60%)" />
              <div style={{ width: '15%' }} className="bg-teal-500" title="Inferred (15%)" />
              <div style={{ width: '15%' }} className="bg-amber-500" title="Conflicting (15%)" />
              <div style={{ width: '10%' }} className="bg-rose-500" title="Missing (10%)" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                <span className="text-slate-600 dark:text-slate-300">Verified: <strong className="tabular-nums font-mono text-slate-900 dark:text-white">60%</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
                <span className="text-slate-600 dark:text-slate-300">Inferred: <strong className="tabular-nums font-mono text-slate-900 dark:text-white">15%</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="text-slate-600 dark:text-slate-300">Conflicting: <strong className="tabular-nums font-mono text-slate-900 dark:text-white">15%</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span className="text-slate-600 dark:text-slate-300">Missing: <strong className="tabular-nums font-mono text-slate-900 dark:text-white">10%</strong></span>
              </div>
            </div>
          </div>

          {/* Evidence Highlight Cards */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Sample Verifiable Project Claims (Click to inspect source citation)
            </div>

            <div className="space-y-2">
              {decisions.slice(0, 3).map(d => (
                <div
                  key={d.id}
                  onClick={() =>
                    onOpenEvidence({
                      title: d.title,
                      claimText: d.description,
                      sourceTitle: d.evidenceSourceTitle,
                      excerptText: d.evidenceExcerpt,
                      verificationStatus: d.verificationStatus
                    })
                  }
                  className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:border-teal-500/80 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors flex items-center justify-between cursor-pointer group"
                >
                  <div className="space-y-0.5 truncate pr-3">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md uppercase ${
                        d.verificationStatus === 'verified' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' :
                        d.verificationStatus === 'conflicting' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300' :
                        'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}>
                        {d.verificationStatus}
                      </span>
                      <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {d.title}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">
                      Source: {d.evidenceSourceTitle} · Decision Maker: {d.decisionMaker}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition-colors shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Risk Radar Severity & Departure Impact */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#0B1730] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Continuity Risk Radar
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Rule-based severity distribution across project domains.
              </p>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50">
                <div className="flex items-center gap-2 text-xs font-bold text-rose-900 dark:text-rose-200">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  <span>Critical Severity</span>
                </div>
                <span className="font-mono font-bold text-xs text-rose-800 dark:text-rose-200 tabular-nums">
                  2 Items
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-900 dark:text-amber-200">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span>High Severity</span>
                </div>
                <span className="font-mono font-bold text-xs text-amber-800 dark:text-amber-200 tabular-nums">
                  2 Items
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                  <HelpCircle className="w-4 h-4 text-slate-400" />
                  <span>Medium / Low</span>
                </div>
                <span className="font-mono font-bold text-xs text-slate-700 dark:text-slate-300 tabular-nums">
                  1 Item
                </span>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Simulated Departure Readiness
              </span>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Alex Rivera (Lead Architect)</span>
                <span className="font-mono font-bold text-amber-600 dark:text-amber-400 text-xs">52% Ready</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: '52%' }} />
              </div>
              <p className="text-[10px] text-slate-500 leading-snug">
                Departure without mitigation risks blocking production deployment & database migrations.
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('drill')}
            className="w-full py-2 bg-slate-900 text-white dark:bg-teal-600 dark:hover:bg-teal-500 hover:bg-slate-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Launch Departure Drill</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Bottom Row: Recent Ingested Sources & Audit Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Sources */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#0B1730] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Ingested Sources ({sources.length})
            </h2>
            <button
              onClick={() => onNavigateTab('sources')}
              className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
            >
              Upload New <Upload className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2">
            {sources.slice(0, 4).map(s => (
              <div
                key={s.id}
                onClick={() => onNavigateTab('sources')}
                className="p-3 rounded-xl border border-slate-200/70 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-center justify-between cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3 truncate">
                  <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-mono font-bold text-slate-600 dark:text-slate-300 uppercase">
                    {s.fileType}
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                      {s.filename}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {s.wordCount} words · {s.classification.toUpperCase()}
                    </div>
                  </div>
                </div>
                <span className="text-[10px] text-teal-700 bg-teal-50 dark:bg-teal-950/50 dark:text-teal-300 font-semibold px-2 py-0.5 rounded-md">
                  Processed
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity Audit Trail */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#0B1730] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Verified Audit Trail
            </h2>
            <button
              onClick={() => onNavigateTab('activity')}
              className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline"
            >
              View Full Log →
            </button>
          </div>

          <div className="space-y-3">
            {activityLogs.slice(0, 4).map(log => (
              <div key={log.id} className="flex items-start gap-3 text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 shrink-0" />
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-slate-200">{log.actorName}</span>
                    <span className="text-slate-400 font-mono text-[10px]">{log.action}</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-snug">
                    {log.details}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
