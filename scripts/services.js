(() => {
    'use strict';
  
    const section = document.getElementById('services');
    if (!section) return;
  
    const cards = Array.from(section.querySelectorAll('.service-card'));
    if (cards.length === 0) return;
  
    section.classList.add('is-enhanced');
  
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const supportsPE = 'PointerEvent' in window;
    const passive = { passive: true };
  
    // ---------- Reveal on view ----------
    const revealCard = (card) => {
      if (card.classList.contains('is-inview')) return;
      card.classList.add('is-inview', 'underline-active');
      card.style.removeProperty('--card-delay');
      setTimeout(() => card.classList.remove('underline-active'), 480);
    };
  
    cards.forEach((card, i) => {
      card.style.setProperty('--card-delay', `${i * 80}ms`);
    });
  
    let io = null;
    const startIO = () => {
      if (io) return;
      io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              revealCard(entry.target);
              io.unobserve(entry.target);
            }
          }
        },
        { threshold: 0.35, rootMargin: '0px 0px -10% 0px' }
      );
      cards.forEach((c) => !c.classList.contains('is-inview') && io.observe(c));
    };
    const stopIO = () => { if (io) { io.disconnect(); io = null; } };
  
    // ---------- Pointer glow (single rAF) ----------
    let activeCard = null;
    let rect = null;
    let lastPctX = 50, lastPctY = 40;
    let nextPctX = 50, nextPctY = 40;
    let needsFlush = false;
    let rafId = 0;
  
    const isFinePointer = (e) =>
      !e || !('pointerType' in e) || e.pointerType === 'mouse' || e.pointerType === 'pen';
  
    const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
  
    const measure = () => {
      if (activeCard) rect = activeCard.getBoundingClientRect();
    };
  
    const computePercent = (clientX, clientY) => {
      if (!rect) return;
      const x = clamp(((clientX - rect.left) / rect.width) * 100, 0, 100);
      const y = clamp(((clientY - rect.top) / rect.height) * 100, 0, 100);
      nextPctX = x; nextPctY = y;
      needsFlush = needsFlush || (Math.abs(nextPctX - lastPctX) > 0.2 || Math.abs(nextPctY - lastPctY) > 0.2);
      // keep rAF minimal churn
      if (!rafId) rafId = requestAnimationFrame(flush);
    };
  
    const flush = () => {
      rafId = 0;
      if (!activeCard || !needsFlush) return;
      needsFlush = false;
      lastPctX = nextPctX; lastPctY = nextPctY;
      activeCard.style.setProperty('--gx', `${lastPctX.toFixed(2)}%`);
      activeCard.style.setProperty('--gy', `${lastPctY.toFixed(2)}%`);
    };
  
    const beginTracking = (card, evt) => {
      if (activeCard === card) return;
      activeCard = card;
      card.classList.add('underline-active', 'is-hot'); // CSS may use .is-hot to add will-change
      measure();
      if (evt) computePercent(evt.clientX, evt.clientY);
    };
  
    const endTracking = () => {
      if (!activeCard) return;
      activeCard.classList.remove('underline-active', 'is-hot');
      activeCard.style.setProperty('--gx', '50%');
      activeCard.style.setProperty('--gy', '40%');
      activeCard = null;
      rect = null;
      needsFlush = false;
      if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }
    };
  
    // Event delegation on the section for fewer listeners
    const onEnter = (e) => {
      if (!isFinePointer(e)) return;
      const card = e.target.closest('.service-card');
      if (!card || !section.contains(card)) return;
      beginTracking(card, e);
    };
  
    const onMove = (e) => {
      if (!isFinePointer(e) || !activeCard) return;
      if (!rect) measure();
      computePercent(e.clientX, e.clientY);
    };
  
    const onLeave = (e) => {
      const related = e.relatedTarget;
      if (activeCard && (!related || !activeCard.contains(related))) {
        endTracking();
      }
    };
  
    const onCancel = () => endTracking();
  
    // Keyboard focus: consistent underline, no glow
    const onFocusIn = (e) => {
      const card = e.target.closest('.service-card');
      if (card) card.classList.add('underline-active');
    };
    const onFocusOut = (e) => {
      const card = e.target.closest('.service-card');
      if (card) card.classList.remove('underline-active');
    };
  
    // Attach delegated listeners (pointer or mouse)
    if (!reduceMotion.matches) {
      if (supportsPE) {
        section.addEventListener('pointerenter', onEnter, passive);
        section.addEventListener('pointermove', onMove, passive);
        section.addEventListener('pointerleave', onLeave);
        section.addEventListener('pointercancel', onCancel);
      } else {
        section.addEventListener('mouseenter', onEnter, true);
        section.addEventListener('mousemove', onMove, passive);
        section.addEventListener('mouseleave', onLeave, true);
      }
    }
  
    section.addEventListener('focusin', onFocusIn);
    section.addEventListener('focusout', onFocusOut);
  
    // Keep rect fresh on resize/scroll
    window.addEventListener('resize', () => activeCard && measure(), passive);
    window.addEventListener('scroll', () => activeCard && measure(), passive);
  
    // Reduced-motion: reveal immediately; skip observer
    const applyRM = () => {
      if (reduceMotion.matches) {
        stopIO();
        cards.forEach(revealCard);
        section.classList.add('reduced-motion');
      } else {
        section.classList.remove('reduced-motion');
        startIO();
      }
    };
    applyRM();
  
    if (typeof reduceMotion.addEventListener === 'function') {
      reduceMotion.addEventListener('change', applyRM);
    } else if (typeof reduceMotion.addListener === 'function') {
      reduceMotion.addListener(applyRM); // Safari
    }
  
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) { stopIO(); endTracking(); }
      else if (!reduceMotion.matches) startIO();
    });
  
    window.addEventListener('pagehide', () => { stopIO(); endTracking(); });
  })();
  
