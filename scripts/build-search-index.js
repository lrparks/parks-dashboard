#!/usr/bin/env node
/**
 * Build search index from PDF files
 * Extracts text using pdftotext and creates year-based JSON indexes
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

// Get all report PDFs (format: YYYYMM-division.pdf)
const files = fs.readdirSync(pdfsDir)
  .filter(f => /^\d{6}-\w+\.pdf$/.test(f))
  .sort();

console.log(`Found ${files.length} PDF files to process`);

// Group files by year/yearGroup
const grouped = {};

files.forEach(file => {
  const match = file.match(/^(\d{4})(\d{2})-(\w+)\.pdf$/);
  if (!match) return;

  const [, year, month, division] = match;
  const group = getYearGroup(year);

  if (!grouped[group]) {
    grouped[group] = [];
  }

  grouped[group].push({
    file,
    year,
    month,
    period: year + month,
    division
  });
});

// Process each group
Object.keys(grouped).sort().forEach(group => {
  const groupFiles = grouped[group];
  console.log(`\nProcessing ${group}: ${groupFiles.length} files`);

  const index = [];
  let errors = 0;

  groupFiles.forEach(({ file, period, division }) => {
    const filePath = path.join(pdfsDir, file);

    try {
      // Extract text using pdftotext
      const text = execSync(`pdftotext "${filePath}" -`, {
        encoding: 'utf8',
        maxBuffer: 10 * 1024 * 1024 // 10MB buffer
      });

      // Clean and normalize text
      const cleanText = text
        .replace(/\r\n/g, '\n')
        .replace(/\n{3,}/g, '\n\n')
        .replace(/\s+/g, ' ')
        .trim();

      index.push({
        period,
        division,
        file: `pdfs/${file}`,
        content: cleanText
      });

      process.stdout.write('.');
    } catch (err) {
      console.error(`\n  Failed: ${file} - ${err.message}`);
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
