(() => {
  'use strict';
  const section = document.getElementById('services');
  if (!section) return;

  const cards = Array.from(section.querySelectorAll('.service-card'));
  if (cards.length === 0) return;

  section.classList.add('is-enhanced');

  const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  const revealCard = (card) => {
    if (card.classList.contains('is-inview')) return;
    card.classList.add('is-inview');
    card.classList.add('underline-active');
    card.style.removeProperty('--card-delay');

    window.setTimeout(() => {
      card.classList.remove('underline-active');
    }, 480);
  };

  cards.forEach((card, index) => {
    card.style.setProperty('--card-delay', `${index * 80}ms`);
  });

  const activateUnderline = (card, state) => {
    card.classList.toggle('underline-active', state);
  };

  cards.forEach((card) => {
    card.addEventListener('mouseenter', () => activateUnderline(card, true));
    card.addEventListener('mouseleave', () => activateUnderline(card, false));
    card.addEventListener('focus', () => activateUnderline(card, true));
    card.addEventListener('blur', () => activateUnderline(card, false));
  });

  let observer = null;

  const startObserving = () => {
    if (observer) return;
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          revealCard(entry.target);
          observer && observer.unobserve(entry.target);
        });
      },
      { threshold: 0.4, rootMargin: '0px 0px -10% 0px' }
    );

    cards.forEach((card) => {
      if (!card.classList.contains('is-inview')) {
        observer.observe(card);
      }
    });
  };

  const stopObserving = () => {
    if (!observer) return;
    observer.disconnect();
    observer = null;
  };

  if (reduceMotionQuery.matches) {
    cards.forEach(revealCard);
  } else {
    startObserving();
  }

  const handleMotionChange = (event) => {
    if (event.matches) {
      stopObserving();
      cards.forEach(revealCard);
    } else {
      startObserving();
    }
  };

  if (typeof reduceMotionQuery.addEventListener === 'function') {
    reduceMotionQuery.addEventListener('change', handleMotionChange);
  } else if (typeof reduceMotionQuery.addListener === 'function') {
    reduceMotionQuery.addListener(handleMotionChange);
  }
})();
