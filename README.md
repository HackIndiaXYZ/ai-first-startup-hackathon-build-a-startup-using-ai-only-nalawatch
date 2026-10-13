# NalaWatch

NalaWatch is a prototype concept for urban flood-risk decision support. It brings rainfall, drainage, and local exposure into a planning workflow for civic and emergency-response teams.

## Prototype scope and limitations

The browser demo contains an interactive, rules-based scenario simulator. Its rainfall, drain-load, and blockage values are entered by the user; the score is illustrative and is not a validated flood forecast. It has no live weather feed, municipal sensor integration, calibrated hydrology model, or operational alerting. Do not use it for emergency decisions.

The next validation step is a consented pilot with a city partner, documented data sources, historical event data, and field-verified sensor readings. Model performance claims should only be added after a reproducible evaluation.

## Run locally

Requirements: Node.js 20 or newer and npm.

```bash
npm ci
npm run dev
```

Open the local URL printed by Vite (normally http://localhost:5173).

## Validate and build

```bash
npm run lint
npm run test
npm run build
npm run preview
```

## Optional Docker deployment

Docker is optional; the app does not require Linux, containers, or ROS. The included container serves the static production build with Nginx:

```bash
docker build -t nalawatch .
docker run --rm -p 8080:8080 nalawatch
```

Open http://localhost:8080.

## Netlify deployment

Import the GitHub repository in Netlify with build command `npm run build` and publish directory `dist`. For deployment through GitHub Actions, configure `NETLIFY_AUTH_TOKEN` and `NETLIFY_SITE_ID` repository secrets. A successful CI build alone does not mean the app is publicly deployed.

## GitHub Pages deployment

Pushes to `main` also build and publish the static app through GitHub Pages Actions. The workflow uses the repository subpath when building for Pages. After the `github-pages` environment deployment succeeds, the app URL is:

https://hackindiaxyz.github.io/ai-first-startup-hackathon-build-a-startup-using-ai-only-nalawatch/

The repository owner may need to permit GitHub Actions as the Pages source in repository settings. Confirm the deployment job succeeded before sharing the URL.

## Hackathon submission materials

- `PITCH.md` — product story and staged pilot proposal
- `AI_USAGE.md` — AI-assisted workflow and representative prompt log
- `DEMO_SCRIPT.md` — timed 3–5 minute demo/video outline
- `SUBMISSION_CHECKLIST.md` — deliverables and remaining external steps
- `pitch-deck/NalaWatch-investor-deck.pdf` — concise pitch deck

## Data and safety

The prototype avoids collecting personal data. Do not enter sensitive information in the contact form. The simulator is for demonstration only; official weather warnings and qualified local response teams take precedence.
