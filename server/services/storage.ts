import fs from 'fs';
import path from 'path';
import {
  Project,
  User,
  Source,
  Decision,
  Task,
  Risk,
  Dependency,
  UnresolvedQuestion,
  Contact,
  RecurringProblem,
  Handover,
  ActivityLog,
  AbsenceDrillResult,
  RiskStatus,
  HandoverStatus
} from '../../src/types/index.js';
import {
  DEMO_USERS,
  DEMO_PROJECTS,
  DEMO_SOURCES,
  DEMO_DECISIONS,
  DEMO_TASKS,
  DEMO_RISKS,
  DEMO_DEPENDENCIES,
  DEMO_QUESTIONS,
  DEMO_CONTACTS,
  DEMO_RECURRING_PROBLEMS,
  DEMO_HANDOVERS,
  DEMO_ACTIVITY_LOGS
} from '../data/demoData.js';

interface ContinuityDatabase {
  users: User[];
  projects: Project[];
  sources: Source[];
  decisions: Decision[];
  tasks: Task[];
  risks: Risk[];
  dependencies: Dependency[];
  questions: UnresolvedQuestion[];
  contacts: Contact[];
  recurringProblems: RecurringProblem[];
  handovers: Handover[];
  activityLogs: ActivityLog[];
}

const DB_FILE_PATH = path.join(process.cwd(), '.continuity_data.json');

class StorageService {
  private db: ContinuityDatabase;

  constructor() {
    this.db = this.loadInitialData();
  }

  private loadInitialData(): ContinuityDatabase {
    try {
      if (fs.existsSync(DB_FILE_PATH)) {
        const content = fs.readFileSync(DB_FILE_PATH, 'utf-8');
        return JSON.parse(content);
      }
    } catch {
      // fallback to clone
    }
    return this.createCleanDemoDatabase();
  }

  private createCleanDemoDatabase(): ContinuityDatabase {
    return {
      users: JSON.parse(JSON.stringify(DEMO_USERS)),
      projects: JSON.parse(JSON.stringify(DEMO_PROJECTS)),
      sources: JSON.parse(JSON.stringify(DEMO_SOURCES)),
      decisions: JSON.parse(JSON.stringify(DEMO_DECISIONS)),
      tasks: JSON.parse(JSON.stringify(DEMO_TASKS)),
      risks: JSON.parse(JSON.stringify(DEMO_RISKS)),
      dependencies: JSON.parse(JSON.stringify(DEMO_DEPENDENCIES)),
      questions: JSON.parse(JSON.stringify(DEMO_QUESTIONS)),
      contacts: JSON.parse(JSON.stringify(DEMO_CONTACTS)),
      recurringProblems: JSON.parse(JSON.stringify(DEMO_RECURRING_PROBLEMS)),
      handovers: JSON.parse(JSON.stringify(DEMO_HANDOVERS)),
      activityLogs: JSON.parse(JSON.stringify(DEMO_ACTIVITY_LOGS))
    };
  }

