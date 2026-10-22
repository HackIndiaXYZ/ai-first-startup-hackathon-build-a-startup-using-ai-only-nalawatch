import { useEffect, useMemo, useState } from 'react';
import {
  DEFAULT_SCENARIO,
  SCENARIO_PRESETS,
  simulateCityScenario,
} from './floodRisk.js';
import WeatherContext from './WeatherContext.jsx';
import { useAuth } from '../auth/FirebaseAuthContext.jsx';

const controls = [
  {
    id: 'rainfallMm',
    label: 'Rainfall total · next 3 hours',
    hint: 'Three-hour total. When a forecast is active, its hourly shape is scaled to this value.',
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
        step={control.id === 'rainfallMm' ? 0.1 : 1}
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

function downloadScenario(scenario, result, selectedWard, activeForecast) {
  const report = {
    product: 'NalaWatch synthetic flood scenario sandbox',
    createdAt: new Date().toISOString(),
    disclosure: result.modelDisclosure,
    assumptions: {
      stormProfile: activeForecast
        ? 'Hourly precipitation forecast for the next six hours, scaled proportionally so the first three hours sum to the scenario rainfall control.'
        : '20%, 50%, and 30% of entered rainfall total over hours 1–3; no rain in hours 4–6.',
      formula:
        'Ponding proxy = prior ponding + rainfall × imperviousness × ground factor × low-point factor − assumed drain throughput.',
      sensitivity:
        'Range varies rainfall by ±20% and drainage capacity by ∓20%; it is not a calibrated uncertainty interval.',
      data: activeForecast
        ? `Rainfall profile from ${activeForecast.source} for ${activeForecast.city.name}; all ward attributes remain synthetic.`
        : 'All ward attributes and rainfall inputs are synthetic; no live maps, sensors, or resident data are used.',
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
    weatherSource: activeForecast
      ? {
          name: activeForecast.source,
          city: activeForecast.city.name,
          fetchedAt: activeForecast.fetchedAt,
          attribution: 'https://open-meteo.com/',
        }
      : null,
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
  const {
    user,
    listUserScenarios,
    saveUserScenario: persistUserScenario,
    deleteUserScenario: removeUserScenario,
  } = useAuth();
  const [scenario, setScenario] = useState(DEFAULT_SCENARIO);
  const [activeForecast, setActiveForecast] = useState(null);
  const [comparisonBaseline, setComparisonBaseline] = useState(null);
  const [prioritySort, setPrioritySort] = useState(false);
  const [savedScenarios, setSavedScenarios] = useState([]);
  const [savedScenariosUserId, setSavedScenariosUserId] = useState(null);
  const [scenarioTitle, setScenarioTitle] = useState('');
  const [savingScenario, setSavingScenario] = useState(false);
  const [savedScenarioError, setSavedScenarioError] = useState(null);
  const forecastProfile = useMemo(
    () => activeForecast?.hours.map((hour) => hour.precipitationMm) ?? null,
    [activeForecast],
  );
  const baselineResult = useMemo(
    () =>
      comparisonBaseline
        ? simulateCityScenario(comparisonBaseline.scenario, comparisonBaseline.forecastProfile)
        : null,
    [comparisonBaseline],
  );
  const result = useMemo(
    () => simulateCityScenario(scenario, forecastProfile),
    [scenario, forecastProfile],
  );
  const [selectedWardId, setSelectedWardId] = useState(result.highestPriorityWard.id);
  const selectedWard =
    result.wards.find((ward) => ward.id === selectedWardId) ?? result.highestPriorityWard;
  const displayedWards = prioritySort
    ? [...result.wards].sort((first, second) => second.score - first.score)
    : result.wards;
  const visibleSavedScenarios = savedScenariosUserId === user?.uid ? savedScenarios : [];
  const currentSavedScenarioError =
    savedScenarioError && savedScenarioError.userId === user?.uid ? savedScenarioError.message : '';
  const savedScenariosLoading =
    Boolean(user) && savedScenariosUserId !== user.uid && !currentSavedScenarioError;

  useEffect(() => {
    let active = true;

    if (!user) return undefined;

    listUserScenarios(user.uid)
      .then((scenarios) => {
        if (active) {
          setSavedScenarios(scenarios);
          setSavedScenariosUserId(user.uid);
          setSavedScenarioError((current) => (current?.userId === user.uid ? null : current));
        }
      })
      .catch(() => {
        if (active) {
          setSavedScenarioError({
            userId: user.uid,
            message: 'Saved scenarios could not be loaded. Check your connection and Firestore rules.',
          });
        }
      });

    return () => {
      active = false;
    };
  }, [listUserScenarios, user]);

  function updateScenario(key, value) {
    setScenario((current) => ({ ...current, [key]: value }));
  }

  function applyPreset(name) {
    setScenario(SCENARIO_PRESETS[name]);
    setActiveForecast(null);
    setSelectedWardId('W-02');
  }

  function applyForecast(forecast) {
    const rainfallMm = forecast.hours
      .slice(0, 3)
      .reduce((total, hour) => total + hour.precipitationMm, 0);
    setScenario((current) => ({
      ...current,
      rainfallMm: Math.min(240, Math.round(rainfallMm * 10) / 10),
    }));
    setActiveForecast(forecast);
    setSelectedWardId('W-02');
  }

  function saveComparisonBaseline() {
    setComparisonBaseline({
      scenario: { ...scenario },
      forecastProfile: forecastProfile ? [...forecastProfile] : null,
      label: activeForecast
        ? `Open-Meteo rainfall context · ${activeForecast.city.name}`
        : 'Synthetic rainfall profile',
    });
  }

  async function handleSaveUserScenario(event) {
    event.preventDefault();
    const title = scenarioTitle.trim();
    if (!user || !title) return;

    setSavingScenario(true);
    setSavedScenarioError(null);
    try {
      const savedDocument = await persistUserScenario(user.uid, title, scenario);
      setSavedScenarios((current) => [
        { id: savedDocument.id, title: title.slice(0, 60), inputs: { ...scenario }, createdAt: null },
        ...(savedScenariosUserId === user.uid ? current : []),
      ]);
      setSavedScenariosUserId(user.uid);
      setScenarioTitle('');
    } catch {
      setSavedScenarioError({
        userId: user.uid,
        message: 'Scenario could not be saved. Check your connection and Firestore rules.',
      });
    } finally {
      setSavingScenario(false);
    }
  }

  async function deleteUserScenario(scenarioId) {
    if (!user) return;
    setSavedScenarioError(null);
    try {
      await removeUserScenario(user.uid, scenarioId);
      setSavedScenarios((current) => current.filter((savedScenario) => savedScenario.id !== scenarioId));
    } catch {
      setSavedScenarioError({
        userId: user.uid,
        message: 'Scenario could not be deleted. Check your connection and Firestore rules.',
      });
    }
  }

  function loadUserScenario(savedScenario) {
    setScenario(savedScenario.inputs);
    setActiveForecast(null);
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
            Compare six synthetic neighbourhoods under a transparent bucket-model scenario. Optionally load
            a real hourly precipitation forecast as weather context; drainage and exposure remain fictional.
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
          onClick={() => downloadScenario(scenario, result, selectedWard, activeForecast)}
        >
          Download scenario data
        </button>
        <button className="preset-button" type="button" onClick={saveComparisonBaseline}>
          {comparisonBaseline ? 'Update comparison baseline' : 'Save current as comparison baseline'}
        </button>
      </div>

      <WeatherContext
        activeForecast={activeForecast?.fetchedAt}
        onApply={applyForecast}
        onRemove={() => setActiveForecast(null)}
      />

      <section className="saved-scenarios" aria-labelledby="saved-scenarios-title">
        <div className="saved-scenarios-heading">
          <div>
            <span className="result-label">Private workspace</span>
            <h4 id="saved-scenarios-title">My saved scenarios</h4>
            <p>
              {user
                ? `Saved privately to your account (${user.email || user.displayName || 'signed-in user'}).`
                : 'Sign in to save scenarios privately and access them from your account.'}
            </p>
          </div>
        </div>
        {user ? (
          <>
            <form className="save-scenario-form" onSubmit={handleSaveUserScenario}>
              <label className="sr-only" htmlFor="saved-scenario-title">Scenario name</label>
              <input
                id="saved-scenario-title"
                type="text"
                value={scenarioTitle}
                onChange={(event) => setScenarioTitle(event.target.value)}
                placeholder="Name this scenario"
                maxLength={60}
                required
              />
              <button className="export-button" type="submit" disabled={savingScenario || !scenarioTitle.trim()}>
                {savingScenario ? 'Saving…' : 'Save current scenario'}
              </button>
            </form>
            {currentSavedScenarioError && (
              <p className="saved-scenario-error" role="alert">{currentSavedScenarioError}</p>
            )}
            {savedScenariosLoading || savedScenariosUserId !== user.uid ? (
              <p className="saved-scenarios-empty" role="status">Loading your scenarios…</p>
            ) : currentSavedScenarioError ? null : visibleSavedScenarios.length > 0 ? (
              <ul className="saved-scenario-list">
                {visibleSavedScenarios.map((savedScenario) => (
                  <li className="saved-scenario-item" key={savedScenario.id}>
                    <div>
                      <strong>{savedScenario.title}</strong>
                      <span>
                        {savedScenario.createdAt?.toDate
                          ? savedScenario.createdAt.toDate().toLocaleString()
                          : 'Saved just now'}
                      </span>
                      <small>
                        {savedScenario.inputs.rainfallMm} mm rain · {savedScenario.inputs.blockage}% blockage
                      </small>
                    </div>
                    <div className="saved-scenario-actions">
                      <button className="preset-button" type="button" onClick={() => loadUserScenario(savedScenario)}>
                        Load
                      </button>
                      <button
                        className="saved-scenario-delete"
                        type="button"
                        onClick={() => deleteUserScenario(savedScenario.id)}
                        aria-label={`Delete ${savedScenario.title}`}
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="saved-scenarios-empty">No saved scenarios yet. Save the current assumptions to return to them later.</p>
            )}
          </>
        ) : (
          <p className="saved-scenarios-empty">Your current demo remains available without an account; sign in when you want private cloud saves.</p>
        )}
      </section>

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
        <section className="scenario-controls" aria-labelledby="scenario-controls-title">
          <div className="scenario-controls-heading">
            <div>
              <span className="result-label">Scenario inputs</span>
              <h4 id="scenario-controls-title">Adjust assumptions</h4>
            </div>
            <span className="input-count">4 controls</span>
          </div>
          {controls.map((control) => (
            <ScenarioInput
              key={control.id}
              control={control}
              value={scenario[control.id]}
              onChange={updateScenario}
            />
          ))}
        </section>

        <section className="ward-board" aria-labelledby="ward-board-title">
          <div className="panel-heading">
            <div>
              <span className="result-label">Schematic · not a geographic map</span>
              <h4 id="ward-board-title">Neighbourhood scenario board</h4>
            </div>
            <div className="ward-board-actions">
              <span className="map-legend"><i aria-hidden="true" /> Higher index</span>
              <button
                className="sort-button"
                type="button"
                onClick={() => setPrioritySort((current) => !current)}
                aria-pressed={prioritySort}
              >
                {prioritySort ? 'Default order' : 'Highest index first'}
              </button>
            </div>
          </div>
          <div className="ward-grid" role="group" aria-label="Select a synthetic neighbourhood">
            {displayedWards.map((ward) => (
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
                <span className="ward-score-track" aria-hidden="true">
                  <span style={{ width: `${ward.score}%` }} />
                </span>
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
            <h5>{activeForecast ? `Forecast rainfall profile · ${activeForecast.city.name}` : 'Assumed rainfall profile'}</h5>
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
            <p>
              {activeForecast
                ? `Hourly rainfall comes from ${activeForecast.source} and is scaled to the scenario control.`
                : 'Rainfall total is allocated across the first three hours; the remaining hours are a drainage recovery scenario.'}
            </p>
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

      {baselineResult && (
        <section className="comparison-panel" aria-labelledby="comparison-title">
          <div className="comparison-heading">
            <div>
              <span className="result-label">Scenario comparison · illustrative index points</span>
              <h4 id="comparison-title">Current scenario vs saved baseline</h4>
              <p>Baseline: {comparisonBaseline.label}. Changes reflect only the assumptions in this demonstration model.</p>
            </div>
            <button
              className="preset-button"
              type="button"
              onClick={() => setComparisonBaseline(null)}
            >
              Clear comparison
            </button>
          </div>
          <div className="comparison-table-wrap">
            <table className="comparison-table" aria-label="Synthetic neighbourhood scenario index comparison">
              <thead>
                <tr>
                  <th scope="col">Synthetic neighbourhood</th>
                  <th scope="col">Baseline</th>
                  <th scope="col">Current</th>
                  <th scope="col">Change</th>
                </tr>
              </thead>
              <tbody>
                {result.wards.map((ward) => {
                  const baselineWard = baselineResult.wards.find((item) => item.id === ward.id);
                  const change = ward.score - baselineWard.score;
                  const changeLabel = change > 0 ? `+${change}` : `${change}`;

                  return (
                    <tr key={ward.id} className={ward.id === selectedWard.id ? 'selected' : ''}>
                      <th scope="row">{ward.name} <span>{ward.id}</span></th>
                      <td>{baselineWard.score}</td>
                      <td>{ward.score}</td>
                      <td className={change > 0 ? 'comparison-increase' : change < 0 ? 'comparison-decrease' : ''}>
                        {changeLabel}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="comparison-disclosure">
            A score change is not a measured change in flood probability or safety. Both columns use the same uncalibrated,
            fictional ward assumptions.
          </p>
        </section>
      )}

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
        {result.modelDisclosure} {activeForecast
          ? `Only the rainfall context is external (${activeForecast.source} for ${activeForecast.city.name}); all drainage and ward properties remain synthetic.`
          : 'No external forecast was loaded. All rainfall, drainage, and ward values are synthetic.'}
        {' '}No live sensors, maps, resident data, or emergency services are connected.
        Always rely on official forecasts, local authorities, and field-verified conditions.
      </p>
    </section>
  );
}

export default RiskSimulator;
