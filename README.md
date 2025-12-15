# Little Rock Parks & Recreation Commissioner Dashboard

**An independent analytical tool that supports commission oversight and advisory roles**

## Purpose

This dashboard consolidates monthly division reports, financial data, and operational metrics to support the Little Rock Parks and Recreation Commission in fulfilling its oversight responsibilities under LRC §2-330.

Effective oversight requires access to performance data, trend analysis, and the ability to identify where advocacy and policy recommendations can best serve the public interest. This tool provides commissioners with accessible, evidence-based insights for resource allocation and policy decisions.

**⚠️ Note**: This is an unofficial project by a commissioner, not an official city resource.

## About Little Rock Parks & Recreation

**Mission**: Encouraging healthy lifestyles by providing quality recreation opportunities and access to exceptional park experiences in an efficient and equitable manner.

**Vision**: Creating a City in a Park through innovative recreational programming and vibrant park spaces which enhance the quality of life for all residents of Little Rock.

## Live Dashboard

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
├── index.html                            # Landing page [✓]
├── reports.html                          # Division report browser [✓]
├── meetings.html                         # Meeting archive [✓]
├── dashboard.html                        # Main dashboard [in progress]
├── PR-strategic-kpi-tracker.html.html    # KPIs from Strategic Plan 2025-2030 [in progress]
├── reports.json                          # Report metadata [✓]
├── meetings.json                         # Meeting metadata [✓]
├── pdfs/                                 # Division reports [✓]
│   └── YYYYMM-division.pdf
└── transcripts/                          # YouTube auto-transcripts [✓]
    └── YYYYMM_Title.txt                  # (not 100% accurate)
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
| Transcripts | `YYYYMM_Title.txt` | `202410_Commission_Meeting.txt` |
| Division Codes | lowercase | admin, operations, recreation, volunteer, safety |

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
- GitHub Pages deployment

### 🚧 In Progress
- Automated PDF data extraction

### 📋 Planned
- Historical trend visualizations
- Mobile-responsive improvements
- Cross-report search functionality

## Monthly Data Workflow

1. Receive division reports (PDFs)
2. Extract data using a consistent prompt
3. Update the Historical_Data column
4. Upload PDFs to `/pdfs/` directory
5. Update `reports.json` metadata
6. Verify the accuracy

## Key Metrics (90+)

**Financial**: Monthly/YTD revenue, operating expenditures, cost recovery ratio, per capita spending

**Staffing**: 131 budgeted FTEs, vacancy rates, key positions

**Facilities**: 22 locations, inspection compliance, ADA status

**Programs**: Golf rounds, tennis hours, fitness memberships, museum attendance, community center participation

**Volunteers**: Total hours, 9 active programs, impact measurement

**Safety**: Training completion, fire safety checks, playground inspections, active hazards

## Technical Stack

- **Frontend**: React 18, Tailwind CSS
- **Data**: Google Sheets published CSV endpoints
- **Hosting**: GitHub Pages
- **PDF Rendering**: pdf.js
- **Video**: YouTube embeds

## Resources

- **Dashboard**: https://lrparks.github.io/parks-dashboard/dashboard.html
- **Data Sheets**: [Google Sheets](https://docs.google.com/spreadsheets/d/1B7PqWIRj1YUJq7rDKqqsLnrEmJMZR3e4NXD8B9pURmM/)
- **Meeting Videos**: [YouTube Playlist](https://www.youtube.com/playlist?list=PLSXmGY5EaMipmi0a0kqiGcFUsKuj-A9J3)
- **NRPA Benchmarks**: https://www.nrpa.org/publications-research/ParkMetrics/
- **City P&R Dept**: https://www.littlerock.gov/departments/parks-recreation/
- **Parks & Recreation 2025-2030 Strategic Plan**: [View Report](https://www.littlerock.gov/media/24449/strategic-plan-final-2025-2030-21825.pdf)

---

*Unofficial project. Data sourced from public commission materials.*
