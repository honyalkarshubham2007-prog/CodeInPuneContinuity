import React, { useState, useEffect, useCallback } from 'react';
import { AppShell } from './components/layout/AppShell.js';
import { OverviewView } from './components/dashboard/OverviewView.js';
import { ProjectsView } from './components/dashboard/ProjectsView.js';
import { SourcesView } from './components/sources/SourcesView.js';
import { TimelineView } from './components/timeline/TimelineView.js';
import { RisksView } from './components/risks/RisksView.js';
import { AbsenceDrillView } from './components/absence/AbsenceDrillView.js';
import { HandoverStudioView } from './components/handover/HandoverStudioView.js';
import { SuccessorView } from './components/successor/SuccessorView.js';
import { TeamView } from './components/team/TeamView.js';
import { AuditLogView } from './components/audit/AuditLogView.js';
import { SettingsView } from './components/settings/SettingsView.js';
import { EvidenceDrawer, EvidenceData } from './components/evidence/EvidenceDrawer.js';
import { GuidedTourModal } from './components/layout/GuidedTourModal.js';
import { api } from './lib/api.js';
import {
  User,
  Project,
  Source,
  Decision,
  Task,
  Risk,
  Dependency,
  UnresolvedQuestion,
  RecurringProblem,
  Handover,
  ActivityLog,
  SourceClassification,
  RiskStatus,
  HandoverClaim,
  HandoverStatus,
  HandoverScope
} from './types/index.js';

