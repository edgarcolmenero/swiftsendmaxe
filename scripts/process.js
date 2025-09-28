// FIXED: Robust reveal, progress gating, ARIA polish, and guards – no markup changes required.

/* ---------------------------------------------
   Static step content (unchanged)
--------------------------------------------- */
const STEPS = {
  discover: {
    num: '01',
    label: 'DISCOVER',
    title: 'Align on the mission',
    body: 'Stakeholder interviews, metrics, and constraints shape an achievable roadmap.',
    bullets: [
      'Business goals + constraints mapping',
      'Technical + data audit',
      'Roadmap + estimate buy-in',
    ],
    hue: 210,
  },
  design: {
    num: '02',
    label: 'DESIGN',
    title: 'Design the experience',
    body: 'Flows, prototypes, and system design make the product tangible fast.',
    bullets: ['UX flows + prototypes', 'System design & API contracts', 'Feasibility + fast iterations'],
    hue: 276,
  },
  build: {
    num: '03',
    label: 'BUILD',
    title: 'Ship in integrated sprints',
    body: 'Full-stack teams deliver production-ready slices with QA and automation baked in.',
    bullets: ['Sprint slices to prod', 'Automated testing & CI', 'Observability from day one'],
    hue: 28,
  },
  launch: {
    num: '04',
    label: 'LAUNCH',
    title: 'Launch & optimize',
    body: 'We orchestrate go-live, train teams, and monitor performance to iterate quickly.',
    bullets: ['Go-live & training', 'KPIs & dashboards', 'Continuous optimization'],
    hue: 150,
  },
};

const STEP_ORDER = Object.keys(STEPS);
const PROGRESS_POINTS = [0, 25, 50, 75, 100];

/* ---------------------------------------------
   Utilities
--------------------------------------------- */
const safeRaf =
  typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function'
    ? window.requestAnimationFrame.bind(window)
    : (fn) => setTimeout(fn, 16);

const getDebugEnabled = () => {
  if (typeof window === 'undefined') return false;
  try {
    const params = new URLSearchParams(window.location.search);
    return params.get('debug') === '1';
  } catch {
    return false;
  }
};
const DEBUG_ENABLED = getDebugEnabled();
const debugLog = (...args) => { if (DEBUG_ENABLED) console.log('[process debug]', ...args); };
const debugWarn = (...args) => { if (DEBUG_ENABLED) console.warn('[process debug]', ...args); };

const ensureBodyClass = (className) => {
  if (typeof document === 'undefined') return false;
  const b = document.body;
  if (!b) return false;
  if (!b.classList.contains(className)) b.classList.add(className);
  return true;
};

if (DEBUG_ENABLED) {
  if (!ensureBodyClass('debug') && typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => ensureBodyClass('debug'), { once: true });
  }
}

