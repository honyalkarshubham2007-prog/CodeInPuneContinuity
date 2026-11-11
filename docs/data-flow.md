# ContinuityOS — Data Flow & Verification Pipeline

## Overview

The ContinuityOS data pipeline transforms unstructured or semi-structured project artifacts into verified, governed knowledge artifacts.

---

## 1. Ingestion & Preprocessing Stage

```
[Raw Document: PDF, DOCX, TXT, MD, CSV]
                  │
                  ▼
         [Security Sanitation]
  (Strips executable macros, enforces 15MB limit)
                  │
                  ▼
        [Format-Specific Parser]
  (mammoth for DOCX, csv-parse for CSV, native for MD/TXT/PDF)
                  │
                  ▼
    [Checksum & Excerpt Segmentation]
  (Generates SHA-256 fingerprint, chunks by heading/section)
                  │
                  ▼
    [Stored in Continuity Database]
```

---

## 2. Epistemic Knowledge Reconstruction Stage

```
        [Project Source Repository]
                     │
                     ▼
  [Server-Side Context Formulation]
  (Aggregates authorized document excerpts)
                     │
         ┌───────────┴───────────┐
         ▼                       ▼
[Google Gemini 3.8 Flash]   [Deterministic Rule Engine]
(Structured JSON Schema)    (Regex & Heading Scanner)
         │                       │
         └───────────┬───────────┘
                     │
                     ▼
          [Zod Schema Validation]
                     │
                     ▼
     [Certainty Classification & Linkage]
     - VERIFIED (Direct verbatim match)
     - INFERRED (Logical interpretation)
     - CONFLICTING (Contradictory sources)
     - MISSING (Explicitly absent fields)
                     │
                     ▼
         [Project Knowledge Graph]
```

---

## 3. Handover Governance & Access-Controlled Transfer

```
  [Reconstructed Knowledge Graph]
                 │
                 ▼
     [Handover Studio Draft]
                 │
                 ▼
      [Reviewer Audit Loop]
  (Approve / Reject / Clarify claims)
                 │
                 ▼
  [Server Authorization Check]
  (Blocks sharing until status is APPROVED)
                 │
                 ▼
      [Successor Onboarding]
  (Scoped view + continuation checklist)
                 │
                 ▼
   [Digital Sign-Off Acceptance]
                 │
                 ▼
    [Immutable Activity Log]
```
