import { useState } from 'react';
import ContactForm from './components/ContactForm.jsx';
import RiskSimulator from './components/RiskSimulator.jsx';

const metrics = [
  { value: 'Rainfall', label: 'Weather context' },
  { value: 'Drainage', label: 'Network capacity' },
  { value: 'Exposure', label: 'Local vulnerability' },
  { value: 'Response', label: 'Preparedness actions' },
];

const featureCards = [
  {
    title: 'AI rainfall + drainage forecast',
    description: 'Combines live weather, hydrology, drainage maps, and historical flood patterns to predict where waterlogging will hit next.',
    accent: 'graph',
  },
  {
    title: 'Real-time sensor intelligence',
    description: 'Tracks water levels, overflow risk, and network strain across critical drains and flood-prone corridors.',
    accent: 'shield',
  },
  {
    title: 'Civic early warning system',
    description: 'Alerts city officials, emergency teams, and residents before drains exceed safe thresholds or roads become impassable.',
    accent: 'signal',
  },
  {
    title: 'Operational response planner',
    description: 'Prioritizes actions, dispatches crews, and helps traffic and rescue teams prepare for the next high-risk hour.',
    accent: 'spark',
  },
];

const workflow = [
  'Ingest weather, drainage, and sensor data from city networks and historical flood patterns.',
  'Correlate rainfall intensity, blockage risk, and capacity constraints through explainable AI models.',
  'Identify priority zones and issue early alerts to civic teams, responders, and residents.',
  'Coordinate action plans before roads flood, drains overflow, and public health risk spikes.',
];

const useCases = [
  'Municipal corporations',
  'Disaster response teams',
  'Traffic management cells',
  'Public health agencies',
];

const deckSlides = [
  { title: 'Problem', text: 'Indian cities lose billions every monsoon because drainage capacity, rainfall, and response plans are not connected in real time.' },
  { title: 'Solution', text: 'NalaWatch combines weather, drainage, geography, and sensor intelligence to predict flood hotspots before they become disasters.' },
  { title: 'Product', text: 'Real-time city risk dashboard, AI-based alerting, operational recommendations, and resident warning workflows.' },
  { title: 'Market', text: 'Municipal infrastructure, flood-response agencies, and urban resilience programs all need predictive flood intelligence at city scale.' },
  { title: 'Model', text: 'Pilot contracts with cities, recurring software subscriptions, and B2G partnerships with disaster management agencies.' },
  { title: 'Ask', text: 'Pilot funding, incubation support, and a live city deployment partnership to prove the impact at scale.' },
];

function PitchDeck() {
  return (
    <div className="pitch-deck">
      {deckSlides.map((slide, index) => (
        <article key={slide.title} className="slide-card">
          <span className="slide-index">0{index + 1}</span>
          <h3>{slide.title}</h3>
          <p>{slide.text}</p>
        </article>
      ))}
    </div>
  );
}

