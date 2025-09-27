// FIX: Harden process module with guards, debug hooks, and safe fallbacks
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

const safeRaf =
  typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function'
    ? window.requestAnimationFrame.bind(window)
    : (fn) => setTimeout(fn, 16);

const getDebugEnabled = () => {
  if (typeof window === 'undefined') return false;
  try {
    const params = new URLSearchParams(window.location.search);
    return params.get('debug') === '1';
  } catch (error) {
    return false;
  }
};

const DEBUG_ENABLED = getDebugEnabled();

const debugLog = (...args) => {
  if (!DEBUG_ENABLED) return;
  console.log('[process debug]', ...args);
};

const debugWarn = (...args) => {
  if (!DEBUG_ENABLED) return;
  console.warn('[process debug]', ...args);
};

const reportSelector = (selector, found) => {
  if (!DEBUG_ENABLED) return;
  const logger = found ? debugLog : debugWarn;
  logger(`${found ? 'attached' : 'missing'}: ${selector}`);
};

const ensureBodyClass = (className) => {
  if (typeof document === 'undefined') return false;
  const { body } = document;
  if (!body) return false;
  if (!body.classList.contains(className)) {
    body.classList.add(className);
  }
  return true;
};

if (DEBUG_ENABLED) {
  if (ensureBodyClass('debug')) {
    debugLog('debug mode enabled via query string');
  } else if (typeof document !== 'undefined') {
    document.addEventListener(
      'DOMContentLoaded',
      () => {
        if (ensureBodyClass('debug')) {
          debugLog('debug mode enabled after DOMContentLoaded');
        }
      },
      { once: true },
    );
  }
}

