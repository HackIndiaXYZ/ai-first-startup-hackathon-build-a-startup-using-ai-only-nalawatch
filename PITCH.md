# NalaWatch — pitch narrative

## One-line pitch

NalaWatch is a prototype for helping city teams turn rainfall, drainage, and local exposure signals into earlier, explainable flood-preparedness decisions.

## The problem

Urban flooding can turn heavy rainfall into blocked roads, drain overflow, sanitation risks, and costly disruption. The hackathon problem brief estimates approximately US$4 billion in annual losses in India, potentially rising to US$5 billion by 2030, and cites up to ₹400 crore in losses from a severe day of disruption in a major city. Treat these as estimates from the event brief, not independently verified NalaWatch impact data.

The operational gap is fragmented information: weather forecasts, drainage condition, exposed locations, and response plans may not be available in one decision workflow.

## The proposed product

NalaWatch is designed as a city operations workspace that can:

- combine rainfall forecasts with mapped drainage capacity and flood history;
- identify and explain higher-risk wards or corridors;
- give civic teams a prioritized checklist for inspection, traffic planning, and public communication;
- communicate uncertainty and source freshness so people can judge the quality of an alert.

## What works in this prototype

The web demo includes a deterministic, interactive scenario simulator. Users can vary rainfall, assumed drain load, and estimated blockage to see a transparent heuristic score and suggested planning checks.

It is not a live prediction system: it uses no live weather or sensor feeds, no trained or calibrated hydrology model, and no field-validated performance data. The score is educational and must not be used as an emergency alert.

## Pilot proposal

Start with one consenting municipal partner and a limited set of flood-prone wards. Agree on permitted data and response ownership; combine public weather forecasts, available drainage maps, historical waterlogging reports, and field-verified observations. Run in shadow mode before sending any operational alert.

Evaluate against held-out historical events and field observations. Track lead time, precision/recall by risk threshold, missed events, false alerts, data freshness, and whether responders found the recommendations useful. Do not claim accuracy until this evaluation is complete.

## Business hypothesis

If a pilot demonstrates value, explore annual city subscriptions, implementation and data-integration services, and partnerships with disaster management authorities. Pricing is not validated and is intentionally omitted from this prototype.

## Ask

We seek incubation support and a city/research partner for a supervised pilot, access to permitted historical and drainage data, and domain expertise in urban hydrology and emergency operations.
