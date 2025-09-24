(() => {
  'use strict';

  const section = document.getElementById('services');
  if (!section) return;

  const highlight = section.querySelector('.highlight-ring');
  const cards = Array.from(section.querySelectorAll('.service-card'));
  if (!highlight || cards.length === 0) return;

  const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  let prefersReduced = reduceMotionQuery.matches;

  const positioningRoot = highlight.offsetParent instanceof HTMLElement
    ? highlight.offsetParent
    : section;

  let activeCard = null;

  const isElement = (value) => value instanceof Element;

  const setPosition = (card) => {
    const cardRect = card.getBoundingClientRect();
    const rootRect = positioningRoot.getBoundingClientRect();
    const x = cardRect.left + cardRect.width / 2 - rootRect.left;
    const y = cardRect.top + cardRect.height / 2 - rootRect.top;

    highlight.style.setProperty('--x', `${x}px`);
    highlight.style.setProperty('--y', `${y}px`);
  };

  const showHighlight = (card) => {
    activeCard = card;
    setPosition(card);
    highlight.classList.add('is-active');
    highlight.removeAttribute('aria-hidden');
  };

  const hideHighlight = () => {
    activeCard = null;
    highlight.classList.remove('is-active');
    highlight.setAttribute('aria-hidden', 'true');
  };

  const handleEnter = (event) => {
    if (prefersReduced && event.type === 'mouseenter') return;
    showHighlight(event.currentTarget);
  };

  const handleLeave = (event) => {
    const nextTarget = event.relatedTarget;
    if (isElement(nextTarget) && (nextTarget === highlight || nextTarget.closest('.service-card')))
      return;

    hideHighlight();
  };

  const handleBlur = (event) => {
    const next = event.relatedTarget;
    if (isElement(next) && next.closest('.service-card')) return;

    hideHighlight();
  };

  const handleMotionChange = (event) => {
    prefersReduced = event.matches;

    if (prefersReduced) {
      if (!section.querySelector('.service-card:focus')) hideHighlight();
      return;
    }

    const focusedCard = section.querySelector('.service-card:focus');
    if (focusedCard) {
      showHighlight(focusedCard);
    } else if (activeCard) {
      showHighlight(activeCard);
    }
  };

  if (typeof reduceMotionQuery.addEventListener === 'function') {
    reduceMotionQuery.addEventListener('change', handleMotionChange);
  } else if (typeof reduceMotionQuery.addListener === 'function') {
    reduceMotionQuery.addListener(handleMotionChange);
  }

  cards.forEach((card) => {
    card.addEventListener('mouseenter', handleEnter);
    card.addEventListener('focus', handleEnter);
    card.addEventListener('mouseleave', handleLeave);
    card.addEventListener('blur', handleBlur);
  });

  section.addEventListener('mouseleave', (event) => {
    const nextTarget = event.relatedTarget;
    if (isElement(nextTarget) && section.contains(nextTarget)) return;

    hideHighlight();
  });

  hideHighlight();
})();
