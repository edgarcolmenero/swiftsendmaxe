const section = document.querySelector('#portfolio');

if (!section) {
  // Section not present on this page; nothing to enhance.
} else {
  const initPortfolio = () => {
    const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const cards = Array.from(section.querySelectorAll('.pf-card'));
    const head = section.querySelector('.portfolio__head');
    const cta = section.querySelector('.portfolio__cta');
    const revealables = [head, ...cards, cta].filter(Boolean);

    if (!revealables.length) {
      return;
    }

    section.classList.add('is-enhanced');

    const STAGGER = 0.08;
    revealables.forEach((element, index) => {
      const delay = Math.min(index * STAGGER, 0.56);
      element.style.setProperty('--io-delay', `${delay.toFixed(2)}s`);
    });

    cards.forEach((card) => {
      if (!card.hasAttribute('tabindex')) {
        card.tabIndex = 0;
      }
      card.setAttribute('role', 'group');
    });

    const pending = new Set(revealables);

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -12% 0px',
      threshold: 0.35,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const target = entry.target;
        target.classList.add('is-inview');
        pending.delete(target);
        observer.unobserve(target);
      });
    }, observerOptions);

    pending.forEach((element) => observer.observe(element));

    const handleVisibility = () => {
      if (document.hidden) {
        observer.disconnect();
      } else {
        pending.forEach((element) => observer.observe(element));
      }
    };

    document.addEventListener('visibilitychange', handleVisibility, { passive: true });

    const handleMotionChange = () => {
      // Reserved for future motion-specific hooks; CSS currently handles the visuals.
    };

    if (typeof reduceMotionQuery.addEventListener === 'function') {
      reduceMotionQuery.addEventListener('change', handleMotionChange);
    } else if (typeof reduceMotionQuery.addListener === 'function') {
      reduceMotionQuery.addListener(handleMotionChange);
    }

    const toggleHot = (card, state) => {
      if (state) {
        card.classList.add('is-hot');
      } else {
        card.classList.remove('is-hot');
      }
    };

    cards.forEach((card) => {
      card.addEventListener('pointerenter', () => toggleHot(card, true));
      card.addEventListener('pointerleave', () => toggleHot(card, false));
      card.addEventListener('pointercancel', () => toggleHot(card, false));

      card.addEventListener('focusin', () => toggleHot(card, true));
      card.addEventListener('focusout', (event) => {
        if (!card.contains(event.relatedTarget)) {
          toggleHot(card, false);
        }
      });
    });
  };

  initPortfolio();
}
