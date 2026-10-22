# Hackathon submission checklist

## Rules checked

The published event page calls for an original AI-first product, at least 80% AI-driven product execution, documentation of AI use, and these submission items: public GitHub repository, live deployed application, 3–5 minute demo video, pitch deck, and AI usage report. It lists teams of 1–6 members. No technology restriction banning Linux, Docker, containers, or ROS appears on that page.

Official page: https://hackindia.org/2026/ai-first-startup-hackathon-build-a-startup-using-ai-only

## Prepared in this repository

- [x] Public-repository code and project docs
- [x] Interactive browser scenario simulator with synthetic neighbourhoods, transparent assumptions, sensitivity checks, baseline comparison, and limitations
- [x] Firebase Google/email sign-in integration, account sign-out, private scenario save/load/delete flows, and owner-scoped Firestore rules
- [x] Optional hourly precipitation forecast context with provider attribution, explicit user-triggered fetch, and clear separation from synthetic flood outputs
- [x] Focused literature review with verified article metadata and an explicit distinction between research design implications and toy-model parameters
- [x] Automated lint, unit tests, and production build
- [x] Pitch narrative and PDF deck
- [x] AI usage report with representative prompt themes
- [x] Timed 3–5 minute demo-video script
- [x] Optional Docker packaging

## Still needs team action

- [ ] Confirm all members have registered and team size is within 1–6.
- [ ] Audit AI usage logs and truthfully verify the 80%+ AI execution requirement; add other actual tools/models/prompts used.
- [ ] Ask a repository admin to enable GitHub Pages with GitHub Actions as the source (or configure Netlify deployment credentials/use another host), deploy, then verify the public URL in a fresh browser session.
- [ ] Create/configure the Firebase project, enable Google and Email/Password sign-in, create Firestore, publish `firestore.rules`, set the `VITE_FIREBASE_*` deployment variables, add authorized domains, and test data isolation with separate accounts.
- [ ] Record and upload the 3–5 minute demo video; submit its URL.
- [ ] Upload the public GitHub repository URL, live app URL, video URL, pitch deck, and AI usage report through the official team submission flow.
- [ ] Check code-freeze time and submission deadlines on the team page; submit before freeze.
- [ ] Replace any claims or event estimates that cannot be sourced and verified by the team.

## Technology choices

Linux is already used by the GitHub Actions build runner. Docker/Nginx is optional packaging for reproducibility. ROS is not relevant to this web prototype; consider it only if a future project integrates robot or sensor hardware and the team has a real deployment need. No additional framework or tool is required by the published rules.

## Safety boundary

The current scenario tool is a deterministic toy bucket model with synthetic, user-adjustable inputs. The optional third-party weather forecast supplies rainfall context only; it is not a NalaWatch flood forecast. This is not a research-implemented model, official warning, or substitute for local authorities. A real deployment needs permitted and documented data, hydrology expertise, validated evaluation, human review, and a defined incident-response owner.