function App() {
  const [view, setView] = useState('dashboard');

  return (
    <div className="page-shell">
      <header className="topbar">
        <div className="brand-wrap">
          <div className="brand-mark">N</div>
          <div>
            <div className="brand-name">NalaWatch</div>
            <div className="brand-tag">Urban flood intelligence</div>
          </div>
        </div>

        <nav className="nav" aria-label="Main navigation">
          <a href="#product">Product</a>
          <a href="#workflow">Workflow</a>
          <a href="#mission">Mission</a>
          <a href="#simulator">Simulator</a>
        </nav>

        <a className="primary-button" href="#contact">Discuss a pilot</a>
      </header>

      <main id="main-content">
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow">Real-time urban resilience</div>
            <h1>Predict floods before they hit the city.</h1>
            <p>
              NalaWatch is a flood-intelligence concept for helping civic teams connect rainfall, drainage, and local
              exposure information so they can plan earlier and respond with better context.
            </p>

            <div className="hero-actions">
              <a className="primary-button large" href="#simulator">Try the scenario</a>
              <a className="secondary-button large" href="#workflow">See the workflow</a>
            </div>

            <div className="mini-trust">
              <span>Prototype demonstration. No live sensor network or validated forecasting model is connected.</span>
            </div>

            <div className="hero-list">
              {useCases.map((item) => (
                <div key={item} className="hero-chip">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="hero-visual" aria-label="NalaWatch dashboard preview">
            <div className="dashboard-card dashboard-main">
              <div className="card-header">
                <span className="dot red" />
                <span className="dot amber" />
                <span className="dot green" />
              </div>

              <div className="panel-grid">
                <div className="metric-panel">
                  <span className="label">Risk inputs</span>
                  <strong>03</strong>
                  <small>Rainfall · drain load · blockage</small>
                </div>
                <div className="metric-panel alert">
                  <span className="label">Mode</span>
                  <strong>Demo</strong>
                  <small>Illustrative scenario only</small>
                </div>
              </div>

              <div className="chart-box">
                <span className="bar bar-1" />
                <span className="bar bar-2" />
                <span className="bar bar-3" />
                <span className="bar bar-4" />
                <span className="bar bar-5" />
              </div>
            </div>

            <div className="network-card" aria-hidden="true">
              <span className="network-node n1" />
              <span className="network-node n2" />
              <span className="network-node n3" />
              <span className="network-node n4" />
              <span className="network-node n5" />
              <span className="network-node n6" />
            </div>

            <div className="floating-card">
              <span className="pill danger">Prototype</span>
              <strong>Change the inputs to explore a scenario</strong>
              <small>Not a real-time flood warning</small>
            </div>
          </div>
        </section>

        <section className="metrics" aria-label="Key performance metrics">
          {metrics.map((metric) => (
            <div key={metric.label} className="metric-item">
              <strong>{metric.value}</strong>
              <span>{metric.label}</span>
            </div>
          ))}
        </section>

        <section id="product" className="features">
          <div className="section-header">
            <span className="eyebrow">Product</span>
            <h2>From weather warning to field action.</h2>
          </div>

          <div className="cards-grid">
            {featureCards.map((card) => (
              <article key={card.title} className="feature-card">
                <div className={`feature-icon ${card.accent}`} aria-hidden="true" />
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="workflow" className="workflow">
          <div className="section-header narrow">
            <span className="eyebrow">Workflow</span>
            <h2>How NalaWatch turns risk data into action.</h2>
          </div>

          <div className="workflow-inner">
            {workflow.map((step, index) => (
              <div key={step} className="workflow-item">
                <div className="workflow-number">0{index + 1}</div>
                <p>{step}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="mission" className="mission">
          <div className="mission-copy">
            <span className="eyebrow">Mission</span>
            <h2>Protect lives, roads, and livelihoods before the monsoon peaks.</h2>
            <p>
              Every year, flooding and drain overflow cause preventable disruption across Indian cities. NalaWatch helps
              governments and responders move from reactive repair to proactive risk detection.
            </p>
            <p>
              We combine geospatial intelligence with AI forecasting to highlight where water will pool, which drains are at
              risk, and what actions can reduce damage before the next heavy downpour.
            </p>
          </div>

          <div className="mission-card">
            <div className="mission-pill">AI forecast</div>
            <ul>
              <li>Monsoon weather risk</li>
              <li>Drainage capacity stress</li>
              <li>Waterlogging hotspots</li>
              <li>Emergency intervention route</li>
            </ul>
          </div>
        </section>

        <section id="simulator" className="demo-showcase">
          <div className="demo-heading section-header">
            <span className="eyebrow">Demo</span>
            <h2>Explore a transparent flood-risk scenario.</h2>
          </div>

          <div className="mode-toggle" aria-label="Demo view toggle">
            <button
              type="button"
              className={`toggle ${view === 'dashboard' ? 'active' : ''}`}
              onClick={() => setView('dashboard')}
              aria-pressed={view === 'dashboard'}
            >
              Scenario simulator
            </button>
            <button
              type="button"
              className={`toggle ${view === 'pitch' ? 'active' : ''}`}
              onClick={() => setView('pitch')}
              aria-pressed={view === 'pitch'}
            >
              Startup pitch
            </button>
          </div>

          {view === 'dashboard' ? <RiskSimulator /> : <PitchDeck />}
        </section>

        <section className="cta-section">
          <div className="cta-panel">
            <div>
              <span className="eyebrow">Ready to act early?</span>
              <h2>Turn flood risk into a measurable response plan.</h2>
            </div>
            <a className="primary-button large" href="#contact">Discuss a pilot</a>
          </div>
        </section>

        <section id="contact" className="contact-section">
          <div className="section-header narrow">
            <span className="eyebrow">Get in touch</span>
            <h2>Start a conversation with the NalaWatch team.</h2>
          </div>
          <ContactForm />
        </section>
      </main>
    </div>
  );
}

export default App;
