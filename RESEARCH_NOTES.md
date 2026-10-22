# NalaWatch research review

Review date: 21 October 2026

## Scope

This is a focused desk review of five papers relevant to urban pluvial flooding, flood prediction methods, and South Asian risk context. Bibliographic details and accessible abstracts were checked against OpenAlex records; DOI links are provided for follow-up. It is not a systematic review, and it does not validate the application's calculations.

## Selected literature

1. Dejene Tesema Bulti and Birhanu Girma Abebe (2020). “A review of flood modeling methods for urban pluvial flood application.” *Modeling Earth Systems and Environment*, 6, 1293–1302. [https://doi.org/10.1007/s40808-020-00803-z](https://doi.org/10.1007/s40808-020-00803-z)
2. Amir Mosavi, Pinar Ozturk, and Kwok-wing Chau (2018). “Flood Prediction Using Machine Learning Models: Literature Review.” *Water*, 10(11), 1536. [https://doi.org/10.3390/w10111536](https://doi.org/10.3390/w10111536)
3. Esteban Sañudo, Luís Cea, and Jerónimo Puertas (2020). “Modelling Pluvial Flooding in Urban Areas Coupling the Models Iber and SWMM.” *Water*, 12(9), 2647. [https://doi.org/10.3390/w12092647](https://doi.org/10.3390/w12092647)
4. Bikram Manandhar et al. (2023). “Urban Flood Hazard Assessment and Management Practices in South Asia: A Review.” *Land*, 12(3), 627. [https://doi.org/10.3390/land12030627](https://doi.org/10.3390/land12030627)
5. Sanat Nalini Sahoo et al. (2015). “Development of Flood Inundation Maps and Quantification of Flood Risk in an Urban Catchment of Brahmaputra River.” *ASCE-ASME Journal of Risk and Uncertainty in Engineering Systems, Part A: Civil Engineering*, 3(1). [https://doi.org/10.1061/ajrua6.0000822](https://doi.org/10.1061/ajrua6.0000822)

## Relevant findings and design implications

- Bulti and Abebe review methods specifically for urban pluvial flood modelling. This establishes that urban flood modelling is a distinct modelling problem; a few sliders and a weighted score should not be described as a substitute for a hydrologic/hydraulic model.
- Mosavi, Ozturk, and Chau survey machine-learning approaches and compare method suitability and evaluation dimensions. Their review supports selecting methods according to the task and evaluating them; it does not provide a transferable model or evidence that this app's heuristic predicts floods.
- Sañudo, Cea, and Puertas describe a coupled 1D sewer-network and 2D overland-flow approach, with validation and study cases. The important product lesson is that interactions between drainage networks and surface flow matter, and a credible model needs real geometry, rainfall, boundary conditions, and validation. NalaWatch does not implement Iber or SWMM and does not reproduce this method.
- The South Asia review and the Brahmaputra urban-catchment study provide regionally relevant context for hazard assessment. A result from one catchment cannot simply be transferred to another Indian city; local topography, drainage data, rainfall, exposure, and event records are necessary.
- A useful civic decision-support product should expose its data provenance, assumptions, time horizon, uncertainty, and intended human workflow. This prototype therefore labels all neighbourhoods and inputs synthetic, shows the toy calculation, and uses sensitivity perturbations only as a what-if check.

## What this changed in the prototype

The literature informed the **questions and limits** represented by the demo: rainfall over time, drainage constraints, relative neighbourhood attributes, scenario comparison, sensitivity to assumptions, and a need for field verification. The implemented six-hour bucket model, ward attributes, coefficients, risk thresholds, and ±20% perturbations are original illustrative choices for interaction design. They are **not sourced from, calibrated against, or validated by any of the papers above**.

The app optionally retrieves hourly precipitation context from Open-Meteo after the user requests it. It does not contain city GIS layers, a sewer network, IoT telemetry, a machine-learning model, calibrated hydrology, an uncertainty distribution, operational alerting, or evidence of flood-forecast skill. Never use its output for emergency decisions.

## Responsible next research and pilot steps

1. Select a consenting city/ward partner and document the operational question and decision owner.
2. Obtain permissioned, versioned rainfall, elevation, imperviousness, drainage topology/capacity, blockage/maintenance, and observed inundation data. Record spatial and temporal resolution, missingness, provenance, and reuse terms.
3. Select a fit-for-purpose baseline with hydrology and drainage experts (for example, a validated 1D/2D workflow); do not choose an ML model before establishing usable training labels and baselines.
4. Split evaluation by event and time to avoid leakage. Report lead time, hit rate, false alarms, missed events, calibration/uncertainty, and performance across locations—not only aggregate accuracy.
5. Run a shadow evaluation with human review before any warning workflow. Define escalation, accessibility, language, outage, and safety procedures before operational use.

## Proposed Mumbai pilot and source boundary

Mumbai is the current *proposed pilot focus* because it is available as a city preset for the demo's public rainfall-context request. This is a product scoping decision—not a conclusion that a particular ward has the highest risk, that the city has agreed to partner, or that local flood/drainage data are accessible. The initial pilot ward must be chosen with a consenting civic and hydrology partner.

| Evidence | Current status in the prototype | Next responsible step |
|---|---|---|
| Open-Meteo hourly precipitation for the Mumbai city coordinate | Connected only after the user requests it; weather context, not a NalaWatch flood prediction | Keep provider, retrieval time, license/terms, and the rainfall-versus-flood distinction visible |
| Municipal Corporation of Greater Mumbai flood-control information ([MCGM reference](https://www.mcgm.gov.in/irj/portal/anonymous/qlCivicFloodControl)) | Linked for a human to consult; no content ingestion, API, or permission is claimed | Verify availability and terms with MCGM; request an authorized source and data steward |
| India Meteorological Department ([IMD](https://mausam.imd.gov.in/)) official observations/advisories | Official reference for human cross-checks; not connected to the app | Agree which official product and issue-time should be used in any future workflow |
| Ward boundaries, storm-water network/capacity, gauges, maintenance/blockage observations, and dated waterlogging reports | Not present; demo wards and their attributes are fictional | Select the pilot area with the partner; document provenance, access permission, coverage, missingness, cadence, and retention |
| Flood model and warning performance | Not implemented or evaluated | Establish a rainfall-only baseline, then evaluate any model on held-out events and locations in shadow mode; agree success criteria before testing |

The current source behavior is intentionally small: forecast retrieval is explicit user action; only city coordinates are sent to Open-Meteo; no municipal records are fetched. The civic and IMD links support people checking official sources and do not mean NalaWatch ingests or republishes those sources. Their accessibility, service terms, and applicable data permissions must be checked by the pilot partner before use.

Suggested pilot evaluation includes lead time, probability of detection, false-alarm ratio, missed-event analysis, calibration where a probabilistic model is eventually justified, data freshness/completeness, and partner review of the human workflow. Stratify by held-out event and location to avoid overstatement from a random record-level split. Report no performance claims until the protocol, ground truth, and results are reproducible.

## Research metadata sources

- OpenAlex records used to check article titles, years, author lists, venues, and DOI: [Bulti & Abebe](https://api.openalex.org/works/https://doi.org/10.1007/s40808-020-00803-z), [Mosavi et al.](https://api.openalex.org/works/https://doi.org/10.3390/w10111536), [Sañudo et al.](https://api.openalex.org/works/https://doi.org/10.3390/w12092647), [Manandhar et al.](https://api.openalex.org/works/https://doi.org/10.3390/land12030627), and [Sahoo et al.](https://api.openalex.org/works/https://doi.org/10.1061/ajrua6.0000822).
- Abstract checked for the ML review via its OpenAlex record and the urban drainage/surface-flow coupling paper via its OpenAlex record. For papers where full text was unavailable in this review, statements are restricted to bibliographic scope and the claims stated in accessible metadata; this note is not a substitute for reading full texts before a model design or performance claim.
- The optional weather panel uses the [Open-Meteo Forecast API](https://open-meteo.com/en/docs), not the cited flood-modelling studies. Its outputs are precipitation context only. Check the provider's current [terms](https://open-meteo.com/en/terms) and [license](https://open-meteo.com/en/licence): the free API is limited to non-commercial use and requires CC BY 4.0 attribution; a commercial product needs an appropriate plan.
