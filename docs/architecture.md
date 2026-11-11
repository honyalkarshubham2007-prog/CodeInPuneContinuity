# ContinuityOS — Architecture Specification

## 1. Architectural Philosophy

ContinuityOS adheres to three foundational tenets:
- **Traceability over Summarization**: AI summarization often introduces hallucinations or ungrounded claims. ContinuityOS enforces that every extracted claim must link back to an actual source file and an exact text excerpt.
- **Human-in-the-Loop Governance**: Automated extraction creates a *draft*, not truth. Reviewers must formally audit, clarify, and approve claims before any handover is shared.
- **Least-Privilege Scoping**: Knowledge is categorized into security classification tiers (Public, Internal, Confidential). Successors are only granted access to documents within their permitted scope.

---

## 2. System Architecture

```
+-------------------------------------------------------+
|                    Browser Client                     |
|  React 19 + TypeScript + Tailwind CSS v4              |
|  - AppShell Layout & Persona Switcher                 |
|  - Evidence Drawer & Verification Indicators         |
|  - Handover Studio & Review Workspace                |
|  - Departure / Absence Drill Simulator               |
+-------------------------------------------------------+
                           |
                     HTTP / JSON
                           |
+-------------------------------------------------------+
|                 Express Node Server                   |
|  (server.ts mounted on port 3000)                     |
|  - Ingestion Engine (Multer, mammoth, csv-parse)       |
|  - Knowledge Reconstruction Service                   |
|  - Security & Authorization Policy Middleware         |
|  - Handover Lifecycle State Machine                   |
|  - Activity Audit Logger                              |
+-------------------------------------------------------+
          |                                  |
          v                                  v
+-----------------------+          +--------------------+
|  Google Gemini API    |          |  Prisma / Storage  |
|  (gemini-3.8-flash)   |          |  Relational DB     |
|  or Deterministic NLP |          |  (SQLite / Cloud   |
|  Rule Engine Fallback |          |   SQL PostgreSQL)  |
+-----------------------+          +--------------------+
```

---

## 3. Data Flow

1. **Source Ingestion**: The user uploads documents (PDF, DOCX, TXT, MD, CSV). The server computes a SHA-256 checksum, strips malicious formatting, segments text into excerpts, and stores the source with a security classification.
2. **Knowledge Reconstruction**: The server compiles authorized excerpts into a structured prompt for Google Gemini 3.8 Flash (or triggers the deterministic rule engine). Output is validated using Zod against the `ExtractedKnowledge` schema.
3. **Evidence Indexing**: Decisions, tasks, risks, and dependencies are stored in the database with foreign key references to the source excerpts.
4. **Human Review**: An authorized reviewer inspects claims, resolves detected contradictions (e.g., Redis vs. Postgres), and clicks Approve.
5. **Controlled Handover**: The owner shares the approved handover with the successor. The successor reviews the continuation plan and provides a timestamped digital receipt sign-off.
