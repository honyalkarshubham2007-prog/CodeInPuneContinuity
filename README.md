# ContinuityOS

> **Knowledge stays. Work moves forward.**

ContinuityOS is an intelligent knowledge continuity platform that reconstructs project knowledge from authorised documents and activity records, identifies what might be lost when a team member leaves, and generates an evidence-backed, human-governed handover for the next responsible person.

Built for the hackathon challenge: **"Prevent Critical Knowledge From Leaving With People."**

---

## Key Differentiators

Unlike generic AI summarizers that generate unverified text with hallucinated references, ContinuityOS is engineered around four core tenets:

1. **Strict Source Traceability**: Every extracted claim, decision, task, risk, and question links directly to a verbatim document excerpt and source identifier.
2. **Epistemic Certainty Tiers**: Distinguishes between **VERIFIED** (directly supported by an explicit statement), **INFERRED** (a reasonable interpretation requiring human confirmation), **CONFLICTING** (multiple sources provide contradictory facts), and **MISSING** (required information such as task owner or deadline is absent).
3. **Automation with Human Control**: AI-generated drafts are never treated as truth. Authorized reviewers inspect, edit, clarify, approve, or reject claims before a handover can be shared.
4. **Least-Privilege Sharing**: Handover access is scope-controlled. Successors only see what they are authorized to access, protecting confidential infrastructure secrets.

---

## Core Product Capabilities

- **Module 1: Authentication & Demo Personas**: Switch between 4 distinct demo personas (Project Owner Alex Rivera, Faculty Reviewer Dr. Sarah Chen, Incoming Successor Jordan Lee, Stakeholder Morgan Taylor).
- **Module 2: Project Overview & Metrics**: Real-time project health metrics, knowledge verification distribution, attention banners for critical risks.
- **Module 3: Knowledge Source Ingestion**: Multi-format document parser supporting PDF, DOCX, TXT, Markdown, and CSV matrices with cryptographic checksums and excerpt segmenting.
- **Module 4: Knowledge Reconstruction Engine**: Extracts structured entities (Decisions, Tasks, Risks, Dependencies, Questions, Contacts, Recurring Problems) using Google Gemini 3.8 Flash with a deterministic local fallback.
- **Module 5: Source Evidence Explorer**: Click any claim to inspect the verbatim source citation, highlighted quote, and verification certainty tier.
- **Module 6: Decision Timeline**: Chronological event trail detailing architecture decisions, reasoning, and context.
- **Module 7: Continuity Risk Radar**: Rule-based risk severity model detecting single-person bottlenecks and unassigned critical compliance tasks.
- **Module 8: Departure / Absence Drill**: Interactive simulation testing: *"What would happen to this project if this key person became unavailable tomorrow?"* Computes empirical readiness score and generates mitigation checklist.
- **Module 9: Handover Studio**: 5-step guided wizard for generating structured handovers with scope restrictions.
- **Module 10: Human Review & Approval**: Versioned claim-by-claim approval lifecycle (Draft -> In Review -> Changes Requested -> Approved). Server-enforced sharing barrier.
- **Module 11 & 12: Successor Experience & Readiness**: Scope-controlled handover view, Day 1-7 and Day 8-30 continuation checklist, and formal digital receipt sign-off.
- **Module 13: Activity & Audit Log**: Immutable chronological log recording all uploads, extractions, reviews, approvals, and sign-offs.
- **Module 14: Team, Permissions & Settings**: Least-privilege matrix, dark/light theme, and 1-click synthetic demo state reset for judges.

---

## Technology Stack

- **Frontend**: React 19, TypeScript (strict mode), Vite, Tailwind CSS v4, Lucide React icons.
- **Backend**: Express server (`server.ts`) hosting REST APIs, Multer document ingestion, and Vite dev middleware.
- **Database Architecture**: Relational Prisma schema (`prisma/schema.prisma`) configured with SQLite local persistence and seamless migration path to PostgreSQL on Google Cloud SQL.
- **AI Engine**: Google Gemini API (`gemini-3.8-flash`) via the modern `@google/genai` TypeScript SDK with deterministic rule-based NLP fallback when API keys are absent.
- **Document Processing**: `mammoth` (DOCX), `csv-parse` (CSV), native stream parsers (PDF, TXT, MD).
- **Validation**: Zod schema validation on structured AI outputs.
- **Testing**: Node.js built-in test runner (`node:test`) executed via `npx --yes tsx --test`.

---

## Synthetic Demonstration Dataset

ContinuityOS includes a synthetic demo project: **Campus Innovation Portal**.
Scenario: Student Lead Software Architect **Alex Rivera** is graduating and departing before final semester delivery.

Pre-loaded synthetic documents:
1. `project_kickoff_meeting_notes.md` — Kickoff notes specifying Redis session storage.
2. `technical_architecture_v2.md` — Architecture doc approving PostgreSQL session tables to save $450/mo (deliberate conflict with kickoff doc).
3. `weekly_progress_report_week8.md` — Progress report highlighting student directory sync blocked on central IT LDAP firewall ticket #IT-8849.
4. `task_ownership_spreadsheet.csv` — Matrix showing Campus SSO Security Audit with **UNASSIGNED** owner and **MISSING** deadline.
5. `decision_log_consolidated.md` — Decision history noting custom undocumented deployment bash scripts on staging VM.
6. `bug_and_issue_report.md` — Details recurring 504 gateway timeouts under 350 users from database connection pool exhaustion, and raises the unfunded $180/mo hosting bill after June 30.
7. `handover_discussion_notes.md` — Confidential notes revealing staging VM bastion SSH keys reside only on Alex Rivera's personal laptop.

---

## Judge Demonstration Journey

1. **Sign In**: Default persona is **Alex Rivera (Outgoing Lead)**.
2. **Dashboard Overview**: Inspect project health metrics and the 2 critical attention alerts.
3. **Knowledge Sources**: Navigate to **Knowledge Sources**; view the 7 ingested documents or upload a sample PDF/TXT file.
4. **Reconstruct Knowledge**: Click **Reconstruct Knowledge Graph**; observe extraction of decisions, tasks, and risks.
5. **Inspect Evidence**: Click any decision or task to open the **Source Evidence Explorer** and view the verbatim quote and verification badge.
6. **Contradiction Detection**: Notice the **Conflicting Spec** badge on the Session Store decision (Redis vs PostgreSQL).
7. **Continuity Risk Radar**: Open **Continuity Risks**; review the single-person SSH bottleneck and unassigned SSO task.
8. **Departure Drill**: Navigate to **Departure Drill**; simulate Alex Rivera's absence. Review the 52% Readiness Score, orphaned tasks, and generated mitigation checklist.
9. **Handover Studio**: Open **Handover Studio**; review the draft claims. Switch persona to **Dr. Sarah Chen (Reviewer)** and approve claims or resolve the session store conflict.
10. **Approval & Sharing**: Click **Approve Complete Handover**. Click **Share with Successor Jordan Lee**.
11. **Successor Experience**: Switch persona to **Jordan Lee (Successor)** or click **My Handover**; review the received handover, check off Day 1-7 onboarding tasks, and sign the **Formal Digital Receipt Sign-Off**.
12. **Audit Trail**: Check **Activity Log** to verify the timestamped immutable audit log.
13. **Demo Reset**: Click **Reset Demo State** in the sidebar at any time to restore the initial demo state.

---

## Commands & Development

```bash
# Install dependencies
npm install

# Run unit tests
npm test

# Run development server (runs full-stack Express + Vite on port 3000)
npm run dev

# Build for production
npm run build
```
