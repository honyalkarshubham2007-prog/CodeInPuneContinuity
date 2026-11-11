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
  ActivityLog
} from '../../src/types/index.js';

export const DEMO_USERS: User[] = [
  {
    id: 'user_alex_rivera',
    name: 'Alex Rivera',
    email: 'alex.rivera@university.edu',
    role: 'owner',
    roleTitle: 'Lead Software Architect (Outgoing Lead)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    department: 'Computer Science & Innovation Lab'
  },
  {
    id: 'user_sarah_chen',
    name: 'Dr. Sarah Chen',
    email: 'sarah.chen@university.edu',
    role: 'reviewer',
    roleTitle: 'Faculty Advisor & Principal Reviewer',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    department: 'Division of Engineering'
  },
  {
    id: 'user_jordan_lee',
    name: 'Jordan Lee',
    email: 'jordan.lee@university.edu',
    role: 'successor',
    roleTitle: 'Associate Engineer (Incoming Tech Lead)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    department: 'Innovation Lab'
  },
  {
    id: 'user_morgan_taylor',
    name: 'Morgan Taylor',
    email: 'morgan.taylor@university.edu',
    role: 'viewer',
    roleTitle: 'Student Government Stakeholder',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    department: 'Student Affairs'
  }
];

export const DEMO_PROJECTS: Project[] = [
  {
    id: 'proj_campus_portal',
    name: 'Campus Innovation Portal',
    tagline: 'Centralized portal connecting student entrepreneurs, lab grants, and faculty research.',
    description: 'Mission-critical student portal managing annual grant allocations, team matching, and university lab reservations. Outgoing lead Alex Rivera departs before final v1 delivery.',
    department: 'University Innovation Lab',
    status: 'in_transition',
    outgoingLeadId: 'user_alex_rivera',
    successorId: 'user_jordan_lee',
    reviewerId: 'user_sarah_chen',
    createdAt: '2026-09-01T08:00:00Z',
    updatedAt: '2026-11-10T14:30:00Z'
  },
  {
    id: 'proj_research_ledger',
    name: 'Faculty Grant & Equipment Ledger',
    tagline: 'Shared ledger for equipment maintenance and cross-department funding.',
    description: 'Internal operational tool for tracking high-cost scanning electron microscopes and cleanroom equipment bookings.',
    department: 'Materials Science & Nanotechnology',
    status: 'active',
    outgoingLeadId: 'user_alex_rivera',
    successorId: 'user_jordan_lee',
    reviewerId: 'user_sarah_chen',
    createdAt: '2026-10-12T09:00:00Z',
    updatedAt: '2026-11-05T11:00:00Z'
  }
];

