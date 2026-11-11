import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { storage } from './server/services/storage.js';
import { extractDocumentContent } from './server/services/extractor.js';
import { runKnowledgeReconstruction } from './server/services/reconstruction.js';
import { Handover, HandoverClaim, Source, SourceClassification } from './src/types/index.js';

const app = express();
const PORT = 3000;

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Multer in-memory storage for document uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 } // 15MB limit
});

// Middleware to resolve acting user from header or query
app.use((req, _res, next) => {
  const userId = (req.headers['x-user-id'] as string) || (req.query.userId as string) || 'user_alex_rivera';
  const user = storage.getUserById(userId) || storage.getUsers()[0];
  (req as unknown as { currentUser: typeof user }).currentUser = user;
  next();
});

// ================= API ROUTES =================

// Users & Current Session
app.get('/api/users', (_req: Request, res: Response) => {
  res.json({ users: storage.getUsers() });
});

app.get('/api/users/current', (req: Request, res: Response) => {
  const user = (req as unknown as { currentUser: unknown }).currentUser;
  res.json({ user });
});

// Projects
app.get('/api/projects', (_req: Request, res: Response) => {
  res.json({ projects: storage.getProjects() });
});

app.get('/api/projects/:id', (req: Request, res: Response) => {
  const project = storage.getProjectById(req.params.id);
  if (!project) {
    res.status(404).json({ error: 'Project not found' });
    return;
  }
  const sources = storage.getSources(project.id);
  const decisions = storage.getDecisions(project.id);
  const tasks = storage.getTasks(project.id);
  const risks = storage.getRisks(project.id);
  const handovers = storage.getHandovers(project.id);

  res.json({
    project,
    metrics: {
      sourcesCount: sources.length,
      decisionsCount: decisions.length,
      tasksCount: tasks.length,
      risksCount: risks.length,
      criticalRisksCount: risks.filter(r => r.severity === 'critical' && r.status !== 'resolved').length,
      handoversCount: handovers.length,
      activeHandoverStatus: handovers[0]?.status || 'none'
    }
  });
});

// Sources Ingestion
app.get('/api/projects/:id/sources', (req: Request, res: Response) => {
  const sources = storage.getSources(req.params.id);
  res.json({ sources });
});