const initProcess = () => {
  if (typeof document === 'undefined') {
    return;
  }

  const section = document.querySelector('[data-process-section]');
  reportSelector('[data-process-section]', Boolean(section));
  if (!section) {
    console.warn('[process] Section root not found.');
    return;
  }

  ensureBodyClass('is-process-js'); // FIX: Gate reveal animations to JS-enabled sessions
  section.classList.add('process--row-top');

  const reduceMotionQuery =
    typeof window !== 'undefined' && typeof window.matchMedia === 'function'
      ? window.matchMedia('(prefers-reduced-motion: reduce)')
      : null;

  const prefersReducedMotion = () => Boolean(reduceMotionQuery && reduceMotionQuery.matches);

  const tablist = section.querySelector('[data-process-steps]');
  reportSelector('[data-process-steps]', Boolean(tablist));
  if (tablist) {
    tablist.setAttribute('role', 'tablist');
    tablist.setAttribute('aria-orientation', 'horizontal');
  } else {
    console.warn('[process] Tablist container not found.');
  }

  const tileNodes = Array.from(section.querySelectorAll('[data-process-step]'));
  reportSelector('[data-process-step]', tileNodes.length > 0);
  if (!tileNodes.length) {
    console.warn('[process] No process tiles found.');
    return;
  }

  const buttons = tileNodes
    .map((tile) => {
      const button = tile.querySelector('button, [role="tab"]');
      reportSelector('button within [data-process-step]', Boolean(button));
      if (!button) {
        console.warn('[process] Tile missing button element.', tile);
        return null;
      }
      return button;
    })
    .filter(Boolean);

  if (!buttons.length) {
    console.warn('[process] No interactive buttons within tiles.');
    return;
  }

  const detailCard = section.querySelector('[data-process-detail]');
  reportSelector('[data-process-detail]', Boolean(detailCard));
  const detailElements = detailCard
    ? {
        badgeNum: detailCard.querySelector('.process-badge-num'),
        badgeLabel: detailCard.querySelector('.process-badge-label'),
        title: detailCard.querySelector('.process-detail-title'),
        body: detailCard.querySelector('.process-detail-body'),
        list: detailCard.querySelector('.process-detail-list'),
      }
    : null;

  if (!detailCard) {
    console.warn('[process] Detail card not found.');
  }

  const progressRoot = section.querySelector('.process__progress');
  reportSelector('.process__progress', Boolean(progressRoot));
  const progressFill = progressRoot ? progressRoot.querySelector('[data-process-progress-fill]') : null;
  reportSelector('[data-process-progress-fill]', Boolean(progressFill));
  const progressIndicator = progressRoot ? progressRoot.querySelector('[data-process-progress-indicator]') : null;
  reportSelector('[data-process-progress-indicator]', Boolean(progressIndicator));
  const progressValue = progressRoot ? progressRoot.querySelector('[data-process-progress-value]') : null;
  reportSelector('[data-process-progress-value]', Boolean(progressValue));

  const setProgress = (percent, { immediate = false } = {}) => {
    if (!progressRoot) {
      return;
    }
    const apply = () => {
      progressRoot.style.setProperty('--process-progress', String(percent));
      if (progressFill) progressFill.style.setProperty('width', `${percent}%`);
      if (progressIndicator) progressIndicator.style.setProperty('left', `${percent}%`);
      if (progressValue) progressValue.textContent = `${percent}%`;
    };
    if (immediate || prefersReducedMotion()) {
      apply();
    } else {
      safeRaf(apply);
    }
  };

  const updateDetailCard = (slug, { animate = true } = {}) => {
    if (!detailCard || !detailElements) {
      return;
    }
    const data = STEPS[slug];
    if (!data) {
      debugWarn(`missing step data for slug: ${slug}`);
      return;
    }

    if (animate && !prefersReducedMotion()) {
      detailCard.classList.remove('is-swapping');
      void detailCard.offsetWidth;
      detailCard.classList.add('is-swapping');
    }

    STEP_ORDER.forEach((step) => detailCard.classList.remove(`is-${step}`));
    detailCard.classList.add(`is-${slug}`);
    detailCard.style.setProperty('--step-hue', String(data.hue));

    if (detailElements.badgeNum) detailElements.badgeNum.textContent = data.num;
    if (detailElements.badgeLabel) detailElements.badgeLabel.textContent = data.label;
    if (detailElements.title) detailElements.title.textContent = data.title;
    if (detailElements.body) detailElements.body.textContent = data.body;
    if (detailElements.list) {
      detailElements.list.innerHTML = '';
      if (Array.isArray(data.bullets)) {
        const frag = document.createDocumentFragment();
        data.bullets.forEach((text) => {
          const item = document.createElement('li');
          item.textContent = text;
          frag.appendChild(item);
        });
        detailElements.list.appendChild(frag);
      }
    }
  };

  const slugForTile = (tile, index) => {
    const stepAttr = tile.getAttribute('data-step');
    if (stepAttr && STEPS[stepAttr]) {
      return stepAttr;
    }
    const button = buttons[index];
    if (button && button.id) {
      const match = button.id.match(/process-step-(.+)$/);
      if (match && STEPS[match[1]]) {
        return match[1];
      }
    }
    return STEP_ORDER[index] || STEP_ORDER[0];
  };

  const slugs = tileNodes.map(slugForTile);

  tileNodes.forEach((tile, index) => {
    tile.classList.add('process__tile');
    const slug = slugs[index];
    const data = STEPS[slug];
    if (data) {
      tile.style.setProperty('--tile-hue', String(data.hue));
    }
  });

  buttons.forEach((button, index) => {
    if (button.tagName === 'BUTTON') {
      button.type = 'button';
    } else {
      button.setAttribute('type', 'button');
    }
    const slug = slugs[index];
    const data = STEPS[slug];
    button.setAttribute('role', 'tab');
    button.setAttribute('tabindex', '-1');
    button.setAttribute('aria-selected', 'false');
    if (!button.id) {
      button.id = `process-tab-${index + 1}`;
    }
    if (data) {
      const badgeNum = button.querySelector('.process__tileBadge-num');
      const badgeLabel = button.querySelector('.process__tileBadge-label');
      const title = button.querySelector('.process__tileTitle');
      if (badgeNum) badgeNum.textContent = data.num;
      if (badgeLabel) badgeLabel.textContent = data.label;
      if (title) title.textContent = data.title;
    }
  });

  if (detailCard) {
    detailCard.setAttribute('role', 'tabpanel');
    detailCard.setAttribute('tabindex', '0');
  }

  let activeIndex = tileNodes.findIndex((tile) => tile.classList.contains('is-active'));
  if (activeIndex < 0) {
    activeIndex = 0;
  }
  debugLog('initial active index', activeIndex);

  const setAria = (index) => {
    buttons.forEach((button, idx) => {
      const isActive = idx === index;
      button.setAttribute('aria-selected', isActive ? 'true' : 'false');
      button.setAttribute('tabindex', isActive ? '0' : '-1');
      if (isActive && detailCard) {
        button.setAttribute('aria-controls', detailCard.id);
      }
    });
    if (detailCard && buttons[index]) {
      const labelIds = [buttons[index].id];
      const titleEl = detailElements && detailElements.title ? detailElements.title : null;
      if (titleEl && titleEl.id) {
        labelIds.push(titleEl.id);
      }
      detailCard.setAttribute('aria-labelledby', labelIds.join(' '));
    }
  };

  const progressForIndex = (index) => {
    const safeIndex = Math.min(PROGRESS_POINTS.length - 1, Math.max(0, index + 1));
    return PROGRESS_POINTS[safeIndex];
  };

  let hasRevealedProgress = false;

  const applyActiveStep = (nextIndex, { focus = false, immediate = false, updateProgress = true } = {}) => {
    if (!buttons.length) {
      return;
    }
    const total = buttons.length;
    const targetIndex = ((nextIndex % total) + total) % total;
    if (activeIndex === targetIndex && !immediate) {
      return;
    }

    activeIndex = targetIndex;
    tileNodes.forEach((tile, idx) => {
      tile.classList.toggle('is-active', idx === targetIndex);
    });

    setAria(targetIndex);

    const slug = slugs[targetIndex];
    updateDetailCard(slug, { animate: !immediate });

    if (updateProgress && hasRevealedProgress) {
      setProgress(progressForIndex(targetIndex));
    }

    if (focus && buttons[targetIndex]) {
      buttons[targetIndex].focus();
    }

    debugLog('activated step', slug, 'index', targetIndex);
  };

  applyActiveStep(activeIndex, { immediate: true, updateProgress: false });

  const activateFromEvent = (index) => {
    applyActiveStep(index, { focus: false });
  };

  buttons.forEach((button, index) => {
    button.addEventListener('click', () => activateFromEvent(index));
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

  const progressTrack = progressRoot ? progressRoot.querySelector('[data-process-progress-track]') : null;
  reportSelector('[data-process-progress-track]', Boolean(progressTrack));

  if (progressRoot && progressTrack && typeof IntersectionObserver === 'function') {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.target !== progressTrack) return;
          if (entry.isIntersecting && !hasRevealedProgress) {
            hasRevealedProgress = true;
            setProgress(0, { immediate: true });
            safeRaf(() => setProgress(progressForIndex(activeIndex)));
            obs.disconnect();
          }
        });
      },
      { threshold: 0.4 },
    );
    observer.observe(progressTrack);
    debugLog('IntersectionObserver attached to progress track');
  } else if (progressRoot) {
    hasRevealedProgress = true;
    if (!progressTrack) {
      debugWarn('progress track missing; skipping reveal observer');
    } else {
      debugWarn('IntersectionObserver unavailable; skipping reveal observer');
    }
    setProgress(0, { immediate: true }); // FIX: Guarantee fallback shows 0% before progress updates
    safeRaf(() => setProgress(progressForIndex(activeIndex), { immediate: true }));
  } else {
    debugWarn('progress root missing; progress updates skipped');
  }

  if (detailCard) {
    const slug = slugs[activeIndex];
    updateDetailCard(slug, { animate: false });
  }

  const handleReduceMotionChange = () => {
    if (!hasRevealedProgress) return;
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

const boot = () => {
  try {
    initProcess();
  } catch (error) {
    console.error('[process init]', error);
  }
};

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
}
