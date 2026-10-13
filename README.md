# NalaWatch

NalaWatch is an AI-powered urban flood intelligence platform that predicts waterlogging, drain overflow, and flood hotspots before they become public safety emergencies.

## Overview

This project is a React + Vite landing page for NalaWatch, designed for a hackathon submission and startup pitch. It showcases the product story, workflow, pricing, accessibility, and a responsive startup demo dashboard for municipal and disaster-response use cases.

## Run locally

```bash
npm install
npm run dev -- --host 0.0.0.0
```

Then open http://localhost:5173.

## Build for production

```bash
npm run build
```

## Deploy on Netlify

1. Push this repository to GitHub.
2. In Netlify, import the repo and set the build command to `npm run build` and publish directory to `dist`.
3. Add `NETLIFY_AUTH_TOKEN` and `NETLIFY_SITE_ID` as GitHub secrets if using the included GitHub Actions workflow.

## Supporting files

- `PITCH.md` — startup narrative and investor positioning
- `AI_USAGE.md` — AI workflow summary for the hackathon judge brief
- `pitch-deck/NalaWatch-investor-deck.pdf` — investor-facing deck summary
