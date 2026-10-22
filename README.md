# NalaWatch

NalaWatch is a prototype concept for urban flood-risk decision support. Its interactive scenario sandbox helps teams discuss rainfall, drainage constraints, and relative exposure assumptions.

## Prototype scope and limitations

The browser demo contains an interactive scenario simulator with synthetic neighbourhood data. It exposes a simple six-hour bucket-model calculation, drainage constraints, sensitivity perturbations, and an optional side-by-side comparison against a saved scenario baseline. Users may explicitly request an hourly precipitation forecast for one of five Indian cities from Open-Meteo; the weather forecast is separate context and may optionally supply a rainfall profile to the demo calculation. All ward attributes, drainage values, equations, thresholds, and scenario indices are illustrative; none are calibrated from research papers, historical events, or a real city. This is not a validated flood forecast. There is no municipal sensor integration, calibrated hydrology model, or operational alerting. Do not use it for emergency decisions.

The comparison baseline is held only in the current browser session and is not uploaded or persisted. It compares illustrative scenario-index values, not observed flood probabilities or safety outcomes.

The research desk review and its limitations are documented in [RESEARCH_NOTES.md](./RESEARCH_NOTES.md). Research shaped the questions and transparency requirements represented by the demo, not its formula or parameter values. The next validation step is a consented pilot with a city partner, documented data sources, historical event data, and field-verified sensor readings. Model performance claims should only be added after a reproducible evaluation.

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

## Optional weather context

The simulator contacts the Open-Meteo Forecast API only after a user selects **Load forecast**. It requests hourly precipitation for the selected preset city, displays the provider and retrieval time, and can copy the next-three-hour rainfall and next-six-hour profile into the synthetic scenario. The profile is scaled if the scenario rainfall slider is subsequently changed. This does not turn the result into a flood prediction: all drainage and neighbourhood parameters remain synthetic.

The city coordinates are sent to Open-Meteo; no name, email, or other personal data is sent by this weather request. The free API is for non-commercial use, requires CC BY attribution, and its terms disclaim accuracy and availability guarantees. See [Open-Meteo documentation](https://open-meteo.com/en/docs), [terms](https://open-meteo.com/en/terms), and [license](https://open-meteo.com/en/licence). Obtain an appropriate paid plan before using the provider commercially.

## GitHub Pages deployment

Pushes to `main` build the static app and publish through GitHub Pages Actions once a repository admin has enabled Pages and selected GitHub Actions as the source. Until then, the Pages step is explicitly skipped. The workflow uses the repository subpath when building for Pages. After the `github-pages` environment deployment succeeds, the app URL is:

https://hackindiaxyz.github.io/ai-first-startup-hackathon-build-a-startup-using-ai-only-nalawatch/

The repository owner must enable Pages in repository settings and permit GitHub Actions as its source. Confirm the deployment job succeeded before sharing the URL.

## Hackathon submission materials

- `PITCH.md` — product story and staged pilot proposal
- `AI_USAGE.md` — AI-assisted workflow and representative prompt log
- `DEMO_SCRIPT.md` — timed 3–5 minute demo/video outline
- `SUBMISSION_CHECKLIST.md` — deliverables and remaining external steps
- `RESEARCH_NOTES.md` — selected literature, sourced implications, and model limitations
- `pitch-deck/NalaWatch-investor-deck.pdf` — concise pitch deck

## Data and safety

The prototype does not store weather requests; city coordinates are transmitted to the selected weather provider only after the user requests a forecast. Do not enter sensitive information in the contact form. The simulator is for demonstration only; official weather warnings and qualified local response teams take precedence.
