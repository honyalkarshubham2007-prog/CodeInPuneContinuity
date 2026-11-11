import React, { useState } from 'react';
import {
  UserCheck,
  CheckCircle2,
  Clock,
  ExternalLink,
  ShieldCheck,
  PenTool,
  Lock,
  ArrowRight,
  Sparkles,
  Calendar,
  AlertCircle,
  FileDown
} from 'lucide-react';
import { Handover, User, Project } from '../../types/index.js';
import { EvidenceData } from '../evidence/EvidenceDrawer.js';
import { HandoverExportModal } from '../handover/HandoverExportModal.js';

interface SuccessorViewProps {
  handover: Handover | null;
  project?: Project;
  currentUser: User;
  onAcknowledge: (signoffNote: string, completedIds: string[]) => Promise<void>;
  onOpenEvidence: (evidence: EvidenceData) => void;
  onNavigateTab: (tab: string) => void;
}

export const SuccessorView: React.FC<SuccessorViewProps> = ({
  handover,
  project,
  currentUser,
  onAcknowledge,
  onOpenEvidence,
  onNavigateTab
}) => {
  const [completedIds, setCompletedIds] = useState<string[]>(
    handover?.readinessChecklist.filter(c => c.completed).map(c => c.id) || []
  );
  const [signoffNote, setSignoffNote] = useState('I confirm receipt of all architectural specifications, SSH credentials, and active task responsibilities.');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signoffSuccess, setSignoffSuccess] = useState(handover?.status === 'acknowledged');
  const [exportModalOpen, setExportModalOpen] = useState(false);

  const toggleCheck = (id: string) => {
    setCompletedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSignoff = async () => {
    if (!handover) return;
    setIsSubmitting(true);
    try {
      await onAcknowledge(signoffNote, completedIds);
      setSignoffSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!handover) {
    return (
      <div className="p-12 text-center bg-white dark:bg-[#0B1730] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-3">
        <UserCheck className="w-12 h-12 text-slate-400 mx-auto" />
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          No Handover Assigned Yet
        </h2>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          An outgoing project owner or faculty reviewer must generate and approve a handover before it appears in your successor dashboard.
        </p>
        <button
          onClick={() => onNavigateTab('handovers')}
          className="px-4 py-2 bg-slate-900 text-white dark:bg-teal-600 rounded-xl text-xs font-semibold hover:bg-slate-800"
        >
          Go to Handover Studio
        </button>
      </div>
    );
  }

  const isAcknowledged = handover.status === 'acknowledged' || signoffSuccess;

  return (
    <div className="space-y-6">
      {/* Successor Header Banner */}
      <div className="p-6 sm:p-7 bg-white dark:bg-[#0B1730] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                Incoming Successor Readiness Workspace
              </span>
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <span className="text-xs text-slate-500 font-mono">
                Recipient: Jordan Lee (Incoming Tech Lead)
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900 dark:text-white">
              {handover.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              Approved knowledge transfer package. Work moves forward without starting from scratch.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <button
              onClick={() => setExportModalOpen(true)}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors"
            >
              <FileDown className="w-3.5 h-3.5 text-teal-600" />
              <span>Export Briefing</span>
            </button>

            {isAcknowledged ? (
              <div className="px-4 py-2 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Formal Receipt Acknowledged</span>
              </div>
            ) : (
              <span className="px-4 py-2 bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 rounded-xl text-xs font-bold text-teal-800 dark:text-teal-300 flex items-center gap-2">
                <Clock className="w-4 h-4 text-teal-600" />
                <span>Pending Successor Sign-Off</span>
              </span>
            )}
          </div>
        </div>

        {/* Security Scope Notice */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 font-mono">
          <span>Authorisation Scope: <strong>{handover.permittedScope.toUpperCase()}</strong></span>
          <span>Access Classification: Least-Privilege Enforced</span>
        </div>
      </div>

      {/* Main Grid: Onboarding Checklist & Structured Knowledge */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Continuation Plan & Checklist */}
        <div className="lg:col-span-2 space-y-6">
          {/* Readiness Checklist */}
          <div className="p-6 bg-white dark:bg-[#0B1730] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Guided Continuation Plan & Checklist
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Chronological steps to seamlessly take over leadership without asking the outgoing lead.
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-teal-600">
                {completedIds.length} of {handover.readinessChecklist.length} Confirmed
              </span>
            </div>

            <div className="space-y-2.5">
              {handover.readinessChecklist.map(item => {
                const isChecked = completedIds.includes(item.id);
                return (
                  <label
                    key={item.id}
                    className={`p-3.5 rounded-xl border transition-colors flex items-start gap-3 cursor-pointer ${
                      isChecked
                        ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/60'
                        : 'bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 hover:border-teal-500'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleCheck(item.id)}
                      className="w-4 h-4 rounded text-teal-600 mt-0.5 focus:ring-teal-500"
                    />
                    <div className="space-y-0.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md uppercase font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {item.timeframe}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-400">
                          {item.category}
                        </span>
                      </div>
                      <div className={`text-xs font-medium leading-snug ${
                        isChecked ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'
                      }`}>
                        {item.text}
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Core Approved Handover Claims */}
          <div className="p-6 bg-white dark:bg-[#0B1730] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Approved Project Knowledge Claims ({handover.claims.length})
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Every claim below has been audited and approved by the faculty reviewer with supporting document citations.
              </p>
            </div>

            <div className="space-y-3">
              {handover.claims.map(claim => (
                <div
                  key={claim.id}
                  onClick={() =>
                    onOpenEvidence({
                      title: claim.title,
                      claimText: claim.content,
                      sourceTitle: claim.evidenceSourceTitle,
                      excerptText: claim.evidenceExcerpt,
                      verificationStatus: claim.verificationStatus,
                      reviewerNotes: claim.reviewerNotes
                    })
                  }
                  className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:border-teal-500/80 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors cursor-pointer space-y-2 group"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                        {claim.section}
                      </span>
                      <span className="text-slate-300 dark:text-slate-700">·</span>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {claim.title}
                      </span>
                    </div>

                    <span className="text-xs text-teal-600 dark:text-teal-400 group-hover:underline flex items-center gap-1 shrink-0">
                      Inspect Quote <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {claim.content}
                  </p>

                  {claim.reviewerNotes && (
                    <div className="text-[11px] text-teal-800 dark:text-teal-300 bg-teal-50/50 dark:bg-teal-950/30 p-2 rounded-lg border border-teal-100 dark:border-teal-900 font-medium">
                      Advisor Clarification: {claim.reviewerNotes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Formal Receipt Sign-off */}
        <div className="space-y-5">
          <div className="p-6 bg-white dark:bg-[#0B1730] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              <PenTool className="w-4 h-4 text-teal-600" />
              <span>Formal Receipt Sign-off</span>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              By formally acknowledging this handover, you accept technical responsibility for the project and verify access to authorized repositories.
            </p>

            {isAcknowledged ? (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl space-y-2 text-xs">
                <div className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Legally Timestamped Sign-off Recorded</span>
                </div>
                <p className="text-emerald-900 dark:text-emerald-200 text-[11px] leading-relaxed">
                  "{handover.successorSignoffNote || signoffNote}"
                </p>
                <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-mono pt-1 border-t border-emerald-100 dark:border-emerald-900">
                  Signed by Jordan Lee on {new Date(handover.acknowledgedAt || Date.now()).toLocaleString()}
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px] block mb-1">
                    Successor Sign-off Statement
                  </label>
                  <textarea
                    rows={3}
                    value={signoffNote}
                    onChange={e => setSignoffNote(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs leading-relaxed"
                  />
                </div>

                <button
                  onClick={handleSignoff}
                  disabled={isSubmitting}
                  className="w-full py-2.5 bg-slate-900 text-white dark:bg-teal-600 dark:hover:bg-teal-500 hover:bg-slate-800 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isSubmitting ? 'Recording Acceptance...' : 'Sign & Acknowledge Handover'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Next Actions Summary Card */}
          <div className="p-6 bg-white dark:bg-[#0B1730] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Immediate Next Steps
            </div>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 shrink-0" />
                <span>Contact Marcus Vance regarding LDAP firewall clearance ticket #IT-8849.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 shrink-0" />
                <span>Verify PgBouncer connection tuning to avoid 504 timeouts.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 shrink-0" />
                <span>Schedule quarterly milestone check-in with faculty advisor Dr. Sarah Chen.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Export Executive Briefing Modal */}
      {handover && (
        <HandoverExportModal
          isOpen={exportModalOpen}
          onClose={() => setExportModalOpen(false)}
          handover={handover}
          project={project || {
            id: 'proj_campus_innovation',
            name: 'Campus Innovation Portal',
            tagline: 'Student research commercialisation hub',
            department: 'Faculty of Engineering',
            description: 'Core research portal',
            status: 'active',
            outgoingLeadId: 'user_alex_rivera',
            successorId: 'user_jordan_lee',
            reviewerId: 'user_dr_thorne',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }}
        />
      )}
    </div>
  );
};
