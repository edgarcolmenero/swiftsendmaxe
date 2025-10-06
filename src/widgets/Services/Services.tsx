interface Service {
  id: string;
  accent: string;
  title: string;
  copy: string;
  icon: JSX.Element;
}

const SERVICES: Service[] = [
  {
    id: 'fullstack',
    accent: 'fullstack',
    title: 'Full-Stack Development',
    copy: 'APIs, apps, dashboards, admin portals.',
    icon: (
      <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
        <rect x="3" y="5" width="18" height="11" rx="1.8" ry="1.8" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M2.75 17h18.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M8.5 19.75h7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'data',
    accent: 'data',
    title: 'Data Engineering',
    copy: 'Pipelines, warehouses, metrics, and clean dashboards.',
    icon: (
      <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
        <ellipse cx="12" cy="6.5" rx="7.5" ry="3.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M4.5 6.5v6c0 1.93 3.36 3.5 7.5 3.5s7.5-1.57 7.5-3.5v-6" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M4.5 12.2c0 1.93 3.36 3.5 7.5 3.5s7.5-1.57 7.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    ),
  },
  {
    id: 'ai',
    accent: 'ai',
    title: 'AI Automations & Agents',
    copy: 'Voice + chatbots, intake copilots, smart workflows.',
    icon: (
      <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
        <path
          d="M9.75 4.5c-2.35 0-4.25 1.9-4.25 4.25 0 1.9-1.25 2.9-1.25 4.6 0 2.7 2.2 4.9 4.9 4.9h1.85c.83 0 1.5.67 1.5 1.5v.25"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M14.25 4.5c2.35 0 4.25 1.9 4.25 4.25 0 1.9 1.25 2.9 1.25 4.6 0 2.7-2.2 4.9-4.9 4.9H13c-.83 0-1.5.67-1.5 1.5v.25"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <circle cx="9.75" cy="8.5" r="1" fill="currentColor" />
        <circle cx="14.25" cy="8.5" r="1" fill="currentColor" />
        <path d="M9 12.5c.4.6 1.1 1 2 1s1.6-.4 2-1" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'swiftpay',
    accent: 'swiftpay',
    title: 'SwiftPay Systems',
    copy: 'Fee-smart checkouts, subscriptions, and ACH routing — keep more of every dollar.',
    icon: (
      <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
        <rect x="3" y="5" width="18" height="13" rx="2" ry="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M3 10.5h18" stroke="currentColor" strokeWidth="1.6" />
        <rect x="6.5" y="12.5" width="5" height="2.5" rx="1.2" fill="currentColor" />
        <path d="M16.5 13.75h2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'marketing',
    accent: 'marketing',
    title: 'Digital Marketing',
    copy: 'Campaigns, funnels, ads, analytics → grow smarter.',
    icon: (
      <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
        <path
          d="M4 16.5 9.5 11l3.5 3.5 5-5.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M15 8h3v3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M4 19h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'growth',
    accent: 'growth',
    title: 'Digital Growth (SEO & CRM)',
    copy: 'SEO, CRM wiring, landing pages, reporting.',
    icon: (
      <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
        <circle cx="10" cy="10" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="m13.5 13.5 5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M8.75 9.75h2.5M10 8.5v2.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
];

export function ServicesSection() {
  return (
    <section id="services" className="services">
      <div className="services__inner">
        <header className="services__head">
          <h2 className="services__title">
            What We <span className="grad-word">Build</span>
          </h2>
          <p className="services__lede">Comprehensive solutions for modern digital challenges</p>
        </header>

        <div className="services__grid">
          {SERVICES.map((service) => (
            <article key={service.id} className="service-card" data-accent={service.accent} tabIndex={0}>
              <div className="service-card__icon" aria-hidden="true">
                {service.icon}
              </div>
              <h3 className="service-card__title">
                <span className="service-card__title-text">{service.title}</span>
              </h3>
              <p className="service-card__copy">{service.copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
