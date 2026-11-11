# ContinuityOS — Known Limitations & Operational Boundaries

1. **Third-Party Live Connectors**:
   - In accordance with hackathon integrity guidelines, external connectors (direct live GitHub webhooks, live Google Drive sync) are documented as planned Round 3 commitments and are not simulated with fake progress bars. Local document upload supports all standard enterprise exports (PDF, DOCX, TXT, MD, CSV).

2. **Large Scanned PDF OCR**:
   - The current lightweight extraction engine extracts readable text streams and character encodings. Heavily compressed scanned image PDFs without an embedded OCR text layer will require Tesseract or Gemini Vision in production.

3. **In-Memory & SQLite Persistence**:
   - The MVP uses local SQLite/JSON persistence designed for single-node environments. Production deployments across serverless clusters require Google Cloud SQL (PostgreSQL) as configured in `prisma/schema.prisma`.

4. **Multi-Tenant Org Isolation**:
   - The current version supports multi-project workspaces within an organization. Cross-organization tenant isolation with separate database schemas is planned for future enterprise releases.
