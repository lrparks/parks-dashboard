# Parks Dashboard Refactoring Plan
**Target Environment:** GitHub Pages (Static Hosting)
**Goals:** Simple maintenance, mobile-friendly, no hosting costs
**Strategy:** Vanilla JS component loading with Tailwind CSS build step

---

## 🎯 Core Principles

1. **No server-side processing** - GitHub Pages is static only
2. **Minimal build tooling** - Only Tailwind CSS compilation required (see Build Setup below)
3. **Client-side component loading** - Use JavaScript to load shared HTML
4. **Mobile-first** - Continue using compiled Tailwind CSS
5. **Progressive enhancement** - Pages work even if JS fails

### Build Setup (Current)
The project now uses compiled Tailwind CSS instead of CDN:
- **Config:** `tailwind.config.js` - defines which files to scan for classes
- **Input:** `src/input.css` - Tailwind directives
- **Output:** `styles.css` - compiled CSS (committed to repo)
- **Build command:** `npx tailwindcss -i ./src/input.css -o ./styles.css`

⚠️ **Important:** When adding `/components/` directory, update `tailwind.config.js`:
```javascript
content: ["./*.html", "./components/**/*.html", "./js/**/*.js"]
```

---

## 📁 Proposed New File Structure

```
parks-dashboard/
├── index.html                    # Homepage
├── about.html                    # About page
├── meetings.html                 # Commission meetings
├── reports.html                  # Reports archive
├── dashboard.html                # Data dashboard (currently uses React)
├── rebsamen.html                 # Rebsamen Golf Course / USTA comparison
├── PR-strategic-kpi-tracker.html # KPI tracking page
│
├── components/           # NEW - Shared HTML components
│   ├── header.html      # Common site header/nav
│   └── footer.html      # Common site footer
│
├── js/                  # NEW - Organized JavaScript
│   ├── common.js        # Utilities used across pages
│   ├── components.js    # Component loader
│   └── modal.js         # Reusable modal functionality
│
├── src/                 # Tailwind source
│   └── input.css        # Tailwind directives
│
├── styles.css           # Compiled Tailwind CSS (generated)
├── tailwind.config.js   # Tailwind configuration
│
└── data/                # Existing data files
    ├── meetings.csv
    ├── reports.csv
    └── ...
```

### All Pages (7 total)
| Page | Description | Special Considerations |
|------|-------------|----------------------|
| `index.html` | Homepage | Uses `<header>` instead of `<nav>` |
| `about.html` | About/info page | Mixed header styling |
| `meetings.html` | Commission meetings list | CSV data loading, modal viewer |
| `reports.html` | Reports archive | CSV data loading, modal viewer |
| `dashboard.html` | Data visualizations | **Uses React** (Phase 4 decision) |
| `rebsamen.html` | Golf/USTA comparison | Comparison tables |
| `PR-strategic-kpi-tracker.html` | KPI metrics | Inline styles (Phase 3 cleanup) |

---

## 🚀 Implementation Phases

### **PHASE 1: Foundation (Low Risk)**
*Set up shared utilities without breaking existing pages*

#### Step 1.1: Create Shared JavaScript Utilities
**File:** `/js/common.js`

**Contains:**
- `formatPeriod(period)` - Date formatting (currently duplicated)
- `parseCSV(csvText)` - CSV parsing (standardized version)
- `showLoading(elementId, message)` - Loading state helper
- `showError(elementId, message)` - Error state helper
- `hideElement(elementId)` - Visibility helper

**Action:**
- Extract functions from `meetings.html` and `reports.html`
- Create single canonical implementation
- Test thoroughly

#### Step 1.2: Create Reusable Modal System
**File:** `/js/modal.js`

**Contains:**
- `createModal(id, title)` - Generate modal HTML dynamically
- `openModal(id, contentUrl, title)` - Show modal with content
- `closeModal(id)` - Hide modal
- Keyboard event handler (ESC to close)

**Benefits:**
- Replaces `openDocViewer()` and `openPdfViewer()` duplication
- Consistent modal behavior across site
- ~80 lines of duplicated HTML removed

#### Step 1.3: Create Component Loader
**File:** `/js/components.js`

**Purpose:** Load header/footer HTML via fetch API

```javascript
async function loadComponent(elementId, componentPath) {
  try {
    const response = await fetch(componentPath);
    const html = await response.text();
    document.getElementById(elementId).innerHTML = html;
  } catch (error) {
    console.error('Failed to load component:', error);
  }
}

// Usage in each page:
document.addEventListener('DOMContentLoaded', () => {
  loadComponent('site-header', '/components/header.html');
  loadComponent('site-footer', '/components/footer.html');
});
```

**Test Strategy:**
- Test locally first
- Verify GitHub Pages serves `/components/` correctly
- Ensure mobile navigation still works