export const DEMO_SOURCES: Source[] = [
  {
    id: 'src_kickoff_notes',
    projectId: 'proj_campus_portal',
    filename: 'project_kickoff_meeting_notes.md',
    fileType: 'md',
    size: 4280,
    uploadedAt: '2026-09-04T10:15:00Z',
    uploadedBy: 'Alex Rivera',
    status: 'processed',
    classification: 'internal',
    wordCount: 740,
    checksum: 'sha256-8f921ab4c9103e',
    excerptsCount: 4,
    rawText: `# Campus Innovation Portal — Project Kickoff Meeting Notes
Date: September 4, 2026
Attendees: Alex Rivera (Project Lead), Dr. Sarah Chen (Advisor), Jordan Lee (Backend Dev), Marcus Vance (Campus IT Director)

## 1. Project Objectives
Deliver the campus-wide platform for student founder applications and lab equipment booking before the Spring 2027 semester launch.

## 2. Infrastructure Baseline Decisions
- Frontend & API: Next.js 15 App Router with TypeScript.
- Primary Database: PostgreSQL 16 hosted on Google Cloud SQL.
- Session Management & Caching: Stated during kickoff: "Session storage must use Redis cluster to support 5,000 concurrent students during peak enrollment windows."
- Authentication: Must interface with Campus Active Directory / SAML SSO.

## 3. Team Responsibilities
- Alex Rivera: Architecture, deployment pipelines, infrastructure setup, security signoff.
- Jordan Lee: Backend API endpoints, database schemas, load testing.
- Dr. Sarah Chen: Academic governance and quarterly milestones review.`
  },
  {
    id: 'src_tech_arch',
    projectId: 'proj_campus_portal',
    filename: 'technical_architecture_v2.md',
    fileType: 'md',
    size: 8940,
    uploadedAt: '2026-09-22T14:20:00Z',
    uploadedBy: 'Alex Rivera',
    status: 'processed',
    classification: 'internal',
    wordCount: 1420,
    checksum: 'sha256-4c3109aef82b99',
    excerptsCount: 6,
    rawText: `# Campus Innovation Portal — Technical Architecture Document v2.0
Author: Alex Rivera
Approved by: Core Engineering Group
Date: September 22, 2026

## Section 3.1: Session Management Architecture (REVISED)
CONFLICT NOTE / SUPERSEDED DECISION:
"Following budget review on Sept 18 with faculty committee, PostgreSQL session table with advisory locks was officially approved to replace the planned Redis cluster. This saves approximately $450/month in cloud infrastructure costs while comfortably satisfying our throughput requirements of 1,200 requests/minute."

## Section 4.2: SSO & Identity Provider Gateway
Single Sign-On connects to the campus Active Directory via SAML 2.0.
The gateway relies on certs installed at \`/etc/ssl/campus-sso.crt\`.
CRITICAL GAP: Security token refresh and automated revocation callback hooks have not been assigned to any developer.

## Section 5.1: Database Schemas & Migrations
Prisma ORM is used with relational foreign keys. Migration scripts are stored under \`prisma/migrations\`.
Manual cron jobs exist on the staging server for nightly data sanitization; these scripts reside in Alex Rivera's private home directory without repository backup.`
  },
  {
    id: 'src_weekly_report_w8',
    projectId: 'proj_campus_portal',
    filename: 'weekly_progress_report_week8.md',
    fileType: 'md',
    size: 5120,
    uploadedAt: '2026-10-28T16:45:00Z',
    uploadedBy: 'Alex Rivera',
    status: 'processed',
    classification: 'internal',
    wordCount: 880,
    checksum: 'sha256-d71109bc5392e1',
    excerptsCount: 3,
    rawText: `# Weekly Engineering Progress Report — Week 8
Date: October 28, 2026
Lead: Alex Rivera

## Blocker Alert: Student Directory Sync Dependency
The student profile sync feature is completely blocked awaiting central IT LDAP firewall port clearance (ticket #IT-8849). Marcus Vance from Campus IT has indicated approval requires Dean of Student Affairs formal sign-off.

## Knowledge Dependency Alert
Alex Rivera is currently the sole person with production deployment bastion SSH keys.
No other team member has access to the staging environment secret management vault.`
  },
  {
    id: 'src_task_matrix',
    projectId: 'proj_campus_portal',
    filename: 'task_ownership_spreadsheet.csv',
    fileType: 'csv',
    size: 2640,
    uploadedAt: '2026-11-02T09:30:00Z',
    uploadedBy: 'Alex Rivera',
    status: 'processed',
    classification: 'internal',
    wordCount: 450,
    checksum: 'sha256-a1492ebff00923',
    excerptsCount: 5,
    rawText: `Task_ID,Task_Name,Owner,Deadline,Status,Priority,Dependencies
TSK-101,Database Connection Pool Tuning,Alex Rivera,2026-11-15,in_progress,High,None
TSK-102,Campus SSO Security Audit & Token Revocation,UNASSIGNED,MISSING_DEADLINE,not_started,Critical,None
TSK-103,Load Testing and Stress Benchmarks,Jordan Lee,2026-11-25,not_started,Medium,TSK-101
TSK-104,Production Database Migration Script,Alex Rivera,2026-11-18,in_progress,High,None
TSK-105,Faculty Advisor Governance Signoff,Dr. Sarah Chen,MISSING_DEADLINE,not_started,High,TSK-102`
  },
  {
    id: 'src_decision_log',
    projectId: 'proj_campus_portal',
    filename: 'decision_log_consolidated.md',
    fileType: 'md',
    size: 6190,
    uploadedAt: '2026-11-04T13:10:00Z',
    uploadedBy: 'Alex Rivera',
    status: 'processed',
    classification: 'internal',
    wordCount: 990,
    checksum: 'sha256-ee299104ba39d1',
    excerptsCount: 4,
    rawText: `# Consolidated Project Decision Log
Maintained by: Alex Rivera

## DEC-01: Relational Schema vs Document Database
- Date: 2026-09-10
- Decision: Adopted PostgreSQL over MongoDB.
- Reasoning: Student lab grant allocations require strict ACID guarantees and foreign key integrity across departments.
- Status: VERIFIED & IMPLEMENTED.

## DEC-02: Deferral of Native Mobile Push Notifications
- Date: 2026-09-30
- Decision: Mobile push postponed to Phase 2; email notifications via SendGrid used for MVP.
- Reasoning: Insufficient dev bandwidth before semester deadline.
- Status: VERIFIED.

## DEC-03: Custom Deployment Automation Scripts
- Date: 2026-10-15
- Decision: Alex Rivera created custom bash scripts in \`/opt/deploy-scripts\` on the staging VM instead of setting up GitHub Actions CD.
- Reasoning: Faster to iterate during early prototyping.
- CONTINUITY RISK: Only Alex understands these scripts; no written documentation or runbook exists.`
  },
  {
    id: 'src_bug_report',
    projectId: 'proj_campus_portal',
    filename: 'bug_and_issue_report.md',
    fileType: 'md',
    size: 4780,
    uploadedAt: '2026-11-06T15:00:00Z',
    uploadedBy: 'Jordan Lee',
    status: 'processed',
    classification: 'internal',
    wordCount: 820,
    checksum: 'sha256-339ff827104bda',
    excerptsCount: 3,
    rawText: `# Bug & Issue Operational Tracking Report
Reporter: Jordan Lee

## Recurring Issue #1: Intermittent Database Connection Pool Exhaustion
Observed on 4 separate testing occasions: when simulated concurrent load exceeds 350 users, Prisma exhausts max connection limit (20 connections) on Cloud SQL, resulting in HTTP 504 Gateway Timeouts.
Potential Impact: High risk of portal crash during initial course grant application rush.

## Critical Unresolved Budget Question
Question raised by Jordan Lee on Nov 5: "Who funds the $180/month GCP Cloud SQL and app hosting bills once the current Student Activity Fee funding window closes on June 30, 2027?"
No university department has formally accepted financial responsibility.`
  },
  {
    id: 'src_handover_notes',
    projectId: 'proj_campus_portal',
    filename: 'handover_discussion_notes.md',
    fileType: 'md',
    size: 5800,
    uploadedAt: '2026-11-08T11:20:00Z',
    uploadedBy: 'Alex Rivera',
    status: 'processed',
    classification: 'confidential',
    wordCount: 960,
    checksum: 'sha256-bb9842f99014cc',
    excerptsCount: 4,
    rawText: `# Outgoing Lead Preliminary Handover Discussion Notes
Date: November 8, 2026
Participants: Alex Rivera (Outgoing Lead), Jordan Lee (Successor)

## Important Stakeholder Contacts
1. Marcus Vance — Campus IT Infrastructure Director (marcus.vance@university.edu). Contact for LDAP firewall tickets and SSL cert renewals.
2. Dean Robert Thorne — Dean of Student Affairs (robert.thorne@university.edu). Approving authority for student data access.
3. Dr. Sarah Chen — Faculty Lead & Lab Director (sarah.chen@university.edu). Code review approvals and academic grading.

## Undocumented Critical Credentials & Infrastructure
- The staging VM SSH private key is currently only stored on Alex Rivera's personal laptop (\`~/.ssh/campus_staging_ed25519\`).
- Environment variables for production SendGrid and Cloud SQL secrets are in a password-protected note on Alex's phone, not in 1Password or GCP Secret Manager.
- Must be transferred securely before Alex's official departure date.`
  }
];

