import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  MessageSquare,
  Filter,
  Check,
  ShieldCheck
} from 'lucide-react';
import { Risk, RiskSeverity, RiskStatus } from '../../types/index.js';
import { EvidenceData } from '../evidence/EvidenceDrawer.js';

interface RisksViewProps {
  risks: Risk[];
  onUpdateRiskStatus: (riskId: string, status: RiskStatus, note?: string) => Promise<void>;
  onOpenEvidence: (evidence: EvidenceData) => void;
  canManageRisks: boolean;
}

export const RisksView: React.FC<RisksViewProps> = ({
  risks,
  onUpdateRiskStatus,
  onOpenEvidence,
  canManageRisks
}) => {
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [editingRiskId, setEditingRiskId] = useState<string | null>(null);
  const [resolutionNote, setResolutionNote] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<RiskStatus>('resolved');
  const [updating, setUpdating] = useState(false);

  const filteredRisks = risks.filter(r => {
    const matchesSev = severityFilter === 'all' || r.severity === severityFilter;
    const matchesStat = statusFilter === 'all' || r.status === statusFilter;
    return matchesSev && matchesStat;
  });

  const handleSaveStatus = async (riskId: string) => {
    setUpdating(true);
    try {
      await onUpdateRiskStatus(riskId, selectedStatus, resolutionNote);
      setEditingRiskId(null);
      setResolutionNote('');
    } finally {
      setUpdating(false);
    }
  };

  const getSeverityStyle = (sev: RiskSeverity) => {
    switch (sev) {
      case 'critical':
        return {
          badge: 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border-rose-200 dark:border-rose-900',
          icon: ShieldAlert,
          title: 'Critical Severity'
        };
      case 'high':
        return {
          badge: 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-200 dark:border-amber-900',
          icon: AlertCircle,
          title: 'High Severity'
        };
      case 'medium':
        return {
          badge: 'bg-teal-100 text-teal-800 dark:bg-teal-950/80 dark:text-teal-300 border-teal-200 dark:border-teal-900',
          icon: AlertTriangle,
          title: 'Medium Severity'
        };
      default:
        return {
          badge: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
          icon: ShieldCheck,
          title: 'Low Severity'
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900 dark:text-white">
          Continuity Risk Radar
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Transparent, rule-based risk evaluation detecting single-person bottlenecks, unassigned tasks, and undocumented credentials.
        </p>
      </div>

      {/* Filter Ribbon */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white dark:bg-[#0B1730] rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider shrink-0">Severity:</span>
          {['all', 'critical', 'high', 'medium', 'low'].map(s => (
            <button
              key={s}
              onClick={() => setSeverityFilter(s)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg capitalize transition-colors shrink-0 ${
                severityFilter === s
                  ? 'bg-slate-900 text-white dark:bg-teal-600'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider shrink-0">Status:</span>
          {['all', 'open', 'under_review', 'resolved', 'accepted'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg capitalize transition-colors shrink-0 ${
                statusFilter === st
                  ? 'bg-slate-900 text-white dark:bg-teal-600'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Risk Cards */}
      <div className="space-y-4">
        {filteredRisks.map(r => {
          const style = getSeverityStyle(r.severity);
          const Icon = style.icon;
          const isEditing = editingRiskId === r.id;

          return (
            <div
              key={r.id}
              className="p-6 bg-white dark:bg-[#0B1730] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-4"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border uppercase flex items-center gap-1 ${style.badge}`}>
                      <Icon className="w-3.5 h-3.5" />
                      <span>{r.severity} Severity</span>
                    </span>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md uppercase ${
                      r.status === 'resolved' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' :
                      r.status === 'under_review' ? 'bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300' :
                      'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}>
                      Status: {r.status.replace('_', ' ')}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white pt-1">
                    {r.title}
                  </h3>
                </div>

                <button
                  onClick={() =>
                    onOpenEvidence({
                      title: r.title,
                      claimText: r.description,
                      sourceTitle: r.evidenceSourceTitle,
                      excerptText: r.supportingEvidence,
                      verificationStatus: r.severity === 'critical' ? 'verified' : 'inferred'
                    })
                  }
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-teal-600 dark:text-teal-400 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1 shrink-0 self-start"
                >
                  <span>Inspect Evidence</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Description & Impact */}
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {r.description}
              </p>

              {/* Severity Rationale & Impact Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200/60 dark:border-slate-800 space-y-1">
                  <div className="font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider text-[10px]">
                    Transparent Severity Rule
                  </div>
                  <div className="text-slate-600 dark:text-slate-300 leading-snug">
                    {r.severityReason}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200/60 dark:border-slate-800 space-y-1">
                  <div className="font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider text-[10px]">
                    Potential Continuity Impact
                  </div>
                  <div className="text-slate-600 dark:text-slate-300 leading-snug">
                    {r.potentialImpact}
                  </div>
                </div>
              </div>

              {/* Recommended Mitigation */}
              <div className="p-3.5 bg-teal-50/50 dark:bg-teal-950/20 border border-teal-200/80 dark:border-teal-900/50 rounded-xl text-xs space-y-1">
                <div className="font-bold text-teal-900 dark:text-teal-300 uppercase tracking-wider text-[10px]">
                  Prescribed Handover Mitigation
                </div>
                <div className="text-teal-800 dark:text-teal-200 leading-relaxed font-medium">
                  {r.mitigation}
                </div>
              </div>

              {/* Resolution Note if present */}
              {r.resolutionNote && (
                <div className="text-xs text-slate-500 font-mono bg-slate-50 dark:bg-slate-900/40 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                  <strong>Reviewer Governance Note:</strong> {r.resolutionNote}
                </div>
              )}

              {/* Status Update Control for Reviewers & Owners */}
              {canManageRisks && (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <span className="text-slate-400">Assigned Reviewer: <strong className="text-slate-700 dark:text-slate-300">{r.assignedReviewer}</strong></span>

                  {isEditing ? (
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                      <select
                        value={selectedStatus}
                        onChange={e => setSelectedStatus(e.target.value as RiskStatus)}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                      >
                        <option value="open">Open</option>
                        <option value="under_review">Under Review</option>
                        <option value="resolved">Resolved</option>
                        <option value="accepted">Accepted Risk</option>
                      </select>

                      <input
                        type="text"
                        placeholder="Resolution or review comment..."
                        value={resolutionNote}
                        onChange={e => setResolutionNote(e.target.value)}
                        className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs min-w-[200px]"
                      />

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleSaveStatus(r.id)}
                          disabled={updating}
                          className="px-3 py-1.5 bg-slate-900 text-white dark:bg-teal-600 rounded-lg text-xs font-semibold hover:bg-slate-800"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingRiskId(null)}
                          className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-slate-500"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingRiskId(r.id);
                        setSelectedStatus(r.status);
                        setResolutionNote(r.resolutionNote || '');
                      }}
                      className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Update Governance Status</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {filteredRisks.length === 0 && (
          <div className="p-8 text-center text-xs text-slate-400 bg-white dark:bg-[#0B1730] rounded-2xl border border-slate-200 dark:border-slate-800">
            No continuity risks match your selected filter criteria.
          </div>
        )}
      </div>
    </div>
  );
};
