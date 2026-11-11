export type UserRole = 'owner' | 'reviewer' | 'successor' | 'viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleTitle: string;
  avatar: string;
  department: string;
}

export type VerificationStatus = 'verified' | 'inferred' | 'conflicting' | 'missing' | 'unknown';

export interface Project {
  id: string;
  name: string;
  tagline: string;
  description: string;
  department: string;
  status: 'active' | 'in_transition' | 'completed';
  outgoingLeadId: string;
  successorId: string;
  reviewerId: string;
  createdAt: string;
  updatedAt: string;
}

export type SourceClassification = 'public' | 'internal' | 'confidential';

export interface Source {
  id: string;
  projectId: string;
  filename: string;
  fileType: 'pdf' | 'docx' | 'txt' | 'md' | 'csv';
  size: number;
  uploadedAt: string;
  uploadedBy: string;
  status: 'uploaded' | 'processing' | 'processed' | 'needs_attention' | 'failed';
  classification: SourceClassification;
  wordCount: number;
  checksum: string;
  rawText: string;
  excerptsCount: number;
}

export interface SourceExcerpt {
  id: string;
  sourceId: string;
  sourceTitle: string;
  sectionTitle: string;
  pageNumber?: number;
  text: string;
  charOffset?: number;
}

export interface Decision {
  id: string;
  projectId: string;
  title: string;
  description: string;
  reasoning: string;
  decisionMaker: string;
  date: string; // ISO date or "Unknown Date"
  category: 'architecture' | 'infrastructure' | 'product' | 'security' | 'process';
  verificationStatus: VerificationStatus;
  evidenceSourceIds: string[];
  evidenceExcerpt: string;
  evidenceSourceTitle: string;
}

export interface Task {
  id: string;
  projectId: string;
  name: string;
  description: string;
  owner: string; // "Unassigned / Missing Owner" if missing
  deadline: string; // ISO date or "Missing Deadline"
  status: 'not_started' | 'in_progress' | 'blocked' | 'completed';
  dependencies: string[];
  verificationStatus: VerificationStatus;
  evidenceSourceTitle: string;
  evidenceExcerpt: string;
}

export type RiskSeverity = 'critical' | 'high' | 'medium' | 'low';
export type RiskStatus = 'open' | 'under_review' | 'resolved' | 'accepted';

export interface Risk {
  id: string;
  projectId: string;
  title: string;
  description: string;
  severity: RiskSeverity;
  severityReason: string;
  potentialImpact: string;
  supportingEvidence: string;
  evidenceSourceTitle: string;
  mitigation: string;
  status: RiskStatus;
  assignedReviewer: string;
  resolutionNote?: string;
  affectedPerson?: string;
}

export interface Dependency {
  id: string;
  projectId: string;
  dependentTask: string;
  requiredTaskOrResource: string;
  relationship: string;
  supportingEvidence: string;
  isBlocked: boolean;
}

export interface UnresolvedQuestion {
  id: string;
  projectId: string;
  question: string;
  whyItMatters: string;
  relatedSourceTitle: string;
  suggestedVerifier: string;
  status: 'unresolved' | 'answered' | 'delegated';
  resolution?: string;
}

export interface Contact {
  id: string;
  projectId: string;
  name: string;
  role: string;
  context: string;
  email: string;
  sourceReference: string;
}

export interface RecurringProblem {
  id: string;
  projectId: string;
  issue: string;
  frequency: string;
  supportingEvidence: string;
  potentialImpact: string;
}

export type HandoverStatus = 'draft' | 'in_review' | 'changes_requested' | 'approved' | 'shared' | 'acknowledged';
export type HandoverScope = 'full' | 'technical' | 'operations' | 'restricted';

export interface HandoverClaim {
  id: string;
  section: 'overview' | 'decisions' | 'tasks' | 'risks' | 'dependencies' | 'questions' | 'contacts' | 'roadmap';
  title: string;
  content: string;
  verificationStatus: VerificationStatus;
  evidenceSourceTitle: string;
  evidenceExcerpt: string;
  pageOrSection?: string;
  reviewerNotes?: string;
  isApproved: boolean;
  isRejected: boolean;
  isEdited: boolean;
  conflictDetails?: string;
}

export interface HandoverVersion {
  id: string;
  versionNumber: number;
  createdAt: string;
  createdBy: string;
  changeSummary: string;
  snapshotClaimsCount: number;
}

export interface Handover {
  id: string;
  projectId: string;
  title: string;
  outgoingUserId: string;
  successorUserId: string;
  permittedScope: HandoverScope;
  status: HandoverStatus;
  currentVersion: number;
  createdAt: string;
  updatedAt: string;
  approvedAt?: string;
  approvedBy?: string;
  sharedAt?: string;
  acknowledgedAt?: string;
  successorSignoffNote?: string;
  claims: HandoverClaim[];
  versions: HandoverVersion[];
  readinessChecklist: {
    id: string;
    text: string;
    timeframe: 'Day 1-7' | 'Day 8-30' | 'First Quarter';
    category: 'Credentials' | 'Architecture' | 'Process' | 'Stakeholders';
    completed: boolean;
    completedAt?: string;
  }[];
}

export interface ActivityLog {
  id: string;
  projectId: string;
  timestamp: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  entityType: 'source' | 'reconstruction' | 'claim' | 'handover' | 'risk' | 'acknowledgement' | 'access';
  entityName: string;
  details: string;
}

export interface AbsenceDrillResult {
  personName: string;
  personRole: string;
  tasksAtRisk: Task[];
  decisionsRelyingOnPerson: Decision[];
  blockedDependencies: Dependency[];
  unansweredQuestions: UnresolvedQuestion[];
  undocumentedAreas: string[];
  contactsToVerify: Contact[];
  readinessScore: number; // 0 - 100
  mitigationChecklist: string[];
}