  private persist() {
    try {
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(this.db, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write db to disk:', err);
    }
  }

  public resetDemoData(): void {
    this.db = this.createCleanDemoDatabase();
    this.persist();
  }

  public getUsers(): User[] {
    return this.db.users;
  }

  public getUserById(id: string): User | undefined {
    return this.db.users.find(u => u.id === id);
  }

  public getProjects(): Project[] {
    return this.db.projects;
  }

  public getProjectById(id: string): Project | undefined {
    return this.db.projects.find(p => p.id === id);
  }

  public getSources(projectId?: string): Source[] {
    if (!projectId) return this.db.sources;
    return this.db.sources.filter(s => s.projectId === projectId);
  }

  public getSourceById(id: string): Source | undefined {
    return this.db.sources.find(s => s.id === id);
  }

  public addSource(source: Source): Source {
    this.db.sources.unshift(source);
    this.logActivity({
      id: `act_${Date.now()}`,
      projectId: source.projectId,
      timestamp: new Date().toISOString(),
      actorName: source.uploadedBy,
      actorRole: 'owner',
      action: 'UPLOAD_SOURCE',
      entityType: 'source',
      entityName: source.filename,
      details: `Uploaded new ${source.fileType.toUpperCase()} document (${source.wordCount} words, classification: ${source.classification}).`
    });
    this.persist();
    return source;
  }

  public deleteSource(id: string, actorName: string): boolean {
    const idx = this.db.sources.findIndex(s => s.id === id);
    if (idx === -1) return false;
    const removed = this.db.sources.splice(idx, 1)[0];
    this.logActivity({
      id: `act_${Date.now()}`,
      projectId: removed.projectId,
      timestamp: new Date().toISOString(),
      actorName,
      actorRole: 'owner',
      action: 'DELETE_SOURCE',
      entityType: 'source',
      entityName: removed.filename,
      details: `Removed source document ${removed.filename}.`
    });
    this.persist();
    return true;
  }

  public getDecisions(projectId: string): Decision[] {
    return this.db.decisions.filter(d => d.projectId === projectId);
  }

  public setDecisions(projectId: string, decisions: Decision[]): void {
    this.db.decisions = this.db.decisions.filter(d => d.projectId !== projectId).concat(decisions);
    this.persist();
  }

  public getTasks(projectId: string): Task[] {
    return this.db.tasks.filter(t => t.projectId === projectId);
  }

  public setTasks(projectId: string, tasks: Task[]): void {
    this.db.tasks = this.db.tasks.filter(t => t.projectId !== projectId).concat(tasks);
    this.persist();
  }

  public getRisks(projectId: string): Risk[] {
    return this.db.risks.filter(r => r.projectId === projectId);
  }

  public setRisks(projectId: string, risks: Risk[]): void {
    this.db.risks = this.db.risks.filter(r => r.projectId !== projectId).concat(risks);
    this.persist();
  }

  public updateRiskStatus(riskId: string, status: RiskStatus, resolutionNote?: string, reviewerName = 'Dr. Sarah Chen'): Risk | null {
    const risk = this.db.risks.find(r => r.id === riskId);
    if (!risk) return null;
    risk.status = status;
    if (resolutionNote !== undefined) {
      risk.resolutionNote = resolutionNote;
    }
    this.logActivity({
      id: `act_${Date.now()}`,
      projectId: risk.projectId,
      timestamp: new Date().toISOString(),
      actorName: reviewerName,
      actorRole: 'reviewer',
      action: 'UPDATE_RISK',
      entityType: 'risk',
      entityName: risk.title,
      details: `Updated risk status to "${status.toUpperCase()}". ${resolutionNote ? `Note: ${resolutionNote}` : ''}`
    });
    this.persist();
    return risk;
  }

  public getDependencies(projectId: string): Dependency[] {
    return this.db.dependencies.filter(d => d.projectId === projectId);
  }

  public setDependencies(projectId: string, dependencies: Dependency[]): void {
    this.db.dependencies = this.db.dependencies.filter(d => d.projectId !== projectId).concat(dependencies);
    this.persist();
  }

  public getQuestions(projectId: string): UnresolvedQuestion[] {
    return this.db.questions.filter(q => q.projectId === projectId);
  }

  public setQuestions(projectId: string, questions: UnresolvedQuestion[]): void {
    this.db.questions = this.db.questions.filter(q => q.projectId !== projectId).concat(questions);
    this.persist();
  }

  public getContacts(projectId: string): Contact[] {
    return this.db.contacts.filter(c => c.projectId === projectId);
  }

  public setContacts(projectId: string, contacts: Contact[]): void {
    this.db.contacts = this.db.contacts.filter(c => c.projectId !== projectId).concat(contacts);
    this.persist();
  }

  public getRecurringProblems(projectId: string): RecurringProblem[] {
    return this.db.recurringProblems.filter(p => p.projectId === projectId);
  }

  public setRecurringProblems(projectId: string, problems: RecurringProblem[]): void {
    this.db.recurringProblems = this.db.recurringProblems.filter(p => p.projectId !== projectId).concat(problems);
    this.persist();
  }

  public getHandovers(projectId: string): Handover[] {
    return this.db.handovers.filter(h => h.projectId === projectId);
  }

  public getHandoverById(id: string): Handover | undefined {
    return this.db.handovers.find(h => h.id === id);
  }

  public createHandover(handover: Handover): Handover {
    this.db.handovers.unshift(handover);
    this.logActivity({
      id: `act_${Date.now()}`,
      projectId: handover.projectId,
      timestamp: new Date().toISOString(),
      actorName: 'Alex Rivera',
      actorRole: 'owner',
      action: 'CREATE_HANDOVER',
      entityType: 'handover',
      entityName: handover.title,
      details: `Created draft handover targeting successor Jordan Lee with scope: ${handover.permittedScope.toUpperCase()}.`
    });
    this.persist();
    return handover;
  }

  public updateHandoverClaim(
    handoverId: string,
    claimId: string,
    updates: Partial<{
      title: string;
      content: string;
      reviewerNotes: string;
      isApproved: boolean;
      isRejected: boolean;
      conflictDetails?: string;
    }>,
    reviewerName: string
  ): Handover | null {
    const handover = this.db.handovers.find(h => h.id === handoverId);
    if (!handover) return null;
    const claim = handover.claims.find(c => c.id === claimId);
    if (!claim) return null;

    if (updates.title !== undefined) claim.title = updates.title;
    if (updates.content !== undefined) claim.content = updates.content;
    if (updates.reviewerNotes !== undefined) claim.reviewerNotes = updates.reviewerNotes;
    if (updates.isApproved !== undefined) claim.isApproved = updates.isApproved;
    if (updates.isRejected !== undefined) claim.isRejected = updates.isRejected;
    if (updates.conflictDetails !== undefined) claim.conflictDetails = updates.conflictDetails;
    claim.isEdited = true;
    handover.updatedAt = new Date().toISOString();

    this.logActivity({
      id: `act_${Date.now()}`,
      projectId: handover.projectId,
      timestamp: new Date().toISOString(),
      actorName: reviewerName,
      actorRole: 'reviewer',
      action: 'UPDATE_CLAIM',
      entityType: 'claim',
      entityName: claim.title,
      details: `Reviewer edited claim. Approved: ${claim.isApproved}, Rejected: ${claim.isRejected}.`
    });
    this.persist();
    return handover;
  }

  public updateHandoverStatus(
    handoverId: string,
    newStatus: HandoverStatus,
    actorName: string,
    actorRole: 'owner' | 'reviewer' | 'successor' | 'viewer',
    changeSummary?: string
  ): Handover | null {
    const handover = this.db.handovers.find(h => h.id === handoverId);
    if (!handover) return null;

    handover.status = newStatus;
    handover.updatedAt = new Date().toISOString();

    if (newStatus === 'approved') {
      handover.approvedAt = new Date().toISOString();
      handover.approvedBy = actorName;
    } else if (newStatus === 'shared') {
      handover.sharedAt = new Date().toISOString();
    } else if (newStatus === 'acknowledged') {
      handover.acknowledgedAt = new Date().toISOString();
    }

    if (changeSummary) {
      handover.currentVersion += 1;
      handover.versions.push({
        id: `ver_${Date.now()}`,
        versionNumber: handover.currentVersion,
        createdAt: new Date().toISOString(),
        createdBy: actorName,
        changeSummary,
        snapshotClaimsCount: handover.claims.length
      });
    }

    this.logActivity({
      id: `act_${Date.now()}`,
      projectId: handover.projectId,
      timestamp: new Date().toISOString(),
      actorName,
      actorRole,
      action: 'UPDATE_HANDOVER_STATUS',
      entityType: 'handover',
      entityName: handover.title,
      details: `Status transitioned to "${newStatus.toUpperCase()}". ${changeSummary ? `Note: ${changeSummary}` : ''}`
    });
    this.persist();
    return handover;
  }

  public acknowledgeHandover(
    handoverId: string,
    successorName: string,
    signoffNote: string,
    completedChecklistIds: string[]
  ): Handover | null {
    const handover = this.db.handovers.find(h => h.id === handoverId);
    if (!handover) return null;

    handover.status = 'acknowledged';
    handover.acknowledgedAt = new Date().toISOString();
    handover.successorSignoffNote = signoffNote;

    handover.readinessChecklist.forEach(item => {
      if (completedChecklistIds.includes(item.id)) {
        item.completed = true;
        item.completedAt = new Date().toISOString();
      }
    });

    this.logActivity({
      id: `act_${Date.now()}`,
      projectId: handover.projectId,
      timestamp: new Date().toISOString(),
      actorName: successorName,
      actorRole: 'successor',
      action: 'ACKNOWLEDGE_HANDOVER',
      entityType: 'acknowledgement',
      entityName: handover.title,
      details: `Successor formally signed and acknowledged handover receipt. Sign-off note: "${signoffNote}". ${completedChecklistIds.length} onboarding tasks confirmed.`
    });
    this.persist();
    return handover;
  }

  public getActivityLogs(projectId: string): ActivityLog[] {
    return this.db.activityLogs
      .filter(l => l.projectId === projectId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  public logActivity(entry: ActivityLog): void {
    this.db.activityLogs.unshift(entry);
    this.persist();
  }

  public runAbsenceDrill(projectId: string, personName: string): AbsenceDrillResult {
    const tasks = this.getTasks(projectId);
    const decisions = this.getDecisions(projectId);
    const dependencies = this.getDependencies(projectId);
    const questions = this.getQuestions(projectId);
    const contacts = this.getContacts(projectId);

    const nameLower = personName.toLowerCase();

    // Tasks associated with that person
    const tasksAtRisk = tasks.filter(t => t.owner.toLowerCase().includes(nameLower));

    // Decisions relying on their knowledge or made by them
    const decisionsRelying = decisions.filter(d => 
      d.decisionMaker.toLowerCase().includes(nameLower) ||
      d.reasoning.toLowerCase().includes(nameLower) ||
      d.description.toLowerCase().includes(nameLower)
    );

    // Blocked dependencies
    const blockedDeps = dependencies.filter(dep => 
      dep.isBlocked || tasksAtRisk.some(t => t.name.toLowerCase() === dep.dependentTask.toLowerCase())
    );

    // Questions needing their verifier input
    const unansweredQuestions = questions.filter(q => 
      q.suggestedVerifier.toLowerCase().includes(nameLower) ||
      q.question.toLowerCase().includes(nameLower)
    );

    // Undocumented areas
    const undocumentedAreas: string[] = [];
    if (nameLower.includes('alex')) {
      undocumentedAreas.push('Staging VM Bastion SSH Private Key stored exclusively on personal laptop (~/.ssh/campus_staging_ed25519)');
      undocumentedAreas.push('Deployment scripts in /opt/deploy-scripts on staging VM lack repository backup or runbook');
      undocumentedAreas.push('GCP Cloud SQL production credentials in phone password note rather than GCP Secret Manager');
      undocumentedAreas.push('Nightly data sanitization cron jobs running without central scheduling monitor');
    }

    // Contacts requiring verification
    const contactsToVerify = contacts.filter(c => c.name.toLowerCase() !== nameLower);

    // Calculate empirical readiness score (0-100)
    // Formula: Penalize for orphaned tasks, single-person decisions, undocumented areas, and unanswered questions
    let score = 100;
    score -= tasksAtRisk.length * 8;
    score -= decisionsRelying.length * 5;
    score -= undocumentedAreas.length * 10;
    score -= unansweredQuestions.length * 6;
    score = Math.max(15, Math.min(95, score));

    const mitigationChecklist: string[] = [
      `Transfer private SSH credentials from ${personName}'s local machine to institutional 1Password vault`,
      `Reassign ${tasksAtRisk.length} active tasks to incoming successor and update deadlines`,
      `Document and commit custom deployment scripts to version control with automated CI/CD pipeline`,
      `Schedule formal knowledge transfer review session with faculty advisor regarding the ${decisionsRelying.length} key architecture decisions`,
      `Resolve remaining ${unansweredQuestions.length} critical project questions before departure date`
    ];

    return {
      personName,
      personRole: nameLower.includes('alex') ? 'Lead Software Architect' : 'Team Member',
      tasksAtRisk,
      decisionsRelyingOnPerson: decisionsRelying,
      blockedDependencies: blockedDeps,
      unansweredQuestions,
      undocumentedAreas,
      contactsToVerify,
      readinessScore: score,
      mitigationChecklist
    };
  }
}

export const storage = new StorageService();
