# ContinuityOS — AI & External Service Disclosure

## 1. AI Models and APIs Used

- **Primary Model**: Google Gemini 3.8 Flash (`gemini-3.8-flash`).
- **SDK**: Official `@google/genai` TypeScript SDK (v2.4.0+).
- **Execution Context**: 100% Server-side inside Node.js (`server/services/reconstruction.ts`). The API key is stored in environment variables (`GEMINI_API_KEY`) and is never sent to the browser client.
- **Output Format**: Structured JSON mode using `responseMimeType: "application/json"` and strict `responseSchema` definitions.

---

## 2. Deterministic Rule-Based Fallback

To ensure continuous uptime during hackathon evaluations, ContinuityOS includes a deterministic rule-based NLP extraction fallback (`executeDeterministicReconstruction`).
If the Gemini API key is missing, network access is restricted, or the API returns a rate-limit error, the system automatically runs the deterministic engine.
The fallback:
- Analyzes document text and Markdown headings.
- Detects contradictions (e.g. comparing kickoff session storage requirements with architecture revisions).
- Flags unassigned task ownership and missing deadlines.
- Detects single-person knowledge bottlenecks and critical infrastructure dependencies.
- Produces identical typed entity structures with verbatim excerpts.

---

## 3. Responsible AI & Prompt Injection Safeguards

- **Untrusted Document Boundary**: All uploaded documents are treated as untrusted user input. Documents are wrapped in clear delimiter tags and isolated from system directives.
- **Zero-Fabrication Policy**: System instructions strictly forbid the AI from inventing dates, people, or citations. Missing data must be flagged explicitly as `missing` or `Unassigned`.
- **Epistemic Labeling**: Claims are categorized into `verified`, `inferred`, `conflicting`, `missing`, and `unknown` so users know the exact epistemic status of every item.
- **Human Approval Requirement**: No AI output is treated as approved truth. The platform enforces that handovers must be reviewed and approved by an authorized human before sharing.
