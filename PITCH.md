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

The web demo includes an optional Open-Meteo hourly precipitation context for five city presets, connected to a deterministic synthetic scenario simulator. Users can compare the retrieved rainfall profile with assumed drainage availability, blockage, and ground saturation across six fictional neighbourhoods, then inspect hourly ponding proxies, sensitivity perturbations, and discussion prompts.

It is not a live flood-prediction system: the weather provider supplies precipitation context, but the demo has no city sensor data, sewer network, trained or calibrated hydrology model, or field-validated performance data. The formula, parameters, fictional ward attributes, and sensitivity range are illustrative, not derived from the research reviewed in [RESEARCH_NOTES.md](./RESEARCH_NOTES.md). Outputs are educational and must not be used as emergency alerts.

## Pilot proposal

### Proposed first city: Mumbai

Mumbai is a **proposed pilot focus**, not a confirmed partnership, data agreement, selected ward, or operational deployment. The prototype defaults to Mumbai because its city-level rainfall forecast is already available as an explicitly requested input. That is the only live Mumbai-specific data in the demo; neighbourhood names, attributes, drainage, exposure, scores, and ponding outputs are fictional.

The [MCGM flood-control information page](https://www.mcgm.gov.in/irj/portal/anonymous/qlCivicFloodControl) and [India Meteorological Department](https://mausam.imd.gov.in/) are links for human reference and official-warning cross-checks—not data feeds connected to NalaWatch. The MCGM page’s availability and any data-access conditions must be confirmed with the city before a pilot; this proposal does not assume an open API or permission.

First ask a municipal and hydrology partner to select one suitable ward and define the question, decision owner, and safe shadow-mode process. Request permissioned, timestamped rainfall-gauge observations; waterlogging/complaint reports with location and event times; storm-water drain maps, capacity and maintenance records; and field-verified observations. Document provenance, spatial coverage, missingness, update cadence, privacy, and reuse terms before ingesting anything.

Build a simple, transparent rainfall-only baseline first; compare any proposed hydrologic or ML extension only after partner data and a defensible evaluation split are available. Evaluate on held-out rain events and locations, with hydrology review and human shadow review. Report lead time, probability of detection, false-alarm ratio, missed events, data freshness/completeness, and performance across wards. Agree on acceptance criteria with the partner before testing; do not present a score or alert to the public until local validation, uncertainty, escalation ownership, and incident procedures are approved.

Have participating responders review the shadow-mode outputs and the proposed escalation workflow; record when data are missing or stale instead of silently substituting values. Do not claim accuracy, alert capability, or operational readiness until the partner-reviewed evaluation and safety process are complete.

## Business hypothesis

If a pilot demonstrates value, explore annual city subscriptions, implementation and data-integration services, and partnerships with disaster management authorities. Pricing is not validated and is intentionally omitted from this prototype.

## Ask

We seek incubation support, an introduction to a Mumbai civic or research partner, help choosing a narrow pilot question and ward, and domain expertise in urban hydrology and emergency operations. We are not asking a city to rely on this prototype as a warning system.
