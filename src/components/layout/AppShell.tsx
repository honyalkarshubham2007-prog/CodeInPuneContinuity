import React, { useState } from 'react';
import {
  LayoutDashboard,
  FolderGit2,
  FileText,
  Clock,
  ShieldAlert,
  GitPullRequest,
  UserCheck,
  Users,
  History,
  Settings,
  ChevronDown,
  Sun,
  Moon,
  RotateCcw,
  Compass,
  Menu,
  X,
  Search,
  UserCircle,
  AlertTriangle
} from 'lucide-react';
import { Project, User } from '../../types/index.js';

interface AppShellProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  projects: Project[];
  selectedProject: Project | null;
  onSelectProject: (proj: Project) => void;
  users: User[];
  currentUser: User;
  onSwitchUser: (user: User) => void;
  onOpenTour: () => void;
  onResetDemo: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({
  currentTab,
  onSelectTab,
  projects,
  selectedProject,
  onSelectProject,
  users,
  currentUser,
  onSwitchUser,
  onOpenTour,
  onResetDemo,
  theme,
  onToggleTheme,
  children
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [projectDropdownOpen, setProjectDropdownOpen] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Global Cmd+K shortcut
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchModalOpen(prev => !prev);
      } else if (e.key === 'Escape') {
        setSearchModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'projects', label: 'Projects', icon: FolderGit2 },
    { id: 'sources', label: 'Knowledge Sources', icon: FileText, badge: '7 Docs' },
    { id: 'decisions', label: 'Decision Timeline', icon: Clock },
    { id: 'risks', label: 'Continuity Risks', icon: ShieldAlert, badgeAlert: true },
    { id: 'drill', label: 'Departure Drill', icon: AlertTriangle },
    { id: 'handovers', label: 'Handover Studio', icon: GitPullRequest, badge: 'In Review' },
    { id: 'successor', label: 'My Handover', icon: UserCheck },
    { id: 'team', label: 'Team & Access', icon: Users },
    { id: 'activity', label: 'Activity Log', icon: History },
    { id: 'settings', label: 'Settings & Roadmap', icon: Settings }
  ];

  const handleReset = async () => {
    setResetting(true);
    await onResetDemo();
    setTimeout(() => setResetting(false), 500);
  };

  const getBreadcrumbTitle = (tab: string) => {
    const item = navItems.find(n => n.id === tab);
    return item ? item.label : 'Dashboard';
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-[#080F20] overflow-hidden text-slate-800 dark:text-slate-100">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 lg:hidden backdrop-blur-xs"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-[#0B1730] border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-200 lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Lockup */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <img src="/brand/icon.svg" alt="ContinuityOS" className="w-8 h-8 rounded-lg shadow-xs" />
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
                CONTINUITY<span className="text-teal-600 dark:text-teal-400">OS</span>
              </span>
              <span className="text-[9px] font-semibold tracking-wider text-slate-400 uppercase -mt-0.5">
                Knowledge Continuity
              </span>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            aria-label="Close navigation"
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Active Project Ribbon */}
        {selectedProject && (
          <div className="px-4 py-3 bg-slate-50/80 dark:bg-[#14213D]/40 border-b border-slate-200/80 dark:border-slate-800/80">
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Active Workspace</div>
            <div className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate mt-0.5">
              {selectedProject.name}
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-slate-900 text-white dark:bg-teal-600 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                  }`}>
                    {item.badge}
                  </span>
                )}
                {item.badgeAlert && (
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${
                    isActive ? 'bg-amber-400 text-slate-950' : 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
                  }`}>
                    2 Critical
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Demo Quick Reset for Judges */}
        <div className="p-3 border-t border-slate-200/80 dark:border-slate-800 space-y-2">
          <button
            onClick={onOpenTour}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-teal-700 bg-teal-50 dark:bg-teal-950/50 dark:text-teal-300 rounded-lg hover:bg-teal-100 dark:hover:bg-teal-900/50 transition-colors"
          >
            <Compass className="w-4 h-4" />
            <span>Interactive Workflow Tour</span>
          </button>
          
          <button
            onClick={handleReset}
            disabled={resetting}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 text-[11px] font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${resetting ? 'animate-spin' : ''}`} />
            <span>{resetting ? 'Restoring demo...' : 'Reset Demo State'}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-16 px-4 sm:px-6 bg-white dark:bg-[#0B1730] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 z-30 shrink-0">
          {/* Left Zone: Sidebar toggle & Breadcrumbs */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
              className="p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 lg:hidden rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb Trail */}
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 truncate">
              {/* Project Selector Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setProjectDropdownOpen(!projectDropdownOpen)}
                  className="font-bold text-slate-900 dark:text-white flex items-center gap-1 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  <span className="truncate max-w-[150px] sm:max-w-[200px]">
                    {selectedProject ? selectedProject.name : 'Select Project'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {projectDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-64 bg-white dark:bg-[#0B1730] rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 z-50">
                    <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Switch Workspace
                    </div>
                    {projects.map(p => (
                      <button
                        key={p.id}
                        onClick={() => {
                          onSelectProject(p);
                          setProjectDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs transition-colors flex flex-col ${
                          selectedProject?.id === p.id
                            ? 'bg-teal-50 text-teal-800 dark:bg-teal-950/40 dark:text-teal-300 font-semibold'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <span className="truncate">{p.name}</span>
                        <span className="text-[10px] text-slate-400 truncate">{p.department}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <span className="text-slate-300 dark:text-slate-700">/</span>
              <span className="font-medium text-slate-600 dark:text-slate-300 truncate">
                {getBreadcrumbTitle(currentTab)}
              </span>
            </div>
          </div>

          {/* Right Zone: Controls, Demo Role Switcher, Theme Toggle */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Quick Navigation / Search Trigger */}
            <button
              onClick={() => setSearchModalOpen(true)}
              aria-label="Quick search navigation"
              className="hidden md:flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span>Search platform...</span>
              <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 text-slate-400 shadow-2xs">
                ⌘K
              </kbd>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={onToggleTheme}
              aria-label="Toggle color theme"
              className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Demo Role Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors text-left"
              >
                <div className="w-6 h-6 rounded-full bg-slate-900 text-white dark:bg-teal-600 flex items-center justify-center text-xs font-bold">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="hidden sm:flex flex-col">
                  <div className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                    Role: {currentUser.role.toUpperCase()}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1 hidden sm:block" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-[#0B1730] rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50">
                  <div className="px-3.5 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                    Switch Active Demo Persona
                  </div>
                  <div className="py-1">
                    {users.map(u => (
                      <button
                        key={u.id}
                        onClick={() => {
                          onSwitchUser(u);
                          setUserDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-2 text-xs transition-colors flex items-center gap-2.5 ${
                          currentUser.id === u.id
                            ? 'bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300 font-semibold'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-xs text-slate-700 dark:text-slate-300 shrink-0">
                          {u.name.charAt(0)}
                        </div>
                        <div className="truncate">
                          <div className="font-medium text-slate-900 dark:text-white truncate">{u.name}</div>
                          <div className="text-[11px] text-slate-400 truncate">{u.roleTitle}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Viewport Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>

      {/* Quick Search / Command Palette Modal */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-start justify-center pt-16 sm:pt-24 p-4">
          <div 
            className="w-full max-w-xl bg-white dark:bg-[#0B1730] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150"
            role="dialog"
            aria-modal="true"
          >
            {/* Search Input Bar */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3 bg-slate-50/50 dark:bg-[#14213D]/40">
              <Search className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0" />
              <input
                type="text"
                autoFocus
                placeholder="Type a module, topic, or risk (e.g. 'risks', 'drill', 'redis', 'bastion')..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full text-sm bg-transparent border-none text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
              />
              <button
                onClick={() => setSearchModalOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Results / Navigation Suggestions */}
            <div className="p-2 max-h-80 overflow-y-auto space-y-1">
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Quick Jump to Platform Modules
              </div>
              {navItems
                .filter(item =>
                  !searchQuery ||
                  item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  item.id.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map(item => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelectTab(item.id);
                        setSearchModalOpen(false);
                        setSearchQuery('');
                      }}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 group-hover:text-teal-600 transition-colors">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-teal-600 dark:group-hover:text-teal-400">
                            {item.label}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            Tab: #{item.id}
                          </div>
                        </div>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">Jump →</span>
                    </button>
                  );
                })}

              {/* Sample Knowledge Queries */}
              <div className="px-3 pt-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-t border-slate-100 dark:border-slate-800 mt-2">
                Knowledge Insights & Scenarios
              </div>
              {[
                { label: 'Single-Person Knowledge Concentration (Alex Rivera)', tab: 'drill', tag: 'Departure Drill' },
                { label: 'Undocumented Bastion Host SSH Keys', tab: 'risks', tag: 'Continuity Risk' },
                { label: 'Redis vs PostgreSQL Architecture Conflict', tab: 'decisions', tag: 'Decision Timeline' },
                { label: 'Unfunded Cloud Infrastructure Bill', tab: 'risks', tag: 'Continuity Risk' },
                { label: 'Successor Day 1-30 Readiness Checklist', tab: 'successor', tag: 'Onboarding' }
              ]
                .filter(q =>
                  !searchQuery ||
                  q.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  q.tag.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      onSelectTab(q.tab);
                      setSearchModalOpen(false);
                      setSearchQuery('');
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors text-left group"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-teal-500 shrink-0" />
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-300 group-hover:text-teal-600 dark:group-hover:text-teal-400 truncate">
                        {q.label}
                      </span>
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 uppercase shrink-0">
                      {q.tag}
                    </span>
                  </button>
                ))}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#14213D]/40 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Tip: Press <kbd className="px-1 py-0.5 font-mono bg-white dark:bg-slate-800 border rounded">Esc</kbd> to close</span>
              <span>ContinuityOS Global Index</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
