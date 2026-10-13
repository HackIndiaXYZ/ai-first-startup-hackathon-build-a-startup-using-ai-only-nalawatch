import { useState } from 'react';
import BarChart from './components/BarChart.jsx';
import ContactForm from './components/ContactForm.jsx';

const metrics = [
  { value: '36h', label: 'Flood risk alert window' },
  { value: '92%', label: 'Drainage risk accuracy' },
  { value: '₹400Cr', label: 'Potential daily loss avoided' },
  { value: '24/7', label: 'AI monitoring coverage' },
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

const testimonials = [
  {
    quote:
      'NalaWatch gave our emergency team a 12-hour warning window before key roads became impassable. That made all the difference.',
    name: 'Ritika Nair',
    role: 'Joint Commissioner, Smart City Cell',
  },
  {
    quote:
      'We used to respond after the flooding had already spread. Now we see risk zones before the rain even peaks.',
    name: 'Vikram Patel',
    role: 'City Incident Response Lead',
  },
];

const plans = [
  {
    name: 'Pilot',
    price: '₹79,000',
    detail: 'For one city ward or high-risk corridor',
    features: ['1 pilot area', 'Live flood alerts', 'Risk dashboard', 'SMS + email notifications'],
  },
  {
    name: 'Scale',
    price: '₹2.5L',
    detail: 'For growing municipal deployment across districts',
    features: ['Multi-zone coverage', 'AI prioritization engine', 'Team reporting', 'Priority support'],
    featured: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    detail: 'For state-level disaster coordination and critical infrastructure planning',
    features: ['Private deployment', 'Custom dashboards', 'Inter-agency workflows', 'Dedicated success team'],
  },
];

const dashboardRows = [
  { label: 'High-risk wards', value: '11', trend: '+22%' },
  { label: 'Drivers blocked', value: '63%', trend: '+18%' },
  { label: 'Overflow risk', value: '7 zones', trend: '+9%' },
  { label: 'Time to alert', value: '4.8h', trend: '-41%' },
];

const deckSlides = [
  { title: 'Problem', text: 'Indian cities lose billions every monsoon because drainage capacity, rainfall, and response plans are not connected in real time.' },
  { title: 'Solution', text: 'NalaWatch combines weather, drainage, geography, and sensor intelligence to predict flood hotspots before they become disasters.' },
  { title: 'Product', text: 'Real-time city risk dashboard, AI-based alerting, operational recommendations, and resident warning workflows.' },
  { title: 'Market', text: 'Municipal infrastructure, flood-response agencies, and urban resilience programs all need predictive flood intelligence at city scale.' },
  { title: 'Model', text: 'Pilot contracts with cities, recurring software subscriptions, and B2G partnerships with disaster management agencies.' },
  { title: 'Ask', text: 'Pilot funding, incubation support, and a live city deployment partnership to prove the impact at scale.' },
];

function DemoDashboard() {
  return (
    <div className="demo-dashboard">
      <div className="dashboard-header">
        <div>
          <span className="eyebrow">City intelligence</span>
          <h3>Flood risk command center</h3>
        </div>
        <button type="button" className="primary-button small">Export report</button>
      </div>

      <div className="dashboard-grid">
        <div className="d-panel large-panel">
          <div className="panel-topline">
            <span>Rainfall + drain load</span>
            <strong>+28%</strong>
          </div>
          <BarChart data={[5, 8, 10, 16, 20, 14, 18]} width={420} height={200} />
        </div>

        <div className="d-panel side-panel">
          <div className="panel-topline">
            <span>Priority alert</span>
            <strong>Critical</strong>
          </div>
          <div className="risk-pill">Ward 14</div>
          <p>Drainage backlog and waterlogging predicted within 90 minutes along the lowest-lying corridor.</p>
        </div>
      </div>

      <div className="status-grid">
        {dashboardRows.map((row) => (
          <div key={row.label} className="status-card">
            <span>{row.label}</span>
            <strong>{row.value}</strong>
            <em>{row.trend}</em>
          </div>
        ))}
      </div>
    </div>
  );
}

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
          <a href="#pricing">Pricing</a>
        </nav>

        <button type="button" className="primary-button">Book a demo</button>
      </header>

      <main id="main-content">
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow">Real-time urban resilience</div>
            <h1>Predict floods before they hit the city.</h1>
            <p>
              NalaWatch uses AI, weather intelligence, and drainage insights to forecast waterlogging, drain overloads,
              and emergency hotspots before they turn into public safety crises.
            </p>

            <div className="hero-actions">
              <button type="button" className="primary-button large">Start a pilot</button>
              <button type="button" className="secondary-button large">See the workflow</button>
            </div>

            <div className="mini-trust">
              <span>Built for municipal teams, disaster response units, and city resilience planning.</span>
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
                  <span className="label">Risk zones</span>
                  <strong>11</strong>
                  <small>+22% from last cycle</small>
                </div>
                <div className="metric-panel alert">
                  <span className="label">Critical</span>
                  <strong>4</strong>
                  <small>Need response within 90 min</small>
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
              <span className="pill danger">Live alert</span>
              <strong>Ward 14: Drain overload in 68 minutes</strong>
              <small>Prepared response route activated</small>
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

        <div className="logo-strip" aria-label="Trust indicators">
          <span>Built for city resilience</span>
          <div className="logo-row">
            <div>MetroOps</div>
            <div>StormGrid</div>
            <div>OpenDrain</div>
            <div>RescueFlow</div>
            <div>CityPulse</div>
          </div>
        </div>

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

        <section id="pricing" className="pricing">
          <div className="section-header">
            <span className="eyebrow">Pricing</span>
            <h2>Simple pricing for city pilots and scale-up.</h2>
          </div>

          <div className="pricing-grid">
            {plans.map((plan) => (
              <article key={plan.name} className={`pricing-card ${plan.featured ? 'featured' : ''}`}>
                <div className="plan-header">
                  <h3>{plan.name}</h3>
                  {plan.featured && <span className="popular-tag">Most popular</span>}
                </div>
                <div className="price">{plan.price}</div>
                <p>{plan.detail}</p>
                <ul>
                  {plan.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
                <button type="button" className={plan.featured ? 'primary-button full' : 'secondary-button full'}>
                  {plan.featured ? 'Get started' : 'Talk to sales'}
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="testimonials">
          <div className="section-header">
            <span className="eyebrow">Testimonials</span>
            <h2>Trusted by teams managing risk in real time.</h2>
          </div>

          <div className="testimonial-grid">
            {testimonials.map((item) => (
              <blockquote key={item.name} className="testimonial-card">
                <p>“{item.quote}”</p>
                <footer>
                  <strong>{item.name}</strong>
                  <span>{item.role}</span>
                </footer>
              </blockquote>
            ))}
          </div>
        </section>

        <section className="demo-showcase">
          <div className="demo-heading section-header">
            <span className="eyebrow">Demo</span>
            <h2>City operations dashboard and startup story.</h2>
          </div>

          <div className="mode-toggle" aria-label="Demo view toggle">
            <button
              type="button"
              className={`toggle ${view === 'dashboard' ? 'active' : ''}`}
              onClick={() => setView('dashboard')}
            >
              Dashboard
            </button>
            <button
              type="button"
              className={`toggle ${view === 'pitch' ? 'active' : ''}`}
              onClick={() => setView('pitch')}
            >
              Pitch deck
            </button>
          </div>

          {view === 'dashboard' ? <DemoDashboard /> : <PitchDeck />}
        </section>

        <section className="cta-section">
          <div className="cta-panel">
            <div>
              <span className="eyebrow">Ready to act early?</span>
              <h2>Turn flood risk into a measurable response plan.</h2>
            </div>
            <button type="button" className="primary-button large">Request a demo</button>
          </div>
        </section>

        <section className="contact-section">
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
