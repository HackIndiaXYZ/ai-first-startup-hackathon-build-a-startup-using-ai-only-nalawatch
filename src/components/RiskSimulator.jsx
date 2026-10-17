import { useMemo, useState } from 'react';
import {
  DEFAULT_SCENARIO,
  SCENARIO_PRESETS,
  simulateCityScenario,
} from './floodRisk.js';

const controls = [
  {
    id: 'rainfallMm',
    label: 'Rainfall total · next 3 hours',
    hint: 'Synthetic storm total, distributed across three hourly steps.',
    min: 0,
    max: 240,
    unit: ' mm',
  },
  {
    id: 'drainAvailability',
    label: 'Drain capacity available',
    hint: 'Share of each synthetic ward’s assumed drainage capacity.',
    min: 0,
    max: 100,
    unit: '%',
  },
  {
    id: 'blockage',
    label: 'Estimated blockage',
    hint: 'Scenario assumption that reduces drainage throughput.',
    min: 0,
    max: 100,
    unit: '%',
  },
  {
    id: 'saturation',
    label: 'Ground saturation',
    hint: 'Higher saturation means less rainfall is absorbed in this toy model.',
    min: 0,
    max: 100,
    unit: '%',
  },
];

function ScenarioInput({ control, value, onChange }) {
  return (
    <div className="scenario-input">
      <div className="scenario-label-row">
        <label htmlFor={control.id}>{control.label}</label>
        <output htmlFor={control.id}>
          {value}
          {control.unit}
        </output>
      </div>
      <input
        id={control.id}
        type="range"
        min={control.min}
        max={control.max}
        value={value}
        onChange={(event) => onChange(control.id, Number(event.target.value))}
      />
      <small>{control.hint}</small>
    </div>
  );
}

function getPlanningChecks(level) {
  if (level === 'Severe' || level === 'High') {
    return [
      'Use this synthetic result to discuss which low-lying sites need field verification.',
      'Check official weather information and local drainage reports before planning.',
      'Do not issue public alerts from this demonstration.',
    ];
  }

  if (level === 'Moderate') {
    return [
      'Compare the scenario with known waterlogging locations.',
      'Review inspection and drain-maintenance plans with local teams.',
    ];
  }

  return [
    'Use the scenario to explore assumptions, not to infer that flooding cannot occur.',
    'Confirm local conditions through official sources and field teams.',
  ];
}

