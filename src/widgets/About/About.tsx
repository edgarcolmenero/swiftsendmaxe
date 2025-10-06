export function AboutSection() {
  return (
    <section id="about" className="about" aria-labelledby="about-title">
      <div className="about__container">
        <header className="about__head" data-reveal data-reveal-index="0">
          <h2 id="about-title" className="about__title">
            About <span className="about__title-highlight">SwiftSend</span>
          </h2>
        </header>

        <div className="about__inner">
          <div className="about__profile" data-reveal data-reveal-index="1">
            <div className="about__avatar">
              <img src="/me1.jpg" alt="Edgar Colmenero" loading="lazy" />
              <div className="about__orbit orbit-spin" aria-hidden="true">
                <span className="about__dot" />
                <span className="about__dot" />
                <span className="about__dot" />
                <span className="about__dot" />
              </div>
            </div>
            <h3 className="about__name">Edgar Colmenero</h3>
            <p className="about__role">Founder &amp; Full-Stack Developer</p>
            <p className="about__bio">
              Honors student active in STEM and TRIO Organization, studying at TCC, NCTC, and UTA. Employee of Adidas,
              Colmenero Consulting, and SwiftSend.
              <br />
              Bilingual (English/Spanish). Strong Passion for software that saves, empowers, and scales.
            </p>
            <div className="about__quote" data-reveal data-reveal-index="3">
              <p>&ldquo;Never Stay Satisfied.&rdquo;</p>
            </div>
          </div>

          <div className="about__achievements" data-reveal data-reveal-index="2">
            <h3 className="about__subhead" aria-hidden="true">
              Experience &amp; Achievements
            </h3>
            <ul className="achv-list" role="list">
              <li
                className="achv-card"
                data-variant="honors"
                tabIndex={0}
                role="listitem"
                aria-label="Honors Student, Academic Excellence"
              >
                <span className="achv-card__icon" aria-hidden="true">
                  <svg viewBox="0 0 32 32" role="img" aria-hidden="true">
                    <path d="M4 11.5 16 6l12 5.5-12 5.5-12-5.5Z" />
                    <path d="M8 15.5v5c3 2 13 2 16 0v-5" strokeLinecap="round" />
                  </svg>
                </span>
                <div className="achv-card__text">
                  <span className="achv-card__title">Honors Student</span>
                  <span className="achv-card__sub">Academic Excellence</span>
                </div>
                <span className="achv-card__status" aria-hidden="true" />
              </li>

              <li
                className="achv-card"
                data-variant="stem"
                tabIndex={0}
                role="listitem"
                aria-label="STEM Club, Active Member"
              >
                <span className="achv-card__icon" aria-hidden="true">
                  <svg viewBox="0 0 32 32" role="img" aria-hidden="true">
                    <circle cx="16" cy="11" r="5" />
                    <path d="M6 26c1.6-5.2 6.6-6.5 10-6.5S24.4 20.8 26 26" strokeLinecap="round" />
                    <path d="M6 11h4" strokeLinecap="round" />
                    <path d="M22 11h4" strokeLinecap="round" />
                  </svg>
                </span>
                <div className="achv-card__text">
                  <span className="achv-card__title">STEM Organization</span>
                  <span className="achv-card__sub">Engineering Scholar</span>
                </div>
                <span className="achv-card__status" aria-hidden="true" />
              </li>

              <li
                className="achv-card"
                data-variant="adidas"
                tabIndex={0}
                role="listitem"
                aria-label="Adidas, Team Member"
              >
                <span className="achv-card__icon" aria-hidden="true">
                  <svg viewBox="0 0 32 32" role="img" aria-hidden="true">
                    <rect x="6" y="7" width="20" height="18" rx="4" ry="4" />
                    <path d="M10 12h12" strokeLinecap="round" />
                    <path d="M10 17h12" strokeLinecap="round" />
                    <path d="M10 22h12" strokeLinecap="round" />
                  </svg>
                </span>
                <div className="achv-card__text">
                  <span className="achv-card__title">Adidas</span>
                  <span className="achv-card__sub">Brand Representative</span>
                </div>
                <span className="achv-card__status" aria-hidden="true" />
              </li>

              <li
                className="achv-card"
                data-variant="consult"
                tabIndex={0}
                role="listitem"
                aria-label="Colmenero Consulting, Founder &amp; Full-Stack Developer"
              >
                <span className="achv-card__icon" aria-hidden="true">
                  <svg viewBox="0 0 32 32" role="img" aria-hidden="true">
                    <path d="M16 5 6 12v9l10 6 10-6v-9L16 5Z" />
                    <path d="M16 14v9" strokeLinecap="round" />
                    <path d="M12.5 17.5h7" strokeLinecap="round" />
                  </svg>
                </span>
                <div className="achv-card__text">
                  <span className="achv-card__title">Colmenero Consulting</span>
                  <span className="achv-card__sub">COO &amp; Full-Stack Developer</span>
                </div>
                <span className="achv-card__status" aria-hidden="true" />
              </li>

              <li
                className="achv-card"
                data-variant="swiftsend"
                tabIndex={0}
                role="listitem"
                aria-label="SwiftSend, Founder"
              >
                <span className="achv-card__icon" aria-hidden="true">
                  <svg viewBox="0 0 32 32" role="img" aria-hidden="true">
                    <path d="M8 22.5c4-6 8-6.5 16-12.5l-5.5 12h5L16 27l3.5-7h-6L8 22.5Z" />
                  </svg>
                </span>
                <div className="achv-card__text">
                  <span className="achv-card__title">SwiftSend</span>
                  <span className="achv-card__sub">Founder</span>
                </div>
                <span className="achv-card__status" aria-hidden="true" />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