app.post('/api/projects/:id/sources/upload', upload.single('file'), async (req: Request, res: Response) => {
  try {
    const projectId = req.params.id;
    const file = req.file;
    const currentUser = (req as unknown as { currentUser: { name: string; role: string } }).currentUser;

    if (!file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    const filename = file.originalname;
    const ext = path.extname(filename).toLowerCase().replace('.', '') as 'pdf' | 'docx' | 'txt' | 'md' | 'csv';

    const allowedExtensions = ['pdf', 'docx', 'txt', 'md', 'csv'];
    if (!allowedExtensions.includes(ext)) {
      res.status(400).json({ error: `Unsupported file type: .${ext}. Allowed types: ${allowedExtensions.join(', ')}` });
      return;
    }

    const classification = (req.body.classification || 'internal') as SourceClassification;

    // Perform real text extraction
    const extraction = await extractDocumentContent(file.buffer, filename, ext);

    const newSource: Source = {
      id: `src_${Date.now()}`,
      projectId,
      filename,
      fileType: ext,
      size: file.size,
      uploadedAt: new Date().toISOString(),
      uploadedBy: currentUser.name,
      status: 'processed',
      classification,
      wordCount: extraction.wordCount,
      checksum: extraction.checksum,
      rawText: extraction.text,
      excerptsCount: extraction.excerpts.length
    };

    storage.addSource(newSource);

    res.json({
      success: true,
      source: newSource,
      excerpts: extraction.excerpts
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown extraction error';
    res.status(500).json({ error: 'Document extraction failed', details: message });
  }
});

app.delete('/api/sources/:id', (req: Request, res: Response) => {
  const currentUser = (req as unknown as { currentUser: { name: string } }).currentUser;
  const deleted = storage.deleteSource(req.params.id, currentUser.name);
  if (!deleted) {
    res.status(404).json({ error: 'Source not found' });
    return;
  }
  res.json({ success: true });
});

// Knowledge Reconstruction Engine
app.post('/api/projects/:id/reconstruct', async (req: Request, res: Response) => {
  try {
    const projectId = req.params.id;
    const sources = storage.getSources(projectId);
    const knowledge = await runKnowledgeReconstruction(projectId, sources);
    res.json({
      success: true,
      knowledge,
      counts: {
        decisions: knowledge.decisions.length,
        tasks: knowledge.tasks.length,
        risks: knowledge.risks.length,
        dependencies: knowledge.dependencies.length,
        unresolvedQuestions: knowledge.unresolvedQuestions.length,
        contacts: knowledge.contacts.length,
        recurringProblems: knowledge.recurringProblems.length
      }
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Reconstruction error';
    res.status(500).json({ error: 'Reconstruction failed', details: message });
  }
});

// Decisions, Tasks, Risks, Dependencies, Questions, Contacts
app.get('/api/projects/:id/decisions', (req: Request, res: Response) => {
  res.json({ decisions: storage.getDecisions(req.params.id) });
});

app.get('/api/projects/:id/tasks', (req: Request, res: Response) => {
  res.json({ tasks: storage.getTasks(req.params.id) });
});

app.get('/api/projects/:id/risks', (req: Request, res: Response) => {
  res.json({ risks: storage.getRisks(req.params.id) });
});

app.patch('/api/risks/:id', (req: Request, res: Response) => {
  const currentUser = (req as unknown as { currentUser: { name: string } }).currentUser;
  const { status, resolutionNote } = req.body;
  const updated = storage.updateRiskStatus(req.params.id, status, resolutionNote, currentUser.name);
  if (!updated) {
    res.status(404).json({ error: 'Risk not found' });
    return;
  }
  res.json({ success: true, risk: updated });
});

app.get('/api/projects/:id/dependencies', (req: Request, res: Response) => {
  res.json({ dependencies: storage.getDependencies(req.params.id) });
});

app.get('/api/projects/:id/questions', (req: Request, res: Response) => {
  res.json({ questions: storage.getQuestions(req.params.id) });
});

app.get('/api/projects/:id/contacts', (req: Request, res: Response) => {
  res.json({ contacts: storage.getContacts(req.params.id) });
});

app.get('/api/projects/:id/recurring-problems', (req: Request, res: Response) => {
  res.json({ recurringProblems: storage.getRecurringProblems(req.params.id) });
});

// Departure / Absence Drill
app.post('/api/projects/:id/absence-drill', (req: Request, res: Response) => {
  const { personName } = req.body;
  if (!personName) {
    res.status(400).json({ error: 'personName is required' });
    return;
  }
  const result = storage.runAbsenceDrill(req.params.id, personName);
  res.json({ drillResult: result });
});

// Handover Studio & Review
app.get('/api/projects/:id/handovers', (req: Request, res: Response) => {
  const handovers = storage.getHandovers(req.params.id);
  res.json({ handovers });
});

app.get('/api/handovers/:id', (req: Request, res: Response) => {
  const handover = storage.getHandoverById(req.params.id);
  if (!handover) {
    res.status(404).json({ error: 'Handover not found' });
    return;
  }
  res.json({ handover });
});

app.post('/api/projects/:id/handovers', (req: Request, res: Response) => {
  const projectId = req.params.id;
  const { outgoingUserId, successorUserId, title, permittedScope } = req.body;

  const decisions = storage.getDecisions(projectId);
  const tasks = storage.getTasks(projectId);
  const risks = storage.getRisks(projectId);
  const dependencies = storage.getDependencies(projectId);
  const questions = storage.getQuestions(projectId);

  // Generate structured claims from verified knowledge
  const claims: HandoverClaim[] = [
    {
      id: `clm_${Date.now()}_0`,
      section: 'overview',
      title: 'Platform Architecture & Scope',
      content: 'Campus Innovation Portal built on Next.js 15 App Router with PostgreSQL 16 on Google Cloud SQL.',
      verificationStatus: 'verified',
      evidenceSourceTitle: 'technical_architecture_v2.md',
      evidenceExcerpt: 'Frontend & API: Next.js 15 App Router with TypeScript. Primary Database: PostgreSQL 16 on Google Cloud SQL.',
      isApproved: true,
      isRejected: false,
      isEdited: false
    },
    ...decisions.map((d, i) => ({
      id: `clm_${Date.now()}_d${i}`,
      section: 'decisions' as const,
      title: d.title,
      content: `${d.description} Reason: ${d.reasoning}`,
      verificationStatus: d.verificationStatus,
      evidenceSourceTitle: d.evidenceSourceTitle,
      evidenceExcerpt: d.evidenceExcerpt,
      reviewerNotes: d.verificationStatus === 'conflicting' ? 'Requires formal reviewer signoff before approval' : undefined,
      isApproved: d.verificationStatus === 'verified',
      isRejected: false,
      isEdited: false,
      conflictDetails: d.verificationStatus === 'conflicting' ? 'Conflict between kickoff notes and architecture v2 specs' : undefined
    })),
    ...tasks.map((t, i) => ({
      id: `clm_${Date.now()}_t${i}`,
      section: 'tasks' as const,
      title: `${t.name} (Owner: ${t.owner})`,
      content: `${t.description} Deadline: ${t.deadline}. Current status: ${t.status}.`,
      verificationStatus: t.verificationStatus,
      evidenceSourceTitle: t.evidenceSourceTitle,
      evidenceExcerpt: t.evidenceExcerpt,
      isApproved: t.verificationStatus === 'verified',
      isRejected: false,
      isEdited: false
    })),
    ...risks.map((r, i) => ({
      id: `clm_${Date.now()}_r${i}`,
      section: 'risks' as const,
      title: `[${r.severity.toUpperCase()}] ${r.title}`,
      content: `${r.description} Impact: ${r.potentialImpact}. Recommended Mitigation: ${r.mitigation}`,
      verificationStatus: r.severity === 'critical' ? 'verified' as const : 'inferred' as const,
      evidenceSourceTitle: r.evidenceSourceTitle,
      evidenceExcerpt: r.supportingEvidence,
      isApproved: true,
      isRejected: false,
      isEdited: false
    })),
    ...dependencies.map((dep, i) => ({
      id: `clm_${Date.now()}_dep${i}`,
      section: 'dependencies' as const,
      title: `${dep.dependentTask} -> ${dep.requiredTaskOrResource}`,
      content: `${dep.relationship} Blocked: ${dep.isBlocked ? 'YES' : 'NO'}.`,
      verificationStatus: 'verified' as const,
      evidenceSourceTitle: 'weekly_progress_report_week8.md',
      evidenceExcerpt: dep.supportingEvidence,
      isApproved: true,
      isRejected: false,
      isEdited: false
    })),
    ...questions.map((q, i) => ({
      id: `clm_${Date.now()}_q${i}`,
      section: 'questions' as const,
      title: q.question,
      content: `Why it matters: ${q.whyItMatters}. Suggested verifier: ${q.suggestedVerifier}`,
      verificationStatus: 'missing' as const,
      evidenceSourceTitle: q.relatedSourceTitle,
      evidenceExcerpt: q.whyItMatters,
      isApproved: false,
      isRejected: false,
      isEdited: false
    }))
  ];

  const newHandover: Handover = {
    id: `hnd_${Date.now()}`,
    projectId,
    title: title || 'Comprehensive Technical Handover',
    outgoingUserId: outgoingUserId || 'user_alex_rivera',
    successorUserId: successorUserId || 'user_jordan_lee',
    permittedScope: permittedScope || 'full',
    status: 'draft',
    currentVersion: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    claims,
    versions: [
      {
        id: `ver_${Date.now()}`,
        versionNumber: 1,
        createdAt: new Date().toISOString(),
        createdBy: 'Alex Rivera',
        changeSummary: 'Initial automated draft generated from authorized project knowledge sources.',
        snapshotClaimsCount: claims.length
      }
    ],
    readinessChecklist: [
      {
        id: `chk_${Date.now()}_1`,
        text: 'Import VM SSH private keys into institutional vault and test bastion access',
        timeframe: 'Day 1-7',
        category: 'Credentials',
        completed: false
      },
      {
        id: `chk_${Date.now()}_2`,
        text: 'Follow up on LDAP firewall port clearance ticket #IT-8849 with Marcus Vance',
        timeframe: 'Day 1-7',
        category: 'Stakeholders',
        completed: false
      },
      {
        id: `chk_${Date.now()}_3`,
        text: 'Confirm PostgreSQL session storage schema with advisory locks',
        timeframe: 'Day 1-7',
        category: 'Architecture',
        completed: false
      },
      {
        id: `chk_${Date.now()}_4`,
        text: 'Accept ownership of Campus SSO token revocation and security audit',
        timeframe: 'Day 8-30',
        category: 'Process',
        completed: false
      },
      {
        id: `chk_${Date.now()}_5`,
        text: 'Execute PgBouncer connection pooling tuning to resolve connection pool 504 timeouts',
        timeframe: 'Day 8-30',
        category: 'Architecture',
        completed: false
      }
    ]
  };

  storage.createHandover(newHandover);
  res.json({ success: true, handover: newHandover });
});

app.patch('/api/handovers/:id/claims/:claimId', (req: Request, res: Response) => {
  const currentUser = (req as unknown as { currentUser: { name: string } }).currentUser;
  const updatedHandover = storage.updateHandoverClaim(
    req.params.id,
    req.params.claimId,
    req.body,
    currentUser.name
  );
  if (!updatedHandover) {
    res.status(404).json({ error: 'Handover or claim not found' });
    return;
  }
  res.json({ success: true, handover: updatedHandover });
});

app.post('/api/handovers/:id/status', (req: Request, res: Response) => {
  const currentUser = (req as unknown as { currentUser: { name: string; role: 'owner' | 'reviewer' | 'successor' | 'viewer' } }).currentUser;
  const { newStatus, changeSummary } = req.body;

  const currentHandover = storage.getHandoverById(req.params.id);
  if (!currentHandover) {
    res.status(404).json({ error: 'Handover not found' });
    return;
  }

  // Server-side authorization check: Cannot share unless approved!
  if (newStatus === 'shared' && currentHandover.status !== 'approved' && currentHandover.status !== 'shared') {
    res.status(403).json({
      error: 'Security Enforcement: An unapproved handover cannot be shared with the successor. The handover must be formally approved by an authorized reviewer first.'
    });
    return;
  }

  const updatedHandover = storage.updateHandoverStatus(
    req.params.id,
    newStatus,
    currentUser.name,
    currentUser.role,
    changeSummary
  );

  res.json({ success: true, handover: updatedHandover });
});

app.post('/api/handovers/:id/acknowledge', (req: Request, res: Response) => {
  const currentUser = (req as unknown as { currentUser: { name: string; role: string } }).currentUser;
  const { signoffNote, completedChecklistIds } = req.body;

  const updatedHandover = storage.acknowledgeHandover(
    req.params.id,
    currentUser.name,
    signoffNote || 'Handover receipt acknowledged and accepted.',
    completedChecklistIds || []
  );

  if (!updatedHandover) {
    res.status(404).json({ error: 'Handover not found' });
    return;
  }

  res.json({ success: true, handover: updatedHandover });
});

// Activity & Audit Logs
app.get('/api/projects/:id/activity', (req: Request, res: Response) => {
  res.json({ activityLogs: storage.getActivityLogs(req.params.id) });
});

// Demo Data Reset
app.post('/api/demo/reset', (_req: Request, res: Response) => {
  storage.resetDemoData();
  res.json({ success: true, message: 'Synthetic demo data restored to original state.' });
});

// ================= VITE DEV OR PROD SERVER =================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true }
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(process.cwd(), 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[ContinuityOS] Server listening on port ${PORT}`);
  });
}

startServer();
