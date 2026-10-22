import { useState } from 'react';
import AccountControl from './components/AccountControl.jsx';
import ContactForm from './components/ContactForm.jsx';
import RiskSimulator from './features/scenario/RiskSimulator.jsx';
import { AuthProvider } from './auth/FirebaseAuthContext.jsx';

const metrics = [
  { value: 'Rainfall', label: 'Weather context' },
  { value: 'Drainage', label: 'Network capacity' },
  { value: 'Exposure', label: 'Local vulnerability' },
  { value: 'Response', label: 'Preparedness actions' },
];

const featureCards = [
  {
    title: 'Live weather context',
    description: 'Optionally fetch hourly precipitation forecasts for five Indian cities and use the next three-hour rainfall as a scenario input.',
    accent: 'graph',
  },
  {
    title: 'Neighbourhood comparison',
    description: 'Compare six fictional neighbourhoods with distinct low-point, surface-cover, drainage, and exposure assumptions.',
    accent: 'shield',
  },
  {
    title: 'Explainable scenario outputs',
    description: 'Inspect forecast rainfall timing or a synthetic storm profile, an hourly ponding proxy, and a what-if sensitivity check—not a probability forecast.',
    accent: 'signal',
  },
  {
    title: 'Preparedness discussion prompts',
    description: 'Select tabletop tasks and build a scenario-specific discussion brief inside the dashboard. Nothing is dispatched or sent as an alert.',
    accent: 'spark',
  },
];

const workflow = [
  'Start with Mumbai rainfall context from Open-Meteo, or keep the rainfall fully synthetic.',
  'Compare six fictional neighbourhoods with different surface, low-point, drainage, and exposure assumptions.',
  'Play or scrub through six scenario hours and watch the selected neighbourhood timeline update.',
  'Choose tabletop discussion tasks and build a brief from the selected scenario, hour, and neighbourhood.',
];

const useCases = [
  'Municipal corporations',
  'Disaster response teams',
  'Traffic management cells',
  'Public health agencies',
];

const deckSlides = [
  { title: 'The gap', text: 'A usable preparedness workflow must connect rain timing to trusted local drainage and incident evidence. Those local evidence feeds are not connected in this prototype.' },
  { title: 'Why Mumbai first?', text: 'Mumbai is our proposed pilot focus, not a confirmed partnership or selected ward. The demo already supports optional city-level rainfall context here.' },
  { title: 'Working demo', text: 'Load hourly Mumbai rain, adjust a transparent scenario, compare fictional neighbourhood indices, and inspect each data limitation.' },
  { title: 'What is real?', text: 'Only the requested Open-Meteo precipitation context is external. Ward attributes, drainage assumptions, scores, and ponding outputs are synthetic.' },
  { title: 'Pilot proof plan', text: 'Choose one ward with a civic/hydrology partner. Obtain permitted records and test against held-out events in shadow mode before considering operational use.' },
  { title: 'The ask', text: 'We seek incubation support, a Mumbai civic or research introduction, and hydrology expertise to define a narrow, measurable, safe pilot question.' },
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

function AppContent() {
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

        <a className="primary-button" href="#simulator">Open dashboard</a>
        <AccountControl />
      </header>

      <main id="main-content" tabIndex="-1">
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow">Mumbai pilot candidate · prototype</div>
            <h1>Explore flood scenarios before the storm.</h1>
            <p>
              Start with Mumbai’s hourly rainfall context, inspect how assumptions shape a transparent scenario,
              and see exactly which local evidence a future city pilot would still need.
            </p>

            <div className="hero-actions">
              <a className="primary-button large" href="#simulator">Try the scenario</a>
              <a className="secondary-button large" href="#workflow">See the workflow</a>
            </div>

            <div className="mini-trust">
              <span>Pilot proposed, not partner-approved. Rain is weather context; neighbourhoods and flood index are synthetic.</span>
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
              <span className="pill danger">Synthetic scenario</span>
              <strong>Change the inputs to explore a scenario</strong>
              <small>Not a real-time flood warning</small>
            </div>
          </div>
        </section>

        <section id="simulator" className="demo-showcase">
          <div className="demo-heading section-header">
            <span className="eyebrow">Live demo</span>
            <h2>Explore a transparent flood-risk scenario.</h2>
          </div>

          <div className="mode-toggle" role="group" aria-label="Demo view">
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
            <h2>From changing assumptions to preparedness questions.</h2>
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
            <h2>How the NalaWatch prototype explores flood scenarios.</h2>
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
            <h2>Help cities prepare for safer monsoon decisions.</h2>
            <p>
              Urban flooding is shaped by rainfall, ground conditions, drainage capacity, and exposure. NalaWatch explores
              how those factors might be discussed together before a validated operational system exists.
            </p>
            <p>
              Today’s demo uses fictional neighbourhoods and an intentionally simple bucket model. A real deployment would
              need permitted local data, calibrated hydrology, field validation, uncertainty evaluation, and human oversight.
            </p>
          </div>

          <div className="mission-card">
            <div className="mission-pill">Prototype guided by research review</div>
            <ul>
              <li>Synthetic rainfall scenarios</li>
              <li>Assumed drainage constraints</li>
              <li>Illustrative neighbourhood comparison</li>
              <li>Future pilot data requirements</li>
            </ul>
            <a
              className="research-link"
              href="https://github.com/HackIndiaXYZ/ai-first-startup-hackathon-build-a-startup-using-ai-only-nalawatch/blob/main/RESEARCH_NOTES.md"
              target="_blank"
              rel="noreferrer"
            >
              Read the selected literature and model limitations
            </a>
          </div>
        </section>

        <section className="cta-section">
          <div className="cta-panel">
            <div>
              <span className="eyebrow">Ready to act early?</span>
              <h2>Turn scenario questions into a responsible pilot plan.</h2>
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

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
