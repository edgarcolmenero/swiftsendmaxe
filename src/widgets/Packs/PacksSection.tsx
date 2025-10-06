import type { Pack } from '@entities/pack';
import type { Addon } from '@entities/addon';
import { useContactEstimator } from '@features/useContactEstimator';

const PACKS: Pack[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: '$2,999',
    cadence: 'one-time',
    description: 'Perfect for businesses getting online',
    features: ['Industry-specific website', 'CMS basics', 'Contact forms', 'Mobile responsive', '3 months support'],
    accent: 'starter',
  },
  {
    id: 'builder',
    name: 'Builder',
    price: '$7,999',
    cadence: 'project',
    description: 'Advanced functionality and integrations',
    features: ['Custom APIs', 'Admin dashboards', 'CRM integration', 'Payment processing', 'Advanced analytics', '6 months support'],
    accent: 'builder',
    featured: true,
    badge: 'Most Popular',
  },
  {
    id: 'engine',
    name: 'Engine',
    price: '$15,999',
    cadence: 'project',
    description: 'Data-driven enterprise solutions',
    features: ['Data pipelines', 'Data warehouses', 'BI dashboards', 'Real-time analytics', 'Machine learning', '12 months support'],
    accent: 'engine',
  },
  {
    id: 'growth',
    name: 'Growth',
    price: '$12,999',
    cadence: 'campaign',
    description: 'Complete digital marketing solution',
    features: ['SEO optimization', 'Lead generation flows', 'Fee-smart checkout', 'Marketing automation', 'Analytics & reporting', 'Ongoing optimization'],
    accent: 'growth',
  },
];

const ADDONS: Addon[] = [
  { id: 'ai', name: 'AI Bot', price: '$1,999', accent: 'ai' },
  { id: 'swiftpay', name: 'SwiftPay Mini', price: '$999', accent: 'swiftpay' },
  { id: 'app', name: 'App Shell', price: '$3,999', accent: 'app' },
  { id: 'devops', name: 'DevOps Setup', price: '$2,499', accent: 'devops' },
];

const getHeaderOffset = () => {
  const value = getComputedStyle(document.documentElement).getPropertyValue('--ss-header-height');
  const parsed = Number.parseFloat(value.replace('px', ''));
  return Number.isFinite(parsed) ? parsed : 80;
};

const scrollToContact = () => {
  const target = document.getElementById('contact');
  if (!target) return;
  const offset = getHeaderOffset();
  const y = target.getBoundingClientRect().top + window.scrollY - offset + 1;
  window.scrollTo({ top: y, behavior: 'smooth' });
};

export function PacksSection() {
  const { selectedPack, selectPack } = useContactEstimator();

  return (
    <section id="packs" className="packs" aria-labelledby="packs-title" data-packs-section>
      <div className="packs__inner">
        <header className="packs__head" data-reveal data-reveal-index="0">
          <h2 id="packs-title" className="packs__title">
            Choose Your <span className="grad-word">Pack</span>
          </h2>
          <p className="packs__lede">Transparent pricing for every stage of your digital journey</p>
        </header>

        <ul className="packs__grid" role="list" data-packs-grid data-reveal data-reveal-index="1">
          {PACKS.map((pack) => {
            const isSelected = selectedPack === pack.id;
            return (
              <li key={pack.id}>
                <article
                  className={`pack${pack.featured ? ' is-featured' : ''}${isSelected ? ' is-active' : ''}`}
                  data-accent={pack.accent}
                  aria-labelledby={`pack-${pack.id}-title`}
                  aria-describedby={`pack-${pack.id}-price pack-${pack.id}-desc`}
                  aria-label={pack.featured ? 'Most Popular plan' : undefined}
                >
                  {pack.badge && (
                    <div className="pack__badge" aria-hidden="true">
                      {pack.badge}
                    </div>
                  )}
                  <div className="pack__icon" aria-hidden="true">
                    <svg viewBox="0 0 28 28" width="28" height="28" role="img" aria-hidden="true">
                      <path d="M4 18.5 11.5 11l4 4L24 6.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <h3 id={`pack-${pack.id}-title`} className="pack__title">
                    {pack.name}
                  </h3>
                  <p id={`pack-${pack.id}-desc`} className="pack__desc">
                    {pack.description}
                  </p>
                  <p id={`pack-${pack.id}-price`} className="pack__price">
                    <span className="val">{pack.price}</span> <span className="unit">/{pack.cadence}</span>
                  </p>
                  <ul className="pack__list" role="list">
                    {pack.features.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                  <button
                    className={`pack__cta${pack.featured ? ' pack__cta--primary' : ''}`}
                    type="button"
                    onClick={() => {
                      selectPack(pack.name);
                      scrollToContact();
                    }}
                    aria-label={`Get started: ${pack.name}, ${pack.price} per ${pack.cadence}`}
                  >
                    Get Started
                  </button>
                </article>
              </li>
            );
          })}
        </ul>

        <section className="addons" aria-labelledby="addons-title" data-reveal data-reveal-index="2">
          <header className="addons__head">
            <h3 id="addons-title" className="addons__title">
              Add-ons
            </h3>
            <p className="addons__lede">Enhance your pack with additional features</p>
          </header>

          <ul className="addons__grid" role="list">
            {ADDONS.map((addon) => (
              <li key={addon.id}>
                <article className="addon" data-accent={addon.accent}>
                  <h4 className="addon__title">{addon.name}</h4>
                  <p className="addon__price">{addon.price}</p>
                </article>
              </li>
            ))}
          </ul>

          <div className="addons__ctaRow">
            <p className="addons__prompt">Need a custom solution? Let’s talk about your specific requirements.</p>
            <a className="addons__cta" href="#contact" aria-label="Request a custom quote" onClick={smoothScroll}>
              Get Custom Quote
            </a>
          </div>
        </section>
      </div>
    </section>
  );
}
