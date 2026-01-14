#!/usr/bin/env node
/**
 * Build search index from PDFs and transcripts
 * Extracts text and creates year-based JSON indexes
 *
 * Indexes:
 *   - Division reports (YYYYMM-division.pdf)
 *   - Agendas (YYYYMM-agenda.pdf)
 *   - Minutes (YYYYMM-minutes.pdf)
 *   - Reference docs (YYYYMM-reference-*.pdf)
 *   - Transcripts (transcripts/*.txt)
 *
 * Output files:
 *   search-index-2022-2023.json  (combined older data)
 *   search-index-2024.json
 *   search-index-2025.json
 *   search-index-2026.json
 *   etc.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const pdfsDir = './pdfs';
const transcriptsDir = './transcripts';
const outputDir = '.';

// Year groupings: combine 2022-2023, separate for 2024+
const yearGroups = {
  '2022': '2022-2023',
  '2023': '2022-2023',
  // 2024+ get their own files
};

function getYearGroup(year) {
  return yearGroups[year] || year;
}

// Document type detection
function getDocType(filename) {
  if (filename.includes('-agenda')) return 'agenda';
  if (filename.includes('-minutes')) return 'minutes';
  if (filename.includes('-reference')) return 'reference';
  return 'report';  // division reports
}

// Collect all documents
const documents = [];

// 1. Get all PDFs (reports, agendas, minutes, reference)
const pdfFiles = fs.readdirSync(pdfsDir)
  .filter(f => /^\d{6}-.+\.pdf$/.test(f))
  .sort();

pdfFiles.forEach(file => {
  const match = file.match(/^(\d{4})(\d{2})-(.+)\.pdf$/);
  if (!match) return;

  const [, year, month, name] = match;
  const docType = getDocType(file);

  // For reports, extract division name; for others use the type
  let division = null;
  if (docType === 'report') {
    division = name;
  }

  documents.push({
    file,
    filePath: path.join(pdfsDir, file),
    year,
    month,
    period: year + month,
    type: docType,
    division,
    source: 'pdf'
  });
});

// 2. Get all transcripts
if (fs.existsSync(transcriptsDir)) {
  const txtFiles = fs.readdirSync(transcriptsDir)
    .filter(f => /^\d{6}_.+\.txt$/.test(f))
    .sort();

  txtFiles.forEach(file => {
    const match = file.match(/^(\d{4})(\d{2})_(.+)\.txt$/);
    if (!match) return;

    const [, year, month, title] = match;

    documents.push({
      file,
      filePath: path.join(transcriptsDir, file),
      year,
      month,
      period: year + month,
      type: 'transcript',
      title: title,
      division: null,
      source: 'txt'
    });
  });
}

console.log(`Found ${documents.length} documents to process`);
console.log(`  - PDFs: ${pdfFiles.length}`);
console.log(`  - Transcripts: ${documents.filter(d => d.source === 'txt').length}`);

// Group by year/yearGroup
const grouped = {};

documents.forEach(doc => {
  const group = getYearGroup(doc.year);
  if (!grouped[group]) {
    grouped[group] = [];
  }
  grouped[group].push(doc);
});

// Process each group
Object.keys(grouped).sort().forEach(group => {
  const groupDocs = grouped[group];
  console.log(`\nProcessing ${group}: ${groupDocs.length} documents`);

  const index = [];
  let errors = 0;

  groupDocs.forEach(doc => {
    try {
      let text;

      if (doc.source === 'pdf') {
        // Extract text using pdftotext
        text = execSync(`pdftotext "${doc.filePath}" -`, {
          encoding: 'utf8',
          maxBuffer: 10 * 1024 * 1024
        });
      } else {
        // Read transcript directly
        text = fs.readFileSync(doc.filePath, 'utf8');
      }

      // Clean and normalize text
      const cleanText = text
        .replace(/\r\n/g, '\n')
        .replace(/\n{3,}/g, '\n\n')
        .replace(/\s+/g, ' ')
        .trim();

      const entry = {
        period: doc.period,
        type: doc.type,
        file: doc.source === 'pdf' ? `pdfs/${doc.file}` : `transcripts/${doc.file}`,
        content: cleanText
      };

      // Add division for reports
      if (doc.division) {
        entry.division = doc.division;
      }

      // Add title for transcripts
      if (doc.title) {
        entry.title = doc.title;
      }

      index.push(entry);
      process.stdout.write('.');
    } catch (err) {
      console.error(`\n  Failed: ${doc.file} - ${err.message}`);
      errors++;
    }
  });

  // Write index file
  const outputFile = path.join(outputDir, `search-index-${group}.json`);
  fs.writeFileSync(outputFile, JSON.stringify(index, null, 2));

  const stats = fs.statSync(outputFile);
  const sizeMB = (stats.size / 1024 / 1024).toFixed(2);

  console.log(`\n  Created ${outputFile}: ${index.length} docs, ${sizeMB}MB`);
  if (errors > 0) {
    console.log(`  Errors: ${errors}`);
  }
});

console.log('\nDone!');
