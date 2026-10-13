import { useState } from 'react';
import { calculateFloodRisk } from './floodRisk.js';

const initialScenario = {
  rainfallMm: 35,
  drainLoad: 60,
  blockage: 25,
};

function getRecommendations(level) {
  if (level === 'Critical') {
    return [
      'Dispatch an inspection crew to verify the highest-risk drain.',
      'Prepare traffic diversions for known low-lying routes.',
      'Send an authorized local alert if field conditions confirm the risk.',
    ];
  }

  if (level === 'High') {
    return [
      'Inspect vulnerable drains and clear accessible blockages.',
      'Place response crews on standby near low-lying routes.',
      'Recheck rainfall and field conditions before escalating.',
    ];
  }

  if (level === 'Elevated') {
    return [
      'Monitor rainfall and drainage conditions at short intervals.',
      'Review known waterlogging locations and crew readiness.',
    ];
  }

  return [
    'Continue routine monitoring.',
    'Verify that contact and escalation routes are up to date.',
  ];
}

function ScenarioInput({ id, label, hint, min, max, value, onChange, unit }) {
  return (
    <div className="scenario-input">
      <div className="scenario-label-row">
        <label htmlFor={id}>{label}</label>
        <output htmlFor={id}>
          {value}
          {unit}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <small>{hint}</small>
    </div>
  );
}

export default function RiskSimulator() {
  const [scenario, setScenario] = useState(initialScenario);
  const risk = calculateFloodRisk(scenario);

  function updateScenario(key, value) {
    setScenario((current) => ({ ...current, [key]: value }));
  }

  return (
    <section className="risk-simulator" aria-labelledby="simulator-title">
      <div className="simulator-intro">
        <div>
          <span className="eyebrow">Interactive scenario · synthetic inputs</span>
          <h3 id="simulator-title">Explore a ward risk scenario</h3>
          <p>
            Adjust the inputs to see how a transparent demonstration score changes. No live drain sensors or
            validated flood-prediction model are connected.
          </p>
        </div>
        <span className="data-badge">Demo only — not an operational alert</span>
      </div>

      <div className="simulator-layout">
        <div className="scenario-controls" aria-label="Flood risk scenario inputs">
          <ScenarioInput
            id="rainfall"
            label="Rainfall over the next 3 hours"
            hint="Scenario input in millimetres; not a live weather forecast."
            min={0}
            max={100}
            value={scenario.rainfallMm}
            unit=" mm"
            onChange={(value) => updateScenario('rainfallMm', value)}
          />
          <ScenarioInput
            id="drain-load"
            label="Drain network load"
            hint="Assumed capacity utilization for this scenario."
            min={0}
            max={100}
            value={scenario.drainLoad}
            unit="%"
            onChange={(value) => updateScenario('drainLoad', value)}
          />
          <ScenarioInput
            id="blockage"
            label="Estimated blockage"
            hint="Assumed blockage level; verify with field inspection."
            min={0}
            max={100}
            value={scenario.blockage}
            unit="%"
            onChange={(value) => updateScenario('blockage', value)}
          />
        </div>

        <div className={`scenario-result risk-${risk.level.toLowerCase()}`} aria-live="polite">
          <span className="result-label">Heuristic scenario score</span>
          <div className="result-score">{risk.score}<span>/100</span></div>
          <div className="result-level">{risk.level} scenario risk</div>
          <div
            className="score-track"
            role="progressbar"
            aria-label="Demonstration risk score"
            aria-valuemin="0"
            aria-valuemax="100"
            aria-valuenow={risk.score}
          >
            <span style={{ width: `${risk.score}%` }} />
          </div>
          <h4>Suggested planning checks</h4>
          <ul>
            {getRecommendations(risk.level).map((recommendation) => (
              <li key={recommendation}>{recommendation}</li>
            ))}
          </ul>
        </div>
      </div>

      <p className="simulator-note">
        Demonstration heuristic only: rainfall contributes 45%, drain load 35%, and estimated blockage 20%.
        Weights and thresholds are illustrative, not calibrated or validated against historical flood outcomes.
        Confirm conditions with official forecasts and on-the-ground teams before taking action.
      </p>
    </section>
  );
}
