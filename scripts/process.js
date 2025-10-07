// SwiftSend — Process section
// Clean reveal + color-synced progress + robust a11y

/* ------------------------------------------
   Step data (hues must match design tokens)
------------------------------------------- */
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
      hue: 210, // blue
    },
    design: {
      num: '02',
      label: 'DESIGN',
      title: 'Design the experience',
      body: 'Flows, prototypes, and system design make the product tangible fast.',
      bullets: ['UX flows + prototypes', 'System design & API contracts', 'Feasibility + fast iterations'],
      hue: 276, // purple
    },
    build: {
      num: '03',
      label: 'BUILD',
      title: 'Ship in integrated sprints',
      body: 'Full-stack teams deliver production-ready slices with QA and automation baked in.',
      bullets: ['Sprint slices to prod', 'Automated testing & CI', 'Observability from day one'],
      hue: 28, // orange
    },
    launch: {
      num: '04',
      label: 'LAUNCH',
      title: 'Launch & optimize',
      body: 'We orchestrate go-live, train teams, and monitor performance to iterate quickly.',
      bullets: ['Go-live & training', 'KPIs & dashboards', 'Continuous optimization'],
      hue: 150, // green
    },
  };
  
  const STEP_ORDER = Object.keys(STEPS);          // ['discover','design','build','launch']
  const PROGRESS_POINTS = [0, 25, 50, 75, 100];   // 0 for pre-reveal, then quarters
  
  /* ------------------------------------------
     Utilities
  ------------------------------------------- */
  const hasWindow = typeof window !== 'undefined';
  const hasDoc = typeof document !== 'undefined';
  
  const safeRaf = hasWindow && typeof window.requestAnimationFrame === 'function'
    ? window.requestAnimationFrame.bind(window)
    : (fn) => setTimeout(fn, 16);
  
  const getDebugEnabled = () => {
    if (!hasWindow) return false;
    try {
      const params = new URLSearchParams(window.location.search);
      return params.get('debug') === '1';
    } catch { return false; }
  };
  const DEBUG_ENABLED = getDebugEnabled();
  const debugLog = (...a) => { if (DEBUG_ENABLED) console.log('[process]', ...a); };
  const debugWarn = (...a) => { if (DEBUG_ENABLED) console.warn('[process]', ...a); };
  
  /* ------------------------------------------
     Main init
  ------------------------------------------- */
  function initProcess() {
    if (!hasDoc) return;
  
    const section = document.querySelector('[data-process-section]');
    if (!section) {
      debugWarn('section not found');
      return;
    }
  
    // Gate reveal styles to JS sessions only.
    document.body.classList.add('is-process-js');
  
    // ===== Reveal Observer (for header, grid, CTA) =====
    const revealTargets = Array.from(section.querySelectorAll('[data-reveal]'));
    const prefersReduced = hasWindow && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
    if (revealTargets.length) {
      if (typeof IntersectionObserver === 'function' && !prefersReduced) {
        const ro = new IntersectionObserver((entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add('is-in');
              // When any first element reveals, start the sweep glow.
              section.classList.add('is-visible');
              ro.unobserve(e.target);
            }
          });
        }, { threshold: 0.18 });
        revealTargets.forEach((el) => ro.observe(el));
      } else {
        // Fallback: show immediately
        revealTargets.forEach((el) => el.classList.add('is-in'));
        section.classList.add('is-visible');
      }
    }
  
    // ===== Elements =====
    const tablist = section.querySelector('[data-process-steps]');
    if (tablist) {
      tablist.setAttribute('role', 'tablist');
      tablist.setAttribute('aria-orientation', 'horizontal');
    }
  
    const tileNodes = Array.from(section.querySelectorAll('[data-process-step]'));
    if (!tileNodes.length) {
      debugWarn('no tiles found');
      return;
    }
  
    const buttons = tileNodes.map((tile, idx) => {
      const btn = tile.querySelector('button, [role="tab"]');
      if (!btn) return null;
      if (btn.tagName === 'BUTTON') btn.type = 'button';
      btn.setAttribute('role', 'tab');
      btn.setAttribute('tabindex', '-1');
      btn.setAttribute('aria-selected', 'false');
      if (!btn.id) btn.id = `process-tab-${idx + 1}`;
      return btn;
    }).filter(Boolean);
  
    const detailCard = section.querySelector('[data-process-detail]');
    const detailEls = detailCard ? {
      badgeNum: detailCard.querySelector('.process-badge-num'),
      badgeLabel: detailCard.querySelector('.process-badge-label'),
      title: detailCard.querySelector('.process-detail-title'),
      body: detailCard.querySelector('.process-detail-body'),
      list: detailCard.querySelector('.process-detail-list'),
    } : null;
  
    if (detailCard) {
      detailCard.setAttribute('role', 'tabpanel');
      detailCard.setAttribute('tabindex', '0');
    }
  
    const progressRoot = section.querySelector('.process__progress');
    const progressFill = progressRoot ? progressRoot.querySelector('[data-process-progress-fill]') : null;
    const progressIndicator = progressRoot ? progressRoot.querySelector('[data-process-progress-indicator]') : null;
    const progressValue = progressRoot ? progressRoot.querySelector('[data-process-progress-value]') : null;
    const progressTrack = progressRoot ? progressRoot.querySelector('[data-process-progress-track]') : null;
  
    // Map tiles → slugs and seed per-tile hue variable
    const slugs = tileNodes.map((tile, index) => {
      const s = tile.getAttribute('data-step');
      const byAttr = s && STEPS[s] ? s : null;
      const byOrder = STEP_ORDER[index] || STEP_ORDER[0];
      const slug = byAttr || byOrder;
      const data = STEPS[slug];
      tile.style.setProperty('--tile-hue', String(data.hue));
      return slug;
    });
  
    // Seed tile text (safety)
    buttons.forEach((btn, idx) => {
      const slug = slugs[idx];
      const data = STEPS[slug];
      const num = btn.querySelector('.process__tileBadge-num');
      const lab = btn.querySelector('.process__tileBadge-label');
      const ttl = btn.querySelector('.process__tileTitle');
      if (num) num.textContent = data.num;
      if (lab) lab.textContent = data.label;
      if (ttl) ttl.textContent = data.title;
    });
  
    // Active index
    let activeIndex = Math.max(0, tileNodes.findIndex((t) => t.classList.contains('is-active')));
    let hasRevealedProgress = false;
  
    // Accent hue on the section (drives progress bar tint via CSS)
    const setAccentHue = (hue) => {
      section.style.setProperty('--accent-hue', String(hue));
    };
  
    // Progress helper
    const setProgress = (percent, { immediate = false } = {}) => {
      if (!progressRoot) return;
      const apply = () => {
        progressRoot.style.setProperty('--process-progress', String(percent));
        if (progressFill) progressFill.style.setProperty('width', `${percent}%`);
        if (progressIndicator) progressIndicator.style.setProperty('left', `${percent}%`);
        if (progressValue) progressValue.textContent = `${percent}%`;
      };
      if (immediate || prefersReduced) {
        apply();
      } else {
        safeRaf(apply); // let CSS transitions animate
      }
    };
  
    const progressForIndex = (index) => {
      const safeIdx = Math.min(PROGRESS_POINTS.length - 1, Math.max(0, index + 1));
      return PROGRESS_POINTS[safeIdx];
    };
  
    // Detail card updater
    const updateDetailCard = (slug, { animate = true } = {}) => {
      if (!detailCard || !detailEls) return;
      const data = STEPS[slug];
      if (!data) return;
  
      if (animate && !prefersReduced) {
        detailCard.classList.remove('is-swapping');
        // reflow to restart animation
        void detailCard.offsetWidth;
        detailCard.classList.add('is-swapping');
      }
  
      STEP_ORDER.forEach((s) => detailCard.classList.remove(`is-${s}`));
      detailCard.classList.add(`is-${slug}`);
      detailCard.style.setProperty('--step-hue', String(data.hue));
  
      if (detailEls.badgeNum) detailEls.badgeNum.textContent = data.num;
      if (detailEls.badgeLabel) detailEls.badgeLabel.textContent = data.label;
      if (detailEls.title) detailEls.title.textContent = data.title;
      if (detailEls.body) detailEls.body.textContent = data.body;
  
      if (detailEls.list) {
        detailEls.list.innerHTML = '';
        if (Array.isArray(data.bullets)) {
          const frag = document.createDocumentFragment();
          data.bullets.forEach((txt) => {
            const li = document.createElement('li');
            li.textContent = txt;
            frag.appendChild(li);
          });
          detailEls.list.appendChild(frag);
        }
      }
    };
  
    // ARIA sync
    const setAria = (index) => {
      buttons.forEach((btn, i) => {
        const on = i === index;
        btn.setAttribute('aria-selected', on ? 'true' : 'false');
        btn.setAttribute('tabindex', on ? '0' : '-1');
        if (on && detailCard) {
          btn.setAttribute('aria-controls', detailCard.id);
        }
      });
  
      if (detailCard && buttons[index]) {
        const ids = [buttons[index].id];
        const t = detailEls && detailEls.title;
        if (t && t.id) ids.push(t.id);
        detailCard.setAttribute('aria-labelledby', ids.join(' '));
      }
    };
  
    // Activate a step
    const applyActiveStep = (nextIndex, { focus = false, immediate = false, updateProgress = true } = {}) => {
      const total = buttons.length;
      const targetIndex = ((nextIndex % total) + total) % total;
      if (activeIndex === targetIndex && !immediate) return;
  
      activeIndex = targetIndex;
  
      tileNodes.forEach((t, idx) => t.classList.toggle('is-active', idx === targetIndex));
      setAria(targetIndex);
  
      const slug = slugs[targetIndex];
      const data = STEPS[slug];
  
      // sync accent hue for progress track
      setAccentHue(data.hue);
  
      updateDetailCard(slug, { animate: !immediate });
  
      if (updateProgress && hasRevealedProgress) {
        setProgress(progressForIndex(targetIndex), { immediate: false });
      }
  
      if (focus) {
        const btn = buttons[targetIndex];
        if (btn) btn.focus();
      }
  
      debugLog('activated', slug, '→', progressForIndex(targetIndex), '%');
    };
  
    // Initial set (no animation for progress until reveal)
    applyActiveStep(activeIndex, { immediate: true, updateProgress: false });
    if (detailCard) updateDetailCard(slugs[activeIndex], { animate: false });
    setAccentHue(STEPS[slugs[activeIndex]].hue);
  
    // Interaction handlers
    buttons.forEach((btn, idx) => {
      btn.addEventListener('click', () => applyActiveStep(idx, { focus: false }));
      btn.addEventListener('keydown', (e) => {
        if (e.defaultPrevented) return;
        switch (e.key) {
          case 'ArrowRight':
          case 'ArrowDown':
            e.preventDefault(); applyActiveStep(idx + 1, { focus: true }); break;
          case 'ArrowLeft':
          case 'ArrowUp':
            e.preventDefault(); applyActiveStep(idx - 1, { focus: true }); break;
          case 'Home':
            e.preventDefault(); applyActiveStep(0, { focus: true }); break;
          case 'End':
            e.preventDefault(); applyActiveStep(buttons.length - 1, { focus: true }); break;
          case 'Enter':
          case ' ':
          case 'Spacebar':
            e.preventDefault(); applyActiveStep(idx); break;
        }
      });
    });
  
    // Progress reveal: animate 0 → active step %
    if (progressRoot && progressTrack) {
      if (typeof IntersectionObserver === 'function') {
        const po = new IntersectionObserver((entries, obs) => {
          const entry = entries.find((e) => e.target === progressTrack);
          if (!entry) return;
          if (entry.isIntersecting && !hasRevealedProgress) {
            hasRevealedProgress = true;
  
            // Tag slower first sweep
            if (!prefersReduced) {
              progressRoot.classList.add('is-revealing');
            }
  
            // Start at 0 immediately, then animate to the step's percent
            setProgress(0, { immediate: true });
            safeRaf(() => setProgress(progressForIndex(activeIndex), { immediate: false }));
  
            // Remove the 'is-revealing' flag after the long sweep ends
            if (!prefersReduced) {
              setTimeout(() => progressRoot.classList.remove('is-revealing'), 1000); // ~4× default (220ms → ~880ms + buffer)
            }
  
            obs.disconnect();
          }
        }, { threshold: 0.35 });
        po.observe(progressTrack);
      } else {
        // Fallback: show final state (no animation)
        hasRevealedProgress = true;
        setProgress(progressForIndex(activeIndex), { immediate: true });
      }
    }
  
    // If user toggles reduced motion, make sure numbers stay correct
    if (hasWindow && window.matchMedia) {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      const onChange = () => {
        if (!hasRevealedProgress) return;
        setProgress(progressForIndex(activeIndex), { immediate: true });
      };
      if (typeof mq.addEventListener === 'function') mq.addEventListener('change', onChange);
      else if (typeof mq.addListener === 'function') mq.addListener(onChange);
    }
  }
  
  /* ------------------------------------------
     Boot
  ------------------------------------------- */
  function boot() {
    try {
      initProcess();
    } catch (err) {
      console.error('[process init]', err);
    }
  }
  
  if (hasDoc) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', boot, { once: true });
    } else {
      boot();
    }
  }