export const DEMO_DECISIONS: Decision[] = [
  {
    id: 'dec_01',
    projectId: 'proj_campus_portal',
    title: 'Adoption of PostgreSQL over Document Store',
    description: 'Selected PostgreSQL 16 on Google Cloud SQL as primary data storage rather than MongoDB.',
    reasoning: 'Grant allocations, student teams, and lab equipment bookings require strict multi-table relational ACID guarantees to prevent double-booking.',
    decisionMaker: 'Alex Rivera (approved by Faculty Committee)',
    date: '2026-09-10',
    category: 'architecture',
    verificationStatus: 'verified',
    evidenceSourceIds: ['src_decision_log', 'src_tech_arch'],
    evidenceSourceTitle: 'decision_log_consolidated.md',
    evidenceExcerpt: 'Student lab grant allocations require strict ACID guarantees and foreign key integrity across departments. Status: VERIFIED & IMPLEMENTED.'
  },
  {
    id: 'dec_02',
    projectId: 'proj_campus_portal',
    title: 'Conflicting Session Store: Redis vs Postgres Table',
    description: 'Kickoff notes specify Redis cluster, but Technical Architecture v2 specifies PostgreSQL session table with advisory locks.',
    reasoning: 'Redis was initially selected for high throughput, but changed on Sept 18 to Postgres session tables to save $450/month in cloud infrastructure fees.',
    decisionMaker: 'Alex Rivera / Faculty Budget Committee',
    date: '2026-09-18',
    category: 'infrastructure',
    verificationStatus: 'conflicting',
    evidenceSourceIds: ['src_kickoff_notes', 'src_tech_arch'],
    evidenceSourceTitle: 'technical_architecture_v2.md (vs kickoff_meeting_notes.md)',
    evidenceExcerpt: 'PostgreSQL session table with advisory locks was officially approved to replace the planned Redis cluster. This saves approx $450/month (supersedes kickoff doc).'
  },
  {
    id: 'dec_03',
    projectId: 'proj_campus_portal',
    title: 'Deferral of Mobile Push Notifications to Phase 2',
    description: 'Postponed native push notifications; adopted SendGrid email transactional notifications for initial MVP release.',
    reasoning: 'Team developer capacity is constrained ahead of Spring semester launch; email meets primary compliance requirements.',
    decisionMaker: 'Alex Rivera & Jordan Lee',
    date: '2026-09-30',
    category: 'product',
    verificationStatus: 'verified',
    evidenceSourceIds: ['src_decision_log'],
    evidenceSourceTitle: 'decision_log_consolidated.md',
    evidenceExcerpt: 'Mobile push postponed to Phase 2; email notifications via SendGrid used for MVP due to dev capacity.'
  },
  {
    id: 'dec_04',
    projectId: 'proj_campus_portal',
    title: 'Staging VM Deployment via Custom Bash Scripts',
    description: 'Staging deployment relies on bespoke shell scripts in /opt/deploy-scripts instead of GitHub Actions CD.',
    reasoning: 'Implemented as an expedient shortcut during prototype phase without written runbooks or version control.',
    decisionMaker: 'Alex Rivera',
    date: '2026-10-15',
    category: 'process',
    verificationStatus: 'inferred',
    evidenceSourceIds: ['src_decision_log', 'src_tech_arch'],
    evidenceSourceTitle: 'decision_log_consolidated.md',
    evidenceExcerpt: 'Alex Rivera created custom bash scripts in /opt/deploy-scripts on the staging VM instead of setting up GitHub Actions CD. CONTINUITY RISK: undocumented.'
  }
];

