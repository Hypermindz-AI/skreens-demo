# Skreens Demo - Claude Context

## Project Overview

This is a demo platform showcasing the **Skreens + HyperMindZ** integration for DOOH (Digital Out-of-Home) advertising with contextual L-Bar ads triggered by live sports events through Private Marketplace (PMP) deals.

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **UI**: React 19, Tailwind CSS, shadcn/ui components
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Testing**: Playwright for E2E and video recording
- **Theme**: next-themes (default: dark mode)

## Key Features

### 1. L-Bar Demo (`/lbar-demo`)
- Live sports simulation with contextual ad triggering
- Event types: Touchdown, Field Goal, Halftime
- L-Bar overlay animation with countdown timer

### 2. Deal Management (`/deals`)
- PMP deal table with status, impressions, spend, pacing
- **DealWizard** - Enhanced 5-step wizard with agency-os features

### 3. MCP Monitor (`/mcp-monitor`)
- Real-time JSON-RPC communication visualization
- Skreens <-> HyperMindZ API methods demo

### 4. Dashboard (`/`)
- Performance metrics with charts
- Dark mode optimized

## DealWizard Features (Recently Enhanced)

Located at: `src/components/demo/DealWizard.tsx`

### Step 1: Deal Info
- **Deal Type Selection**: PMP (purple), Preferred Deal (blue), Programmatic Guaranteed (green)
- **Auction Type**: First Price / Second Price (PMP only)
- **Info Banner**: Dynamic explanation of selected deal type

### Step 2: Supply Selection
- AI-Ranked packages with match scores (94%, 82%, 58%, 45%)
- Rank badges (#1-#4) with semantic colors
- Collapsible details: Quality Score, Win Rate, Capacity, Avg Dwell Time
- Trust cues: Last validated, Data source

### Step 3: Audience Selection
- AI-Scored segments with match percentages
- Index vs Average metrics
- Collapsible details: Data freshness, Source provider

### Step 4: Creative
- Template selection (L-Bar variants, Overlay, Banner)
- Contextual triggers (Touchdown, Goal, Halftime)

### Step 5: Review
- **Deal Type Badge** with auction type
- **Health Status Indicator**: Healthy/Warning/Critical
- **AI Performance Estimation Engine**: Est. Impressions, Spend, eCPM, Win Rate with confidence levels
- **Quality Metrics Panel**: Viewability, Brand Safety, IVT Rate, Quality Score
- **Approval Status Preview** with SLA indicator

## Demo Recording

### Run the demo script:
```bash
npx playwright test demo-script.ts --headed --project=chromium
```

### Convert to MP4:
```bash
ffmpeg -y -i test-results/demo-script.ts-Skreens-PMP-bba0d--Demo-Full-Demo-Walkthrough-chromium/video.webm -c:v libx264 -preset medium -crf 23 -c:a aac -b:a 128k test-results/skreens-demo-hd.mp4
```

### Demo timing configuration (in `demo-script.ts`):
- `PAUSE_SHORT`: 3000ms
- `PAUSE_MEDIUM`: 6000ms
- `PAUSE_LONG`: 9000ms

## Development Commands

```bash
# Start dev server
pnpm dev --port 3002

# Lint
pnpm lint

# Build
pnpm build
```

## Key Files

| File | Purpose |
|------|---------|
| `src/components/demo/DealWizard.tsx` | Enhanced PMP deal creation wizard |
| `src/components/demo/LBarOverlay.tsx` | L-Bar ad overlay component |
| `src/app/page.tsx` | Dashboard with charts |
| `src/app/deals/page.tsx` | Deal management page |
| `src/app/lbar-demo/page.tsx` | L-Bar demo page |
| `demo-script.ts` | Playwright demo recording script |
| `playwright.config.ts` | Playwright config (1920x1080 video) |

## Recent Changes (Jan 2025)

1. **DealWizard Enhancement** - Added agency-os features:
   - Deal types (PMP/Preferred/PG) with visual badges
   - Auction type selection
   - Health status indicators
   - AI Performance Estimation Engine
   - Quality Metrics Panel
   - Approval workflow preview

2. **Dark Mode Fixes**:
   - Chart axis labels use `currentColor` for theme support
   - Step indicator uses Tailwind classes instead of CSS variables
   - Default theme set to dark

3. **Demo Recording**:
   - 1920x1080 resolution
   - Slower pacing for readability
   - Output: `test-results/skreens-demo-hd.mp4`

## UI Patterns from Agency-OS

The DealWizard follows patterns from `/agentic-platform/components/agency-os/`:
- Match scores with semantic colors (green 80+, blue 60-79, yellow 40-59, red <40)
- Collapsible card details
- Trust cues (lastValidated, dataSource)
- Glassmorphism card effects
- Approval workflow with SLA tracking

## Notes

- Server runs on port 3002 (configured in playwright.config.ts)
- Video recording at 1920x1080 with trace enabled
- Default dark theme to avoid theme switching during demo
