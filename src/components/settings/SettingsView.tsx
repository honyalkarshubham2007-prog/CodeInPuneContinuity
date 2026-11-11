import React, { useState } from 'react';
import {
  Settings,
  Sparkles,
  GitBranch,
  GraduationCap,
  RotateCcw,
  Shield,
  Cpu,
  Database,
  CheckCircle2,
  ExternalLink,
  Lock,
  Layers
} from 'lucide-react';
import { User, Project } from '../../types/index.js';

interface SettingsViewProps {
  currentUser: User;
  project: Project;
  onResetDemo: () => Promise<void>;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  currentUser,
  project,
  onResetDemo,
  theme,
  onToggleTheme
}) => {
  const [resetting, setResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleReset = async () => {
    setResetting(true);
    setResetSuccess(false);
    try {
      await onResetDemo();
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 4000);
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900 dark:text-white">
          Settings, Governance & Future Roadmap
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          System configuration, responsible AI disclosures, and planned Round 3 architecture commitments.
        </p>
      </div>

      {/* Profile & System Preference Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Persona Profile */}
        <div className="p-6 bg-white dark:bg-[#0B1730] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-slate-900 text-white dark:bg-teal-600 flex items-center justify-center text-lg font-bold">
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {currentUser.name}
              </h2>
              <p className="text-xs text-teal-600 dark:text-teal-400 font-medium">
                {currentUser.roleTitle}
              </p>
              <p className="text-[11px] text-slate-400 font-mono">
                {currentUser.email}
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs space-y-1.5 text-slate-600 dark:text-slate-400">
            <div>Department: <strong className="text-slate-900 dark:text-white">{currentUser.department}</strong></div>
            <div>Current Role Permission: <strong className="uppercase text-teal-600 font-mono">{currentUser.role}</strong></div>
          </div>
        </div>

        {/* Demo State Control for Judges */}
        <div className="p-6 bg-white dark:bg-[#0B1730] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
              <RotateCcw className="w-4 h-4 text-teal-600" />
              <span>Hackathon Judge Demo Reset</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Restore the entire synthetic dataset (all 7 Campus Innovation Portal documents, extracted claims, risks, and handover state) to the pristine initial demonstration baseline with 1 click.
            </p>
          </div>

          <div>
            <button
              onClick={handleReset}
              disabled={resetting}
              className="px-4 py-2.5 bg-slate-900 text-white dark:bg-teal-600 dark:hover:bg-teal-500 hover:bg-slate-800 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${resetting ? 'animate-spin' : ''}`} />
              <span>{resetting ? 'Restoring demo database...' : 'Restore Pristine Demo State'}</span>
            </button>

            {resetSuccess && (
              <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Synthetic demonstration data successfully restored!</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Part 12: Three Substantial Round 3 Improvements */}
      <div className="p-6 sm:p-8 bg-white dark:bg-[#0B1730] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
              Future Architecture Roadmap
            </span>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <span className="text-xs text-slate-400 font-mono">Part 12 Commitments</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
            Three Round 3 Engineering Commitments
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Documented planned architectural enhancements (labeled as planned improvements, not simulated functionality).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Commitment 1 */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-teal-600 dark:text-teal-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 font-mono">
                Commitment 1 (Planned)
              </span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                Authorised External Source Integrations
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Develop secure, permission-aware connectors for GitHub and Google Drive with scheduled background synchronisation, incremental diffing, and access token revocation handling.
            </p>
          </div>

          {/* Commitment 2 */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-800 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
              <GitBranch className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 font-mono">
                Commitment 2 (Planned)
              </span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                Advanced Knowledge Relationship Mapping
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Build an interactive 3D/2D force-directed knowledge graph directly connecting decisions, people, task ownership, institutional dependencies, and temporal project shifts.
            </p>
          </div>

          {/* Commitment 3 */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-mono">
                Commitment 3 (Planned)
              </span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                Intelligent Successor Readiness
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Introduce role-specific onboarding paths, knowledge gap prioritization algorithms, and measurable handover velocity benchmarks with faculty advisory sign-off gates.
            </p>
          </div>
        </div>
      </div>

      {/* Part 14: Responsible AI & Security Architecture Disclosure */}
      <div className="p-6 sm:p-8 bg-white dark:bg-[#0B1730] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-base">
          <Shield className="w-5 h-5 text-teal-600" />
          <span>Responsible AI & Security Architecture Disclosure</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5">
            <strong className="text-slate-900 dark:text-white flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-teal-600" /> Google Gemini API Integration
            </strong>
            <p>
              Uses Google Gemini 3.8 Flash (`gemini-3.8-flash`) via the official `@google/genai` TypeScript SDK. All API calls are executed strictly server-side in `server.ts` / `server/services/reconstruction.ts`. The API key is NEVER exposed to client bundles.
            </p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5">
            <strong className="text-slate-900 dark:text-white flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-teal-600" /> Deterministic Rule Fallback & Integrity
            </strong>
            <p>
              When the Gemini API key is unconfigured or rate-limited, ContinuityOS automatically transitions to its deterministic rule-based NLP extraction engine. The platform NEVER fabricates artificial evidence or invents phantom citations.
            </p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5">
            <strong className="text-slate-900 dark:text-white flex items-center gap-1.5">
              <Database className="w-4 h-4 text-teal-600" /> Relational Architecture
            </strong>
            <p>
              Prisma ORM schema (`prisma/schema.prisma`) specifies full relational foreign keys and indexes. Configured for local SQLite storage with zero external dependencies, designed for direct migration to Google Cloud SQL PostgreSQL.
            </p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5">
            <strong className="text-slate-900 dark:text-white flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-teal-600" /> Untrusted Input Sanitization
            </strong>
            <p>
              Uploaded documents are treated as untrusted data. Document content is isolated from system prompt instructions, preventing prompt injection and enforcing verification status standards.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