---

### **PHASE 2: Extract Header & Footer (Medium Risk)**
*Move duplicated HTML to shared components*

#### Step 2.1: Create Footer Component
**File:** `/components/footer.html`

```html
<footer class="bg-gray-800 text-gray-300 py-6 px-4 mt-8">
    <div class="max-w-6xl mx-auto text-center text-sm">
        <p class="font-medium">Little Rock Parks & Recreation Commission</p>
        <p class="mt-1 text-gray-400">City of Little Rock, Arkansas</p>
        <p class="mt-1 text-gray-400">
            <a href="/about.html" class="hover:text-white transition-colors">
                Independently maintained as a public resource
            </a>
        </p>
    </div>
</footer>
```

**Decisions:**
- Standardize on `max-w-6xl` for consistency
- Standardize on `mt-8` for spacing
- Use absolute paths (`/about.html`) for reliability

#### Step 2.2: Create Header/Navigation Component
**File:** `/components/header.html`

```html
<nav class="bg-green-700 text-white no-print">
    <div class="max-w-6xl mx-auto px-4 py-3">
        <div class="flex flex-wrap items-center justify-between gap-2">
            <a href="/index.html" class="font-semibold hover:text-green-200 transition">
                LR Parks Commission
            </a>
            <div class="flex gap-1 text-sm">
                <a href="/reports.html"
                   class="px-2 sm:px-3 py-1.5 rounded hover:bg-green-600 transition"
                   data-page="reports">
                    Reports
                </a>
                <a href="/meetings.html"
                   class="px-2 sm:px-3 py-1.5 rounded hover:bg-green-600 transition"
                   data-page="meetings">
                    Meetings
                </a>
                <a href="/dashboard.html"
                   class="px-2 sm:px-3 py-1.5 rounded hover:bg-green-600 transition"
                   data-page="dashboard">
                    Dashboard
                </a>
                <a href="/rebsamen.html"
                   class="px-2 sm:px-3 py-1.5 rounded hover:bg-green-600 transition"
                   data-page="rebsamen">
                    Rebsamen
                </a>
                <a href="/PR-strategic-kpi-tracker.html"
                   class="px-2 sm:px-3 py-1.5 rounded hover:bg-green-600 transition"
                   data-page="kpi">
                    KPIs
                </a>
            </div>
        </div>
    </div>
</nav>
```

**Note:** With 6 nav items, consider testing on mobile to ensure navigation doesn't overflow. May need a hamburger menu if too crowded.

**Active Page Highlighting:**
Add to `/js/components.js`:
```javascript
function highlightActivePage() {
  const currentPage = window.location.pathname.split('/').pop().replace('.html', '');
  document.querySelectorAll('nav a[data-page]').forEach(link => {
    if (link.dataset.page === currentPage) {
      link.classList.add('bg-green-800');
    }
  });
}

// Call after header loads
document.addEventListener('DOMContentLoaded', async () => {
  await loadComponent('site-header', '/components/header.html');
  await loadComponent('site-footer', '/components/footer.html');
  highlightActivePage();
});
```

#### Step 2.3: Update Each HTML Page
**For:** `meetings.html`, `reports.html`, `dashboard.html`, `rebsamen.html`, `PR-strategic-kpi-tracker.html`

**Changes:**
1. Replace `<nav>...</nav>` with `<div id="site-header"></div>`
2. Replace `<footer>...</footer>` with `<div id="site-footer"></div>`
3. Add script tags before `</body>`:
   ```html
   <script src="/js/components.js"></script>
   <script>
     document.addEventListener('DOMContentLoaded', () => {
       loadComponent('site-header', '/components/header.html');
       loadComponent('site-footer', '/components/footer.html');
     });
   </script>
   ```

**Special Cases:**
- `index.html` - Uses `<header>` instead of `<nav>`, may want different treatment
- `about.html` - Has mixed header, needs custom approach

#### Step 2.4: Rebuild Tailwind CSS
After creating components, update config and rebuild:
```bash
# Update tailwind.config.js content array first, then:
npx tailwindcss -i ./src/input.css -o ./styles.css
```

---

### **PHASE 3: Standardization (Low Risk)**
*Clean up inconsistencies*

#### Step 3.1: Standardize Container Widths
**Decision:** Use `max-w-6xl` everywhere for consistency

**Changes:**
- Update all page main containers to `max-w-6xl`
- Update header/footer to `max-w-6xl`
- Maintains responsive design
- Provides comfortable reading width

**Files to Update:**
- `index.html` - Change from `max-w-4xl` to `max-w-6xl`
- `about.html` - Change from `max-w-4xl` to `max-w-6xl`
- `rebsamen.html` - Verify container width consistency
- `PR-strategic-kpi-tracker.html` - Change from `max-w-7xl` to `max-w-6xl`

