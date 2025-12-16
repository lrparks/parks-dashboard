/**
 * Component loader for parks-dashboard
 * Loads shared HTML components (header, footer) via fetch API
 */

/**
 * Load an HTML component into an element
 * @param {string} elementId - ID of element to load component into
 * @param {string} componentPath - Path to the component HTML file
 * @returns {Promise<boolean>} True if successful, false otherwise
 */
async function loadComponent(elementId, componentPath) {
    const element = document.getElementById(elementId);
    if (!element) {
        console.error(`Element with id "${elementId}" not found`);
        return false;
    }

    try {
        const response = await fetch(componentPath);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const html = await response.text();
        element.innerHTML = html;
        return true;
    } catch (error) {
        console.error(`Failed to load component "${componentPath}":`, error);
        // Optionally show fallback content
        element.innerHTML = `
            <div class="bg-yellow-50 border border-yellow-200 rounded p-2 text-sm text-yellow-700">
                Component failed to load
            </div>
        `;
        return false;
    }
}

/**
 * Highlight the active page in navigation
 * Call this after the header component loads
 */
function highlightActivePage() {
    // Get current page name from URL
    const path = window.location.pathname;
    let currentPage = path.split('/').pop().replace('.html', '');

    // Handle index/home page
    if (!currentPage || currentPage === '' || currentPage === 'index') {
        currentPage = 'index';
    }

    // Find and highlight matching nav link
    document.querySelectorAll('nav a[data-page]').forEach(link => {
        if (link.dataset.page === currentPage) {
            link.classList.add('bg-green-800');
        }
    });
}

/**
 * Load standard site components (header and footer)
 * @param {Object} options - Configuration options
 * @param {boolean} options.header - Whether to load header (default: true)
 * @param {boolean} options.footer - Whether to load footer (default: true)
 * @param {string} options.basePath - Base path for components (default: '/components')
 * @returns {Promise<void>}
 */
async function loadSiteComponents(options = {}) {
    const {
        header = true,
        footer = true,
        basePath = '/components'
    } = options;

    const promises = [];

    if (header) {
        promises.push(
            loadComponent('site-header', `${basePath}/header.html`)
                .then(success => {
                    if (success) highlightActivePage();
                })
        );
    }

    if (footer) {
        promises.push(loadComponent('site-footer', `${basePath}/footer.html`));
    }

    await Promise.all(promises);
}

/**
 * Initialize components on DOMContentLoaded
 * Call this to automatically load header/footer when page loads
 */
function initComponents() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => loadSiteComponents());
    } else {
        loadSiteComponents();
    }
}
