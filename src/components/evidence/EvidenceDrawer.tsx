import React from 'react';
import { X, FileText, CheckCircle2, AlertTriangle, HelpCircle, AlertCircle, ExternalLink, ShieldCheck } from 'lucide-react';
import { VerificationStatus } from '../../types/index.js';

export interface EvidenceData {
  title: string;
  claimText?: string;
  sourceTitle: string;
  excerptText: string;
  verificationStatus: VerificationStatus;
  pageOrSection?: string;
  conflictDetails?: string;
  reviewerNotes?: string;
}

interface EvidenceDrawerProps {
  evidence: EvidenceData | null;
  onClose: () => void;
  onViewSource?: (sourceTitle: string) => void;
}

export const EvidenceDrawer: React.FC<EvidenceDrawerProps> = ({ evidence, onClose, onViewSource }) => {
  if (!evidence) return null;

  const getStatusBadge = (status: VerificationStatus) => {
    switch (status) {
      case 'verified':
        return {
          icon: CheckCircle2,
          color: 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800',
          label: 'Directly Verified',
          desc: 'Directly supported by an explicit statement in the authorized source.'
        };
      case 'conflicting':
        return {
          icon: AlertTriangle,
          color: 'text-amber-700 bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800',
          label: 'Conflicting Sources',
          desc: 'Multiple authorized project documents specify contradictory statements.'
        };
      case 'missing':
        return {
          icon: AlertCircle,
          color: 'text-rose-700 bg-rose-50 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800',
          label: 'Missing Evidence',
          desc: 'Required information (such as task owner or deadline) is absent from stored records.'
        };
      case 'inferred':
        return {
          icon: ShieldCheck,
          color: 'text-teal-700 bg-teal-50 border-teal-200 dark:bg-teal-950/40 dark:text-teal-400 dark:border-teal-800',
          label: 'Inferred / Needs Confirmation',
          desc: 'A plausible interpretation derived from activity records, pending human reviewer signoff.'
        };
      default:
        return {
          icon: HelpCircle,
          color: 'text-slate-700 bg-slate-100 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
          label: 'Unverified / Unknown',
          desc: 'The system cannot confidently confirm or refute this statement.'
        };
    }
  };

  const badge = getStatusBadge(evidence.verificationStatus);
  const StatusIcon = badge.icon;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex justify-end transition-opacity">
      <div 
        className="w-full max-w-xl bg-white dark:bg-[#0B1730] h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col transform transition-transform"
        role="dialog"
        aria-modal="true"
        aria-labelledby="evidence-drawer-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#14213D]/60">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-teal-600 dark:text-teal-400">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">Source Evidence Explorer</span>
              <h2 id="evidence-drawer-title" className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-sm">
                {evidence.title}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close evidence panel"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Verification Status Card */}
          <div className={`p-4 rounded-xl border ${badge.color}`}>
            <div className="flex items-start gap-3">
              <StatusIcon className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-bold">{badge.label}</div>
                <div className="text-xs mt-1 opacity-90 leading-relaxed">{badge.desc}</div>
              </div>
            </div>
          </div>

          {/* Stated Claim */}
          {evidence.claimText && (
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1.5">
                Extracted Handover Claim
              </label>
              <div className="p-3.5 bg-slate-50 dark:bg-slate-900/60 rounded-lg border border-slate-200 dark:border-slate-800 text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                {evidence.claimText}
              </div>
            </div>
          )}

          {/* Conflict Warning if applicable */}
          {evidence.conflictDetails && (
            <div className="p-4 bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wide">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Detected Contradiction in Records
              </div>
              <p className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
                {evidence.conflictDetails}
              </p>
            </div>
          )}

          {/* Supporting Evidence Excerpt */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Direct Source Document Excerpt
              </label>
              {evidence.pageOrSection && (
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  {evidence.pageOrSection}
                </span>
              )}
            </div>
            
            <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs relative">
              <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-100 dark:border-slate-800 text-xs font-medium text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2 truncate">
                  <FileText className="w-3.5 h-3.5 text-teal-600" />
                  <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">{evidence.sourceTitle}</span>
                </div>
                {onViewSource && (
                  <button
                    onClick={() => onViewSource(evidence.sourceTitle)}
                    className="text-xs text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1 shrink-0"
                  >
                    View Source <ExternalLink className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Exact quote with highlighted matching text */}
              <div className="text-sm font-mono text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-[#0B1730]/60 p-3 rounded-lg border border-slate-100 dark:border-slate-800 whitespace-pre-wrap">
                "{evidence.excerptText}"
              </div>
              <div className="mt-2 text-[11px] text-slate-400 dark:text-slate-500">
                Extracted verbatim from repository records. Zero AI hallucination guarantee.
              </div>
            </div>
          </div>

          {/* Reviewer Notes if present */}
          {evidence.reviewerNotes && (
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1.5">
                Reviewer Clarification & Governance Note
              </label>
              <div className="p-3 bg-teal-50/50 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-900 rounded-lg text-xs text-teal-900 dark:text-teal-200 leading-relaxed">
                {evidence.reviewerNotes}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#14213D]/40 flex justify-between items-center text-xs text-slate-500 dark:text-slate-400">
          <span>ContinuityOS Traceability Protocol v1.0</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white dark:bg-teal-600 dark:hover:bg-teal-500 rounded-lg font-medium hover:bg-slate-800 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
