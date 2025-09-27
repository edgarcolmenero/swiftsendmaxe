(() => {
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

  const PROGRESS_STATES = [0, 25, 50, 75, 100];
  const STEP_ORDER = Object.keys(STEPS);

  const initProcess = () => {
    const section = document.querySelector('[data-process-section]');
    if (!section) return;

    section.classList.add('process--row-top');

    const reduceMotionQuery = typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)')
      : { matches: false, addEventListener: () => {}, removeEventListener: () => {} };
    const prefersReducedMotion = () => Boolean(reduceMotionQuery.matches);

    const tablist = section.querySelector('[data-process-steps]');
    if (!tablist) {
      console.warn('[process] Tablist container not found.');
    } else {
      tablist.setAttribute('role', 'tablist');
      tablist.setAttribute('aria-orientation', 'horizontal');
    }

    const tiles = Array.from(section.querySelectorAll('[data-process-step]'));
    if (!tiles.length) {
      console.warn('[process] No process tiles found.');
      return;
    }

    const buttons = tiles
      .map((tile) => {
        const button = tile.querySelector('button, [role="tab"]');
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
    if (!detailCard) {
      console.warn('[process] Detail card not found.');
    }

    const detailElements = detailCard
      ? {
          badgeNum: detailCard.querySelector('.process-badge-num'),
          badgeLabel: detailCard.querySelector('.process-badge-label'),
          title: detailCard.querySelector('.process-detail-title'),
          body: detailCard.querySelector('.process-detail-body'),
          list: detailCard.querySelector('.process-detail-list'),
        }
      : null;

    const progressRoot = section.querySelector('.process__progress');
    const progressFill = section.querySelector('[data-process-progress-fill]');
    const progressIndicator = section.querySelector('[data-process-progress-indicator]');
    const progressValue = section.querySelector('[data-process-progress-value]');

    const setProgress = (percent, { immediate = false } = {}) => {
      if (!progressRoot) return;
      const apply = () => {
        progressRoot.style.setProperty('--process-progress', String(percent));
        if (progressFill) progressFill.style.setProperty('width', `${percent}%`);
        if (progressIndicator) progressIndicator.style.setProperty('left', `${percent}%`);
        if (progressValue) progressValue.textContent = `${percent}%`;
      };
      if (immediate || prefersReducedMotion()) {
        apply();
      } else {
        window.requestAnimationFrame(apply);
      }
    };

    const updateDetailCard = (slug, { animate = true } = {}) => {
      if (!detailCard || !detailElements) return;
      const data = STEPS[slug];
      if (!data) return;

      if (animate && !prefersReducedMotion()) {
        detailCard.classList.remove('is-swapping');
        void detailCard.offsetWidth;
        detailCard.classList.add('is-swapping');
      }

      detailCard.classList.remove(
        ...STEP_ORDER.map((step) => `is-${step}`)
      );
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
      if (stepAttr && STEPS[stepAttr]) return stepAttr;
      const button = buttons[index];
      if (button && button.id) {
        const match = button.id.match(/process-step-(.+)$/);
        if (match && STEPS[match[1]]) return match[1];
      }
      return STEP_ORDER[index] || STEP_ORDER[0];
    };

    const slugs = tiles.map(slugForTile);

    tiles.forEach((tile, index) => {
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
      if (!button.id) button.id = `process-tab-${index + 1}`;
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

    let activeIndex = tiles.findIndex((tile) => tile.classList.contains('is-active'));
    if (activeIndex < 0) activeIndex = 0;

    const setAria = (index) => {
      buttons.forEach((button, idx) => {
        const isActive = idx === index;
        button.setAttribute('aria-selected', isActive ? 'true' : 'false');
        button.setAttribute('tabindex', isActive ? '0' : '-1');
        if (isActive) {
          button.setAttribute('aria-controls', detailCard ? detailCard.id : button.getAttribute('aria-controls') || '');
        }
      });
      if (detailCard && buttons[index]) {
        const labelIds = [buttons[index].id];
        const titleEl = detailElements && detailElements.title ? detailElements.title : null;
        if (titleEl && titleEl.id) labelIds.push(titleEl.id);
        detailCard.setAttribute('aria-labelledby', labelIds.join(' '));
      }
    };

    const setProgressState = (index, { immediate = false } = {}) => {
      const progress = PROGRESS_STATES[index + 1] ?? PROGRESS_STATES[0];
      setProgress(progress, { immediate });
    };

    let hasRevealedProgress = false;

    const applyActiveStep = (nextIndex, { focus = false, immediate = false, updateProgress = true } = {}) => {
      if (!buttons.length) return;
      const total = buttons.length;
      const targetIndex = ((nextIndex % total) + total) % total;
      if (activeIndex === targetIndex && !immediate) return;

      activeIndex = targetIndex;
      tiles.forEach((tile, idx) => {
        tile.classList.toggle('is-active', idx === targetIndex);
      });

      setAria(targetIndex);

      const slug = slugs[targetIndex];
      updateDetailCard(slug, { animate: !immediate });

      if (updateProgress && hasRevealedProgress) {
        setProgressState(targetIndex);
      }

      if (focus && buttons[targetIndex]) {
        buttons[targetIndex].focus();
      }
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
          case 'Spacebar': {
            event.preventDefault();
            applyActiveStep(index);
            break;
          }
          default:
        }
      });
    });

    const progressTrack = section.querySelector('[data-process-progress-track]');
    if (progressTrack && typeof IntersectionObserver === 'function') {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.target !== progressTrack) return;
          if (entry.isIntersecting && !hasRevealedProgress) {
            hasRevealedProgress = true;
            setProgress(0, { immediate: true });
            window.requestAnimationFrame(() => setProgressState(activeIndex));
            observer.disconnect();
          }
        });
      }, { threshold: 0.4 });
      observer.observe(progressTrack);
    } else {
      hasRevealedProgress = true;
      setProgressState(activeIndex, { immediate: true });
    }

    if (detailCard) {
      const slug = slugs[activeIndex];
      updateDetailCard(slug, { animate: false });
    }

    if (typeof reduceMotionQuery.addEventListener === 'function') {
      reduceMotionQuery.addEventListener('change', () => {
        if (!hasRevealedProgress) return;
        setProgressState(activeIndex, { immediate: true });
      });
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProcess, { once: true });
  } else {
    initProcess();
  }
})();
