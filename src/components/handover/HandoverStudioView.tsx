import React, { useState } from 'react';
import {
  GitPullRequest,
  CheckCircle2,
  XCircle,
  Edit3,
  Share2,
  Lock,
  History,
  AlertTriangle,
  ExternalLink,
  ShieldAlert,
  Send,
  Plus,
  Check,
  X,
  FileDown
} from 'lucide-react';
import { Handover, HandoverClaim, HandoverStatus, HandoverScope, User, Project } from '../../types/index.js';
import { EvidenceData } from '../evidence/EvidenceDrawer.js';
import { HandoverExportModal } from './HandoverExportModal.js';

interface HandoverStudioViewProps {
  project: Project;
  handover: Handover | null;
  users: User[];
  currentUser: User;
  onCreateHandover: (data: { outgoingUserId: string; successorUserId: string; title: string; permittedScope: HandoverScope }) => Promise<void>;
  onUpdateClaim: (claimId: string, updates: Partial<HandoverClaim>) => Promise<void>;
  onUpdateStatus: (newStatus: HandoverStatus, summary?: string) => Promise<void>;
  onOpenEvidence: (evidence: EvidenceData) => void;
  onNavigateTab: (tab: string) => void;
}

export const HandoverStudioView: React.FC<HandoverStudioViewProps> = ({
  project,
  handover,
  users,
  currentUser,
  onCreateHandover,
  onUpdateClaim,
  onUpdateStatus,
  onOpenEvidence,
  onNavigateTab
}) => {
  const [editingClaimId, setEditingClaimId] = useState<string | null>(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedContent, setEditedContent] = useState('');
  const [editedNotes, setEditedNotes] = useState('');
  const [isWizardOpen, setIsWizardOpen] = useState(!handover);
  const [wizardScope, setWizardScope] = useState<HandoverScope>('full');
  const [wizardSuccessor, setWizardSuccessor] = useState('user_jordan_lee');
  const [wizardTitle, setWizardTitle] = useState('Campus Innovation Portal — Technical Leadership Handover');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeSectionFilter, setActiveSectionFilter] = useState<string>('all');
  const [exportModalOpen, setExportModalOpen] = useState(false);

  const canApprove = currentUser.role === 'owner' || currentUser.role === 'reviewer';

  const handleStartEdit = (claim: HandoverClaim) => {
    setEditingClaimId(claim.id);
    setEditedTitle(claim.title);
    setEditedContent(claim.content);
    setEditedNotes(claim.reviewerNotes || '');
  };

  const handleSaveClaim = async (claimId: string) => {
    try {
      await onUpdateClaim(claimId, {
        title: editedTitle,
        content: editedContent,
        reviewerNotes: editedNotes,
        isEdited: true
      });
      setEditingClaimId(null);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Claim update failed');
    }
  };

  const handleToggleClaimApprove = async (claim: HandoverClaim) => {
    await onUpdateClaim(claim.id, {
      isApproved: !claim.isApproved,
      isRejected: false
    });
  };

  const handleToggleClaimReject = async (claim: HandoverClaim) => {
    await onUpdateClaim(claim.id, {
      isRejected: !claim.isRejected,
      isApproved: false
    });
  };

  const handleCreateNew = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      await onCreateHandover({
        outgoingUserId: 'user_alex_rivera',
        successorUserId: wizardSuccessor,
        title: wizardTitle,
        permittedScope: wizardScope
      });
      setIsWizardOpen(false);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to generate handover');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApproveHandover = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      await onUpdateStatus('approved', 'Faculty Reviewer & Project Lead formal approval of all reconstructed claims.');
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Approval failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShareHandover = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      await onUpdateStatus('shared', 'Shared with authorized successor Jordan Lee with scope-restricted access.');
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Sharing failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: HandoverStatus) => {
    switch (status) {
      case 'approved':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-200';
      case 'shared':
        return 'bg-teal-100 text-teal-800 dark:bg-teal-950/80 dark:text-teal-300 border-teal-200';
      case 'acknowledged':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300 border-indigo-200';
      case 'in_review':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200';
    }
  };

  const filteredClaims = handover?.claims.filter(c =>
    activeSectionFilter === 'all' || c.section === activeSectionFilter
  ) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900 dark:text-white">
            Handover Studio & Human Review
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Automated synthesis with human governance. Review, correct, approve, and securely transfer project knowledge.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {handover && (
            <button
              onClick={() => setExportModalOpen(true)}
              className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors"
            >
              <FileDown className="w-3.5 h-3.5 text-teal-600" />
              <span>Export Briefing</span>
            </button>
          )}

          <button
            onClick={() => setIsWizardOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-900 text-white dark:bg-teal-600 hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Generate New Handover</span>
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-xl text-xs text-rose-800 dark:text-rose-200 flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Handover Creation Wizard Modal */}
      {isWizardOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-white dark:bg-[#0B1730] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Guided Handover Creation Wizard
                </h3>
                <p className="text-xs text-slate-500">Configure parameters for automated knowledge synthesis.</p>
              </div>
              <button
                onClick={() => setIsWizardOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px] block mb-1">
                  1. Handover Title
                </label>
                <input
                  type="text"
                  value={wizardTitle}
                  onChange={e => setWizardTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px] block mb-1">
                  2. Outgoing Team Member
                </label>
                <input
                  type="text"
                  disabled
                  value="Alex Rivera (Lead Architect / Outgoing Lead)"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-xs font-semibold text-slate-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px] block mb-1">
                  3. Select Authorised Successor
                </label>
                <select
                  value={wizardSuccessor}
                  onChange={e => setWizardSuccessor(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                >
                  <option value="user_jordan_lee">Jordan Lee (Incoming Tech Lead)</option>
                  <option value="user_morgan_taylor">Morgan Taylor (Student Affairs)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px] block mb-1">
                  4. Permitted Knowledge Scope
                </label>
                <select
                  value={wizardScope}
                  onChange={e => setWizardScope(e.target.value as HandoverScope)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                >
                  <option value="full">Full Handover (Includes Technical, Operational & Credential Guidance)</option>
                  <option value="technical">Technical Architecture Only (Excludes Confidential Operational Notes)</option>
                  <option value="operations">Operations & Process Only</option>
                  <option value="restricted">Restricted Scope</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setIsWizardOpen(false)}
                className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateNew}
                disabled={isSubmitting}
                className="px-5 py-2 bg-slate-900 text-white dark:bg-teal-600 dark:hover:bg-teal-500 hover:bg-slate-800 rounded-lg text-xs font-semibold flex items-center gap-2"
              >
                {isSubmitting ? 'Synthesizing Knowledge...' : 'Generate Evidence-Backed Handover'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active Handover Workspace */}
      {handover && (
        <div className="space-y-6">
          {/* Status & Action Banner */}
          <div className="p-6 bg-white dark:bg-[#0B1730] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-md border uppercase ${getStatusBadge(handover.status)}`}>
                    Status: {handover.status.replace('_', ' ')}
                  </span>
                  <span className="text-slate-400 font-mono text-xs">
                    Version {handover.currentVersion} · {handover.claims.length} Extracted Claims
                  </span>
                  <span className="text-slate-400 font-mono text-xs">
                    Scope: {handover.permittedScope.toUpperCase()}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white pt-1">
                  {handover.title}
                </h2>
              </div>

              {/* Action Buttons with Security Policy Enforcement */}
              <div className="flex flex-wrap items-center gap-2.5">
                {canApprove && handover.status !== 'approved' && handover.status !== 'shared' && handover.status !== 'acknowledged' && (
                  <button
                    onClick={handleApproveHandover}
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve Complete Handover</span>
                  </button>
                )}

                {/* Controlled Handover Sharing */}
                <button
                  onClick={handleShareHandover}
                  disabled={isSubmitting || handover.status === 'shared' || handover.status === 'acknowledged'}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    handover.status === 'approved'
                      ? 'bg-slate-900 text-white dark:bg-teal-600 dark:hover:bg-teal-500 hover:bg-slate-800 shadow-xs'
                      : handover.status === 'shared' || handover.status === 'acknowledged'
                      ? 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 cursor-default'
                      : 'bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-500 cursor-not-allowed'
                  }`}
                  title={handover.status !== 'approved' && handover.status !== 'shared' && handover.status !== 'acknowledged' ? 'Unapproved handovers cannot be shared (Server Enforced)' : 'Share with successor'}
                >
                  <Share2 className="w-4 h-4" />
                  <span>
                    {handover.status === 'shared' || handover.status === 'acknowledged'
                      ? 'Handover Shared with Successor'
                      : 'Share with Successor Jordan Lee'}
                  </span>
                </button>

                {(handover.status === 'shared' || handover.status === 'acknowledged') && (
                  <button
                    onClick={() => onNavigateTab('successor')}
                    className="px-3.5 py-2 border border-teal-500 text-teal-700 dark:text-teal-400 rounded-xl text-xs font-semibold hover:bg-teal-50 dark:hover:bg-teal-950/40 transition-colors"
                  >
                    Switch to Successor View →
                  </button>
                )}
              </div>
            </div>

            {/* Security Notice Banner */}
            {handover.status !== 'approved' && handover.status !== 'shared' && handover.status !== 'acknowledged' && (
              <div className="p-3 bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-xl text-xs text-amber-900 dark:text-amber-200 flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  <strong>Least-Privilege Security Rule:</strong> Handover is locked in review state. Server-side validation prevents sharing until an authorized reviewer approves all claims.
                </span>
              </div>
            )}
          </div>

          {/* Section Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto p-1 bg-white dark:bg-[#0B1730] border border-slate-200 dark:border-slate-800 rounded-xl">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 shrink-0">Sections:</span>
            {['all', 'overview', 'decisions', 'tasks', 'risks', 'dependencies', 'questions'].map(sec => (
              <button
                key={sec}
                onClick={() => setActiveSectionFilter(sec)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors shrink-0 ${
                  activeSectionFilter === sec
                    ? 'bg-slate-900 text-white dark:bg-teal-600'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {sec}
              </button>
            ))}
          </div>

          {/* Handover Claims List */}
          <div className="space-y-4">
            {filteredClaims.map(claim => {
              const isEditing = editingClaimId === claim.id;
              return (
                <div
                  key={claim.id}
                  className={`p-6 bg-white dark:bg-[#0B1730] border rounded-2xl shadow-xs transition-colors space-y-4 ${
                    claim.isApproved
                      ? 'border-emerald-200/80 dark:border-emerald-900/50'
                      : claim.isRejected
                      ? 'border-rose-200/80 dark:border-rose-900/50 bg-rose-50/20'
                      : claim.verificationStatus === 'conflicting'
                      ? 'border-amber-200 dark:border-amber-900/60'
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  {/* Claim Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                          {claim.section}
                        </span>
                        <span className="text-slate-300 dark:text-slate-700">·</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${
                          claim.verificationStatus === 'verified' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' :
                          claim.verificationStatus === 'conflicting' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300' :
                          claim.verificationStatus === 'missing' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300' :
                          'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}>
                          {claim.verificationStatus}
                        </span>

                        {claim.isApproved && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-600 text-white flex items-center gap-1">
                            <Check className="w-3 h-3" /> Approved by Reviewer
                          </span>
                        )}

                        {claim.isRejected && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-600 text-white flex items-center gap-1">
                            <X className="w-3 h-3" /> Rejected
                          </span>
                        )}

                        {claim.isEdited && (
                          <span className="text-[10px] font-mono text-slate-400">
                            (Human Clarified)
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-slate-900 dark:text-white pt-1">
                        {claim.title}
                      </h3>
                    </div>

                    {/* Action Controls for Claim Review */}
                    <div className="flex items-center gap-2 shrink-0 self-start">
                      <button
                        onClick={() =>
                          onOpenEvidence({
                            title: claim.title,
                            claimText: claim.content,
                            sourceTitle: claim.evidenceSourceTitle,
                            excerptText: claim.evidenceExcerpt,
                            verificationStatus: claim.verificationStatus,
                            conflictDetails: claim.conflictDetails,
                            reviewerNotes: claim.reviewerNotes
                          })
                        }
                        className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-teal-600 dark:text-teal-400 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1"
                      >
                        <span>Evidence</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>

                      {canApprove && (
                        <>
                          <button
                            onClick={() => handleToggleClaimApprove(claim)}
                            title="Approve Claim"
                            className={`p-1.5 rounded-lg transition-colors ${
                              claim.isApproved
                                ? 'bg-emerald-600 text-white'
                                : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
                            }`}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleToggleClaimReject(claim)}
                            title="Reject Claim"
                            className={`p-1.5 rounded-lg transition-colors ${
                              claim.isRejected
                                ? 'bg-rose-600 text-white'
                                : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40'
                            }`}
                          >
                            <XCircle className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleStartEdit(claim)}
                            title="Edit or Clarify Claim"
                            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Inline Claim Editor */}
                  {isEditing ? (
                    <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                      <div>
                        <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Claim Title</label>
                        <input
                          type="text"
                          value={editedTitle}
                          onChange={e => setEditedTitle(e.target.value)}
                          className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-800 rounded-lg border border-slate-300 dark:border-slate-700 font-semibold"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Claim Content</label>
                        <textarea
                          rows={3}
                          value={editedContent}
                          onChange={e => setEditedContent(e.target.value)}
                          className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-800 rounded-lg border border-slate-300 dark:border-slate-700 leading-relaxed"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Reviewer Clarification / Resolution Note</label>
                        <input
                          type="text"
                          placeholder="e.g. Verified with faculty budget committee..."
                          value={editedNotes}
                          onChange={e => setEditedNotes(e.target.value)}
                          className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-800 rounded-lg border border-slate-300 dark:border-slate-700"
                        />
                      </div>
                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          onClick={() => setEditingClaimId(null)}
                          className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-slate-500"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveClaim(claim.id)}
                          className="px-4 py-1.5 bg-slate-900 text-white dark:bg-teal-600 rounded-lg text-xs font-semibold"
                        >
                          Save Clarification
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {claim.content}
                    </p>
                  )}

                  {/* Conflict Notice if applicable */}
                  {claim.conflictDetails && (
                    <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-xl text-xs space-y-1">
                      <div className="font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                        <span>Source Contradiction Detected</span>
                      </div>
                      <p className="text-amber-900 dark:text-amber-200 text-[11px] leading-snug">
                        {claim.conflictDetails}
                      </p>
                    </div>
                  )}

                  {/* Reviewer Note if present */}
                  {claim.reviewerNotes && (
                    <div className="p-2.5 bg-teal-50/50 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-900 rounded-lg text-xs text-teal-900 dark:text-teal-200">
                      <strong>Reviewer Note:</strong> {claim.reviewerNotes}
                    </div>
                  )}

                  {/* Source reference footer */}
                  <div className="text-[11px] text-slate-400 font-mono flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-2">
                    <span>Evidence Source: {claim.evidenceSourceTitle}</span>
                    <span>Excerpt quote verified</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Version History Drawer Section */}
          <div className="p-6 bg-white dark:bg-[#0B1730] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              <History className="w-4 h-4 text-teal-600" />
              <span>Immutable Handover Version Audit Trail ({handover.versions.length} Revisions)</span>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {handover.versions.map(v => (
                <div key={v.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200">Version {v.versionNumber}</span>
                    <span className="text-slate-400 ml-2">by {v.createdBy}</span>
                    <div className="text-slate-500 text-[11px] mt-0.5">{v.changeSummary}</div>
                  </div>
                  <span className="font-mono text-slate-400 text-[11px]">{new Date(v.createdAt).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Export Executive Briefing Modal */}
      <HandoverExportModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        handover={handover}
        project={project}
      />
    </div>
  );
};
