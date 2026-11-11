import {
  User,
  Project,
  Source,
  Decision,
  Task,
  Risk,
  Dependency,
  UnresolvedQuestion,
  Contact,
  RecurringProblem,
  Handover,
  HandoverClaim,
  ActivityLog,
  AbsenceDrillResult,
  RiskStatus,
  HandoverStatus
} from '../types/index.js';

export async function fetchWithUser<T>(url: string, options: RequestInit = {}, activeUserId?: string): Promise<T> {
  const headers = new Headers(options.headers || {});
  if (activeUserId) {
    headers.set('x-user-id', activeUserId);
  }
  const res = await fetch(url, { ...options, headers });
  if (!res.ok) {
    let errMessage = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      if (data.error) errMessage = data.error;
    } catch {
      // no json error
    }
    throw new Error(errMessage);
  }
  return res.json();
}

export const api = {
  // Users
  getUsers: (userId?: string) => fetchWithUser<{ users: User[] }>('/api/users', {}, userId),
  
  // Projects
  getProjects: (userId?: string) => fetchWithUser<{ projects: Project[] }>('/api/projects', {}, userId),
  getProject: (id: string, userId?: string) => fetchWithUser<{
    project: Project;
    metrics: {
      sourcesCount: number;
      decisionsCount: number;
      tasksCount: number;
      risksCount: number;
      criticalRisksCount: number;
      handoversCount: number;
      activeHandoverStatus: string;
    };
  }>(`/api/projects/${id}`, {}, userId),

  // Sources
  getSources: (projectId: string, userId?: string) =>
    fetchWithUser<{ sources: Source[] }>(`/api/projects/${projectId}/sources`, {}, userId),
  uploadSource: async (projectId: string, file: File, classification: string, userId?: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('classification', classification);
    const headers = new Headers();
    if (userId) headers.set('x-user-id', userId);
    const res = await fetch(`/api/projects/${projectId}/sources/upload`, {
      method: 'POST',
      headers,
      body: formData
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Upload failed');
    }
    return res.json();
  },
  deleteSource: (id: string, userId?: string) =>
    fetchWithUser<{ success: boolean }>(`/api/sources/${id}`, { method: 'DELETE' }, userId),

  // Knowledge & Reconstruction
  reconstructKnowledge: (projectId: string, userId?: string) =>
    fetchWithUser<{ success: boolean; counts: Record<string, number> }>(
      `/api/projects/${projectId}/reconstruct`,
      { method: 'POST' },
      userId
    ),
  getDecisions: (projectId: string, userId?: string) =>
    fetchWithUser<{ decisions: Decision[] }>(`/api/projects/${projectId}/decisions`, {}, userId),
  getTasks: (projectId: string, userId?: string) =>
    fetchWithUser<{ tasks: Task[] }>(`/api/projects/${projectId}/tasks`, {}, userId),
  getRisks: (projectId: string, userId?: string) =>
    fetchWithUser<{ risks: Risk[] }>(`/api/projects/${projectId}/risks`, {}, userId),
  updateRiskStatus: (riskId: string, status: RiskStatus, resolutionNote?: string, userId?: string) =>
    fetchWithUser<{ success: boolean; risk: Risk }>(
      `/api/risks/${riskId}`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, resolutionNote })
      },
      userId
    ),
  getDependencies: (projectId: string, userId?: string) =>
    fetchWithUser<{ dependencies: Dependency[] }>(`/api/projects/${projectId}/dependencies`, {}, userId),
  getQuestions: (projectId: string, userId?: string) =>
    fetchWithUser<{ questions: UnresolvedQuestion[] }>(`/api/projects/${projectId}/questions`, {}, userId),
  getContacts: (projectId: string, userId?: string) =>
    fetchWithUser<{ contacts: Contact[] }>(`/api/projects/${projectId}/contacts`, {}, userId),
  getRecurringProblems: (projectId: string, userId?: string) =>
    fetchWithUser<{ recurringProblems: RecurringProblem[] }>(`/api/projects/${projectId}/recurring-problems`, {}, userId),

  // Absence Drill
  runAbsenceDrill: (projectId: string, personName: string, userId?: string) =>
    fetchWithUser<{ drillResult: AbsenceDrillResult }>(
      `/api/projects/${projectId}/absence-drill`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ personName })
      },
      userId
    ),

  // Handover Studio
  getHandovers: (projectId: string, userId?: string) =>
    fetchWithUser<{ handovers: Handover[] }>(`/api/projects/${projectId}/handovers`, {}, userId),
  getHandover: (id: string, userId?: string) =>
    fetchWithUser<{ handover: Handover }>(`/api/handovers/${id}`, {}, userId),
  createHandover: (
    projectId: string,
    data: { outgoingUserId: string; successorUserId: string; title: string; permittedScope: string },
    userId?: string
  ) =>
    fetchWithUser<{ success: boolean; handover: Handover }>(
      `/api/projects/${projectId}/handovers`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      },
      userId
    ),
  updateClaim: (
    handoverId: string,
    claimId: string,
    updates: Partial<HandoverClaim>,
    userId?: string
  ) =>
    fetchWithUser<{ success: boolean; handover: Handover }>(
      `/api/handovers/${handoverId}/claims/${claimId}`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      },
      userId
    ),
  updateHandoverStatus: (
    handoverId: string,
    newStatus: HandoverStatus,
    changeSummary?: string,
    userId?: string
  ) =>
    fetchWithUser<{ success: boolean; handover: Handover }>(
      `/api/handovers/${handoverId}/status`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newStatus, changeSummary })
      },
      userId
    ),
  acknowledgeHandover: (
    handoverId: string,
    signoffNote: string,
    completedChecklistIds: string[],
    userId?: string
  ) =>
    fetchWithUser<{ success: boolean; handover: Handover }>(
      `/api/handovers/${handoverId}/acknowledge`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signoffNote, completedChecklistIds })
      },
      userId
    ),

  // Activity & Audit Log
  getActivityLogs: (projectId: string, userId?: string) =>
    fetchWithUser<{ activityLogs: ActivityLog[] }>(`/api/projects/${projectId}/activity`, {}, userId),

  // Reset Demo
  resetDemo: (userId?: string) =>
    fetchWithUser<{ success: boolean; message: string }>('/api/demo/reset', { method: 'POST' }, userId)
};