export const DEMO_TASKS: Task[] = [
  {
    id: 'tsk_01',
    projectId: 'proj_campus_portal',
    name: 'Campus SSO Security Audit & Token Revocation',
    description: 'Implement token revocation callback hooks and security audit for SAML Active Directory bridge.',
    owner: 'Unassigned / Missing Owner',
    deadline: 'Missing Deadline',
    status: 'not_started',
    dependencies: [],
    verificationStatus: 'missing',
    evidenceSourceTitle: 'task_ownership_spreadsheet.csv',
    evidenceExcerpt: 'TSK-102,Campus SSO Security Audit & Token Revocation,UNASSIGNED,MISSING_DEADLINE,not_started,Critical'
  },
  {
    id: 'tsk_02',
    projectId: 'proj_campus_portal',
    name: 'Database Connection Pool Tuning',
    description: 'Reconfigure Cloud SQL connection pool settings and add connection retry logic to stop HTTP 504 timeouts.',
    owner: 'Alex Rivera (Pending Handover to Jordan Lee)',
    deadline: '2026-11-15',
    status: 'in_progress',
    dependencies: [],
    verificationStatus: 'verified',
    evidenceSourceTitle: 'task_ownership_spreadsheet.csv',
    evidenceExcerpt: 'TSK-101,Database Connection Pool Tuning,Alex Rivera,2026-11-15,in_progress,High'
  },
  {
    id: 'tsk_03',
    projectId: 'proj_campus_portal',
    name: 'Load Testing and Stress Benchmarks',
    description: 'Simulate 5,000 concurrent students applying for research grants to verify system stability.',
    owner: 'Jordan Lee',
    deadline: '2026-11-25',
    status: 'not_started',
    dependencies: ['tsk_02'],
    verificationStatus: 'verified',
    evidenceSourceTitle: 'task_ownership_spreadsheet.csv',
    evidenceExcerpt: 'TSK-103,Load Testing and Stress Benchmarks,Jordan Lee,2026-11-25,not_started,Medium,TSK-101'
  },
  {
    id: 'tsk_04',
    projectId: 'proj_campus_portal',
    name: 'Production Database Migration Script',
    description: 'Finalize and dry-run Prisma schema migration scripts for production Cloud SQL rollout.',
    owner: 'Alex Rivera',
    deadline: '2026-11-18',
    status: 'in_progress',
    dependencies: [],
    verificationStatus: 'verified',
    evidenceSourceTitle: 'task_ownership_spreadsheet.csv',
    evidenceExcerpt: 'TSK-104,Production Database Migration Script,Alex Rivera,2026-11-18,in_progress,High'
  },
  {
    id: 'tsk_05',
    projectId: 'proj_campus_portal',
    name: 'Faculty Advisor Governance Signoff',
    description: 'Final security and data protection signoff by faculty advisor prior to opening student access.',
    owner: 'Dr. Sarah Chen',
    deadline: 'Missing Deadline',
    status: 'not_started',
    dependencies: ['tsk_01'],
    verificationStatus: 'inferred',
    evidenceSourceTitle: 'task_ownership_spreadsheet.csv',
    evidenceExcerpt: 'TSK-105,Faculty Advisor Governance Signoff,Dr. Sarah Chen,MISSING_DEADLINE,not_started,High,TSK-102'
  }
];

