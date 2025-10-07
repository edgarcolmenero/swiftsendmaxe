const footer = document.querySelector('[data-footer]');

if (footer) {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const reduceMotion = () => prefersReducedMotion.matches;

  const socials = footer.querySelectorAll('.f-icn');
  const hoverHandlers = [];

  socials.forEach((button) => {
    const enter = () => button.classList.add('is-hover');
    const leave = () => button.classList.remove('is-hover');
    button.addEventListener('mouseenter', enter);
    button.addEventListener('mouseleave', leave);
    button.addEventListener('focus', enter);
    button.addEventListener('blur', leave);
    hoverHandlers.push({ button, enter, leave });
  });

  let revealObserver;
  const revealTargets = footer.querySelectorAll('.footer__inner > *, .footer__bar');

  function enableReveal() {
    if (!revealTargets.length) return;

    if (reduceMotion()) {
      footer.removeAttribute('data-anim-ready');
      revealTargets.forEach((target) => target.classList.add('is-visible'));
      return;
    }

    footer.setAttribute('data-anim-ready', '');
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver?.unobserve(entry.target);
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -40px 0px' });

    revealTargets.forEach((target) => {
      revealObserver?.observe(target);
    });
  }

  enableReveal();

  const handleMotionChange = () => {
    revealObserver?.disconnect();
    revealTargets.forEach((target) => target.classList.remove('is-visible'));
    if (reduceMotion()) {
      footer.removeAttribute('data-anim-ready');
    }
    enableReveal();
  };

  if (typeof prefersReducedMotion.addEventListener === 'function') {
    prefersReducedMotion.addEventListener('change', handleMotionChange);
  } else if (typeof prefersReducedMotion.addListener === 'function') {
    prefersReducedMotion.addListener(handleMotionChange);
  }

  function cleanup() {
    hoverHandlers.forEach(({ button, enter, leave }) => {
      button.removeEventListener('mouseenter', enter);
      button.removeEventListener('mouseleave', leave);
      button.removeEventListener('focus', enter);
      button.removeEventListener('blur', leave);
    });
    revealObserver?.disconnect();
    if (typeof prefersReducedMotion.removeEventListener === 'function') {
      prefersReducedMotion.removeEventListener('change', handleMotionChange);
    } else if (typeof prefersReducedMotion.removeListener === 'function') {
      prefersReducedMotion.removeListener(handleMotionChange);
    }
  }

  window.addEventListener('pagehide', cleanup, { once: true });
}

export {};