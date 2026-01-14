# Little Rock Parks & Recreation Commissioner Dashboard

**An independent analytical tool that supports commission oversight and advisory roles**

## Purpose

This dashboard consolidates monthly division reports, financial data, and operational metrics to support the Little Rock Parks and Recreation Commission in fulfilling its oversight responsibilities under LRC §2-330.

Effective oversight requires access to performance data, trend analysis, and the ability to identify where advocacy and policy recommendations can best serve the public interest. This tool provides commissioners with accessible, evidence-based insights for resource allocation and policy decisions.

**⚠️ Note**: This is an unofficial project by a commissioner, not an official city resource.

## About Little Rock Parks & Recreation

**Mission**: Encouraging healthy lifestyles by providing quality recreation opportunities and access to exceptional park experiences in an efficient and equitable manner.

**Vision**: Creating a City in a Park through innovative recreational programming and vibrant park spaces which enhance the quality of life for all residents of Little Rock.

## Live Links

**🔗 [View Commission Resources](https://lrparks.github.io/parks-dashboard/index.html)**

**🔗 [View Dashboard](https://lrparks.github.io/parks-dashboard/dashboard.html)**

### Key Insights
- **Economic Drivers**: Jim Dailey Fitness, Golf, Tennis, Museum
- **Community Engagement**: Community Centers, Youth Programs, Volunteers
- **Operations**: Capital projects, maintenance, facilities
- **Safety & Compliance**: Training, inspections, hazards
- **Budget Performance**: Revenue, expenditures, cost recovery
- **Peer Benchmarking**: Little Rock vs. NRPA standards

## Project Structure

```
parks-dashboard/
├── index.html                    # Landing page
├── about.html                    # About this dashboard
├── reports.html                  # Division report browser (with full-text search)
├── meetings.html                 # Meeting archive (with full-text search)
├── calendar.html                 # Meeting calendar
├── parks-commission-attendance.html  # Commissioner attendance tracker
├── dashboard.html                # Main dashboard (React)
├── rebsamen.html                 # Tennis economic calculator (React, unlisted)
├── PR-strategic-kpi-tracker.html # KPIs from Strategic Plan 2025-2030
│
├── .github/
│   └── workflows/
│       ├── auto-update-json.yml  # Automated JSON updates
│       └── build-search-index.yml # Builds full-text search indexes
│
├── components/                   # Shared HTML components
│   ├── header.html               # Site navigation
│   └── footer.html               # Site footer
│
├── js/                           # Shared JavaScript
│   ├── common.js                 # Utilities (CSV parsing, date formatting)
│   ├── components.js             # Component loader
│   └── modal.js                  # Reusable modal system
│
├── styles.css                    # Compiled Tailwind CSS
├── tailwind.config.js            # Tailwind configuration
├── src/input.css                 # Tailwind source
│
├── reports.json                  # Report metadata (auto-updated)
├── meetings.json                 # Meeting metadata (auto-updated)
├── attendance.json               # Commissioner attendance data
├── search-index-*.json           # Full-text search indexes (auto-generated)
├── robots.txt                    # Search engine blocking
│
├── pdfs/                         # Division reports
│   └── YYYYMM-division.pdf
├── transcripts/                  # YouTube auto-transcripts
│   └── YYYYMM_Title.txt
│
└── scripts/                      # Development tools
    ├── build-search-index.js         # Extracts text from PDFs for search
    ├── auto_update_reports_json.py   # Updates reports.json locally
    ├── auto_update_meetings_json.py  # Updates meetings.json locally
    └── download_youtube_transcript.py
```

## Data Sources

### Google Sheets Backend
- **Sheet ID** (1B7PqWIRj1YUJq7rDKqqsLnrEmJMZR3e4NXD8B9pURmM)
- **Current Data** (gid=1349162393): Monthly metrics
- **Historical Data** (gid=1744427153): Time-series trends  
- **Benchmarks** (gid=2039065708): Peer comparisons
- **Parks & Recreation KPIs from 2025-2030 Strategic Plan** (gid=597349438): KPI Trends with 2024 Baseline

[View Sheets](https://docs.google.com/spreadsheets/d/1B7PqWIRj1YUJq7rDKqqsLnrEmJMZR3e4NXD8B9pURmM/)

### Division Reports
Monthly reports from five divisions:
- **Admin**: Revenue, staffing, PIT funding, accreditation
- **Operations**: Capital projects, maintenance, facility status
- **Recreation**: Golf, tennis, fitness, museums, community centers, youth programs
- **Volunteer**: Hours, programs, impact metrics
- **Safety**: Training, inspections, compliance, hazards

## Naming Conventions

| Element | Format | Example |
|---------|--------|---------|
| Period | `YYYYMM` | `202410` |
| Reports | `YYYYMM-division.pdf` | `202410-admin.pdf` |
| Reference Docs | `YYYYMM-reference-description.pdf` | `202601-reference-agenda.pdf` |
| Transcripts | `YYYYMM_Title.txt` | `202410_Commission_Meeting.txt` |
| Division Codes | lowercase | admin, operations, recreation, volunteer, safety, reference |

## Attendance Tracking

The `parks-commission-attendance.html` page tracks commissioner attendance using data from `attendance.json`.

**Data Structure:**
```json
{
  "2025": {
    "meetings": ["202501", "202502", ...],
    "commissioners": [
      {
        "name": "First Last",
        "role": "Chair",
        "term_expires": "2026",
        "status": "Active",
        "subcommittees": ["MP", "Mktg"],
        "attendance": {
          "202501": true,
          "202502": false,
          "202503": null
        }
      }
    ],
    "bod_liaisons": [
      {
        "name": "Director Name",
        "role": "City Board",
        "attendance": { "202501": true }
      }
    ]
  }
}
```

**Attendance Values:**
- `true` = Present
- `false` = Absent
- `null` = Not yet a member
- Omitted = No meeting that month

**Subcommittee Codes:** MP (Master Plan), Mktg (Marketing), PC (Parks Conservancy)

## Commission Responsibilities

Per [LRC §2-330](https://library.municode.com/ar/little_rock/codes/code_of_ordinances?nodeId=PTIICOOR_CH2AD_ARTVIIIPA_S2-330LIROPAREADCO), the Commission:
- Advises on operations, maintenance, and park system growth
- Recommends budget priorities to city manager
- Guides the implementation of the master plan and the capital funding allocation
- Proposes fee structures for services and facilities
- Submits annual reports to Board of Directors

[Full Bylaws](./pdfs/202501-reference-bylaws.pdf)

## Development Status

### ✅ Completed
- Interactive dashboard with 9 tabs and 90+ metrics
- Google Sheets integration with live data feeds
- Report browser with PDF viewer (month/division navigation)
- Meeting archive with videos and transcripts
- **Full-text search** across all PDFs and transcripts
- Meeting calendar view
- Commissioner attendance tracker
- Automated JSON updates via GitHub Actions
- Automated search index building via GitHub Actions
- KPI Tracker (Strategic Plan 2025-2030)
- Shared component system (header/footer)
- GitHub Pages deployment

### 📋 Planned
- Historical trend visualizations (charts/graphs)

## Automated Workflows

### GitHub Actions Integration

The repository uses GitHub Actions to automatically maintain `reports.json` and `meetings.json` when new files are added.

**Workflow:** `.github/workflows/auto-update-json.yml`

**Triggers:**
- Automatically when PDFs are pushed to `pdfs/`
- Automatically when transcripts are pushed to `transcripts/`
- Manually via Actions tab

**What it does:**
1. Scans `pdfs/` folder for new report files
2. Scans `transcripts/` folder for new meeting transcripts
3. Extracts metadata (period, division, video ID)
4. Updates `reports.json` and `meetings.json`
5. Commits changes back to repository

**Video ID Extraction:**
The workflow automatically extracts YouTube video IDs from transcript headers:
```
Title: December 2025 - Parks Commission Meeting
Period: 202512
Video ID: 91AmsS6KByU  ← Automatically extracted
URL: https://www.youtube.com/watch?v=91AmsS6KByU
```

### Monthly Workflow (Simplified)

**Old process:**
1. Receive division reports
2. Upload PDFs to repository
3. Manually update reports.json
4. Download YouTube transcript
5. Upload transcript
6. Manually update meetings.json with video ID
7. Commit all changes

**New automated process:**
1. Receive division reports
2. Upload PDFs to `pdfs/` folder
3. Download YouTube transcript (includes video ID)
4. Upload transcript to `transcripts/` folder
5. Commit and push
6. ✨ **GitHub Actions automatically updates both JSON files**

**Time saved:** ~10-15 minutes per month

### Search Index Workflow

Full-text search is powered by pre-built JSON indexes that are automatically regenerated when PDFs or transcripts change.

**Workflow:** `.github/workflows/build-search-index.yml`

**Triggers:**
- Automatically when PDFs are pushed to `pdfs/`
- Automatically when transcripts are pushed to `transcripts/`
- Manually via Actions tab

**What it does:**
1. Extracts text from all PDFs using `pdftotext`
2. Reads transcript files directly
3. Creates year-based search index files
4. Commits updated indexes back to repository

**Index Files:**
| File | Contents |
|------|----------|
| `search-index-2022-2023.json` | Combined older data |
| `search-index-2024.json` | 2024 documents |
| `search-index-2025.json` | 2025 documents |
| `search-index-2026.json` | 2026 documents (current) |

**Document Types Indexed:**
- Division reports (`YYYYMM-division.pdf`)
- Agendas (`YYYYMM-agenda.pdf`)
- Minutes (`YYYYMM-minutes.pdf`)
- Reference docs (`YYYYMM-reference-*.pdf`)
- Transcripts (`YYYYMM_Title.txt`)

**Search Features:**
- **Reports page**: Search all document types, filter by type (Report, Agenda, Minutes, Reference, Transcript)
- **Meetings page**: Search agendas, minutes, and transcripts only
- Client-side fuzzy search using Fuse.js
- Results show matching context with highlighted keywords

### Local Development Scripts

Scripts in the `scripts/` folder for local development:

- **`build-search-index.js`** - Extracts PDF text and builds search indexes (requires Node.js and pdftotext)
- **`auto_update_reports_json.py`** - Scans PDFs and updates reports.json locally
- **`auto_update_meetings_json.py`** - Scans transcripts and updates meetings.json locally
- **`download_youtube_transcript.py`** - Interactive YouTube transcript downloader

These mirror the GitHub Actions workflows and are useful for:
- Testing changes before pushing
- Bulk updates to existing data
- Offline development

**Building search indexes locally:**
```bash
# Install pdftotext (required)
sudo apt-get install poppler-utils  # Linux
brew install poppler                 # macOS

# Run the build script
node scripts/build-search-index.js
```

## Key Metrics (90+)

**Financial**: Monthly/YTD revenue, operating expenditures, cost recovery ratio, per capita spending

**Staffing**: 131 budgeted FTEs, vacancy rates, key positions

**Facilities**: 22 locations, inspection compliance, ADA status

**Programs**: Golf rounds, tennis hours, fitness memberships, museum attendance, community center participation

**Volunteers**: Total hours, 9 active programs, impact measurement

**Safety**: Training completion, fire safety checks, playground inspections, active hazards

## Technical Stack

- **Frontend**: Vanilla JS (most pages), React 18 (dashboard, rebsamen)
- **Styling**: Tailwind CSS (compiled)
- **Data**: Google Sheets published CSV endpoints
- **Search**: Fuse.js (client-side fuzzy search), pdftotext (text extraction)
- **Automation**: GitHub Actions (YAML workflows)
- **Hosting**: GitHub Pages (static)
- **PDF Rendering**: Browser native / iframe
- **Video**: YouTube embeds
- **Robots**: Blocked via robots.txt

## Local Development

```bash
# Start local server
python3 -m http.server 8000
# View at http://localhost:8000

# Rebuild Tailwind CSS (after adding new Tailwind classes)
npx tailwindcss -i ./src/input.css -o ./styles.css

# Test JSON updates locally (optional)
python scripts/auto_update_reports_json.py
python scripts/auto_update_meetings_json.py

# Download YouTube transcript
python scripts/download_youtube_transcript.py
```

## GitHub Actions Setup

**First-time setup:**

1. Add workflow file to `.github/workflows/auto-update-json.yml`
2. In GitHub: **Settings** → **Actions** → **General**
3. Set **Workflow permissions** to "Read and write permissions"
4. Check "Allow GitHub Actions to create and approve pull requests"
5. Save

**Testing:**
- **Actions** tab → **"Auto-update Reports and Meetings JSON"** → **"Run workflow"**

**Viewing results:**
- Check Actions tab for workflow runs
- Look for commits from `github-actions[bot]`
- Review the summary of what was added

## Resources

- **Dashboard**: https://lrparks.github.io/parks-dashboard/dashboard.html
- **Data Sheets**: [Google Sheets](https://docs.google.com/spreadsheets/d/1B7PqWIRj1YUJq7rDKqqsLnrEmJMZR3e4NXD8B9pURmM/)
- **Meeting Videos**: [YouTube Playlist](https://www.youtube.com/playlist?list=PLSXmGY5EaMipmi0a0kqiGcFUsKuj-A9J3)
- **NRPA Benchmarks**: https://www.nrpa.org/publications-research/ParkMetrics/
- **City P&R Dept**: https://www.littlerock.gov/departments/parks-recreation/
- **Parks & Recreation 2025-2030 Strategic Plan**: [View Report](https://www.littlerock.gov/media/24449/strategic-plan-final-2025-2030-21825.pdf)

---

*Unofficial project. Data sourced from public commission materials. JSON updates automated via GitHub Actions.*