export const DEMO_RISKS: Risk[] = [
  {
    id: 'risk_01',
    projectId: 'proj_campus_portal',
    title: 'Single-Person Knowledge Bottleneck on Production Deployment',
    description: 'Alex Rivera is the sole possessor of staging VM bastion SSH keys and undocumented bash deployment scripts.',
    severity: 'critical',
    severityReason: 'Immediate total operational blackout if Alex departs without transferring SSH keys and documenting deployment steps.',
    potentialImpact: 'Production deployment impossible; zero other engineers can access or deploy updates to servers.',
    supportingEvidence: 'Staging VM SSH private key is only stored on Alex personal laptop (~/.ssh/campus_staging_ed25519).',
    evidenceSourceTitle: 'handover_discussion_notes.md',
    mitigation: 'Migrate keys to University 1Password vault immediately; pair-program deployment walkthrough with Jordan Lee; codify into GitHub Actions.',
    status: 'open',
    assignedReviewer: 'Dr. Sarah Chen',
    affectedPerson: 'Alex Rivera'
  },
  {
    id: 'risk_02',
    projectId: 'proj_campus_portal',
    title: 'Unassigned Critical Security Task (SSO Revocation Hooks)',
    description: 'Campus SSO Token Revocation and Security Audit has NO assigned owner and NO target deadline.',
    severity: 'critical',
    severityReason: 'Compliance requirement from University IT Security; launch cannot proceed without signed security audit.',
    potentialImpact: 'Campus IT will refuse SAML bridge clearance, blocking student login.',
    supportingEvidence: 'task_ownership_spreadsheet.csv explicitly marks Owner: UNASSIGNED and Deadline: MISSING.',
    evidenceSourceTitle: 'task_ownership_spreadsheet.csv',
    mitigation: 'Assign task immediately to Jordan Lee; schedule review session with Marcus Vance (Campus IT).',
    status: 'open',
    assignedReviewer: 'Dr. Sarah Chen'
  },
  {
    id: 'risk_03',
    projectId: 'proj_campus_portal',
    title: 'Recurring Database Connection Pool Exhaustion Under Load',
    description: 'Cloud SQL connection pool limits are exceeded at >350 concurrent users, returning HTTP 504 gateway timeouts.',
    severity: 'high',
    severityReason: 'Observed during 4 benchmark tests; expected peak load during course launch is 5,000 concurrent students.',
    potentialImpact: 'Complete platform outage on first day of campus registration.',
    supportingEvidence: 'Bug report bug_and_issue_report.md documents 4 separate pool exhaustion crashes under 350 users.',
    evidenceSourceTitle: 'bug_and_issue_report.md',
    mitigation: 'Implement PgBouncer connection pooling on Cloud SQL and tune Prisma max connections to 50.',
    status: 'under_review',
    assignedReviewer: 'Alex Rivera',
    affectedPerson: 'Alex Rivera'
  },
  {
    id: 'risk_04',
    projectId: 'proj_campus_portal',
    title: 'Conflicting Architectural Specifications for Session Storage',
    description: 'Kickoff notes mandate Redis cluster, but Technical Architecture v2 specifies PostgreSQL session table.',
    severity: 'medium',
    severityReason: 'If incoming successor provisions Redis, it incurs $450/mo unbudgeted cost; if Postgres, requires index optimization.',
    potentialImpact: 'Developer confusion, wasted cloud expenditure, or unoptimized database queries.',
    supportingEvidence: 'Kickoff meeting notes vs Technical Architecture v2 Section 3.1.',
    evidenceSourceTitle: 'technical_architecture_v2.md',
    mitigation: 'Reviewer Dr. Sarah Chen must formally confirm Postgres session architecture in handover sign-off.',
    status: 'under_review',
    assignedReviewer: 'Dr. Sarah Chen'
  },
  {
    id: 'risk_05',
    projectId: 'proj_campus_portal',
    title: 'Unresolved Long-Term Hosting Budget Post-June 30',
    description: 'No academic department has accepted responsibility for $180/month GCP hosting fees once Student Activity grant expires.',
    severity: 'high',
    severityReason: 'Financial shutoff risk after June 30, 2027.',
    potentialImpact: 'Service termination mid-summer before upcoming academic year.',
    supportingEvidence: 'bug_and_issue_report.md: "No university department has formally accepted financial responsibility."',
    evidenceSourceTitle: 'bug_and_issue_report.md',
    mitigation: 'Escalate to Dean Robert Thorne for inclusion in annual Student Affairs IT operating budget.',
    status: 'open',
    assignedReviewer: 'Dr. Sarah Chen'
  }
];

