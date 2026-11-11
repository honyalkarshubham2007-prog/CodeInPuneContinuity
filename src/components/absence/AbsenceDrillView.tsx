import React, { useState } from 'react';
import {
  AlertTriangle,
  Play,
  CheckCircle2,
  ShieldAlert,
  UserX,
  FileQuestion,
  GitBranch,
  Key,
  HelpCircle,
  Users,
  CheckSquare
} from 'lucide-react';
import { User, AbsenceDrillResult } from '../../types/index.js';
import { api } from '../../lib/api.js';

interface AbsenceDrillViewProps {
  projectId: string;
  users: User[];
  currentUserId: string;
}

export const AbsenceDrillView: React.FC<AbsenceDrillViewProps> = ({
  projectId,
  users,
  currentUserId
}) => {
  const [selectedPerson, setSelectedPerson] = useState<string>('Alex Rivera');
  const [drillResult, setDrillResult] = useState<AbsenceDrillResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRunDrill = async () => {
    setLoading(true);
    try {
      const res = await api.runAbsenceDrill(projectId, selectedPerson, currentUserId);
      setDrillResult(res.drillResult);
    } finally {
      setLoading(false);
    }
  };

  // Run automatically on first render if empty
  React.useEffect(() => {
    handleRunDrill();
  }, [projectId]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200';
    if (score >= 50) return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200';
    return 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-200';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900 dark:text-white">
          Departure / Absence Drill Simulation
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Answer the critical executive question: <em className="text-slate-700 dark:text-slate-300">"What would happen to this project if this key person became unavailable tomorrow?"</em>
        </p>
      </div>

      {/* Simulator Control Box */}
      <div className="p-6 bg-white dark:bg-[#0B1730] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Select Key Team Member or Role to Simulate
            </label>
            <div className="flex items-center gap-3">
              <select
                value={selectedPerson}
                onChange={e => setSelectedPerson(e.target.value)}
                className="px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="Alex Rivera">Alex Rivera (Lead Architect / Outgoing Lead)</option>
                <option value="Dr. Sarah Chen">Dr. Sarah Chen (Faculty Advisor / Principal Reviewer)</option>
                <option value="Jordan Lee">Jordan Lee (Incoming Tech Lead)</option>
              </select>

              <button
                onClick={handleRunDrill}
                disabled={loading}
                className="px-4 py-2 bg-slate-900 text-white dark:bg-teal-600 dark:hover:bg-teal-500 hover:bg-slate-800 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors shrink-0"
              >
                <Play className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>{loading ? 'Evaluating Knowledge Graph...' : 'Simulate Absence'}</span>
              </button>
            </div>
          </div>

          {drillResult && (
            <div className={`p-4 rounded-xl border flex items-center gap-4 ${getScoreColor(drillResult.readinessScore)}`}>
              <div className="text-right">
                <div className="text-[10px] font-bold uppercase tracking-wider opacity-80">
                  Departure Readiness Score
                </div>
                <div className="text-2xl font-display font-extrabold tabular-nums">
                  {drillResult.readinessScore}%
                </div>
              </div>
              <div className="text-xs max-w-[170px] leading-snug opacity-90">
                {drillResult.readinessScore < 60
                  ? 'High operational risk. Single-person dependencies require immediate handover.'
                  : 'Moderate resilience. Knowledge transfer underway.'}
              </div>
            </div>
          )}
        </div>
      </div>

      {drillResult && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Impact Breakdown */}
          <div className="lg:col-span-2 space-y-5">
            {/* Undocumented Areas & Secret Credentials */}
            {drillResult.undocumentedAreas.length > 0 && (
              <div className="p-6 bg-white dark:bg-[#0B1730] border border-rose-200 dark:border-rose-900/60 rounded-2xl shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-bold text-sm">
                  <Key className="w-4 h-4 shrink-0" />
                  <span>Undocumented Critical Credentials & Unwritten Knowledge</span>
                </div>
                <p className="text-xs text-slate-500">
                  Critical information that exists exclusively in personal files or unrecorded memory:
                </p>
                <ul className="space-y-2">
                  {drillResult.undocumentedAreas.map((area, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-slate-800 dark:text-slate-200 bg-rose-50/50 dark:bg-rose-950/30 p-2.5 rounded-lg border border-rose-100 dark:border-rose-900/40">
                      <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <span>{area}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Orphaned Tasks At Risk */}
            <div className="p-6 bg-white dark:bg-[#0B1730] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white">
                  <UserX className="w-4 h-4 text-amber-500" />
                  <span>Tasks Orphaned by {drillResult.personName}'s Absence ({drillResult.tasksAtRisk.length})</span>
                </div>
                <span className="text-[11px] font-mono text-slate-400">Owner Lost</span>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {drillResult.tasksAtRisk.map(task => (
                  <div key={task.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="font-bold text-slate-800 dark:text-slate-200">{task.name}</div>
                      <div className="text-slate-500 leading-snug">{task.description}</div>
                    </div>
                    <span className="font-mono text-slate-400 shrink-0">Due: {task.deadline}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Decisions Relying Exclusively on this person */}
            <div className="p-6 bg-white dark:bg-[#0B1730] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white">
                  <GitBranch className="w-4 h-4 text-teal-600" />
                  <span>Decisions Grounded in {drillResult.personName}'s Rationale ({drillResult.decisionsRelyingOnPerson.length})</span>
                </div>
              </div>

              <div className="space-y-2">
                {drillResult.decisionsRelyingOnPerson.map(d => (
                  <div key={d.id} className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200/60 dark:border-slate-800 text-xs space-y-1">
                    <div className="font-bold text-slate-900 dark:text-slate-100">{d.title}</div>
                    <div className="text-slate-600 dark:text-slate-300">{d.reasoning}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Col: Mitigation Action Plan */}
          <div className="space-y-5">
            <div className="p-6 bg-white dark:bg-[#0B1730] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Prescribed Departure Mitigation Plan
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Actionable transfer checklist generated from empirical knowledge gaps.
                </p>
              </div>

              <div className="space-y-2.5">
                {drillResult.mitigationChecklist.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 text-xs flex items-start gap-2.5"
                  >
                    <CheckSquare className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <span className="text-slate-700 dark:text-slate-300 leading-snug font-medium">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stakeholder verification directory */}
            <div className="p-6 bg-white dark:bg-[#0B1730] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Key Contacts to Inform
              </div>
              <div className="space-y-2 text-xs">
                {drillResult.contactsToVerify.map(c => (
                  <div key={c.id} className="p-2.5 bg-slate-50 dark:bg-slate-900/40 rounded-lg border border-slate-200/60 dark:border-slate-800">
                    <div className="font-bold text-slate-800 dark:text-slate-200">{c.name}</div>
                    <div className="text-[11px] text-slate-500">{c.role} ({c.email})</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
