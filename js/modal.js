/**
 * Reusable modal system for parks-dashboard
 *
 * Usage:
 * 1. Include modal HTML in your page (or use createModal to generate it)
 * 2. Call openModal(prefix, file, title) to open
 * 3. Call closeModal(prefix) to close
 */

/**
 * Create modal HTML dynamically
 * @param {string} prefix - Unique prefix for modal IDs (e.g., 'pdf', 'doc')
 * @param {string} defaultTitle - Default title shown in modal header
 * @returns {string} HTML string for the modal
 */
function createModalHTML(prefix, defaultTitle = 'Document') {
    return `
        <div id="${prefix}-modal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50 flex items-center justify-center p-4">
            <div class="bg-white rounded-lg w-full max-w-4xl h-[80vh] flex flex-col">
                <div class="flex items-center justify-between p-4 border-b">
                    <h3 id="${prefix}-title" class="font-semibold text-gray-800">${defaultTitle}</h3>
                    <div class="flex gap-2">
                        <a id="${prefix}-new-tab" href="#" target="_blank" class="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded text-sm transition">
                            Open in New Tab
                        </a>
                        <button onclick="closeModal('${prefix}')" class="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded text-sm transition">
                            Close
                        </button>
                    </div>
                </div>
                <iframe id="${prefix}-iframe" class="flex-1 w-full" src=""></iframe>
            </div>
        </div>
    `;
}

/**
 * Inject a modal into the page
 * @param {string} prefix - Unique prefix for modal IDs
 * @param {string} defaultTitle - Default title for the modal
 * @param {string} containerId - ID of container to append modal to (default: 'main' or 'body')
 */
function createModal(prefix, defaultTitle = 'Document', containerId = null) {
    const html = createModalHTML(prefix, defaultTitle);
    const container = containerId
        ? document.getElementById(containerId)
        : (document.querySelector('main') || document.body);
    container.insertAdjacentHTML('beforeend', html);
}

/**
 * Open a modal with content
 * @param {string} prefix - Modal prefix (e.g., 'pdf', 'doc')
 * @param {string} file - URL/path to load in iframe
 * @param {string} title - Title to display in modal header
 */
function openModal(prefix, file, title) {
    const modal = document.getElementById(`${prefix}-modal`);
    const titleEl = document.getElementById(`${prefix}-title`);
    const iframe = document.getElementById(`${prefix}-iframe`);
    const newTabLink = document.getElementById(`${prefix}-new-tab`);

    if (!modal) {
        console.error(`Modal with prefix "${prefix}" not found`);
        return;
    }

    if (titleEl) titleEl.textContent = title;
    if (iframe) iframe.src = file;
    if (newTabLink) newTabLink.href = file;

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

/**
 * Close a modal
 * @param {string} prefix - Modal prefix (e.g., 'pdf', 'doc')
 */
function closeModal(prefix) {
    const modal = document.getElementById(`${prefix}-modal`);
    const iframe = document.getElementById(`${prefix}-iframe`);

    if (modal) {
        modal.classList.add('hidden');
    }
    if (iframe) {
        iframe.src = '';
    }
    document.body.style.overflow = '';
}

/**
 * Setup keyboard handler for closing modals on Escape
 * @param {string[]} prefixes - Array of modal prefixes to handle
 */
function setupModalKeyboardHandler(prefixes) {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            prefixes.forEach(prefix => {
                const modal = document.getElementById(`${prefix}-modal`);
                if (modal && !modal.classList.contains('hidden')) {
                    closeModal(prefix);
                }
            });
        }
    });
}

/**
 * Setup click handler for closing modal on backdrop click
 * @param {string} prefix - Modal prefix
 */
function setupModalBackdropHandler(prefix) {
    const modal = document.getElementById(`${prefix}-modal`);
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(prefix);
            }
        });
    }
}

/**
 * Initialize a modal with all handlers
 * @param {string} prefix - Modal prefix
 */
function initModal(prefix) {
    setupModalKeyboardHandler([prefix]);
    setupModalBackdropHandler(prefix);
}

// Legacy compatibility functions for existing pages
// These wrap the generic modal functions with the old function signatures

function openPdfViewer(file, title) {
    openModal('pdf', file, title);
}

function closePdfViewer() {
    closeModal('pdf');
}

function openDocViewer(file, title) {
    openModal('doc', file, title);
}

function closeDocViewer() {
    closeModal('doc');
}
