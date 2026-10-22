# NalaWatch

NalaWatch is a prototype concept for urban flood-risk decision support. Its interactive scenario sandbox helps teams discuss rainfall, drainage constraints, and relative exposure assumptions.

## Prototype scope and limitations

The browser demo contains an interactive scenario simulator with synthetic neighbourhood data. It exposes a simple six-hour bucket-model calculation, drainage constraints, sensitivity perturbations, a neighbourhood board that can be sorted by scenario index, and an optional side-by-side comparison against a saved scenario baseline. Users may explicitly request an hourly precipitation forecast for one of five Indian cities from Open-Meteo; the weather forecast is separate context and may optionally supply a rainfall profile to the demo calculation. All ward attributes, drainage values, equations, thresholds, and scenario indices are illustrative; none are calibrated from research papers, historical events, or a real city. This is not a validated flood forecast. There is no municipal sensor integration, calibrated hydrology model, or operational alerting. Do not use it for emergency decisions.

The comparison baseline is held only in the current browser session and is not uploaded or persisted. It compares illustrative scenario-index values, not observed flood probabilities or safety outcomes.

The research desk review and its limitations are documented in [RESEARCH_NOTES.md](./RESEARCH_NOTES.md). Research shaped the questions and transparency requirements represented by the demo, not its formula or parameter values. The next validation step is a consented pilot with a city partner, documented data sources, historical event data, and field-verified sensor readings. Model performance claims should only be added after a reproducible evaluation.

## Run locally

Requirements: Node.js 20 or newer and npm.

```bash
npm ci
npm run dev
```

Open the local URL printed by Vite (normally http://localhost:5173).

## Authentication and private scenario saves

Sign-in supports Google and email/password through Firebase Authentication. Signed-in users can save, load, and delete their scenario inputs in a Firestore path scoped to their Firebase user ID. Weather forecasts, comparison baselines, and simulator history are not saved with these records. Anonymous visitors can still use the simulator without signing in.

Real sign-in requires a Firebase project; without one, the app displays setup instructions and does not pretend sign-in succeeded.

1. Create a Firebase project and register a **Web app**. Copy its web app configuration into a local `.env.local` file using [.env.example](./.env.example) as the template. These `VITE_` values are included in the browser bundle; use only the Firebase web app config, never a service-account key or other private credential.
2. In Firebase Console → **Authentication** → **Sign-in method**, enable **Google** and **Email/Password**. Add the local development hostname and each deployed hostname to Authentication → **Settings** → **Authorized domains**.
3. Create a **Cloud Firestore** database. Open the Firestore **Rules** tab and publish the rules in [firestore.rules](./firestore.rules). The rules only allow each authenticated user to read, create, and delete scenario documents under their own UID; other documents and updates are denied.
4. Restart the local Vite server after editing `.env.local`, then test Google and email sign-in and verify separate accounts cannot see each other's saved scenarios.
5. For GitHub Pages builds, add the four `VITE_FIREBASE_*` values as repository **Actions variables** (not service-account secrets) in Settings → Secrets and variables → Actions. For Netlify, add the same public web config as site environment variables. Rebuild/redeploy after setting these values.

Firebase web config is public by design; privacy depends on Authentication and Firestore Security Rules. Review Firebase's current [Google sign-in setup](https://firebase.google.com/docs/auth/web/google-signin) and [Firestore security rules](https://firebase.google.com/docs/firestore/security/rules-conditions), and configure Firebase's data retention and account policies before inviting real users.

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

The container can be built with Firebase web app settings using the Docker build arguments declared in [Dockerfile](./Dockerfile). These values are public client configuration and are compiled into the static app; never pass service-account keys or other private credentials.

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

The prototype does not store weather requests; city coordinates are transmitted to the selected weather provider only after the user requests a forecast. If authentication is configured, Firebase receives account information and only explicitly saved scenario inputs; scenario saves are private by user ID according to the included Firestore rules. Do not store sensitive information or operational response data in the app or enter it in the contact form. The simulator is for demonstration only; official weather warnings and qualified local response teams take precedence.
