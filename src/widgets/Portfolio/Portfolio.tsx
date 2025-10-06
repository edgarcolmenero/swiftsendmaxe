import { usePortfolioTints } from '@features/usePortfolioTints';

interface PortfolioCard {
  id: string;
  title: string;
  pill: string;
  image: string;
  problem: string;
  build: string;
  outcome: string;
  ctaLabel: string;
}

const CARDS: PortfolioCard[] = [
  {
    id: 'realtor',
    title: 'RealtorDemo',
    pill: 'Real Estate Platform',
    image: '/color1.jpg',
    problem: 'Traditional MLS listings with poor lead generation',
    build: 'Modern property search with integrated lead capture system',
    outcome: '+32% leads',
    ctaLabel: 'Open RealtorDemo case study',
  },
  {
    id: 'nailtech',
    title: 'NailTechDemo',
    pill: 'Beauty & Wellness',
    image: '/color2.jpg',
    problem: 'Manual booking process losing potential clients',
    build: 'Sleek booking system with integrated payments',
    outcome: 'Dark elegance meets functionality',
    ctaLabel: 'Open NailTechDemo case study',
  },
  {
    id: 'photographer',
    title: 'PhotographerDemo',
    pill: 'Creative Services',
    image: '/color3.jpg',
    problem: 'Cumbersome photo proofing and booking workflow',
    build: 'Streamlined gallery with integrated booking system',
    outcome: 'Creative-driven user experience',
    ctaLabel: 'Open PhotographerDemo case study',
  },
];

export function PortfolioSection() {
  usePortfolioTints();

  return (
    <section id="portfolio" className="portfolio" aria-labelledby="portfolio-title">
      <div className="portfolio__inner">
        <header className="portfolio__head">
          <h2 id="portfolio-title" className="portfolio__title">
            Work That <span className="grad">Stands Out</span>
          </h2>
          <p className="portfolio__lede">Real projects, real results, real impact.</p>
        </header>

        <div className="portfolio__grid">
          {CARDS.map((card) => (
            <article key={card.id} className="pf-card" data-key={card.id} data-portfolio-card>
              <div className="pf-card__media" aria-hidden="true">
                <img src={card.image} alt="" loading="lazy" />
                <span className="pf-card__pill">{card.pill}</span>
                <button className="pf-card__ext" type="button" aria-label={card.ctaLabel}>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M14 3h7v7h-2V6.41l-9.29 9.3-1.42-1.42 9.3-9.29H14V3zM5 5h6v2H7v10h10v-4h2v6H5V5z" />
                  </svg>
                </button>
              </div>
              <div className="pf-card__body">
                <h3 className="pf-card__title">{card.title}</h3>
                <p className="pf-card__row">
                  <span className="label label--problem">Problem:</span> {card.problem}
                </p>
                <p className="pf-card__row">
                  <span className="label label--build">Build:</span> {card.build}
                </p>
                <p className="pf-card__row">
                  <span className="label label--outcome">Outcome:</span> <span>{card.outcome}</span>
                  <span className="pf-card__trend" aria-hidden="true">
                    ▲
                  </span>
                </p>
                <div className="pf-card__bar">
                  <span className="pf-card__fill" />
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="portfolio__cta">
          <a className="portfolio__link" href="#">
            View All Projects
          </a>
          <div className="portfolio__cta-underline">
            <span className="fill" />
          </div>
        </div>
      </div>
    </section>
  );
}