#### Step 3.2: Consolidate Loading/Error States
**Add to `/js/common.js`:**

```javascript
function createLoadingElement(id, message = 'Loading...') {
  return `
    <div id="${id}" class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 flex items-center gap-3">
      <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
      <span class="text-blue-700">${message}</span>
    </div>
  `;
}

function createErrorElement(id, message = 'An error occurred') {
  return `
    <div id="${id}" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
      <span class="text-red-700">${message}</span>
    </div>
  `;
}
```

**Update pages:** Replace hardcoded loading/error HTML with JS function calls

#### Step 3.3: Remove Inline Styles
**File:** `PR-strategic-kpi-tracker.html`

**Current:** Has large `<style>` block (lines 8-79)

**Options:**
1. Convert to Tailwind utility classes (preferred - keeps everything in HTML)
2. Move to `/css/custom.css` (only if truly necessary)

**Approach:**
- Most custom styles can be replicated with Tailwind
- Example: `.tooltip .tooltiptext` → Use Tailwind's `group` and `group-hover:`
- Reduces CSS maintenance burden

---

### **PHASE 4: React Decision (Medium Risk)**
*Resolve framework inconsistency*

#### Option A: Remove React from dashboard.html (RECOMMENDED)
**Why:**
- Only one page uses it
- Adds 3 external dependencies
- Can be rewritten in vanilla JS (like other pages)
- Faster page load
- Consistent codebase

**Effort:**
- Moderate (4-6 hours)
- Rewrite chart rendering in vanilla JS
- May need a lightweight charting library (Chart.js?)

**Benefits:**
- Consistent architecture
- Faster load times
- Simpler maintenance

#### Option B: Keep React on dashboard.html
**Why:**
- If dashboard needs frequent updates
- If complex interactivity is planned
- If React components will be reused

**Recommendation:** Start with Option A unless there's a specific reason to keep React

---

### **PHASE 5: Card Components (Optional)**
*Further reduce duplication*

**Create:** `/js/cards.js`

**Contains:**
- `createNavigationCard(title, description, href, icon)` - For index.html
- `createReportCard(report)` - For reports.html
- `createMeetingCard(meeting)` - For meetings.html

**Benefits:**
- Consistent card styling
- Single source of truth for card structure
- Easy to update card design globally

**Effort:** Low-Medium (2-3 hours)

---

## 📱 Mobile-Friendly Checklist

All refactoring maintains current mobile design:
- ✅ Tailwind responsive classes (`sm:`, `md:`, `lg:`)
- ✅ Flexible containers (`max-w-*` + `mx-auto`)
- ✅ Touch-friendly navigation (already implemented)
- ✅ Readable text sizes
- ✅ No horizontal scrolling

**Additional Mobile Enhancements:**
- Ensure modals are scrollable on small screens
- Test component loading on mobile networks (keep components small)
- Consider adding mobile menu toggle if nav grows beyond 4-5 items

---

## 🧪 Testing Strategy

### Before Committing Each Phase:
1. **Visual Testing:**
   - Test all 6 pages in Chrome, Firefox, Safari
   - Test on mobile (responsive mode + real device)
   - Verify print styles still work (`no-print` class)

2. **Functional Testing:**
   - Click all navigation links
   - Open/close modals
   - Load CSV data on meetings/reports pages
   - Test keyboard navigation (Tab, Escape)

3. **GitHub Pages Testing:**
   - Deploy to a test branch first
   - Verify component paths work (`/components/header.html`)
   - Check browser console for 404s
   - Test on live GitHub Pages URL

### Testing Workflow:
```bash
# Create test branch
git checkout -b refactor/phase-1-utilities

# Make changes

# Rebuild Tailwind CSS (required after HTML/JS changes that use new classes)
npx tailwindcss -i ./src/input.css -o ./styles.css

# Test locally with Python simple server
python3 -m http.server 8000

# Test in browser at localhost:8000

# Commit changes (including updated styles.css)
git add .
git commit -m "Phase X: description"

# Deploy to GitHub Pages test branch
git push origin refactor/phase-1-utilities

# Test at: https://[username].github.io/parks-dashboard/
# (Configure Pages to build from test branch temporarily)
```

---

## 🎯 Recommended Implementation Order

### **Week 1: Foundation (PHASE 1)**
- Create `/js/common.js` with shared utilities
- Create `/js/modal.js` for modal functionality
- Create `/js/components.js` for component loading
- Test component loading locally

**Risk:** Low
**Effort:** 3-4 hours
**Benefit:** Immediate code reduction

### **Week 2: Components (PHASE 2)**
- Create `/components/header.html`
- Create `/components/footer.html`
- Update one page (test with `meetings.html` first)
- Test on GitHub Pages
- Roll out to remaining pages

