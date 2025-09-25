(function () {
  const initPortfolio = () => {
    const section = document.getElementById('portfolio');
    if (!section) return;

    const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const prefersReducedMotion = () => reduceMotionQuery.matches;

    const cards = Array.from(section.querySelectorAll('.pf-card'));
    const title = section.querySelector('.portfolio__title');
    const lede = section.querySelector('.portfolio__lede');
    const revealables = [title, lede, ...cards].filter(Boolean);

    if (!revealables.length) return;

    section.classList.add('is-enhanced');

    const STAGGER_STEP = 0.07; // seconds
    revealables.forEach((element, index) => {
      element.style.setProperty('--io-delay', `${(index * STAGGER_STEP).toFixed(2)}s`);
    });

    const FILL_BASE_DELAY = 140;
    const FILL_STAGGER_MS = 70;

    cards.forEach((card, index) => {
      if (!card.hasAttribute('tabindex')) {
        card.tabIndex = 0;
      }
      card.setAttribute('role', 'group');
      card.dataset.fillDelay = String(index * FILL_STAGGER_MS);
    });

    const pending = new Set(revealables);

    const handleIntersection = (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const target = entry.target;
        target.classList.add('is-inview');
        pending.delete(target);
        observer.unobserve(target);

        if (target.classList.contains('pf-card')) {
          const card = target;
          if (card.classList.contains('is-filled')) return;

          const delay = Number(card.dataset.fillDelay || 0);

          if (prefersReducedMotion()) {
            card.classList.add('is-filled');
          } else {
            window.setTimeout(() => {
              card.classList.add('is-filled');
            }, FILL_BASE_DELAY + delay);
          }
        }
      });

      if (!pending.size) {
        observer.disconnect();
      }
    };

    const createObserver = () => new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: '0px 0px -12% 0px',
      threshold: 0.35,
    });

    let observer = createObserver();

    const observePending = () => {
      pending.forEach((element) => observer.observe(element));
    };

    observePending();

    document.addEventListener(
      'visibilitychange',
      () => {
        if (document.hidden) {
          observer.disconnect();
        } else if (pending.size) {
          observer = createObserver();
          observePending();
        }
      },
      { passive: true }
    );

    const toggleHot = (card, state) => {
      if (prefersReducedMotion()) {
        if (!state) {
          card.classList.remove('is-hot');
        }
        return;
      }
      card.classList.toggle('is-hot', state);
    };

    cards.forEach((card) => {
      card.addEventListener('mouseenter', () => toggleHot(card, true));
      card.addEventListener('mouseleave', () => toggleHot(card, false));

      card.addEventListener('focusin', () => toggleHot(card, true));
      card.addEventListener('focusout', (event) => {
        if (!card.contains(event.relatedTarget)) {
          toggleHot(card, false);
        }
      });
    });

    const fillExisting = () => {
      if (!prefersReducedMotion()) return;
      cards.forEach((card) => {
        card.classList.remove('is-hot');
        if (card.classList.contains('is-inview')) {
          card.classList.add('is-filled');
        }
      });
    };

    if (typeof reduceMotionQuery.addEventListener === 'function') {
      reduceMotionQuery.addEventListener('change', fillExisting);
    } else if (typeof reduceMotionQuery.addListener === 'function') {
      reduceMotionQuery.addListener(fillExisting);
    }

    fillExisting();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPortfolio, { once: true });
  } else {
    initPortfolio();
  }
})();