export const DEMO_DEPENDENCIES: Dependency[] = [
  {
    id: 'dep_01',
    projectId: 'proj_campus_portal',
    dependentTask: 'Student Directory Profile Sync',
    requiredTaskOrResource: 'Central IT LDAP Firewall Port Clearance (Ticket #IT-8849)',
    relationship: 'Network Access Block: Sync worker cannot reach ldap.campus.internal without firewall port open.',
    supportingEvidence: 'weekly_progress_report_week8.md: "Completely blocked awaiting central IT LDAP firewall port clearance ticket #IT-8849."',
    isBlocked: true
  },
  {
    id: 'dep_02',
    projectId: 'proj_campus_portal',
    dependentTask: 'Load Testing and Stress Benchmarks',
    requiredTaskOrResource: 'Database Connection Pool Tuning (TSK-101)',
    relationship: 'Sequential Prerequisite: Running stress test before fixing pool limits causes immediate 504 failure.',
    supportingEvidence: 'task_ownership_spreadsheet.csv TSK-103 lists dependency on TSK-101.',
    isBlocked: true
  },
  {
    id: 'dep_03',
    projectId: 'proj_campus_portal',
    dependentTask: 'Faculty Advisor Governance Signoff',
    requiredTaskOrResource: 'Campus SSO Security Audit & Token Revocation (TSK-102)',
    relationship: 'Compliance Prerequisite: Dr. Chen cannot sign off data governance without security token revocation mechanism.',
    supportingEvidence: 'task_ownership_spreadsheet.csv TSK-105 lists dependency on TSK-102.',
    isBlocked: true
  }
];

export const DEMO_QUESTIONS: UnresolvedQuestion[] = [
  {
    id: 'q_01',
    projectId: 'proj_campus_portal',
    question: 'Who will fund the $180/month GCP Cloud SQL and app hosting bills once Student Activity Fee budget cycle ends on June 30?',
    whyItMatters: 'If no department accepts billing ownership, GCP resources will be reclaimed and portal will go offline in July 2027.',
    relatedSourceTitle: 'bug_and_issue_report.md',
    suggestedVerifier: 'Dean Robert Thorne (Student Affairs) & Dr. Sarah Chen',
    status: 'unresolved'
  },
  {
    id: 'q_02',
    projectId: 'proj_campus_portal',
    question: 'What is the target completion date for the Faculty Advisor Review Phase?',
    whyItMatters: 'Task spreadsheet marks deadline as missing; team cannot set definitive public launch date without this milestone.',
    relatedSourceTitle: 'task_ownership_spreadsheet.csv',
    suggestedVerifier: 'Dr. Sarah Chen',
    status: 'unresolved'
  },
  {
    id: 'q_03',
    projectId: 'proj_campus_portal',
    question: 'Are there any other undocumented cron jobs running on the staging VM besides nightly database sanitization?',
    whyItMatters: 'Undocumented cron jobs will break if the staging VM is rebooted or migrated to container infrastructure.',
    relatedSourceTitle: 'technical_architecture_v2.md',
    suggestedVerifier: 'Alex Rivera',
    status: 'unresolved'
  }
];

export const DEMO_CONTACTS: Contact[] = [
  {
    id: 'cont_01',
    projectId: 'proj_campus_portal',
    name: 'Marcus Vance',
    role: 'Campus IT Infrastructure Director',
    context: 'Key authority for LDAP firewall clearance (#IT-8849) and SAML SSL certificates renewal.',
    email: 'marcus.vance@university.edu',
    sourceReference: 'handover_discussion_notes.md'
  },
  {
    id: 'cont_02',
    projectId: 'proj_campus_portal',
    name: 'Dean Robert Thorne',
    role: 'Dean of Student Affairs',
    context: 'Approves student FERPA data access permissions and prospective long-term cloud hosting budget.',
    email: 'robert.thorne@university.edu',
    sourceReference: 'handover_discussion_notes.md'
  },
  {
    id: 'cont_03',
    projectId: 'proj_campus_portal',
    name: 'Dr. Sarah Chen',
    role: 'Faculty Advisor & Lab Director',
    context: 'Principal reviewer for code architecture, milestone grading, and academic governance.',
    email: 'sarah.chen@university.edu',
    sourceReference: 'project_kickoff_meeting_notes.md'
  }
];

