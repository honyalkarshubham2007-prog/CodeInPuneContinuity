import React from 'react';
import { Users, Shield, Lock, CheckCircle2, UserCheck, Key, Eye } from 'lucide-react';
import { User, Project } from '../../types/index.js';

interface TeamViewProps {
  project: Project;
  users: User[];
  currentUser: User;
  onSwitchUser: (user: User) => void;
}

export const TeamView: React.FC<TeamViewProps> = ({
  project,
  users,
  currentUser,
  onSwitchUser
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900 dark:text-white">
          Team, Roles & Access Control
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Permission-aware governance enforcing the principle of least privilege across project knowledge and source documents.
        </p>
      </div>

      {/* Role Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {users.map(u => {
          const isCurrent = currentUser.id === u.id;
          return (
            <div
              key={u.id}
              className={`p-5 bg-white dark:bg-[#0B1730] border rounded-2xl shadow-xs transition-all space-y-3 flex flex-col justify-between ${
                isCurrent
                  ? 'border-teal-500 ring-1 ring-teal-500'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-800 dark:text-slate-200 text-sm">
                    {u.name.charAt(0)}
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase font-mono ${
                    u.role === 'owner' ? 'bg-slate-900 text-white dark:bg-teal-600' :
                    u.role === 'reviewer' ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300' :
                    u.role === 'successor' ? 'bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300' :
                    'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  }`}>
                    {u.role}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {u.name}
                  </h3>
                  <p className="text-[11px] text-teal-600 dark:text-teal-400 font-medium">
                    {u.roleTitle}
                  </p>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                    {u.email}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                {isCurrent ? (
                  <span className="text-[11px] font-bold text-teal-600 dark:text-teal-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Active Session Persona</span>
                  </span>
                ) : (
                  <button
                    onClick={() => onSwitchUser(u)}
                    className="w-full py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    Switch to this Persona
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Permission Governance Matrix */}
      <div className="p-6 bg-white dark:bg-[#0B1730] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Principle of Least Privilege Matrix
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            A user's permission to access a project does not automatically grant access to every underlying document or secret.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-mono">
                <th className="py-2.5 pr-4">Document Classification</th>
                <th className="py-2.5 px-4">Project Owner</th>
                <th className="py-2.5 px-4">Advisor Reviewer</th>
                <th className="py-2.5 px-4">Incoming Successor</th>
                <th className="py-2.5 px-4">External Viewer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              <tr>
                <td className="py-3 pr-4 font-bold text-slate-900 dark:text-white">
                  Public Sources (Readmes, architecture overviews)
                </td>
                <td className="py-3 px-4 text-emerald-600 font-semibold">Full Access</td>
                <td className="py-3 px-4 text-emerald-600 font-semibold">Full Access</td>
                <td className="py-3 px-4 text-emerald-600 font-semibold">Full Access</td>
                <td className="py-3 px-4 text-emerald-600 font-semibold">Read Only</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-bold text-slate-900 dark:text-white">
                  Internal Documents (Meeting notes, progress reports)
                </td>
                <td className="py-3 px-4 text-emerald-600 font-semibold">Full Access</td>
                <td className="py-3 px-4 text-emerald-600 font-semibold">Full Access</td>
                <td className="py-3 px-4 text-emerald-600 font-semibold">Scoped Access</td>
                <td className="py-3 px-4 text-slate-400 font-mono">Restricted</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-bold text-slate-900 dark:text-white">
                  Confidential (Infrastructure keys, discussion notes)
                </td>
                <td className="py-3 px-4 text-emerald-600 font-semibold">Full Access</td>
                <td className="py-3 px-4 text-emerald-600 font-semibold">Audit Approval</td>
                <td className="py-3 px-4 text-amber-600 font-semibold">Post-Approval Only</td>
                <td className="py-3 px-4 text-rose-600 font-mono">No Access</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
