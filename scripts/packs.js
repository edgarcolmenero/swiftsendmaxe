// scripts/packs.js
(() => {
  const section = document.querySelector('[data-packs-section]');
  if (!section) return;

  // Flag: JS enabled for this section
  document.body.classList.add('is-packs-js');

  // Respect reduced motion
  const mq = typeof window.matchMedia === 'function'
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : null;

  const syncReduced = (e) => {
    document.body.classList.toggle('is-packs-reduced', !!(e && e.matches));
  };

  if (mq) {
    syncReduced(mq);
    if (typeof mq.addEventListener === 'function') {
      mq.addEventListener('change', syncReduced);
    } else if (typeof mq.addListener === 'function') {
      mq.addListener(syncReduced);
    }
  }

  // Reveal-on-view
  const revealEls = Array.from(section.querySelectorAll('[data-reveal]'));
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries, obs) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            obs.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.16, rootMargin: '0px 0px -10% 0px' }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-in'));
  }

  // Hover/focus polish (lightweight, pointer-aware)
  const bindHover = (card) => {
    if (!card) return;
    const enter = () => card.classList.add('is-hover');
    const leave = () => card.classList.remove('is-hover');

    // Only bind pointer hover on fine pointers (avoid sticky hover on touch)
    if (window.matchMedia && window.matchMedia('(pointer:fine)').matches) {
      card.addEventListener('mouseenter', enter, { passive: true });
      card.addEventListener('mouseleave', leave, { passive: true });
    }
    // Keyboard focus support
    card.addEventListener('focusin', enter);
    card.addEventListener('focusout', (e) => {
      if (!card.contains(e.relatedTarget)) leave();
    });
  };

  section.querySelectorAll('.pack').forEach(bindHover);
  section.querySelectorAll('.addon').forEach(bindHover);

  // Normalize CTAs to contact anchor
  section.querySelectorAll('.pack__cta, .addons__cta').forEach((a) => {
    if (a.getAttribute('href') !== '#contact') a.setAttribute('href', '#contact');
  });
})();
