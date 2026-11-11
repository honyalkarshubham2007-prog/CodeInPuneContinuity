import React, { useState } from 'react';
import {
  Clock,
  Filter,
  Search,
  ExternalLink,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  ShieldAlert,
  GitBranch,
  Repeat,
  CheckSquare,
  Share2
} from 'lucide-react';
import { Decision, Task, Dependency, UnresolvedQuestion, RecurringProblem, Risk, User } from '../../types/index.js';
import { EvidenceData } from '../evidence/EvidenceDrawer.js';
import { KnowledgeGraph } from '../graph/KnowledgeGraph.js';

interface TimelineViewProps {
  decisions: Decision[];
  tasks: Task[];
  dependencies: Dependency[];
  questions: UnresolvedQuestion[];
  recurringProblems: RecurringProblem[];
  risks?: Risk[];
  users?: User[];
  onOpenEvidence: (evidence: EvidenceData) => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  decisions,
  tasks,
  dependencies,
  questions,
  recurringProblems,
  risks = [],
  users = [],
  onOpenEvidence
}) => {
  const [viewMode, setViewMode] = useState<'timeline' | 'graph'>('timeline');
  const [activeTab, setActiveTab] = useState<'decisions' | 'tasks' | 'dependencies' | 'questions'>('decisions');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDecisions = decisions.filter(d => {
    const matchesCategory = categoryFilter === 'all' || d.category === categoryFilter;
    const matchesSearch =
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.reasoning.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return {
          bg: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
          icon: CheckCircle2,
          text: 'Verified'
        };
      case 'conflicting':
        return {
          bg: 'bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800',
          icon: AlertTriangle,
          text: 'Conflicting Spec'
        };
      case 'missing':
        return {
          bg: 'bg-rose-50 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800',
          icon: ShieldAlert,
          text: 'Missing Info'
        };
      default:
        return {
          bg: 'bg-teal-50 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300 border-teal-200 dark:border-teal-800',
          icon: HelpCircle,
          text: 'Inferred'
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900 dark:text-white">
            Decision Timeline & Knowledge Graph
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Chronological reconstruction of architecture decisions, ownership matrix, and dependencies.
          </p>
        </div>

        {/* View Switcher: List vs Graph */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                viewMode === 'timeline'
                  ? 'bg-white dark:bg-[#0B1730] text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Timeline List</span>
            </button>
            <button
              onClick={() => setViewMode('graph')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                viewMode === 'graph'
                  ? 'bg-white dark:bg-[#0B1730] text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Interactive Graph</span>
            </button>
          </div>
        </div>
      </div>

      {/* Render Interactive Knowledge Graph or Timeline Tabs */}
      {viewMode === 'graph' ? (
        <KnowledgeGraph
          decisions={decisions}
          tasks={tasks}
          risks={risks}
          dependencies={dependencies}
          users={users}
          onOpenEvidence={onOpenEvidence}
        />
      ) : (
        <>
          {/* Sub-Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl self-start w-fit">
            <button
              onClick={() => setActiveTab('decisions')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'decisions'
                  ? 'bg-white dark:bg-[#0B1730] text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Decisions ({decisions.length})
            </button>
            <button
              onClick={() => setActiveTab('tasks')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'tasks'
                  ? 'bg-white dark:bg-[#0B1730] text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Tasks ({tasks.length})
            </button>
            <button
              onClick={() => setActiveTab('dependencies')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'dependencies'
                  ? 'bg-white dark:bg-[#0B1730] text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Dependencies ({dependencies.length})
            </button>
            <button
              onClick={() => setActiveTab('questions')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'questions'
                  ? 'bg-white dark:bg-[#0B1730] text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Questions ({questions.length})
            </button>
          </div>

          {/* Tab 1: Decisions Timeline */}
          {activeTab === 'decisions' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white dark:bg-[#0B1730] rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 overflow-x-auto">
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider shrink-0">Category:</span>
              {['all', 'architecture', 'infrastructure', 'product', 'process'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-lg capitalize transition-colors shrink-0 ${
                    categoryFilter === cat
                      ? 'bg-slate-900 text-white dark:bg-teal-600'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-60">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search decisions..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Chronological Timeline Cards */}
          <div className="space-y-4 relative before:absolute before:inset-0 before:left-4 sm:before:left-6 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
            {filteredDecisions.map(d => {
              const badge = getStatusBadge(d.verificationStatus);
              const BadgeIcon = badge.icon;
              return (
                <div key={d.id} className="relative pl-10 sm:pl-14 group">
                  {/* Timeline Dot */}
                  <div className="absolute left-2.5 sm:left-4.5 top-5 -translate-x-1/2 w-4 h-4 rounded-full bg-white dark:bg-[#0B1730] border-2 border-teal-500 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                  </div>

                  {/* Decision Card */}
                  <div
                    onClick={() =>
                      onOpenEvidence({
                        title: d.title,
                        claimText: d.description,
                        sourceTitle: d.evidenceSourceTitle,
                        excerptText: d.evidenceExcerpt,
                        verificationStatus: d.verificationStatus
                      })
                    }
                    className="p-5 bg-white dark:bg-[#0B1730] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs hover:border-teal-500/80 transition-all cursor-pointer space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
                          {d.date}
                        </span>
                        <span className="text-slate-300 dark:text-slate-700">·</span>
                        <span className="text-xs font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                          {d.category}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border flex items-center gap-1 ${badge.bg}`}>
                          <BadgeIcon className="w-3.5 h-3.5" />
                          <span>{badge.text}</span>
                        </span>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {d.title}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                        {d.description}
                      </p>
                    </div>

                    <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-100 dark:border-slate-800 text-xs">
                      <strong className="text-slate-700 dark:text-slate-200">Documented Reasoning: </strong>
                      <span className="text-slate-600 dark:text-slate-300">{d.reasoning}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100 dark:border-slate-800/80 text-slate-400">
                      <span>Decided by: <strong className="text-slate-700 dark:text-slate-300">{d.decisionMaker}</strong></span>
                      <span className="text-teal-600 dark:text-teal-400 font-medium group-hover:underline flex items-center gap-1">
                        Inspect Source Excerpt <ExternalLink className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Tasks & Ownership Matrix */}
      {activeTab === 'tasks' && (
        <div className="bg-white dark:bg-[#0B1730] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
          <div className="p-4 sm:px-6 bg-slate-50 dark:bg-[#14213D]/40 text-xs font-bold uppercase tracking-wider text-slate-500">
            Active Handover Task Responsibilities ({tasks.length})
          </div>

          {tasks.map(t => {
            const isUnassigned = t.owner.toLowerCase().includes('unassigned');
            const isMissingDeadline = t.deadline.toLowerCase().includes('missing');
            return (
              <div
                key={t.id}
                onClick={() =>
                  onOpenEvidence({
                    title: t.name,
                    claimText: t.description,
                    sourceTitle: t.evidenceSourceTitle,
                    excerptText: t.evidenceExcerpt,
                    verificationStatus: t.verificationStatus
                  })
                }
                className="p-5 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer group"
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {t.name}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${
                      t.status === 'in_progress' ? 'bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300' :
                      t.status === 'blocked' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300' :
                      'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}>
                      {t.status.replace('_', ' ')}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                    {t.description}
                  </p>

                  <div className="flex items-center gap-4 text-xs font-mono">
                    <span className={isUnassigned ? 'text-rose-600 font-bold bg-rose-50 dark:bg-rose-950/40 px-1.5 py-0.5 rounded' : 'text-slate-500'}>
                      Owner: {t.owner}
                    </span>
                    <span className={isMissingDeadline ? 'text-amber-600 font-bold bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded' : 'text-slate-500'}>
                      Deadline: {t.deadline}
                    </span>
                  </div>
                </div>

                <div className="shrink-0 text-xs text-teal-600 dark:text-teal-400 group-hover:underline flex items-center gap-1">
                  <span>View Evidence</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 3: Dependencies */}
      {activeTab === 'dependencies' && (
        <div className="bg-white dark:bg-[#0B1730] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
          <div className="p-4 sm:px-6 bg-slate-50 dark:bg-[#14213D]/40 text-xs font-bold uppercase tracking-wider text-slate-500">
            Cross-Service & Institutional Dependencies ({dependencies.length})
          </div>

          {dependencies.map(dep => (
            <div key={dep.id} className="p-5 space-y-2">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white">
                  <GitBranch className="w-4 h-4 text-teal-600" />
                  <span>{dep.dependentTask}</span>
                  <span className="text-slate-400">requires</span>
                  <span className="text-teal-700 dark:text-teal-400">{dep.requiredTaskOrResource}</span>
                </div>
                {dep.isBlocked && (
                  <span className="text-xs font-bold text-rose-700 bg-rose-50 dark:bg-rose-950/50 dark:text-rose-300 px-2 py-0.5 rounded-md border border-rose-200 dark:border-rose-800">
                    BLOCKED
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {dep.relationship}
              </p>

              <div className="p-2.5 bg-slate-50 dark:bg-slate-900/60 rounded-lg text-xs font-mono text-slate-500">
                <strong>Evidence:</strong> {dep.supportingEvidence}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: Unresolved Questions */}
      {activeTab === 'questions' && (
        <div className="bg-white dark:bg-[#0B1730] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
          <div className="p-4 sm:px-6 bg-slate-50 dark:bg-[#14213D]/40 text-xs font-bold uppercase tracking-wider text-slate-500">
            Critical Unresolved Project Inquiries ({questions.length})
          </div>

          {questions.map(q => (
            <div key={q.id} className="p-5 space-y-2">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>{q.question}</span>
                </h3>
                <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 dark:bg-amber-950/50 dark:text-amber-300 px-2 py-0.5 rounded-md uppercase">
                  {q.status}
                </span>
              </div>

              <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                <strong>Why It Matters:</strong> {q.whyItMatters}
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                <span>Suggested Verifier: <strong className="text-slate-700 dark:text-slate-200">{q.suggestedVerifier}</strong></span>
                <span>·</span>
                <span>Source: {q.relatedSourceTitle}</span>
              </div>
            </div>
          ))}
        </div>
      )}
        </>
      )}
    </div>
  );
};