export function App() {
  const [currentTab, setCurrentTab] = useState<string>('overview');
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Project Entity States
  const [sources, setSources] = useState<Source[]>([]);
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [risks, setRisks] = useState<Risk[]>([]);
  const [dependencies, setDependencies] = useState<Dependency[]>([]);
  const [questions, setQuestions] = useState<UnresolvedQuestion[]>([]);
  const [recurringProblems, setRecurringProblems] = useState<RecurringProblem[]>([]);
  const [handovers, setHandovers] = useState<Handover[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);

  // UI state
  const [evidenceData, setEvidenceData] = useState<EvidenceData | null>(null);
  const [tourOpen, setTourOpen] = useState(false);
  const [isReconstructing, setIsReconstructing] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Theme Toggle with persistence
  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Initial load
  useEffect(() => {
    async function init() {
      try {
        const [usersRes, projRes] = await Promise.all([
          api.getUsers(),
          api.getProjects()
        ]);
        setUsers(usersRes.users);
        setCurrentUser(usersRes.users[0]);
        setProjects(projRes.projects);
        setSelectedProject(projRes.projects[0]);
      } catch (err) {
        console.error('Failed to initialize app state:', err);
      }
    }
    init();
  }, []);

  // Load project-specific details
  const refreshProjectData = useCallback(async (projId: string, userId?: string) => {
    try {
      const [
        srcRes,
        decRes,
        tskRes,
        riskRes,
        depRes,
        qRes,
        probRes,
        hndRes,
        actRes
      ] = await Promise.all([
        api.getSources(projId, userId),
        api.getDecisions(projId, userId),
        api.getTasks(projId, userId),
        api.getRisks(projId, userId),
        api.getDependencies(projId, userId),
        api.getQuestions(projId, userId),
        api.getRecurringProblems(projId, userId),
        api.getHandovers(projId, userId),
        api.getActivityLogs(projId, userId)
      ]);

      setSources(srcRes.sources);
      setDecisions(decRes.decisions);
      setTasks(tskRes.tasks);
      setRisks(riskRes.risks);
      setDependencies(depRes.dependencies);
      setQuestions(qRes.questions);
      setRecurringProblems(probRes.recurringProblems);
      setHandovers(hndRes.handovers);
      setActivityLogs(actRes.activityLogs);
    } catch (err) {
      console.error('Failed to refresh project data:', err);
    }
  }, []);

  useEffect(() => {
    if (selectedProject) {
      refreshProjectData(selectedProject.id, currentUser?.id);
    }
  }, [selectedProject, currentUser, refreshProjectData]);

  // Upload handler
  const handleUploadSource = async (file: File, classification: SourceClassification) => {
    if (!selectedProject || !currentUser) return;
    const res = await api.uploadSource(selectedProject.id, file, classification, currentUser.id);
    showToast(`Uploaded and extracted ${file.name} (${res.source.wordCount} words)`);
    await refreshProjectData(selectedProject.id, currentUser.id);
  };

  // Delete source handler
  const handleDeleteSource = async (sourceId: string) => {
    if (!selectedProject || !currentUser) return;
    await api.deleteSource(sourceId, currentUser.id);
    showToast('Document removed from project sources.');
    await refreshProjectData(selectedProject.id, currentUser.id);
  };

  // Trigger Knowledge Reconstruction
  const handleTriggerReconstruction = async () => {
    if (!selectedProject || !currentUser) return;
    setIsReconstructing(true);
    try {
      const res = await api.reconstructKnowledge(selectedProject.id, currentUser.id);
      showToast(`Knowledge graph reconstructed: ${res.counts.decisions} decisions, ${res.counts.risks} risks, ${res.counts.tasks} tasks.`);
      await refreshProjectData(selectedProject.id, currentUser.id);
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Reconstruction failed');
    } finally {
      setIsReconstructing(false);
    }
  };

  // Update Risk Status
  const handleUpdateRiskStatus = async (riskId: string, status: RiskStatus, note?: string) => {
    if (!selectedProject || !currentUser) return;
    await api.updateRiskStatus(riskId, status, note, currentUser.id);
    showToast(`Risk governance status updated to "${status.toUpperCase()}".`);
    await refreshProjectData(selectedProject.id, currentUser.id);
  };

  // Create Handover
  const handleCreateHandover = async (data: {
    outgoingUserId: string;
    successorUserId: string;
    title: string;
    permittedScope: HandoverScope;
  }) => {
    if (!selectedProject || !currentUser) return;
    await api.createHandover(selectedProject.id, data, currentUser.id);
    showToast('Evidence-backed handover generated successfully.');
    await refreshProjectData(selectedProject.id, currentUser.id);
  };

  // Update Claim in Handover
  const handleUpdateClaim = async (claimId: string, updates: Partial<HandoverClaim>) => {
    const activeHandover = handovers[0];
    if (!activeHandover || !selectedProject || !currentUser) return;
    await api.updateClaim(activeHandover.id, claimId, updates, currentUser.id);
    showToast('Handover claim updated.');
    await refreshProjectData(selectedProject.id, currentUser.id);
  };

  // Update Handover Status (Review -> Approved -> Shared)
  const handleUpdateHandoverStatus = async (newStatus: HandoverStatus, summary?: string) => {
    const activeHandover = handovers[0];
    if (!activeHandover || !selectedProject || !currentUser) return;
    await api.updateHandoverStatus(activeHandover.id, newStatus, summary, currentUser.id);
    showToast(`Handover status transitioned to "${newStatus.toUpperCase()}".`);
    await refreshProjectData(selectedProject.id, currentUser.id);
  };

  // Acknowledge Handover (Successor Signoff)
  const handleAcknowledgeHandover = async (signoffNote: string, completedIds: string[]) => {
    const activeHandover = handovers[0];
    if (!activeHandover || !selectedProject || !currentUser) return;
    await api.acknowledgeHandover(activeHandover.id, signoffNote, completedIds, currentUser.id);
    showToast('Successor receipt formally acknowledged and recorded in audit log.');
    await refreshProjectData(selectedProject.id, currentUser.id);
  };

  // Demo Reset
  const handleResetDemo = async () => {
    await api.resetDemo(currentUser?.id);
    showToast('Synthetic demonstration state restored.');
    if (selectedProject) {
      await refreshProjectData(selectedProject.id, currentUser?.id);
    }
  };

  if (!currentUser || !selectedProject) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-50 dark:bg-[#0B1730]">
        <div className="flex flex-col items-center gap-3">
          <img src="/brand/icon.svg" alt="ContinuityOS" className="w-10 h-10 animate-pulse" />
          <div className="text-xs font-mono text-slate-500">Loading ContinuityOS Platform...</div>
        </div>
      </div>
    );
  }

  const activeHandover = handovers[0] || null;

  return (
    <AppShell
      currentTab={currentTab}
      onSelectTab={setCurrentTab}
      projects={projects}
      selectedProject={selectedProject}
      onSelectProject={setSelectedProject}
      users={users}
      currentUser={currentUser}
      onSwitchUser={setCurrentUser}
      onOpenTour={() => setTourOpen(true)}
      onResetDemo={handleResetDemo}
      theme={theme}
      onToggleTheme={toggleTheme}
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white dark:bg-teal-600 px-4 py-2.5 rounded-xl shadow-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Tab Views */}
      {currentTab === 'overview' && (
        <OverviewView
          project={selectedProject}
          sources={sources}
          decisions={decisions}
          tasks={tasks}
          risks={risks}
          handovers={handovers}
          activityLogs={activityLogs}
          currentUser={currentUser}
          onNavigateTab={setCurrentTab}
          onOpenEvidence={setEvidenceData}
          onTriggerReconstruction={handleTriggerReconstruction}
          isReconstructing={isReconstructing}
        />
      )}

      {currentTab === 'projects' && (
        <ProjectsView
          projects={projects}
          selectedProject={selectedProject}
          onSelectProject={setSelectedProject}
          onNavigateTab={setCurrentTab}
        />
      )}

      {currentTab === 'sources' && (
        <SourcesView
          projectId={selectedProject.id}
          sources={sources}
          onUpload={handleUploadSource}
          onDelete={handleDeleteSource}
          onTriggerReconstruction={handleTriggerReconstruction}
          isReconstructing={isReconstructing}
        />
      )}

      {currentTab === 'decisions' && (
        <TimelineView
          decisions={decisions}
          tasks={tasks}
          dependencies={dependencies}
          questions={questions}
          recurringProblems={recurringProblems}
          risks={risks}
          users={users}
          onOpenEvidence={setEvidenceData}
        />
      )}

      {currentTab === 'risks' && (
        <RisksView
          risks={risks}
          onUpdateRiskStatus={handleUpdateRiskStatus}
          onOpenEvidence={setEvidenceData}
          canManageRisks={currentUser.role === 'owner' || currentUser.role === 'reviewer'}
        />
      )}

      {currentTab === 'drill' && (
        <AbsenceDrillView
          projectId={selectedProject.id}
          users={users}
          currentUserId={currentUser.id}
        />
      )}

      {currentTab === 'handovers' && (
        <HandoverStudioView
          project={selectedProject}
          handover={activeHandover}
          users={users}
          currentUser={currentUser}
          onCreateHandover={handleCreateHandover}
          onUpdateClaim={handleUpdateClaim}
          onUpdateStatus={handleUpdateHandoverStatus}
          onOpenEvidence={setEvidenceData}
          onNavigateTab={setCurrentTab}
        />
      )}

      {currentTab === 'successor' && (
        <SuccessorView
          handover={activeHandover}
          project={selectedProject}
          currentUser={currentUser}
          onAcknowledge={handleAcknowledgeHandover}
          onOpenEvidence={setEvidenceData}
          onNavigateTab={setCurrentTab}
        />
      )}

      {currentTab === 'team' && (
        <TeamView
          project={selectedProject}
          users={users}
          currentUser={currentUser}
          onSwitchUser={setCurrentUser}
        />
      )}

      {currentTab === 'activity' && (
        <AuditLogView
          activityLogs={activityLogs}
        />
      )}

      {currentTab === 'settings' && (
        <SettingsView
          currentUser={currentUser}
          project={selectedProject}
          onResetDemo={handleResetDemo}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      )}

      {/* Global Source Evidence Explorer Drawer */}
      <EvidenceDrawer
        evidence={evidenceData}
        onClose={() => setEvidenceData(null)}
        onViewSource={() => {
          setEvidenceData(null);
          setCurrentTab('sources');
        }}
      />

      {/* Guided Onboarding 5-Stage Workflow Tour */}
      <GuidedTourModal
        isOpen={tourOpen}
        onClose={() => setTourOpen(false)}
        onNavigateTab={setCurrentTab}
      />
    </AppShell>
  );
}

export default App;
