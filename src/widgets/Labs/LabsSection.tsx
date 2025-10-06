import { useMemo } from 'react';
import type { LabExperiment } from '@entities/lab';
import { useUrlState } from '@app/providers/url-state';

const LABS: LabExperiment[] = [
  {
    id: 'swiftpay-mini',
    title: 'SwiftPay Mini',
    status: 'beta',
    description: 'Lightweight checkout for high-fee industries with ACH-first flows.',
    tags: ['payments', 'checkout'],
  },
  {
    id: 'ai-intake',
    title: 'AI Intake Copilot',
    status: 'alpha',
    description: 'Conversational bot that qualifies leads and syncs to your CRM instantly.',
    tags: ['ai', 'automation'],
  },
  {
    id: 'realtime-dash',
    title: 'Realtime Growth Dashboard',
    status: 'beta',
    description: 'Blends marketing, sales, and ops metrics into a single live command center.',
    tags: ['analytics', 'dashboard'],
  },
];

const STATUS_LABEL: Record<LabExperiment['status'], string> = {
  alpha: 'Alpha',
  beta: 'Beta',
  released: 'Released',
};

export function LabsSection() {
  const { get } = useUrlState();
  const filter = get('labs');

  const items = useMemo(() => {
    if (!filter) return LABS;
    const [key, value] = filter.split(':');
    if (key === 'status') {
      return LABS.filter((lab) => lab.status === value);
    }
    return LABS;
  }, [filter]);

  return (
    <section id="labs" className="labs-section" aria-labelledby="labs-title">
      <div className="labs-backdrop" aria-hidden="true" />
      <div className="labs-inner">
        <div className="labs-stars" aria-hidden="true">
          <div className="labs-orb" data-labs-orb aria-hidden="true" />
        </div>
        <header className="labs-head">
          <h2 id="labs-title" className="labs-title" data-reveal data-reveal-index="0">
            SwiftSend <span className="labs-title-gradient">Labs</span>
          </h2>
          <div className="labs-subtitle" data-reveal data-reveal-index="1">
            <p>Affordable, Personalized, Innovative</p>
            <p>Labs = testing ground for affordable experiments clients can actually use.</p>
          </div>
        </header>

        <ul className="labs-grid" role="list" data-labs-grid>
          {items.map((lab, index) => (
            <li key={lab.id} data-reveal data-reveal-index={index + 2}>
              <article className="lab-card" data-status={lab.status}>
                <header className="lab-card__head">
                  <span className="lab-card__status">{STATUS_LABEL[lab.status]}</span>
                  <h3 className="lab-card__title">{lab.title}</h3>
                </header>
                <p className="lab-card__desc">{lab.description}</p>
                <ul className="lab-card__tags" role="list">
                  {lab.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              </article>
            </li>
          ))}
        </ul>

        <div className="labs-beta-cta" data-reveal data-reveal-index="8">
          <a className="labs-beta-button" href="#contact">
            Join the Labs Beta Program
          </a>
        </div>
      </div>
    </section>
  );
}
