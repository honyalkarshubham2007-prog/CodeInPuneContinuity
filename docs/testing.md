# ContinuityOS — Testing & Quality Assurance

## 1. Test Strategy

ContinuityOS employs a multi-layered verification strategy:

1. **Unit Testing (`node:test`)**:
   - Location: `server/services/reconstruction.test.ts`
   - Runner: `npx --yes tsx --test server/services/reconstruction.test.ts`
   - Scope: Pure business logic verification:
     - Identification of conflicting specifications (e.g., Redis cluster vs PostgreSQL session tables).
     - Accurate tagging of unassigned tasks and missing deadlines.
     - Single-person knowledge bottleneck detection.
     - Departure / Absence Drill readiness score calculation and mitigation generation.
     - Handover lifecycle state transitions (claim review, reviewer approval, and successor digital sign-off).

2. **End-to-End Browser Testing (`playwright-cli`)**:
   - Tested journeys:
     - Journey 1: Initial dashboard load and metric derivation across 7 documents.
     - Journey 2: Source Evidence Explorer opening from a claim and verifying verbatim citations.
     - Journey 3: Absence Drill simulating outgoing lead departure and generating mitigations.
     - Journey 4: Handover Studio claim auditing, conflict clarification, and reviewer approval.
     - Journey 5: Server-side sharing guard enforcement followed by successor sign-off.
     - Journey 6: Responsive layout verification across desktop (1440x900) and mobile (390x844).

---

## 2. Test Execution Commands

```bash
# Execute unit test suite
npm test

# Run build compilation check
npm run build

# Run TypeScript lint check
npm run lint
```