export const DEMO_RECURRING_PROBLEMS: RecurringProblem[] = [
  {
    id: 'rec_01',
    projectId: 'proj_campus_portal',
    issue: 'Intermittent Database Connection Pool Exhaustion under concurrent load spikes',
    frequency: 'Observed 4 times during stress benchmarks (>350 concurrent users)',
    supportingEvidence: 'bug_and_issue_report.md Section 1 details 504 Gateway Timeouts.',
    potentialImpact: 'High likelihood of catastrophic failure during first-day campus application launch.'
  }
];

export const DEMO_HANDOVERS: Handover[] = [
  {
    id: 'hnd_campus_portal_v1',
    projectId: 'proj_campus_portal',
    title: 'Lead Architect Handover: Alex Rivera to Jordan Lee',
    outgoingUserId: 'user_alex_rivera',
    successorUserId: 'user_jordan_lee',
    permittedScope: 'full',
    status: 'in_review',
    currentVersion: 1,
    createdAt: '2026-11-09T10:00:00Z',
    updatedAt: '2026-11-10T14:20:00Z',
    claims: [
      {
        id: 'clm_01',
        section: 'overview',
        title: 'Project Architecture Baseline',
        content: 'Campus Innovation Portal runs on Next.js 15 App Router with PostgreSQL 16 hosted on Google Cloud SQL, managing student grant applications and lab reservations.',
        verificationStatus: 'verified',
        evidenceSourceTitle: 'technical_architecture_v2.md',
        evidenceExcerpt: 'Frontend & API: Next.js 15 App Router with TypeScript. Primary Database: PostgreSQL 16 hosted on Google Cloud SQL.',
        pageOrSection: 'Section 1.1',
        isApproved: true,
        isRejected: false,
        isEdited: false
      },
      {
        id: 'clm_02',
        section: 'decisions',
        title: 'Session Management Storage (Conflicting Resolution Required)',
        content: 'Kickoff notes required Redis, but revised Technical Architecture v2 approved PostgreSQL session tables with advisory locks to eliminate $450/mo cloud fee.',
        verificationStatus: 'conflicting',
        evidenceSourceTitle: 'technical_architecture_v2.md',
        evidenceExcerpt: 'PostgreSQL session table with advisory locks was officially approved to replace the planned Redis cluster (saving $450/month).',
        pageOrSection: 'Section 3.1',
        reviewerNotes: 'Dr. Sarah Chen: Verified with faculty budget committee; Postgres session store is confirmed.',
        isApproved: false,
        isRejected: false,
        isEdited: false,
        conflictDetails: 'Kickoff meeting notes state Redis cluster is mandatory; Architecture doc overrides this with Postgres.'
      },
      {
        id: 'clm_03',
        section: 'tasks',
        title: 'Campus SSO Security Audit & Token Revocation (Critical Gap)',
        content: 'Currently unassigned with no deadline. Critical security prerequisite for SAML bridge.',
        verificationStatus: 'missing',
        evidenceSourceTitle: 'task_ownership_spreadsheet.csv',
        evidenceExcerpt: 'TSK-102,Campus SSO Security Audit & Token Revocation,UNASSIGNED,MISSING_DEADLINE',
        pageOrSection: 'Row 3',
        reviewerNotes: 'Must be assigned to Jordan Lee prior to handover approval.',
        isApproved: false,
        isRejected: false,
        isEdited: false
      },
      {
        id: 'clm_04',
        section: 'risks',
        title: 'Single Point of Failure: Staging Bastion SSH Keys',
        content: 'Staging VM access keys reside exclusively on Alex Rivera personal machine. Undocumented bash scripts run in /opt/deploy-scripts.',
        verificationStatus: 'verified',
        evidenceSourceTitle: 'handover_discussion_notes.md',
        evidenceExcerpt: 'Staging VM SSH private key is currently only stored on Alex Rivera personal laptop (~/.ssh/campus_staging_ed25519).',
        pageOrSection: 'Infrastructure Section',
        isApproved: true,
        isRejected: false,
        isEdited: false
      },
      {
        id: 'clm_05',
        section: 'dependencies',
        title: 'Student Directory Profile Sync Blocked on IT Ticket #IT-8849',
        content: 'Directory sync worker cannot reach ldap.campus.internal until Marcus Vance from Central IT approves firewall exception.',
        verificationStatus: 'verified',
        evidenceSourceTitle: 'weekly_progress_report_week8.md',
        evidenceExcerpt: 'Completely blocked awaiting central IT LDAP firewall port clearance ticket #IT-8849.',
        pageOrSection: 'Blockers',
        isApproved: true,
        isRejected: false,
        isEdited: false
      },
      {
        id: 'clm_06',
        section: 'questions',
        title: 'Long-term Cloud Hosting Funding Post-June 30',
        content: 'Unresolved financial responsibility for $180/mo GCP Cloud SQL and app hosting bills once Student Activity grant closes.',
        verificationStatus: 'missing',
        evidenceSourceTitle: 'bug_and_issue_report.md',
        evidenceExcerpt: 'Who funds the $180/month GCP Cloud SQL and app hosting bills once Student Activity Fee funding closes on June 30?',
        pageOrSection: 'Financial Notes',
        isApproved: false,
        isRejected: false,
        isEdited: false
      }
    ],
    versions: [
      {
        id: 'ver_01',
        versionNumber: 1,
        createdAt: '2026-11-09T10:00:00Z',
        createdBy: 'Alex Rivera',
        changeSummary: 'Initial automated knowledge reconstruction draft generated from 7 project sources.',
        snapshotClaimsCount: 6
      }
    ],
    readinessChecklist: [
      {
        id: 'chk_01',
        text: 'Obtain Staging VM SSH key & import into team 1Password vault',
        timeframe: 'Day 1-7',
        category: 'Credentials',
        completed: false
      },
      {
        id: 'chk_02',
        text: 'Follow up with Marcus Vance on LDAP firewall clearance (Ticket #IT-8849)',
        timeframe: 'Day 1-7',
        category: 'Stakeholders',
        completed: false
      },
      {
        id: 'chk_03',
        text: 'Confirm PostgreSQL session table advisory lock performance & close Redis question',
        timeframe: 'Day 1-7',
        category: 'Architecture',
        completed: false
      },
      {
        id: 'chk_04',
        text: 'Take ownership of TSK-102 (Campus SSO Token Revocation) and draft security audit document',
        timeframe: 'Day 8-30',
        category: 'Process',
        completed: false
      },
      {
        id: 'chk_05',
        text: 'Execute PgBouncer connection pooling tuning to resolve connection pool 504 timeouts',
        timeframe: 'Day 8-30',
        category: 'Architecture',
        completed: false
      },
      {
        id: 'chk_06',
        text: 'Coordinate with Dean Robert Thorne for 2027-2028 cloud hosting line item in Student Affairs budget',
        timeframe: 'First Quarter',
        category: 'Stakeholders',
        completed: false
      }
    ]
  }
];

