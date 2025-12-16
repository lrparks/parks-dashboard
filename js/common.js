/**
 * Common utilities shared across parks-dashboard pages
 */

/**
 * Format a period string (YYYYMM) to human-readable format
 * @param {string} period - Period in YYYYMM format (e.g., "202401")
 * @returns {string} Formatted period (e.g., "January 2024")
 */
function formatPeriod(period) {
    const year = period.substring(0, 4);
    const month = parseInt(period.substring(4, 6));
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
                   'July', 'August', 'September', 'October', 'November', 'December'];
    return `${months[month - 1]} ${year}`;
}

/**
 * Parse a single CSV line, handling quoted fields
 * @param {string} line - Single line of CSV text
 * @returns {string[]} Array of field values
 */
function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    result.push(current.trim());
    return result;
}

/**
 * Parse CSV text into array of objects
 * @param {string} text - Full CSV text content
 * @returns {Object[]} Array of row objects with header keys
 */
function parseCSV(text) {
    const lines = text.trim().split('\n');
    const headers = parseCSVLine(lines[0]);
    const data = [];

    for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        const values = parseCSVLine(lines[i]);
        const row = {};
        headers.forEach((header, index) => {
            row[header] = values[index] || '';
        });
        data.push(row);
    }

    return data;
}

/**
 * Show a loading indicator in an element
 * @param {string} elementId - ID of element to show loading in
 * @param {string} message - Loading message to display
 */
function showLoading(elementId, message = 'Loading...') {
    const el = document.getElementById(elementId);
    if (el) {
        el.innerHTML = `
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 flex items-center gap-3">
                <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                <span class="text-blue-700">${message}</span>
            </div>
        `;
    }
}

/**
 * Show an error message in an element
 * @param {string} elementId - ID of element to show error in
 * @param {string} message - Error message to display
 */
function showError(elementId, message = 'An error occurred') {
    const el = document.getElementById(elementId);
    if (el) {
        el.innerHTML = `
            <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <span class="text-red-700">${message}</span>
            </div>
        `;
    }
}

/**
 * Hide an element by ID
 * @param {string} elementId - ID of element to hide
 */
function hideElement(elementId) {
    const el = document.getElementById(elementId);
    if (el) {
        el.classList.add('hidden');
    }
}

/**
 * Show an element by ID
 * @param {string} elementId - ID of element to show
 */
function showElement(elementId) {
    const el = document.getElementById(elementId);
    if (el) {
        el.classList.remove('hidden');
    }
}
