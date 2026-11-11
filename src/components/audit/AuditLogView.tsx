import React, { useState } from 'react';
import { History, Filter, Search, Shield, User, Clock } from 'lucide-react';
import { ActivityLog } from '../../types/index.js';

interface AuditLogViewProps {
  activityLogs: ActivityLog[];
}

export const AuditLogView: React.FC<AuditLogViewProps> = ({ activityLogs }) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = activityLogs.filter(log => {
    const matchesFilter = filterType === 'all' || log.entityType === filterType;
    const matchesSearch =
      log.actorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.entityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900 dark:text-white">
          Activity & Audit Log
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Immutable event log tracking all source uploads, knowledge reconstructions, claim edits, approvals, and successor sign-offs.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white dark:bg-[#0B1730] rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider shrink-0">Filter By:</span>
          {['all', 'source', 'reconstruction', 'claim', 'handover', 'risk', 'acknowledgement'].map(ft => (
            <button
              key={ft}
              onClick={() => setFilterType(ft)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg capitalize transition-colors shrink-0 ${
                filterType === ft
                  ? 'bg-slate-900 text-white dark:bg-teal-600'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {ft}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-60">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search audit trail..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white dark:bg-[#0B1730] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
        {filteredLogs.map(log => (
          <div key={log.id} className="p-4 sm:p-5 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-xs text-slate-600 dark:text-slate-300 shrink-0 mt-0.5">
                {log.actorName.charAt(0)}
              </div>

              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {log.actorName}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 uppercase">
                    ({log.actorRole})
                  </span>
                  <span className="text-slate-300 dark:text-slate-700">·</span>
                  <span className="text-[11px] font-semibold text-teal-600 dark:text-teal-400 font-mono">
                    {log.action}
                  </span>
                </div>

                <div className="text-xs text-slate-700 dark:text-slate-300 leading-snug">
                  {log.details}
                </div>

                <div className="text-[11px] text-slate-400 font-mono">
                  Entity: <strong>{log.entityName}</strong> ({log.entityType})
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono shrink-0 self-end sm:self-start">
              <Clock className="w-3.5 h-3.5" />
              <span>{new Date(log.timestamp).toLocaleString()}</span>
            </div>
          </div>
        ))}

        {filteredLogs.length === 0 && (
          <div className="p-8 text-center text-xs text-slate-400">
            No audit records match your selected filter criteria.
          </div>
        )}
      </div>
    </div>
  );
};