export const DEMO_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: 'act_01',
    projectId: 'proj_campus_portal',
    timestamp: '2026-11-08T11:20:00Z',
    actorName: 'Alex Rivera',
    actorRole: 'owner',
    action: 'UPLOAD_SOURCE',
    entityType: 'source',
    entityName: 'handover_discussion_notes.md',
    details: 'Uploaded confidential handover discussion notes with credential locations.'
  },
  {
    id: 'act_02',
    projectId: 'proj_campus_portal',
    timestamp: '2026-11-09T09:45:00Z',
    actorName: 'System / ContinuityOS Engine',
    actorRole: 'owner',
    action: 'RECONSTRUCT_KNOWLEDGE',
    entityType: 'reconstruction',
    entityName: 'Campus Innovation Portal Knowledge Graph',
    details: 'Extracted 4 decisions, 5 tasks, 5 risks, 3 dependencies, 3 unresolved questions, 3 contacts, and identified 2 conflicting claims.'
  },
  {
    id: 'act_03',
    projectId: 'proj_campus_portal',
    timestamp: '2026-11-09T10:00:00Z',
    actorName: 'Alex Rivera',
    actorRole: 'owner',
    action: 'CREATE_HANDOVER',
    entityType: 'handover',
    entityName: 'Lead Architect Handover v1',
    details: 'Created draft handover targeted to successor Jordan Lee with full permitted scope.'
  },
  {
    id: 'act_04',
    projectId: 'proj_campus_portal',
    timestamp: '2026-11-10T11:15:00Z',
    actorName: 'Dr. Sarah Chen',
    actorRole: 'reviewer',
    action: 'REVIEW_CLAIM',
    entityType: 'claim',
    entityName: 'Architecture Baseline Claim',
    details: 'Approved Claim clm_01: Verified Next.js 15 & PostgreSQL Cloud SQL baseline.'
  },
  {
    id: 'act_05',
    projectId: 'proj_campus_portal',
    timestamp: '2026-11-10T14:10:00Z',
    actorName: 'Dr. Sarah Chen',
    actorRole: 'reviewer',
    action: 'ADD_REVIEW_NOTE',
    entityType: 'claim',
    entityName: 'Session Storage Conflict',
    details: 'Added reviewer clarification note confirming PostgreSQL session table over Redis.'
  }
];
