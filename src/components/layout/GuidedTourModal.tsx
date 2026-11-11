import React, { useState } from 'react';
import { X, ArrowRight, ArrowLeft, Upload, Cpu, ShieldAlert, CheckSquare, Send, Check } from 'lucide-react';

interface GuidedTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: string) => void;
}

const STAGES = [
  {
    step: 1,
    id: 'sources',
    title: '1. Ingest Authorised Sources',
    tagline: 'Upload real project documentation without vendor lock-in',
    icon: Upload,
    color: 'text-teal-600 bg-teal-50 dark:bg-teal-950/60 dark:text-teal-400',
    description: 'ContinuityOS ingests project documents (PDF, DOCX, TXT, Markdown, CSV matrices) and extracts raw text, generates verification checksums, and parses excerpt boundaries. No third-party integrations are claimed unless genuinely connected.',
    actionLabel: 'Go to Knowledge Sources',
    keyPoints: [
      'Preserves original filenames and excerpt line boundaries',
      'Assigns security classifications: Public, Internal, or Confidential',
      'Pre-loaded with 7 synthetic Campus Innovation Portal sources'
    ]
  },
  {
    step: 2,
    id: 'decisions',
    title: '2. Reconstruct Knowledge & Map Evidence',
    tagline: 'Extract decisions, tasks, dependencies, and identify contradictions',
    icon: Cpu,
    color: 'text-cyan-600 bg-cyan-50 dark:bg-cyan-950/60 dark:text-cyan-400',
    description: 'The Knowledge Reconstruction Engine identifies structured entities: decisions with reasoning, tasks with ownership, risks with severity, and unresolved questions. Every single claim is linked to an exact source excerpt. Contradictions (e.g. Redis vs Postgres) are flagged as CONFLICTING.',
    actionLabel: 'View Decision Timeline',
    keyPoints: [
      'Every fact links to verbatim document citations',
      'Distinguishes Verified, Inferred, Conflicting, and Missing evidence',
      'Zero AI hallucination: never turns missing information into invented facts'
    ]
  },
  {
    step: 3,
    id: 'drill',
    title: '3. Continuity Risks & Departure Drill',
    tagline: 'Simulate what happens if a team member leaves tomorrow',
    icon: ShieldAlert,
    color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/60 dark:text-amber-400',
    description: 'The Risk Radar surfaces single-person bottlenecks, unassigned critical tasks, and undocumented keys. The interactive Departure / Absence Drill simulates an outgoing lead departing (e.g. Alex Rivera), reveals orphaned tasks and unwritten knowledge, and outputs an empirical readiness score with mitigation checklist.',
    actionLabel: 'Try the Departure Drill',
    keyPoints: [
      'Empirical readiness score calculation based on single-person dependencies',
      'Flags undocumented SSH credentials and unassigned security tasks',
      'Generates actionable departure mitigation checklist'
    ]
  },
  {
    step: 4,
    id: 'handovers',
    title: '4. Handover Studio: Human Review & Approval',
    tagline: 'Automation with human control: review, correct, and approve',
    icon: CheckSquare,
    color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-400',
    description: 'AI-generated drafts are never treated as unverified truth. Authorized reviewers (Faculty Advisor Dr. Sarah Chen or Project Lead Alex Rivera) inspect every claim, resolve conflicts, add clarifications, and maintain an immutable version history. Unapproved handovers cannot be shared.',
    actionLabel: 'Open Handover Studio',
    keyPoints: [
      'Full lifecycle: Draft -> In Review -> Changes Requested -> Approved',
      'Reviewers can approve, reject, or edit individual claims',
      'Server-side authorization prevents sharing prior to approval'
    ]
  },
  {
    step: 5,
    id: 'successor',
    title: '5. Controlled Handover Sharing & Sign-off',
    tagline: 'Permission-aware knowledge transfer with digital receipt sign-off',
    icon: Send,
    color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 dark:text-indigo-400',
    description: 'The successor (Jordan Lee) receives the approved handover scoped strictly to their authorization level. They review the structured continuation plan, complete the Day 1-7 and Day 8-30 onboarding checklist, and submit a formal digital receipt acknowledgment that timestamps the immutable audit trail.',
    actionLabel: 'View Successor Experience',
    keyPoints: [
      'Scope-controlled access protects confidential credentials',
      'Structured continuation roadmap (Day 1-7, Day 8-30, First Quarter)',
      'Successor digital sign-off records timestamped acceptance in audit log'
    ]
  }
];

export const GuidedTourModal: React.FC<GuidedTourModalProps> = ({ isOpen, onClose, onNavigateTab }) => {
  const [currentIdx, setCurrentIdx] = useState(0);

  if (!isOpen) return null;

  const current = STAGES[currentIdx];
  const Icon = current.icon;

  const handleNext = () => {
    if (currentIdx < STAGES.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    }
  };

  const handleJump = () => {
    onNavigateTab(current.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="w-full max-w-2xl bg-white dark:bg-[#0B1730] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tour-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-[#14213D]/40">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
              ContinuityOS Guided Walkthrough
            </span>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              Stage {current.step} of 5
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close walkthrough"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1 bg-slate-100 dark:bg-slate-800">
          <div 
            className="h-full bg-teal-500 transition-all duration-300"
            style={{ width: `${((currentIdx + 1) / STAGES.length) * 100}%` }}
          />
        </div>

        {/* Body */}
        <div className="p-8 space-y-6">
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${current.color}`}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <h3 id="tour-title" className="text-xl font-display font-bold text-slate-900 dark:text-white">
                {current.title}
              </h3>
              <p className="text-sm font-medium text-teal-700 dark:text-teal-400 mt-0.5">
                {current.tagline}
              </p>
            </div>
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {current.description}
          </p>

          <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200/70 dark:border-slate-800 space-y-2.5">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Core Technical Guarantees
            </div>
            <ul className="space-y-2">
              {current.keyPoints.map((pt, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-[#14213D]/40 flex items-center justify-between">
          <button
            onClick={handleJump}
            className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1.5"
          >
            {current.actionLabel} <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrev}
              disabled={currentIdx === 0}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700 flex items-center gap-1 transition-colors ${
                currentIdx === 0 ? 'opacity-40 cursor-not-allowed' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-slate-900 text-white dark:bg-teal-600 dark:hover:bg-teal-500 rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors flex items-center gap-1.5"
            >
              {currentIdx === STAGES.length - 1 ? 'Finish Tour' : 'Next Stage'} <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
