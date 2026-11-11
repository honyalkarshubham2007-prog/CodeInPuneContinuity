import React, { useState, useRef } from 'react';
import {
  Upload,
  FileText,
  Trash2,
  Eye,
  CheckCircle2,
  AlertCircle,
  Clock,
  Shield,
  Search,
  Cpu,
  X,
  FileCheck,
  Hash,
  Sparkles
} from 'lucide-react';
import { Source, SourceClassification } from '../../types/index.js';

interface SourcesViewProps {
  projectId: string;
  sources: Source[];
  onUpload: (file: File, classification: SourceClassification) => Promise<void>;
  onDelete: (sourceId: string) => Promise<void>;
  onTriggerReconstruction: () => Promise<void>;
  isReconstructing: boolean;
}

export const SourcesView: React.FC<SourcesViewProps> = ({
  projectId,
  sources,
  onUpload,
  onDelete,
  onTriggerReconstruction,
  isReconstructing
}) => {
  const [selectedSource, setSelectedSource] = useState<Source | null>(null);
  const [classification, setClassification] = useState<SourceClassification>('internal');
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setErrorMsg(null);
    setUploading(true);

    try {
      for (let i = 0; i < files.length; i++) {
        await onUpload(files[i], classification);
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleLoadSample = async (sampleType: 'adr' | 'sre' | 'budget') => {
    let filename = '';
    let content = '';
    let mimeType = 'text/plain';

    if (sampleType === 'adr') {
      filename = 'ADR-042-Auth-Migration-Keycloak.md';
      mimeType = 'text/markdown';
      content = `# Architecture Decision Record: ADR-042
Date: 2026-10-18
Status: Approved
Decided by: Alex Rivera (Lead Architect)

## Context
Our legacy custom session cookie system causes intermittent 401 token dropouts across cross-subdomain API calls.

## Decision
We will migrate all service authentication to OAuth2/OIDC backed by Campus Keycloak SSO.

## Rationale
Centralized role-based claim issuance prevents session hijacking and eliminates duplicate credential databases.

## Consequences & Unassigned Tasks
- Deprecate old auth middleware by Q1.
- Audit service-to-service mTLS certificates before cutover.
- Owner: Unassigned. Deadline: 2026-11-20.
`;
    } else if (sampleType === 'sre') {
      filename = 'SRE-Incident-881-Bastion-Postmortem.txt';
      mimeType = 'text/plain';
      content = `INCIDENT REPORT #881: BASTION HOST SSH KEY DRIFT
Date: 2026-10-22
Author: Jordan Lee & Alex Rivera
Severity: Medium

SUMMARY:
During a scheduled failover drill, staging engineer Jordan Lee was unable to access production bastion 10.0.1.4.

ROOT CAUSE:
The root SSH key for the bastion was stored exclusively on Alex Rivera's local workstation (/Users/alex/.ssh/campus_prod_ed25519) and had never been uploaded to the university 1Password vault.

MITIGATION ACTION ITEMS:
1. Rotate production bastion SSH key pair immediately.
2. Store encrypted private key in institutional HashiCorp Vault.
3. Remove individual engineer public keys from /root/.ssh/authorized_keys.
`;
    } else {
      filename = 'Q3-Cloud-Infrastructure-Cost-Audit.csv';
      mimeType = 'text/csv';
      content = `Resource,Environment,MonthlyCostUSD,Owner,RenewalDate,Notes
k8s-prod-cluster-east,Production,1420.00,Alex Rivera,2026-11-30,Requires departmental budget signoff
postgres-primary-db,Production,680.00,Alex Rivera,2026-12-15,Active production database
redis-cache-cluster,Staging,210.00,Unassigned,2026-11-01,Staging cache instance overdue for review
bastion-gateway-vm,Production,45.00,Alex Rivera,2027-01-10,Secure access proxy
`;
    }

    setUploading(true);
    setErrorMsg(null);
    try {
      const blob = new Blob([content], { type: mimeType });
      const file = new File([blob], filename, { type: mimeType });
      await onUpload(file, classification);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Sample upload failed');
    } finally {
      setUploading(false);
    }
  };

  const filteredSources = sources.filter(s =>
    s.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.rawText.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header with Title & Reconstruction CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900 dark:text-white">
            Knowledge Source Ingestion
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Authorised documents, spreadsheets, meeting logs and architectural records feeding project continuity.
          </p>
        </div>

        <button
          onClick={onTriggerReconstruction}
          disabled={isReconstructing}
          className="px-4 py-2.5 bg-slate-900 text-white dark:bg-teal-600 dark:hover:bg-teal-500 hover:bg-slate-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors shrink-0"
        >
          <Cpu className={`w-4 h-4 ${isReconstructing ? 'animate-spin' : ''}`} />
          <span>{isReconstructing ? 'Reconstructing Knowledge Graph...' : 'Reconstruct Knowledge Graph'}</span>
        </button>
      </div>

      {/* Upload Drag & Drop Area */}
      <div
        onDragOver={e => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={`p-6 sm:p-8 rounded-2xl border-2 border-dashed transition-all text-center ${
          dragActive
            ? 'border-teal-500 bg-teal-50/60 dark:bg-teal-950/20'
            : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0B1730]'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.docx,.txt,.md,.csv"
          onChange={e => handleFiles(e.target.files)}
          className="hidden"
          id="file-upload-input"
        />

        <div className="max-w-md mx-auto space-y-3">
          <div className="w-12 h-12 mx-auto rounded-xl bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-teal-600 dark:text-teal-400">
            <Upload className="w-6 h-6" />
          </div>

          <div>
            <label
              htmlFor="file-upload-input"
              className="text-sm font-bold text-slate-900 dark:text-white hover:text-teal-600 dark:hover:text-teal-400 cursor-pointer underline decoration-teal-500"
            >
              Choose document files
            </label>
            <span className="text-sm text-slate-500 dark:text-slate-400"> or drag and drop here</span>
          </div>

          <p className="text-xs text-slate-400 font-mono">
            Supported formats: PDF, DOCX, TXT, Markdown, CSV · Max 15MB per file
          </p>

          {/* Classification Selection */}
          <div className="pt-2 flex items-center justify-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">Permission Classification:</span>
            <select
              value={classification}
              onChange={e => setClassification(e.target.value as SourceClassification)}
              className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="internal">Internal (Default)</option>
              <option value="public">Public</option>
              <option value="confidential">Confidential (Restricted Access)</option>
            </select>
          </div>

          {/* Quick Presets for Evaluators */}
          <div className="pt-1 flex items-center justify-center gap-1.5 flex-wrap text-xs">
            <span className="text-slate-400 font-mono text-[11px] flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-teal-500" />
              <span>1-Click test samples:</span>
            </span>
            <button
              type="button"
              onClick={() => handleLoadSample('adr')}
              disabled={uploading}
              className="px-2 py-0.5 text-[11px] font-medium bg-slate-100 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-950/60 text-slate-700 dark:text-slate-300 hover:text-teal-700 dark:hover:text-teal-300 rounded-md border border-slate-200 dark:border-slate-700 transition-colors"
            >
              ADR-042 (MD)
            </button>
            <button
              type="button"
              onClick={() => handleLoadSample('sre')}
              disabled={uploading}
              className="px-2 py-0.5 text-[11px] font-medium bg-slate-100 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-950/60 text-slate-700 dark:text-slate-300 hover:text-teal-700 dark:hover:text-teal-300 rounded-md border border-slate-200 dark:border-slate-700 transition-colors"
            >
              SRE Post-Mortem (TXT)
            </button>
            <button
              type="button"
              onClick={() => handleLoadSample('budget')}
              disabled={uploading}
              className="px-2 py-0.5 text-[11px] font-medium bg-slate-100 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-950/60 text-slate-700 dark:text-slate-300 hover:text-teal-700 dark:hover:text-teal-300 rounded-md border border-slate-200 dark:border-slate-700 transition-colors"
            >
              Infra Budget (CSV)
            </button>
          </div>

          {uploading && (
            <div className="flex items-center justify-center gap-2 text-xs text-teal-600 font-medium pt-2">
              <Clock className="w-4 h-4 animate-spin" />
              <span>Extracting content and computing cryptographic checksum...</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 rounded-lg text-xs">
              {errorMsg}
            </div>
          )}
        </div>
      </div>

      {/* Search and Ingested Sources Table */}
      <div className="bg-white dark:bg-[#0B1730] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        {/* Table Filter Bar */}
        <div className="p-4 sm:px-6 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Ingested Documents ({filteredSources.length})
            </span>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search documents or text..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>
        </div>

        {/* Sources List */}
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {filteredSources.map(s => (
            <div
              key={s.id}
              className="p-4 sm:px-6 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              {/* Document Info */}
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-mono font-bold text-xs uppercase text-slate-700 dark:text-slate-300 shrink-0 mt-0.5">
                  {s.fileType}
                </div>

                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {s.filename}
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md uppercase ${
                      s.classification === 'confidential' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300' :
                      s.classification === 'internal' ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' :
                      'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                    }`}>
                      {s.classification}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-400 flex-wrap font-mono">
                    <span>Uploaded by {s.uploadedBy}</span>
                    <span>·</span>
                    <span className="tabular-nums">{s.wordCount} words</span>
                    <span>·</span>
                    <span className="tabular-nums">{(s.size / 1024).toFixed(1)} KB</span>
                    <span>·</span>
                    <span className="truncate max-w-[150px]" title={s.checksum}>{s.checksum}</span>
                  </div>
                </div>
              </div>

              {/* Status & Actions */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <span className="text-xs text-emerald-700 bg-emerald-50 dark:bg-emerald-950/50 dark:text-emerald-400 font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Processed</span>
                </span>

                <button
                  onClick={() => setSelectedSource(s)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5 text-teal-600" />
                  <span>Inspect Excerpts</span>
                </button>

                <button
                  onClick={() => onDelete(s.id)}
                  aria-label={`Delete source ${s.filename}`}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {filteredSources.length === 0 && (
            <div className="p-8 text-center text-xs text-slate-400">
              No documents matched your search filter.
            </div>
          )}
        </div>
      </div>

      {/* Inspect Source Modal */}
      {selectedSource && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div 
            className="w-full max-w-3xl bg-white dark:bg-[#0B1730] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[85vh] flex flex-col"
            role="dialog"
            aria-modal="true"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#14213D]/40">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-teal-600" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {selectedSource.filename}
                  </h3>
                  <div className="text-xs text-slate-400 font-mono">
                    {selectedSource.wordCount} words · Checksum: {selectedSource.checksum}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedSource(null)}
                aria-label="Close inspector"
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200/50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Raw Text & Excerpts */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Extracted Document Body
              </div>
              <pre className="p-4 bg-slate-50 dark:bg-slate-900/80 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed overflow-x-auto">
                {selectedSource.rawText}
              </pre>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#14213D]/40 flex justify-end">
              <button
                onClick={() => setSelectedSource(null)}
                className="px-4 py-2 bg-slate-900 text-white dark:bg-teal-600 rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
