const packsSection = document.querySelector('[data-packs-section]');

if (!packsSection) {
  // No packs section present; abort.
} else {
  document.body.classList.add('is-packs-js');

  const revealTargets = Array.from(packsSection.querySelectorAll('[data-reveal]'));
  const isReducedMotionQuery = typeof window.matchMedia === 'function' ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;

  const setReducedMotionState = (event) => {
    if (event.matches) {
      document.body.classList.add('is-packs-reduced');
    } else {
      document.body.classList.remove('is-packs-reduced');
    }
  };

  if (isReducedMotionQuery) {
    setReducedMotionState(isReducedMotionQuery);

    if (typeof isReducedMotionQuery.addEventListener === 'function') {
      isReducedMotionQuery.addEventListener('change', setReducedMotionState);
    } else if (typeof isReducedMotionQuery.addListener === 'function') {
      isReducedMotionQuery.addListener(setReducedMotionState);
    }
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            obs.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.18,
      },
    );

    revealTargets.forEach((target) => observer.observe(target));
  } else {
    revealTargets.forEach((target) => target.classList.add('is-in'));
  }

  const setHoverState = (root, itemSelector) => {
    if (!root) return;

    const toggleHover = (target, shouldAdd) => {
      if (!target) return;
      target.classList[shouldAdd ? 'add' : 'remove']('is-hover');
    };

    root.addEventListener('mouseover', (event) => {
      const card = event.target.closest(itemSelector);
      if (!card || !root.contains(card)) return;
      toggleHover(card, true);
    });

    root.addEventListener('mouseout', (event) => {
      const card = event.target.closest(itemSelector);
      if (!card || !root.contains(card)) return;
      const related = event.relatedTarget;
      if (related && card.contains(related)) {
        return;
      }
      toggleHover(card, false);
    });

    root.addEventListener('focusin', (event) => {
      const card = event.target.closest(itemSelector);
      toggleHover(card, true);
    });

    root.addEventListener('focusout', (event) => {
      const card = event.target.closest(itemSelector);
      if (!card) return;
      const nextFocus = event.relatedTarget;
      if (nextFocus && card.contains(nextFocus)) {
        return;
      }
      toggleHover(card, false);
    });
  };

  setHoverState(packsSection.querySelector('[data-packs-grid]'), '.pack');
  setHoverState(packsSection.querySelector('.addons__grid'), '.addon');

  const ctas = packsSection.querySelectorAll('.pack__cta, .addons__cta');
  ctas.forEach((cta) => {
    if (cta.getAttribute('href') !== '#contact') {
      cta.setAttribute('href', '#contact');
    }
  });
}
