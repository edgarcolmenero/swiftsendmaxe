import { useProcessSteps } from '@features/useProcessSteps';
import type { ProcessStep } from '@entities/processStep';

const STEPS: ProcessStep[] = [
  {
    id: 'discover',
    order: 1,
    title: 'Align on the mission',
    subtitle: 'Discover',
    description: 'Stakeholder interviews, metrics, and constraints shape an achievable roadmap.',
    bulletPoints: ['Business goals + constraints mapping', 'Technical + data audit', 'Roadmap + estimate buy-in'],
  },
  {
    id: 'design',
    order: 2,
    title: 'Design the experience',
    subtitle: 'Design',
    description: 'Collaborative design sprints align brand, UX, and product architecture.',
    bulletPoints: ['UX/UI explorations', 'Design systems + prototypes', 'Experiment-driven validation'],
  },
  {
    id: 'build',
    order: 3,
    title: 'Ship in integrated sprints',
    subtitle: 'Build',
    description: 'Engineers, analysts, and marketers build together with QA at every stage.',
    bulletPoints: ['Agile sprints with demos', 'Data instrumentation as we build', 'Secure and scalable releases'],
  },
  {
    id: 'launch',
    order: 4,
    title: 'Launch & optimize',
    subtitle: 'Launch',
    description: 'Deploy, measure, and iterate to keep the momentum strong post-launch.',
    bulletPoints: ['Go-live and training', 'Performance monitoring', 'Growth loops + optimizations'],
  },
];

export function ProcessSection() {
  const { steps, activeId, activeIndex, progress, setActiveId, handleKeyDown } = useProcessSteps(STEPS);
  const activeStep = steps.find((step) => step.id === activeId) ?? steps[0];

  return (
    <section id="process" className="process" aria-labelledby="process-title" data-process-section>
      <div className="process-stars" aria-hidden="true" />
      <div className="process__inner">
        <header className="process__intro" data-reveal>
          <h2 id="process-title" className="process__title">
            How We <span className="grad-word">Work</span>
          </h2>
          <p className="process__lede">A streamlined process designed for efficiency and excellence</p>
        </header>

        <div className="process__layout" data-reveal>
          <div className="process__progress" aria-hidden="true">
            <div className="process__progress-head">
              <span className="process__progress-label">Progress</span>
              <span className="process__progress-value" data-process-progress-value>
                {progress}%
              </span>
            </div>
            <div className="process__progress-track" data-process-progress-track>
              <div className="process__progress-fill" data-process-progress-fill style={{ width: `${progress}%` }} />
              <span className="process__progress-indicator" data-process-progress-indicator style={{ left: `${progress}%` }} />
            </div>
            <div className="process__progress-stops">
              <span>0%</span>
              <span>25%</span>
              <span>50%</span>
              <span>75%</span>
              <span>100%</span>
            </div>
          </div>

          <div
            className="process__tilesRow"
            data-process-steps
            role="tablist"
            aria-label="SwiftSend delivery process"
            onKeyDown={(event) => handleKeyDown(event as unknown as React.KeyboardEvent<HTMLButtonElement>)}
          >
            {steps.map((step, index) => (
              <article key={step.id} className={`process__tile${step.id === activeId ? ' is-active' : ''}`} data-process-step data-step={step.id}>
                <button
                  className="process__tileButton"
                  id={`process-step-${step.id}`}
                  aria-controls="process-detail-card"
                  aria-selected={step.id === activeId}
                  tabIndex={step.id === activeId ? 0 : -1}
                  type="button"
                  onClick={() => setActiveId(step.id)}
                  data-index={index}
                  onKeyDown={handleKeyDown}
                >
                  <span className="process__tileBadge">
                    <span className="process__tileBadge-num" aria-hidden="true">
                      {String(step.order).padStart(2, '0')}
                    </span>
                    <span className="process__tileBadge-label">{step.subtitle}</span>
                  </span>
                  <span className="process__tileTitle">{step.title}</span>
                </button>
              </article>
            ))}
          </div>

          <div className="process__detail">
            <article
              className={`process-detail-card is-${activeStep.id}`}
              id="process-detail-card"
              data-process-detail
              role="tabpanel"
              aria-live="polite"
              aria-labelledby="process-detail-title"
            >
              <header className="process-detail-header">
                <span className="process-badge">
                  <span className="process-badge-num">{String(activeStep.order).padStart(2, '0')}</span>
                  <span className="process-badge-label">{activeStep.subtitle.toUpperCase()}</span>
                </span>
              </header>

              <h3 id="process-detail-title" className="process-detail-title">
                {activeStep.title}
              </h3>

              <p className="process-detail-body">{activeStep.description}</p>

              <ul className="process-detail-list">
                {activeStep.bulletPoints.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </article>
          </div>

          <aside className="process__cta" data-reveal>
            <div className="process__cta-text">
              <h3 className="process__cta-title">Ready to start your project?</h3>
            </div>
            <div className="process__cta-actions">
              <a className="process__cta-primary" href="#contact">
                Let’s Get Started
              </a>
              <a className="process__cta-link" href="#services">
                Explore Services
              </a>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
