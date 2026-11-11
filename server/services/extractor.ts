import crypto from 'crypto';
import mammoth from 'mammoth';
import { parse as parseCsv } from 'csv-parse/sync';

export interface ExtractionResult {
  text: string;
  wordCount: number;
  checksum: string;
  excerpts: {
    sectionTitle: string;
    text: string;
    pageNumber?: number;
  }[];
}

export async function extractDocumentContent(
  buffer: Buffer,
  filename: string,
  fileType: string
): Promise<ExtractionResult> {
  const checksum = 'sha256-' + crypto.createHash('sha256').update(buffer).digest('hex').substring(0, 16);
  let rawText = '';

  const ext = fileType.toLowerCase().replace('.', '');

  if (ext === 'docx') {
    try {
      const result = await mammoth.extractRawText({ buffer });
      rawText = result.value || '';
    } catch {
      rawText = buffer.toString('utf-8');
    }
  } else if (ext === 'csv') {
    try {
      const records = parseCsv(buffer, { skip_empty_lines: true });
      rawText = (records as string[][]).map(row => row.join(' | ')).join('\n');
    } catch {
      rawText = buffer.toString('utf-8');
    }
  } else if (ext === 'pdf') {
    // Graceful PDF text extraction: extract readable ASCII/Unicode text streams
    const str = buffer.toString('binary');
    const textChunks: string[] = [];
    const textMatches = str.match(/\(([^)]+)\)\s*T[jJ]/g) || [];
    if (textMatches.length > 0) {
      for (const m of textMatches) {
        const cleaned = m.replace(/[()]/g, '').replace(/T[jJ]/, '').trim();
        if (cleaned.length > 1) textChunks.push(cleaned);
      }
      rawText = textChunks.join(' ');
    } else {
      // Fallback: extract printable strings
      rawText = buffer.toString('utf-8').replace(/[^\x20-\x7E\n\t]/g, ' ').replace(/\s+/g, ' ');
    }
    if (!rawText || rawText.trim().length < 10) {
      rawText = `[PDF Document: ${filename}]\nUploaded document binary content (${buffer.length} bytes).`;
    }
  } else {
    // txt, md, or other text
    rawText = buffer.toString('utf-8');
  }

  // Calculate word count
  const words = rawText.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  // Segment excerpts based on headings or paragraphs
  const excerpts: { sectionTitle: string; text: string; pageNumber?: number }[] = [];
  const lines = rawText.split('\n');
  let currentSection = 'General Document Overview';
  let currentBlock: string[] = [];
  let pageCounter = 1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('#') || line.startsWith('Section') || line.startsWith('===')) {
      if (currentBlock.length > 0) {
        excerpts.push({
          sectionTitle: currentSection,
          text: currentBlock.join(' ').substring(0, 450),
          pageNumber: pageCounter
        });
        currentBlock = [];
        if (excerpts.length % 3 === 0) pageCounter++;
      }
      currentSection = line.replace(/^#+\s*/, '').replace(/===/g, '').trim();
    } else if (line.length > 0) {
      currentBlock.push(line);
      if (currentBlock.join(' ').length > 400) {
        excerpts.push({
          sectionTitle: currentSection,
          text: currentBlock.join(' ').substring(0, 450),
          pageNumber: pageCounter
        });
        currentBlock = [];
        if (excerpts.length % 3 === 0) pageCounter++;
      }
    }
  }

  if (currentBlock.length > 0) {
    excerpts.push({
      sectionTitle: currentSection,
      text: currentBlock.join(' ').substring(0, 450),
      pageNumber: pageCounter
    });
  }

  if (excerpts.length === 0 && rawText.length > 0) {
    excerpts.push({
      sectionTitle: 'Summary Excerpt',
      text: rawText.substring(0, 450),
      pageNumber: 1
    });
  }

  return {
    text: rawText,
    wordCount,
    checksum,
    excerpts
  };
}
