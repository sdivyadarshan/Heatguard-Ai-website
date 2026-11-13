# HeatGuard AI

> **An impact-based Extreme Heatwave Early Warning, Human Thermal Stress Intelligence & Municipal Command Platform built with React, TypeScript, Vite, Leaflet, and Express — engineered to solve MoES / NCMRWF Problem Statement `SIH26083` by shifting forecasting from *"what the weather will be"* to *"what the weather will do"* to human health.**

- **Live Primary Deployment:** [https://heat-guard.ai.studio](https://heat-guard.ai.studio)
- **GitHub Pages Fail-Safe Deployment:** Automated static build & deploy workflow included (`.github/workflows/deploy-gh-pages.yml`)

---

## Overview & Problem Statement (`SIH26083`)

Standard weather apps (like Google Weather) report only **ambient dry-bulb temperature ($T_a$)** at a coarse city-wide level. However, **$40^\circ\text{C}$ at $20\%$ humidity** is vastly different physiologically from **$40^\circ\text{C}$ at $70\%$ humidity** — the latter halts evaporative sweat cooling and can rapidly trigger fatal heatstroke.

**HeatGuard AI** solves **Ministry of Earth Sciences (MoES) / NCMRWF Problem Statement `SIH26083`** by fusing meteorological physics, ward-level socioeconomic vulnerability, and epidemiological mortality models into a single real-time command center:

- **20 Official Chennai Wards + 20 Hyper-Local Neighborhood Clusters** (industrial estates, transit corridors, port/dock belts, tin-roof settlements, and coastal zones)
- **Live Thermodynamic & Biometeorological Engine** computing **Stull Wet-Bulb ($T_w$)**, **ISO 7243 WBGT**, **NOAA Rothfusz Heat Index ($HI$)**, and **UTCI** in real time
- **Epidemiological DLNM Mortality & Hospital Surge Forecasting** projecting casualty surge multipliers (`1.0x – 3.5x`) and excess mortality risk (`+%`) days in advance
- **Interactive GIS Threat Radar** powered by Leaflet + Carto/OpenStreetMap/Satellite layers with one-click **Google Maps turn-by-turn routing**
- **Interactive "What-If" Climate Laboratory** with real-time sliders, preset heatwave anomalies, and **ISO 7243 work/rest moratorium calculators**
- **Zero-Click Multilingual Alert Dispatch (English, Tamil, Hindi)** via Twilio WhatsApp / Meta Cloud API (with automatic static client fallback via `wa.me` deep-links)
- **Multi-Page A4 PDF Decision Brief & Retina Chart PNG Exports** using `jsPDF`, `html2canvas-pro`, and `html-to-image`

---

## Why HeatGuard AI Outperforms Standard Weather Apps

| Capability | Standard Weather Apps (e.g., Google Weather) | HeatGuard AI (`SIH26083` Solution) |
| :--- | :---: | :--- |
| **Forecasting Paradigm** | Ambient Temp ($T_a$) only | **Impact-Based Thermal Stress & Health Risk** |
| **Humidity & Solar Physics** | Ignores wet-bulb evaporative failure & solar flux | **Liljegren / ISO 7243 WBGT, Stull $T_w$, NOAA $HI$, UTCI** |
| **Spatial Granularity** | City / Airport station average | **20 GCC Wards + 20 Hyper-Local Suburbs** (e.g., Avadi, Ennore, Ambattur, Royapuram) |
| **Demographic Risk Fusion** | None | **Census + MoSPI PLFS** (outdoor labor, elderly $>60$, tin/slum roofs, tree canopy deficit) |
| **Healthcare Forecasting** | None | **Hospital Surge Factor (`1.0x–3.5x`)** & **Excess Mortality Risk (`+%`)** |
| **Operational Directives** | Generic *"stay hydrated"* tips | **ISO 7243 Work-Rest Schedules**, labor moratorium windows, water tankers & ORS quotas |
| **Emergency Dispatch** | None | **Multilingual WhatsApp/SMS Broadcasts**, **Google Maps Routing**, **A4 PDF Briefs** |

---

## Core Biometeorological & Physics Engine

All thermal indices are calculated continuously in `src/store/useSimulation.ts` and `src/components/WhatIfHeatIndexSimulator.tsx` without canned lookups:

### 1. Stull (2011) Thermodynamic Wet-Bulb Temperature ($T_w$)
Models evaporative cooling potential from dry-bulb temperature ($T$) and relative humidity ($H$):
$$T_w = T \cdot \arctan\left(0.151977 \sqrt{H + 8.313659}\right) + \arctan(T + H) - \arctan(H - 1.676331) + 0.00391838 H^{1.5} \arctan(0.023101 H) - 4.686035$$

### 2. Black Globe Temperature ($T_g$) & ISO 7243 Outdoor WBGT
Combines wet-bulb evaporative stress ($70\%$), solar radiant globe heat ($20\%$, factored by solar radiation $S$ in $\text{W/m}^2$ and wind speed $v$ in $\text{m/s}$), and ambient shade temperature ($10\%$):
$$T_g = T + 0.012\,S - 0.15\,\sqrt{v}$$
$$\text{WBGT} = 0.7\,T_w + 0.2\,T_g + 0.1\,T$$

### 3. NOAA Rothfusz Multi-Order Heat Index ($HI$) & UTCI Approximation
- Converts $T_c \to T_f$ and solves the **9-term NOAA Rothfusz regression polynomial** (including low-humidity $<13\%$ and high-humidity $>85\%$ Rothfusz boundary adjustments).
- Computes **Universal Thermal Climate Index (UTCI)** incorporating vapor pressure saturation $e(T) = 6.105 \exp\left(\frac{17.27 T}{237.7 + T}\right)$, wind cooling, and radiant load.

### 4. Spatial Microclimate Downscaling
Regional synoptic baselines are downscaled per ward using physical urban morphology parameters:
- **Urban Heat Island (UHI) Offset:** Up to $+1.8^\circ\text{C}$ scaled by population density ($\text{km}^2$)
- **Vegetative Canopy Cooling:** Up to $-1.4^\circ\text{C}$ offset based on tree canopy coverage ($\%$)
- **Coastal Sea-Breeze & Moisture Flux:** Humidity and wind adjustments east of $80.25^\circ\text{E}$ longitude

---

## Epidemiological Vulnerability & Mortality Engine

### 1. Multi-Factorial Demographic Vulnerability Multiplier (`0.75 – 1.65`)
Raw thermal stress (`0–100` normalized from $\text{WBGT} \in [24^\circ\text{C}, 36^\circ\text{C}]$) is multiplied by each ward's socioeconomic vulnerability factor:
- **Outdoor Labor Weight (`0.35`):** Construction, port/dock, street vending, and gig workers
- **Informal / Tin-Roof Housing Weight (`0.25`):** Slum and metal-sheet structures trapping radiant heat
- **Elderly Cohort Weight (`0.25`):** Residents aged $>60$ years at elevated cardiovascular risk
- **Healthcare Access Penalty (`0.10`):** Distance in km to the nearest tertiary emergency hospital
- **Tree Canopy Mitigation (`-0.15`):** Shade cover buffering street-level thermal load

### 2. DLNM Hospital Surge & Excess Mortality Curves
Calibrated against tropical urban heat-health surveillance curves (**NCDC / NPCCHH**):
- **Hospital Surge Multiplier:** Scales non-linearly above Risk Score `50` (`1.0 + (riskScore - 50) * 0.035`), projecting emergency room caseload spikes (`1.0x – 3.5x`).
- **Excess Mortality Risk Elevation (`0% – 65%`):** Piecewise exponential curve steepening sharply above $\text{WBGT} \ge 29.0^\circ\text{C}$ and $\ge 33.5^\circ\text{C}$, scaled by the ward's vulnerability multiplier.

### 3. ISO 7243 Work-Rest & NDMA Alert Protocols

| WBGT Threshold | NDMA Alert Stage | ISO 7243 Mandatory Work / Rest Directive |
| :---: | :---: | :--- |
| **`< 28.0°C`** | Normal | Continuous outdoor work permitted |
| **`28.0°C – 29.4°C`** | Stage I (Yellow Alert) | `45 min work / 15 min rest` with mandatory hydration |
| **`29.5°C – 30.9°C`** | Stage II (Orange Watch) | `30 min work / 30 min rest` in shade per hour |
| **`31.0°C – 32.4°C`** | Stage II / III Escalation | `15 min work / 45 min rest` in shade per hour |
| **`≥ 32.5°C`** | **Stage III (Red Extreme)** | **Mandatory outdoor work suspension (Red Protocol)** |

---

## Official Datasets & Standards Registry

Every metric in the platform is backed by transparent provenance badges (`ProvenanceBadge.tsx`) and `src/data/officialDatasets.ts`:

| Domain | Source / Agency | Variables & Datasets | Reference Portal |
| :--- | :--- | :--- | :--- |
| **Meteorology** | **IMD / MoES** | $0.25^\circ$ Gridded Temp/RH, Chennai AWS (Meenambakkam & Nungambakkam), NWFC Bulletins | [mausam.imd.gov.in](https://mausam.imd.gov.in/) · [aws.imd.gov.in](http://aws.imd.gov.in/) |
| **NWP Forecasts** | **NCMRWF** | NCUM Ensemble 5-Day Forecasts, Radiation & Boundary Layer Flux | [ncmrwf.gov.in](https://www.ncmrwf.gov.in/) |
| **Health Surveillance** | **NCDC / MoHFW** | NPCCHH & IHIP Heat-Related Illness (HRI), Hospital Admissions & ORS Metrics | [ncdc.mohfw.gov.in](https://ncdc.mohfw.gov.in/programmes/npcchh/) · [ihip.mohfw.gov.in](https://ihip.mohfw.gov.in/) |
| **Demographics** | **Census of India / MHA** | Primary Census Abstract, Population Density, Elderly $>60$, Slum/Housing Materials | [censusindia.gov.in](https://censusindia.gov.in/) · [data.gov.in](https://data.gov.in/) |
| **Labor Force** | **MoSPI / NSSO** | Periodic Labour Force Survey (PLFS) Outdoor & Informal Workforce Ratios | [mospi.gov.in](https://www.mospi.gov.in/) |
| **Disaster Guidelines** | **NDMA & TNSDMA** | Heat Action Plan (HAP) Thresholds, Section 12 Directives, CAP Standards | [ndma.gov.in](https://ndma.gov.in/) · [tnsdma.tn.gov.in](https://tnsdma.tn.gov.in/) |
| **Thermal Standards** | **ISO / NOAA / ISB** | ISO 7243 WBGT, NOAA NWS SR 90-23 Heat Index, UTCI Cost Action 730 | [iso.org](https://www.iso.org/standard/67126.html) · [utci.org](https://www.utci.org/) |

---

## APIs, Dispatch Pipeline & Export Mechanisms

1. **WhatsApp Zero-Click Alert Gateway (`server.ts` + `WhatsAppAlertDispatcher.tsx`):**
   - `GET /api/whatsapp/config` — Detects active **Twilio WhatsApp API** or **Meta WhatsApp Cloud API (Graph v19.0)** credentials, or gracefully reports simulated/static mode.
   - `POST /api/whatsapp/broadcast` — Concurrently dispatches localized **English, Tamil, and Hindi** advisories targeted by ward, risk tier, or occupation (`Construction`, `Gig/Delivery`, `Elderly`, `General`).
   - **Static GitHub Pages Fail-Safe:** When hosted without the Express backend (e.g., on GitHub Pages), the dispatcher automatically falls back to direct `https://wa.me/...` deep-links and local audit history (`localStorage`).
2. **GIS Mapping & Google Maps Navigation (`src/utils/geoUtils.ts`):**
   - Interactive **Leaflet** canvas supporting Carto Dark, Carto Light, OpenStreetMap, and Esri Satellite tile layers.
   - One-click **Turn-by-Turn Google Maps Routing** (`https://www.google.com/maps/dir/?api=1&destination=lat,lng`) directly to any high-risk ward or nearest emergency hospital.
3. **High-Definition Client-Side PDF & Chart Exports (`ExportDecisionBriefModal.tsx` & `Biometeorology.tsx`):**
   - Uses **`jsPDF` + `html2canvas-pro` + `html-to-image`** (with native Tailwind v4 `oklab`/`oklch` color support and 2x Retina scaling) to compile multi-page A4 Municipal Decision Briefs and vector chart PNGs offline in the browser.

---

## Tech Stack & Architecture

- **Frontend:** React 19, TypeScript 5.8, Vite 6, Tailwind CSS v4 (`@tailwindcss/vite`)
- **Routing & State:** React Router v7 (`BrowserRouter` with dynamic `import.meta.env.BASE_URL`), Zustand v5 (`useSimulation`, `useCitizenStore`, `useThemeStore`)
- **GIS & Data Visualization:** Leaflet (`react-leaflet`), Recharts v3, Lucide React
- **PDF & Image Export:** `jsPDF`, `html2canvas-pro`, `html-to-image`
- **Backend Server (Optional Full-Stack Mode):** Node.js, Express 4, Twilio & Meta WhatsApp Cloud API integration (`server.ts`)
- **Static Fail-Safe Hosting:** GitHub Pages via GitHub Actions (`actions/deploy-pages@v4`) with `404.html` SPA route preservation

---

## Project Structure

```text
├── .github/workflows/
│   └── deploy-gh-pages.yml                    # Automated GitHub Pages CI/CD build & deploy
├── .env.example                               # Optional Gemini, Twilio & Meta Cloud API env vars
├── index.html                                 # App entry HTML & SEO/OpenGraph metadata
├── metadata.json                              # AI Studio applet capabilities & metadata
├── package.json                               # Scripts (dev, build, build:pages, start, lint)
├── server.ts                                  # Express server + Twilio/Meta WhatsApp API gateway
├── vite.config.ts                             # Vite config with dynamic VITE_BASE_PATH for GH Pages
└── src/
    ├── App.tsx                                # Route registry (Dashboard, Map, Hyperlocal, Bio, Sim...)
    ├── main.tsx                               # React 19 entry point
    ├── types.ts                               # Domain TypeScript interfaces (Ward, Metrics, Citizen)
    ├── data/
    │   ├── officialDatasets.ts                # 20 GCC Wards, IMD historical episodes, 5-day forecast, HAP
    │   └── hyperLocalAreas.ts                 # 20 hyper-local suburbs, industrial belts & hospital hubs
    ├── store/
    │   ├── useSimulation.ts                   # Biometeorology physics, DLNM mortality & scenario engine
    │   ├── useCitizenStore.ts                 # Citizen directory, CSV import & WhatsApp dispatch log
    │   └── useThemeStore.ts                   # Control-room Dark / Daylight Light theme persistence
    ├── utils/
    │   ├── geoUtils.ts                        # Google Maps pin & turn-by-turn direction deep links
    │   └── phoneUtils.ts                      # E.164 phone normalization & intelligent CSV parser
    ├── components/
    │   ├── Layout.tsx                         # Top IST clock, NDMA stage pill, replay bar & navigation
    │   ├── CommandPalette.tsx                 # Global Cmd/Ctrl+K search across wards, suburbs & sources
    │   ├── DataModeDrawer.tsx                 # Live vs Historical Heatwave Replay controller
    │   ├── WhatIfHeatIndexSimulator.tsx       # Interactive sliders, NOAA HI, WBGT, UTCI & surge model
    │   ├── CitizenDirectoryManager.tsx        # Searchable citizen registry with CSV import/export
    │   ├── WhatsAppAlertDispatcher.tsx        # Multilingual (EN/TA/HI) zero-click alert broadcaster
    │   ├── ExportDecisionBriefModal.tsx       # Multi-page A4 PDF generator, Print View & WhatsApp brief
    │   └── ProvenanceBadge.tsx                # Dataset verification & methodology audit badges
    └── pages/
        ├── Dashboard.tsx                      # Primary Heat-Health Command Centre & hotspot ranking
        ├── HeatRiskMap.tsx                    # Full-screen 15-Zone Leaflet Threat Radar
        ├── HyperLocalView.tsx                 # 20-suburb microclimate downscaling & hospital triage
        ├── Biometeorology.tsx                 # Diurnal solar curves, DLNM surge & ISO 7243 matrices
        ├── Forecast.tsx                       # 5-Day Surge Outlook & daily labor moratorium windows
        ├── WardAnalysis.tsx                   # Socioeconomic Vulnerability Matrix & sortable ward table
        ├── Alerts.tsx                         # Active NDMA warnings & automated CAP alert feeds
        ├── ActionCentre.tsx                   # Municipal water tankers, misting hubs & ORS/IV dispatch
        ├── Simulation.tsx                     # What-If Climate Lab, Citizen Directory & WhatsApp hub
        ├── Methodology.tsx                    # Scientific equations & data provenance documentation
        └── Status.tsx                         # Telemetry pipeline & system health overview
```

---

## Getting Started & Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Full-Stack Development Server (Frontend + Express WhatsApp API)
```bash
npm run dev
```
The server starts on `http://localhost:3000`.

### 3. Type-Check & Build for Production
```bash
npm run lint
npm run build
npm start
```

---

## Publishing Safely to GitHub Pages (Static Fail-Safe Mirror)

Hosting a static mirror on **GitHub Pages** alongside [https://heat-guard.ai.studio](https://heat-guard.ai.studio) ensures high availability during demos, hackathons, or emergency surges.

### Automatic Deployment (Recommended)
This repository includes `.github/workflows/deploy-gh-pages.yml`:
1. Push your repository to GitHub (`main` or `master` branch).
2. Go to **Repository → Settings → Pages**.
3. Under **Build and deployment → Source**, select **GitHub Actions**.
4. Every push to `main`/`master` (or manual trigger via **Actions → Deploy HeatGuard AI to GitHub Pages → Run workflow**) will automatically:
   - Detect your repository's exact subpath (`/<repo-name>/` or `/` for custom domains)
   - Run `VITE_BASE_PATH=... npm run build:pages`
   - Generate `dist/404.html` so refreshing any nested route (e.g., `/biometeorology`, `/simulation`, `/hyperlocal`) works without 404 errors
   - Publish securely to `https://<your-username>.github.io/<repo-name>/`

### Manual Static Build Verification
To test the GitHub Pages subpath build locally:
```bash
VITE_BASE_PATH=/heatguard-ai/ npm run build:pages
```

> **Note on Static Hosting:** On GitHub Pages (which serves static files only), all biometeorological physics, Leaflet GIS maps, PDF exports, CSV citizen management, and "What-If" simulations run **100% client-side in the browser**. WhatsApp dispatches automatically use direct `wa.me` links and local audit logs; for server-side zero-click Twilio/Meta batch broadcasting, use the Node/Express deployment (`npm run build && npm start`).

---

## How to Use the Platform

1. **Monitor City-Wide Risk (`/`):** Check live average temperature, relative humidity, Liljegren WBGT, and Red Alert ward counts. Click any ward marker on the map to inspect microclimate metrics, hospital surge projections, or launch **Google Maps turn-by-turn directions**.
2. **Replay Historical Heatwaves (Top Bar):** Toggle between simulated live feeds and historical episodes (e.g., *Chennai May 2024* or *North India June 2024*) to test disaster preparedness.
3. **Inspect Hyper-Local Suburbs (`/hyperlocal`):** Search industrial belts and suburban corridors (Avadi, Ambattur, Ennore, Royapuram, Poonamallee) to view tin-roof heat traps and nearest emergency hospital distances.
4. **Analyze Curves & Export Charts (`/biometeorology`):** Inspect 24-hour diurnal WBGT curves, DLNM hospital surge trajectories, and ISO 7243 work-rest limits; export any chart as a 2x Retina PNG.
5. **Run "What-If" Climate Scenarios & Broadcast Alerts (`/simulation`):** Adjust temperature, humidity, wind, and solar flux sliders to forecast mortality spikes, import citizen CSV rosters, and dispatch targeted **English / Tamil / Hindi** WhatsApp alerts.
6. **Generate Decision Briefs (`Export Brief` Button):** Download a formatted multi-page **A4 PDF Decision Brief**, open an ink-friendly **Print Window**, or copy a pre-formatted **WhatsApp Executive Summary**.