function downloadScenario(scenario, result, selectedWard) {
  const report = {
    product: 'NalaWatch research-informed scenario sandbox',
    createdAt: new Date().toISOString(),
    disclosure: result.modelDisclosure,
    assumptions: {
      stormProfile: '20%, 50%, and 30% of entered rainfall total over hours 1–3; no rain in hours 4–6.',
      formula:
        'Ponding proxy = prior ponding + rainfall × imperviousness × ground factor × low-point factor − assumed drain throughput.',
      sensitivity:
        'Range varies rainfall by ±20% and drainage capacity by ∓20%; it is not a calibrated uncertainty interval.',
      data: 'All ward attributes and inputs are synthetic; no live maps, sensors, forecasts, or resident data are used.',
    },
    scenario,
    selectedWard,
    wardResults: result.wards.map((ward) => ({
      id: ward.id,
      name: ward.name,
      score: ward.score,
      level: ward.level,
      peakPondingMm: ward.peakPondingMm,
      peakHour: ward.peakHour,
      sensitivity: ward.sensitivity,
      hourly: ward.hourly,
    })),
    rainfallTimeline: result.rainfallTimeline,
  };
  const objectUrl = URL.createObjectURL(new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' }));
  const link = document.createElement('a');
  link.href = objectUrl;
  link.download = 'nalawatch-synthetic-scenario.json';
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(objectUrl);
}

function RiskSimulator() {
  const [scenario, setScenario] = useState(DEFAULT_SCENARIO);
  const result = useMemo(() => simulateCityScenario(scenario), [scenario]);
  const [selectedWardId, setSelectedWardId] = useState(result.highestPriorityWard.id);
  const selectedWard =
    result.wards.find((ward) => ward.id === selectedWardId) ?? result.highestPriorityWard;

  function updateScenario(key, value) {
    setScenario((current) => ({ ...current, [key]: value }));
  }

  function applyPreset(name) {
    setScenario(SCENARIO_PRESETS[name]);
    setSelectedWardId('W-02');
  }

  const maxRainfall = Math.max(1, ...result.rainfallTimeline.map((point) => point.rainfallMm));
  const maxPonding = Math.max(1, ...selectedWard.hourly.map((point) => point.pondingMm));

  return (
    <section className="risk-simulator" aria-labelledby="simulator-title">
      <div className="simulator-intro">
        <div>
          <span className="eyebrow">Interactive scenario · synthetic ward data</span>
          <h3 id="simulator-title">Explore how rainfall and drainage assumptions interact</h3>
          <p>
            A six-hour, transparent bucket-model sandbox lets you compare synthetic neighbourhoods, storm
            timing, drainage constraints, and exposure assumptions.
          </p>
        </div>
        <span className="data-badge">Simulation only · not a forecast or alert</span>
      </div>

      <div className="scenario-toolbar">
        <div className="scenario-presets" role="group" aria-label="Load a demonstration scenario">
          {Object.keys(SCENARIO_PRESETS).map((name) => (
            <button className="preset-button" key={name} type="button" onClick={() => applyPreset(name)}>
              {name}
            </button>
          ))}
        </div>
        <button
          className="export-button"
          type="button"
          onClick={() => downloadScenario(scenario, result, selectedWard)}
        >
          Download scenario data
        </button>
      </div>

      <div className="simulation-summary" aria-label="Scenario summary">
        <div className="summary-card">
          <span>Rainfall scenario</span>
          <strong>{scenario.rainfallMm} mm</strong>
          <small>total over 3 hours · assumed</small>
        </div>
        <div className="summary-card">
          <span>Priority zones</span>
          <strong>{result.priorityWards} / {result.wards.length}</strong>
          <small>score at or above 45 / 100</small>
        </div>
        <div className="summary-card">
          <span>Highest scenario index</span>
          <strong>{result.highestPriorityWard.score}<small> / 100</small></strong>
          <small>{result.highestPriorityWard.name} · synthetic ward</small>
        </div>
      </div>

      <div className="simulator-layout">
        <div className="scenario-controls" aria-label="Flood scenario assumptions">
          {controls.map((control) => (
            <ScenarioInput
              key={control.id}
              control={control}
              value={scenario[control.id]}
              onChange={updateScenario}
            />
          ))}
        </div>

        <section className="ward-board" aria-labelledby="ward-board-title">
          <div className="panel-heading">
            <div>
              <span className="result-label">Schematic · not a geographic map</span>
              <h4 id="ward-board-title">Neighbourhood scenario board</h4>
            </div>
            <span className="map-legend"><i aria-hidden="true" /> Higher index</span>
          </div>
          <div className="ward-grid" role="group" aria-label="Select a synthetic neighbourhood">
            {result.wards.map((ward) => (
              <button
                type="button"
                key={ward.id}
                className={`ward-tile risk-${ward.level.toLowerCase()} ${ward.id === selectedWard.id ? 'selected' : ''}`}
                onClick={() => setSelectedWardId(ward.id)}
                aria-pressed={ward.id === selectedWard.id}
                aria-label={`${ward.name}, scenario index ${ward.score} out of 100, ${ward.level}`}
              >
                <span className="ward-id">{ward.id}</span>
                <strong>{ward.name}</strong>
                <span className="ward-score">{ward.score}<small> / 100</small></span>
                <span className="ward-level">{ward.level} scenario</span>
              </button>
            ))}
          </div>
          <p className="map-caption">
            Synthetic ward attributes represent relative low points, surface cover, drainage throughput, and exposure.
            They do not correspond to a real city or administrative boundary.
          </p>
        </section>
      </div>

      <section className={`ward-detail risk-${selectedWard.level.toLowerCase()}`} aria-labelledby="ward-detail-title">
        <div className="ward-detail-heading">
          <div>
            <span className="result-label">Selected synthetic neighbourhood</span>
            <h4 id="ward-detail-title">{selectedWard.name} <span>({selectedWard.id})</span></h4>
          </div>
          <div className="ward-detail-score">
            <strong>{selectedWard.score}</strong><span>/100 · {selectedWard.level}</span>
          </div>
        </div>

        <div className="chart-grid">
          <div className="scenario-chart">
            <h5>Assumed rainfall profile</h5>
            <div
              className="chart-bars rain-bars"
              role="img"
              aria-label={`Assumed hourly rainfall: ${result.rainfallTimeline.map((point) => `hour ${point.hour}, ${point.rainfallMm} millimetres`).join('; ')}`}
            >
              {result.rainfallTimeline.map((point) => (
                <div className="chart-column" key={point.hour}>
                  <span className="chart-value">{point.rainfallMm}</span>
                  <span className="chart-bar" style={{ height: `${Math.max(3, (point.rainfallMm / maxRainfall) * 100)}%` }} />
                  <span className="chart-axis">H{point.hour}</span>
                </div>
              ))}
            </div>
            <p>Rainfall total is allocated across the first three hours; the remaining hours are a drainage recovery scenario.</p>
          </div>

          <div className="scenario-chart">
            <h5>Simulated ponding proxy</h5>
            <div
              className="chart-bars ponding-bars"
              role="img"
              aria-label={`Synthetic ponding depth in millimetres: ${selectedWard.hourly.map((point) => `hour ${point.hour}, ${point.pondingMm}`).join('; ')}`}
            >
              {selectedWard.hourly.map((point) => (
                <div className="chart-column" key={point.hour}>
                  <span className="chart-value">{point.pondingMm}</span>
                  <span className="chart-bar" style={{ height: `${Math.max(3, (point.pondingMm / maxPonding) * 100)}%` }} />
                  <span className="chart-axis">H{point.hour}</span>
                </div>
              ))}
            </div>
            <p>Peak {selectedWard.peakPondingMm} mm at hour {selectedWard.peakHour}; a simplified scenario output, not a measured depth.</p>
          </div>
        </div>

        <div className="sensitivity-callout">
          <strong>Sensitivity check: {selectedWard.sensitivity.low}–{selectedWard.sensitivity.high} / 100</strong>
          <span>Varies rain and drainage assumptions by ±20%. This is not a probability or confidence interval.</span>
        </div>

        <div className="planning-checks">
          <h5>Planning discussion prompts · not automated instructions</h5>
          <ul>
            {getPlanningChecks(selectedWard.level).map((check) => <li key={check}>{check}</li>)}
          </ul>
        </div>
      </section>

      <details className="model-method">
        <summary>How this demonstration model works</summary>
        <p>
          For each synthetic ward and hourly step, the model adds assumed rainfall runoff—adjusted by assumed
          surface cover, ground saturation, and a low-point factor—then subtracts an assumed drainage throughput
          reduced by blockage. The bounded ponding proxy is combined with an exposure weight to create a 0–100
          scenario index. Ward attributes, storm profile, weights, and thresholds are illustrative assumptions.
          This is not a hydrologic solver, probability forecast, calibrated model, or public-warning system.
        </p>
      </details>
      <p className="simulator-note">
        {result.modelDisclosure} No live weather, sensors, maps, resident data, or emergency services are connected.
        Always rely on official forecasts, local authorities, and field-verified conditions.
      </p>
    </section>
  );
}

export default RiskSimulator;
