# NalaWatch demo video script (3–5 minutes)

Target runtime: about 3 minutes 45 seconds. Record the deployed app after deployment succeeds; do not imply the current prototype has live city sensors or validated flood forecasts.

## 0:00–0:25 — Introduce the problem

“Urban rain events can put pressure on drains, roads, and essential services. Civic teams need usable local evidence—not another unverified risk score. NalaWatch is a prototype exploring how weather context and documented local observations could support a human-led preparedness workflow.”

## 0:25–0:55 — Explain the approach

“We propose Mumbai as our first pilot city to investigate, but we do not have a city partner or city drainage feed yet. Our current demo connects only to an optional public hourly rainfall forecast. Every ward and flood-risk index on screen is synthetic.”

## 0:55–2:15 — Demonstrate the working prototype

1. Open the app. Point out “Mumbai pilot candidate” and that a partner has not been confirmed.
2. In the Mumbai pilot lens, load the hourly rainfall forecast. Show its Open-Meteo source, retrieval time, and three-hour total. Explain that this is city-level weather context only.
3. Select **Use rainfall in scenario**. Show how this changes the input profile—not a real flood prediction.
4. On the neighbourhood board, sort by scenario index and select a synthetic neighbourhood. Point out the fictional-data disclosure and explain that the number is not a probability.
5. Save a comparison baseline, apply **Intense cloudburst**, and inspect the change table. Explain that both scenarios use fictional drainage and exposure assumptions.
6. Show the pilot readiness cards: rainfall context is available; ward/drain records require permission and a partner; independent shadow-mode event validation is still required.

## 2:15–3:05 — Explain validation and safety

“Our next step is not to announce a prediction. It is to find a Mumbai civic and hydrology partner, agree on one pilot ward and permitted data, and test a baseline in shadow mode against held-out rainfall events. We will report lead time, missed events, false alarms, and data completeness before anyone considers operational use.”

## 3:05–3:40 — Close with the ask

“We are seeking incubation support, an introduction to a Mumbai civic or research partner, help choosing a narrow pilot question, and urban-hydrology expertise. NalaWatch will earn trust through evidence and human oversight—not claims the prototype cannot support.”

## Recording checklist

- Capture the final deployed URL and make sure it loads in a fresh browser session.
- Show the working slider interaction and risk-level change on screen.
- Keep the demo within 3–5 minutes; add captions and readable zoom.
- Do not show private keys, personal data, or unapproved city data.
- Do not claim the simulator is live, AI-predicted, or validated.
- Credit Open-Meteo when showing its weather forecast, and do not imply the provider's precipitation output is a NalaWatch flood warning.
