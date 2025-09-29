const aboutSection = document.querySelector('#about');

if (aboutSection) {
  document.body.classList.add('is-about-js');

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const orbit = aboutSection.querySelector('.about__orbit');

  const applyMotionPreference = (shouldReduce) => {
    if (!orbit) return;
    if (shouldReduce) {
      orbit.classList.remove('orbit-spin');
      aboutSection.classList.add('about--breathing');
    } else {
      if (!orbit.classList.contains('orbit-spin')) {
        orbit.classList.add('orbit-spin');
      }
      aboutSection.classList.remove('about--breathing');
    }
  };

  applyMotionPreference(prefersReduced.matches);

  if (typeof prefersReduced.addEventListener === 'function') {
    prefersReduced.addEventListener('change', (event) => {
      applyMotionPreference(event.matches);
    });
  } else if (typeof prefersReduced.addListener === 'function') {
    prefersReduced.addListener((event) => applyMotionPreference(event.matches));
  }

  const revealTargets = Array.from(aboutSection.querySelectorAll('[data-reveal]'));

  if (revealTargets.length) {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            observer.unobserve(entry.target);

            const index = Number(entry.target.dataset.revealIndex || 0);
            const delay = Math.min(120 + index * 80, 420);

            window.setTimeout(() => {
              entry.target.classList.add('is-in');
            }, delay);
          });
        },
        {
          threshold: 0.25,
          rootMargin: '0px 0px -10%',
        }
      );

      revealTargets.forEach((target) => observer.observe(target));
    } else {
      revealTargets.forEach((target) => target.classList.add('is-in'));
    }
  }

  const cards = Array.from(aboutSection.querySelectorAll('.achv-card'));
  const ACTIVE_CLASS = 'is-pressed';

  cards.forEach((card) => {
    if (!card.hasAttribute('tabindex')) {
      card.tabIndex = 0;
    }

    card.addEventListener('keydown', (event) => {
      const { key } = event;
      if (key !== 'Enter' && key !== ' ') return;
      event.preventDefault();
      card.classList.add(ACTIVE_CLASS);
      window.setTimeout(() => {
        card.classList.remove(ACTIVE_CLASS);
      }, 220);
    });
  });
}