**Risk:** Medium (test thoroughly)
**Effort:** 4-6 hours
**Benefit:** Eliminates 200+ lines of duplicate HTML

### **Week 3: Standardization (PHASE 3)**
- Standardize container widths
- Consolidate loading/error states
- Remove inline styles from KPI tracker

**Risk:** Low
**Effort:** 2-3 hours
**Benefit:** Visual consistency

### **Week 4: React Decision (PHASE 4)**
- Audit dashboard.html React usage
- Decide: Remove or keep
- Implement decision

**Risk:** Medium-High
**Effort:** 4-6 hours
**Benefit:** Architectural consistency

### **Later: Card Components (PHASE 5)**
- Optional optimization
- Implement if time permits

---

## 📊 Expected Code Reduction

| Category | Before | After | Reduction |
|----------|--------|-------|-----------|
| Footer HTML | ~50 lines × 7 files = 350 lines | 1 × 10 lines = 10 lines | **97% reduction** |
| Nav HTML | ~20 lines × 5 files = 100 lines | 1 × 30 lines = 30 lines | **70% reduction** |
| Modal HTML/JS | ~40 lines × 2 files = 80 lines | 1 × 30 lines = 30 lines | **63% reduction** |
| Utilities (formatPeriod, etc) | ~30 lines × 2 files = 60 lines | 1 × 15 lines = 15 lines | **75% reduction** |
| **TOTAL** | **~590 lines** | **~85 lines** | **86% reduction** |

**Maintenance Impact:**
- Change footer → Edit 1 file instead of 7
- Update navigation → Edit 1 file instead of 5
- Fix modal bug → Fix 1 file instead of 2
- Add utility function → Add to 1 file, available everywhere

---

## ⚠️ Potential Gotchas for GitHub Pages

### 1. **CORS Issues**
- `fetch()` may fail locally but work on GitHub Pages
- Use `python3 -m http.server` for local testing (avoids CORS)

### 2. **Path References**
- Use absolute paths: `/components/header.html` (not `./components/header.html`)
- GitHub Pages serves from root or subpath depending on config

### 3. **Caching**
- Browser may cache old components
- Add version query strings during testing: `/components/header.html?v=2`
- Or use hard refresh (Ctrl+Shift+R)

### 4. **404 Fallback**
- If component fails to load, page should still work
- Add fallback content or error handling

### 5. **Case Sensitivity**
- GitHub Pages servers are case-sensitive
- Use lowercase filenames consistently

---

## 🔄 Rollback Plan

If issues arise:

### Quick Rollback:
```bash
git revert <commit-hash>
git push origin main
```

### Phase-by-Phase Rollback:
- Each phase is a separate commit
- Can rollback individual phases without losing others

### Safety Commits:
Before each phase:
```bash
git add .
git commit -m "Checkpoint before Phase X: [description]"
```

---

## 📝 Documentation Updates Needed

After refactoring:
1. Update README with new structure
2. Document component system
3. Create developer guide for adding new pages
4. Document shared utilities

---

## 🎉 Success Criteria

Refactoring is successful when:
- ✅ All pages render identically to before
- ✅ Mobile experience unchanged
- ✅ No JavaScript errors in console
- ✅ GitHub Pages deployment works
- ✅ Footer/header changes require editing only 1 file
- ✅ Navigation works on all pages
- ✅ Modals work consistently
- ✅ CSV data loads properly
- ✅ Print styles still work
- ✅ Code base is smaller and easier to maintain

---

## 💡 Future Enhancements (Post-Refactoring)

Once refactoring is complete, consider:

1. **Dark Mode**
   - Easy to implement with Tailwind
   - Single toggle affects whole site

2. **Search Functionality**
   - Search across reports/meetings
   - Client-side with Fuse.js

3. **Better Data Visualization**
   - Lightweight charting library (Chart.js, D3.js)
   - Interactive dashboards

4. **Offline Support**
   - Service Worker for PWA
   - Cache static assets

5. **Accessibility Audit**
   - ARIA labels
   - Keyboard navigation
   - Screen reader testing

---

## 🚦 Getting Started

Ready to begin? Here's your first task:

```bash
# 1. Create new branch
git checkout -b refactor/phase-1-foundation

# 2. Create directory structure
mkdir -p js components

# 3. Update tailwind.config.js to include new directories
# Change content to: ["./*.html", "./components/**/*.html", "./js/**/*.js"]

# 4. Create first file: js/common.js
# (Extract formatPeriod and parseCSV functions)

# 5. Test locally
python3 -m http.server 8000

# 6. Rebuild Tailwind (if any new classes were used)
npx tailwindcss -i ./src/input.css -o ./styles.css

# 7. Commit and push
git add .
git commit -m "Phase 1: Add shared JavaScript utilities"
git push origin refactor/phase-1-foundation
```

---

**Questions? Want me to implement any phase?** Let me know!