/* ---------------------------------------------
   Main init
--------------------------------------------- */
const initProcess = () => {
  if (typeof document === 'undefined') return;

  const section = document.querySelector('[data-process-section]');
  if (!section) {
    console.warn('[process] Section root not found.');
    return;
  }

  // Gate reveal styles to JS sessions
  ensureBodyClass('is-process-js');
  section.classList.add('process--row-top');

  // Motion preference
  const reduceMotionQuery =
    typeof window !== 'undefined' && typeof window.matchMedia === 'function'
      ? window.matchMedia('(prefers-reduced-motion: reduce)')
      : null;
  const prefersReducedMotion = () => Boolean(reduceMotionQuery && reduceMotionQuery.matches);

  /* ---------------------------
     Query elements
  --------------------------- */
  const tablist = section.querySelector('[data-process-steps]');
  if (tablist) {
    tablist.setAttribute('role', 'tablist');
    tablist.setAttribute('aria-orientation', 'horizontal');
  } else {
    debugWarn('tablist missing');
  }

  const tileNodes = Array.from(section.querySelectorAll('[data-process-step]'));
  if (!tileNodes.length) {
    console.warn('[process] No process tiles found.');
    return;
  }

  const buttons = tileNodes.map((tile, idx) => {
    const btn = tile.querySelector('button, [role="tab"]');
    if (!btn) {
      console.warn('[process] Tile missing button', tile);
      return null;
    }
    // Normalize
    if (btn.tagName === 'BUTTON') btn.type = 'button'; else btn.setAttribute('type', 'button');
    btn.setAttribute('role', 'tab');
    btn.setAttribute('tabindex', '-1');
    btn.setAttribute('aria-selected', 'false');
    if (!btn.id) btn.id = `process-tab-${idx + 1}`;
    return btn;
  }).filter(Boolean);

  if (!buttons.length) {
    console.warn('[process] No interactive buttons within tiles.');
    return;
  }

  const detailCard = section.querySelector('[data-process-detail]');
  const detailElements = detailCard ? {
    badgeNum: detailCard.querySelector('.process-badge-num'),
    badgeLabel: detailCard.querySelector('.process-badge-label'),
    title: detailCard.querySelector('.process-detail-title'),
    body: detailCard.querySelector('.process-detail-body'),
    list: detailCard.querySelector('.process-detail-list'),
  } : null;

  // Progress widgets
  const progressRoot = section.querySelector('.process__progress');
  const progressTrack = progressRoot ? progressRoot.querySelector('[data-process-progress-track]') : null;
  const progressFill = progressRoot ? progressRoot.querySelector('[data-process-progress-fill]') : null;
  const progressIndicator = progressRoot ? progressRoot.querySelector('[data-process-progress-indicator]') : null;
  const progressValue = progressRoot ? progressRoot.querySelector('[data-process-progress-value]') : null;

  /* ---------------------------
     Helpers
  --------------------------- */
  const slugForTile = (tile, index) => {
    const stepAttr = tile.getAttribute('data-step');
    if (stepAttr && STEPS[stepAttr]) return stepAttr;
    const btn = buttons[index];
    if (btn && btn.id) {
      const m = btn.id.match(/process-step-(.+)$/);
      if (m && STEPS[m[1]]) return m[1];
    }
    return STEP_ORDER[index] || STEP_ORDER[0];
  };

  const slugs = tileNodes.map(slugForTile);

  // Paint per-tile hue custom property so CSS can style glows/gradients
  tileNodes.forEach((tile, i) => {
    tile.classList.add('process__tile');
    const data = STEPS[slugs[i]];
    if (data) tile.style.setProperty('--tile-hue', String(data.hue));
    // Also sync badge/title text in case markup shipped with placeholder
    const btn = buttons[i];
    if (btn && data) {
      const badgeNum = btn.querySelector('.process__tileBadge-num');
      const badgeLabel = btn.querySelector('.process__tileBadge-label');
      const title = btn.querySelector('.process__tileTitle');
      if (badgeNum) badgeNum.textContent = data.num;
      if (badgeLabel) badgeLabel.textContent = data.label;
      if (title) title.textContent = data.title;
    }
  });

  // Detail card ARIA
  if (detailCard) {
    if (!detailCard.id) detailCard.id = 'process-detail-card';
    detailCard.setAttribute('role', 'tabpanel');
    detailCard.setAttribute('tabindex', '0');
  }

  // Ensure ALL tabs reference the panel for SRs (not only active)
  if (detailCard) {
    buttons.forEach((btn) => btn.setAttribute('aria-controls', detailCard.id));
  }

  // Progress setter
  const setProgress = (percent, { immediate = false } = {}) => {
    if (!progressRoot) return;
    const apply = () => {
      progressRoot.style.setProperty('--process-progress', String(percent));
      if (progressFill) progressFill.style.width = `${percent}%`;
      if (progressIndicator) progressIndicator.style.left = `${percent}%`;
      if (progressValue) progressValue.textContent = `${percent}%`;
    };
    if (immediate || prefersReducedMotion()) apply();
    else safeRaf(apply);
  };

  const updateDetailCard = (slug, { animate = true } = {}) => {
    if (!detailCard || !detailElements) return;
    const data = STEPS[slug];
    if (!data) {
      debugWarn('missing step data for', slug);
      return;
    }

    // Swap animation
    if (animate && !prefersReducedMotion()) {
      detailCard.classList.remove('is-swapping');
      // Reflow to restart animation (safe)
      // eslint-disable-next-line no-unused-expressions
      detailCard.offsetWidth;
      detailCard.classList.add('is-swapping');
    }

    // Accent hue
    STEP_ORDER.forEach((s) => detailCard.classList.remove(`is-${s}`));
    detailCard.classList.add(`is-${slug}`);
    detailCard.style.setProperty('--step-hue', String(data.hue));

    // Content
    if (detailElements.badgeNum) detailElements.badgeNum.textContent = data.num;
    if (detailElements.badgeLabel) detailElements.badgeLabel.textContent = data.label;
    if (detailElements.title) detailElements.title.textContent = data.title;
    if (detailElements.body) detailElements.body.textContent = data.body;

    if (detailElements.list) {
      const frag = document.createDocumentFragment();
      if (Array.isArray(data.bullets)) {
        data.bullets.forEach((text) => {
          const li = document.createElement('li');
          li.textContent = text;
          frag.appendChild(li);
        });
      }
      detailElements.list.innerHTML = '';
      detailElements.list.appendChild(frag);
    }
  };

  const setAria = (index) => {
    buttons.forEach((btn, i) => {
      const active = i === index;
      btn.setAttribute('aria-selected', active ? 'true' : 'false');
      btn.setAttribute('tabindex', active ? '0' : '-1');
    });
    if (detailCard && buttons[index]) {
      const ids = [buttons[index].id];
      const titleEl = detailElements && detailElements.title ? detailElements.title : null;
      if (titleEl && titleEl.id) ids.push(titleEl.id);
      detailCard.setAttribute('aria-labelledby', ids.join(' '));
    }
  };

  const progressForIndex = (index) => {
    const safeIndex = Math.min(PROGRESS_POINTS.length - 1, Math.max(0, index + 1));
    return PROGRESS_POINTS[safeIndex];
  };

  /* ---------------------------
     Initial active
  --------------------------- */
  let activeIndex = tileNodes.findIndex((t) => t.classList.contains('is-active'));
  if (activeIndex < 0) activeIndex = 0;

  let hasRevealedProgress = false;

  const applyActiveStep = (nextIndex, { focus = false, immediate = false, updateProgress = true } = {}) => {
    if (!buttons.length) return;
    const total = buttons.length;
    const targetIndex = ((nextIndex % total) + total) % total;
    if (activeIndex === targetIndex && !immediate) return;

    activeIndex = targetIndex;

    tileNodes.forEach((tile, idx) => tile.classList.toggle('is-active', idx === targetIndex));
    setAria(targetIndex);

    const slug = slugs[targetIndex];
    updateDetailCard(slug, { animate: !immediate });

    if (updateProgress) {
      // If the track hasn't "revealed" yet, we still want the correct value ready
      const pct = progressForIndex(targetIndex);
      setProgress(pct, { immediate: !hasRevealedProgress || prefersReducedMotion() });
    }

    if (focus && buttons[targetIndex]) buttons[targetIndex].focus();

    debugLog('activated step', slug, 'index', targetIndex);
  };

  // Prime UI
  applyActiveStep(activeIndex, { immediate: true, updateProgress: true });

  /* ---------------------------
     Events (click / keyboard)
  --------------------------- */
  buttons.forEach((button, index) => {
    button.addEventListener('click', () => applyActiveStep(index));
    button.addEventListener('keydown', (event) => {
      if (event.defaultPrevented) return;
      switch (event.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          event.preventDefault();
          applyActiveStep(index + 1, { focus: true });
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          event.preventDefault();
          applyActiveStep(index - 1, { focus: true });
          break;
        case 'Home':
          event.preventDefault();
          applyActiveStep(0, { focus: true });
          break;
        case 'End':
          event.preventDefault();
          applyActiveStep(buttons.length - 1, { focus: true });
          break;
        case 'Enter':
        case ' ':
        case 'Spacebar':
          event.preventDefault();
          applyActiveStep(index);
          break;
        default:
      }
    });
  });

  /* ---------------------------
     Reveal-once (VISIBILITY FIX)
     – we actually add .is-in now
  --------------------------- */
  const revealTargets = Array.from(section.querySelectorAll('[data-reveal]'));
  if (revealTargets.length) {
    const staggerBase = 90; // ms
    if (typeof IntersectionObserver === 'function') {
      const io = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
          if (entry.target !== section) return;
          if (!entry.isIntersecting) return;

          // Mark the section visible (optional CSS can pause/resume twinkle)
          section.classList.add('is-visible');

          // Stagger children
          revealTargets
            .sort((a, b) => {
              const ai = Number(a.getAttribute('data-reveal-index') || 0);
              const bi = Number(b.getAttribute('data-reveal-index') || 0);
              return ai - bi;
            })
            .forEach((el, i) => {
              const idx = Number(el.getAttribute('data-reveal-index') || i);
              const delay = idx * staggerBase;
              setTimeout(() => el.classList.add('is-in'), delay);
            });

          // Consider progress "revealed" once section enters viewport
          hasRevealedProgress = true;
          setProgress(progressForIndex(activeIndex), { immediate: prefersReducedMotion() });

          obs.disconnect();
        });
      }, { threshold: 0.2 });
      io.observe(section);
      debugLog('reveal IO attached');
    } else {
      // Fallback: reveal immediately
      revealTargets.forEach((el) => el.classList.add('is-in'));
      hasRevealedProgress = true;
      setProgress(progressForIndex(activeIndex), { immediate: true });
      debugWarn('IntersectionObserver unavailable; reveal fallback executed');
    }
  } else {
    // No reveal targets; ensure progress isn't stuck
    hasRevealedProgress = true;
    setProgress(progressForIndex(activeIndex), { immediate: true });
    debugWarn('No [data-reveal] targets found; skipping stagger');
  }

  /* ---------------------------
     Progress track observer (kept, but non-blocking)
  --------------------------- */
  if (progressRoot && progressTrack && typeof IntersectionObserver === 'function') {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.target !== progressTrack) return;
        if (!entry.isIntersecting) return;

        hasRevealedProgress = true;
        // Snap to current state on first reveal of the track
        setProgress(progressForIndex(activeIndex), { immediate: true });
        obs.disconnect();
      });
    }, { threshold: 0.1 });
    observer.observe(progressTrack);
    debugLog('progress IO attached');
  } else if (progressRoot) {
    // Ensure progress shows correct value even without IO
    hasRevealedProgress = true;
    setProgress(progressForIndex(activeIndex), { immediate: true });
    if (!progressTrack) debugWarn('progress track missing; used fallback to set value');
    else debugWarn('IO unavailable; used fallback to set value');
  }

  /* ---------------------------
     Reduced-motion change handler
  --------------------------- */
  const handleReduceMotionChange = () => {
    setProgress(progressForIndex(activeIndex), { immediate: true });
  };
  if (reduceMotionQuery) {
    if (typeof reduceMotionQuery.addEventListener === 'function') {
      reduceMotionQuery.addEventListener('change', handleReduceMotionChange);
    } else if (typeof reduceMotionQuery.addListener === 'function') {
      reduceMotionQuery.addListener(handleReduceMotionChange);
    }
  }
};

/* ---------------------------------------------
   Boot
--------------------------------------------- */
const boot = () => {
  try {
    initProcess();
  } catch (err) {
    console.error('[process init]', err);
  }
};

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
}
