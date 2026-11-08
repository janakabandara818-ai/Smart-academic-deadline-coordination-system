# Sprint 1 frontend

This React/Vite prototype uses three sample modules and five seeded deadlines.
It does not connect to live Moodle or the backend API. The demo role selector
changes the local presentation; it is not authentication. State resets on refresh.

## Install and run

Use Bun and Node.js (verified with Bun 1.4.4 and Node 24.22.0). From the repository root:

```bash
cd frontend
bun install
bun run dev -- --host 127.0.0.1 --port 5173 --strictPort
```

Open `http://127.0.0.1:5173`. Stop the server with Ctrl+C. No credentials or
environment file are needed. `--strictPort` reports an occupied port instead of
silently selecting a different one.

## Deadline viewer

From the dashboard, choose **View all**, or **Unified calendar** in navigation.
Both open `/calendar`, the Sprint 1 assignment deadline viewer. It shows all
five deadlines by default; choose a module to filter and **All modules** to reset.
Each record keeps its module, assignment title, local due date and time. Select a
record to open the named details dialog; Escape or Done closes it. A visible
sample-data label identifies the source in every filter state. Empty results
explain whether the dataset is empty or the selected module has no deadlines.

Data comes from `src/data/mockData.js`. Dates use the fixed November 2026 demo
semester rather than the device's current date. The deadline planner is a local
proposal form. Analysis, suggestions, Moodle sync, notifications, administration,
settings and Student/Admin dashboards remain Coming Soon.

## Build and tests

Run these commands from `frontend/`:

```bash
bun run build
bun run lint
bun run test
bun test tests/workload.test.js
bun run test:ui
```

`build` creates `dist/`; `lint` runs oxlint; the two unit commands run the same
workload tests using Node and Bun respectively. Browser tests exercise the real
viewer, repeated filters, dates, empty datasets, accessible details and responsive
layout. Empty-data browser tests substitute the fixture module only inside their
own browser page; production sample data is unchanged.

Playwright uses installed Google Chrome (`channel: "chrome"`) and starts Vite on
`127.0.0.1:5173`. Ensure this port is free so tests exercise this checkout. If Chrome
is missing, install it using the project CLI:

```bash
bun x --bun playwright install chrome
```

Preview a production build locally with:

```bash
bun run preview -- --host 127.0.0.1 --port 4173 --strictPort
```

See [the frontend QA report](../qa/SADC-57/frontend/REPORT.md) for recorded
results, source hashes, screenshots and remaining limitations.
